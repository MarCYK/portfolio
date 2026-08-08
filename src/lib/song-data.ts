import { IMPORTED_NOTES } from './song-data-notes';

// Row count: Math.max(12, Math.floor(baseY / 28)).
// No upper cap — rows scale with viewport height, like the reference.
export const MIN_ROWS = 12;
export const TARGET_ROW_SPACING = 28;

// Interactive plucking maps each row to a major pentatonic degree,
// Range and snap algorithm mirror the reference.
export const PENA_INTERVALS = [0, 2, 4, 7, 9];
export const INTERACTIVE_MIDI_LO = 48;
export const INTERACTIVE_MIDI_HI = 84;

// --- "Where Is My Mind" sequencer ---
export const SOURCE_BPM = 80;
// 16th-note duration in ms at SOURCE_BPM.
export const MS_PER_UNIT = 60000 / SOURCE_BPM / 4;
export const SONG_MIDI_LO = 37;
export const SONG_MIDI_HI = 95;
// Loop pause after the last note, matching the reference's 1500ms gap.
const SONG_TAIL_GAP_MS = 3000;

export function computeRows(drawableHeight: number): number {
  // updateRowCount: max(12, floor(baseY / 28)).
  // No upper cap — rows grow with viewport.
  return Math.max(MIN_ROWS, Math.floor(drawableHeight / TARGET_ROW_SPACING));
}

// Maps a row index to a MIDI pitch by snapping linearly across
// [INTERACTIVE_MIDI_LO, INTERACTIVE_MIDI_HI] to the nearest major
// pentatonic degree. Row 0 (top of canvas) is the lowest pitch,
// i=0 maps to midiLo.
export function rowToMidi(rowIndex: number, totalRows: number): number {
  const t = totalRows > 1 ? rowIndex / (totalRows - 1) : 0.5;
  const rawMidi = INTERACTIVE_MIDI_LO + t * (INTERACTIVE_MIDI_HI - INTERACTIVE_MIDI_LO);
  const semis = Math.round(rawMidi) - INTERACTIVE_MIDI_LO;
  const octSemis = ((semis % 12) + 12) % 12;
  let best = PENA_INTERVALS[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const p of PENA_INTERVALS) {
    const d = Math.abs(octSemis - p);
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  const snapped = INTERACTIVE_MIDI_LO + Math.floor(semis / 12) * 12 + best;
  return Math.max(INTERACTIVE_MIDI_LO, Math.min(INTERACTIVE_MIDI_HI, snapped));
}

export function rowToNote(rowIndex: number, totalRows: number): string {
  return midiToName(rowToMidi(rowIndex, totalRows));
}

// Maps a sequencer MIDI pitch to a row using the reference's margin-
// bounded inverted mapping: low pitch lands near the bottom margin,
// high pitch near the top margin.
export function rowForMidi(midi: number, totalRows: number): number {
  const t = (midi - SONG_MIDI_LO) / (SONG_MIDI_HI - SONG_MIDI_LO);
  const clamped = Math.max(0, Math.min(1, t));
  const margin = Math.floor(totalRows * 0.12);
  const usable = totalRows - 1 - margin * 2;
  return margin + Math.round((1 - clamped) * usable);
}

// Volume shaping songNotes build: base 1.4x, melody
// (midi>=60) boosted 1.2x, bass (midi<48) cut to 0.75x.
export function shapeVolume(midi: number, rawVelocity: number): number {
  let vol = rawVelocity * 1.4;
  if (midi >= 60) vol *= 1.2;
  if (midi < 48) vol *= 0.75;
  return vol;
}

// Runtime note tuple: [absMs, midi, durSec, vol]. Matches the reference
// songNotes layout so callers can destructure positionally.
export type SongNote = [number, number, number, number];

// Converts a raw IMPORTED_NOTES tuple [timeUnit, midi, durUnits, vel]
// to runtime form [absMs, midi, durSec, vol].
export function convertSongNote(note: [number, number, number, number]): SongNote {
  const [timeUnit, midi, durUnits, vel] = note;
  const absMs = timeUnit * MS_PER_UNIT;
  const durSec = Math.max(0.1, (durUnits * MS_PER_UNIT) / 1000);
  const vol = shapeVolume(midi, vel);
  return [absMs, midi, durSec, vol];
}

// Pre-converted runtime note stream, sorted by absolute ms.
export const songNotes: SongNote[] = IMPORTED_NOTES.map(convertSongNote);

export const SONG_DURATION_MS =
  songNotes.length > 0 ? songNotes[songNotes.length - 1][0] + SONG_TAIL_GAP_MS : 0;

export function midiToName(midi: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  return notes[midi % 12] + octave;
}
