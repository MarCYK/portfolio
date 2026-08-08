// Waveform noise function, exact 9-term sine sum.
// No rowPulse term — the reference does not have one.

export function computeNoise(t: number, r: number, time: number): number {
  let n = 0;
  n += Math.sin(t * 15 + r * 0.9 + time) * 0.2;
  n += Math.sin(t * 33 + r * 1.6 + time * 1.5) * 0.15;
  n += Math.sin(t * 70 + r * 2.5 + time * 0.3) * 0.1;
  n += Math.sin(t * 120 + r * 3.1 + time * 0.7) * 0.06;
  n += Math.sin(t * 8 + r * 0.4 + time * 0.6) * 0.25;
  n += Math.max(0, Math.sin(t * 22 + r * 1.2 + time * 1.0) - 0.2) * 1.6;
  n += Math.max(0, Math.sin(t * 45 + r * 2.0 + time * 0.7) - 0.35) * 1.2;
  n += Math.max(0, Math.sin(t * 11 + r * 0.35 + time * 1.3) - 0.3) * 1.3;
  n += Math.max(0, Math.sin(t * 65 + r * 2.8 + time * 0.5) - 0.5) * 0.7;
  return n;
}
