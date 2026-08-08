import { expect, test, describe } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import CanvasToolbar from "../../../components/header/CanvasToolbar";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { useCanvas } from "@/contexts/CanvasContext";
import { useEffect } from "react";
import { SONGS, DEFAULT_SONG_ID } from "@/lib/songs";

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

  test("paint toggle shows a 'Paint' tooltip", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    const paintToggle = document.getElementById("paint-toggle");
    expect(paintToggle === null).toBe(false);
    expect(paintToggle?.className).toMatch(/has-tooltip/);
    expect(paintToggle?.getAttribute("data-tooltip")).toBe("Paint");
  });

  test("music, sunset, and canvas-clear each show a tooltip", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    const cases: Array<[string, string]> = [
      ["music-toggle", "Music"],
      ["sunset-toggle", "Sunset"],
      ["canvas-clear", "Clear canvas"],
    ];
    for (const [id, label] of cases) {
      const btn = document.getElementById(id);
      expect(btn === null).toBe(false);
      expect(btn?.className).toMatch(/has-tooltip/);
      expect(btn?.getAttribute("data-tooltip")).toBe(label);
    }
  });

  test("palette swatches match exact colors", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    const swatches = document.querySelectorAll("#color-palette .color-swatch .swatch-inner");
    expect(swatches.length).toBe(8);
    const backgrounds = [...swatches].map((s) => (s as HTMLElement).getAttribute("style") ?? "");
    expect(backgrounds[0]).toContain("linear-gradient(135deg, #fff 50%, #000 50%)");
    expect(backgrounds.slice(1)).toEqual([
      "background: #ef4444;",
      "background: #f97316;",
      "background: #eab308;",
      "background: #22c55e;",
      "background: #3b82f6;",
      "background: #8b5cf6;",
      "background: #ec4899;",
    ]);
  });
});

describe("CanvasToolbar song widget", () => {
  test("song widget is hidden by default", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    const songList = document.getElementById("song-list");
    expect(songList === null).toBe(false);
    expect(songList?.className).toMatch(/song-list-hidden/);
  });

  test("clicking music toggle opens the song widget", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    fireEvent.click(document.getElementById("music-toggle")!);

    const songList = document.getElementById("song-list")!;
    expect(songList.className).not.toMatch(/song-list-hidden/);
  });

  test("widget shows the default song title and artist", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    fireEvent.click(document.getElementById("music-toggle")!);

    const widget = document.querySelector("#song-list .song-widget")!;
    const title = widget.querySelector(".song-title")?.textContent;
    const artist = widget.querySelector(".song-artist")?.textContent;
    const defaultSong = SONGS.find((s) => s.id === DEFAULT_SONG_ID)!;
    expect(title).toBe(defaultSong.title);
    expect(artist).toBe(defaultSong.artist);
  });

  test("widget has one spinning disk icon on the controls row", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    fireEvent.click(document.getElementById("music-toggle")!);

    const disks = document.querySelectorAll("#song-list .song-disk");
    expect(disks.length).toBe(1);
    // Not spinning when music is inactive
    expect(disks[0].className).not.toMatch(/spinning/);
  });

  test("widget has prev, next, and play/pause buttons", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    fireEvent.click(document.getElementById("music-toggle")!);

    const navBtns = document.querySelectorAll("#song-list .song-nav-btn");
    expect(navBtns.length).toBe(2);
    expect(navBtns[0].getAttribute("aria-label")).toBe("Previous song");
    expect(navBtns[1].getAttribute("aria-label")).toBe("Next song");

    const playBtn = document.querySelector("#song-list .song-play-btn");
    expect(playBtn).not.toBeNull();
    expect(playBtn?.getAttribute("aria-label")).toBe("Play");
  });

  test("play/pause button toggles aria-label between Play and Pause", () => {
    let musicState: { active: boolean } | null = null;
    function TestHarness() {
      const { on } = useCanvas();
      useEffect(() => on("musicToggle", (d) => { musicState = d; }), [on]);
      return null;
    }

    const { rerender } = render(
      <CanvasProvider>
        <CanvasToolbar />
        <TestHarness />
      </CanvasProvider>
    );

    fireEvent.click(document.getElementById("music-toggle")!);
    const playBtn = document.querySelector("#song-list .song-play-btn") as HTMLElement;
    expect(playBtn.getAttribute("aria-label")).toBe("Play");

    fireEvent.click(playBtn);
    expect(musicState).not.toBeNull();
    expect(musicState!.active).toBe(true);

    rerender(
      <CanvasProvider>
        <CanvasToolbar />
        <TestHarness />
      </CanvasProvider>
    );

    // After musicToggle event sets musicActive, the button label flips to Pause.
    // Re-open the widget (rerender may have closed state) and check.
    fireEvent.click(document.getElementById("music-toggle")!);
    const playBtnAfter = document.querySelector("#song-list .song-play-btn") as HTMLElement;
    // The toolbar subscribes to musicToggle via its own on() handler, so
    // musicActive should now be true and label should be Pause.
    expect(playBtnAfter.getAttribute("aria-label")).toBe("Pause");
  });

  test("next button emits songSelect for the next song (wraps around)", () => {
    let received: { songId: string } | null = null;
    function TestHarness() {
      const { on } = useCanvas();
      useEffect(() => on("songSelect", (d) => { received = d; }), [on]);
      return null;
    }

    render(
      <CanvasProvider>
        <CanvasToolbar />
        <TestHarness />
      </CanvasProvider>
    );

    fireEvent.click(document.getElementById("music-toggle")!);
    const navBtns = document.querySelectorAll("#song-list .song-nav-btn");
    const nextBtn = navBtns[1];

    // From default song, next should be the following catalog entry.
    const defaultIdx = SONGS.findIndex((s) => s.id === DEFAULT_SONG_ID);
    const expectedNext = SONGS[(defaultIdx + 1) % SONGS.length];

    fireEvent.click(nextBtn);
    expect(received).not.toBeNull();
    expect(received!.songId).toBe(expectedNext.id);
  });

  test("prev button emits songSelect for the previous song (wraps around)", () => {
    let received: { songId: string } | null = null;
    function TestHarness() {
      const { on } = useCanvas();
      useEffect(() => on("songSelect", (d) => { received = d; }), [on]);
      return null;
    }

    render(
      <CanvasProvider>
        <CanvasToolbar />
        <TestHarness />
      </CanvasProvider>
    );

    fireEvent.click(document.getElementById("music-toggle")!);
    const navBtns = document.querySelectorAll("#song-list .song-nav-btn");
    const prevBtn = navBtns[0];

    const defaultIdx = SONGS.findIndex((s) => s.id === DEFAULT_SONG_ID);
    const expectedPrev = SONGS[(defaultIdx - 1 + SONGS.length) % SONGS.length];

    fireEvent.click(prevBtn);
    expect(received).not.toBeNull();
    expect(received!.songId).toBe(expectedPrev.id);
  });

  test("opening song widget closes an open palette", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    fireEvent.click(document.getElementById("paint-toggle")!);
    expect(document.getElementById("color-palette")?.className).not.toMatch(/hidden/);

    fireEvent.click(document.getElementById("music-toggle")!);
    expect(document.getElementById("color-palette")?.className).toMatch(/hidden/);
    expect(document.getElementById("song-list")?.className).not.toMatch(/song-list-hidden/);
  });

  test("opening palette closes an open song widget", () => {
    render(
      <CanvasProvider>
        <CanvasToolbar />
      </CanvasProvider>
    );

    fireEvent.click(document.getElementById("music-toggle")!);
    expect(document.getElementById("song-list")?.className).not.toMatch(/song-list-hidden/);

    fireEvent.click(document.getElementById("paint-toggle")!);
    expect(document.getElementById("song-list")?.className).toMatch(/song-list-hidden/);
    expect(document.getElementById("color-palette")?.className).not.toMatch(/hidden/);
  });
});

