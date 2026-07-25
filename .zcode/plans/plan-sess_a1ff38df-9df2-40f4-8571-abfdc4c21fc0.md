# Canvas Engine: Match zchry.org

## Goal
Rewrite the rendering pipeline so the clone visually matches https://www.zchry.org/. TDD throughout. Existing tests with "reference-matched" names that encode our wrong values get rewritten to encode zchry.org's actual values.

## Scope: 12 fixes, one PR

### Group A — Pure functions (TDD, easy)

**A1. Row count math** (`src/lib/song-data.ts`)
- `MAX_ROWS = 48`, `MIN_ROWS = 16`, `TARGET_ROW_SPACING = 24` → zchry: `MIN=12`, `divisor=28`, no MAX (capped naturally by viewport)
- Test: `computeRows(900)` ≈ 32; `computeRows(28*12)` = 12; `computeRows(0)` = 12

**A2. Noise coefficients** (new `src/lib/wave-noise.ts`)
- Extract `computeNoise(t, row, time)` as pure function with zchry's exact 9-term sum
- Drop `rowPulse` (zchry doesn't have it)
- Test: golden values at known (t, row, time); test max bound

**A3. Sunset color function** (new `src/lib/sunset-color.ts`)
- 8-stop per-row interpolation, matching zchry's `sunsetRowColor` exactly
- Replace our `SUNSET_BACKGROUND_STOPS`/`SUNSET_RIDGE_STOPS` 11/9 stop arrays with zchry's 8 stops
- Test: golden values at rowT=0, 0.5, 1.0; clamping

**A4. Music note color** (extend `sunset-color.ts` or new `note-color.ts`)
- zchry's `musicNoteColor(midi, isDark)` with 7 stops in dark/light variants
- Test: clamping at midi=37, 95; midpoint interpolation

### Group B — State + drawing engine

**B5. CanvasState fields** (`canvas-engine.ts`)
- Add: `sunsetStrength: number` (0..1, default 0), `timeOffset` switched to `now * 0.0003` semantics
- Remove: `rowPulse` (already not in state, just in draw loop — confirm)
- Update `createCanvasState`

**B6. `drawFrame` rewrite** (`canvas-engine.ts`)
- DPR not in drawFrame (canvas resize handles it in CanvasHome)
- Wave loop changes:
  - `pointStride = (musicPlaying) ? 5 : 7` (replaces `/3`)
  - `maxAmpBase = w<640 ? w*0.14 : min(w,h)*0.12` (replaces `*0.2`/`*0.17`)
  - `verticalMult = pow(max(0, 1-verticalDist*1.6), 2)` (replaces `*1.45)^1.7`)
  - `topFade = r<20 ? r/20 : 1` (replaces curve)
  - Energy boost `1 + energy*0.3` (replaces `*0.85`)
- Sunset fill uses per-row `sunsetRowColor` (drops 34-stripe approach entirely)
- Stroke: add hover/mouseHover branches with 1.5px vs 1px and brightening
- Remove glow band restriction (middle-band-radius logic) — zchry lights up any row in `seqHoverRows`, not just center band
- Test: structural tests via mock ctx — assert fillStyle calls, gradient creation, alpha values for: (a) default row, (b) painted row with color, (c) painted row with "default", (d) chord/seq row with energy, (e) sunset row

**B7. Sunset strength flag** (`CanvasHome.tsx`)
- Update sunset toggle handler to set `state.sunsetStrength = active ? 1 : 0`
- Keep `sunsetMode` boolean for compatibility, but rendering reads `sunsetStrength`

### Group C — CanvasHome component

**C8. DPR scaling** (`CanvasHome.tsx:36`)
```ts
const resize = () => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  updateRows(state, computeRows(window.innerHeight));  // not height-52
};
```
- Drawable height = full `innerHeight` (no 52px offset)

**C9. Frame rate cap + time advancement** (`CanvasHome.tsx:115`)
```ts
let lastDrawTime = 0;
function animate() {
  const now = performance.now();
  const minFrameMs = state.musicPlaying ? 22 : 33;
  if (lastDrawTime > 0 && now - lastDrawTime < minFrameMs) {
    animFrameId = requestAnimationFrame(animate);
    return;
  }
  lastDrawTime = now;
  drawFrame(canvas, ctx, state, audio, (note) => emit('notePlayed', { note }));
  animFrameId = requestAnimationFrame(animate);
}
```
- `drawFrame` no longer does `timeOffset += 0.003`; instead uses `now * 0.0003` inside

**C10. Paint via gradient** (handled in B6, but worth tracking)
- Painted rows get `createLinearGradient(0, lineY, 0, lineY+fillExtend)` with rgba→transparent
- Gated on `rowAmp > 1` (only render when wave is peaking)

**C11. Hover stroke brightening** (handled in B6)

**C12. Point stride** (handled in B6)

## Test plan

**New tests:**
- `src/lib/wave-noise.test.ts` — golden values, monotonicity, bounds
- `src/lib/sunset-color.test.ts` — endpoint values, midpoint, clamping
- `src/lib/note-color.test.ts` — endpoint midis, midpoint, both themes
- `src/lib/canvas-engine.test.ts` — add structural tests for: sunset fill color, paint gradient creation, hover stroke 1.5px, chord row note-color fill
- `src/lib/song-data.test.ts` — update `computeRows` test with zchry divisor/bounds; update `MAX_ROWS`/`MIN_ROWS` references

**Update existing tests:**
- `src/lib/canvas-engine.test.ts` — the existing "painted row renders at full alpha" test encodes our flat-solid-fill behavior. Rewrite to assert zchry's gradient-gated behavior: fillStyle is a `CanvasGradient`, fill only happens when `rowAmp > 1`, gradient fades to transparent at bottom.

## TDD sequence (per group)

1. Write new test file → run → RED (file not found / exports missing)
2. Implement minimum to pass → run → GREEN
3. Commit `test: add reproducer for <X>` then `fix: <X>`
4. Move to next

For `drawFrame` rewrite (B6), one RED test covering all 5 render branches, then one GREEN pass implementing them all.

## Files touched

**New:**
- `src/lib/wave-noise.ts`
- `src/lib/wave-noise.test.ts`
- `src/lib/sunset-color.ts`
- `src/lib/sunset-color.test.ts`
- `src/lib/note-color.ts`
- `src/lib/note-color.test.ts`

**Modified:**
- `src/lib/song-data.ts` (row count constants + computeRows)
- `src/lib/song-data.test.ts` (update computeRows/MAX/MIN tests)
- `src/lib/canvas-engine.ts` (drawFrame rewrite, CanvasState additions, drop stripes)
- `src/lib/canvas-engine.test.ts` (rewrite paint test, add structural render tests)
- `src/components/CanvasHome.tsx` (DPR, frame rate cap, sunsetStrength wiring)

## Verification

- `bun test src/` — 80%+ coverage on touched files, all green
- `npm run build` — typechecks
- Manual: open `localhost:3000`, toggle music/sunset/paint, compare to zchry.org side-by-side
- Visual QA: ridges look bold not dense, lines crisp on Retina, paint appears with wave not as solid stripe, sunset gradient smooth not banded

## Out of scope

- Theremin (air mode) — zchry feature we don't have. Not asked to add.
- Spoken word mode — same.
- Chord display UI in header — separate feature.

## Risks

- Existing `CanvasHome` test for `CanvasToolbar` may break if event flow changes. Will re-run after each change.
- `MAX_ROWS = 48` change ripples — search showed only `song-data.ts` and `song-data.test.ts` reference it. Safe.
- Test infra: `bun test src/` already runs cleanly in 628ms. Should stay fast.
