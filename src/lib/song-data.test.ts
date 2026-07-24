import { test, expect, describe } from 'bun:test';
import {
  rowToNote,
  rowToMidi,
  midiToName,
  PENA_INTERVALS,
  INTERACTIVE_MIDI_LO,
  INTERACTIVE_MIDI_HI,
  computeRows,
  MAX_ROWS,
  MIN_ROWS,
} from './song-data';

describe('003: interactive note mapping (pentatonic, reference-matched)', () => {
  test('PENA_INTERVALS is the major pentatonic scale degrees [0,2,4,7,9]', () => {
    expect(PENA_INTERVALS).toEqual([0, 2, 4, 7, 9]);
  });

  test('INTERACTIVE range matches reference MIDI 48-84', () => {
    expect(INTERACTIVE_MIDI_LO).toBe(48);
    expect(INTERACTIVE_MIDI_HI).toBe(84);
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

  test('computeRows: respects bounds', () => {
    expect(computeRows(24 * MIN_ROWS)).toBeLessThanOrEqual(MAX_ROWS);
    expect(computeRows(24 * MIN_ROWS)).toBeGreaterThanOrEqual(MIN_ROWS);
  });
});
