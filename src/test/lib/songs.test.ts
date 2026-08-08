import { test, expect, describe } from 'bun:test';
import { SONGS, DEFAULT_SONG_ID, getSongById, type Song } from '../../lib/songs';

describe('007: song catalog (jukebox)', () => {
  test('SONGS has at least 2 entries', () => {
    expect(SONGS.length).toBeGreaterThanOrEqual(2);
  });

  test('every song has the required fields with sane values', () => {
    for (const song of SONGS) {
      expect(typeof song.id).toBe('string');
      expect(song.id.length).toBeGreaterThan(0);
      expect(typeof song.title).toBe('string');
      expect(typeof song.artist).toBe('string');
      expect(song.bpm).toBeGreaterThanOrEqual(40);
      expect(song.bpm).toBeLessThanOrEqual(240);
      expect(song.midiLo).toBeLessThanOrEqual(song.midiHi);
      expect(song.notes.length).toBeGreaterThan(0);
    }
  });

  test('song ids are unique', () => {
    const ids = SONGS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every note is [timeUnit, midi, dur, vel] with dur>=1 and vel in (0,1]', () => {
    for (const song of SONGS) {
      for (const [timeUnit, midi, dur, vel] of song.notes) {
        expect(timeUnit).toBeGreaterThanOrEqual(0);
        expect(midi).toBeGreaterThanOrEqual(0);
        expect(midi).toBeLessThanOrEqual(127);
        expect(dur).toBeGreaterThanOrEqual(1);
        expect(vel).toBeGreaterThan(0);
        expect(vel).toBeLessThanOrEqual(1);
      }
    }
  });

  test('midiLo/midiHi match the actual min/max pitch in notes', () => {
    for (const song of SONGS) {
      const pitches = song.notes.map((n) => n[1]);
      expect(song.midiLo).toBe(Math.min(...pitches));
      expect(song.midiHi).toBe(Math.max(...pitches));
    }
  });

  test('notes are sorted ascending by start step', () => {
    for (const song of SONGS) {
      for (let i = 1; i < song.notes.length; i++) {
        expect(song.notes[i][0]).toBeGreaterThanOrEqual(song.notes[i - 1][0]);
      }
    }
  });

  test('DEFAULT_SONG_ID resolves to a catalog entry', () => {
    const resolved = SONGS.find((s) => s.id === DEFAULT_SONG_ID);
    expect(resolved).toBeDefined();
  });

  test('getSongById returns the matching song', () => {
    const first = SONGS[0];
    expect(getSongById(first.id).id).toBe(first.id);
  });

  test('getSongById falls back to the first song for an unknown id', () => {
    expect(getSongById('does-not-exist').id).toBe(SONGS[0].id);
  });

  test('Song type is exported and assignable', () => {
    const sample: Song = SONGS[0];
    expect(sample.bpm).toBeGreaterThan(0);
  });
});
