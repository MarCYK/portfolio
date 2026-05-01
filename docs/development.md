# Development Guide

## Local Setup

### Requirements

- Bun 1.3.10 or newer
- A Node.js-compatible environment for Next.js 16
- MemPalace CLI only if you use the memory scripts

### Install Dependencies

```bash
bun install
```

### Common Commands

```bash
bun run dev
bun run lint
bunx tsc --noEmit
bun run build
bun run start
```

`bun run dev` starts the site on `http://localhost:3000` by default.

## Repository Layout

The repository root holds the Bun, Next.js, TypeScript, and ESLint
configuration. Application source lives in `src/`.

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
├── package.json
└── tsconfig.json
```

## Routing

- App Router entry points live in `src/app/`.
- The landing page is `src/app/page.tsx`.
- Section index pages live in `src/app/about/`, `src/app/projects/`,
  and `src/app/words/`.
- Detail pages live in `src/app/projects/[slug]/` and
  `src/app/words/[slug]/`.

### Adding a New Page

1. Create `src/app/<route>/page.tsx`.
2. Export a default page component.
3. Add `metadata` when the route needs a custom title or description.
4. Update `src/data/navigation.ts` if the route belongs in the main nav.

## Shared Layout

Use `PageShell` for routes that should render the shared header, mobile
menu, scroll container, and footer.

```tsx
import PageShell from '@/components/PageShell';

export default function ExamplePage() {
  return (
    <PageShell>
      <section>{/* page content */}</section>
    </PageShell>
  );
}
```

The landing page is the exception. It passes `isHomePage` so the canvas
surface can control its own composition.

## Canvas Interaction Model

Canvas state and cross-component events live in
`src/contexts/CanvasContext.tsx`. New controls should use `useCanvas()`
instead of window-scoped custom events.

```tsx
'use client';

import { useCanvas } from '@/contexts/CanvasContext';

export function ClearButton() {
  const { emit } = useCanvas();

  return (
    <button type="button" onClick={() => emit('canvasClear', undefined)}>
      Clear canvas
    </button>
  );
}
```

For rendering and audio behavior, start with these files:

- `src/components/CanvasHome.tsx`
- `src/lib/canvas-engine.ts`
- `src/lib/audio.ts`
- `src/lib/song-data.ts`

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

## Content and Navigation

- Projects live in `src/data/projects.ts`.
- Writing entries live in `src/data/posts.ts`.
- Main navigation links live in `src/data/navigation.ts`.
- Shared types live in `src/types/index.ts`.

Project and writing detail routes resolve content by slug, so update the
data files first before changing route logic.

## MemPalace Workflow

Keep repo files and project conversations in separate wings.

```bash
bun run memory:project:init
bun run memory:project:mine

MEMPALACE_CONVOS_DIR=/absolute/path/to/transcripts \
  bun run memory:convos:split
MEMPALACE_CONVOS_DIR=/absolute/path/to/transcripts \
  bun run memory:convos:mine
```

Conventions:

- Repo files mine into wing `portfolio`.
- Conversation transcripts mine into wing `wing_portfolio`.
- Do not mine portfolio transcripts into wing `sessions`.
- Local Claude Code hook ingestion now derives `wing_<project>` from the
  transcript path, so portfolio chats land in `wing_portfolio`.

## Verification

Before shipping a change, run the command set above and check the main
user flows.

- Home page loads and the canvas responds.
- Header controls and the mobile menu still work.
- About, Projects, Words, and at least one slug page load cleanly.
- Theme, sound, and canvas controls still respond after navigation.

## Troubleshooting

### Port 3000 Already In Use

On macOS or Linux:

```bash
lsof -i :3000
kill <pid>
```

On Windows:

```powershell
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```
