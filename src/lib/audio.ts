import type { Player } from 'soundfont-player';
import { rowToNote } from './song-data';

export interface AudioState {
  audioCtx: AudioContext | null;
  player: Player | null;
  soundEnabled: boolean;
}

export function readSoundPreference(): boolean {
  try {
    const stored = localStorage.getItem('sound');
    if (stored === 'off' || stored === 'disabled') return false;
    return true;
  } catch {
    return true;
  }
}

export function createAudioState(): AudioState {
  return {
    audioCtx: null,
    player: null,
    soundEnabled: readSoundPreference(),
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

export function playNote(state: AudioState, rowIndex: number, velocity = 0.8, totalRows = 30): void {
  if (!state.player || !state.soundEnabled || !state.audioCtx) return;
  const note = rowToNote(rowIndex, totalRows);
  try {
    state.player.play(note, state.audioCtx.currentTime, { duration: 0.6, gain: velocity });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Note playback failed:', error);
    }
  }
}
