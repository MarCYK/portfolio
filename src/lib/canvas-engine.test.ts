import { expect, test, describe, beforeEach, mock } from "bun:test";
import { createCanvasState, drawFrame } from "./canvas-engine";
import { createAudioState } from "./audio";

describe("canvas-engine paint persistence", () => {
  test("painted row renders at full alpha regardless of glow", () => {
    const state = createCanvasState("dark", 10);
    const audio = createAudioState();
    
    // Set up a painted row
    state.rowPaintMask[5] = 1;
    state.rowPaintR[5] = 255;
    state.rowPaintG[5] = 0;
    state.rowPaintB[5] = 0;
    
    // Set glow to 0 to simulate decayed glow
    state.rowGlow[5] = 0;
    
    // Mock canvas and context
    const canvas = {
      width: 1000,
      height: 1000,
    } as HTMLCanvasElement;
    
    let paintedFillAlpha = 0;
    
    const ctx = {
      clearRect: mock(() => {}),
      fillRect: mock(() => {}),
      beginPath: mock(() => {}),
      moveTo: mock(() => {}),
      lineTo: mock(() => {}),
      closePath: mock(() => {}),
      fill: mock(() => {}),
      save: mock(() => {}),
      restore: mock(() => {}),
      stroke: mock(() => {}),
      set fillStyle(val: string) {
        // Intercept the fillStyle for our red painted row
        // We look for rgba(255, 0, 0, alpha)
        const match = val.match(/rgba\(255, 0, 0, ([\d.]+)\)/);
        if (match) {
          paintedFillAlpha = parseFloat(match[1]);
        }
      },
      set globalAlpha(val: number) {},
      set strokeStyle(val: string) {},
      set lineWidth(val: number) {},
    } as unknown as CanvasRenderingContext2D;
    
    drawFrame(canvas, ctx, state, audio);
    
    // The requirement says "full vivid alpha" (meaning it doesn't decay over time).
    // topFade is ~0.6688 for this row.
    expect(paintedFillAlpha).toBeCloseTo(0.6688, 1);
  });
});
