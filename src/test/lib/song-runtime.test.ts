import { test, expect, describe } from 'bun:test';
import {
  msPerUnit,
  convertSongNote,
  rowForMidi,
  buildSongRuntime,
} from '../../lib/song-runtime';
import { shapeVolume } from '../../lib/song-data';
import { SONGS, type Song } from '../../lib/songs';

// Fixture: 120 BPM -> one 16th = 125ms. Pitch range 40..80.
const FIXTURE: Song = {
  id: 'fixture',
  title: 'Fixture',
  artist: 'Test',
  bpm: 120,
  midiLo: 40,
  midiHi: 80,
  notes: [
    [0, 40, 2, 1],
    [4, 60, 2, 0.5],
    [8, 80, 1, 1],
  ],
};

describe('008: song runtime (per-song tempo + pitch mapping)', () => {
  test('msPerUnit: 16th note at the song bpm', () => {
    expect(msPerUnit(FIXTURE)).toBe(125);
    expect(msPerUnit({ bpm: 80 })).toBe(187.5);
  });

  test('convertSongNote: absMs = timeUnit * msPerUnit(song)', () => {
    const [absMs, midi, durSec, vol] = convertSongNote(FIXTURE, [4, 60, 2, 1]);
    expect(absMs).toBe(500);
    expect(midi).toBe(60);
    expect(durSec).toBeCloseTo((2 * 125) / 1000, 5);
    expect(vol).toBe(shapeVolume(60, 1));
  });

  test('convertSongNote: duration floors at 0.1s', () => {
    const [, , durSec] = convertSongNote(FIXTURE, [0, 60, 0.4, 1]);
    expect(durSec).toBe(0.1);
  });

  test('convertSongNote: same note tuple converts differently per tempo', () => {
    const slow = convertSongNote({ bpm: 60 }, [4, 60, 2, 1]);
    const fast = convertSongNote({ bpm: 120 }, [4, 60, 2, 1]);
    expect(slow[0]).toBe(fast[0] * 2);
  });

  test('rowForMidi: song low pitch maps near bottom, high pitch near top', () => {
    const rows = 30;
    expect(rowForMidi(FIXTURE, FIXTURE.midiLo, rows)).toBeGreaterThan(
      rowForMidi(FIXTURE, FIXTURE.midiHi, rows),
    );
  });

  test('rowForMidi: exact endpoints with known margin math', () => {
    const rows = 30;
    const margin = Math.floor(rows * 0.12); // 3
    const usable = rows - 1 - margin * 2; // 23
    expect(rowForMidi(FIXTURE, FIXTURE.midiLo, rows)).toBe(margin + usable);
    expect(rowForMidi(FIXTURE, FIXTURE.midiHi, rows)).toBe(margin);
    expect(rowForMidi(FIXTURE, 60, rows)).toBe(margin + Math.round(0.5 * usable));
  });

  test('rowForMidi: stays within margin-bounded range across the song range', () => {
    const rows = 30;
    const margin = Math.floor(rows * 0.12);
    for (let m = FIXTURE.midiLo; m <= FIXTURE.midiHi; m++) {
      const r = rowForMidi(FIXTURE, m, rows);
      expect(r).toBeGreaterThanOrEqual(margin);
      expect(r).toBeLessThanOrEqual(rows - 1 - margin);
    }
  });

  test('rowForMidi: clamps out-of-range midi', () => {
    const rows = 30;
    const margin = Math.floor(rows * 0.12);
    expect(rowForMidi(FIXTURE, 0, rows)).toBe(margin + (rows - 1 - margin * 2));
    expect(rowForMidi(FIXTURE, 200, rows)).toBe(margin);
  });

  test('buildSongRuntime: converts every note and keeps order', () => {
    const rt = buildSongRuntime(FIXTURE);
    expect(rt.songNotes.length).toBe(FIXTURE.notes.length);
    expect(rt.songNotes[0][0]).toBe(0);
    expect(rt.songNotes[1][0]).toBe(500);
    expect(rt.songNotes[2][0]).toBe(1000);
  });

  test('buildSongRuntime: durationMs extends past the last note by the tail gap', () => {
    const rt = buildSongRuntime(FIXTURE);
    expect(rt.durationMs).toBe(1000 + 3000);
  });

  test('buildSongRuntime: empty note list yields zero duration', () => {
    const rt = buildSongRuntime({ ...FIXTURE, notes: [] });
    expect(rt.songNotes).toEqual([]);
    expect(rt.durationMs).toBe(0);
  });

  test('buildSongRuntime: catalog songs produce sorted streams with positive volume', () => {
    for (const song of SONGS) {
      const rt = buildSongRuntime(song);
      expect(rt.songNotes.length).toBe(song.notes.length);
      for (let i = 1; i < rt.songNotes.length; i++) {
        expect(rt.songNotes[i][0]).toBeGreaterThanOrEqual(rt.songNotes[i - 1][0]);
      }
      for (const [, , , vol] of rt.songNotes) {
        expect(vol).toBeGreaterThan(0);
      }
      const lastMs = rt.songNotes[rt.songNotes.length - 1][0];
      expect(rt.durationMs).toBe(lastMs + 3000);
    }
  });
});
