import { expect, test, describe, mock, beforeEach } from "bun:test";
import { createCanvasState, drawFrame, updateRows, getRowAtY, type CanvasState } from "../../lib/canvas-engine";
import { createAudioState } from "../../lib/audio";

// Mock canvas + context that records calls so we can assert render structure.
interface RecordedCtx {
  fills: string[];
  strokes: string[];
  lineWidths: number[];
  gradients: Array<{ x0: number; y0: number; x1: number; y1: number; stops: Array<[number, string]> }>;
  fillCount: number;
  strokeCount: number;
}

function makeMockCtx(): { ctx: CanvasRenderingContext2D; rec: RecordedCtx } {
  const rec: RecordedCtx = {
    fills: [],
    strokes: [],
    lineWidths: [],
    gradients: [],
    fillCount: 0,
    strokeCount: 0,
  };
  const ctx = {
    clearRect: mock(() => {}),
    fillRect: mock(() => {}),
    beginPath: mock(() => {}),
    moveTo: mock(() => {}),
    lineTo: mock(() => {}),
    closePath: mock(() => {}),
    fill: mock(() => { rec.fillCount += 1; }),
    save: mock(() => {}),
    restore: mock(() => {}),
    stroke: mock(() => { rec.strokeCount += 1; }),
    createLinearGradient: mock((x0: number, y0: number, x1: number, y1: number) => {
      const g = {
        x0, y0, x1, y1, stops: [] as Array<[number, string]>,
        addColorStop(offset: number, color: string) { this.stops.push([offset, color]); },
      };
      rec.gradients.push(g);
      return g as unknown as CanvasGradient;
    }),
    set fillStyle(val: string | CanvasGradient) {
      rec.fills.push(typeof val === 'string' ? val : '[gradient]');
    },
    set strokeStyle(val: string) {
      rec.strokes.push(val);
    },
    set lineWidth(val: number) {
      rec.lineWidths.push(val);
    },
    set globalAlpha(_v: number) {},
  } as unknown as CanvasRenderingContext2D;
  return { ctx, rec };
}

const CANVAS_W = 1000;
const CANVAS_H = 1000;
const mockCanvas = { width: CANVAS_W, height: CANVAS_H } as HTMLCanvasElement;

describe("006: canvas-engine state shape", () => {
  test("createCanvasState initializes rowColors as null array sized to rows", () => {
    const s = createCanvasState("dark", 10);
    expect(s.rowColors).toHaveLength(10);
    for (const c of s.rowColors) expect(c).toBeNull();
  });

  test("createCanvasState initializes rowMidi and rowNoteEnd arrays", () => {
    const s = createCanvasState("dark", 10);
    expect(s.rowMidi).toHaveLength(10);
    expect(s.rowNoteEnd).toHaveLength(10);
  });

  test("createCanvasState has sunsetStrength as a number defaulting to 0", () => {
    const s = createCanvasState("dark", 10);
    expect(s.sunsetStrength).toBe(0);
  });

  test("createCanvasState no longer exposes rowPaintMask/R/G/B typed arrays", () => {
    const s = createCanvasState("dark", 10) as unknown as Record<string, unknown>;
    expect(s.rowPaintMask).toBeUndefined();
    expect(s.rowPaintR).toBeUndefined();
    expect(s.rowPaintG).toBeUndefined();
    expect(s.rowPaintB).toBeUndefined();
  });

  test("updateRows preserves rowColors and state arrays at new size", () => {
    const s = createCanvasState("dark", 5);
    s.rowColors[2] = "#ff0000";
    s.energy[2] = 0.5;
    updateRows(s, 10);
    expect(s.rowColors).toHaveLength(10);
    expect(s.rowColors[2]).toBe("#ff0000");
    expect(s.rowColors[5]).toBeNull();
    expect(s.energy).toHaveLength(10);
    expect(s.energy[2]).toBeCloseTo(0.5);
    expect(s.rowGlow).toHaveLength(10);
  });
});

describe("006: canvas-engine drawFrame structure", () => {
  let baseState: CanvasState;
  let audio: ReturnType<typeof createAudioState>;

  beforeEach(() => {
    baseState = createCanvasState("dark", 12);
    audio = createAudioState();
  });

  test("background fill uses bgColor when sunsetStrength is 0", () => {
    const { ctx, rec } = makeMockCtx();
    drawFrame(mockCanvas, ctx, baseState, audio);
    // dark theme bg = #0a0a0a
    expect(rec.fills.some((f) => f === "#0a0a0a")).toBe(true);
  });

  test("sunset fill uses per-row rgba color sampled from sunset palette", () => {
    const { ctx, rec } = makeMockCtx();
    baseState.sunsetStrength = 1;
    drawFrame(mockCanvas, ctx, baseState, audio);
    // At rowT=0, sunsetRowColor = rgb(255,250,200). Each ridge fill is rgba(255,250,200,alpha).
    expect(rec.fills.some((f) => f.startsWith("rgba(255,250,200,"))).toBe(true);
  });

  test("painted row with hex color creates a vertical gradient (rgba -> transparent)", () => {
    const { ctx, rec } = makeMockCtx();
    baseState.rowColors[6] = "#ef4444"; // red swatch
    drawFrame(mockCanvas, ctx, baseState, audio);
    // Reference uses createLinearGradient(0, lineY, 0, lineY + fillExtend) with rgba(r,g,b,a) -> rgba(r,g,b,0)
    const redGradients = rec.gradients.filter((g) =>
      g.stops.some(([, color]) => color.includes("239") && color.includes("68") && color.includes("68"))
    );
    expect(redGradients.length).toBeGreaterThan(0);
    const g = redGradients[0];
    // vertical gradient (x0 == x1)
    expect(g.x0).toBe(g.x1);
    expect(g.y1).toBeGreaterThan(g.y0);
    // fade from alpha to 0
    expect(g.stops[0][1]).toMatch(/rgba\(239,68,68,0\.\d+\)/);
    expect(g.stops[g.stops.length - 1][1]).toBe("rgba(239,68,68,0)");
  });

  test('painted row with "default" value uses monochrome gradient toward white (dark theme)', () => {
    const { ctx, rec } = makeMockCtx();
    baseState.rowColors[6] = "default";
    drawFrame(mockCanvas, ctx, baseState, audio);
    const monoGradients = rec.gradients.filter((g) =>
      g.stops.some(([, color]) => color.startsWith("rgba(255,255,255,"))
    );
    expect(monoGradients.length).toBeGreaterThan(0);
  });

  test("chord/seq row with energy applies a gradient using musicNoteColor palette", () => {
    const { ctx, rec } = makeMockCtx();
    // Make row 6 a "chord row" with energy and a midi value
    baseState.rowGlow[6] = 0.8;
    baseState.energy[6] = 0.8;
    baseState.rowMidi[6] = 60;
    baseState.rowNoteEnd[6] = Number.POSITIVE_INFINITY;
    drawFrame(mockCanvas, ctx, baseState, audio);
    // Dark theme, midi=60 maps to rgb(78,48,136)
    const noteGradients = rec.gradients.filter((g) =>
      g.stops.some(([, color]) => color.includes("78") && color.includes("48") && color.includes("136"))
    );
    expect(noteGradients.length).toBeGreaterThan(0);
  });

  test("hover row uses 1.5px line width, non-hover uses 1px", () => {
    const { ctx, rec } = makeMockCtx();
    baseState.hoverRow = 6; // mark one row as hovered
    drawFrame(mockCanvas, ctx, baseState, audio);
    expect(rec.lineWidths).toContain(1.5);
    expect(rec.lineWidths).toContain(1);
  });
});

describe("006: getRowAtY", () => {
  test("returns -1 for negative y", () => {
    expect(getRowAtY(1000, -10, 30)).toBe(-1);
  });

  test("maps y=0 to row 0 (no header offset — reference does not skip header)", () => {
    // rowSpacing = innerHeight / joyRows, no HEADER_HEIGHT_PX offset
    expect(getRowAtY(1000, 0, 10)).toBe(0);
  });

  test("clamps to valid row range", () => {
    expect(getRowAtY(1000, 2000, 10)).toBe(9);
    expect(getRowAtY(1000, 999, 10)).toBe(9);
  });
});
