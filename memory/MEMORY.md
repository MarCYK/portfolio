# Portfolio Project Memory

## Project Structure
- Working dir: `/Users/marvinchin/Documents/GitHub/portfolio/src`
- Framework: Next.js 13 (App Router), React 18, TypeScript, Tailwind CSS v3
- Package manager: Bun (`bun.lock`, packageManager: bun@1.3.10)
- Icons: Custom SVGs in `src/components/icons.tsx` (Phosphor icon paths)
- Fonts: Inter + IBM Plex Mono (Google Fonts via next/font)

## Current Site (branch: marvin/fine-thought)
- 4 pages: `/` (Joy Division canvas), `/projects`, `/words`, `/about`
- Key files:
  - `components/CanvasHome.tsx` — interactive canvas with soundfont-player audio (client-only, dynamic import)
  - `components/SiteHeader.tsx` — nav with canvas controls (home page only)
  - `components/MobileMenu.tsx` — full-screen mobile overlay
  - `components/SiteFooter.tsx` — footer with logo/links
  - `components/ProjectCard.tsx` — project card with hover arrow
  - `components/icons.tsx` — all Phosphor SVG icons
  - `app/globals.css` — design tokens, component CSS classes
  - `data/` — navigation.ts, projects.tsx, posts.ts (static data)
  - `lib/` — audio.ts, canvas-engine.ts, song-data.ts (canvas/audio engine)
- Design: dark mode (#0a0a0a bg, #fafafa text)
- Scroll pattern: body overflow-hidden, scroll inside page
- Custom events: musicToggle, discoToggle, sunsetToggle, canvasClear, colorChange, soundToggle, canvasDirty, menuToggle

## TypeScript Patterns
When `useRef<T>(null)` values are used in nested functions inside `useEffect`, TypeScript loses null narrowing. Fix:
```typescript
const canvasEl = canvasRef.current;
if (!canvasEl) return;
const canvas: HTMLCanvasElement = canvasEl; // explicit non-nullable type
```

## User Preferences
- Prefers concise responses
- No emojis
