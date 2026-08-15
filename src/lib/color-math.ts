export type Rgb = { r: number; g: number; b: number };

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function tryParseHex(color: string): Rgb | null {
  const normalized = color.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;
  if (value.length !== 6) return null;
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

export function sampleGradient(stops: string[], t: number): Rgb {
  const clamped = clamp(t, 0, 1);
  const scaled = clamped * (stops.length - 1);
  const index = Math.floor(scaled);
  const localT = scaled - index;
  const start = tryParseHex(stops[index])!;
  const end = tryParseHex(stops[Math.min(index + 1, stops.length - 1)])!;

  return {
    r: Math.round(lerp(start.r, end.r, localT)),
    g: Math.round(lerp(start.g, end.g, localT)),
    b: Math.round(lerp(start.b, end.b, localT)),
  };
}

export function mixRgb(base: Rgb, highlight: Rgb, amount: number): Rgb {
  const clamped = clamp(amount, 0, 1);
  return {
    r: Math.round(lerp(base.r, highlight.r, clamped)),
    g: Math.round(lerp(base.g, highlight.g, clamped)),
    b: Math.round(lerp(base.b, highlight.b, clamped)),
  };
}

export function toRgba(rgb: Rgb, alpha: number): string {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
