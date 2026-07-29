import { expect, test, describe } from "bun:test";
import { render, screen } from "@testing-library/react";
import CanvasToolbar from "../../../components/header/CanvasToolbar";
import { CanvasProvider } from "@/contexts/CanvasContext";

describe("CanvasToolbar", () => {
  test("does not render spoken word toggle button", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );
    
    const spokenToggle = document.getElementById("spoken-toggle");
    expect(spokenToggle === null).toBe(true);
  });
});

