import { expect, test, describe } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// The project grid draws vertical dividers between columns via card
// border-right, but at md/lg nothing separated grid ROWS. Cards past the
// first row get border-top; which cards those are shifts with the column
// count (3-col: from the 4th card, 2-col: from the 3rd). Mobile (1-col)
// already divides rows with border-bottom, so the top border must be reset
// there or adjacent rows draw double lines.
const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

function mediaBlock(condition: string): string {
  // globals.css holds several blocks per breakpoint; concatenate them all.
  return css
    .split("@media")
    .filter((part) => part.trim().startsWith(`(${condition})`))
    .join("\n");
}

describe("project grid row divider", () => {
  test("cards past the first row have a top border at 3 columns", () => {
    const rule = /\.project-card:nth-child\(n \+ 4\)\s*\{[^}]*border-top:\s*1px solid var\(--border\)/;
    expect(rule.test(css)).toBe(true);
  });

  test("cards past the first row have a top border at 2 columns", () => {
    const md = mediaBlock("max-width: 1023px");
    const rule = /\.project-card:nth-child\(n \+ 3\)\s*\{[^}]*border-top:\s*1px solid var\(--border\)/;
    expect(md === "").toBe(false);
    expect(rule.test(md)).toBe(true);
  });

  test("mobile resets the top border so rows keep single border-bottom dividers", () => {
    const mobile = mediaBlock("max-width: 767px");
    const reset = /\.project-card:nth-child\(n \+ 3\)\s*\{[^}]*border-top:\s*none/;
    expect(mobile === "").toBe(false);
    expect(reset.test(mobile)).toBe(true);
  });
});
