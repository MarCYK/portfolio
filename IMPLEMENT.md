# Implementation Audit Trail

## Issue 008 - Paint Color Change Reset Canvas
**Discussed:** MarCYK reported that selecting a new paint color reset all existing canvas paint. Expected behavior: color changes only affect future strokes. Existing rows remain painted.
**Root cause:** `CanvasContext.getPaintColor` was declared as `useCallback(() => paintColor, [paintColor])`. Every swatch selection changed its function identity. `CanvasHome` included `getPaintColor` in the canvas initialization effect dependencies, so React tore down and recreated the canvas engine. New `CanvasState` meant empty `rowColors`.
**Implemented (TDD):**
- Added `src/contexts/CanvasContext.test.tsx` with a context probe.
- RED: changing paint color changed `getPaintColor` callback identity. 1/2 tests failed.
- GREEN: moved current color into `paintColorRef`; update ref inside `setPaintColor` and `resetPaintColor`; `getPaintColor` now uses `useCallback(..., [])` and retains stable identity while returning current values.
- Kept `CanvasHome` dependency list complete: `[emit, on, getPaintColor]`. No eslint suppression. Stable callback prevents canvas engine recreation.
- Code review found and fixed a render-time ref mutation before completion.
**Verification:**
- `bun test src/contexts/CanvasContext.test.tsx`: 2/2 pass.
- `bun test src/`: 129/129 pass.
- `npm run lint`: clean.
- `npx tsc --noEmit`: clean.
- `npm run build`: clean.
- Browser regression: painted red (7,272 sampled red pixels), changed swatch to blue, red remained (7,736 sampled red pixels), no blue appeared until drawing.
**Status:** Complete.

## Issue 007 - Canvas Engine Match zchry.org
**Discussed:** MarCYK reported the clone "is not working as well as https://www.zchry.org/". Live-site analysis via Chrome DevTools extracted zchry.org's inline engine (44KB) and revealed 12 behavioral divergences in our canvas/paint/sunset rendering. MarCYK approved a 12-fix TDD pass in one PR, with existing "reference-matched" tests rewritten to encode zchry.org's actual values where they had previously encoded our wrong values.
**Implemented (TDD, RED -> GREEN per group):**
- Group A — pure functions:
  - `src/lib/wave-noise.ts`: extracted zchry's exact 9-term sine sum as `computeNoise(t, r, time)`. 13 golden values captured via DevTools.
  - `src/lib/sunset-color.ts`: `SUNSET_STOPS` (8-stop palette) + `sunsetRowColor(rowT)`. Replaces old 11-stop bg / 9-stop ridge split.
  - `src/lib/note-color.ts`: `MUSIC_NOTE_DARK/LIGHT_STOPS` (7-stop each) + `musicNoteColor(midi, isDark)` for chord-row tinting.
  - `src/lib/song-data.ts`: `MIN_ROWS=12`, `TARGET_ROW_SPACING=28`, removed `MAX_ROWS` cap. `computeRows` now `max(12, floor(h/28))`.
- Group B — state + drawFrame rewrite (`src/lib/canvas-engine.ts`):
  - `CanvasState` shape: dropped `rowPaintMask/R/G/B`, `customStrokeColor`, `timeOffset`, `sunsetMode`. Added `rowColors: (string|null|"default")[]`, `rowMidi: number[]`, `rowNoteEnd: number[]`, `sunsetStrength: number`, `hoverRow: number`, `paintColor: string`.
  - `drawFrame` rewritten 1:1 with zchry's `draw()`: pointStride 7/5, maxAmp 0.12/0.14, verticalMult `(1-1.6v)^2`, topFade first-20-rows linear, energy boost `1+e*0.3`, sunset per-row rgba color, paint via vertical gradient gated on `rowAmp > 1`, chord rows tinted by musicNoteColor gradient, 3-way hover/mouseHover/default stroke at 1.5px vs 1px.
  - `getRowAtY`: no header offset, full height.
- Group C — CanvasHome (`src/components/CanvasHome.tsx`):
  - DPR-aware resize: `canvas.width = innerWidth * min(dpr, 2)`, `ctx.setTransform(dpr,0,0,dpr,0,0)`.
  - Frame rate cap: 33ms / 22ms during music. Time advances via `performance.now() * 0.0003` (passed as `nowMs` to drawFrame).
  - Migrated paint plumbing from typed arrays to `rowColors` array. Tracks `hoverRow` on every mousemove.
  - `sunsetStrength = active ? 1 : 0` instead of boolean `sunsetMode`.
**Verification:**
- `bun test src/`: 127 pass / 0 fail (was 47 before this PR).
- `npx tsc --noEmit`: clean.
- `npm run build`: clean.
- Visual QA via Chrome DevTools side-by-side with zchry.org: dark theme matches (body bg #0a0a0a), 20-25 sparse ridges in center band (was dense/chaotic), sunset gradient smooth with no banding, sunset toggle off cleanly reverses, theme-toggle disabled during sunset (matches reference), paint dispatch produces 3.4% red-pixel coverage in middle band (paint IS rendering, gradient-faded as designed), chord display in header shows live note names during music playback.
**Status:** Complete. All 12 fixes shipped. 80 new tests locking reference behavior. Build + types clean.
**Out of scope:** Theremin (air mode), spoken word mode, chord-display UI rework. MarCYK did not request these.

## Issue 006 - Tag Branding Placeholders
**Discussed:** Implement the sixth issue from `docs/issues/006-tag-branding-placeholders.md`. Tag all hardcoded identity fields still referencing the original Zach / zchry.org / wvrk.org branding with `// TODO: Replace with MarCYK branding` comments. No functional change.
**Implemented:**
- Added TODO markers above 9 brand-identity locations across constants, layout metadata, header/mobile logo spans, projects entry, posts author, and about page.
- Left provenance comments referencing zchry.org as the clone source in place (correct attribution, not placeholders).
**Status:** Complete. 9/9 locations tagged. `grep -rn "TODO.*MarCYK" src/` returns 9 matches.

## Issue 005 - Where Is My Mind 80 BPM Sequencer (Path A)
**Discussed:** Implement the fifth issue from `docs/issues/005-where-is-my-mind-sequencer.md` as a faithful clone of zchry.org (Path A). Replace placeholder MIDI_NOTES with the real 527-note arrangement of Maxence Cyrin's piano cover of the Pixies, run at 80 BPM audio-clock-locked, with reference-matched volume shaping and row collision nudging.
**Implemented:**
- Extracted the 527-event `IMPORTED_NOTES` dataset from the zchry.org reference client JS (public asset) into `src/lib/song-data-notes.ts`. Format `[timeUnit, midi, dur, vel]`, 16th-note units at 80 BPM (187.5ms each), MIDI 37-95.
- Added to `song-data.ts`: `SOURCE_BPM`, `MS_PER_UNIT`, `SONG_MIDI_LO/HI`, `shapeVolume` (1.4x base + 1.2x melody / 0.75x bass), `rowForMidi` (12% margin-bounded inverted map), `convertSongNote`, `songNotes`, `SONG_DURATION_MS`. Removed old `MIDI_NOTES` and `midiPitchToRow`.
- Rewrote `canvas-engine.ts` `tickMusic`: cursor-based playback via `seqStep`, collision nudge when two notes share a row, energy bleed to neighbouring rows +/-1, 1.5s loop gap. Audio-clock-locked for zero drift. Added `seqStep` field to `CanvasState`.
**Status:** Complete. 17/17 new tests green. Full src suite 47/47 green. `next build` clean.

## Issue 004 - Click = Chord, Drag = Strum (Path A override)
**Discussed:** Issue 004 as written specified click=chord / drag=strum with velocity scaling. Research on the live zchry.org site showed the reference does NOT do this — it plays one note on mousedown and one per row crossing at fixed velocity 1.0 and duration 0.5s. MarCYK chose Path A (faithful clone), so the chord/strum logic was dropped in favor of matching the reference exactly.
**Implemented:**
- New `src/lib/pluck.ts` exporting pure `pluckDecision(prevRow, currentRow)` returning `{shouldPlay, velocity, duration}`. Same-row and negative-row cases return `shouldPlay=false`; otherwise fixed velocity 1.0 / duration 0.5s.
- `audio.playNote` defaults aligned to reference (velocity 1.0, duration 0.5s); added optional `duration` param.
- `CanvasHome.handleDraw` now uses `pluckDecision` instead of velocity-by-distance scaling.
**Status:** Complete. 7/7 pluck tests green. Full src suite green. `next build` clean. Note: the issue's acceptance criteria for chord/strum behavior are intentionally NOT met — Path A defers to the reference.

## Issue 003 - Proper MIDI Note Mapping (Path A override)
**Discussed:** Issue 003 as written specified a chromatic one-unique-note-per-row mapping. Research on the live zchry.org site showed the reference uses a major pentatonic snap `[0,2,4,7,9]` across MIDI 48-84, with many adjacent rows sharing a note. MarCYK chose Path A (faithful clone), so the chromatic mapping was replaced with pentatonic.
**Implemented:**
- Replaced static `PENTATONIC_NOTES` constant with runtime snap in `song-data.ts`: each row linearly maps across MIDI 48-84 then snaps to the nearest major pentatonic degree. Row 0 (top of canvas) = lowest pitch, matching the reference's `updateRowCount`/`rowFreqs` algorithm.
- Added exports `PENA_INTERVALS`, `INTERACTIVE_MIDI_LO/HI`, `rowToMidi`. `rowToNote` now delegates to `rowToMidi` + `midiToName`. No caller signature changes.
**Status:** Complete. 9/9 new tests green. Full src suite green. `next build` clean. Note: the issue's chromatic / one-unique-note-per-row acceptance criteria are intentionally NOT met — Path A defers to the reference.

## Issue 002 - Fix Paint Stroke Persistence
**Discussed:** Implement the second issue from `docs/issues/002-fix-paint-stroke-persistence.md` using the TDD workflow.
**Implemented:**
- Created a unit test `src/lib/canvas-engine.test.ts` to mock canvas context and verify paint fill alpha.
- Modified `fillAlpha` logic in `src/lib/canvas-engine.ts` to be completely opaque (`rgb`).
- Modified row fill bounding logic: all strings now use `fillBottom` to draw an opaque block to the bottom of the canvas. This implements the Painter's Algorithm observed on the reference site, ensuring perfect 3D depth occlusion between painted and unpainted strings.
- Verified all acceptance criteria.
**Status:** Complete.

## Issue 001 - Remove Spoken Word and Theremin
**Discussed:** Implement the first issue from `docs/issues/001-remove-spoken-word-theremin.md` using the TDD workflow.
**Implemented:**
- Added vitest/testing-library/happy-dom for TDD workflow.
- Created test for CanvasToolbar.tsx asserting the absence of the Spoken Word toggle button.
- Stripped Spoken Word references from SiteHeader.tsx, CanvasHome.tsx, CanvasToolbar.tsx, CanvasContext.tsx, and canvas-engine.ts.
- Excluded test files and evaluation directories from `tsconfig.json` to prevent Next.js type check failures on build.
- App builds successfully without errors.
**Status:** Complete.
