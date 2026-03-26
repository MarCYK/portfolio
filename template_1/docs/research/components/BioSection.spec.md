# BioSection Specification

## Overview
- **Target file:** `src/components/BioSection.tsx`
- **Screenshot:** `docs/design-references/desktop-full.png` (below "Fine Thought")
- **Interaction model:** static with hover on CTA link

## DOM Structure
```
div#home-intro [right-aligned, below display title]
├── p.c-sans.c-sans--right.c-sans--color-2 [bio text]
│   ├── span.c-sans__line.c-sans__line--0
│   │   └── span.c-sans__line__content ["The creative persona /"]
│   ├── span.c-sans__line.c-sans__line--1
│   │   └── span.c-sans__line__content ["of Nathan Leigh Davis, /"]
│   ├── span.c-sans__line.c-sans__line--2
│   │   └── span.c-sans__line__content ["a creative technologist & /"]
│   ├── span.c-sans__line.c-sans__line--3
│   │   └── span.c-sans__line__content ["front-end web engineer /"]
│   └── span.c-sans__line.c-sans__line--4
│       └── span.c-sans__line__content ["based in Victoria (AU)"]
│
└── a.c-link [CTA link]
    ├── span.c-sans__line__content ["→"] OR SVG ArrowRightIcon
    └── span ["View profile"]
```

## Computed Styles (exact values from getComputedStyle)

### div#home-intro
- text-align: right (applied via .c-sans--right)
- margin-top: ~2rem (32px) after display title
- padding-right: 1rem (matches page background padding)

### p.c-sans bio text
- font-family: "neue-haas-grotesk-display", serif
- font-weight: 600
- color: #bababa (dark) / #5c5c5c (light)
- text-align: right

### span.c-sans__line__content (bio lines)
- font-size: 1.4em — but actual rendered size is ~28px–40px (JS-calculated to fill right side)
- letter-spacing varies per line:
  - line--0: letter-spacing: -0.02em
  - line--1: letter-spacing: -0.035em
  - Others: -0.0325em (default)
- line-height: 1em
- margin-top: -0.1175em
- white-space: nowrap
- color: #bababa (dark) / #5c5c5c (light)
- transition: color 0.25s

### a.c-link (CTA)
- display: inline-flex
- align-items: center
- gap: 0.375rem (6px)
- font-family: "code-saver", sans-serif
- font-weight: 400
- font-size: 0.75rem (12px)
- color: #aec6f6 (dark) / #2756c9 (light)
- text-decoration: none
- cursor: pointer
- transition: color 0.25s
- margin-top: ~1rem

### a.c-link:hover
- color: #eaeaea (dark) / #282828 (light)

## States & Behaviors

### Hover on CTA link
- **Before:** color: #aec6f6 (dark)
- **After:** color: #eaeaea (dark)
- **Transition:** color 0.25s

## Assets
- Icons: ArrowRightIcon (or just use → text character) from icons.tsx

## Text Content (verbatim)
Bio lines:
1. "The creative persona /"
2. "of Nathan Leigh Davis, /"
3. "a creative technologist & /"
4. "front-end web engineer /"
5. "based in Victoria (AU)"

CTA: "→ View profile" (links to /profile)

## Responsive Behavior
- **Desktop (1440px):** Right-aligned, bio at ~28–36px per line
- **Tablet (768px):** Still right-aligned, smaller text
- **Mobile (390px):** Full width, right-aligned, smaller text
