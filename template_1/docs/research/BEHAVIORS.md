# Interaction Behaviors — finethought.com.au

Documented via Puppeteer scroll/interaction sweep on 2026-03-27.

---

## Page Load Sequence

1. **Initial render:** Page loads with a full-viewport cover overlay (`.c-cover`) at `#282828`
2. **JS execution:** React hydrates; `state-site-loaded` class is added to `<html>`
3. **Cover fadeout:** The cover fades out over `0.5s`, then is offscreen after `0.5s` delay:
   ```css
   opacity: 0; left: -9999px;
   transition: opacity 0.5s, left 0s linear 0.5s;
   ```
4. **Type scale calculation:** `c-guides` system calculates column widths based on font "M" character width for both `neue-haas-grotesk-display` and `code-saver` fonts, sets CSS variables for responsive type scaling
5. **Line numbers:** The `.c-mono-type--line-nums` element populates with sequential numbers as the page renders

---

## Scroll Behavior

- **Scroll container:** `.c-page` (not `window`) — custom scrollable div with `overflow-y: scroll`
- **Scrollbar:** Hidden via `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`
- **Overscroll:** `overscroll-behavior: none` on all elements
- **Total scroll height:** ~3570px at 1440px wide viewport

### Scroll-linked behaviors

| Scroll position (approx) | What changes |
|--------------------------|-------------|
| 0 | Hero: "Web engineer & creative coder" title + "Fine Thought" display (upper half) |
| 0–500px | "Fine Thought" display text scrolls up, bio intro section appears |
| 500–1000px | "The creative persona..." bio fully visible + "Skills" heading appears |
| 1000–1500px | Skills section (code editor table) visible, "Projects" heading starts |
| 1500–2200px | Projects section (interactive list table) fully visible |
| 2200–3000px | Contact section: "I am currently working alongside agencies..." |
| 3000–3570px | Contact bottom + end of page |

The display text headings ("Fine", "Thought", "Skills", "Projects") are positioned absolutely and appear **behind** the code editor content — they serve as large background type that the editor content scrolls over, creating a parallax-like effect.

---

## Project Row Hover (Interactive List)

The most distinctive interaction on the site. When hovering over a project row in the projects table:

### Behavior sequence:
1. **Mouse enters row:** `.c-interactive__link` detects position
2. **Line highlight:** A blue tint overlay (`.c-interactive__link--background`) appears over the entire row:
   ```css
   background-color: #2756c9;
   mix-blend-mode: soft-light; /* creates a blue highlight without harsh block */
   ```
3. **Line numbers highlight:** Line numbers for that row change from muted grey `#898989` to full white `#eaeaea`
4. **Preview appears:** `.c-interactive__previews` fades in (opacity 0 → 1 over `0.25s`) and is positioned floating to the right
5. **Featured work media loads:** The `.c-featured-work` component becomes active, showing the project's preview image/cinemagraph
6. **Hover video:** `.c-featured-work__hover-media` fades in with grayscale filter, then transitions to color
7. **CTA text:** "→ Visit project" text appears centered on the media overlay

### On row exit:
- All elements reverse their transitions at the same `0.25s` speed
- Preview floats away (`opacity: 0`)

### CSS classes for hover states:
- `.state-active` on `.c-interactive__link` (makes it `opacity: 1`)
- `.state-hover` on `.c-featured-work__hover-media` and `.c-featured-work__link__text`
- `.state-inactive` on `.c-interactive__line` (forces `opacity: 0 !important`)

---

## Nav Tab Bar Interactions

### Tab click:
- Currently only one tab visible: `fine-thought.js`
- Tab shows active state with bottom border in accent color `#aec6f6`
- Clicking a tab would navigate to that "file" (page)

### Light mode toggle (sun icon button):
- Adds/removes `.state-light-mode` on `<html>` element
- Triggers CSS variable swap across entire site
- All `transition: color 0.25s / background-color 0.25s` rules animate the switch
- Active (light mode): icon fills with `#2756c9`

### Sidebar button (panel icon):
- Adds/removes `.state-info-open` on `<html>` (or parent) element
- On mobile: slides the `.c-gui` panel left (reveals the info panel)
- On tablet: opens info panel as bottom sheet (full width)
- On desktop: opens info panel as 400px left sidebar

---

## Button Hover States

All interactive buttons use a circular hover indicator:

```css
.c-gui__panel__header__button:before {
  content: "";
  border-radius: 50%;
  transition: background-color 0.25s;
  background-color: rgba(255, 255, 255, 0);
}

/* Hover (only when .state-mouse-events is active — not on touch) */
.state-mouse-events .c-gui__panel__header__button:hover:before {
  background-color: rgba(255, 255, 255, 0.075);
}
```

The `.state-mouse-events` class prevents hover effects on touch devices.

---

## Link / Text Hover States

Code-editor style links (`.c-mono-type a`, project links):
- Default: `#aec6f6` (soft blue)
- Light mode: `#2756c9` (strong blue)

Tab hover:
```css
.state-mouse-events .c-gui__panel__header__tabs__tab:hover {
  color: #eaeaea;
  background: rgba(255, 255, 255, 0.075);
}
```

`.c-link` elements use `mix-blend-mode: soft-light` with `background-color: #2756c9` for full-row highlighting.

---

## Context Menu

Right-clicking opens a custom context menu (`.c-gui__context-menu`) with:
- Navigation links specific to current page
- List items that highlight blue (`#2756c9`) on hover
- Positioned relative to cursor
- Dismissed by clicking overlay

---

## Page Navigation Transitions

Between pages:
1. `.c-page__cover` fades IN (opacity 0 → 1 over `0.25s` with `0.25s` delay) — covers current page
2. Next.js routes to new page
3. New page cover fades OUT once content is ready
- CSS: `transition: left 0s linear 0.5s, opacity 0.25s linear 0.25s`

---

## Featured Work Component (Sidebar)

When the info sidebar is open and showing a project, `.c-window` appears:
- Initial state: `opacity: 0, transform: scale(0.125)` (tiny, invisible)
- Loaded state: `opacity: 1, transform: scale(1), transition: opacity 125ms, transform 0.4s`
- The gallery inside also starts at `scale(2)` and animates to `scale(1)` — creates a zoom-out entrance

---

## Type Scale System (`.c-guides`)

The site has a sophisticated type measurement system that drives all display font sizing:

- `c-guides__sans`: A hidden `<p>` element in `neue-haas-grotesk-display` containing "M"
- `c-guides__serif`: A hidden `<p>` element in `code-saver` containing "M"
- `c-guides__window`: A hidden div measuring available viewport width
- `c-guides__typesize`: A `<span>` that displays the calculated pixel size for debugging

JavaScript reads the natural width of "M" in each font at various sizes, then calculates the font-size needed to fill each "column" of the layout. This ensures display text perfectly spans its container regardless of viewport width.

---

## Responsive Layout Transitions

### Mobile → Desktop transition (760px):
- Navigation moves from bottom to top
- GUI panel goes from slide-in (left offset) to always-visible
- Transition is `none` at tablet (instant snap, no animation)

### Desktop sidebar open/close:
- `.c-guides__window` shrinks from `100%` to `calc(100% - 25rem)` via transition
- Content reflows smoothly
- Featured work previews reposition

---

## Mouse vs Touch Detection

The site adds `.state-mouse-events` to root when a mouse pointer is detected. This:
- Enables hover states (buttons, rows, tabs)
- Prevents touch-triggered hover flicker
- All hover CSS is guarded by `.state-mouse-events` selector

---

## Accessibility Notes

- `user-select: none` on all `.c-page` children (no text selection)
- `outline: none !important` on all interactive elements (custom focus handling)
- `role="presentation"` on decorative ASCII spans
- Navigation via arrow keys not observed in static analysis (likely JS-driven)
- Tab key focus order not explicitly managed

---

## Scroll Animation Pattern Summary

The site achieves its scroll animations through:
1. **Absolute positioning** of large display text elements behind content
2. **The `.c-page` scroll container** scrolling content over the fixed-position display text
3. **No scroll-triggered JS animations** — pure CSS positioning creates the parallax effect
4. **Overflow hidden** on `.c-page__inner` clips large display text neatly

---

## Light Mode Summary

All color changes use `.state-light-mode` class on `<html>`:

| Element | Dark | Light |
|---------|------|-------|
| Body background | `#282828` | `#fff` |
| Panel header | `#3c3c3c` | `#eef2f9` |
| Borders | `#5e5e5e` | `#d6e2fb` |
| Text primary | `#eaeaea` | `#282828` |
| Text secondary | `#bababa` | `#5c5c5c` |
| Text muted | `#898989` | `#919191` |
| Accent | `#aec6f6` | `#2756c9` |
| Link color | `#aec6f6` | `#2756c9` |
| Row hover bg | `#2756c9` (soft-light) | `#aec6f6` (multiply) |
| Cover overlay | `#282828` | `#fff` |

All transitions: `0.25s` duration.
