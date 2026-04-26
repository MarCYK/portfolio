# zchry-design — Tokens

## 0. PRIMITIVES

### Color ramps

Neutral (cool-neutral)

| Step | Hex |
|------|-----|
| 50 | #FAFAFA |
| 100 | #F5F5F5 |
| 200 | #EEEEEE |
| 300 | #E5E5E5 |
| 400 | #A3A3A3 |
| 500 | #737373 |
| 600 | #525252 |
| 700 | #3D3D3D |
| 800 | #2A2A2A |
| 900 | #111111 |
| 950 | #0A0A0A |

Brand (signal red)

| Step | Hex |
|------|-----|
| 50 | #FFE3E3 |
| 100 | #FFC7C7 |
| 200 | #FF9B9B |
| 300 | #FF8181 |
| 400 | #FF5A5A |
| 500 | #FF0000 |
| 600 | #E60000 |
| 700 | #BF0000 |
| 800 | #990000 |
| 900 | #7A0000 |
| 950 | #3D0000 |

Status

| Color | 50 | 500 | 900 |
|------|-----|-----|-----|
| Red | #FEE2E2 | #EF4444 | #7F1D1D |
| Green | #DCFCE7 | #22C55E | #14532D |
| Amber | #FEF9C3 | #EAB308 | #78350F |

Spacing primitives: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

Radii primitives: 0, 4, 8, 12, 999

---

## 1. TYPOGRAPHY

### Font stack

| Role | Font | Fallback | Use |
|------|------|----------|-----|
| Display | Soehne | Inter, system-ui, sans-serif | Headings, major labels |
| Body | Soehne | Inter, system-ui, sans-serif | Body, navigation, metadata |
| Mono | IBM Plex Mono | ui-monospace, monospace | Code chips, technical states |

Mono rules:
- mono_for_code: true
- mono_for_metrics: false

Reasoning: site uses mono for code and system-flavored snippets but keeps prices, dates, and list values in sans.

### Type scale

| Token | Size | Line height | Letter spacing | Weight | Use |
|------|------|-------------|----------------|--------|-----|
| --display | 30px | 1.2 | -0.025em | 600 | Page titles |
| --heading | 24px | 1.33 | -0.02em | 600 | Major sections |
| --subheading | 18px | 1.56 | -0.015em | 600 | Subsections |
| --body | 16px | 1.5 | 0 | 400 | Paragraphs |
| --body-sm | 14px | 1.43 | 0 | 400 | Supporting text |
| --caption | 12px | 1.33 | 0 | 400 | Dates, footnotes |
| --label | 12px | 1.5 | 0.05em | 600 | Uppercase micro labels |

---

## 2. COLOR SYSTEM (SEMANTIC)

### Light

| Token | Hex |
|------|-----|
| --background | #FAFAFA |
| --bg | var(--background) |
| --surface1 | #FAFAFA |
| --surface2 | #F5F5F5 |
| --surface3 | #EEEEEE |
| --border | #E5E5E5 |
| --border-visible | #A3A3A3 |
| --text1 | #0A0A0A |
| --text2 | #525252 |
| --text3 | #737373 |
| --text4 | #A3A3A3 |
| --accent | #FF0000 |
| --accent-subtle | #FFE3E3 |
| --success | #22C55E |
| --warning | #EAB308 |
| --error | #EF4444 |

### Dark

| Token | Hex |
|------|-----|
| --background | #0A0A0A |
| --bg | var(--background) |
| --surface1 | #111111 |
| --surface2 | #2A2A2A |
| --surface3 | #3D3D3D |
| --border | #2A2A2A |
| --border-visible | #3D3D3D |
| --text1 | #FAFAFA |
| --text2 | #A3A3A3 |
| --text3 | #525252 |
| --text4 | #737373 |
| --accent | #FF0000 |
| --accent-subtle | #3D0000 |
| --success | #22C55E |
| --warning | #EAB308 |
| --error | #EF4444 |

Color usage rules:
- Keep prose and list text on text2.
- Reserve text1 for headings, active nav, and key values.
- Accent only for active intent, selected state, or critical signal.
- Border-visible only for focused controls and hard separators.

---

## 3. SPACING

| Token | Value | Use |
|------|-------|-----|
| --space-2xs | 2px | Optical trim |
| --space-xs | 4px | Tight icon spacing |
| --space-sm | 8px | Small control padding |
| --space-md | 16px | Default block gap |
| --space-lg | 24px | Card rhythm |
| --space-xl | 32px | Section inner spacing |
| --space-2xl | 48px | Section margins |
| --space-3xl | 64px | Major separation |
| --space-4xl | 96px | Hero/feature spacing |

---

## 4. BORDERS & RADII

| Token | Value | Use |
|------|-------|-----|
| --radius-element | 4px | Chips, mini controls |
| --radius-control | 8px | Inputs, buttons |
| --radius-component | 12px | Cards, rows |
| --radius-container | 12px | Modals/sheets |
| --radius-pill | 999px | Tags/badges |

Border strategy:
- Cards: 1px solid var(--border)
- Inputs: 1px solid var(--border-visible) on focus
- Tags: 1px solid var(--border)
- Modals: 1px solid var(--border)

Corner philosophy: rectangular discipline with soft edges only where interaction requires it.

---

## 5. ELEVATION

Flat system. No drop shadows as primary depth.

| Level | Light | Dark | Use |
|------|-------|------|-----|
| 0 | none | none | Base surfaces |
| 1 | none | none | Cards |
| 2 | none | none | Menus/popovers |
| 3 | none | none | Modals/sheets |

Depth comes from surface steps and border contrast.

---

## 6. MOTION

Personality: mechanical, deliberate, short.

| Type | Duration | Easing | Use |
|------|----------|--------|-----|
| Micro | 150ms | cubic-bezier(.4,0,.2,1) | Hover, icon fill swap |
| Standard | 200ms | cubic-bezier(.4,0,.2,1) | Row/card transitions |
| Emphasis | 200ms | cubic-bezier(.4,0,.2,1) | Menu/sheet reveal |

Interaction states:
- Hover: text/line contrast increase.
- Active: slight tonal compression, no bounce.
- Focus: border-visible + 2px accent outline.
- Disabled: opacity 0.4 and static pointer.

---

## 7. ICONOGRAPHY

Observed style:
- Thin outline utility glyphs, around 1.5px
- Soft corner terminals
- Geometric with light humanist bends
- Minimal interior detail

Fallback kit:
- Kit: Tabler Icons Webfont
- Weight: Outline
- Match score: high
- CDN: https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.41.1/dist/tabler-icons.min.css
- Prefix: ti ti-

Match reasoning: Tabler keeps thin stroke consistency and pragmatic utility semantics close to observed production glyphs.

Disclaimer: preview icons are best-match fallback, not proprietary originals.
