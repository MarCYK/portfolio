import { expect, test, describe } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// getProjectGridLayout(3) sets data-stretch-md, and the span-2 rule for the
// last card lives in a max-width:1023px block with no lower bound. Below
// 768px the grid is 1 column, so span 2 forces an implicit second column and
// cards end up side by side instead of one per row. The mobile block must
// reset that span.
const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

function mediaBlocks(condition: string): string {
  return css
    .split("@media")
    .filter((part) => part.trim().startsWith(`(${condition})`))
    .join("\n");
}

describe("project grid mobile rows", () => {
  test("mobile resets the stretch-md span so every card keeps its own row", () => {
    const mobile = mediaBlocks("max-width: 767px");
    const reset = /\.project-grid\[data-stretch-md\]\s+\.project-card:last-of-type\s*\{[^}]*grid-column:\s*auto/;
    expect(mobile === "").toBe(false);
    expect(reset.test(mobile)).toBe(true);
  });
});
