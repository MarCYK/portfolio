# SkillsSection Specification

## Overview
- **Target file:** `src/components/SkillsSection.tsx`
- **Screenshot:** `docs/design-references/desktop-full.png` (middle section)
- **Interaction model:** static (code editor table display, no interaction)

## DOM Structure
```
section.c-skills
├── div.c-ascii [ASCII divider before skills]
│   └── pre text [divider pattern]
│
└── div.c-editor [skills table as code]
    └── pre.c-editor-table
        ├── span.c-editor-table__header ["PROFESSIONAL SKILLS"]
        ├── span.c-editor-table__label ["===================="]
        ├── span.c-editor-table__header [column headers]
        ├── span.c-editor-table__label [separator dashes]
        └── [skill rows — each row is a line of monospaced text]
```

## Computed Styles (exact values from getComputedStyle)

### div.c-ascii
- font-family: "code-saver", sans-serif
- font-weight: 400
- font-size: 0.75rem (12px)
- line-height: 0.9375rem (15px)
- color: #898989 (dark) / #919191 (light)
- white-space: pre
- transition: color 0.25s

### div.c-editor / pre.c-editor-table
- font-family: "code-saver", sans-serif
- font-weight: 400
- font-size: 0.75rem (12px)
- line-height: 0.9375rem (15px)
- color: #898989 (dark) / #919191 (light)
- white-space: pre
- overflow-x: auto
- transition: color 0.25s

### .c-editor-table__header
- color: #bababa (dark) / #5c5c5c (light)
- font-weight: 500

### .c-editor-table__label
- color: #575757 (dark) / #c5c5c5 (light)

## States & Behaviors
N/A — static display

## Assets
None

## Text Content (verbatim)

### ASCII Divider (before skills section):
```
//-----------------------------------------------------------//
//                                                           //
//  * * * * * * * * * * * * * * * * * * * * * * * * * * *   //
//                                                           //
//-----------------------------------------------------------//
```

### Skills Table:
```
PROFESSIONAL SKILLS
====================
DEVELOPMENT        / CMS PLATFORM      / DESIGN            / ADMIN
-------------------+-------------------+-------------------+---------
Next.js / React    / WordPress         / Figma             / GitHub
HTML5 / SCSS       / WooCommerce       / Adobe XD          / Trello
PHP                / Sanity            / Webflow           / Asana
Liquid             / Craft             / Photoshop         / Slack
JavaScript         / Shopify           / Illustrator       / Acrobat
```

## Responsive Behavior
- **Desktop (1440px):** Full 4-column layout visible without horizontal scroll
- **Tablet (768px):** May require horizontal scroll on the pre block; overflow-x: auto
- **Mobile (390px):** Horizontally scrollable pre block; consider reducing font size slightly

## Notes
- The skills content is displayed as a literal ASCII table using monospace font
- The column separator is ` / ` (space-slash-space)
- Row separator between header and data uses `---+---+---+---` pattern
- Use `<pre>` wrapped in a scrollable container for mobile
- The "PROFESSIONAL SKILLS" heading uses the .c-editor-table__header color (#bababa)
- The `====================` line uses .c-editor-table__label color (#575757)
