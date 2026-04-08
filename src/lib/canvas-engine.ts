import { ROWS, MIDI_NOTES, SONG_DURATION, midiPitchToRow, midiToName } from './song-data';
import type { AudioState } from './audio';

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
  energy: Float32Array;
  timeOffset: number;
  strokeColor: string;
  bgColor: string;
  theme: CanvasTheme;
  customStrokeColor: string | null;
  discoMode: boolean;
  discoHue: number;
  sunsetMode: boolean;
  musicPlaying: boolean;
  musicStartTime: number;
  lastMusicElapsed: number;
}

export function createCanvasState(theme: CanvasTheme = 'dark'): CanvasState {
  const defaults = getDefaultCanvasColors(theme);

  return {
    energy: new Float32Array(ROWS),
    timeOffset: 0,
    strokeColor: defaults.strokeColor,
    bgColor: defaults.bgColor,
    theme,
    customStrokeColor: null,
    discoMode: false,
    discoHue: 0,
    sunsetMode: false,
    musicPlaying: false,
    musicStartTime: 0,
    lastMusicElapsed: -1,
  };
}

export function tickMusic(state: CanvasState, audio: AudioState): void {
  if (!state.musicPlaying || !audio.audioCtx) return;
  const elapsed = (audio.audioCtx.currentTime - state.musicStartTime) % SONG_DURATION;

  for (const [noteTime, midiPitch, velocity] of MIDI_NOTES) {
    if (noteTime <= elapsed && noteTime > state.lastMusicElapsed) {
      if (audio.player) {
        const midiNote = midiToName(midiPitch);
        try {
          audio.player.play(midiNote, audio.audioCtx.currentTime, { duration: 0.5, gain: velocity });
        } catch {
          // Ignore playback errors during loop scheduling.
        }
      }
      const rowIndex = midiPitchToRow(midiPitch);
      state.energy[rowIndex] = Math.min(state.energy[rowIndex] + velocity * 1.5, 4);
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
  const baseY = height;
  const rowSpacing = baseY / ROWS;
  const fillExtend = rowSpacing * 3;
  const maxAmpBase = width < 640 ? width * 0.14 : Math.min(width, height) * 0.12;
  const edgePow = width < 640 ? 1.5 : width < 1024 ? 3 : width > 1800 ? 7 : 5;
  const defaults = state.sunsetMode
    ? { bgColor: '#fff8e8', strokeColor: 'rgba(80, 40, 0, 0.85)' }
    : getDefaultCanvasColors(state.theme);

  state.bgColor = defaults.bgColor;

  if (state.discoMode) {
    state.discoHue = (state.discoHue + 0.8) % 360;
    state.strokeColor = state.sunsetMode ? `hsl(${state.discoHue}, 80%, 35%)` : `hsl(${state.discoHue}, 100%, 70%)`;
  } else if (state.customStrokeColor) {
    state.strokeColor = state.customStrokeColor;
  } else {
    state.strokeColor = defaults.strokeColor;
  }

  for (let index = 0; index < ROWS; index += 1) {
    state.energy[index] *= 0.96;
    if (index > 0) state.energy[index - 1] += state.energy[index] * 0.015;
    if (index < ROWS - 1) state.energy[index + 1] += state.energy[index] * 0.015;
  }

  ctx.clearRect(0, 0, width, height);

  const steps = Math.ceil(width / 3);
  const time = state.timeOffset;

  for (let row = 0; row < ROWS; row += 1) {
    const lineY = (row + 1) * rowSpacing;
    const rowT = ROWS > 1 ? row / (ROWS - 1) : 0.5;
    const verticalDist = Math.abs(rowT - 0.5) * 2;
    const verticalMult = Math.pow(Math.max(0, 1 - verticalDist * 1.6), 2);
    const maxAmp = maxAmpBase * verticalMult * (1 + state.energy[row] * 0.5);

    const pointsX: number[] = [];
    const pointsY: number[] = [];

    for (let step = 0; step <= steps; step += 1) {
      const nx = step / steps;
      const x = nx * width;
      const edgeFade = Math.pow(Math.sin(nx * Math.PI), edgePow);

      let noise = 0;
      noise += Math.sin(nx * 15 + row * 0.9 + time) * 0.2;
      noise += Math.sin(nx * 33 + row * 1.6 + time * 1.5) * 0.15;
      noise += Math.sin(nx * 70 + row * 2.5 + time * 0.3) * 0.1;
      noise += Math.sin(nx * 120 + row * 3.1 + time * 0.7) * 0.06;
      noise += Math.sin(nx * 8 + row * 0.4 + time * 0.6) * 0.25;
      noise += Math.max(0, Math.sin(nx * 22 + row * 1.2 + time) - 0.2) * 1.6;
      noise += Math.max(0, Math.sin(nx * 45 + row * 2 + time * 0.7) - 0.35) * 1.2;
      noise += Math.max(0, Math.sin(nx * 11 + row * 0.35 + time * 1.3) - 0.3) * 1.3;
      noise += Math.max(0, Math.sin(nx * 65 + row * 2.8 + time * 0.5) - 0.5) * 0.7;

      const amp = noise * edgeFade * maxAmp;
      pointsX.push(x);
      pointsY.push(lineY - amp);
    }

    ctx.beginPath();
    ctx.moveTo(pointsX[0], pointsY[0]);
    for (let step = 1; step <= steps; step += 1) ctx.lineTo(pointsX[step], pointsY[step]);
    ctx.lineTo(width, lineY + fillExtend);
    ctx.lineTo(0, lineY + fillExtend);
    ctx.closePath();
    ctx.fillStyle = state.bgColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pointsX[0], pointsY[0]);
    for (let step = 1; step <= steps; step += 1) ctx.lineTo(pointsX[step], pointsY[step]);
    ctx.strokeStyle = state.strokeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  state.timeOffset += 0.004;

  if (state.musicPlaying) tickMusic(state, audio);
}

export function getRowAtY(canvasHeight: number, clientY: number): number {
  const rowSpacing = canvasHeight / ROWS;
  return Math.floor(clientY / rowSpacing);
}
