// Sunset palette + per-row color, sunsetRowColor.
// Single 8-stop palette used for both background and ridge fills (the
// reference does not split them into separate gradients).

export const SUNSET_STOPS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.0, 255, 250, 200],
  [0.12, 255, 220, 130],
  [0.25, 255, 170, 60],
  [0.4, 240, 100, 50],
  [0.55, 200, 60, 80],
  [0.7, 140, 40, 100],
  [0.85, 60, 25, 80],
  [1.0, 20, 10, 50],
];

export type RgbTuple = [number, number, number];

export function sunsetRowColor(rowT: number): RgbTuple {
  const t = Math.max(0, Math.min(1, rowT));
  for (let i = 0; i < SUNSET_STOPS.length - 1; i += 1) {
    const a = SUNSET_STOPS[i];
    const b = SUNSET_STOPS[i + 1];
    if (t >= a[0] && t <= b[0]) {
      const p = (t - a[0]) / (b[0] - a[0]);
      return [
        Math.round(a[1] + (b[1] - a[1]) * p),
        Math.round(a[2] + (b[2] - a[2]) * p),
        Math.round(a[3] + (b[3] - a[3]) * p),
      ];
    }
  }
  const last = SUNSET_STOPS[SUNSET_STOPS.length - 1];
  return [last[1], last[2], last[3]];
}
