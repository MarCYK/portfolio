import { test, expect, describe } from 'bun:test';
import {
  MUSIC_NOTE_DARK_STOPS,
  MUSIC_NOTE_LIGHT_STOPS,
  musicNoteColor,
} from './note-color';

describe('006: music note color (zchry.org reference-matched)', () => {
  test('MUSIC_NOTE_DARK_STOPS has 7 stops matching reference', () => {
    expect(MUSIC_NOTE_DARK_STOPS).toEqual([
      [37, 35, 12, 44],
      [45, 86, 22, 68],
      [52, 138, 38, 102],
      [60, 78, 48, 136],
      [67, 34, 70, 135],
      [76, 20, 105, 138],
      [95, 76, 168, 210],
    ]);
  });

  test('MUSIC_NOTE_LIGHT_STOPS has 7 stops matching reference', () => {
    expect(MUSIC_NOTE_LIGHT_STOPS).toEqual([
      [37, 82, 50, 74],
      [45, 134, 72, 104],
      [52, 176, 92, 136],
      [60, 130, 104, 168],
      [67, 82, 128, 176],
      [76, 64, 150, 178],
      [95, 122, 188, 214],
    ]);
  });

  const darkSamples: Array<{ midi: number; rgb: [number, number, number] }> = [
    { midi: 37, rgb: [35, 12, 44] },
    { midi: 41, rgb: [61, 17, 56] },
    { midi: 45, rgb: [86, 22, 68] },
    { midi: 48, rgb: [108, 29, 83] },
    { midi: 52, rgb: [138, 38, 102] },
    { midi: 56, rgb: [108, 43, 119] },
    { midi: 60, rgb: [78, 48, 136] },
    { midi: 63, rgb: [59, 57, 136] },
    { midi: 67, rgb: [34, 70, 135] },
    { midi: 71, rgb: [28, 86, 136] },
    { midi: 76, rgb: [20, 105, 138] },
    { midi: 85, rgb: [47, 135, 172] },
    { midi: 95, rgb: [76, 168, 210] },
  ];

  for (const { midi, rgb } of darkSamples) {
    test(`musicNoteColor(midi=${midi}, dark) = rgb(${rgb.join(',')})`, () => {
      expect(musicNoteColor(midi, true)).toEqual(rgb);
    });
  }

  const lightSamples: Array<{ midi: number; rgb: [number, number, number] }> = [
    { midi: 37, rgb: [82, 50, 74] },
    { midi: 41, rgb: [108, 61, 89] },
    { midi: 45, rgb: [134, 72, 104] },
    { midi: 48, rgb: [152, 81, 118] },
    { midi: 52, rgb: [176, 92, 136] },
    { midi: 56, rgb: [153, 98, 152] },
    { midi: 60, rgb: [130, 104, 168] },
    { midi: 63, rgb: [109, 114, 171] },
    { midi: 67, rgb: [82, 128, 176] },
    { midi: 71, rgb: [74, 138, 177] },
    { midi: 76, rgb: [64, 150, 178] },
    { midi: 85, rgb: [91, 168, 195] },
    { midi: 95, rgb: [122, 188, 214] },
  ];

  for (const { midi, rgb } of lightSamples) {
    test(`musicNoteColor(midi=${midi}, light) = rgb(${rgb.join(',')})`, () => {
      expect(musicNoteColor(midi, false)).toEqual(rgb);
    });
  }

  test('clamps low midi to first stop (dark and light)', () => {
    expect(musicNoteColor(0, true)).toEqual([35, 12, 44]);
    expect(musicNoteColor(0, false)).toEqual([82, 50, 74]);
  });

  test('clamps high midi to last stop (dark and light)', () => {
    expect(musicNoteColor(200, true)).toEqual([76, 168, 210]);
    expect(musicNoteColor(200, false)).toEqual([122, 188, 214]);
  });
});
