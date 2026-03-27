# Component Inventory — zchry.org

## Global Components

### 1. Header / Navigation (`SiteHeader`)
**File suggestion:** `src/components/SiteHeader.tsx`
**Screenshot:** `docs/design-references/desktop-full.png` (top area)
**Interaction model:** Click-driven (nav links, icon buttons, hamburger)

**Structure:**
```
<header id="site-header" class="relative z-50 flex flex-row items-center justify-between px-6 py-2.5 header-nav [home-page?]">
  <div class="flex items-center gap-5">
    <a href="/" class="flex items-center gap-2">
      <span class="zach-logo text-base font-semibold tracking-tight">Zach</span>
      <svg> [logo diamond SVG] </svg>
    </a>
    <nav class="desktop-nav items-center gap-4 text-sm">
      <a href="/projects" class="nav-link [active?]">Projects</a>
      <a href="/words" class="nav-link [active?]">Words</a>
      <a href="/about" class="nav-link [active?]">About</a>
    </nav>
  </div>
  <button id="menu-toggle" class="hamburger-btn header-icon">
    [hamburger SVG]
  </button>
  <div id="icon-bar" class="icon-bar flex items-center gap-3">
    <a href="mailto:zach@wvrk.org" class="header-icon">
      [email SVGs - outline + fill]
    </a>
    <span id="header-chord" class="text-xs font-mono hidden"></span>
    [canvas-only buttons: music, disco, sunset, clear]
    [color palette dropdown]
    <button id="sound-toggle" class="header-icon">
      [sound SVGs]
    </button>
    <button id="theme-toggle" class="header-icon">
      [sun/moon SVGs]
    </button>
  </div>
</header>
```

**Key CSS:**
- Height: 52px
- Padding: 10px 24px
- Background: var(--bg-primary) / var(--header-bg)
- Background changes: `rgb(10,10,10)` dark, `rgb(255,255,255)` light
- On `.home-page`: border-bottom removed, ::after gradient added
- Z-index: 50

**Logo Diamond SVG:**
```svg
<svg class="h-4" viewBox="0 0 512 464" fill="none">
  <rect width="295.603" height="295.603" transform="matrix(0.866025 0.5 -0.866025 0.5 256 167.508)" fill="#FF0000"/>
  <path d="M256 167.508L0 315.31L256 0V167.508Z" fill="#FF0000"/>
  <path d="M256 167.508L512 315.31L256 0V167.508Z" fill="#FF8181"/>
  <path d="M256 463.111L0 315.31L256 0V463.111Z" fill="#FF8181"/>
  <path d="M256 463.111L512 315.31L256 0V463.111Z" fill="#FF0000"/>
</svg>
```

**Responsive:**
- Desktop (≥768px): Desktop nav shown, hamburger hidden
- Mobile (<768px): Desktop nav hidden, hamburger shown; icon bar moves to fixed bottom

---

### 2. Mobile Menu (`MobileMenu`)
**File suggestion:** `src/components/MobileMenu.tsx`
**Interaction model:** Click-driven (hamburger toggle, nav links)

**Structure:**
```
<div id="mobile-menu" class="mobile-menu [open?]">
  <div class="mobile-menu-header">
    <a href="/" class="mobile-home-icon flex items-center justify-center w-8 h-8">
      [home icon SVG]
    </a>
    <span class="zach-logo text-base font-semibold">Zach</span>
    <button class="header-icon">
      [close X SVG]
    </button>
  </div>
  <nav class="mobile-menu-nav">
    <a href="/projects" class="mobile-nav-link">
      Projects
      <svg class="mobile-nav-caret">...</svg>
    </a>
    <a href="/words" class="mobile-nav-link">Words ...</a>
    <a href="/about" class="mobile-nav-link">About ...</a>
  </nav>
</div>
```

**CSS:**
- Default: `display: none` (hidden)
- Open: `display: flex; flex-direction: column`
- position: fixed; inset: 0; z-index: 60
- Background: var(--bg-primary)
- Nav link: font-size 24px, font-weight 600, letter-spacing -0.025em, padding 18px 0, border-bottom
- Caret: 18x18px, color: var(--text-tertiary)

---

### 3. Footer (`SiteFooter`)
**File suggestion:** `src/components/SiteFooter.tsx`
**Interaction model:** Static links
**Present on:** /projects, /words, /about (NOT home page)

**Structure:**
```
<footer class="site-footer text-xs">
  <div class="flex items-center justify-between px-6 sm:px-8 mx-auto w-full" style="max-width: 80rem;">
    <span>© 2026 zchry</span>
    <a href="/"><svg class="footer-logo" viewBox="0 0 512 464">...</svg></a>  <!-- hidden on mobile -->
    <div class="flex items-center gap-3">
      <a href="https://www.linkedin.com/in/zchry/">LinkedIn</a>
      <a href="/rss.xml">RSS</a>
    </div>
  </div>
</footer>
```

**CSS:**
- font-size: 12px
- color: var(--text-secondary) = rgb(82,82,82) in dark mode
- Padding: 24px 0
- Height: 64px
- `.footer-logo`: height 12px, auto width; hidden on mobile

---

## Page-Specific Components

### 4. Canvas Home (`CanvasHome`)
**File suggestion:** `src/components/CanvasHome.tsx`
**Interaction model:** Mouse/touch drawing, audio-reactive
**Page:** / (home only)

**Structure:**
```
<canvas id="grid-canvas" width="1440" height="900"></canvas>
```

**CSS:** `position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: auto; cursor: crosshair`

**Behavior:**
- Joy Division "Unknown Pleasures" stacked waveform
- Continuous sine-wave animation
- Mouse click/drag = draw colored rows + play piano notes
- Music mode: plays piano cover of "Where Is My Mind?" (Pixies) via soundfont
- Each note maps to a waveform row, visualized as energy decay

---

### 5. Page Header Section (`PageHeader`)
**File suggestion:** `src/components/PageHeader.tsx`
**Interaction model:** Static
**Used on:** /projects, /words, /about

**Structure:**
```
<header class="px-6 sm:px-8 pt-12 sm:pt-20 pb-10 sm:pb-14">
  <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight mb-3" style="color: var(--text-primary);">
    {title}
  </h1>
  <p class="text-sm" style="color: var(--text-secondary);">
    {subtitle}
  </p>
</header>
```

**Computed styles:**
- h1: 30px, weight 600, line-height 36px, letter-spacing -0.75px, margin-bottom 12px
- p: 14px, weight 400, line-height 20px, color: rgb(163,163,163)

---

### 6. Project Card (`ProjectCard`)
**File suggestion:** `src/components/ProjectCard.tsx`
**Interaction model:** Click-driven (link), hover effects

**Structure:**
```
<a href={href} target="_blank" rel="noopener" class="project-card group">
  <div class="card-icon">
    <svg class="w-7 h-7">[icon SVG]</svg>
  </div>
  <div class="card-content">
    <div class="flex items-center gap-2 mb-2">
      <h2 class="text-base font-semibold" style="color: var(--text-primary);">{title}</h2>
      <svg class="w-3.5 h-3.5 shrink-0 opacity-0 -translate-y-0.5 translate-x-[-2px] group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200">[arrow SVG]</svg>
    </div>
    <p class="text-sm leading-relaxed mb-4" style="color: var(--text-secondary);">{description}</p>
    <p class="text-xs mt-auto" style="color: var(--text-tertiary);">{date}</p>
  </div>
</a>
```

**Computed styles:**
- Card container: padding 40px, flex-col, background: var(--bg-card) #111111
- Card icon: 48x48px, border-radius 12px, border 1px solid var(--border), flex center, margin-bottom 20px
- Card icon SVG: 28px (w-7 h-7)
- Card title: 16px, weight 600, line-height 24px
- Card desc: 14px, weight 400, line-height approx 21px
- Card date: 12px, color var(--text-tertiary)
- Border-right: 1px solid var(--border) between cards in grid

---

### 7. Project Grid (`ProjectGrid`)
**File suggestion:** `src/components/ProjectGrid.tsx`
**Interaction model:** Static container

**Structure:**
```
<div class="project-grid current-grid">
  [ProjectCard x3]
</div>
```

**Computed styles:**
- display: grid
- grid-template-columns: repeat(3, 1fr)  [computed: 426px 426px 426px at 1440px viewport]
- border-radius: 12px
- border: 1px solid var(--border) = rgb(42,42,42)
- overflow: hidden
- width: 1280px at desktop

---

### 8. Archive Header (within Projects page)
**Inline in ProjectsPage component**

**Structure:**
```
<div class="px-6 sm:px-8 py-8 sm:py-12 flex items-baseline gap-3">
  <h2 class="text-lg font-semibold tracking-tight" style="color: var(--text-primary);">
    Archive (2020–2023)
  </h2>
  <span class="text-xs font-normal" style="color: var(--text-tertiary);">
    Mostly nonsense preserved for posterity
  </span>
</div>
```

---

### 9. Words Row (`WordsRow`)
**File suggestion:** `src/components/WordsRow.tsx`
**Interaction model:** Click (link), hover (underline + arrow)

**Structure:**
```
<a href={href} class="group grid items-center gap-x-3 sm:gap-x-6 py-5 transition-colors duration-200"
   style="grid-template-columns: 6rem 1fr; border-bottom: 1px solid var(--border);">
  <span class="text-xs" style="color: var(--text-tertiary);">{date}</span>
  <span class="flex items-center min-w-0">
    <span class="text-sm font-medium transition-colors duration-200 group-hover:underline underline-offset-2 truncate"
          style="color: var(--text-primary);">{title}</span>
    <svg class="w-3.5 h-3.5 ml-4 shrink-0 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">[arrow SVG]</svg>
  </span>
</a>
```

**Column header:**
```
<div class="grid items-baseline gap-x-3 sm:gap-x-6 py-3 text-xs uppercase tracking-wider"
     style="grid-template-columns: 6rem 1fr; border-bottom: 1px solid var(--border); color: var(--text-tertiary);">
  <span>Date</span>
  <span>Title</span>
</div>
```

---

### 10. About Sidebar Tree (`AboutSidebar`)
**File suggestion:** part of About page component
**Interaction model:** Static (details/summary native HTML disclosure)

**Structure:**
```
<details class="about-details" open>
  <summary class="tree-label">CONTACT</summary>
  <ul class="tree-children">
    <li>
      <a href="mailto:..." class="about-link">
        <svg>[email icon]</svg>
        zach@wvrk.org
      </a>
    </li>
  </ul>
</details>
```

**CSS:**
- `.tree-label` (summary): font-size 12px, weight 600, uppercase, letter-spacing 0.6px, margin-bottom 8px, display flex, align-items center, gap 12px
- `.tree-children` (ul): padding-left 16px
- `.about-link` (a): font-size 14px, color var(--text-secondary), display inline-flex, align-items center, gap 6px, padding-left 4px

---

## Reusable UI Patterns

### Arrow Icon (appears on hover)
Used in: project cards, words rows
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
  <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"/>
</svg>
```
Right-arrow (→) version used in words rows:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
</svg>
```

### Inline Code Style
```html
<code class="text-xs px-1 py-0.5 rounded" style="background: var(--inline-code-bg, #e5e5e5);">code</code>
```

### Two-Column Page Layout (Words, About)
```
<div class="px-6 sm:px-8 mx-auto flex-1 flex flex-col w-full" style="max-width: 80rem;">
  <div class="flex flex-col lg:flex-row gap-8 lg:gap-0 flex-1">
    <div class="lg:w-1/4 lg:pr-12 xl:pr-24 shrink-0 pt-12 sm:pt-20">
      {sidebar content}
    </div>
    <div class="hidden lg:block w-px shrink-0" style="border-left: 1px solid var(--border);">
    <div class="lg:pl-12 xl:pl-24 flex-1 pt-2 lg:pt-20 pb-16">
      {main content}
    </div>
  </div>
</div>
```

---

## SVG Icons Used

All icons appear to be from the **Phosphor Icons** library (based on SVG path structure and viewBox="0 0 256 256").

### In Header:
- **Hamburger (Menu)**: three horizontal lines
- **Email (Envelope)**: outline + fill variants
- **Music Note**: outline + fill
- **Disco (Broadcast)**: concentric circles
- **Sunset (Sun Horizon)**: sun half below horizon
- **Paint Brush/Pencil**: for canvas color
- **Trash/Clear**: for canvas clear (turns red when active)
- **Sound on/off**: speaker with waves (outline + fill)
- **Sun**: for light mode toggle
- **Moon**: for dark mode toggle
- **X (Close)**: for mobile menu close
- **Caret Right**: for mobile nav items
- **Home**: mobile home icon

### In Cards/Lists:
- Various Phosphor icons one per project (molecule, flask, book, branch, etc.)
- Arrow NE (↗) for "open external link" on card hover
- Arrow Right (→) for list row hover

---

## Technical Stack Notes
- **Framework:** Astro (not Next.js) — static HTML with hydrated islands
- **CSS:** Tailwind CSS v3 (utility classes) + custom CSS in separate stylesheet
- **Icons:** Phosphor Icons (SVG inline)
- **Font:** Soehne (commercial, Klim) — closest open alternative: Inter or Neue Haas Grotesk
- **Audio:** soundfont-player + MusyngKite soundfonts
- **Canvas:** Raw HTML5 Canvas 2D API
- **Hosting:** Vercel
- **Analytics:** Vercel Speed Insights + Analytics

---

## Assets

### Favicons
- `/favicon.png` — single favicon

### OG Image
- `https://zchry.org/og.png` — 1200x630px

### No other images
- No `<img>` tags on any inspected page
- All icons are inline SVGs
- The "images" are the canvas-rendered waveform and any user drawings

### Audio Assets (external)
- MusyngKite acoustic_grand_piano soundfont (loaded from CDN by soundfont-player)
