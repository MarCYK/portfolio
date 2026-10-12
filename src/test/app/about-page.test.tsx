import { expect, test, describe, mock } from "bun:test";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";

mock.module("../../components/PageShell", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const AboutPage = (await import("../../app/about/page")).default;

describe("AboutPage", () => {
  test("Links section offers a downloadable resume", () => {
    const { container } = render(<AboutPage />);
    const link = container.querySelector('a[href="/Marvin_Chin_AI_Engineer.pdf"]');
    expect(link === null).toBe(false);
    expect(link!.getAttribute("download")).not.toBe(null);
    expect(link!.textContent).toContain("Resume");
  });
});
