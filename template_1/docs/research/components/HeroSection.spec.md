# HeroSection Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Screenshot:** `docs/design-references/desktop-full.png` (top section)
- **Interaction model:** static (no interaction — purely visual)

## DOM Structure
```
div.c-page__background [position: relative, padding: 0.5rem 1rem]
├── h1.c-sans.c-sans--color-2 [hero title]
│   ├── span.c-sans__line.c-sans__line--0
│   │   └── span.c-sans__line__content ["Web engineer /"]
│   └── span.c-sans__line.c-sans__line--1
│       └── span.c-sans__line__content ["& creative coder"]
│
├── h2.c-sans.c-sans--large.c-sans--right.c-sans--color-2 [display title — "Fine Thought"]
│   ├── span.c-sans__line.c-sans__line--0
│   │   └── span.c-sans__line__content ["Fine"]
│   └── span.c-sans__line.c-sans__line--1
│       └── span.c-sans__line__content ["Thought"]
│
└── [Bio section continues below — separate component]
```

## Computed Styles (exact values from getComputedStyle)

### div.c-page__background
- position: relative
- padding: 0.5rem 1rem (8px 16px)

### h1.c-sans (hero title)
- font-family: "neue-haas-grotesk-display", serif
- font-weight: 600
- margin: 0
- color: #bababa (dark) / #5c5c5c (light)
- transition: color 0.25s

### span.c-sans__line
- display: block
- overflow: hidden

### span.c-sans__line__content (hero h1 lines)
- display: block
- font-family: "neue-haas-grotesk-display", serif
- font-weight: 600
- letter-spacing: -0.0325em
- line-height: 1em
- font-size: 1.4em (relative to parent — JS will override for large display)
- margin-top: -0.1175em
- white-space: nowrap
- color: #bababa (dark) / #5c5c5c (light)
- transition: color 0.25s

### h2.c-sans--large (display title)
- Same font properties as h1
- text-align: right
- The font-size of .c-sans__line__content inside this is JS-calculated
  to fill the container width (~228px–319px at 1440px viewport)
- Actual computed size at 1440px: ~280px
- Position: within document flow (NOT absolute) — the content scrolls OVER it
- overflow: hidden (clips the right-bleeding text)
- margin-top: ~1rem (16px) after the h1

## States & Behaviors

### JS Type Scale System
- **Trigger:** Component mount + window resize
- **Mechanism:** A hidden measurement element (c-guides__sans) renders "M" in neue-haas-grotesk-display
- **Calculation:** Measure the width of "M", then calculate what font-size would make a string of Ns fill the container width
- **Implementation:** useEffect + ResizeObserver
  - For hero h1: size is set to fill ~4-5 column widths at ~60–80px
  - For "Fine Thought" display: size fills the full content column width (~280px)
  - CSS variable `--ft-display-size` is set on the element or inline style
- **Simplified implementation approach for clone:**
  - Use a fixed large size (clamp(80px, 20vw, 280px)) for "Fine Thought"
  - Use a fixed medium size (clamp(40px, 5vw, 70px)) for hero h1
  - This won't be pixel-perfect but will be visually similar
  - Ideally: implement ResizeObserver + canvas text measurement

## Assets
- None (typography only)

## Text Content (verbatim)
- H1 line 1: "Web engineer /"
- H1 line 2: "& creative coder"
- H2 line 1: "Fine"
- H2 line 2: "Thought"

## Responsive Behavior
- **Desktop (1440px):** H2 "Fine Thought" at ~280px, bleeds off right edge, clipped by overflow:hidden
- **Tablet (768px):** Reduced size, roughly ~160px for "Fine"/"Thought"
- **Mobile (390px):** Even smaller, ~80–100px for "Fine"/"Thought"
- **Breakpoint:** Continuous scale via clamp() or ResizeObserver

## Notes
- This component does NOT include the large background display text (that's a separate layer)
- The H2 sits in document flow — the bio/content below it naturally follows
- The "Fine Thought" text OVERFLOWS to the right edge intentionally (overflow: hidden on container clips it)
