# Projects Page Specification

## Overview
- **Target files:**
  - `src/app/projects/page.tsx` — Projects page
  - `src/components/ProjectCard.tsx` — Individual project card
- **Screenshot:** `docs/design-references/projects-desktop.png`
- **Interaction model:** Static grid with hover effects. Cards are links.

## Page Layout

```tsx
// src/app/projects/page.tsx
<body> has class "dark" (always dark mode)
The scroll happens in #scroll-root (handled by layout)

Page structure:
<div className="flex-1 pb-20 sm:pb-24">
  <div className="work-grid-page px-6 sm:px-8">
    <header className="pt-12 sm:pt-20 pb-10 sm:pb-14">
      <h1>Projects</h1>
      <p>Things I've built / building.</p>
    </header>

    {/* Current projects grid */}
    <div className="project-grid">
      <ProjectCard {...erebus} />
      <ProjectCard {...wvrk} />
      <ProjectCard {...milton} />
    </div>

    {/* Archive header */}
    <div className="px-0 py-8 sm:py-12 flex items-baseline gap-3">
      <h2>Archive (2020–2023)</h2>
      <span>Mostly nonsense preserved for posterity</span>
    </div>

    {/* Archive grid */}
    <div className="project-grid">
      <ProjectCard {...workLibrary} />
      <ProjectCard {...lissajous} />
      <ProjectCard {...manufacturedHuman} />
      <ProjectCard {...solipsism} />
      <ProjectCard {...roamByLand} />
      <ProjectCard {...absurdly} />
    </div>
  </div>
</div>
<SiteFooter />
```

## Page Header Styles
- h1: font-size 30px (text-3xl with sm:), font-weight 600, letter-spacing -0.025em, margin-bottom 12px, color: var(--text-primary)
- p: font-size 14px, color: var(--text-secondary) = #a3a3a3

## Archive Section Header
- Container: padding-top/bottom 32px (sm: 48px), display flex, align-items baseline, gap 12px
- h2: font-size 18px (text-lg), font-weight 600, letter-spacing -0.025em, color: var(--text-primary)
- span: font-size 12px, font-weight 400, color: var(--text-tertiary) = #525252

## ProjectCard Component

### Props
```typescript
interface ProjectCardProps {
  title: string;
  description: string;
  date: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
}
```

### Structure
```tsx
<a
  href={href}
  target={external ? "_blank" : undefined}
  rel={external ? "noopener noreferrer" : undefined}
  className="project-card group"
>
  <div className="card-icon">
    {icon}  {/* 28px SVG icon */}
  </div>
  <div className="flex flex-col flex-1">
    <div className="flex items-center gap-2 mb-2">
      <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <ArrowUpRightIcon
        className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-y-0.5 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200"
        style={{ color: 'var(--text-secondary)' }}
      />
    </div>
    <p
      className="text-sm leading-relaxed mb-4"
      style={{ color: 'var(--text-secondary)' }}
    >
      {description}
    </p>
    <p
      className="text-xs mt-auto"
      style={{ color: 'var(--text-tertiary)' }}
    >
      {date}
    </p>
  </div>
</a>
```

### ProjectCard Computed Styles
- Container padding: 40px all sides
- flex-direction: column
- background: var(--bg-card) = #111111 dark
- border-right: 1px solid var(--border) (except last card in row)
- hover: background: var(--bg-card-hover) = #1a1a1a
- transition: background-color 0.2s

- Card icon box: 48x48px, border-radius 12px, border 1px solid var(--border)
- Card icon box hover: border-color: var(--border-hover), box-shadow: subtle
- Icon inside: 28px (w-7 h-7), color: var(--text-secondary) = #a3a3a3

- h2 (card title): 16px, weight 600, line-height 24px, color: var(--text-primary)
- p (description): 14px, weight 400, line-height approx 21px (leading-relaxed), color: var(--text-secondary)
- p (date): 12px, color: var(--text-tertiary) = #525252

### Arrow icon behavior
- Default state: opacity 0, transform: translate(-2px, -2px) — invisible, offset slightly
- Hover state (via group-hover): opacity 1, transform: translate(0, 0)
- Transition: all 0.2s

## Project Data

### Current Projects
```typescript
const currentProjects = [
  {
    title: "erebus.org",
    description: "A cognition primitive.",
    date: "March 2026",
    href: "https://erebus.org",
    external: true,
    icon: <MoleculeIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: "wvrk.org",
    description: "A laboratory for experimental AI work.",
    date: "February 2026",
    href: "https://wvrk.org/",
    external: true,
    icon: <FlaskIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: "Milton",
    description: "An LLM trained on Paradise Lost and nothing else.",
    date: "February 2026",
    href: "/projects/milton",
    external: false,
    icon: <BookOpenIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
];
```

### Archive Projects
```typescript
const archiveProjects = [
  {
    title: "Work Library™",
    description: "A curated collection of rare and interesting books, shared on Instagram and TikTok.",
    date: "September 2023",
    href: "https://www.instagram.com/worklibrary/",
    external: true,
    icon: <InstagramLogoIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: "Lissajous Curves",
    description: "A Figma plugin for drawing Lissajous curves as live stroke vectors.",
    date: "June 2023",
    href: "https://www.figma.com/community/plugin/1232402036106953267/Lissajous-Curves",
    external: true,
    icon: <FigmaLogoIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: "Manufactured Human",
    description: "A DALL·E powered exploration of our perceptions of reality, presented without context.",
    date: "June 2022",
    href: "https://manufacturedhuman.webflow.io/",
    external: true,
    icon: <GlobeIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: "Solipsism Wow!",
    description: "A marketing campaign to promote the joyful philosophical concept of Solipsism — the idea that only one's mind is sure to exist.",
    date: "March 2022",
    href: "https://solipsism.webflow.io/",
    external: true,
    icon: <BrainIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: "Roam By Land",
    description: "An outdoor adventure journal documenting trips and time spent in nature.",
    date: "June 2021",
    href: "https://www.instagram.com/roambyland",
    external: true,
    icon: <CompassIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: "Absurdly",
    description: "Existentialism as a Service.",
    date: "June 2020",
    href: "/projects/absurdly",
    external: false,
    icon: <SmileyIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
];
```

## Project Grid Styles (.project-grid)
- display: grid
- grid-template-columns: repeat(3, 1fr)
- border: 1px solid var(--border) = #2a2a2a
- border-radius: 12px
- overflow: hidden
- width: 100% (fills work-grid-page container up to 1280px)

## Responsive Behavior
- Desktop (≥1440px): 3-column grid, cards 426px each
- Tablet (768px): still 3-column but narrower cards
- Mobile (<768px): 1-column stack
  - CSS: `.project-grid { grid-template-columns: 1fr; }`
  - Cards: padding reduces to 24px, border-right removed, border-bottom added between cards
  - Last card: no border-bottom

## Import Requirements
```typescript
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import ProjectCard from '@/components/ProjectCard';
import {
  MoleculeIcon, FlaskIcon, BookOpenIcon,
  InstagramLogoIcon, FigmaLogoIcon, GlobeIcon,
  BrainIcon, CompassIcon, SmileyIcon,
  ArrowUpRightIcon
} from '@/components/icons';
```

## TypeScript
Run `npx tsc --noEmit` before finishing to verify no type errors.
