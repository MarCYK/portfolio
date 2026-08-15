import { expect, test, describe } from "bun:test";
import { render } from "@testing-library/react";
import { DualStateIcon } from "../../components/MarCYKIcons";

const D = "M0,0L10,10";
const D_HOVER = "M10,0L0,10";

describe("DualStateIcon", () => {
  test("renders two svg elements", () => {
    const { container } = render(<DualStateIcon d={D} dHover={D_HOVER} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
  });

  test("first svg is the default state, second is the hover state", () => {
    const { container } = render(<DualStateIcon d={D} dHover={D_HOVER} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs[0].className).toContain("block group-hover:hidden group-[.active]:hidden");
    expect(svgs[1].className).toContain("hidden group-hover:block group-[.active]:block");
  });

  test("each svg carries its own path d value", () => {
    const { container } = render(<DualStateIcon d={D} dHover={D_HOVER} />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
    expect(paths[0].getAttribute("d")).toBe(D);
    expect(paths[1].getAttribute("d")).toBe(D_HOVER);
  });

  test("spread props reach both svgs", () => {
    const { container } = render(
      <DualStateIcon d={D} dHover={D_HOVER} aria-label="test icon" />,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs[0].getAttribute("aria-label")).toBe("test icon");
    expect(svgs[1].getAttribute("aria-label")).toBe("test icon");
  });
});
