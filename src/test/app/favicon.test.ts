import { expect, test, describe } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// The RSS route links ${site_url}/favicon.ico and layout.tsx points at
// /favicon.png — both files must exist in public/ so neither 404s.
describe("favicon assets", () => {
  test("public/favicon.png exists", () => {
    expect(existsSync(resolve(process.cwd(), "public/favicon.png"))).toBe(true);
  });

  test("public/favicon.ico exists", () => {
    expect(existsSync(resolve(process.cwd(), "public/favicon.ico"))).toBe(true);
  });
});
