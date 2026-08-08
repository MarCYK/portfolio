// Pluck decision for interactive canvas playing.
// playRowNote: one note per row crossing at fixed
// velocity and duration. No chord, no speed-based velocity scaling.

export const PLUCK_VELOCITY = 1.0;
export const PLUCK_DURATION = 0.5;

export interface PluckDecision {
  shouldPlay: boolean;
  velocity: number;
  duration: number;
}

export function pluckDecision(prevRow: number, currentRow: number): PluckDecision {
  if (currentRow < 0) return { shouldPlay: false, velocity: 0, duration: 0 };
  if (currentRow === prevRow) return { shouldPlay: false, velocity: 0, duration: 0 };
  return { shouldPlay: true, velocity: PLUCK_VELOCITY, duration: PLUCK_DURATION };
}
