export const MAX_ROWS = 48;
export const MIN_ROWS = 16;
export const TARGET_ROW_SPACING = 24;

// Interactive plucking maps each row to a major pentatonic degree,
// matching zchry.org. Range and snap algorithm mirror the reference.
export const PENA_INTERVALS = [0, 2, 4, 7, 9];
export const INTERACTIVE_MIDI_LO = 48;
export const INTERACTIVE_MIDI_HI = 84;

/** [beatTime, midiPitch, velocity] */
export const MIDI_NOTES: [number, number, number][] = [
  [0.0, 64, 0.7], [0.0, 52, 0.4], [0.75, 62, 0.7], [0.75, 50, 0.4],
  [1.5, 60, 0.7], [1.5, 48, 0.4], [2.25, 59, 0.65], [3.0, 57, 0.7], [3.0, 45, 0.4],
  [3.75, 55, 0.65], [4.5, 57, 0.7], [5.25, 59, 0.65], [6.0, 60, 0.75], [6.0, 48, 0.4],
  [6.75, 62, 0.7], [7.5, 64, 0.75], [8.25, 62, 0.7], [9.0, 60, 0.7], [9.0, 48, 0.4],
  [9.75, 59, 0.65], [10.5, 57, 0.7], [10.5, 45, 0.4], [11.25, 55, 0.65],
  [12.0, 52, 0.7], [12.0, 40, 0.4], [12.75, 54, 0.65], [13.5, 55, 0.7],
  [14.25, 57, 0.65], [15.0, 59, 0.7], [15.0, 47, 0.4], [15.75, 57, 0.65],
  [16.5, 55, 0.7], [17.25, 54, 0.65], [18.0, 52, 0.75], [18.0, 40, 0.4],
  [18.75, 54, 0.7], [19.5, 55, 0.7], [20.25, 57, 0.65], [21.0, 59, 0.7], [21.0, 47, 0.4],
  [21.75, 60, 0.7], [22.5, 62, 0.75], [23.25, 64, 0.8], [24.0, 62, 0.7], [24.0, 50, 0.4],
  [24.75, 60, 0.7], [25.5, 59, 0.65], [26.25, 57, 0.65], [27.0, 55, 0.7], [27.0, 43, 0.4],
  [27.75, 54, 0.65], [28.5, 52, 0.7], [29.25, 50, 0.65], [30.0, 52, 0.7], [30.0, 40, 0.4],
  [30.75, 54, 0.65], [31.5, 55, 0.7], [32.25, 57, 0.65], [33.0, 59, 0.7], [33.0, 47, 0.4],
  [33.75, 60, 0.7], [34.5, 62, 0.7], [35.25, 60, 0.65], [36.0, 59, 0.7], [36.0, 47, 0.4],
  [36.75, 57, 0.65], [37.5, 55, 0.7], [38.25, 54, 0.65], [39.0, 52, 0.7], [39.0, 40, 0.4],
];

export const SONG_DURATION = 40;

export function computeRows(drawableHeight: number): number {
  const idealRows = Math.floor(drawableHeight / TARGET_ROW_SPACING);
  return Math.max(MIN_ROWS, Math.min(MAX_ROWS, idealRows));
}

// Maps a row index to a MIDI pitch by snapping linearly across
// [INTERACTIVE_MIDI_LO, INTERACTIVE_MIDI_HI] to the nearest major
// pentatonic degree. Row 0 (top of canvas) is the lowest pitch,
// matching zchry.org where i=0 maps to midiLo.
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

export function midiPitchToRow(midi: number, totalRows: number): number {
  const normalized = Math.max(0, Math.min(1, (midi - 48) / 48));
  return Math.floor((1 - normalized) * (totalRows - 1));
}

export function midiToName(midi: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  return notes[midi % 12] + octave;
}
