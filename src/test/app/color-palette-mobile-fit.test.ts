import { expect, test, describe } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// On mobile the palette is anchored to the paint button's right edge and
// opens above it. A single row of 8 swatches (~220px) reaches past the left
// screen edge on phones. The swatches must wrap into a 4-wide grid inside
// the mobile media query so the panel stays ~112px wide. Regression test.
const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

const mobileBlock = css.slice(css.indexOf("@media (max-width: 767px)"));

describe("mobile color palette fit", () => {
  test("swatches wrap into a 4-column grid inside the mobile media query", () => {
    const rule = /\.mobile-icon-bar\s+#color-palette\s+\.color-palette-inner\s*\{[^}]*\}/;
    const m = mobileBlock.match(rule);
    expect(m === null).toBe(false);

    const body = (m as RegExpMatchArray)[0];
    expect(/display:\s*grid/.test(body)).toBe(true);
    expect(/grid-template-columns:\s*repeat\(4,\s*20px\)/.test(body)).toBe(true);
  });
});
