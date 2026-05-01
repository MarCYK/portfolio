# Portfolio Project Overview

This repository contains a personal portfolio built with Next.js 16,
React 18, TypeScript, and Tailwind CSS. The landing page is an
interactive canvas surface, while the interior routes are content-driven
editorial pages for projects, writing, and biography.

## Stack

- Next.js 16.2.4 with the App Router
- React 18
- TypeScript 5
- Tailwind CSS 3
- `soundfont-player` for audio playback
- `lucide-react` for iconography

## Repository Shape

The repo root contains framework configuration and public assets. App code
lives in `src/`.

```text
portfolio/
├── docs/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── data/
│   ├── lib/
│   └── types/
├── next.config.js
├── package.json
└── tsconfig.json
```

## Route Model

- `src/app/page.tsx` renders the landing page.
- `src/app/about/page.tsx` renders the biography page.
- `src/app/projects/page.tsx` renders the projects index.
- `src/app/projects/[slug]/page.tsx` renders project detail routes.
- `src/app/words/page.tsx` renders the writing index.
- `src/app/words/[slug]/page.tsx` renders writing detail routes.

## Major Subsystems

### Layout and Navigation

- `src/app/layout.tsx` loads fonts, global styles, and `CanvasProvider`.
- `src/components/PageShell.tsx` composes shared chrome for interior pages.
- `src/components/SiteHeader.tsx` and `src/components/MobileMenu.tsx`
    drive navigation.
- `src/components/SiteFooter.tsx` renders the shared footer on non-home
    routes.

### Canvas Surface

- `src/components/CanvasHome.tsx` owns the landing page canvas surface.
- `src/lib/canvas-engine.ts` contains the rendering behavior.
- `src/lib/audio.ts` and `src/lib/song-data.ts` handle sound playback and
    note timing.
- `src/contexts/CanvasContext.tsx` is the active typed event channel for
    cross-component canvas interactions.

Current canvas events:

- `themeChange`
- `soundToggle`
- `musicToggle`
- `spokenToggle`
- `airToggle`
- `airStatus`
- `sunsetToggle`
- `paintToggle`
- `canvasClear`
- `canvasDirty`
- `colorChange`
- `menuToggle`
- `notePlayed`

### Content Sources

- `src/data/projects.ts` stores current and archived project content.
- `src/data/posts.ts` stores writing content and slug lookup helpers.
- `src/data/navigation.ts` stores the primary nav links.
- `src/types/index.ts` defines shared content types.

### Design and Research Inputs

- `docs/design-references/` holds visual reference material, including the
    current `zchry-design` package.
- `docs/research/` stores inspection output, inventories, and token notes
    used to understand the existing site.

## Operational Notes

- Build, lint, and type-check commands run from the repository root.
- Production builds output to `.next/` at the repository root.
- Static export is not configured. Treat this as a server-rendered Next.js
    app unless the build setup changes.
