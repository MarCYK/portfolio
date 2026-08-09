import { expect, test, describe } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// The palette opens downward from the header, overlapping the .home-page::after
// fade gradient. The fade must sit BELOW the palette or it paints over it.
// keeps the fade at z-index:1; the palette container is z-index:10.
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

// On mobile the bottom icon bar is cramped. The note history (.song-notes)
// must only appear when the music icon is focused (.music-focused), otherwise
// notes leak into the bar while music plays in the background. Regression test.
describe("mobile song-notes visibility", () => {
  test("hides .song-notes inside .mobile-icon-bar when not music-focused", () => {
    const bare = /\.mobile-icon-bar\s+\.song-notes\s*\{[^}]*display:\s*none/i.test(css);
    const notHas = /\.mobile-icon-bar(?::not\(:has\(\.music-focused\)\))?\s+\.song-notes\s*\{[^}]*display:\s*none/i.test(css);
    expect(bare || notHas).toBe(true);
  });

  test("keeps .song-notes visible when the music wrapper is music-focused", () => {
    const restore = /\.mobile-icon-bar[^\{]*\.music-focused[^\{]*\.song-notes\s*\{[^}]*display:\s*(?:flex|inline|block|inherit)/i.test(css);
    expect(restore).toBe(true);
  });
});
