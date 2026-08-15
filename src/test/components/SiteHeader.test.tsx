import { expect, test, describe, beforeEach, mock } from "bun:test";
import { render } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import SiteHeader from "../../components/SiteHeader";
import { CanvasProvider } from "@/contexts/CanvasContext";

mock.module("next/navigation", () => ({
  usePathname: () => "/",
}));

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

describe("SiteHeader", () => {
  beforeEach(() => {
    document.body.classList.remove("sunset-active");
  });

  test("theme toggle is disabled on first render when body already has sunset-active", () => {
    document.body.classList.add("sunset-active");

    render(
      <CanvasProvider>
        <SiteHeader />
      </CanvasProvider>
    );

    const btn = document.getElementById("theme-toggle")!;
    expect(btn === null).toBe(false);
    expect(btn.disabled || btn.getAttribute("aria-disabled") === "true").toBe(true);
  });

  test("theme toggle is enabled on first render without the sunset-active body class", () => {
    render(
      <CanvasProvider>
        <SiteHeader />
      </CanvasProvider>
    );

    const btn = document.getElementById("theme-toggle")!;
    expect(btn === null).toBe(false);
    expect(btn.disabled || btn.getAttribute("aria-disabled") === "true").toBe(false);
  });
});
