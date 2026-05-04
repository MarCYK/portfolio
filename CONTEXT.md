# Portfolio Context

## Purpose

This project is a personal portfolio built with Next.js App Router, React, TypeScript, and Tailwind CSS. It has two primary product surfaces:

- an interactive landing page canvas surface
- content-driven interior routes for biography, projects, and writing

Use this document for project vocabulary, operating assumptions, and architectural boundaries.

## Core Terms

- **canvas surface**: the interactive home page experience rendered by `src/app/page.tsx`, `src/components/CanvasHome.tsx`, and `src/lib/canvas-engine.ts`
- **interior routes**: non-home pages rendered as editorial content surfaces under `about`, `projects`, and `words`
- **page shell**: shared interior chrome composed by `src/components/PageShell.tsx`, including header, mobile menu, scroll container, and footer
- **canvas context**: typed cross-component event channel in `src/contexts/CanvasContext.tsx`
- **project entry**: structured project content stored in `src/data/projects.ts` and resolved by slug on `src/app/projects/[slug]/page.tsx`
- **writing entry**: structured writing content stored in `src/data/posts.ts` and resolved by slug on `src/app/words/[slug]/page.tsx`
- **design references**: visual source material under `docs/design-references/`, especially `docs/design-references/zchry-design/`
- **research docs**: inspection output and inventories under `docs/research/`

## Route Model

- `/` renders landing page canvas surface
- `/about` renders biography page
- `/projects` renders projects index
- `/projects/[slug]` renders project detail page
- `/words` renders writing index
- `/words/[slug]` renders writing detail page

## Architectural Boundaries

- `src/app/` owns route entry points, metadata, and top-level composition
- `src/components/` owns UI surfaces and shared interactive components
- `src/contexts/` owns shared state and typed event channels
- `src/data/` owns static content and navigation definitions
- `src/lib/` owns rendering logic, helpers, and audio behavior
- `src/types/` owns shared TypeScript interfaces and declarations

## Interaction Model

Canvas-related cross-component interactions flow through `CanvasContext.tsx`. New shared controls should use `useCanvas()` rather than ad hoc window-scoped custom events.

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

## Content Model

- projects live in `src/data/projects.ts`
- writing entries live in `src/data/posts.ts`
- primary navigation lives in `src/data/navigation.ts`
- shared content types live in `src/types/index.ts`

Update content source files before changing slug route logic.

## Design Direction

- landing page should preserve canvas-led identity
- interior routes should read as editorial content surfaces, not app dashboards
- current reference direction comes from `zchry-design` materials under `docs/design-references/`
- repo also contains research docs that describe existing tokens, components, and topology

## Operational Constraints

- run development and verification commands from repo root
- primary commands are `bun run dev`, `bun run lint`, `bunx tsc --noEmit`, `bun run build`, and `bun run start`
- production build outputs to `.next/`
- static export is not configured; treat deployment as server-rendered Next.js unless build setup changes
- Vercel is default deployment target

## Change Heuristics

- changes to landing page interaction usually start in `CanvasHome.tsx`, `CanvasContext.tsx`, `canvas-engine.ts`, `audio.ts`, or `song-data.ts`
- changes to interior layout usually start in `layout.tsx`, `PageShell.tsx`, `SiteHeader.tsx`, `MobileMenu.tsx`, or `SiteFooter.tsx`
- changes to project or writing pages usually start in `src/data/` plus corresponding route files
- when naming concepts in docs, tests, or issues, prefer terms defined in this file over loose synonyms
