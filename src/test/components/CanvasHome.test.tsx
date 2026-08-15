import { expect, test, describe, mock, beforeAll, afterAll, beforeEach } from "bun:test";
import { render } from "@testing-library/react";
import CanvasHome from "../../components/CanvasHome";
import { CanvasProvider } from "@/contexts/CanvasContext";

// Recording ctx stub (same pattern as src/test/lib/canvas-engine.test.ts),
// installed on HTMLCanvasElement.prototype so CanvasHome's own getContext
// call returns it.
interface RecordedCtx {
  fills: string[];
}

function makeRecordedCtx(): { ctx: CanvasRenderingContext2D; rec: RecordedCtx } {
  const rec: RecordedCtx = { fills: [] };
  const ctx = {
    clearRect: mock(() => {}),
    fillRect: mock(() => {}),
    beginPath: mock(() => {}),
    moveTo: mock(() => {}),
    lineTo: mock(() => {}),
    closePath: mock(() => {}),
    fill: mock(() => {}),
    stroke: mock(() => {}),
    setTransform: mock(() => {}),
    createLinearGradient: mock(() => ({ addColorStop: mock(() => {}) }) as unknown as CanvasGradient),
    set fillStyle(val: string | CanvasGradient) {
      rec.fills.push(typeof val === "string" ? val : "[gradient]");
    },
    set strokeStyle(_val: string) {},
    set lineWidth(_val: number) {},
  } as unknown as CanvasRenderingContext2D;
  return { ctx, rec };
}

const SUNSET_TOP_FILL = "rgb(255,250,200)";

describe("CanvasHome sunset persistence", () => {
  let rec: RecordedCtx;
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  const originalRaf = window.requestAnimationFrame;

  beforeAll(() => {
    const { ctx, rec: r } = makeRecordedCtx();
    rec = r;
    HTMLCanvasElement.prototype.getContext = (() => ctx) as typeof originalGetContext;
    // Capture rAF callbacks instead of scheduling; the test pumps one frame.
    const queue: FrameRequestCallback[] = [];
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      queue.push(cb);
      return 1;
    }) as typeof window.requestAnimationFrame;
    (window as unknown as { __rafQueue: FrameRequestCallback[] }).__rafQueue = queue;
  });

  afterAll(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    window.requestAnimationFrame = originalRaf;
    delete (window as unknown as { __rafQueue?: FrameRequestCallback[] }).__rafQueue;
  });

  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("sunset-active");
    rec.fills.length = 0;
    const w = window as unknown as { __rafQueue: FrameRequestCallback[] };
    w.__rafQueue.length = 0;
  });

  function pumpOneFrame() {
    const w = window as unknown as { __rafQueue: FrameRequestCallback[] };
    const cb = w.__rafQueue.shift();
    if (cb) cb(performance.now());
  }

  test("renders sunset gradient on mount when body has sunset-active class", () => {
    document.body.classList.add("sunset-active");

    const { unmount } = render(
      <CanvasProvider>
        <CanvasHome />
      </CanvasProvider>
    );
    pumpOneFrame();

    const hasSunsetFill = rec.fills.some(
      (f) => f === SUNSET_TOP_FILL || f.startsWith("rgba(255,250,200,")
    );
    expect(hasSunsetFill).toBe(true);
    unmount();
  });

  test("renders plain background on mount without the sunset-active class", () => {
    const { unmount } = render(
      <CanvasProvider>
        <CanvasHome />
      </CanvasProvider>
    );
    pumpOneFrame();

    expect(rec.fills.some((f) => f === "#ffffff" || f === "#0a0a0a")).toBe(true);
    expect(rec.fills.some((f) => f === SUNSET_TOP_FILL || f.startsWith("rgba(255,250,200,"))).toBe(false);
    unmount();
  });
});
