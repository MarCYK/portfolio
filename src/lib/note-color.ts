// Music note color, matched to zchry.org's musicNoteColor.
// 7-stop palette per theme; midi clamped to [first, last] stop midi.

import type { RgbTuple } from './sunset-color';

export const MUSIC_NOTE_DARK_STOPS: ReadonlyArray<readonly [number, number, number, number]> = [
  [37, 35, 12, 44],
  [45, 86, 22, 68],
  [52, 138, 38, 102],
  [60, 78, 48, 136],
  [67, 34, 70, 135],
  [76, 20, 105, 138],
  [95, 76, 168, 210],
];

export const MUSIC_NOTE_LIGHT_STOPS: ReadonlyArray<readonly [number, number, number, number]> = [
  [37, 82, 50, 74],
  [45, 134, 72, 104],
  [52, 176, 92, 136],
  [60, 130, 104, 168],
  [67, 82, 128, 176],
  [76, 64, 150, 178],
  [95, 122, 188, 214],
];

export function musicNoteColor(midi: number, isDark: boolean): RgbTuple {
  const stops = isDark ? MUSIC_NOTE_DARK_STOPS : MUSIC_NOTE_LIGHT_STOPS;
  const note = Math.max(stops[0][0], Math.min(stops[stops.length - 1][0], midi));
  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i];
    const b = stops[i + 1];
    if (note >= a[0] && note <= b[0]) {
      const p = (note - a[0]) / (b[0] - a[0]);
      return [
        Math.round(a[1] + (b[1] - a[1]) * p),
        Math.round(a[2] + (b[2] - a[2]) * p),
        Math.round(a[3] + (b[3] - a[3]) * p),
      ];
    }
  }
  const last = stops[stops.length - 1];
  return [last[1], last[2], last[3]];
}
