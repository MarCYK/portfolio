# Design Tokens — finethought.com.au

Extracted via Puppeteer + CSS analysis on 2026-03-27.

---

## Colors

### Dark Mode (Default)

| Role | Hex | RGB |
|------|-----|-----|
| Background (body, page) | `#282828` | `rgb(40, 40, 40)` |
| Background (darker elements, context menu) | `#2b2b2b` | `rgb(43, 43, 43)` |
| Background (panel header) | `#3c3c3c` | `rgb(60, 60, 60)` |
| Border / dividers | `#5e5e5e` | `rgb(94, 94, 94)` |
| Border (faint, inside panel) | `#3a3a3a` | `rgb(58, 58, 58)` |
| Text primary (headings, featured) | `#eaeaea` | `rgb(234, 234, 234)` |
| Text secondary (tabs, nav labels) | `#bababa` | `rgb(186, 186, 186)` |
| Text muted / line numbers / monotype | `#898989` | `rgb(137, 137, 137)` |
| Text faint (extra muted) | `#575757` | `rgb(87, 87, 87)` |
| Text "faded" (nearly hidden, large title bg) | `#222` | `rgb(34, 34, 34)` |
| Accent / links / active tabs | `#aec6f6` | `rgb(174, 198, 246)` |
| Accent strong (hover states, link bg) | `#2756c9` | `rgb(39, 86, 201)` |
| Interactive highlight overlay | `#85abf2` | `rgb(133, 171, 242)` |
| Editor code attribute color | `#f09364` / `#ef9364` | `rgb(240, 147, 100)` |
| Editor notice background tint | `#fbf3b2` | `rgb(251, 243, 178)` |
| Cover/loader overlay | `#282828` | same as bg |

### Light Mode (triggered by `.state-light-mode`)

| Role | Hex | RGB |
|------|-----|-----|
| Background | `#fff` | `rgb(255, 255, 255)` |
| Panel header | `#eef2f9` | `rgb(238, 242, 249)` |
| Border | `#d6e2fb` | `rgb(214, 226, 251)` |
| Text primary | `#282828` | `rgb(40, 40, 40)` |
| Text secondary | `#5c5c5c` | `rgb(92, 92, 92)` |
| Text muted | `#919191` | `rgb(145, 145, 145)` |
| Text faint | `#c5c5c5` | `rgb(197, 197, 197)` |
| Accent / links | `#2756c9` | `rgb(39, 86, 201)` |
| Editor code color (attribute) | `#82184a` | red-ish |
| Editor code (attribute value) | `#934920` | orange-brown |
| Editor code (link) | `#1c419a` | deep blue |
| Background faded title | `#f6f6f6` | near white |
| Panel window bg | `#d6e2fb` | light blue |

### Color Palette Summary (all unique values)

```
Dark background scale: #222, #282828, #2b2b2b, #3c3c3c, #3a3a3a, #575757
Neutral grey scale: #5e5e5e, #898989, #919191, #bababa, #c5c5c5, #eaeaea
White scale: #f6f6f6, #eef2f9, #eff3fd, #fff
Blue accent scale: #85abf2, #aec6f6, #2756c9, #1c419a, #d6e2fb
Code editor colors: #f09364, #ef9364, #fbf3b2, #82184a, #934920, #3c3009
```

---

## Typography

### Font Families

| Name | Usage | TypeKit ID |
|------|-------|-----------|
| `neue-haas-grotesk-display, serif` | Display headings, body sans-serif content (c-sans elements) | Adobe Fonts via `https://use.typekit.net/awl2qrt.css` |
| `code-saver, sans-serif` | Monospace / code UI elements, line numbers, tabs, editor text | Adobe Fonts same kit |
| `sans-serif` | Browser fallback, applies to body before fonts load | System |

**Adobe Fonts kit:** `https://use.typekit.net/awl2qrt.css`

### Font Weights

| Weight | Usage |
|--------|-------|
| `400` | Regular — all body text, monotype, line numbers |
| `500` | Medium — tab labels (code-saver) |
| `600` | Semi-bold — display headings (neue-haas-grotesk-display) |

### Font Sizes

| CSS value | rem/px equivalent | Usage |
|-----------|------------------|-------|
| `0.625rem` | `10px` | Line numbers (monotype, very small screens) |
| `0.6875rem` | `11px` | Code editor monotype (small screens < 360px) |
| `0.75rem` | `12px` | Code editor, tabs, c-mono-type (default monotype size) |
| `1.4em` | ~`19.6px` | c-sans__line__content (display text lines) |
| `1em` | `16px` | Base / editor notices |
| `2em` | `32px` | h1 normalize reset (overridden) |

**Note:** The display headings ("Fine Thought", section titles) are sized using a JS-driven measurement system. The `c-guides` component calculates a type scale using the character width of "M" in both fonts, producing sizes that fill the available column width. Actual computed sizes at 1440px: ~228px for "Fine" / "Thought" display text, ~63px for section headings ("Skills", "Projects").

### Typography Details for c-sans (Display)

```css
.c-sans__line__content {
  font-family: neue-haas-grotesk-display, serif;
  font-weight: 600;
  letter-spacing: -0.0325em;
  line-height: 1em;
  font-size: 1.4em; /* relative to parent container */
  margin-top: -0.1175em;
  white-space: nowrap;
}
```

**Letter spacing overrides per section:**
- `#home-intro .c-sans__line--1`: `letter-spacing: -0.02em`
- `#home-intro .c-sans__line--2`: `letter-spacing: -0.035em`
- `#home-contact-top .c-sans__line--0`: `letter-spacing: -0.02em`
- `#home-contact-top .c-sans__line--1`: `letter-spacing: -0.035em`

### Typography Details for c-mono-type (Code Editor)

```css
.c-mono-type, .c-guides__type, .c-editor, .c-ascii {
  font-family: code-saver, sans-serif;
  font-weight: 400;
  font-size: 0.75rem;    /* 12px */
  line-height: 0.9375rem; /* 15px */
  color: #898989;
}

/* Small screens < 360px */
font-size: 0.6875rem;  /* 11px */
line-height: 0.8125rem; /* 13px */
```

---

## Spacing & Layout

### Grid / Column System

The layout uses a **code editor metaphor** with a line-number gutter:

| Element | Width |
|---------|-------|
| `.c-page__lines-column` | `1.75rem` (28px) — line number gutter |
| `.c-page__lines-column` border | `0.0625rem` (1px) right border |
| `.c-page__content-column` | `calc(100% - 1.75rem - 0.0625rem)` |

At 1440px, this means:
- Lines gutter: 28px + 1px border = 29px total
- Content area: 1411px

### Breakpoints

| Name | Value | rem | Usage |
|------|-------|-----|-------|
| Mobile (max) | < 760px | < 47.5rem | Mobile layout: GUI panel slides in, single column |
| Tablet | 760px | 47.5rem | Two-column layout starts, bottom nav bar |
| Desktop | 1024px | 64rem | Full side-by-side layout with sidebar panel |
| Small mobile | < 360px | < 22.5rem | Slightly smaller font sizes |
| Tiny mobile | < 280px | < 17.5rem | Minimal sizes, hides line numbers |

### Header / Nav Height

| Breakpoint | Height |
|-----------|--------|
| Mobile (< 760px) | `2.25rem` (36px) |
| Desktop (≥ 1024px) | `1.6875rem` (27px) |
| Extra small (< 280px) | `2rem` (32px) |

### Spacing Values Observed

```
0.125rem  =  2px  (fine borders, small offsets)
0.1875rem =  3px  (border widths in guides)
0.25rem   =  4px  (small padding, border-radius base)
0.3125rem =  5px  (border-radius: context menu)
0.375rem  =  6px  (icon internal margin)
0.5rem    =  8px  (small padding, hover areas)
0.625rem  = 10px  (tab horizontal padding)
0.8125rem = 13px  (internal offsets)
1rem      = 16px  (standard spacing)
1.625rem  = 26px  (button width, panel button area)
1.75rem   = 28px  (line number gutter width)
2.25rem   = 36px  (mobile nav height)
2.5rem    = 40px  (tabs area right margin)
25rem     = 400px (info panel width at desktop)
```

---

## Borders & Shadows

```css
/* Standard divider border */
border: 1px solid #5e5e5e;         /* dark mode */
border: 1px solid #d6e2fb;         /* light mode */

/* Panel header bottom border */
border-bottom: 1px solid #5e5e5e;

/* Context menu / window shadow */
box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);   /* dark mode */
box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);  /* light mode */

/* Border radii */
border-radius: 0.1875rem;  /* 3px — interactive hover items */
border-radius: 0.25rem;    /* 4px — window chrome, context menu items */
border-radius: 0.3125rem;  /* 5px — context menu panel */
border-radius: 0.5rem;     /* 8px — window chrome at tablet+ */
border-radius: 50%;        /* circle — button hover states */
```

---

## Animations & Transitions

### Standard Transitions

```css
/* Most UI transitions */
transition: color 0.25s;
transition: background-color 0.25s;
transition: opacity 0.25s;
transition: border-color 0.25s;
transition: fill 0.25s;

/* Combined */
transition: background-color 0.25s, border-color 0.25s;
transition: color 0.25s, border-color 0.25s;
```

### Page Transitions

```css
/* Cover overlay fade-out on load */
transition: opacity 0.5s, left 0s linear 0.5s, background-color 0.25s;

/* Mobile GUI panel slide */
transition: left 0.4s;

/* Page content transition */
transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Info panel open/close */
transition: opacity 0.4s linear 0.5s;       /* desktop delay */
transition: opacity 0.4s linear 125ms;      /* tablet delay */
```

### Window / Featured Work Scale

```css
/* Initial state (before load) */
transform: scale(0.125);
opacity: 0;

/* Loaded state */
transform: scale(1);
opacity: 1;
transition: opacity 125ms, transform 0.4s;
```

---

## Favicons

| Type | URL | Size |
|------|-----|------|
| apple-touch-icon | `/icons/apple-icon-57x57.png` | 57x57 |
| apple-touch-icon | `/icons/apple-icon-60x60.png` | 60x60 |
| apple-touch-icon | `/icons/apple-icon-72x72.png` | 72x72 |
| apple-touch-icon | `/icons/apple-icon-76x76.png` | 76x76 |
| apple-touch-icon | `/icons/apple-icon-114x114.png` | 114x114 |
| apple-touch-icon | `/icons/apple-icon-120x120.png` | 120x120 |
| apple-touch-icon | `/icons/apple-icon-144x144.png` | 144x144 |
| apple-touch-icon | `/icons/apple-icon-152x152.png` | 152x152 |
| apple-touch-icon | `/icons/apple-icon-180x180.png` | 180x180 |
| icon (android) | `/icons/android-icon-192x192.png` | 192x192 |
| icon | `/icons/favicon-32x32.png` | 32x32 |
| icon | `/icons/favicon-96x96.png` | 96x96 |
| icon | `/icons/favicon-16x16.png` | 16x16 |
| manifest | `/icons/manifest.json` | — |
| msapplication-TileColor | `#ffffff` | — |
| theme-color | `#ffffff` | — |

---

## SVG Icons Used

| Location | viewBox | Purpose |
|----------|---------|---------|
| `button.c-gui__panel__header__button--close` | `0 0 24 24` | Close/X icon |
| `button.c-gui__panel__header__button--light-mode` | `0 0 24 24` | Sun/light mode toggle |
| `button.c-gui__panel__header__button--sidebar` | `0 0 200 200` | Sidebar toggle (panel layout icon) |
| `span.c-sans__line__content` (×2) | `0 0 40 24` | Arrow icons embedded in display text (→) |

Total SVGs in DOM: 5

---

## Media Assets

All project preview images are hosted at `https://media.finethought.com.au/media/` with three srcset sizes:

| Suffix | Dimensions |
|--------|-----------|
| `*-1280x720.jpg` | 1280×720 |
| `*-1920x1080.jpg` | 1920×1080 |
| `*-2560x1440.jpg` | 2560×1440 |

Video cinemagraphs (looping .mp4) also hosted there at `*-480.mp4` and `*-720.mp4` sizes.

Sample asset URLs:
- `https://media.finethought.com.au/media/ArthurG-Home-Loop-2560x1440.jpg`
- `https://media.finethought.com.au/media/ArthurG-Home-Loop-480.mp4`

---

## Tech Stack

- **Framework:** Next.js (Pages Router, SSG via `getStaticProps`, `__NEXT_DATA__` present)
- **Build ID:** `CAOiSdK6wRrZshm3h75ve`
- **CSS:** Custom BEM methodology with `c-` prefix (NOT Tailwind)
- **Fonts:** Adobe Fonts (TypeKit) — `neue-haas-grotesk-display` + `code-saver`
- **State management:** CSS class toggling (`state-*` classes on `html` element)
- **Dark/Light mode:** `.state-light-mode` class on root element
- **Load state:** `.state-site-loaded` class on root element
