# Changelog

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
