import { test, expect, describe } from 'bun:test';
import { pluckDecision, PLUCK_VELOCITY, PLUCK_DURATION } from '../../lib/pluck';

describe('004: pluck decision (reference: no chord, fixed velocity per row crossing)', () => {
  test('PLUCK_VELOCITY is fixed at 1.0 matching reference playRowNote', () => {
    expect(PLUCK_VELOCITY).toBe(1.0);
  });

  test('PLUCK_DURATION is 0.5s matching reference playRowNote', () => {
    expect(PLUCK_DURATION).toBe(0.5);
  });

  test('first pluck (no previous row) plays at fixed velocity', () => {
    const d = pluckDecision(-1, 5);
    expect(d.shouldPlay).toBe(true);
    expect(d.velocity).toBe(PLUCK_VELOCITY);
    expect(d.duration).toBe(PLUCK_DURATION);
  });

  test('row crossing plays a note at fixed velocity (no distance scaling)', () => {
    const d = pluckDecision(3, 4);
    expect(d.shouldPlay).toBe(true);
    expect(d.velocity).toBe(PLUCK_VELOCITY);
  });

  test('same row does not re-pluck (no repeat)', () => {
    const d = pluckDecision(7, 7);
    expect(d.shouldPlay).toBe(false);
  });

  test('large jump uses the same fixed velocity (no speed scaling)', () => {
    const small = pluckDecision(5, 6);
    const large = pluckDecision(5, 20);
    expect(large.velocity).toBe(small.velocity);
    expect(large.velocity).toBe(PLUCK_VELOCITY);
  });

  test('out-of-range negative current row does not play', () => {
    expect(pluckDecision(-1, -1).shouldPlay).toBe(false);
  });
});
