import { expect, test, describe } from "bun:test";
import { render, screen } from "@testing-library/react";
import CanvasToolbar from "../../../components/header/CanvasToolbar";
import { CanvasProvider } from "@/contexts/CanvasContext";

describe("CanvasToolbar", () => {
  test("does not render spoken word toggle button", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    const spokenToggle = document.getElementById("spoken-toggle");
    expect(spokenToggle === null).toBe(true);
  });

  test("paint toggle shows a 'Paint' tooltip matching zchry", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    const paintToggle = document.getElementById("paint-toggle");
    expect(paintToggle === null).toBe(false);
    expect(paintToggle?.className).toMatch(/has-tooltip/);
    expect(paintToggle?.getAttribute("data-tooltip")).toBe("Paint");
  });

  test("music, sunset, and canvas-clear each show a tooltip matching zchry", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    const cases: Array<[string, string]> = [
      ["music-toggle", "Music"],
      ["sunset-toggle", "Sunset"],
      ["canvas-clear", "Clear canvas"],
    ];
    for (const [id, label] of cases) {
      const btn = document.getElementById(id);
      expect(btn === null).toBe(false);
      expect(btn?.className).toMatch(/has-tooltip/);
      expect(btn?.getAttribute("data-tooltip")).toBe(label);
    }
  });

  test("palette swatches match zchry's exact colors", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    const swatches = document.querySelectorAll("#color-palette .color-swatch .swatch-inner");
    expect(swatches.length).toBe(8);
    const backgrounds = [...swatches].map((s) => (s as HTMLElement).getAttribute("style") ?? "");
    expect(backgrounds[0]).toContain("linear-gradient(135deg, #fff 50%, #000 50%)");
    expect(backgrounds.slice(1)).toEqual([
      "background: #ef4444;",
      "background: #f97316;",
      "background: #eab308;",
      "background: #22c55e;",
      "background: #3b82f6;",
      "background: #8b5cf6;",
      "background: #ec4899;",
    ]);
  });
});

