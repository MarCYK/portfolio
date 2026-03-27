import { rowToNote } from './song-data';

interface Player {
  play(note: string, time: number, options?: { duration?: number; gain?: number }): void;
}

export interface AudioState {
  audioCtx: AudioContext | null;
  player: Player | null;
  soundEnabled: boolean;
}

export function createAudioState(): AudioState {
  return {
    audioCtx: null,
    player: null,
    soundEnabled: localStorage.getItem('sound') !== 'disabled',
  };
}

export async function initAudio(state: AudioState): Promise<void> {
  if (state.audioCtx) return;
  state.audioCtx = new AudioContext();
  try {
    const Soundfont = (await import('soundfont-player')).default;
    state.player = await Soundfont.instrument(state.audioCtx, 'acoustic_grand_piano', {
      soundfont: 'MusyngKite',
    });
  } catch (error) {
    console.warn('Audio init failed:', error);
  }
}

export function playNote(state: AudioState, rowIndex: number, velocity = 0.8): void {
  if (!state.player || !state.soundEnabled || !state.audioCtx) return;
  const note = rowToNote(rowIndex);
  try {
    state.player.play(note, state.audioCtx.currentTime, { duration: 0.6, gain: velocity });
  } catch {
    // Ignore playback errors from user-agent audio restrictions.
  }
}
