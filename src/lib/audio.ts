import type { Player } from 'soundfont-player';
import { rowToNote } from './song-data';
import { PLUCK_VELOCITY, PLUCK_DURATION } from './pluck';
import { readPreference } from './storage';

export interface AudioState {
  audioCtx: AudioContext | null;
  player: Player | null;
  soundEnabled: boolean;
}

export function readSoundPreference(): boolean {
  const stored = readPreference('sound');
  if (stored === 'off' || stored === 'disabled') return false;
  return true;
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

// playRowNote: fixed velocity 1.0, duration 0.5s.
export function playNote(
  state: AudioState,
  rowIndex: number,
  velocity = PLUCK_VELOCITY,
  totalRows = 30,
  duration = PLUCK_DURATION,
): void {
  if (!state.player || !state.soundEnabled || !state.audioCtx) return;
  const note = rowToNote(rowIndex, totalRows);
  try {
    state.player.play(note, state.audioCtx.currentTime, { duration, gain: velocity });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Note playback failed:', error);
    }
  }
}
