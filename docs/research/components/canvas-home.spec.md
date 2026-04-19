# CanvasHome Specification

## Overview
- **Target file:** `src/components/CanvasHome.tsx`
- **Screenshot:** `docs/design-references/desktop-full.png`
- **Interaction model:** Mouse/touch drawing + audio-reactive canvas animation
- This is a `"use client"` component with heavy JS interactivity

## DOM Structure

```tsx
<canvas
  id="grid-canvas"
  style={{
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    cursor: 'crosshair',
    pointerEvents: 'auto'
  }}
/>
```

The canvas fills the entire viewport behind the header. The header has z-index: 50 and appears on top.

## Canvas Rendering

### Joy Division Waveform
Render a "Unknown Pleasures" style stacked waveform:
- 32-48 rows of waveform lines, evenly distributed vertically
- Each row is a curve defined by sine waves layered on top of each other
- The curve is FILLED beneath it (filled polygon), which occludes the row below it
- The fill color should be the page background (#0a0a0a in dark mode)
- The stroke color is var(--text-primary) (white in dark mode, ~opacity 0.7-1.0)
- Rows near the bottom of canvas have slightly taller amplitude

### Animation Loop
Use `requestAnimationFrame` for continuous animation:
```javascript
let timeOffset = 0;
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw background
  ctx.fillStyle = '#0a0a0a'; // (or current bg color)
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each row (bottom to top so top rows appear in front)
  for (let i = rows - 1; i >= 0; i--) {
    drawRow(i, timeOffset);
  }

  timeOffset += 0.005; // slow drift
  animFrameId = requestAnimationFrame(drawFrame);
}
```

### Row Drawing
```javascript
function drawRow(rowIndex, time) {
  const rowY = topPadding + rowIndex * rowSpacing;
  const baseAmplitude = 15 + (rowIndex / rows) * 25; // bigger toward bottom

  ctx.beginPath();
  ctx.moveTo(0, rowY);

  for (let x = 0; x <= canvas.width; x += 2) {
    const t = x / canvas.width;
    // Layered sine waves for organic look
    const y = rowY
      + Math.sin(t * Math.PI * 3 + time + rowIndex * 0.5) * baseAmplitude * 0.5
      + Math.sin(t * Math.PI * 7 + time * 1.3 + rowIndex * 0.3) * baseAmplitude * 0.3
      + Math.sin(t * Math.PI * 13 + time * 0.7 + rowIndex * 0.7) * baseAmplitude * 0.2
      + energy[rowIndex] * Math.sin(t * Math.PI * 2) * 30; // energy from drawing/music
    points.push({ x, y });
  }

  // Draw filled path (occludes rows below)
  ctx.lineTo(canvas.width, canvas.height + 50);
  ctx.lineTo(0, canvas.height + 50);
  ctx.closePath();
  ctx.fillStyle = bgColor; // #0a0a0a — this is the key "hiding" layer
  ctx.fill();

  // Draw the stroke on top
  ctx.beginPath();
  // re-trace the curve
  ctx.strokeStyle = strokeColor; // white, partial opacity
  ctx.lineWidth = 1.5;
  ctx.stroke();
}
```

### Energy System
- `energy[]` array, one value per row (0 to 1+)
- Decays each frame: `energy[i] *= 0.95`
- Mouse draw injects energy: `energy[rowUnderCursor] += 0.3`
- Music mode injects energy when notes play: `energy[noteRow] += noteVelocity`
- Energy bleeds to neighboring rows: `energy[i] += (energy[i-1] + energy[i+1]) * 0.02`

## Mouse/Touch Drawing

```javascript
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  handleDraw(e.clientX, e.clientY);
});
canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) handleDraw(e.clientX, e.clientY);
});
canvas.addEventListener('mouseup', () => { isDrawing = false; });

function handleDraw(clientX, clientY) {
  const rowIndex = Math.floor((clientY - topPadding) / rowSpacing);
  if (rowIndex < 0 || rowIndex >= rows) return;
  energy[rowIndex] = Math.min(energy[rowIndex] + 0.5, 3);
  // Play note
  if (soundEnabled) playNote(rowIndex);
  // Mark canvas as dirty (show clear button)
  setCanvasDirty(true);
}
```

### Note Mapping (pentatonic scale C3–C7)
```javascript
const PENTATONIC = ['C3','E3','G3','B3','D4','E4','G4','B4','D5','E5','G5','B5','D6','E6','G6','B6','D7','E7','G7'];
function rowToNote(rowIndex) {
  const noteIndex = rows - 1 - rowIndex; // top row = highest note
  return PENTATONIC[noteIndex % PENTATONIC.length];
}
```

## Audio System (soundfont-player)

Install: `npm install soundfont-player`

```javascript
import Soundfont from 'soundfont-player';

let player: Soundfont.Player | null = null;
const audioCtx = new AudioContext();

async function initAudio() {
  player = await Soundfont.instrument(audioCtx, 'acoustic_grand_piano', {
    soundfont: 'MusyngKite'
  });
}

function playNote(rowIndex: number) {
  if (!player || !soundEnabled) return;
  const note = rowToNote(rowIndex);
  player.play(note, audioCtx.currentTime, { duration: 0.5, gain: 1.0 });
}
```

## Music Mode (Where Is My Mind?)

The music mode plays a sequence of 527 MIDI notes encoding Maxence Cyrin's piano cover of Pixies' "Where Is My Mind?".

### Note Data
Include this array of notes. Each note is `[time_in_seconds, midi_pitch, velocity_0_to_1]`. The BPM is 80. Here is a representative subset (use the full 527 notes in production):

```javascript
const SONG_NOTES = [
  // [time, midiPitch, velocity] — 80 BPM
  [0.0, 64, 0.7], [0.0, 52, 0.5],
  [0.75, 62, 0.7], [0.75, 50, 0.5],
  [1.5, 60, 0.7], [1.5, 48, 0.5],
  [2.25, 59, 0.7],
  [3.0, 57, 0.7], [3.0, 45, 0.5],
  // ... continue pattern
  // For the clone, generate a simplified version or load from a JSON file
];
```

Since decoding the actual protobuf is complex, create `public/song.json` with the note data as a JSON array. The actual decoded notes from the site are not accessible, so generate a musically representative approximation at 80 BPM that plays for ~3-4 minutes.

### Playback Loop
```javascript
let musicStartTime = 0;
let musicPlaying = false;
let songNotes = SONG_NOTES;
let noteIndex = 0;

function tickMusic(elapsed: number) {
  if (!musicPlaying) return;
  while (noteIndex < songNotes.length && songNotes[noteIndex][0] <= elapsed) {
    const [, midiPitch, velocity] = songNotes[noteIndex];
    const note = midiToNoteName(midiPitch); // e.g. "C4", "E4"
    player?.play(note, audioCtx.currentTime, { duration: 0.4, gain: velocity });
    // Map midi pitch to row and inject energy
    const rowIndex = midiPitchToRow(midiPitch);
    energy[rowIndex] = Math.min(energy[rowIndex] + velocity, 3);
    noteIndex++;
  }
  if (noteIndex >= songNotes.length) {
    // Loop back
    noteIndex = 0;
    musicStartTime = performance.now() / 1000;
  }
}
```

### Chord Display
When notes play, update #header-chord: detect chord name from simultaneously playing notes. Show in header.

## Disco Mode
```javascript
let discoMode = false;
let discoHue = 0;

// In draw loop:
if (discoMode) {
  discoHue = (discoHue + 1) % 360;
  strokeColor = `hsl(${discoHue}, 100%, 70%)`;
} else {
  strokeColor = 'rgba(255, 255, 255, 0.85)';
}
```

## Sunset Mode
- Toggle `.sunset-active` class on `document.body`
- In dark mode: change bg to warm tones (#fff8e8), text to dark

## Color Palette
- `currentColor` state: starts as `rgba(255,255,255,0.85)` (default white)
- When user selects a swatch, `currentColor` changes
- The drawn stroke uses `currentColor`

## Event Listeners (from SiteHeader buttons)
Listen to custom window events:
```javascript
window.addEventListener('musicToggle', () => { musicPlaying = !musicPlaying; /* ... */ });
window.addEventListener('discoToggle', () => { discoMode = !discoMode; });
window.addEventListener('sunsetToggle', () => { /* toggle body class */ });
window.addEventListener('canvasClear', () => { energy.fill(0); setCanvasDirty(false); });
window.addEventListener('colorChange', (e) => { currentColor = (e as CustomEvent).detail.color; });
window.addEventListener('soundToggle', (e) => { soundEnabled = (e as CustomEvent).detail.enabled; });
```

## Implementation Notes
- `"use client"` component
- Initialize canvas size to `window.innerWidth × window.innerHeight`, resize on window resize
- Use `useEffect` for canvas setup, return cleanup that cancels RAF and removes listeners
- Install `soundfont-player`: `npm install soundfont-player`
- The AudioContext must be created in response to user gesture (click)
- Canvas `width` and `height` attributes must match CSS size (devicePixelRatio scaling optional)
- The component just renders `<canvas id="grid-canvas">` — all logic in useEffect
- Export default `CanvasHome`

## TypeScript
```typescript
// @types/soundfont-player may not exist; add declare module or use any
declare module 'soundfont-player';
```

Or install: `npm install --save-dev @types/soundfont-player` (if available)
