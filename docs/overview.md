# Portfolio Project Overview

A personal portfolio site built with Next.js, featuring an interactive canvas-based music visualizer on the homepage.

## Tech Stack

- **Framework**: Next.js 13.5+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Audio**: soundfont-player (MusyngKite soundfont)
- **Icons**: lucide-react

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Homepage (canvas + header)
│   ├── about/
│   ├── projects/
│   └── words/
├── components/             # React components
│   ├── CanvasHome.tsx     # Full-screen canvas visualizer
│   ├── PageShell.tsx       # Shared page layout wrapper
│   ├── SiteHeader.tsx       # Navigation + theme/sound controls
│   ├── header/             # Header sub-components
│   │   ├── CanvasToolbar.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── SoundToggle.tsx
│   └── ...
├── lib/                   # Core utilities
│   ├── canvas-engine.ts    # Canvas rendering + music scheduling
│   ├── canvas-events.ts    # Typed event bus for canvas/header comms
│   ├── audio.ts            # Audio context management
│   ├── projects.ts         # Project data lookup
│   └── song-data.ts        # MIDI note data + helpers
├── data/                  # Static data
│   ├── constants.ts        # Shared constants (email, etc.)
│   ├── projects.tsx        # Project list (with JSX icons)
│   ├── posts.ts            # Blog posts
│   └── navigation.ts       # Navigation links
└── types/                 # TypeScript type definitions
    └── index.ts
```

## Key Features

### Homepage Canvas
- Full-screen canvas rendering an animated waveform (Joy Division-inspired)
- Draws 30 rows that respond to mouse/touch interaction
- Each row corresponds to a piano note (pentatonic scale)
- Supports music playback that triggers row animations in sync
- **Effects**: Disco mode (color cycling), Sunset mode (warm palette), Custom color palette
- Interactions: Click/touch to draw, clear canvas, toggle sound

### Theme System
- Light/dark mode toggle (persisted in localStorage)
- CSS variables for theming (`--bg-primary`, `--text-primary`, etc.)
- Broadcasts theme changes to canvas engine

### Pages
- **About**: Personal info, contact links, details about the piano/waveform implementation
- **Projects**: Current and archived projects, internal project detail pages
- **Words**: Blog/writing archive with posts and post detail pages

## Development

### Local Setup

```bash
cd /home/marcyk/Documents/GITHUB/portfolio/src
bun install
bun dev    # Runs on http://localhost:3000
bun build  # Production build
```

### Project Structure Notes

- `src/` is the actual Next.js project root (contains `package.json`, `tsconfig.json`)
- Components are focused and small (< 300 lines each)
- Custom event bus (`canvas-events.ts`) decouples header controls from canvas
- Data separation: Data files contain content, lib files contain lookup logic

### Canvas Implementation

The canvas uses `requestAnimationFrame` loop:
1. `drawFrame()` clears canvas and redraws all rows with sine-wave noise
2. Row energy decays over time, bleeds into adjacent rows
3. Music notes trigger energy spikes when played
4. State is mutated in-place for performance (double-buffering not needed for this use case)

### Event Communication

Header controls and canvas communicate via typed custom events:
- `themeChange` - Light/dark theme switch
- `soundToggle` - Enable/disable sound
- `musicToggle` - Start/stop music playback
- `discoToggle` - Enable/disable disco color cycling
- `sunsetToggle` - Enable/disable sunset warm palette
- `canvasClear` - Reset canvas energy
- `colorChange` - Select custom brush color
- `canvasDirty` - Notify header that canvas has drawings
- `menuToggle` - Open/close mobile menu

See `lib/canvas-events.ts` for event definitions.

## Deployment

Production build outputs to `.next/` directory (excluded from git).
Deploy via Vercel or any static host supporting Next.js.
