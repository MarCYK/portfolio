# Source Structure

This document covers the code under `src/` only. Repository-level config
and static assets live one level above in the project root.

```text
src/
├── app/
│   ├── about/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── projects/page.tsx
│   ├── projects/[slug]/page.tsx
│   ├── words/page.tsx
│   └── words/[slug]/page.tsx
├── components/
│   ├── header/CanvasToolbar.tsx
│   ├── header/SoundToggle.tsx
│   ├── header/ThemeToggle.tsx
│   ├── CanvasHome.tsx
│   ├── MobileMenu.tsx
│   ├── PageShell.tsx
│   ├── ProjectCard.tsx
│   ├── SiteFooter.tsx
│   ├── SiteHeader.tsx
│   └── icons.tsx
├── contexts/
│   └── CanvasContext.tsx
├── data/
│   ├── constants.ts
│   ├── navigation.ts
│   ├── posts.ts
│   └── projects.ts
├── lib/
│   ├── audio.ts
│   ├── canvas-engine.ts
│   ├── canvas-events.ts
│   ├── projects.ts
│   └── song-data.ts
└── types/
    ├── index.ts
    └── soundfont-player.d.ts
```

## Boundary Rules

- `app/` owns route entry points, metadata, and top-level composition.
- `components/` owns presentational and interactive UI pieces.
- `contexts/` owns shared cross-component state and typed event channels.
- `data/` owns static content and navigation definitions.
- `lib/` owns behavior, helpers, and rendering logic.
- `types/` owns shared TypeScript interfaces and declarations.

## Current Interaction Model

`CanvasContext.tsx` is the active event layer for canvas-related controls.
Use `emit()` and `on()` from `useCanvas()` for new interactions that span
header controls, the landing page canvas, and shared UI state.

If you are touching animation or audio behavior, start with these files:

- `components/CanvasHome.tsx`
- `contexts/CanvasContext.tsx`
- `lib/canvas-engine.ts`
- `lib/audio.ts`
- `lib/song-data.ts`

## Notes

- Static assets live in the repository root `public/` directory, not in
  `src/`.
- Framework config files such as `next.config.js`, `tsconfig.json`, and
  `eslint.config.mjs` live in the repository root.
