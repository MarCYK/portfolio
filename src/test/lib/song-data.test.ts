import { test, expect, describe } from 'bun:test';
import {
  rowToNote,
  rowToMidi,
  midiToName,
  PENA_INTERVALS,
  INTERACTIVE_MIDI_LO,
  INTERACTIVE_MIDI_HI,
  computeRows,
  MIN_ROWS,
  TARGET_ROW_SPACING,
  SOURCE_BPM,
  MS_PER_UNIT,
  SONG_MIDI_LO,
  SONG_MIDI_HI,
  SONG_DURATION_MS,
  shapeVolume,
  rowForMidi,
  convertSongNote,
  songNotes,
} from '../../lib/song-data';
import { IMPORTED_NOTES } from '../../lib/song-data-notes';

describe('003: interactive note mapping (pentatonic, reference-matched)', () => {
  test('PENA_INTERVALS is the major pentatonic scale degrees [0,2,4,7,9]', () => {
    expect(PENA_INTERVALS).toEqual([0, 2, 4, 7, 9]);
  });

  test('INTERACTIVE range matches reference MIDI 48-84', () => {
    expect(INTERACTIVE_MIDI_LO).toBe(48);
    expect(INTERACTIVE_MIDI_HI).toBe(84);
  });

  test('MIN_ROWS matches reference floor of 12', () => {
    // zchry.org: Math.max(12, Math.floor(baseY / 28))
    expect(MIN_ROWS).toBe(12);
  });

  test('TARGET_ROW_SPACING matches reference divisor of 28', () => {
    expect(TARGET_ROW_SPACING).toBe(28);
  });

  test('computeRows: floor(height / 28) on a typical desktop height', () => {
    // 900 / 28 = 32.14 -> 32 rows
    expect(computeRows(900)).toBe(32);
  });

  test('computeRows: hits MIN_ROWS floor at small heights', () => {
    expect(computeRows(0)).toBe(MIN_ROWS);
    expect(computeRows(100)).toBe(MIN_ROWS);
    expect(computeRows(28 * MIN_ROWS)).toBe(MIN_ROWS);
  });

  test('computeRows: scales linearly with height (no MAX cap)', () => {
    // Reference has no MAX. Rows grow with viewport.
    expect(computeRows(28 * 50)).toBe(50);
    expect(computeRows(2800)).toBe(100);
  });

  test('rowToMidi: top row (row 0) = lowest pitch, bottom row = highest pitch (matches reference)', () => {
    const rows = 30;
    const top = rowToMidi(0, rows);
    const bottom = rowToMidi(rows - 1, rows);
    expect(top).toBeLessThan(bottom);
  });

  test('rowToMidi: every result snaps to a pentatonic degree within range', () => {
    const rows = 30;
    for (let r = 0; r < rows; r++) {
      const midi = rowToMidi(r, rows);
      const pc = midi % 12;
      expect(PENA_INTERVALS).toContain(pc);
      expect(midi).toBeGreaterThanOrEqual(INTERACTIVE_MIDI_LO);
      expect(midi).toBeLessThanOrEqual(INTERACTIVE_MIDI_HI);
    }
  });

  test('rowToNote: consistent with rowToMidi + midiToName', () => {
    const midi = rowToMidi(15, 30);
    expect(rowToNote(15, 30)).toBe(midiToName(midi));
  });

  test('rowToMidi: monotonically non-decreasing top (row 0) to bottom (matches reference)', () => {
    const rows = 30;
    let prev = rowToMidi(0, rows);
    for (let r = 1; r < rows; r++) {
      const cur = rowToMidi(r, rows);
      expect(cur).toBeGreaterThanOrEqual(prev);
      prev = cur;
    }
  });

  test('rowToMidi: clamps totalRows=1 safely', () => {
    const m = rowToMidi(0, 1);
    expect(m).toBeGreaterThanOrEqual(INTERACTIVE_MIDI_LO);
    expect(m).toBeLessThanOrEqual(INTERACTIVE_MIDI_HI);
  });

  test('rowToMidi: edge at MIN_ROWS stays in range', () => {
    const midi = rowToMidi(MIN_ROWS - 1, MIN_ROWS);
    expect(midi).toBeLessThanOrEqual(INTERACTIVE_MIDI_HI);
    expect(midi).toBeGreaterThanOrEqual(INTERACTIVE_MIDI_LO);
  });
});

describe('005: imported sequencer data (format invariants, song-agnostic)', () => {
  test('IMPORTED_NOTES is a non-empty array of 4-tuples', () => {
    expect(IMPORTED_NOTES.length).toBeGreaterThan(0);
    for (const note of IMPORTED_NOTES) {
      expect(Array.isArray(note)).toBe(true);
      expect(note.length).toBe(4);
      for (const v of note) expect(typeof v).toBe('number');
    }
  });

  test('every tuple is [timeUnit, midi, dur, vel] with dur>=1 and vel in (0,1]', () => {
    for (const [timeUnit, midi, dur, vel] of IMPORTED_NOTES) {
      expect(timeUnit).toBeGreaterThanOrEqual(0);
      expect(midi).toBeGreaterThanOrEqual(0);
      expect(midi).toBeLessThanOrEqual(127);
      expect(dur).toBeGreaterThanOrEqual(1);
      expect(vel).toBeGreaterThan(0);
      expect(vel).toBeLessThanOrEqual(1);
    }
  });

  test('IMPORTED_NOTES is sorted ascending by start step', () => {
    for (let i = 1; i < IMPORTED_NOTES.length; i++) {
      expect(IMPORTED_NOTES[i][0]).toBeGreaterThanOrEqual(IMPORTED_NOTES[i - 1][0]);
    }
  });

  test('SOURCE_BPM is 80', () => {
    expect(SOURCE_BPM).toBe(80);
  });

  test('MS_PER_UNIT is a 16th note at 80 BPM (187.5ms)', () => {
    expect(MS_PER_UNIT).toBe(60000 / 80 / 4);
    expect(MS_PER_UNIT).toBe(187.5);
  });

  test('SONG_MIDI range matches reference 37-95', () => {
    expect(SONG_MIDI_LO).toBe(37);
    expect(SONG_MIDI_HI).toBe(95);
  });

  test('shapeVolume: base multiplier is 1.4 for mid-range (48<=midi<60)', () => {
    // midi 55: not bass (<48), not melody (>=60) — base only
    expect(shapeVolume(55, 1.0)).toBeCloseTo(1.4, 5);
  });

  test('shapeVolume: melody (midi>=60) boosted by 1.2x', () => {
    const v60 = shapeVolume(60, 1.0);
    const v72 = shapeVolume(72, 1.0);
    expect(v60).toBeCloseTo(1.4 * 1.2, 5);
    expect(v72).toBeCloseTo(1.4 * 1.2, 5);
  });

  test('shapeVolume: bass (midi<48) cut by 0.75x', () => {
    const v = shapeVolume(40, 1.0);
    expect(v).toBeCloseTo(1.4 * 0.75, 5);
  });

  test('shapeVolume: raw velocity scales linearly', () => {
    expect(shapeVolume(55, 0.5)).toBeCloseTo(0.5 * 1.4, 5);
  });

  test('rowForMidi: low midi maps near bottom, high midi near top (inverted)', () => {
    const rows = 30;
    const lowRow = rowForMidi(SONG_MIDI_LO, rows);
    const highRow = rowForMidi(SONG_MIDI_HI, rows);
    expect(lowRow).toBeGreaterThan(highRow);
  });

  test('rowForMidi: stays within margin-bounded range', () => {
    const rows = 30;
    const margin = Math.floor(rows * 0.12);
    for (let m = SONG_MIDI_LO; m <= SONG_MIDI_HI; m++) {
      const r = rowForMidi(m, rows);
      expect(r).toBeGreaterThanOrEqual(margin);
      expect(r).toBeLessThanOrEqual(rows - 1 - margin);
    }
  });

  test('rowForMidi: clamps out-of-range midi', () => {
    const rows = 30;
    const margin = Math.floor(rows * 0.12);
    expect(rowForMidi(0, rows)).toBeGreaterThanOrEqual(margin);
    expect(rowForMidi(200, rows)).toBeLessThanOrEqual(rows - 1 - margin);
  });

  test('convertSongNote: time in ms = timeUnit * MS_PER_UNIT', () => {
    const [absMs, midi, durSec, vol] = convertSongNote([10, 60, 2, 1]);
    expect(absMs).toBe(10 * MS_PER_UNIT);
    expect(midi).toBe(60);
    expect(vol).toBe(shapeVolume(60, 1));
  });

  test('convertSongNote: duration converts to seconds with floor 0.1', () => {
    const [, , durSec] = convertSongNote([0, 60, 2, 1]);
    expect(durSec).toBeCloseTo((2 * MS_PER_UNIT) / 1000, 5);
    const [, , shortDur] = convertSongNote([0, 60, 0.1, 1]);
    expect(shortDur).toBeGreaterThanOrEqual(0.1);
  });

  test('songNotes: length equals IMPORTED_NOTES length', () => {
    expect(songNotes.length).toBe(IMPORTED_NOTES.length);
  });

  test('songNotes: sorted ascending by absolute ms', () => {
    for (let i = 1; i < songNotes.length; i++) {
      expect(songNotes[i][0]).toBeGreaterThanOrEqual(songNotes[i - 1][0]);
    }
  });

  test('SONG_DURATION_MS: extends past last note (loop gap)', () => {
    const lastMs = songNotes[songNotes.length - 1][0];
    expect(SONG_DURATION_MS).toBeGreaterThan(lastMs);
  });
});
