# Changelog

## [2026-07-25 16:20]
- Fixed paint color changes resetting the canvas (issue 008).
- Root cause: `CanvasContext.getPaintColor` depended on `paintColor`, so its callback identity changed for each swatch selection. `CanvasHome` included that callback in its effect dependencies. React cleaned up and recreated the entire canvas engine, wiping `rowColors`.
- `getPaintColor` now has stable identity and reads current color from `paintColorRef`. Ref updates happen only inside `setPaintColor` and `resetPaintColor`, not during render.
- `CanvasHome` keeps complete effect dependencies. Live color updates still flow through the existing `colorChange` event without recreating canvas state.
- Added 2 regression tests covering stable callback identity and latest-value reads.
- Verification: 129/129 tests pass, ESLint clean, TypeScript clean, production build clean.
- Browser regression: painted red (7,272 sampled pixels), selected blue, existing red remained (7,736 sampled pixels), zero blue pixels appeared before drawing.
- Files affected:
  - `src/contexts/CanvasContext.tsx`
  - `src/contexts/CanvasContext.test.tsx` (new)

## [2026-07-25 11:30]
- Rewrote the canvas/paint/sunset rendering pipeline to match zchry.org's live engine (issue 006).
- Diff captured by extracting zchry.org's inline engine (44KB) via DevTools and comparing every constant/algorithm against our old code.
- 12 fixes, all TDD (RED -> GREEN per group). 127 tests pass, build clean.
- Behavior changes:
  - DPR-aware canvas backing store (scale by devicePixelRatio, cap 2x). Fixes Retina blurriness.
  - Row count matches reference: `max(12, floor(innerHeight / 28))`. No MAX cap. No 52px header offset.
  - Waveform noise extracted to pure module `wave-noise.ts` with zchry's exact 9-term sine sum. Dropped `rowPulse` term (reference doesn't have it).
  - Amplitude scaling matches: `0.12 * min(w,h)` desktop, `0.14w` mobile (was `0.17`/`0.2`).
  - Vertical falloff `(1 - 1.6v)^2` (was `(1 - 1.45v)^1.7`). Steeper band, ridges concentrate in center.
  - Top fade: first 20 rows linear ramp (was continuous curve). Bottom rows full opacity.
  - Point stride: 7px normally, 5px during music (was 3px everywhere). 2.3x fewer path calls.
  - Frame rate cap: 33ms (~30fps) normally, 22ms (~45fps) during music. Time advances via real `performance.now()` at 0.0003x.
  - Energy boost on chord rows: `1 + energy*0.3` (was `*0.85`). Less amplitude chaos.
  - Paint model migrated from typed arrays (`rowPaintMask/R/G/B`) to `(string|null|"default")[]` matching reference's `rowColors` array.
  - Paint fill uses vertical `createLinearGradient(0, lineY, 0, lineY+fillExtend)` fading rgba -> transparent. Gated on `rowAmp > 1` so paint appears with the wave, not as a solid stripe.
  - Chord rows now tinted by `musicNoteColor(midi, isDark)` gradient (7-stop palette per theme).
  - Hover stroke brightening: hovered/chord rows get 1.5px stroke at 0.9 alpha; others 1px at `topFade` alpha. Three branches: mouseHover with paint color, hover/chord, default.
  - Sunset reworked: per-row `sunsetRowColor(rowT)` from single 8-stop palette (was 34-stripe background + 9-stop ridges). No banding. `sunsetStrength: number` flag (0..1) replaces boolean `sunsetMode`.
  - `getRowAtY` no longer skips header. Maps y=0 to row 0, like reference.
- New pure modules:
  - `src/lib/wave-noise.ts` (computeNoise, 9-term sine sum)
  - `src/lib/sunset-color.ts` (SUNSET_STOPS, sunsetRowColor, 8-stop palette)
  - `src/lib/note-color.ts` (MUSIC_NOTE_DARK/LIGHT_STOPS, musicNoteColor)
- New tests:
  - `wave-noise.test.ts` (13 golden values from DevTools + 2 bound checks)
  - `sunset-color.test.ts` (15 golden + 2 clamp)
  - `note-color.test.ts` (26 golden + 2 clamp)
  - `canvas-engine.test.ts` rewritten with structural render tests for: bg fill, sunset fill, paint gradient, default-paint gradient, chord-row gradient, hover stroke widths, getRowAtY
  - `song-data.test.ts` updated: `MIN_ROWS=12`, `TARGET_ROW_SPACING=28`, no MAX cap
- Files affected:
  - `src/lib/song-data.ts` (constants + computeRows)
  - `src/lib/song-data.test.ts` (row count tests)
  - `src/lib/canvas-engine.ts` (full rewrite: state shape, drawFrame, updateRows, getRowAtY)
  - `src/lib/canvas-engine.test.ts` (rewritten)
  - `src/lib/wave-noise.ts` (new)
  - `src/lib/wave-noise.test.ts` (new)
  - `src/lib/sunset-color.ts` (new)
  - `src/lib/sunset-color.test.ts` (new)
  - `src/lib/note-color.ts` (new)
  - `src/lib/note-color.test.ts` (new)
  - `src/components/CanvasHome.tsx` (DPR resize, frame cap, paint plumbing migration, sunsetStrength)

## [2026-07-25 05:00]
- Tagged 9 branding placeholders with `// TODO: Replace with MarCYK branding` (issue 006).
- No functional change. Locations: constants.EMAIL, layout metadata, SiteHeader/MobileMenu logo spans, projects.wvrk.org, posts.author, about page.
- Files affected:
  - `src/data/constants.ts`
  - `src/app/layout.tsx`
  - `src/components/SiteHeader.tsx`
  - `src/components/MobileMenu.tsx`
  - `src/data/projects.ts`
  - `src/data/posts.ts`
  - `src/app/about/page.tsx`

## [2026-07-25 04:55]
- Replaced placeholder sequencer data with the full 527-note "Where Is My Mind" arrangement (Maxence Cyrin piano cover of Pixies), extracted from the zchry.org reference client JS (issue 005, Path A).
- 80 BPM, 16th-note time units (187.5ms each), MIDI 37-95 range.
- Volume shaping: 1.4x base, 1.2x melody boost (midi>=60), 0.75x bass cut (midi<48).
- Row mapping: 12% top/bottom margin, inverted (low pitch at bottom).
- Collision nudge when two simultaneous notes share a row; energy bleeds to neighbouring rows +/-1.
- Cursor-based playback (seqStep) audio-clock-locked for zero drift. 1.5s loop gap.
- Files affected:
  - `src/lib/song-data-notes.ts` (new — 527-event dataset)
  - `src/lib/song-data.ts` (sequencer constants + shapeVolume + rowForMidi + convertSongNote + songNotes)
  - `src/lib/canvas-engine.ts` (tickMusic rewrite, seqStep state)
  - `src/components/CanvasHome.tsx` (seqStep reset on music start)

## [2026-07-25 04:50]
- Matched reference pluck behavior (issue 004, Path A): one note per row crossing at fixed velocity 1.0 and duration 0.5s. No chord-on-click, no speed-based velocity scaling.
- Files affected:
  - `src/lib/pluck.ts` (new — pure pluckDecision helper)
  - `src/lib/pluck.test.ts` (new — 7 tests)
  - `src/lib/audio.ts` (playNote defaults aligned to reference)
  - `src/components/CanvasHome.tsx` (handleDraw uses pluckDecision)

## [2026-07-25 04:45]
- Replaced static PENTATONIC_NOTES array with runtime pentatonic snap matching zchry.org (issue 003, Path A).
- Each row linearly maps across MIDI 48-84 then snaps to nearest major pentatonic degree [0,2,4,7,9]. Row 0 (top) = low pitch.
- Files affected:
  - `src/lib/song-data.ts` (PENA_INTERVALS, INTERACTIVE_MIDI_LO/HI, rowToMidi, rowToNote)
  - `src/lib/song-data.test.ts` (new — 9 tests)

## [2026-07-25 03:58]
## [2026-07-25 04:05]
- Refined paint stroke persistence (Issue 002) using Painter's Algorithm: Rows now fill all the way to the bottom of the canvas with fully opaque colors, allowing foreground unpainted strings to correctly mask background painted strings for true 3D occlusion.

## [2026-07-25 03:58]
- Fixed paint stroke persistence (Issue 002): Paint strokes now render at full vivid alpha indefinitely without fading over time.
- Files affected:
  - `src/lib/canvas-engine.ts`

## [2026-07-25 03:48]
- Removed Spoken Word and Theremin features across the codebase as they are dead interactive modes.
- Files affected:
  - `src/components/SiteHeader.tsx`
  - `src/components/CanvasHome.tsx`
  - `src/components/header/CanvasToolbar.tsx`
  - `src/contexts/CanvasContext.tsx`
  - `src/lib/canvas-engine.ts`
