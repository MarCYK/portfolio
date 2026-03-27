# Behaviors & Interactions — zchry.org

## Scroll Behavior

### Page Scroll Pattern
- The body is `overflow-hidden; height: 100svh`
- Scrolling happens INSIDE `#scroll-root` (`overflow-y-auto`)
- NO window scroll — inner container scroll only
- No smooth scroll library (Lenis not found, no `.lenis` class)
- `scrollbar-gutter: stable` on `#scroll-root`
- Default browser scrolling behavior

### Header Scroll Behavior
- The header does NOT change on scroll (it's not sticky in the traditional sense — it's just at the top of a `flex-col` layout)
- The header is `position: relative` (NOT `position: sticky`)
- No shrink-on-scroll, no shadow-on-scroll
- Static behavior at all scroll positions

---

## Home Page Canvas Interactions

### Drawing
- The canvas has `cursor: crosshair`
- Click/drag draws colored rows on the Joy Division waveform
- Each row corresponds to a MIDI note (pentatonic scale, C3–C7 range)
- Color can be changed via color palette swatches

### Music Mode
- Toggle button: `#music-toggle`
- When enabled, a piano cover of "Where Is My Mind?" (Pixies) plays
- Notes map to canvas rows, visualizing as energy that decays
- Chord name displayed in header (`#header-chord`) when music plays

### Disco Mode
- Toggle button: `#disco-toggle`
- Changes canvas render colors to cycling rainbow

### Sunset Mode
- Toggle button: `#sunset-toggle`
- Activates class `.sunset-active` on the body/canvas area
- Overrides all `--text-primary`, `--text-secondary`, etc. to black
- Icon bar colors change on mobile

### Clear Canvas
- Button: `#canvas-clear-btn` (hidden by default, shows `.visible` class when canvas has drawing)
- Button color turns red when visible

### Sound Toggle
- Button: `#sound-toggle`
- Enables/disables audio
- State persisted in localStorage (`localStorage.getItem('sound')`)
- Icon switches between outline and fill variants

---

## Navigation Interactions

### Desktop Nav Links (`.nav-link`)
- Default state: `color: rgba(255,255,255,0.5)` (dark) or `rgba(0,0,0,0.4)` (light)
- Hover/active state: `color: rgb(255,255,255)` or `color: rgb(0,0,0)`
- Transition: `color 0.15s`
- Active page link gets `.active` class

### Logo Link (`.zach-logo`)
- Default: `color: var(--text-primary)` = #fafafa
- Hover: logo text color changes to `#ff8181` (light coral)
- Transition: `color 0.15s`

### Header Icon Buttons (`.header-icon`)
- Default: `color: rgba(255,255,255,0.5)` (dark mode)
- Hover: `color: rgb(255,255,255)` — full opacity
- Icon switches from outline to fill variant on hover (except theme/sound toggles which have special handling)

### Mobile Hamburger Menu
- Clicking `#menu-toggle` opens `#mobile-menu` (adds `.open` class, sets `display: flex`)
- Full-screen overlay, z-60
- Mobile nav links: `font-size: 24px; font-weight: 600; letter-spacing: -0.025em`
- Each link: `padding: 18px 0; border-bottom: 1px solid var(--border)`
- Arrow caret SVG on right of each link

---

## Project Cards Interactions

### Card Hover State
- Background: `--bg-card` → `--bg-card-hover` (via `hover:bg-[var(--bg-card-hover)]`)
- In dark mode: `#111111` → `#1a1a1a`
- Transition: CSS transition on background-color (via Tailwind class)

### Card Icon Hover
- Border and box-shadow on icon container change
- Transition: `border-color 0.15s, box-shadow 0.15s`

### Arrow Icon on Card Title
- Arrow SVG appears on card hover
- Default: `opacity: 0; transform: translate(-2px, -0.5px)`
- Hover: `opacity: 1; transform: translate(0, 0)`
- Transition: `all 0.2s` (Tailwind `group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200`)

---

## Words List Interactions

### Row Hover
- Background: changes to card-hover color (via hover class)
- Title: `text-decoration: underline` on hover (`group-hover:underline`)
- Arrow icon: opacity 0 → 1, translate-x -8px → 0
- Transition: `transition-colors duration-200` on row, `transition-all duration-200` on arrow

---

## About Page Interactions

### Details/Summary Tree
- Contact and Links sections use `<details>` + `<summary>` (HTML native disclosure)
- Both sections default to `open` attribute
- Summary label: uppercase, 12px, font-weight 600
- No custom animation (uses browser default)

### About Links
- Color: `var(--text-secondary)` = #a3a3a3
- Hover: underline + color change
- Transition: `color 0.15s, text-decoration-color 0.15s`

---

## Theme Toggle

### Light/Dark Mode Switch
- Button: `#theme-toggle`
- Shows sun icon (light) or moon icon (dark)
- Switches between `.dark` class on HTML element and no class
- No transition animation between modes

---

## Color Swatch Palette

### Palette Toggle
- Triggered by paint/brush button in header
- `#color-palette` div: `position: absolute; top: 100%; right: 0; padding-top: 8px; z-index: 10`
- Default hidden (`class="hidden"`)
- On desktop: appears below icon, right-aligned
- On mobile: appears ABOVE the bottom icon bar (`bottom: 100%; padding-bottom: 8px`)

### Swatch Selection
- `.color-swatch` button: 20x20px circle
- `.active` swatch gets `border-color: var(--text-primary)`
- Hover: `border-color: var(--text-tertiary)`
- Transition: `border-color 0.15s`

---

## Responsive Behaviors

### Desktop (≥1440px)
- Content max-width: 1280px centered
- Projects: 3-column grid
- Words/About: sidebar (1/4) + main (3/4) layout with divider

### Tablet (768px)
- Navigation: same as desktop (desktop nav visible)
- Projects: still 3-column but narrower
- Words/About: collapses to single column (below 1024px)

### Mobile (390px)
- Header: hamburger + theme toggle shown, desktop nav hidden
- Icon bar moves to fixed bottom position
- Mobile menu: full-screen overlay when hamburger clicked
- Projects: mobile layout with different padding
- Words/About: single column stacked
- Footer logo: hidden on mobile
- `#scroll-root`: has `padding-bottom: 3.25rem` to account for bottom icon bar

---

## Animation Details

### Canvas Waveform Animation
- Continuous `requestAnimationFrame` loop
- Layered sine functions animate each row up and down
- Energy decay from mouse/music events spreads to neighboring rows
- Low MIDI notes → warm colors (reds/oranges), high notes → cool colors (blues)

### Chord Display
- `#header-chord` span in header
- Only visible when music mode is active
- Shows current chord name and note names
- Highlights new notes in `<strong>` tags
- Hidden when not in music mode

### Icon State Toggle (outline → fill)
- Each icon button has both outline SVG and fill SVG versions
- Default: outline shown, fill hidden
- Active/hover: outline hidden (`.icon-outline { display: none !important }`), fill shown
- This applies to: email, music, disco, sunset, sound icons

---

## Technical Notes

### Framework
- Astro (static site generator with Islands architecture)
- Server-rendered HTML with client-side JS scripts
- Tailwind CSS for utility classes
- Custom CSS in `_slug_.BzrKUVQq.css` for component-specific styles

### Audio
- Soundfont-player library (`Soundfont.instrument()`)
- MusyngKite acoustic grand piano soundfont
- Web Audio API (`AudioContext`)

### Canvas
- Raw Canvas 2D API (no Three.js or p5.js)
- Custom waveform rendering with stacked filled lines
- Joy Division "Unknown Pleasures" aesthetic

### Performance
- Vercel Speed Insights and Analytics scripts
- No lazy loading of images (no images on home page)
- CSS loaded from `_astro/` hashed filenames
