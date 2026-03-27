# SiteHeader Specification

## Overview
- **Target file:** `src/components/SiteHeader.tsx`
- **Screenshot:** `docs/design-references/desktop-full.png` (top 52px)
- **Interaction model:** Click-driven (nav links, icon buttons, hamburger)
- **Variants:** `isHomePage` prop — home has no bottom border + gradient ::after effect (implement via CSS class `home-page`)

## DOM Structure

```
<header id="site-header" className={`header-nav flex flex-row items-center justify-between px-6 py-2.5 ${isHomePage ? 'home-page' : ''}`}>
  <div className="flex items-center gap-5">
    <a href="/" className="flex items-center gap-2">
      <span className="zach-logo text-base font-semibold tracking-tight">Zach</span>
      <LogoDiamond className="h-4" />
    </a>
    <nav className="desktop-nav items-center gap-4 text-sm">
      <a href="/projects" className={`nav-link ${pathname === '/projects' ? 'active' : ''}`}>Projects</a>
      <a href="/words" className={`nav-link ${pathname === '/words' ? 'active' : ''}`}>Words</a>
      <a href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</a>
    </nav>
  </div>
  <button id="menu-toggle" className="hamburger-btn header-icon md:hidden">
    <HamburgerIcon />
  </button>
  <div id="icon-bar" className="icon-bar hidden md:flex items-center gap-3">
    <a href="mailto:zach@wvrk.org" className="header-icon">
      <EnvelopeOutlineIcon className="icon-outline" />
      <EnvelopeFillIcon className="icon-fill" />
    </a>
    <span id="header-chord" className="hidden font-mono text-xs" style={{color: 'var(--text-secondary)'}}></span>
    {/* Canvas-only buttons — only shown on home page */}
    {isHomePage && <>
      <button id="music-toggle" className="header-icon">
        <MusicNoteOutlineIcon className="icon-outline" />
        <MusicNoteFillIcon className="icon-fill" />
      </button>
      <button id="disco-toggle" className="header-icon">
        <BroadcastOutlineIcon className="icon-outline" />
        <BroadcastFillIcon className="icon-fill" />
      </button>
      <button id="sunset-toggle" className="header-icon">
        <SunHorizonOutlineIcon className="icon-outline" />
        <SunHorizonFillIcon className="icon-fill" />
      </button>
      <div className="relative">
        <button id="palette-toggle" className="header-icon">
          <PaintBrushOutlineIcon className="icon-outline" />
          <PaintBrushFillIcon className="icon-fill" />
        </button>
        <div id="color-palette" className="color-palette hidden">
          <div className="color-palette-inner">
            {/* 8 swatches */}
          </div>
        </div>
      </div>
      <button id="canvas-clear-btn" className="canvas-clear-btn header-icon">
        <TrashOutlineIcon />
      </button>
    </>}
    <button id="sound-toggle" className="header-icon">
      <SpeakerOutlineIcon className="icon-outline" />
      <SpeakerFillIcon className="icon-fill" />
    </button>
    <button id="theme-toggle" className="header-icon">
      <SunOutlineIcon className="icon-outline sun-icon" />
      <MoonOutlineIcon className="icon-fill moon-icon" />
    </button>
  </div>
</header>
```

## Computed Styles

### Header container
- height: 52px
- padding: 10px 24px (py-2.5 px-6)
- background-color: var(--bg-primary) = #0a0a0a dark / #ffffff light
- position: relative
- z-index: 50
- border-bottom: 1px solid var(--border) on inner pages; NONE on home page
- flex-shrink: 0

### Logo "Zach" text (.zach-logo)
- font-size: 16px
- font-weight: 600
- letter-spacing: -0.025em (tracking-tight)
- color: var(--text-primary) = #fafafa dark
- transition: color 0.15s
- hover color: #ff8181

### Logo diamond SVG
- height: 16px (h-4)
- width: auto

### Desktop nav (.desktop-nav)
- display: none on <768px, flex on ≥768px
- gap: 16px (gap-4)
- font-size: 14px

### Nav links (.nav-link)
- color: rgba(255,255,255,0.5) dark / rgba(0,0,0,0.4) light (muted)
- hover/active: color: #ffffff dark / #000000 light (full opacity)
- transition: color 0.15s
- font-size: 14px
- text-decoration: none

### Header icons (.header-icon)
- color: rgba(255,255,255,0.5) dark (muted)
- hover/active: color: #ffffff dark (full opacity)
- transition: color 0.15s
- cursor: pointer
- size: 18px SVGs
- icon-outline shown by default, icon-fill shown on hover/active
- NO background or border

### Hamburger button
- display: block on <768px, NONE on ≥768px
- same .header-icon styles

## States & Behaviors

### Logo hover
- Trigger: hover on `.zach-logo` link `<a>`
- State A: color: var(--text-primary) = #fafafa
- State B: color: #ff8181
- Transition: color 0.15s

### Nav link active state
- The currently active page link gets `.active` class (full opacity)
- Detect current route via `usePathname()` from next/navigation

### Theme toggle
- Clicking #theme-toggle toggles `.dark` class on `<html>` element
- Sun icon shown when in dark mode (so clicking will switch to light)
- Moon icon shown when in light mode (so clicking will switch to dark)
- Implementation: use state + useEffect to toggle class

### Sound toggle
- Clicking #sound-toggle dispatches a custom event `soundToggle` on the window
- Initial state from localStorage: `localStorage.getItem('sound') === 'enabled'`
- Active class shown when sound is enabled

### Canvas buttons (home page only)
- #music-toggle: dispatches custom event `musicToggle` on window
- #disco-toggle: dispatches custom event `discoToggle` on window
- #sunset-toggle: dispatches custom event `sunsetToggle` on window, also toggles `.sunset-active` class on body
- #palette-toggle: toggles visibility of #color-palette div
- #canvas-clear-btn: dispatches custom event `canvasClear` on window; has class `visible` when canvas is dirty

### Color palette swatches
- 8 swatches in a vertical column
- Default (gradient): `background: linear-gradient(135deg, #fff 50%, #000 50%)`
- Red: #ef4444
- Orange: #f97316
- Yellow: #eab308
- Green: #22c55e
- Blue: #3b82f6
- Purple: #8b5cf6
- Pink: #ec4899
- Clicking dispatches custom event `colorChange` with detail: `{ color: hexValue }`
- Active swatch: border-color: var(--text-primary)

## Responsive Behavior
- Desktop (≥768px): logo + desktop nav on left, icon-bar on right, hamburger hidden
- Mobile (<768px): logo on left, hamburger on right, desktop nav hidden, icon-bar hidden
- The icon-bar items (email, canvas, sound, theme) move to a fixed bottom bar on mobile (handled by MobileIconBar component)

## Implementation Notes
- This is a `"use client"` component (needs useState for palette, sound, theme state)
- Use `usePathname()` from `next/navigation` for active link detection
- Export a `SiteHeader` component with props: `{ isHomePage?: boolean }`
- After rendering, the canvas component will wire up canvas-related button events via window custom events
- Theme toggle sets/removes `.dark` class on `document.documentElement`
- Sound toggle: toggle `localStorage.setItem('sound', enabled ? 'enabled' : 'disabled')`
