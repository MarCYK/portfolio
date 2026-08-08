import { expect, test, describe } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// The palette opens downward from the header, overlapping the .home-page::after
// fade gradient. The fade must sit BELOW the palette or it paints over it.
// zchry.org keeps the fade at z-index:1; the palette container is z-index:10.
// This guards the ordering invariant (regression test for the "palette behind
// toolbar" bug).
const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

function zIndexOf(selector: RegExp): number | null {
  const m = css.match(selector);
  if (!m || !m[1]) return null;
  return Number(m[1]);
}

describe("header layering", () => {
  test("color-palette z-index is greater than the home-page fade z-index", () => {
    const palette = zIndexOf(/#color-palette\s*\{[^}]*z-index:\s*(\d+)/);
    const fade = zIndexOf(/home-page::after\s*\{[^}]*z-index:\s*(\d+)/);

    expect(palette === null).toBe(false);
    expect(fade === null).toBe(false);
    expect((palette as number) > (fade as number)).toBe(true);
  });
});
