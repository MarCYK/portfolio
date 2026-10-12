import { expect, test, describe } from "bun:test";
import { render } from "@testing-library/react";
import { IconMarCYKLogo, ResumeIcon } from "../../components/MarCYKIcons";

const MK_M_D =
  "M 55.122883,97.130508 V 66.650509 h 10.16 l 5.08,5.08 5.08,-5.08 h 10.159999 v 30.479999 Z";
const MK_K_D =
  "M 86.161686,97.130508 V 66.650509 h 15.240004 v 5.08 l 5.08,-5.08 h 10.16 v 10.16 l -5.08,5.08 5.08,5.08 v 10.159999 h -10.16 l -5.08,-5.08 v 5.08 Z";

describe("IconMarCYKLogo", () => {
  test("viewBox is tight on the MK monogram content", () => {
    const { container } = render(<IconMarCYKLogo />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("viewBox")).toBe("55.123 66.651 61.519 30.48");
  });

  test("renders the two MK monogram paths", () => {
    const { container } = render(<IconMarCYKLogo />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
    expect((paths[0].getAttribute("d") ?? "").replace(/\s+/g, " ").trim()).toBe(MK_M_D);
    expect((paths[1].getAttribute("d") ?? "").replace(/\s+/g, " ").trim()).toBe(MK_K_D);
  });

  test("fills inherit currentColor with no hardcoded red", () => {
    const { container } = render(<IconMarCYKLogo />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("fill")).toBe("currentColor");
    for (const path of container.querySelectorAll("path")) {
      expect(path.getAttribute("fill")).toBe(null);
    }
    expect(container.innerHTML.includes("#FF0000")).toBe(false);
  });

  test("spread props reach the svg", () => {
    const { container } = render(<IconMarCYKLogo aria-label="test logo" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-label")).toBe("test logo");
  });
});

describe("ResumeIcon", () => {
  test("renders an svg element", () => {
    const { container } = render(<ResumeIcon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  test("spreads props onto the svg", () => {
    const { container } = render(<ResumeIcon data-testid="resume-icon" style={{ width: 14 }} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("data-testid")).toBe("resume-icon");
    expect(svg.style.width).toBe("14px");
  });
});
