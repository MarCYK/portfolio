import { expect, test, describe, mock } from "bun:test";
import { render } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import ProjectCard from "../../components/ProjectCard";
import type { Project } from "../../types";

mock.module("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} data-testid="next-link" {...props}>
      {children}
    </a>
  ),
}));

const base: Project = {
  title: "ChatMT Agent Platform",
  description: "No-code platform for building AI agents.",
  date: "2026",
  href: "/projects/chatmt-agent-platform",
  external: false,
  icon: "chatmt",
};

describe("ProjectCard", () => {
  test("internal project links render via next/link without target/rel", () => {
    const { container } = render(<ProjectCard {...base} />);

    const link = container.querySelector('[data-testid="next-link"]');
    expect(link === null).toBe(false);
    expect(link!.getAttribute("href")).toBe("/projects/chatmt-agent-platform");
    expect(link!.getAttribute("target")).toBe(null);
    expect(link!.getAttribute("rel")).toBe(null);
    expect(link!.className).toBe("project-card group");
    expect(container.querySelector("a:not([data-testid='next-link'])")).toBe(null);
  });

  test("external project links render a plain anchor opening a new tab", () => {
    const { container } = render(<ProjectCard {...base} href="https://example.com" external />);

    expect(container.querySelector('[data-testid="next-link"]')).toBe(null);
    const a = container.querySelector("a.project-card")!;
    expect(a === null).toBe(false);
    expect(a.getAttribute("href")).toBe("https://example.com");
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    expect(a.className).toBe("project-card group");
  });

  test("placeholder cards keep the inert anchor with no href", () => {
    const { container } = render(<ProjectCard {...base} href="#" />);

    expect(container.querySelector('[data-testid="next-link"]')).toBe(null);
    const a = container.querySelector("a.project-card")!;
    expect(a === null).toBe(false);
    expect(a.getAttribute("href")).toBe(null);
    expect(a.getAttribute("target")).toBe(null);
  });
});
