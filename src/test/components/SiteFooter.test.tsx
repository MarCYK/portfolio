import { expect, test, describe, mock } from "bun:test";
import { render } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import SiteFooter from "../../components/SiteFooter";

mock.module("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("SiteFooter", () => {
  test("home link shows the MK monogram as an inline svg, not an image", () => {
    const { container } = render(<SiteFooter />);
    const link = container.querySelector('a[href="/"]')!;
    expect(link.querySelectorAll("path").length).toBe(2);
    expect(container.querySelector("img")).toBe(null);
    const svg = link.querySelector("svg")!;
    expect(svg.getAttribute("fill")).toBe("currentColor");
    expect(svg.getAttribute("class")).toContain("marcyk-mark");
    expect(svg.getAttribute("style")).toContain("18px");
  });
});
