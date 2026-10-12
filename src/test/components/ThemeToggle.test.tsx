import { expect, test, describe, beforeEach } from "bun:test";
import { render } from "@testing-library/react";
import ThemeToggle, { useTheme } from "../../components/header/ThemeToggle";
import { CanvasProvider } from "@/contexts/CanvasContext";

function Harness({ log }: { log: boolean[] }) {
  const { isDark, toggleTheme } = useTheme();
  log.push(isDark);
  return <ThemeToggle isDark={isDark} onToggle={toggleTheme} />;
}

function currentIconPath(): string {
  const path = document.querySelector("#theme-toggle path");
  return path === null ? "" : path.getAttribute("d") ?? "";
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.removeItem("theme");
  });

  test("first render is dark even when the stored preference is light (hydration-safe)", () => {
    localStorage.setItem("theme", "light");
    const log: boolean[] = [];

    render(
      <CanvasProvider>
        <Harness log={log} />
      </CanvasProvider>
    );

    expect(log.length).toBeGreaterThan(0);
    expect(log[0]).toBe(true);
  });

  test("stored light preference is applied after mount", () => {
    localStorage.setItem("theme", "light");

    render(
      <CanvasProvider>
        <Harness log={[]} />
      </CanvasProvider>
    );

    expect(currentIconPath().startsWith("M240,96")).toBe(true);
  });

  test("stored dark preference keeps the sun icon after mount", () => {
    localStorage.setItem("theme", "dark");

    render(
      <CanvasProvider>
        <Harness log={[]} />
      </CanvasProvider>
    );

    expect(currentIconPath().startsWith("M120,40V16")).toBe(true);
  });
});
