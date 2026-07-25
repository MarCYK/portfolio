import {
  songNotes,
  SONG_DURATION_MS,
  rowForMidi,
  midiToName,
  computeRows,
  MIN_ROWS,
} from './song-data';
import type { AudioState } from './audio';
import { mixRgb, toRgba, tryParseHex, type Rgb } from './color-math';
import { computeNoise } from './wave-noise';
import { sunsetRowColor } from './sunset-color';
import { musicNoteColor } from './note-color';

export type { Rgb } from './color-math';

const LINE_STROKE_WIDTH = 1;
const HOVER_STROKE_WIDTH = 1.5;

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

// Paint value per row matches zchry.org: hex color string, the literal
// "default" for monochrome band, or null when unpainted.
export type RowPaint = string | 'default' | null;

export interface CanvasState {
  rows: number;
  energy: Float32Array;
  rowGlow: Float32Array;
  rowColors: RowPaint[];
  rowMidi: number[];
  rowNoteEnd: number[];
  strokeColor: string;
  bgColor: string;
  theme: CanvasTheme;
  sunsetStrength: number;
  hoverRow: number;
  paintColor: string;
  musicPlaying: boolean;
  musicStartTime: number;
  lastMusicElapsed: number;
  seqStep: number;
}

export function createCanvasState(theme: CanvasTheme = 'dark', rows: number = MIN_ROWS): CanvasState {
  const defaults = getDefaultCanvasColors(theme);
  return {
    rows,
    energy: new Float32Array(rows),
    rowGlow: new Float32Array(rows),
    rowColors: new Array(rows).fill(null),
    rowMidi: new Array(rows).fill(0),
    rowNoteEnd: new Array(rows).fill(0),
    strokeColor: defaults.strokeColor,
    bgColor: defaults.bgColor,
    theme,
    sunsetStrength: 0,
    hoverRow: -1,
    paintColor: '',
    musicPlaying: false,
    musicStartTime: 0,
    lastMusicElapsed: -1,
    seqStep: 0,
  };
}

export function updateRows(state: CanvasState, rows: number): void {
  state.rows = rows;
  state.energy = new Float32Array(rows);
  state.rowGlow = new Float32Array(rows);
  state.rowColors = new Array(rows).fill(null);
  state.rowMidi = new Array(rows).fill(0);
  state.rowNoteEnd = new Array(rows).fill(0);
}

const SONG_DURATION_SEC = SONG_DURATION_MS / 1000;
const LOOP_GAP_SEC = 1.5;

// Plays due notes from the "Where Is My Mind" arrangement. Audio-clock-
// locked for zero drift. Matches zchry.org seqFrame: collision nudge
// when two notes share a row, and energy bleed to neighbouring rows.
export function tickMusic(state: CanvasState, audio: AudioState, onNote?: (note: string) => void): void {
  if (!state.musicPlaying || !audio.audioCtx) return;
  const elapsed = audio.audioCtx.currentTime - state.musicStartTime;

  if (elapsed >= SONG_DURATION_SEC) {
    state.seqStep = 0;
    state.lastMusicElapsed = elapsed + LOOP_GAP_SEC;
    state.musicStartTime = audio.audioCtx.currentTime + LOOP_GAP_SEC;
    return;
  }

  const tickUsed = new Set<number>();
  while (state.seqStep < songNotes.length) {
    const [absMs, midi, durSec, vol] = songNotes[state.seqStep];
    const noteTimeSec = absMs / 1000;
    if (noteTimeSec > elapsed) break;

    const midiNote = midiToName(midi);
    if (audio.player) {
      try {
        audio.player.play(midiNote, audio.audioCtx.currentTime, { duration: durSec, gain: vol });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Sequencer playback failed:', error);
        }
      }
    }
    onNote?.(midiNote);

    // Collision nudge: if two notes map to the same row this tick, push
    // to an adjacent free row so every note stays visually distinct.
    let row = rowForMidi(midi, state.rows);
    if (tickUsed.has(row)) {
      if (row > 0 && !tickUsed.has(row - 1)) row -= 1;
      else if (row < state.rows - 1 && !tickUsed.has(row + 1)) row += 1;
    }
    tickUsed.add(row);

    state.energy[row] = Math.min(state.energy[row] + vol, 2.0);
    state.rowGlow[row] = Math.min(state.rowGlow[row] + 0.8, 1.0);
    state.rowMidi[row] = midi;
    state.rowNoteEnd[row] = Math.max(state.rowNoteEnd[row], audio.audioCtx.currentTime + durSec);

    // Energy bleed to neighbouring rows, matching the reference.
    if (row > 0) {
      state.energy[row - 1] = Math.min(state.energy[row - 1] + vol * 0.3, 2.0);
      state.rowGlow[row - 1] = Math.min(state.rowGlow[row - 1] + 0.3, 1.0);
      if (!state.rowMidi[row - 1]) state.rowMidi[row - 1] = midi;
      state.rowNoteEnd[row - 1] = Math.max(state.rowNoteEnd[row - 1], audio.audioCtx.currentTime + durSec);
    }
    if (row < state.rows - 1) {
      state.energy[row + 1] = Math.min(state.energy[row + 1] + vol * 0.3, 2.0);
      state.rowGlow[row + 1] = Math.min(state.rowGlow[row + 1] + 0.3, 1.0);
      if (!state.rowMidi[row + 1]) state.rowMidi[row + 1] = midi;
      state.rowNoteEnd[row + 1] = Math.max(state.rowNoteEnd[row + 1], audio.audioCtx.currentTime + durSec);
    }

    state.seqStep += 1;
  }

  state.lastMusicElapsed = elapsed;
}

function getEdgePow(width: number): number {
  if (width < 640) return 1.5;
  if (width < 1024) return 3;
  if (width > 1800) return 7;
  return 5;
}

function rgbaTuple(rgb: Rgb, alpha: number): string {
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha.toFixed(3)})`;
}

// drawFrame mirrors zchry.org's draw() function. The caller passes the
// current performance.now() so time advances at real-time rate (0.0003x),
// independent of frame rate. Reference values are reproduced exactly.
export function drawFrame(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  state: CanvasState,
  audio: AudioState,
  onNote?: (note: string) => void,
  nowMs: number = 0,
): void {
  const width = canvas.width;
  const height = canvas.height;
  const rows = state.rows;
  const rowSpacing = height / rows;
  const fillExtend = rowSpacing * 3;
  const fillBottom = height + fillExtend;
  const maxAmpBase = width < 640 ? width * 0.14 : Math.min(width, height) * 0.12;
  const edgePow = getEdgePow(width);
  const isDark = state.theme === 'dark';
  const time = nowMs * 0.0003;
  const sunset = state.sunsetStrength;

  // Decay energy + glow each frame, with cross-row bleed.
  for (let i = 0; i < rows; i += 1) {
    state.energy[i] *= 0.96;
    state.rowGlow[i] *= 0.92;
    if (i > 0) state.energy[i - 1] += state.energy[i] * 0.015;
    if (i < rows - 1) state.energy[i + 1] += state.energy[i] * 0.015;
  }

  ctx.clearRect(0, 0, width, height);

  // Background: solid theme color, OR solid sunset top color (the per-row
  // sunset fills stack on top via the ridge fills).
  const bgColor = sunset > 0.01
    ? `rgb(${sunsetRowColor(0).join(',')})`
    : state.bgColor;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const pointStride = state.musicPlaying ? 5 : 7;
  const steps = Math.ceil(width / pointStride);

  // Pre-allocate path buffers (matches zchry.org ptsX/ptsY Float64Array).
  const ptsX = new Float64Array(steps + 1);
  const ptsY = new Float64Array(steps + 1);

  for (let r = 0; r < rows; r += 1) {
    const lineY = (r + 1) * rowSpacing;
    const rowT = rows > 1 ? r / (rows - 1) : 0.5;
    const verticalDist = Math.abs(rowT - 0.5) * 2;
    const verticalMult = Math.pow(Math.max(0, 1 - verticalDist * 1.6), 2);
    const rowIntensity = verticalMult;
    const topFade = r < 20 ? r / 20 : 1;

    const rc = state.rowColors[r];
    const isChordRow = state.rowGlow[r] > 0.01 && state.rowMidi[r] > 0;
    const energy = state.energy[r] || 0;
    let maxAmp = maxAmpBase * verticalMult;
    if (isChordRow) {
      maxAmp = maxAmp * (1 + energy * 0.3);
    }
    const isMouseHover = r === state.hoverRow && rc === null;
    const isHover = (r === state.hoverRow || isChordRow) && rc === null;

    let rowAmp = 0;
    const ptsLen = steps + 1;

    for (let s = 0; s <= steps; s += 1) {
      const t = s / steps;
      const x = t * width;
      const edgeFade = Math.pow(Math.sin(t * Math.PI), edgePow);
      const noise = computeNoise(t, r, time);
      const amp = noise * edgeFade * maxAmp;
      if (amp > rowAmp) rowAmp = amp;
      ptsX[s] = x;
      ptsY[s] = lineY - amp;
    }

    // Base ridge fill: bg color OR sunset per-row color.
    ctx.beginPath();
    ctx.moveTo(ptsX[0], ptsY[0]);
    for (let s = 1; s < ptsLen; s += 1) ctx.lineTo(ptsX[s], ptsY[s]);
    ctx.lineTo(width, lineY + fillExtend);
    ctx.lineTo(0, lineY + fillExtend);
    ctx.closePath();
    if (sunset > 0.01) {
      const sc = sunsetRowColor(rowT);
      ctx.fillStyle = `rgba(${sc[0]},${sc[1]},${sc[2]},${sunset.toFixed(3)})`;
    } else {
      ctx.fillStyle = state.bgColor;
    }
    ctx.fill();

    // Paint fill: only when the wave is actually peaking (rowAmp > 1).
    // Uses a vertical gradient that fades to transparent, matching zchry.
    if (rc !== null && rc !== 'default' && rowAmp > 1) {
      const parsed = tryParseHex(rc);
      if (parsed) {
        const cAlpha = rowIntensity * 0.6;
        ctx.beginPath();
        ctx.moveTo(ptsX[0], ptsY[0]);
        for (let s = 1; s < ptsLen; s += 1) ctx.lineTo(ptsX[s], ptsY[s]);
        ctx.lineTo(width, lineY + fillExtend);
        ctx.lineTo(0, lineY + fillExtend);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, lineY, 0, lineY + fillExtend);
        const prefix = `rgba(${parsed.r},${parsed.g},${parsed.b},`;
        grad.addColorStop(0, prefix + cAlpha.toFixed(3) + ')');
        grad.addColorStop(1, prefix + '0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }
    } else if (rc === 'default' && rowAmp > 1) {
      const dAlpha = rowIntensity * 0.6;
      ctx.beginPath();
      ctx.moveTo(ptsX[0], ptsY[0]);
      for (let s = 1; s < ptsLen; s += 1) ctx.lineTo(ptsX[s], ptsY[s]);
      ctx.lineTo(width, lineY + fillExtend);
      ctx.lineTo(0, lineY + fillExtend);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, lineY, 0, lineY + fillExtend);
      const prefix = isDark ? 'rgba(255,255,255,' : 'rgba(0,0,0,';
      grad.addColorStop(0, prefix + dAlpha.toFixed(4) + ')');
      grad.addColorStop(1, prefix + '0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Chord/seq row: tinted fill using musicNoteColor.
    if (isChordRow && energy > 0.01) {
      const noteMidi = state.rowMidi[r] || 60;
      const noteColor = musicNoteColor(noteMidi, isDark);
      const noteAlpha = isDark
        ? Math.min(0.42, energy * 0.28)
        : Math.min(0.34, energy * 0.23);
      ctx.beginPath();
      ctx.moveTo(ptsX[0], ptsY[0]);
      for (let s = 1; s < ptsLen; s += 1) ctx.lineTo(ptsX[s], ptsY[s]);
      ctx.lineTo(width, lineY + fillExtend);
      ctx.lineTo(0, lineY + fillExtend);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, lineY, 0, lineY + fillExtend);
      const prefix = `rgba(${noteColor[0]},${noteColor[1]},${noteColor[2]},`;
      grad.addColorStop(0, prefix + noteAlpha.toFixed(3) + ')');
      grad.addColorStop(1, prefix + '0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Stroke: hover/chord rows get thicker (1.5px), others 1px. Color
    // depends on sunset, mouse hover with paint color, plain hover, default.
    if (sunset > 0.01) {
      const ssc = sunsetRowColor(rowT);
      const strokeR = Math.min(255, ssc[0] + 40);
      const strokeG = Math.min(255, ssc[1] + 30);
      const strokeB = Math.min(255, ssc[2] + 20);
      const sAlpha = topFade * sunset;
      if (isHover || isChordRow) {
        ctx.strokeStyle = `rgba(${strokeR},${strokeG},${strokeB},${(sAlpha * 0.9).toFixed(3)})`;
        ctx.lineWidth = HOVER_STROKE_WIDTH;
      } else {
        ctx.strokeStyle = `rgba(${strokeR},${strokeG},${strokeB},${(sAlpha * 0.6).toFixed(3)})`;
        ctx.lineWidth = LINE_STROKE_WIDTH;
      }
    } else if (isMouseHover) {
      const paintColor = state.paintColor;
      if (paintColor) {
        const rgb = tryParseHex(paintColor);
        if (rgb) {
          ctx.strokeStyle = rgbaTuple(rgb, 0.8 * topFade);
        } else {
          ctx.strokeStyle = isDark ? rgbaTuple({ r: 255, g: 255, b: 255 }, 0.9 * topFade)
                                   : rgbaTuple({ r: 0, g: 0, b: 0 }, 0.9 * topFade);
        }
      } else {
        ctx.strokeStyle = isDark ? rgbaTuple({ r: 255, g: 255, b: 255 }, 0.9 * topFade)
                                 : rgbaTuple({ r: 0, g: 0, b: 0 }, 0.9 * topFade);
      }
      ctx.lineWidth = HOVER_STROKE_WIDTH;
    } else if (isHover || isChordRow) {
      ctx.strokeStyle = isDark ? rgbaTuple({ r: 255, g: 255, b: 255 }, 0.9 * topFade)
                               : rgbaTuple({ r: 0, g: 0, b: 0 }, 0.9 * topFade);
      ctx.lineWidth = HOVER_STROKE_WIDTH;
    } else {
      ctx.strokeStyle = isDark
        ? rgbaTuple({ r: 255, g: 255, b: 255 }, topFade)
        : rgbaTuple({ r: 0, g: 0, b: 0 }, topFade);
      ctx.lineWidth = LINE_STROKE_WIDTH;
    }

    ctx.beginPath();
    ctx.moveTo(ptsX[0], ptsY[0]);
    for (let s = 1; s < ptsLen; s += 1) ctx.lineTo(ptsX[s], ptsY[s]);
    ctx.stroke();
  }

  if (state.musicPlaying) tickMusic(state, audio, onNote);
}

// Maps a Y coordinate to a row. Matches zchry.org getRowFromY: no header
// offset, rows span the full height.
export function getRowAtY(canvasHeight: number, clientY: number, rows: number): number {
  if (clientY < 0) return -1;
  const rowSpacing = canvasHeight / rows;
  if (rowSpacing <= 0) return -1;
  const mapped = Math.floor(clientY / rowSpacing);
  return Math.min(rows - 1, Math.max(0, mapped));
}

// Re-exports for callers that previously imported these from canvas-engine.
export { computeRows };
