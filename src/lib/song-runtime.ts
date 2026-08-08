// Per-song runtime computation. Where song-data.ts holds layout + interactive
// helpers that are the same for every song, this module computes the things
// that depend on the currently selected song's bpm and pitch range.
import type { Song } from './songs';
import { shapeVolume } from './song-data';

export type SongNote = [number, number, number, number];

// ms per 16th-note step at the song's tempo.
export function msPerUnit(song: Pick<Song, 'bpm'>): number {
  return 60000 / song.bpm / 4;
}

// Converts a raw note tuple [timeUnit, midi, durUnits, vel] to runtime form
// [absMs, midi, durSec, vol] using the song's tempo.
export function convertSongNote(
  song: Pick<Song, 'bpm'>,
  note: [number, number, number, number],
): SongNote {
  const [timeUnit, midi, durUnits, vel] = note;
  const ms = msPerUnit(song);
  const absMs = timeUnit * ms;
  const durSec = Math.max(0.1, (durUnits * ms) / 1000);
  const vol = shapeVolume(midi, vel);
  return [absMs, midi, durSec, vol];
}

// Maps a sequencer MIDI pitch to a canvas row using the song's pitch range:
// low pitch near the bottom margin, high pitch near the top margin.
export function rowForMidi(song: Pick<Song, 'midiLo' | 'midiHi'>, midi: number, totalRows: number): number {
  const t = (midi - song.midiLo) / (song.midiHi - song.midiLo);
  const clamped = Math.max(0, Math.min(1, t));
  const margin = Math.floor(totalRows * 0.12);
  const usable = totalRows - 1 - margin * 2;
  return margin + Math.round((1 - clamped) * usable);
}

// Loop pause after the last note. Matches the reference's tail gap.
const SONG_TAIL_GAP_MS = 3000;

export interface SongRuntime {
  songNotes: SongNote[];
  durationMs: number;
}

// Pre-converts a song's raw notes into the runtime note stream and computes the
// total loop duration. Call once when a song is selected; the engine reads the
// result each frame.
export function buildSongRuntime(song: Song): SongRuntime {
  const songNotes = song.notes.map((n) => convertSongNote(song, n));
  const durationMs =
    songNotes.length > 0 ? songNotes[songNotes.length - 1][0] + SONG_TAIL_GAP_MS : 0;
  return { songNotes, durationMs };
}
