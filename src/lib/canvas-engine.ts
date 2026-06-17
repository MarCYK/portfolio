import { MAX_ROWS, MIDI_NOTES, SONG_DURATION, midiPitchToRow, midiToName, computeRows } from './song-data';
import type { AudioState } from './audio';
import { canvasEvents } from './canvas-events';

const SUNSET_BACKGROUND_STOPS = [
  '#ffefaf',
  '#f2dea0',
  '#f4c46a',
  '#f39f3e',
  '#ef6b2f',
  '#d74846',
  '#b63760',
  '#922e6f',
  '#6f276a',
  '#4d1f5b',
  '#200e3b',
];

const SUNSET_RIDGE_STOPS = [
  '#f39f3e',
  '#ef6b2f',
  '#d74846',
  '#c63d56',
  '#a93464',
  '#852d68',
  '#63265f',
  '#4d1f5b',
  '#37184f',
];

const HEADER_HEIGHT_PX = 52;
const LINE_STROKE_WIDTH = 1;
const TOP_FADE_MIN = 0.18;

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function sampleGradient(stops: string[], t: number): Rgb {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (stops.length - 1);
  const index = Math.floor(scaled);
  const localT = scaled - index;
  const start = hexToRgb(stops[index]);
  const end = hexToRgb(stops[Math.min(index + 1, stops.length - 1)]);

  return {
    r: Math.round(lerp(start.r, end.r, localT)),
    g: Math.round(lerp(start.g, end.g, localT)),
    b: Math.round(lerp(start.b, end.b, localT)),
  };
}

function mixRgb(base: Rgb, highlight: Rgb, amount: number): Rgb {
  const clamped = Math.min(1, Math.max(0, amount));
  return {
    r: Math.round(lerp(base.r, highlight.r, clamped)),
    g: Math.round(lerp(base.g, highlight.g, clamped)),
    b: Math.round(lerp(base.b, highlight.b, clamped)),
  };
}

function toRgba(rgb: Rgb, alpha: number): string {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export type CanvasTheme = 'dark' | 'light';

export function getDefaultCanvasColors(theme: CanvasTheme): { bgColor: string; strokeColor: string } {
  if (theme === 'light') {
    return {
      bgColor: '#ffffff',
      strokeColor: 'rgba(23, 23, 23, 0.78)',
    };
  }

  return {
    bgColor: '#0a0a0a',
    strokeColor: 'rgba(255, 255, 255, 0.85)',
  };
}

export interface CanvasState {
  rows: number;
  energy: Float32Array;
  rowGlow: Float32Array;
  rowPaintMask: Uint8Array;
  rowPaintR: Uint8Array;
  rowPaintG: Uint8Array;
  rowPaintB: Uint8Array;
  timeOffset: number;
  strokeColor: string;
  bgColor: string;
  theme: CanvasTheme;
  customStrokeColor: string | null;
  sunsetMode: boolean;
  musicPlaying: boolean;
  musicStartTime: number;
  lastMusicElapsed: number;
  spokenMode: boolean;
  spokenLevel: number;
}

export function createCanvasState(theme: CanvasTheme = 'dark', rows: number = MAX_ROWS): CanvasState {
  const defaults = getDefaultCanvasColors(theme);

  return {
    rows,
    energy: new Float32Array(rows),
    rowGlow: new Float32Array(rows),
    rowPaintMask: new Uint8Array(rows),
    rowPaintR: new Uint8Array(rows),
    rowPaintG: new Uint8Array(rows),
    rowPaintB: new Uint8Array(rows),
    timeOffset: 0,
    strokeColor: defaults.strokeColor,
    bgColor: defaults.bgColor,
    theme,
    customStrokeColor: null,
    sunsetMode: false,
    musicPlaying: false,
    musicStartTime: 0,
    lastMusicElapsed: -1,
    spokenMode: false,
    spokenLevel: 0,
  };
}

export function updateRows(state: CanvasState, rows: number): void {
  if (state.rows === rows) {
    state.energy.fill(0);
    state.rowGlow.fill(0);
    state.rowPaintMask.fill(0);
    state.rowPaintR.fill(0);
    state.rowPaintG.fill(0);
    state.rowPaintB.fill(0);
    return;
  }
  state.rows = rows;
  state.energy = new Float32Array(rows);
  state.rowGlow = new Float32Array(rows);
  state.rowPaintMask = new Uint8Array(rows);
  state.rowPaintR = new Uint8Array(rows);
  state.rowPaintG = new Uint8Array(rows);
  state.rowPaintB = new Uint8Array(rows);
}

export function tickMusic(state: CanvasState, audio: AudioState): void {
  if (!state.musicPlaying || !audio.audioCtx) return;
  const elapsed = (audio.audioCtx.currentTime - state.musicStartTime) % SONG_DURATION;

  for (const [noteTime, midiPitch, velocity] of MIDI_NOTES) {
    if (noteTime <= elapsed && noteTime > state.lastMusicElapsed) {
      const midiNote = midiToName(midiPitch);
      if (audio.player) {
        try {
          audio.player.play(midiNote, audio.audioCtx.currentTime, { duration: 0.5, gain: velocity });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Sequencer playback failed:', error);
          }
        }
      }
      canvasEvents.emit('notePlayed', { note: midiNote });
      const rowIndex = midiPitchToRow(midiPitch, state.rows);
      state.energy[rowIndex] = Math.min(state.energy[rowIndex] + velocity * 1.5, 4);
      state.rowGlow[rowIndex] = Math.min(state.rowGlow[rowIndex] + 0.8, 1.0);
    }
  }

  state.lastMusicElapsed = elapsed;
}

export function drawFrame(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  state: CanvasState,
  audio: AudioState,
): void {
  const width = canvas.width;
  const height = canvas.height;
  const drawableHeight = Math.max(0, height - HEADER_HEIGHT_PX);
  const rows = state.rows;
  const rowSpacing = drawableHeight / rows;
  const fillExtend = rowSpacing * 3;
  const fillBottom = height + fillExtend;
  const maxAmpBase = width < 640 ? width * 0.2 : Math.min(width, height) * 0.17;
  const edgePow = width < 640 ? 1.5 : width < 1024 ? 3 : width > 1800 ? 7 : 5;
  const defaults = state.sunsetMode
    ? { bgColor: '#fff8e8', strokeColor: 'rgba(80, 40, 0, 0.85)' }
    : getDefaultCanvasColors(state.theme);

  state.bgColor = defaults.bgColor;
  state.strokeColor = defaults.strokeColor;

  for (let index = 0; index < rows; index += 1) {
    state.energy[index] *= 0.96;
    state.rowGlow[index] *= 0.92;
    if (index > 0) state.energy[index - 1] += state.energy[index] * 0.015;
    if (index < rows - 1) state.energy[index + 1] += state.energy[index] * 0.015;
  }

  if (state.spokenMode) {
    const spokenBoost = Math.max(0, Math.min(1, state.spokenLevel));
    const centerRow = Math.floor(rows * 0.55);

    for (let offset = -2; offset <= 2; offset += 1) {
      const row = centerRow + offset;
      if (row < 0 || row >= rows) continue;
      const falloff = 1 - Math.abs(offset) * 0.22;
      state.energy[row] = Math.min(state.energy[row] + spokenBoost * 0.38 * falloff, 4);
      state.rowGlow[row] = Math.min(state.rowGlow[row] + spokenBoost * 0.2 * falloff, 1);
    }
  }

  ctx.clearRect(0, 0, width, height);

  if (state.sunsetMode) {
    const stripeCount = 34;
    ctx.fillStyle = '#fffac8';
    ctx.fillRect(0, 0, width, HEADER_HEIGHT_PX);

    const stripeHeight = Math.max(1, drawableHeight / stripeCount);
    for (let stripe = 0; stripe < stripeCount; stripe += 1) {
      const stripeT = stripeCount > 1 ? stripe / (stripeCount - 1) : 0;
      const stripeColor = sampleGradient(SUNSET_BACKGROUND_STOPS, stripeT);
      ctx.fillStyle = toRgba(stripeColor, 1);
      ctx.fillRect(0, HEADER_HEIGHT_PX + stripe * stripeHeight, width, stripeHeight + 1);
    }
  } else {
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  const steps = Math.ceil(width / 3);
  const time = state.timeOffset;

  for (let row = 0; row < rows; row += 1) {
    const lineY = HEADER_HEIGHT_PX + (row + 1) * rowSpacing;
    const rowT = rows > 1 ? row / (rows - 1) : 0.5;
    const topFade = TOP_FADE_MIN + (1 - TOP_FADE_MIN) * Math.pow(rowT, 0.88);
    const verticalDist = Math.abs(rowT - 0.5) * 2;
    const verticalMult = Math.pow(Math.max(0, 1 - verticalDist * 1.45), 1.7);
    const maxAmp = maxAmpBase * verticalMult * (1 + state.energy[row] * 0.85);

    const pointsX: number[] = [];
    const pointsY: number[] = [];

    for (let step = 0; step <= steps; step += 1) {
      const nx = step / steps;
      const x = nx * width;
      const edgeFade = Math.pow(Math.sin(nx * Math.PI), edgePow);

      let noise = 0;
      noise += Math.sin(nx * 15 + row * 0.9 + time * 1.7) * 0.16;
      noise += Math.sin(nx * 33 + row * 1.6 + time * 2.4) * 0.13;
      noise += Math.sin(nx * 70 + row * 2.5 + time * 0.8) * 0.08;
      noise += Math.sin(nx * 120 + row * 3.1 + time * 1.4) * 0.05;
      noise += Math.sin(nx * 8 + row * 0.4 + time * 1.15) * 0.22;
      noise += Math.max(0, Math.sin(nx * 22 + row * 1.2 + time * 1.8) - 0.2) * 1.3;
      noise += Math.max(0, Math.sin(nx * 45 + row * 2 + time * 1.25) - 0.35) * 0.95;
      noise += Math.max(0, Math.sin(nx * 11 + row * 0.35 + time * 2.1) - 0.3) * 1.05;
      noise += Math.max(0, Math.sin(nx * 65 + row * 2.8 + time * 0.95) - 0.5) * 0.6;

      const rowPulse = 0.92 + 0.25 * Math.sin(time * 3.2 + row * 0.35);
      const amp = noise * edgeFade * maxAmp * rowPulse;
      pointsX.push(x);
      pointsY.push(lineY - amp);
    }

    ctx.beginPath();
    ctx.moveTo(pointsX[0], pointsY[0]);
    for (let step = 1; step <= steps; step += 1) ctx.lineTo(pointsX[step], pointsY[step]);
    ctx.lineTo(width, lineY + fillExtend);
    ctx.lineTo(0, lineY + fillExtend);
    ctx.closePath();

    const sunsetFillBase = sampleGradient(SUNSET_RIDGE_STOPS, rowT);
    const sunsetFillAlpha = 0.95 - rowT * 0.2;
    ctx.fillStyle = state.sunsetMode ? toRgba(sunsetFillBase, sunsetFillAlpha) : state.bgColor;
    ctx.fill();

    const isPaintedRow = !state.sunsetMode && state.rowPaintMask[row] === 1;
    if (isPaintedRow) {
      const rowPaintRgb: Rgb = {
        r: state.rowPaintR[row],
        g: state.rowPaintG[row],
        b: state.rowPaintB[row],
      };
      const fillAlpha = (state.theme === 'dark' ? 0.72 : 0.82) * topFade;
      ctx.fillStyle = toRgba(rowPaintRgb, fillAlpha);
      ctx.fill();
    }

    // Monochrome fill when row is plucked
    const glow = state.rowGlow[row];
    const middleBandRadius = 0.28;
    const bandDistance = Math.abs(rowT - 0.5);
    const middleBand = bandDistance <= middleBandRadius;
    if (glow > 0.01 && middleBand) {
      const bandFade = Math.max(0, 1 - bandDistance / middleBandRadius);
      const fade = Math.pow(bandFade, 1.8);

      ctx.beginPath();
      ctx.moveTo(pointsX[0], pointsY[0]);
      for (let step = 1; step <= steps; step += 1) ctx.lineTo(pointsX[step], pointsY[step]);
      ctx.lineTo(width, fillBottom);
      ctx.lineTo(0, fillBottom);
      ctx.closePath();

      if (state.sunsetMode) {
        const sunsetGlow = sampleGradient(SUNSET_RIDGE_STOPS, rowT);
        const boostedGlow = mixRgb(sunsetGlow, { r: 255, g: 222, b: 140 }, 0.32 + fade * 0.25);
        const alpha = glow * (0.08 + fade * 0.3);
        ctx.fillStyle = toRgba(boostedGlow, alpha);
      } else if (state.rowPaintMask[row] === 1) {
        const rowPaintRgb: Rgb = {
          r: state.rowPaintR[row],
          g: state.rowPaintG[row],
          b: state.rowPaintB[row],
        };
        const boostedGlow = mixRgb(rowPaintRgb, { r: 255, g: 255, b: 255 }, 0.24 + fade * 0.28);
        const alpha = glow * (0.1 + fade * 0.28) * topFade;
        ctx.fillStyle = toRgba(boostedGlow, alpha);
      } else {
        const alpha = glow * (state.theme === 'dark' ? 0.14 + fade * 0.5 : 0.08 + fade * 0.26);
        const lightness = state.theme === 'dark'
          ? 14 + fade * 68
          : 12 + fade * 42;
        ctx.fillStyle = `hsla(0, 0%, ${lightness}%, ${alpha})`;
      }

      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(pointsX[0], pointsY[0]);
    for (let step = 1; step <= steps; step += 1) ctx.lineTo(pointsX[step], pointsY[step]);

    let rowStroke = state.strokeColor;
    if (state.sunsetMode) {
      const ridgeStrokeBase = sampleGradient(SUNSET_RIDGE_STOPS, rowT);
      const ridgeStroke = mixRgb(ridgeStrokeBase, { r: 255, g: 255, b: 255 }, 0.14);
      rowStroke = toRgba(ridgeStroke, 0.42);
    }
    if (!state.sunsetMode && state.rowPaintMask[row] === 1) {
      const rowPaintRgb: Rgb = {
        r: state.rowPaintR[row],
        g: state.rowPaintG[row],
        b: state.rowPaintB[row],
      };
      rowStroke = toRgba(rowPaintRgb, 0.9);
    }

    ctx.save();
    ctx.globalAlpha = topFade;
    ctx.strokeStyle = rowStroke;
    ctx.lineWidth = LINE_STROKE_WIDTH;
    ctx.stroke();
    ctx.restore();
  }

  state.timeOffset += 0.003;

  if (state.musicPlaying) tickMusic(state, audio);
}

export function getRowAtY(canvasHeight: number, clientY: number, rows: number): number {
  if (clientY < HEADER_HEIGHT_PX) return -1;
  const rowSpacing = Math.max(0, canvasHeight - HEADER_HEIGHT_PX) / rows;
  if (rowSpacing <= 0) return -1;
  const mapped = Math.floor((clientY - HEADER_HEIGHT_PX) / rowSpacing);
  return Math.min(rows - 1, Math.max(0, mapped));
}
