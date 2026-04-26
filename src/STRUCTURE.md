# src/ Folder Structure

A Next.js 13 portfolio site (App Router) built with React 18, TypeScript, and Tailwind CSS. Uses Bun as the package manager.

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Inter + IBM Plex Mono fonts, dark mode)
│   ├── page.tsx                # Home page — renders SiteHeader, MobileMenu, CanvasHome
│   ├── globals.css             # Global styles (Tailwind imports + custom CSS)
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── projects/
│   │   └── page.tsx            # Projects listing page
│   └── words/
│       └── page.tsx            # Blog/words listing page
│
├── components/                 # React components
│   ├── CanvasHome.tsx          # Canvas-based animated home visualization (client-only, dynamically imported)
│   ├── MobileMenu.tsx          # Mobile navigation menu
│   ├── ProjectCard.tsx         # Card component for individual projects
│   ├── SiteHeader.tsx          # Site header/navigation bar
│   ├── SiteFooter.tsx          # Site footer
│   └── icons.tsx               # SVG icon components
│
├── data/                       # Static data
│   ├── navigation.ts           # Nav links: Projects, Words, About
│   ├── projects.tsx            # Project entries (title, description, date, href, icon)
│   └── posts.ts                # Blog post entries (recent + archive)
│
├── lib/                        # Utility/engine modules
│   ├── audio.ts                # Audio playback via soundfont-player
│   ├── canvas-engine.ts        # Canvas rendering engine for home animation
│   └── song-data.ts            # Musical note/MIDI data for the canvas visualization
│
├── types/                      # TypeScript type definitions
│   ├── index.ts                # Project and Post interfaces
│   └── soundfont-player.d.ts   # Type declarations for soundfont-player
│
├── public/                     # Static assets
│   └── favicon.png
│
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies and scripts
├── bun.lock                    # Bun lockfile
└── .eslintrc.json              # ESLint configuration
```

## Key Architectural Patterns

### Layer Boundaries

1. **Data Layer** (`data/`): Pure data, no UI concerns, no React imports
   - `projects.ts`: Exports project data with icon keys (strings), not React components
   - `types/index.ts`: Interfaces use `string` for icon, not `ReactNode`

2. **UI Layer** (`components/`): Pure UI, imports data/lib as needed
   - `icons.tsx`: Maps icon keys to Lucide React components
   - `ProjectCard.tsx`: Renders project using icon map lookup

3. **Context Layer** (`contexts/`): Cross-component state without window globals
   - `CanvasContext.tsx`: Event bus replacing `window` CustomEvent API

4. **Business Logic Layer** (`lib/`): Pure utilities, no UI dependencies
   - `canvas-engine.ts`: Canvas rendering logic
   - `audio.ts`: Audio playback state

### Client-Only Components

The home page canvas is loaded client-side only via `next/dynamic` with `ssr: false`.

### Event Architecture

Canvas controls use React context instead of window events:
- Components emit events via `emit(eventName, detail)`
- Components subscribe via `on(eventName, handler)` returning unsubscribe function
- Clean, typed event map with TypeScript interfaces

## Migration from Window Events

Previously used `window.addEventListener` with CustomEvent API for cross-component communication:
- Replaced with `CanvasContext` provider pattern
- All canvas events now typed and scoped to React component tree
- No global window event listeners (safer for SSR and testing)
