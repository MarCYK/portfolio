import { test, expect } from 'bun:test';
import { clamp, lerp, tryParseHex, sampleGradient, mixRgb, toRgba } from '../../lib/color-math';

test('clamp: clamps below range to min', () => {
  expect(clamp(-5, 0, 1)).toBe(0);
});

test('clamp: passes through in-range value', () => {
  expect(clamp(0.5, 0, 1)).toBe(0.5);
});

test('clamp: clamps above range to max', () => {
  expect(clamp(2, 0, 1)).toBe(1);
});

test('lerp: interpolates linearly', () => {
  expect(lerp(0, 10, 0.5)).toBe(5);
  expect(lerp(0, 10, 0)).toBe(0);
  expect(lerp(0, 10, 1)).toBe(10);
  expect(lerp(-4, 4, 0.25)).toBe(-2);
});

test('tryParseHex: parses 6-digit hex', () => {
  expect(tryParseHex('#ff8800')).toEqual({ r: 255, g: 136, b: 0 });
  expect(tryParseHex('ff8800')).toEqual({ r: 255, g: 136, b: 0 });
  expect(tryParseHex('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  expect(tryParseHex('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
});

test('tryParseHex: expands 3-digit shorthand', () => {
  expect(tryParseHex('#f80')).toEqual({ r: 255, g: 136, b: 0 });
  expect(tryParseHex('f80')).toEqual({ r: 255, g: 136, b: 0 });
  expect(tryParseHex('#000')).toEqual({ r: 0, g: 0, b: 0 });
});

test('tryParseHex: rejects malformed input with null', () => {
  expect(tryParseHex('#ff')).toBeNull();
  expect(tryParseHex('#ff88')).toBeNull();
  expect(tryParseHex('#ff8800ff')).toBeNull();
  expect(tryParseHex('')).toBeNull();
  expect(tryParseHex('#gg8800')).toBeNull();
  expect(tryParseHex('not-a-color')).toBeNull();
});

test('sampleGradient: returns first stop at t=0', () => {
  const stops = ['#000000', '#ff0000', '#ffffff'];
  expect(sampleGradient(stops, 0)).toEqual({ r: 0, g: 0, b: 0 });
});

test('sampleGradient: returns last stop at t=1', () => {
  const stops = ['#000000', '#ff0000', '#ffffff'];
  expect(sampleGradient(stops, 1)).toEqual({ r: 255, g: 255, b: 255 });
});

test('sampleGradient: interpolates midpoint', () => {
  const stops = ['#000000', '#ffffff'];
  const mid = sampleGradient(stops, 0.5);
  expect(mid.r).toBeCloseTo(128, 0);
  expect(mid.g).toBeCloseTo(128, 0);
  expect(mid.b).toBeCloseTo(128, 0);
});

test('sampleGradient: clamps t outside [0,1]', () => {
  const stops = ['#000000', '#ffffff'];
  expect(sampleGradient(stops, -0.5)).toEqual({ r: 0, g: 0, b: 0 });
  expect(sampleGradient(stops, 1.5)).toEqual({ r: 255, g: 255, b: 255 });
});

test('sampleGradient: single stop returns that stop', () => {
  expect(sampleGradient(['#123456'], 0.5)).toEqual({ r: 0x12, g: 0x34, b: 0x56 });
});

test('mixRgb: linear blend', () => {
  const base = { r: 0, g: 0, b: 0 };
  const highlight = { r: 100, g: 200, b: 50 };
  expect(mixRgb(base, highlight, 0.5)).toEqual({ r: 50, g: 100, b: 25 });
  expect(mixRgb(base, highlight, 0)).toEqual(base);
  expect(mixRgb(base, highlight, 1)).toEqual(highlight);
});

test('mixRgb: clamps amount outside [0,1]', () => {
  const base = { r: 0, g: 0, b: 0 };
  const highlight = { r: 100, g: 100, b: 100 };
  expect(mixRgb(base, highlight, -1)).toEqual(base);
  expect(mixRgb(base, highlight, 2)).toEqual(highlight);
});

test('toRgba: formats rgba string', () => {
  expect(toRgba({ r: 255, g: 128, b: 0 }, 0.5)).toBe('rgba(255, 128, 0, 0.5)');
  expect(toRgba({ r: 0, g: 0, b: 0 }, 1)).toBe('rgba(0, 0, 0, 1)');
});
