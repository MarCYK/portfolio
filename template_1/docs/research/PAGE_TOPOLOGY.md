# Page Topology — finethought.com.au

Mapped via Puppeteer DOM inspection on 2026-03-27.

---

## URL Structure

| URL | Page | Type |
|-----|------|------|
| `https://finethought.com.au/` | Home / Portfolio Index | SSG |
| `/project/[slug]/` | Project detail pages | SSG (dynamic) |
| `/contact` | Contact page | SSG |
| `/profile` (likely) | Profile/About page | SSG |

Known project slugs: `arthur-g`, `assembly-talent`, `black-fridye`, `bloomingdales-lighting`, `junglefy`, `kuwaii`, `more-air`, `provider-store`, `stanislava-pinchuck`, `studio-massive`, `the-gallery`

---

## Page Title

```
//--- Fine Thought ---//
```

---

## Overall Layout Architecture

The site uses a **code editor metaphor** for its entire UI. Two persistent layers:

### Layer 1: GUI Shell (`.c-gui`) — Fixed, full viewport
The outermost fixed container simulating a desktop IDE/editor application:

```
.c-gui [position: fixed, full viewport, z: auto]
├── .c-gui__panel--info [hidden by default, slides in as sidebar]
│   └── Contains profile/contact editor content panels
└── .c-gui__panel--main [full viewport on mobile, right panel on desktop]
    ├── nav.c-gui__panel__header [tab bar at top]
    │   ├── .c-gui__panel__header__tabs
    │   │   └── .c-gui__panel__header__tabs__tab [e.g. "fine-thought.js"]
    │   ├── button.--light-mode [sun icon, toggles light mode]
    │   └── button.--sidebar [panel icon, toggles info sidebar]
    └── main.c-gui__panel__content [scrollable content area]
        └── .c-page [the scrollable page content]
```

### Layer 2: Page Content (`.c-page`) — Absolutely positioned, scrollable
The actual page content inside the main panel:

```
.c-page [position: absolute, overflow-y: scroll, no scrollbar]
└── .c-page__inner [flex, full height of content (~3570px at 1440px)]
    ├── .c-page__lines-column [28px wide, line number gutter]
    │   └── p.c-mono-type--line-nums [sequential line numbers 1..N]
    ├── .c-page__content-column [remaining width]
    │   └── .c-page__background [all visual content]
    │       ├── h1.c-sans [hero title]
    │       ├── h2.c-sans.c-sans--large [large display subtitle]
    │       ├── p.c-sans [skills heading]
    │       ├── p.c-sans [skills content area]
    │       ├── div.c-ascii [ASCII art decoration]
    │       ├── p.c-sans [projects heading]
    │       ├── p.c-sans [projects list (interactive)]
    │       ├── a.c-sans [contact CTA button]
    │       ├── p.c-sans [contact top text]
    │       └── p.c-sans [contact bottom text]
    ├── div.c-interactive [full-height overlay, z:100, handles hover events]
    ├── div/a.c-interactive__link (×11) [invisible hover hit areas for each project row]
    │   └── div.c-interactive__link__lines-column [line numbers for that row]
    └── a.c-interactive__link.--foreground (×11) [actual navigable link elements per project]
```

---

## Home Page Sections (top to bottom, scroll order)

### Section 1: Hero — "Web engineer & creative coder"
- **ID:** (no ID, top of `.c-page__background`)
- **Element:** `H1.c-sans.c-sans--color-2`
- **Content:** "Web engineer / & creative coder" (two lines)
- **Position:** Top-left, spans approximately 2 of 6 columns
- **Font:** neue-haas-grotesk-display, weight 600
- **Color:** `#bababa` (color-2 in dark mode)

### Section 2: Display Title — "Fine Thought"
- **ID:** `#home-subtitle`
- **Element:** `H2.c-sans.c-sans--large.c-sans--right.c-sans--color-2`
- **Content:** "Fine" (line 1) / "Thought" (line 2)
- **Position:** Right-aligned, massive display size (~228-319px computed), bleeds off right edge
- **Font:** neue-haas-grotesk-display, weight 600
- **Color:** `#bababa` (slightly translucent, fades into background)
- **Computed height:** ~510px section

### Section 3: Intro Bio
- **ID:** `#home-intro`
- **Element:** `P.c-sans.c-sans--right.c-sans--color-2` (two paragraphs — skill heading + bio)
- **Content:**
  - Skill heading: (appears as "Skills" section label)
  - Bio: "The creative persona / of Nathan Leigh Davis, / a creative technologist & / front-end web engineer / based in Victoria (AU)"
- **Position:** Right-aligned below "Fine Thought" display text
- **Includes:** "→ View profile" CTA link (arrow with text)
- **Computed height:** ~300px

### Section 4: ASCII Divider
- **Element:** `DIV.c-ascii`
- **Content:** ASCII art using `/`, `-`, `=`, `+`, `*` characters
- **Purpose:** Visual separation between bio and skills/projects
- **Font:** code-saver, monospace

### Section 5: Skills Section
- **ID:** (within content column, labeled "Skills" in display text)
- **Content displayed as code editor panel:**
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
- **Background heading "Skills":** Large display text (same size as "Fine Thought")

### Section 6: Projects List
- **ID:** `#home-projects` (inferred)
- **Content displayed as code editor panel:**
  ```
  SELECTED PROJECTS
  ==================
  WEBSITE              / DESIGN              / CMS / PLATFORM       / TECH
  ----------------------+---------------------+----------------------+------------------
  → Arthur G           / Latitude Group      / WooCommerce          / Next.js + PHP
  → Assembly Talent    / Katrina Tesoriero   / WordPress + JobAdder / Next.js + PHP
  → Black Fridye       / For Good Design Lab / Shopify              / HTML5/SCSS/JS + Liquid
  → Bloomingdales      / Latitude Group      / WooCommerce + MYOB   / React + PHP
  → Junglefy           / For Good Design Lab / Craft                / Next.js
  → Kuwaii             / Fine Thought        / Shopify              / HTML5/SCSS/JS + Liquid
  → More Air           / More Air            / Sanity               / Next.js
  → Provider Store     / For Good Design Lab / Shopify              / HTML5/SCSS/JS + Liquid
  → Stanislava Pinchuck / Beth Wilkinson Studio / WordPress         / HTML5/SCSS/JS + PHP
  → Studio Massive     / Latitude Group      / WordPress            / React + PHP
  → The Gallery        / The Gallery         / WordPress            / React + PHP
  ```
- **Background heading "Projects":** Large display text (same treatment as "Skills")
- **Hover behavior:** Each row is interactive — hovering highlights the row with blue tint overlay and shows project preview media floating on the right side (`.c-interactive__previews`)

### Section 7: Contact
- **ID:** `#home-contact-top` + `#home-contact-bottom`
- **Content:**
  - Top: "I am currently working / alongside agencies from / all over the world in a / freelance capacity."
  - Bottom: "Seeking to partner with / agencies and designers / on an ongoing basis."
  - CTA: "→ Contact me" link (routes to `/contact`)
- **Position:** Right-aligned, sans display font
- **Color:** `#bababa` (color-2)

---

## Info Sidebar Panel (`.c-gui__panel--info`)

Hidden by default. Toggled via the sidebar button in the tab bar. Contains:

1. **Profile section** (`.c-gui__panel__section`)
   - Tab: `profile.js` or similar
   - Content: Editor view of profile/bio text
   - Includes window component with project preview

2. **Contact section** (`.c-gui__panel__section`)
   - Tab: `contact.js` or similar
   - Content: Editor view of contact details

---

## Featured Work Component

The `.c-featured-work` component is a full-screen overlay that appears when hovering over project rows:
- Contains a `.c-gallery` for cycling through project preview slides
- Has a `.c-featured-work__hover-media` layer with video autoplay on hover
- Includes a `.c-featured-work__link` with blue highlight text "→ View project"
- Filters the hover video to grayscale then transitions in

---

## Page Load / Cover

- `.c-cover` is a full-viewport overlay (`#282828`) that covers the page during initial JS load
- Once `state-site-loaded` is added to `<html>`, cover fades out:
  ```css
  .state-site-loaded .c-cover {
    opacity: 0;
    left: -9999px;
    transition: opacity 0.5s, left 0s linear 0.5s;
  }
  ```

---

## Responsive Behavior

### Desktop (≥ 1024px / 64rem)
- `.c-gui` uses `flex-direction: row` — main panel and info panel side-by-side
- Info panel is `25rem` (400px) wide when open
- Line number gutter: 1.75rem (28px)
- Nav height: 1.6875rem (27px)
- The "Fine Thought" display text is enormous (~300px+), bleeding off right edge

### Tablet (760px–1024px / 47.5rem–64rem)
- `.c-gui` uses `flex-direction: column-reverse` — nav bar at bottom, content above
- Info panel opens as full-width bottom drawer
- No transition on GUI panel (instant)
- Line number gutter still visible
- Nav height: 2.25rem (36px)

### Mobile (< 760px / 47.5rem)
- `.c-gui` width: `calc(200% + 1px)` offset to left — GUI panel slides in from right
- `.state-info-open` class brings it into view with `left: 0` transition
- Line number gutter: 1.75rem (28px)
- Nav height: 2.25rem (36px)
- Type scale: columns use 3 mobile columns vs 5 desktop columns
- "Fine" and "Thought" still appear as large display text but at reduced size

---

## Context Menu

A custom right-click context menu (`.c-gui__context-menu`) with links styled as code-like options. Background: `#282828`, border: `#5e5e5e`, hover: `#2756c9` tint.

---

## Navigation / Routing

All navigation is client-side. Links use Next.js `<Link>` components with page cover transitions:
- `.c-page__cover` fades in before navigation
- On new page load, cover fades out
- Transition timing: `opacity 0.25s` in, `left 0s + opacity 0.25s` out

---

## Key DOM IDs

| ID | Content |
|----|---------|
| `#home-intro` | Bio intro text block |
| `#home-subtitle` | "Fine Thought" large display title |
| `#home-contact-top` | "I am currently working..." |
| `#home-contact-bottom` | "Seeking to partner with..." |
| `#__next` | Next.js root mount |
| `#__NEXT_DATA__` | SSG data JSON |

---

## Data Architecture

The page data is embedded as static JSON in `__NEXT_DATA__` script tag. Structure:
```json
{
  "props": {
    "pageProps": {
      "data": [{ ...projectData }],
      "globalData": [{ featured, profile_text, contact_text }]
    }
  }
}
```

Project data keys: `id`, `slug`, `title`, `type`, `subtitle`, `intro`, `projects`, `previews`, `skills`, `contact_top/bottom`
