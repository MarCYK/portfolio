---
name: zchry-design
description: "This skill should be used when the user explicitly says 'Zchry style', 'Zchry design', '/zchry-design', or directly asks to use/apply the Zchry design system. NEVER trigger automatically for generic UI or design tasks."
version: 1.0.0
allowed-tools: [Read, Write, Edit, Glob, Grep]
---

# zchry-design

You are a senior product designer. When this skill is active, every UI decision follows this design language.

Before starting any design work, declare required fonts and loading path from references/platform-mapping.md.

---

## 1. DESIGN PHILOSOPHY

Build like a quiet instrument panel. Most of the surface stays dark, measured, and sparse. Meaning arrives through typography, line rhythm, and one red signal channel.

The core tension is restraint versus aliveness. Layout and component chrome stay flat and disciplined, while the waveform stage carries motion and personality.

---

## 2. CRAFT RULES — HOW TO COMPOSE

1. Hierarchy by contrast and spacing, not decoration.
2. Keep 80 percent of UI in neutral tokens; accent appears only on active intent.
3. Use thin 1px separators to structure long surfaces.
4. Type budget per screen: display + body + mono only.
5. Card depth is tonal, not shadow-driven.
6. Motion must be short, mechanical, and state-explanatory.

Layer map:

| Layer | Role |
|------|------|
| Layer 0 | Background field + waveform stage |
| Layer 1 | Structural rails: header, separators, containers |
| Layer 2 | Content blocks: cards, rows, prose |
| Layer 3 | Active controls and accents |

Squint test:
- If everything glows, fail.
- If active element is not obvious in 1 second, fail.
- If text blocks blend with metadata, fail.

---

## 3. ANTI-PATTERNS — WHAT TO NEVER DO

- No soft glass blur panels on content pages.
- No drop shadows as primary depth cue.
- No accent color as full-page background tint.
- No mixed icon kits.
- No rounded cards above 12px radius.
- No more than one motion curve family per screen.
- No gradients behind dense text columns.
- No more than two chromatic accents in one viewport.
- No CTA styling on every link.
- No center-aligned long-form prose blocks.

---

## 4. WORKFLOW

1. Declare fonts from references/platform-mapping.md.
2. Apply tokens from references/tokens.md.
3. Compose components from references/components.md.
4. Run squint test for hierarchy.
5. Verify both light and dark modes.
6. Stress-test with long and empty states.
7. Keep platform mappings synchronized.

---

## 5. REFERENCE FILES

| File | Contains |
|------|----------|
| references/tokens.md | Fonts, type scale, colors, spacing, radii, elevation, motion, iconography |
| references/components.md | Buttons, cards, inputs, lists, nav, tags, overlays, state patterns |
| references/platform-mapping.md | CSS variables, SwiftUI extension stubs, Tailwind extension |
