# ProjectsList Specification

## Overview
- **Target file:** `src/components/ProjectsList.tsx`
- **Screenshot:** `docs/design-references/desktop-full.png` (projects section)
- **Interaction model:** hover-driven (mouse hover on rows shows project preview)

## DOM Structure
```
section.c-projects [position: relative]
├── div.c-editor [projects table header]
│   └── pre.c-editor-table [table headers + separator]
│
├── div.c-projects__rows [list of project rows]
│   └── [×11 project rows, each:]
│       div.c-projects__row
│           └── pre.c-editor-table.c-projects__row__text
│               [formatted project row as monospaced text]
│
└── div.c-interactive [absolutely positioned overlay, full height]
    └── [×11 .c-interactive__link elements, absolutely positioned]
        ├── div.c-interactive__link__lines-column [line number area]
        ├── div.c-interactive__link--background [blue highlight overlay]
        └── [hover detection area]
```

## Computed Styles (exact values from getComputedStyle)

### section.c-projects
- position: relative
- margin-top: ~2rem

### div.c-editor / pre.c-editor-table
(same as SkillsSection — see that spec)
- font-family: "code-saver", sans-serif
- font-size: 0.75rem (12px)
- line-height: 0.9375rem (15px)
- color: #898989 (dark)
- white-space: pre

### div.c-interactive__link
- position: absolute
- left: 0
- right: 0
- height: 0.9375rem (15px, 1 line height per row)
- display: flex
- cursor: pointer
- pointer-events: auto
- z-index: 100

### div.c-interactive__link__lines-column
- width: 1.75rem (28px)
- flex-shrink: 0

### div.c-interactive__link--background (highlight overlay)
- position: absolute
- inset: 0
- background-color: #2756c9 (dark) / #aec6f6 (light)
- mix-blend-mode: soft-light (dark) / multiply (light)
- opacity: 0 — default
- opacity: 1 — .state-active
- transition: opacity 0.25s

## States & Behaviors

### Row hover — HOVER-DRIVEN (NOT scroll)
- **Trigger:** mouseenter on .c-interactive__link (only when .state-mouse-events on html)
- **State A (default):**
  - .c-interactive__link--background: opacity 0
  - Line numbers for row: color #898989 (muted)
  - .c-interactive__previews: opacity 0
- **State B (hovered):**
  - .c-interactive__link--background: opacity 1 (blue tint via mix-blend-mode: soft-light)
  - Line numbers for row: color #eaeaea (bright)
  - .c-interactive__previews: opacity 1
  - Featured work media: fades in and plays video
- **Transition:** opacity 0.25s on all elements
- **Implementation approach:** React onMouseEnter/onMouseLeave + activeProjectIndex state

### Preview panel
- Position: fixed, right: 2rem, top: 50%, transform: translateY(-50%)
- Width: 480px (max 33vw)
- Shows project image + video loop
- Aspect ratio: 16/9
- Box shadow: 0 0 1rem rgba(0,0,0,0.5)
- Border radius: 0.25rem
- On hover: image always visible, video fades in OVER image with grayscale → color transition
  - Video filter: grayscale(1) initially, transitions to grayscale(0) after 0.4s

## Per-Project Content

### Project data (verbatim from site):
```
{ title: "Arthur G",           design: "Latitude Group",         cms: "WooCommerce",                 tech: "Next.js + PHP" }
{ title: "Assembly Talent",    design: "Katrina Tesoriero",      cms: "WordPress + JobAdder",         tech: "Next.js + PHP" }
{ title: "Black Fridye",       design: "For Good Design Lab",    cms: "Shopify",                      tech: "HTML5/SCSS/JS + Liquid" }
{ title: "Bloomingdales",      design: "Latitude Group",         cms: "WooCommerce + MYOB",           tech: "React + PHP" }
{ title: "Junglefy",           design: "For Good Design Lab",    cms: "Craft",                        tech: "Next.js" }
{ title: "Kuwaii",             design: "Fine Thought",           cms: "Shopify",                      tech: "HTML5/SCSS/JS + Liquid" }
{ title: "More Air",           design: "More Air",               cms: "Sanity",                       tech: "Next.js" }
{ title: "Provider Store",     design: "For Good Design Lab",    cms: "Shopify",                      tech: "HTML5/SCSS/JS + Liquid" }
{ title: "Stanislava Pinchuck",design: "Beth Wilkinson Studio",  cms: "WordPress",                    tech: "HTML5/SCSS/JS + PHP" }
{ title: "Studio Massive",     design: "Latitude Group",         cms: "WordPress",                    tech: "React + PHP" }
{ title: "The Gallery",        design: "The Gallery",            cms: "WordPress",                    tech: "React + PHP" }
```

### Table header (verbatim):
```
SELECTED PROJECTS
==================
WEBSITE              / DESIGN              / CMS / PLATFORM       / TECH
----------------------+---------------------+----------------------+------------------
```

### Row format (verbatim pattern):
```
→ Arthur G           / Latitude Group      / WooCommerce          / Next.js + PHP
```
Each row is padded to align columns at:
- Website col: 20 chars
- Design col: 20 chars
- CMS col: 21 chars
- Tech col: remaining

### Project slugs (for URLs):
arthur-g, assembly-talent, black-fridye, bloomingdales-lighting, junglefy, kuwaii, more-air, provider-store, stanislava-pinchuck, studio-massive, the-gallery

### Preview image paths (after asset download):
`/images/[SlugCamelCase]-Home-Loop-1280x720.jpg`
Examples:
- `/images/ArthurG-Home-Loop-1280x720.jpg`
- `/images/AssemblyTalent-Home-Loop-1280x720.jpg`
etc.

### Preview video paths:
`/videos/[SlugCamelCase]-Home-Loop-480.mp4`
Examples:
- `/videos/ArthurG-Home-Loop-480.mp4`
etc.

## Assets
- Project preview images: `/images/[Project]-Home-Loop-1280x720.jpg`
- Project preview videos: `/videos/[Project]-Home-Loop-480.mp4`

## Responsive Behavior
- **Desktop (1440px):** Full 4-column table visible; preview panel floats right at fixed position
- **Tablet (768px):** Table scrollable horizontally if needed; preview panel hidden or positioned differently
- **Mobile (390px):** Preview panel hidden (display: none); table scrollable

## Implementation Notes
- Use `position: relative` on the table container
- The hover rows are positioned ABSOLUTELY over the rendered text rows
- Calculate each row's `top` position based on line-height × row-index + header offset
- The table text and the interactive overlay are SEPARATE DOM layers
- For the preview: render a fixed-position panel outside the table DOM
- IMPORTANT: Only show hover effects when .state-mouse-events is active (check via context or prop)
