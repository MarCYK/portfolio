import { test, expect, describe } from 'bun:test';
import { SUNSET_STOPS, sunsetRowColor } from './sunset-color';

describe('006: sunset color (zchry.org reference-matched)', () => {
  test('SUNSET_STOPS has 8 stops matching reference exactly', () => {
    expect(SUNSET_STOPS).toEqual([
      [0.0, 255, 250, 200],
      [0.12, 255, 220, 130],
      [0.25, 255, 170, 60],
      [0.4, 240, 100, 50],
      [0.55, 200, 60, 80],
      [0.7, 140, 40, 100],
      [0.85, 60, 25, 80],
      [1.0, 20, 10, 50],
    ]);
  });

  // Golden samples captured from zchry.org's sunsetRowColor via DevTools.
  const samples: Array<{ t: number; rgb: [number, number, number] }> = [
    { t: 0, rgb: [255, 250, 200] },
    { t: 0.06, rgb: [255, 235, 165] },
    { t: 0.12, rgb: [255, 220, 130] },
    { t: 0.18, rgb: [255, 197, 98] },
    { t: 0.25, rgb: [255, 170, 60] },
    { t: 0.325, rgb: [248, 135, 55] },
    { t: 0.4, rgb: [240, 100, 50] },
    { t: 0.475, rgb: [220, 80, 65] },
    { t: 0.55, rgb: [200, 60, 80] },
    { t: 0.625, rgb: [170, 50, 90] },
    { t: 0.7, rgb: [140, 40, 100] },
    { t: 0.775, rgb: [100, 32, 90] },
    { t: 0.85, rgb: [60, 25, 80] },
    { t: 0.925, rgb: [40, 17, 65] },
    { t: 1, rgb: [20, 10, 50] },
  ];

  for (const { t, rgb } of samples) {
    test(`sunsetRowColor(${t}) = rgb(${rgb.join(',')})`, () => {
      expect(sunsetRowColor(t)).toEqual(rgb);
    });
  }

  test('clamps t < 0 to first stop', () => {
    expect(sunsetRowColor(-0.5)).toEqual([255, 250, 200]);
    expect(sunsetRowColor(-100)).toEqual([255, 250, 200]);
  });

  test('clamps t > 1 to last stop', () => {
    expect(sunsetRowColor(1.5)).toEqual([20, 10, 50]);
    expect(sunsetRowColor(100)).toEqual([20, 10, 50]);
  });
});
