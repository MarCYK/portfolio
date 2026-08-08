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
  shapeVolume,
} from '../../lib/song-data';

describe('003: interactive note mapping (pentatonic, reference-matched)', () => {
  test('PENA_INTERVALS is the major pentatonic scale degrees [0,2,4,7,9]', () => {
    expect(PENA_INTERVALS).toEqual([0, 2, 4, 7, 9]);
  });

  test('INTERACTIVE range matches reference MIDI 48-84', () => {
    expect(INTERACTIVE_MIDI_LO).toBe(48);
    expect(INTERACTIVE_MIDI_HI).toBe(84);
  });

  test('MIN_ROWS matches reference floor of 12', () => {
    // Math.max(12, Math.floor(baseY / 28))
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

  test('midiToName: middle C and concert A', () => {
    expect(midiToName(60)).toBe('C4');
    expect(midiToName(69)).toBe('A4');
  });

  test('midiToName: sharps and low octave', () => {
    expect(midiToName(61)).toBe('C#4');
    expect(midiToName(40)).toBe('E2');
  });
});

describe('003: volume shaping (song-agnostic curve)', () => {
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
});
