# Design Tokens — zchry.org

## Color System

### CSS Custom Properties
The site uses a dual light/dark theme with the following CSS variables:

#### Dark Mode (`.dark`) — Active on Home Page
```css
:root.dark {
  --bg-primary: #0a0a0a;       /* Page background */
  --bg-secondary: #111111;     /* Slightly elevated bg */
  --bg-tertiary: #1a1a1a;      /* Card hover background */
  --bg-card: #111111;          /* Card background */
  --bg-card-hover: #1a1a1a;    /* Card on hover */
  --text-primary: #fafafa;     /* Primary text */
  --text-secondary: #a3a3a3;   /* Secondary / muted text */
  --text-tertiary: #525252;    /* Very muted text (dates, metadata) */
  --border: #2a2a2a;           /* Border color */
  --border-hover: #3d3d3d;     /* Border on hover */
  --inline-code-bg: #262626;   /* Code block background */
  --header-bg: rgba(10, 10, 10, .9); /* Transparent header bg */
}
```

#### Light Mode (`:root`) — Active on Pages other than Home
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #eeeeee;
  --bg-card: #ffffff;
  --bg-card-hover: #fafafa;
  --text-primary: #171717;
  --text-secondary: #525252;
  --text-tertiary: #a3a3a3;
  --border: #e5e5e5;
  --border-hover: #d4d4d4;
  --inline-code-bg: #e5e5e5;
  --header-bg: rgba(255, 255, 255, .9);
}
```

**Note:** The home page body has class `.dark` applied. Inner pages (projects, words, about) use light mode by default — BUT looking at the actual screenshots the home page canvas is rendered in dark mode, while inner pages appear to also render in dark mode. The CSS shows dark mode `.dark` class makes things dark. The page body computed bg is `rgb(10, 10, 10)` and text is `rgb(250, 250, 250)`, meaning dark mode is active on ALL pages.

### Accent Colors
- **Logo hover / zach-logo link**: `#ff8181` (light red/coral)
- **Canvas clear button (active)**: `rgb(239, 68, 68)` (red-500)
- **Color palette swatches**:
  - Default: `linear-gradient(135deg, #fff 50%, #000 50%)`
  - Red: `#ef4444`
  - Orange: `#f97316`
  - Yellow: `#eab308`
  - Green: `#22c55e`
  - Blue: `#3b82f6`
  - Purple: `#8b5cf6`
  - Pink: `#ec4899`

### Computed Colors (on dark pages)
- Body background: `rgb(10, 10, 10)` = #0a0a0a
- Body text: `rgb(250, 250, 250)` = #fafafa
- Header background: `rgb(10, 10, 10)` = #0a0a0a
- Nav links default: `rgba(255, 255, 255, 0.5)` (50% white)
- Nav links hover/active: `rgb(255, 255, 255)` = #ffffff
- Header icons default: `rgba(255, 255, 255, 0.5)`
- Header icons hover: `rgb(255, 255, 255)`
- Secondary text: `rgb(163, 163, 163)` = #a3a3a3
- Tertiary text: `rgb(82, 82, 82)` = #525252
- Border: `rgb(42, 42, 42)` = #2a2a2a

---

## Typography

### Font Families
- **Primary (body + headings)**: `Soehne, system-ui, sans-serif`
  - **Soehne** is a commercial font by Klim Type Foundry — NOT available on Google Fonts
  - It is loaded via the site's own hosting (not Google Fonts)
  - Fallback: `system-ui, sans-serif`
  - For cloning: use `Inter` or a similar geometric sans-serif as fallback
- **Monospace**: `IBM Plex Mono` (Google Fonts: weights 400, 500)
  - Used for: inline code, chord display, small technical labels
  - Google Fonts URL: `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap`
- **Code blocks**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

### Type Scale (computed values)
| Element | Size | Weight | Line Height | Letter Spacing | Notes |
|---------|------|--------|-------------|----------------|-------|
| h1 | 30px (1.875rem) | 600 | 36px | -0.75px | `sm:text-3xl`, tracking-tight |
| h2 (section) | 18px | 600 | 28px | -0.45px | `text-lg font-semibold tracking-tight` |
| h2 (label) | 12px | 600 | 18px | +0.6px | `text-xs uppercase tracking-widest` |
| body | 16px | 400 | 24px | 0 | — |
| nav links | 14px | 400 | 20px | 0 | `text-sm` |
| card title | 16px | 600 | 24px | 0 | `text-base font-semibold` |
| card desc | 14px | 400 | 21px | 0 | `text-sm` |
| card date | 12px | 400 | 16px | 0 | `text-xs` |
| footer | 12px | 400 | 16px | 0 | `text-xs` |
| logo "Zach" | 16px | 600 | 24px | -0.4px | `text-base font-semibold tracking-tight` |
| about link | 14px | 400 | 21px | 0 | secondary text |
| tree label (summary) | 12px | 600 | 18px | +0.6px | uppercase |
| mobile nav links | 24px | 600 | 32px | -0.6px | `text-2xl font-semibold tracking-tight` |

---

## Spacing

### Header
- Height: 52px (computed)
- Padding: `10px 24px` (py-2.5 px-6)
- Z-index: 50

### Main Content
- Max-width: `80rem` (1280px) — `work-grid-page` and inner page containers
- Content padding: `px-6 sm:px-8` (24px / 32px)
- Page header pt: `pt-12 sm:pt-20` (48px / 80px)
- Page header pb: `pb-10 sm:pb-14` (40px / 56px)

### Project Cards
- Grid: 3 columns, each 426px (`grid-template-columns: 426px 426px 426px`)
- Card padding: 40px all sides
- Card border-radius: 12px (on grid container)
- Card icon: 48x48px, border-radius: 12px, border: 1px solid `var(--border)`
- Card icon margin-bottom: 20px
- Card icon SVG: 28px (w-7 h-7)
- Arrow icon (hover): 14px (w-3.5 h-3.5), opacity 0 → 1 on hover, translate-y-0.5 → 0, translate-x[-2px] → 0

### Words List
- Row: `py-5` (20px top/bottom), border-bottom: 1px solid var(--border)
- Grid: `grid-template-columns: 6rem 1fr`, gap-x-3 sm:gap-x-6
- Header row: `py-3`, text-xs uppercase tracking-wider

### Footer
- Padding: `24px 0` (py-6)
- Height: 64px
- Font size: 12px

---

## Breakpoints
- Mobile: `< 768px` (max-width: 767px)
- Tablet/Desktop: `≥ 768px`
- Desktop: `≥ 1024px` (lg:)
- Wide: `≥ 1280px` (xl:)

Key responsive changes:
- Nav: Desktop nav shown ≥768px, hamburger shown <768px
- Mobile icon bar: fixed bottom bar <768px
- About/Words pages: single column <1024px, side-by-side ≥1024px

---

## Borders & Radius
- Project grid border-radius: 12px
- Card icon border-radius: 12px
- Color swatches: 50% (circle)
- Header separator (home page): 1px solid rgba(255,255,255,0.1) — gradient beneath
- Mobile menu: border-bottom: 1px solid var(--border)

---

## Shadows & Effects
- No box shadows observed on cards in default state
- Header on home page: NO border-bottom (`.home-page` class removes it)
- Header on inner pages: `border-bottom: 1px solid rgba(0,0,0,0.1)` (light) or `rgba(255,255,255,0.1)` (dark)
- Home page header pseudo-element `::after`: gradient fade from header bg to transparent, height 40px
- Card hover bg: `--bg-card-hover` (#1a1a1a in dark mode)

---

## Animations & Transitions
- Nav links: `transition: color 0.15s`
- Header icons: `transition-colors duration-150` (0.15s)
- Logo color: `transition: color 0.15s`
- Arrow icon on card hover: `transition-all duration-200` (opacity + translate)
- Words list row hover: `transition-colors duration-200`
- Mobile menu entrance: shown via `display: flex` (`.open` class, no transition seen)
- Card icon hover: `transition: border-color 0.15s, box-shadow 0.15s`
- About link: `transition: color 0.15s, text-decoration-color 0.15s`

---

## Z-Index Layers
- Header: z-50
- Mobile menu overlay: z-60
- Canvas: z-0 (behind everything)
- Mobile icon bar: z-50 (fixed bottom)
- Color palette dropdown: z-10
