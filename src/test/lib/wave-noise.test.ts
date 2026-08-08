import { test, expect, describe } from 'bun:test';
import { computeNoise } from '../../lib/wave-noise';

describe('006: wave noise', () => {
  // Locks the exact 9-term sine sum so the visual character stays matched.
  const golden: Array<{ t: number; r: number; time: number; n: number }> = [
    { t: 0, r: 0, time: 0, n: 0 },
    { t: 0.5, r: 0, time: 0, n: 0.09923396243893065 },
    { t: 1, r: 0, time: 0, n: 1.4694739529959013 },
    { t: 0.5, r: 10, time: 0, n: 0.3591952761230267 },
    { t: 0.5, r: 0, time: 1, n: 0.2824988610357074 },
    { t: 0.5, r: 15, time: 5, n: 0.9173424721706518 },
    { t: 0.25, r: 5, time: 2.5, n: 1.8651819457260896 },
    { t: 0.75, r: 20, time: 10, n: 0.5124263419049649 },
    { t: 0.1, r: 0, time: 0, n: 2.1308442649072674 },
    { t: 0.9, r: 30, time: 0.5, n: 0.8028672829056489 },
    { t: 0.5, r: 50, time: 100, n: 2.5953413415039366 },
    { t: 1, r: 100, time: 100, n: 0.3584356981680942 },
    { t: 0, r: 0, time: 100, n: 0.17159184841177344 },
  ];

  for (const { t, r, time, n } of golden) {
    test(`computeNoise(t=${t}, r=${r}, time=${time}) = ${n.toFixed(6)}`, () => {
      expect(computeNoise(t, r, time)).toBeCloseTo(n, 6);
    });
  }

  test('practical max stays below 4 (positive spikes from max(0,·) terms)', () => {
    let max = -Infinity;
    for (let t = 0; t <= 1; t += 0.02) {
      for (let r = 0; r < 50; r += 1) {
        for (let time = 0; time < 10; time += 0.5) {
          const v = computeNoise(t, r, time);
          if (v > max) max = v;
        }
      }
    }
    expect(max).toBeLessThan(4);
    expect(max).toBeGreaterThan(3);
  });

  test('practical min stays above -1 (linear sines only contribute negatively)', () => {
    let min = Infinity;
    for (let t = 0; t <= 1; t += 0.02) {
      for (let r = 0; r < 50; r += 1) {
        for (let time = 0; time < 10; time += 0.5) {
          const v = computeNoise(t, r, time);
          if (v < min) min = v;
        }
      }
    }
    expect(min).toBeGreaterThan(-1);
    expect(min).toBeLessThan(0);
  });
});
