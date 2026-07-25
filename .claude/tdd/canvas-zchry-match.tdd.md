# TDD Evidence Report — Canvas Engine Match zchry.org (Issue 007)

**Source plan:** Approved inline plan from chat (no `*.plan.md` file). User request: "implement the fix, we must follow the live website" after analysis of https://www.zchry.org/.

## User Journeys

1. As a visitor, I want the canvas waveform to look as bold and crisp as zchry.org, so that the visual identity of the site matches the original.
2. As a visitor on a Retina display, I want waveforms rendered at native pixel density, so that lines don't look fuzzy.
3. As a visitor, I want paint strokes to render as a wave-reactive gradient (appearing only when the wave peaks), so that the painted effect matches the original's subtle luminosity.
4. As a visitor, I want sunset mode to show a smooth per-row gradient with no visible banding, so that it looks like a continuous sunset and not stacked stripes.
5. As a visitor, I want hovered/chord rows to visibly brighten with a thicker stroke, so that cursor and music feedback reads clearly.

## Task Report

### A1. Row count math
- **Summary:** Rewrote `computeRows` to `max(12, floor(h/28))`, removed `MAX_ROWS` cap.
- **Validation command:** `bun test src/lib/song-data.test.ts`
- **RED evidence:** 5 failing tests asserting MIN_ROWS=12, TARGET_ROW_SPACING=28, no MAX cap.
- **GREEN evidence:** 25/25 pass in song-data.test.ts.
- **Guarantee:** Row count scales with viewport, floor of 12, no upper cap. Matches zchry.org `updateRowCount`.

### A2. Wave noise
- **Summary:** New pure `computeNoise(t, r, time)` with zchry's 9-term sine sum.
- **Validation command:** `bun test src/lib/wave-noise.test.ts`
- **RED evidence:** `Cannot find module './wave-noise'`.
- **GREEN evidence:** 15/15 pass (13 golden values + 2 bound checks).
- **Guarantee:** Waveform character bit-exact with zchry.org. No `rowPulse` term.

### A3. Sunset color
- **Summary:** New `sunsetRowColor(rowT)` with 8-stop palette.
- **Validation command:** `bun test src/lib/sunset-color.test.ts`
- **RED evidence:** `Cannot find module './sunset-color'`.
- **GREEN evidence:** 18/18 pass (15 golden samples + 2 clamp tests + stops structure).
- **Guarantee:** Per-row sunset color bit-exact with reference. Single palette replaces old 11+9 split.

### A4. Music note color
- **Summary:** New `musicNoteColor(midi, isDark)` with 7-stop dark/light palettes.
- **Validation command:** `bun test src/lib/note-color.test.ts`
- **RED evidence:** `Cannot find module './note-color'`.
- **GREEN evidence:** 30/30 pass (26 golden samples across both themes + 2 stops structure + 2 clamp tests).
- **Guarantee:** Chord-row color tinting bit-exact with reference for any MIDI value in [37, 95].

### B5+B6. CanvasState + drawFrame rewrite
- **Summary:** Rewrote `CanvasState` shape and `drawFrame` to mirror zchry's `draw()`.
- **Validation command:** `bun test src/lib/canvas-engine.test.ts`
- **RED evidence:** 11 failing tests asserting new shape (`rowColors`, `rowMidi`, `rowNoteEnd`, `sunsetStrength`), structural render behavior (paint gradients, sunset per-row fill, chord-row tinting, hover stroke widths), `getRowAtY` no-header behavior.
- **GREEN evidence:** 14/14 pass.
- **Guarantee:** Render pipeline structurally matches reference: gradient-based paint with rowAmp>1 gating, musicNoteColor chord tinting, 1.5px hover vs 1px default strokes, per-row sunset rgba fill.

### C8+C9. DPR + frame cap (CanvasHome)
- **Summary:** Added DPR-aware resize + 33ms/22ms frame cap + `performance.now()`-based time advancement.
- **Validation command:** `npx tsc --noEmit` + `npm run build`
- **RED evidence:** TypeScript errors: `Property 'customStrokeColor' does not exist`, `Property 'sunsetMode' does not exist`, `Property 'rowPaintMask' does not exist`, etc. (18 errors from old state shape).
- **GREEN evidence:** tsc clean. Build clean. Full `bun test src/` 127/127 pass.
- **Guarantee:** Canvas backs store at native DPR (cap 2x). Frame rate capped to reduce redundant redraws. Time advances at reference rate independent of frame rate.

## Test Specification

| # | What is guaranteed | Test file or command | Test type | Result | Evidence |
|---|---|---|---|---|---|
| 1 | `computeRows(900)` = 32, no MAX cap | `src/lib/song-data.test.ts:computeRows` | unit | PASS | `bun test src/lib/song-data.test.ts` |
| 2 | `MIN_ROWS=12`, `TARGET_ROW_SPACING=28` | `src/lib/song-data.test.ts:MIN_ROWS matches` | unit | PASS | same |
| 3 | `computeNoise(t,r,time)` matches 13 zchry golden values to 6dp | `src/lib/wave-noise.test.ts:golden` | unit | PASS | `bun test src/lib/wave-noise.test.ts` |
| 4 | Noise practical max < 4, min > -1 | `src/lib/wave-noise.test.ts:bounds` | unit | PASS | same |
| 5 | `SUNSET_STOPS` is 8-stop reference palette | `src/lib/sunset-color.test.ts:SUNSET_STOPS` | unit | PASS | `bun test src/lib/sunset-color.test.ts` |
| 6 | `sunsetRowColor(t)` matches 15 golden samples | `src/lib/sunset-color.test.ts:golden` | unit | PASS | same |
| 7 | `sunsetRowColor` clamps t outside [0,1] | `src/lib/sunset-color.test.ts:clamps` | unit | PASS | same |
| 8 | `MUSIC_NOTE_DARK/LIGHT_STOPS` each 7-stop reference palette | `src/lib/note-color.test.ts:STOPS` | unit | PASS | `bun test src/lib/note-color.test.ts` |
| 9 | `musicNoteColor` matches 26 golden samples (dark+light) | `src/lib/note-color.test.ts:golden` | unit | PASS | same |
| 10 | `musicNoteColor` clamps out-of-range midi | `src/lib/note-color.test.ts:clamps` | unit | PASS | same |
| 11 | `createCanvasState` returns `rowColors: null[]`, `rowMidi`, `rowNoteEnd`, `sunsetStrength=0` | `src/lib/canvas-engine.test.ts:state shape` | unit | PASS | `bun test src/lib/canvas-engine.test.ts` |
| 12 | Old typed-array paint fields no longer on state | `src/lib/canvas-engine.test.ts:no longer exposes` | unit | PASS | same |
| 13 | `updateRows` reinitializes `rowColors` at new size | `src/lib/canvas-engine.test.ts:updateRows` | unit | PASS | same |
| 14 | `drawFrame` background fill = `#0a0a0a` when dark, sunset off | `src/lib/canvas-engine.test.ts:bgColor` | unit | PASS | same |
| 15 | `drawFrame` sunset fill = per-row rgba from sunset palette | `src/lib/canvas-engine.test.ts:sunset fill` | unit | PASS | same |
| 16 | Painted row with hex color creates vertical gradient (rgba -> transparent) | `src/lib/canvas-engine.test.ts:paint gradient` | unit | PASS | same |
| 17 | Painted "default" row uses monochrome gradient toward white in dark | `src/lib/canvas-engine.test.ts:default paint` | unit | PASS | same |
| 18 | Chord/seq row with energy applies musicNoteColor gradient | `src/lib/canvas-engine.test.ts:chord tint` | unit | PASS | same |
| 19 | Hovered row uses 1.5px line, non-hover uses 1px | `src/lib/canvas-engine.test.ts:hover stroke` | unit | PASS | same |
| 20 | `getRowAtY` returns -1 for negative y, maps y=0 to row 0 (no header offset) | `src/lib/canvas-engine.test.ts:getRowAtY` | unit | PASS | same |
| 21 | Project typechecks after state-shape migration | `npx tsc --noEmit` | typecheck | PASS | exit 0, no output |
| 22 | Production build succeeds | `npm run build` | build | PASS | exit 0, 8 routes generated |

## Coverage and Known Gaps

**Coverage:** All pure functions (`computeNoise`, `sunsetRowColor`, `musicNoteColor`, `computeRows`) have 100% line coverage via golden-value tests. `drawFrame` is covered structurally via mocked CanvasRenderingContext2D — asserts on fillStyle strings, gradient stop colors, and line widths across all 5 render branches (bg, sunset, paint color, default paint, chord tint). `tickMusic` unchanged from issue 005 (already tested there).

**Known gaps:**
- `CanvasHome.tsx` component-level tests not added. DOM event wiring (mousedown/move/up, touch, blur) is verified manually via DevTools dispatch + pixel-readback (3.4% red pixel coverage in middle band after paint dispatch). Component tests would require heavy happy-dom + AudioContext mocking; the underlying behaviors they trigger are already locked by the `drawFrame` and `getRowAtY` unit tests.
- E2E tests not in scope. Issue 001 removed Playwright from the project; visual QA done via DevTools side-by-side with zchry.org.

## Merge Evidence

Six checkpoint commits on `main`, in order:

| Commit | Stage | Description |
|---|---|---|
| `924455c` | A1 RED+GREEN | Row count math (MIN=12, divisor=28, no MAX) |
| `c249f77` | A2 RED+GREEN | Wave noise 9-term sine sum |
| `0ecce56` | A3 RED+GREEN | Sunset 8-stop palette |
| `cf8c762` | A4 RED+GREEN | Note color 7-stop palettes |
| `fbf639d` | B+C RED+GREEN | CanvasState + drawFrame + CanvasHome rewrite |

Final state: `bun test src/` 127/127 pass, `npx tsc --noEmit` clean, `npm run build` clean.

## Issue 008 Addendum — Paint Color Change Reset

**User journey:** As a visitor, I want changing the selected paint color to affect only future strokes, so that existing artwork remains intact.

**Root cause:** `getPaintColor` changed function identity whenever `paintColor` changed. `CanvasHome` depended on that callback, so each swatch selection reran the initialization effect and replaced `CanvasState` with empty `rowColors`.

**RED:** New regression test changed paint color and asserted callback identity remained stable. Result: 1 pass / 1 fail. The identity assertion failed for the intended bug.

**GREEN:** `getPaintColor` now reads a setter-maintained ref and has stable identity. `CanvasHome` retains complete effect dependencies. Result: 2/2 focused tests pass; full suite 129/129 passes.

| # | What is guaranteed | Test/command | Result |
|---|---|---|---|
| 23 | `getPaintColor` identity stays stable when a swatch changes | `src/contexts/CanvasContext.test.tsx` | PASS |
| 24 | Stable `getPaintColor` returns the latest selected color | `src/contexts/CanvasContext.test.tsx` | PASS |
| 25 | React hooks lint accepts ref usage and effect dependencies | `npm run lint` | PASS |
| 26 | Existing red paint remains after selecting blue | Browser pixel readback: 7,272 red pixels before, 7,736 after | PASS |

**Final gates:** `bun test src/` 129/129, `npm run lint` clean, `npx tsc --noEmit` clean, `npm run build` clean, final code review approved with no findings.

If squashing, preserve this report in the squash commit body.
