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

## Key Patterns

- **App Router**: All pages use the Next.js 13 App Router convention (`app/` directory with `page.tsx` files).
- **Client Components**: The home page canvas is loaded client-side only via `next/dynamic` with `ssr: false`.
- **Shared Layout**: Subpages (about, projects, words) share SiteHeader, SiteFooter, and MobileMenu components.
- **Audio + Canvas**: The home page features an interactive canvas visualization with audio playback driven by MIDI/pentatonic note data.
