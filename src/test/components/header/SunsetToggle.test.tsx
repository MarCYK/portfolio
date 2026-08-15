import { expect, test, describe, beforeEach } from "bun:test";
import { render, fireEvent } from "@testing-library/react";
import SunsetToggle from "../../../components/header/SunsetToggle";
import { CanvasProvider, useCanvas } from "@/contexts/CanvasContext";
import { useEffect } from "react";

describe("SunsetToggle", () => {
  beforeEach(() => {
    document.body.classList.remove("sunset-active");
  });

  test("renders a button with id sunset-toggle and aria-label 'Toggle sunset'", () => {
    render(
      <CanvasProvider>
        <SunsetToggle />
      </CanvasProvider>
    );

    const btn = document.getElementById("sunset-toggle");
    expect(btn === null).toBe(false);
    expect(btn?.getAttribute("aria-label")).toBe("Toggle sunset");
    expect(btn?.className).toMatch(/has-tooltip/);
    expect(btn?.getAttribute("data-tooltip")).toBe("Sunset");
    expect(btn?.className).not.toMatch(/active/);
  });

  test("clicking toggles the sunset-active class on document.body", () => {
    render(
      <CanvasProvider>
        <SunsetToggle />
      </CanvasProvider>
    );

    const btn = document.getElementById("sunset-toggle")!;
    fireEvent.click(btn);
    expect(document.body.classList.contains("sunset-active")).toBe(true);
    expect(btn.className).toMatch(/active/);

    fireEvent.click(btn);
    expect(document.body.classList.contains("sunset-active")).toBe(false);
    expect(btn.className).not.toMatch(/active/);
  });

  test("clicking emits sunsetToggle events with active true then false", () => {
    const received: { active: boolean }[] = [];
    function TestHarness() {
      const { on } = useCanvas();
      useEffect(() => on("sunsetToggle", (d) => { received.push(d); }), [on]);
      return null;
    }

    render(
      <CanvasProvider>
        <SunsetToggle />
        <TestHarness />
      </CanvasProvider>
    );

    const btn = document.getElementById("sunset-toggle")!;
    fireEvent.click(btn);
    fireEvent.click(btn);

    expect(received.length).toBe(2);
    expect(received[0]).toEqual({ active: true });
    expect(received[1]).toEqual({ active: false });
  });

  test("turning sunset off emits canvasClear and resets the paint color", () => {
    const cleared: number[] = [];
    const colors: string[] = [];
    function TestHarness() {
      const { on } = useCanvas();
      useEffect(() => {
        const unsub1 = on("canvasClear", () => { cleared.push(1); });
        const unsub2 = on("colorChange", (d) => { colors.push(d.color); });
        return () => { unsub1(); unsub2(); };
      }, [on]);
      return null;
    }

    render(
      <CanvasProvider>
        <SunsetToggle />
        <TestHarness />
      </CanvasProvider>
    );

    const btn = document.getElementById("sunset-toggle")!;
    fireEvent.click(btn);
    expect(cleared.length).toBe(0);

    fireEvent.click(btn);
    expect(cleared.length).toBe(1);
    expect(colors).toContain("");
  });

  test("initial active state reflects an existing sunset-active body class", () => {
    document.body.classList.add("sunset-active");

    render(
      <CanvasProvider>
        <SunsetToggle />
      </CanvasProvider>
    );

    const btn = document.getElementById("sunset-toggle")!;
    expect(btn.className).toMatch(/active/);

    fireEvent.click(btn);
    expect(document.body.classList.contains("sunset-active")).toBe(false);
  });
});
