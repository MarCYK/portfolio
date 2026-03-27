# Portfolio Project Memory

## Project Structure
- Working dir: `/Users/marvinchin/Documents/GitHub/portfolio/template_2`
- Framework: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4
- UI: shadcn/ui + Radix primitives, `cn()` utility in `src/lib/utils.ts`
- Icons: Custom SVGs in `src/components/icons.tsx` (Phosphor icon paths)

## Completed Clones

### zchry.org clone (branch: marvin/fine-thought)
- 4 pages: `/` (Joy Division canvas), `/projects`, `/words`, `/about`
- Key files:
  - `src/components/CanvasHome.tsx` — interactive canvas with soundfont-player audio
  - `src/components/SiteHeader.tsx` — nav with canvas controls (home page only)
  - `src/components/MobileMenu.tsx` — full-screen mobile overlay
  - `src/components/SiteFooter.tsx` — footer with logo/links
  - `src/components/ProjectCard.tsx` — project card with hover arrow
  - `src/components/icons.tsx` — all Phosphor SVG icons
  - `src/app/globals.css` — full design tokens (dark/light), component CSS classes
- Design: dark mode (#0a0a0a bg, #fafafa text), Inter + IBM Plex Mono fonts
- scroll pattern: body overflow-hidden, scroll inside `#scroll-root`
- Custom events: musicToggle, discoToggle, sunsetToggle, canvasClear, colorChange, soundToggle, canvasDirty, menuToggle

## Workflow Patterns

### Clone workflow
1. Use Chrome MCP for recon (screenshots, CSS extraction, behavior sweep)
2. Write spec files to `docs/research/components/`
3. Build foundation (globals.css tokens, layout.tsx fonts, types/, icons.tsx) in main branch
4. Dispatch builder agents in parallel worktrees for each component/page
5. Merge and verify `npm run build`
6. QA agent does visual comparison and fixes

### TypeScript closure fix pattern
When `useRef<T>(null)` values are used in nested functions inside `useEffect`, TypeScript loses null narrowing. Fix:
```typescript
const canvasEl = canvasRef.current;
if (!canvasEl) return;
const canvas: HTMLCanvasElement = canvasEl; // explicit non-nullable type
```

## User Preferences
- Prefers concise responses
- No emojis
