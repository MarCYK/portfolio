// Layout and interactive helpers shared by every song. Per-song runtime
// computation (tempo, pitch-range mapping, the note stream) lives in
// song-runtime.ts and takes a Song argument.

// Row count: Math.max(12, Math.floor(baseY / 28)).
// No upper cap — rows scale with viewport height, like the reference.
export const MIN_ROWS = 12;
export const TARGET_ROW_SPACING = 28;

// Interactive plucking maps each row to a major pentatonic degree,
// Range and snap algorithm mirror the reference.
export const PENA_INTERVALS = [0, 2, 4, 7, 9];
export const INTERACTIVE_MIDI_LO = 48;
export const INTERACTIVE_MIDI_HI = 84;

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

// Volume shaping: base 1.4x, melody (midi>=60) boosted 1.2x,
// bass (midi<48) cut to 0.75x. Same curve for every song.
export function shapeVolume(midi: number, rawVelocity: number): number {
  let vol = rawVelocity * 1.4;
  if (midi >= 60) vol *= 1.2;
  if (midi < 48) vol *= 0.75;
  return vol;
}

export function midiToName(midi: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  return notes[midi % 12] + octave;
}
