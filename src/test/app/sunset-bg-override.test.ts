import { expect, test, describe } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// LinkPreview sets backgroundColor: 'var(--bg)'. --bg is only declared at
// :root and .dark, so it computes there and never re-resolves when
// body.sunset-active overrides the palette on body. The sunset palette block
// must re-declare --bg on body so the card background follows #fff8e8.
// Regression test.
const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

describe("sunset palette bg override", () => {
  test("body.sunset-active palette block re-declares --bg from --background", () => {
    const block = css.match(
      /body\.sunset-active\s*\{[^}]*--background:\s*#fff8e8[^}]*\}/
    );
    expect(block === null).toBe(false);

    expect(/--bg:\s*var\(--background\)/.test((block as RegExpMatchArray)[0])).toBe(true);
  });
});
