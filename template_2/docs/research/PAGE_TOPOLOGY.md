# Page Topology — zchry.org

## Overall Architecture

The site is an Astro-based portfolio with 4 pages. The overall page structure is:
- `<body class="flex flex-col overflow-hidden" style="height: 100svh;">`
  - `<header id="site-header">` — Sticky navigation (z-50)
  - `<div id="mobile-menu">` — Full-screen overlay menu (hidden by default)
  - `<main id="scroll-root" class="flex-1 overflow-y-auto flex flex-col">` — Scrollable content area
  - Vercel analytics scripts

**Key insight**: The body is `overflow-hidden` and `height: 100svh`. Scrolling happens INSIDE `#scroll-root`, NOT on the window. This is a scrolled-inner-div pattern.

---

## Page 1: Home (/) — Dark Mode Canvas

**URL:** `https://www.zchry.org/`
**Body classes:** `flex flex-col overflow-hidden` + dark theme applied
**Interaction model:** The entire page is a canvas drawing area. Users draw on it with their mouse/touch.

### Sections (top to bottom):
1. **Header/Nav** — `<header id="site-header" class="home-page">` — always visible
2. **Canvas** — `<canvas id="grid-canvas">` — fills remaining space, fixed positioned (z-0)

### Canvas Behavior:
- The canvas is `position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; cursor: crosshair; pointer-events: auto`
- Users click/drag to draw colored rows on a Joy Division-style waveform
- The waveform animates continuously with sine wave motion
- Drawing triggers piano notes (acoustic grand piano soundfont)

### Header on Home Page:
- Has extra `.home-page` class that:
  - Removes bottom border
  - Shows canvas-specific buttons: Music Toggle, Disco Toggle, Sunset Toggle, Canvas Clear
  - Adds `::after` pseudo-element: gradient fade from bg to transparent, height 40px
- Extra buttons shown only on home: music, disco, sunset, color palette, clear canvas
- Color palette dropdown: 8 colored swatches (default/rainbow, red, orange, yellow, green, blue, purple, pink)

---

## Page 2: Projects (/projects)

**URL:** `https://www.zchry.org/projects`
**Title:** "zchry - Projects"
**Interaction model:** Static grid with hover effects. Links open externally or to project detail pages.

### Page Structure:
```
<main id="scroll-root">
  <div class="flex-1 pb-20 sm:pb-24">
    <div class="work-grid-page" style="margin: 0 auto; max-width: 1280px;">
      <header class="px-6 sm:px-8 pt-12 sm:pt-20 pb-10 sm:pb-14">
        <h1>Projects</h1>
        <p>Things I've built / building.</p>
      </header>
      <div class="project-grid current-grid">  <!-- 3 cards -->
      <div class="project-grid archive-grid">  <!-- 2 rows of 3 = 6 cards -->
    </div>
  </div>
  <footer class="site-footer text-xs">
</main>
```

### Current Projects Grid:
- 3 columns × 1 row, `border-radius: 12px`, `border: 1px solid var(--border)`
- Each card: 40px padding, flex-col layout, `border-right: 1px solid var(--border)` (divider between cards)

**Current Projects (3):**
| Title | Description | Date | Link |
|-------|-------------|------|------|
| erebus.org | A cognition primitive. | March 2026 | https://erebus.org |
| wvrk.org | A laboratory for experimental AI work. | February 2026 | https://wvrk.org/ |
| Milton | An LLM trained on Paradise Lost and nothing else. | February 2026 | /projects/milton |

### Archive Grid (2020–2023):
- Preceded by archive header with title "Archive (2020–2023)" and subtitle "Mostly nonsense preserved for posterity"
- Same grid style as current, 3 columns × 2 rows = 6 cards

**Archive Projects (6):**
| Title | Description | Date | Link |
|-------|-------------|------|------|
| Work Library™ | A curated collection of rare and interesting books, shared on Instagram and TikTok. | September 2023 | https://www.instagram.com/worklibrary/ |
| Lissajous Curves | A Figma plugin for drawing Lissajous curves as live stroke vectors. | June 2023 | https://www.figma.com/community/plugin/1232402036106953267/Lissajous-Curves |
| Manufactured Human | A DALL·E powered exploration of our perceptions of reality, presented without context. | June 2022 | https://manufacturedhuman.webflow.io/ |
| Solipsism Wow! | A marketing campaign to promote the joyful philosophical concept of Solipsism — the idea that only one's mind is sure to exist. | March 2022 | https://solipsism.webflow.io/ |
| Roam By Land | An outdoor adventure journal documenting trips and time spent in nature. | June 2021 | https://www.instagram.com/roambyland |
| Absurdly | Existentialism as a Service. | June 2020 | /projects/absurdly |

---

## Page 3: Words (/words)

**URL:** `https://www.zchry.org/words`
**Title:** "zchry - Words"
**Interaction model:** Static list. Links open article pages.

### Page Structure:
```
<main id="scroll-root">
  <div class="px-6 sm:px-8 mx-auto flex-1 flex flex-col w-full" style="max-width: 80rem;">
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-0 flex-1">
      <!-- Sidebar (left 1/4 on lg) -->
      <div class="lg:w-1/4 lg:pr-12 xl:pr-24 shrink-0 pt-12 sm:pt-20">
        <h1>Words</h1>
        <p>Thoughts and things.</p>
      </div>
      <!-- Vertical divider (desktop only) -->
      <div class="hidden lg:block w-px shrink-0" style="border-left: 1px solid var(--border);">
      <!-- Main content (right side) -->
      <div class="lg:pl-12 xl:pl-24 flex-1 pt-2 lg:pt-20 pb-16 lg:pb-8">
        <div id="posts-list">
          <!-- Header row (DATE | TITLE) -->
          <!-- Article rows -->
          <!-- Archive section -->
        </div>
      </div>
    </div>
  </div>
  <footer>
```

### Posts List Structure:
- Column header: `grid-template-columns: 6rem 1fr`, text-xs uppercase tracking-wider, border-bottom
- Each row: `<a>` with grid layout, `py-5`, `border-bottom: 1px solid var(--border)`
  - Left cell: date (`text-xs`, color: `var(--text-tertiary)`)
  - Right cell: title (`text-sm font-medium`) + arrow icon (appears on hover)

### Recent Posts (2):
| Date | Title | Slug |
|------|-------|------|
| Mar 24, 2026 | On Researching with LLMs | /words/on-researching-with-llms |
| Feb 27, 2026 | It's Been Awhile | /words/hi-again |

### Archive Posts (7):
| Date | Title | Slug |
|------|-------|------|
| Oct 15, 2023 | I Know Nothing | /words/i-know-nothing |
| Jun 10, 2023 | Quantum Leap: An Ongoing Game of Self-Interrogation | /words/questioning-my-quantum-leap-an-ongoing-game-of-self-interrogation |
| Jun 8, 2023 | Building a Brand Identity With Code | /words/building-a-brand-identity-with-code |
| Jun 6, 2023 | Objectively Evolving Your Own Subjectivity | /words/objectively-evolving-your-own-subjectivity |
| Jun 2, 2023 | LLMs Helped Me Understand How I Work | /words/chatgpt-helped-me-realize-how-i-work |
| Feb 20, 2023 | On AI, the Internet, and Everything In-Between | /words/on-ai-the-internet-and-everything-in-between |
| Jan 5, 2023 | The Revision Hole | /words/revision-hole |

---

## Page 4: About (/about)

**URL:** `https://www.zchry.org/about`
**Title:** "zchry - About"
**Interaction model:** Static content. Links open externally.

### Page Structure:
```
<main id="scroll-root">
  <div class="px-6 sm:px-8 mx-auto flex-1 flex flex-col w-full" style="max-width: 80rem;">
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-0 flex-1">
      <!-- Sidebar (left 1/4 on lg) -->
      <div class="lg:w-1/4 lg:pr-12 xl:pr-24 shrink-0 pt-12 sm:pt-20">
        <h1>About</h1>
        <p>Existentially ambiguous.</p>
        <!-- Contact + Links details tree -->
        <div class="space-y-6">
          <details class="about-details" open>
            <summary class="tree-label">CONTACT</summary>
            <ul class="tree-children">
              <li><a href="mailto:zach@wvrk.org" class="about-link">zach@wvrk.org</a></li>
            </ul>
          </details>
          <details class="about-details" open>
            <summary class="tree-label">LINKS</summary>
            <ul class="tree-children">
              <li><a href="https://www.linkedin.com/in/zchry/" class="about-link">LinkedIn</a></li>
            </ul>
          </details>
        </div>
      </div>
      <!-- Vertical divider (desktop only) -->
      <div class="hidden lg:block w-px shrink-0" style="border-left: 1px solid var(--border);">
      <!-- Main content -->
      <div class="lg:pl-12 xl:pl-24 flex-1 pt-2 lg:pt-20 pb-28 lg:pb-28">
        <div class="lg:max-w-xl space-y-12">
          <h1>Zachary</h1>  <!-- Second h1! -->
          <section>Intro paragraph</section>
          <section>THE PIANO section</section>
          <section>THE WAVEFORM section</section>
        </div>
      </div>
    </div>
  </div>
  <footer>
```

### About Content (verbatim):

**Sidebar title:** "About" / tagline: "Existentially ambiguous."

**Contact:** zach@wvrk.org
**Links:** LinkedIn → https://www.linkedin.com/in/zchry/

**Main heading:** "Zachary"

**Bio paragraph:**
> Zachary, a Senior Product Designer / Design Engineer at WarpStream working on `product`, `ui/ux`, `frontend development`, `web` and `gtm` initiatives.
>
> I'm entirely motivated by making sense of it all. In the existential sense.

**THE PIANO section:**
> The piano song on the homepage is a cover of Maxence Cyrin's solo piano rendition of the Pixies' "Where Is My Mind," sourced from an OnlineSequencer.net arrangement whose protobuf-encoded note data was decoded with a custom Python script to extract all 527 note events. The sequencer runs at 80 BPM inside the `requestAnimationFrame` loop so audio and visuals fire in the same tick with zero drift. Each note plays through the MusyngKite acoustic grand piano soundfont loaded via soundfont-player, with volume shaping that boosts melody, cuts bass, and softens high notes.
>
> Every playing note maps its MIDI pitch to a row on the Joy Division waveform and injects energy that decays over time, bleeding into neighboring rows so chords spread across the canvas. Simultaneous notes that collide on the same row get nudged apart so every note stays visible as the song ripples through. Low notes render warm, high notes cool.

**THE WAVEFORM section:**
> The background canvas draws a stacked-line waveform modeled after the Unknown Pleasures album cover by Joy Division, itself a plot of radio pulses from the pulsar CP 1919. Each row is filled beneath its curve to occlude the row behind it, producing the same layered depth as the original. The waveform is continuously animated with layered sine functions that shift over time.

---

## Footer (shared across all inner pages)

Present on: /projects, /words, /about (NOT on home /)
```html
<footer class="site-footer text-xs">
  <div class="flex items-center justify-between px-6 sm:px-8 mx-auto w-full" style="max-width: 80rem;">
    <span>© 2026 zchry</span>
    <a href="/"><svg class="footer-logo" ...></svg></a>  <!-- Logo SVG hidden on mobile -->
    <div class="flex items-center gap-3">
      <a href="https://www.linkedin.com/in/zchry/">LinkedIn</a>
      <a href="/rss.xml">RSS</a>
    </div>
  </div>
</footer>
```
- Font size: 12px, color: `var(--text-secondary)` = #a3a3a3 (dark mode)
- Padding: 24px 0
- Max-width: 80rem

---

## Global Navigation (Header)

### Desktop Layout (≥768px):
```
[Zach + Logo SVG] [Projects] [Words] [About]   |   [email icon] [music] [disco] [sunset] [swatches] [sound] [theme toggle]
```
- Left: Logo link + desktop nav links
- Right: Icon bar (email, canvas controls, sound, theme toggle)

### Mobile Layout (<768px):
- Header: `[Hamburger] ← → [Logo] [Theme toggle]`
- Bottom fixed bar: `[Home icon] [email icon] [music] [disco] [sunset] [swatches] [sound]`
- Full-screen menu overlay (z-60) when hamburger clicked

### Canvas-Only Buttons (home page only, `display: none` on inner pages):
- `#music-toggle` — play/pause piano music
- `#disco-toggle` — disco mode
- `#sunset-toggle` — sunset mode (changes to warmer colors)
- `#canvas-clear-btn` — clear the canvas

### Theme Toggle:
- Present in header right area
- Sun icon (light mode) / Moon icon (dark mode)
- `id="theme-toggle"`

---

## Z-Index Stack
1. Canvas (z-0): Background
2. Header (z-50): Navigation overlay
3. Mobile icon bar (z-50): Fixed bottom bar
4. Mobile menu (z-60): Full-screen overlay
