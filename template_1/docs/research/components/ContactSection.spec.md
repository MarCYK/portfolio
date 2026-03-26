# ContactSection Specification

## Overview
- **Target file:** `src/components/ContactSection.tsx`
- **Screenshot:** `docs/design-references/desktop-full.png` (bottom section)
- **Interaction model:** static with hover on CTA link

## DOM Structure
```
section.c-contact
├── div#home-contact-top [first paragraph block, right-aligned]
│   └── p.c-sans.c-sans--right.c-sans--color-2
│       ├── span.c-sans__line.c-sans__line--0
│       │   └── span.c-sans__line__content ["I am currently working /"]
│       ├── span.c-sans__line.c-sans__line--1
│       │   └── span.c-sans__line__content ["alongside agencies from /"]
│       ├── span.c-sans__line.c-sans__line--2
│       │   └── span.c-sans__line__content ["all over the world in a /"]
│       └── span.c-sans__line.c-sans__line--3
│           └── span.c-sans__line__content ["freelance capacity."]
│
├── a.c-link.c-link--contact [CTA link "→ Contact me"]
│   └── "→ Contact me"
│
└── div#home-contact-bottom [second paragraph block, right-aligned]
    └── p.c-sans.c-sans--right.c-sans--color-2
        ├── span.c-sans__line.c-sans__line--0
        │   └── span.c-sans__line__content ["Seeking to partner with /"]
        ├── span.c-sans__line.c-sans__line--1
        │   └── span.c-sans__line__content ["agencies and designers /"]
        └── span.c-sans__line.c-sans__line--2
            └── span.c-sans__line__content ["on an ongoing basis."]
```

## Computed Styles (exact values from getComputedStyle)

### div#home-contact-top, div#home-contact-bottom
- text-align: right
- margin-top: ~2rem (32px) from previous section
- Letter-spacing overrides:
  - .c-sans__line--0: letter-spacing: -0.02em
  - .c-sans__line--1: letter-spacing: -0.035em

### p.c-sans (same as hero/bio)
- font-family: "neue-haas-grotesk-display", serif
- font-weight: 600
- color: #bababa (dark) / #5c5c5c (light)
- text-align: right

### span.c-sans__line__content (contact lines)
- Same base styles as BioSection
- Font size: JS-calculated to fill right side (~28–40px at desktop)
- line-height: 1em
- letter-spacing: -0.0325em (varies per line as noted above)
- color: #bababa

### a.c-link (CTA)
- font-family: "code-saver", sans-serif
- font-weight: 400
- font-size: 0.75rem (12px)
- color: #aec6f6 (dark) / #2756c9 (light)
- text-decoration: none
- transition: color 0.25s
- display: block
- text-align: right
- padding-right: 1rem
- margin: 1rem 0

### a.c-link:hover
- color: #eaeaea (dark) / #282828 (light)

## States & Behaviors

### Hover on CTA
- Before: color #aec6f6
- After: color #eaeaea
- Transition: color 0.25s

## Assets
None

## Text Content (verbatim)

### Contact Top (#home-contact-top):
- "I am currently working /"
- "alongside agencies from /"
- "all over the world in a /"
- "freelance capacity."

### CTA: "→ Contact me" → href: "/contact"

### Contact Bottom (#home-contact-bottom):
- "Seeking to partner with /"
- "agencies and designers /"
- "on an ongoing basis."

## Responsive Behavior
- **Desktop (1440px):** Right-aligned text at ~28–36px; "→ Contact me" CTA between the two blocks
- **Tablet (768px):** Still right-aligned, smaller text
- **Mobile (390px):** Full width, right-aligned

## Implementation Notes
- This component sits at the bottom of the page content
- Add bottom padding (~4rem) after the last block so content doesn't hit the nav bar
- The letter-spacing variation creates a visually balanced right-edge alignment
