import { expect, test, describe, mock } from "bun:test";
import { render } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import MobileMenu from "../../components/MobileMenu";
import { CanvasProvider } from "@/contexts/CanvasContext";

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

describe("MobileMenu", () => {
  test("logo link is the MK monogram only, no wordmark span", () => {
    const { container } = render(
      <CanvasProvider>
        <MobileMenu />
      </CanvasProvider>
    );
    const link = container.querySelector('a[href="/"]')!;
    expect(link.getAttribute("aria-label")).toBe("MarCYK — home");
    const svg = link.querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("marcyk-mark");
    expect(link.querySelector("span")).toBe(null);
  });
});
