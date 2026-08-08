import { expect, test, describe } from "bun:test";
import { render } from "@testing-library/react";
import SoundToggle from "../../../components/header/SoundToggle";
import ThemeToggle from "../../../components/header/ThemeToggle";

// gives every toolbar icon a hover tooltip via .has-tooltip +
// data-tooltip. Sound/Theme/email were missing them. This guards the gap.
describe("header icon tooltips", () => {
  test("sound toggle shows a 'Sound' tooltip", () => {
    render(<SoundToggle enabled={false} onToggle={() => {}} />);
    const btn = document.getElementById("sound-toggle");
    expect(btn === null).toBe(false);
    expect(btn?.className).toMatch(/has-tooltip/);
    expect(btn?.getAttribute("data-tooltip")).toBe("Sound");
  });

  test("theme toggle shows a 'Theme' tooltip (even when disabled)", () => {
    render(<ThemeToggle isDark={true} onToggle={() => {}} disabled={true} />);
    const btn = document.getElementById("theme-toggle");
    expect(btn === null).toBe(false);
    expect(btn?.className).toMatch(/has-tooltip/);
    expect(btn?.getAttribute("data-tooltip")).toBe("Theme");
  });
});
