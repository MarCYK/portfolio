# GUIShell Specification

## Overview
- **Target file:** `src/components/GUIShell.tsx`
- **Screenshot:** `docs/design-references/desktop-full.png`
- **Interaction model:** scroll-driven (page content) + click-driven (sidebar/light mode toggles)

## DOM Structure
```
div.c-gui [position: fixed, inset: 0, flex-direction: row]
├── div.c-gui__panel--info [left sidebar, hidden by default]
│   └── {sidebar content — children prop}
└── div.c-gui__panel--main [main panel, flex: 1]
    ├── NavTabBar [top nav, z:10]
    └── main.c-gui__panel__content [scrollable content area]
        └── div.c-page [custom scroll container]
            └── div.c-page__inner [flex, line numbers + content]
                ├── div.c-page__lines-column [28px gutter]
                │   └── LineNumbers component
                └── div.c-page__content-column [remaining width]
                    └── {page content — children prop}
```

## Computed Styles (exact values from getComputedStyle)

### div.c-gui
- position: fixed
- inset: 0 (top: 0, right: 0, bottom: 0, left: 0)
- width: 100vw
- height: 100vh
- display: flex
- flex-direction: row
- background-color: #282828 (dark) / #ffffff (light)
- transition: background-color 0.25s
- overflow: hidden

### div.c-gui__panel--main
- flex: 1
- min-width: 0
- display: flex
- flex-direction: column
- position: relative
- overflow: hidden

### div.c-gui__panel--info (default: hidden)
- width: 0 (closed), 25rem / 400px (open on desktop)
- overflow: hidden
- display: flex
- flex-direction: column
- border-right: 0.0625rem solid #5e5e5e (dark) / #d6e2fb (light)
- background-color: #282828 (dark) / #ffffff (light)
- opacity: 0 (closed), 1 (open)
- pointer-events: none (closed), auto (open)
- transition: opacity 0.4s linear 0.5s (desktop), 0.4s linear 0.125s (tablet)
- flex-shrink: 0

### main.c-gui__panel__content
- flex: 1
- position: relative
- overflow: hidden

### div.c-page (custom scroll container)
- position: absolute
- inset: 0
- overflow-y: scroll
- scrollbar-width: none
- overscroll-behavior: none
- [webkit scrollbar hidden]

### div.c-page__inner
- display: flex
- min-height: 100%
- position: relative

### div.c-page__lines-column
- width: 1.75rem (28px)
- flex-shrink: 0
- border-right: 0.0625rem solid #5e5e5e (dark) / #d6e2fb (light)
- padding-top: 0.25rem
- display: flex
- flex-direction: column
- align-items: flex-end
- padding-right: 0.375rem
- position: relative
- z-index: 2
- transition: border-color 0.25s

### div.c-page__content-column
- flex: 1
- min-width: 0
- position: relative

## States & Behaviors

### Light mode (state-light-mode on html)
- html.state-light-mode causes ALL CSS variables to swap to light values
- All color transitions: 0.25s
- Implementation: toggle class on document.documentElement

### Sidebar open (state-info-open on html)
- Info panel: width → 25rem, opacity → 1
- Transition: opacity 0.4s linear 0.5s

### Page scroll
- Scroll container is .c-page (NOT window)
- scrollbar hidden
- Content scrolls inside the fixed GUI shell

### Mouse events detection
- On first mousemove: add .state-mouse-events to html element
- On first touch: remove .state-mouse-events (prevents hover states on touch)

### Site loaded
- After mount: add .state-site-loaded to html element
- This triggers .c-cover fade-out

## Assets
- None directly — this is a layout shell

## Text Content
- None — renders children

## Responsive Behavior
- **Desktop (≥1024px):**
  - flex-direction: row on .c-gui
  - Info panel as left sidebar (25rem wide when open)
  - Nav at TOP of main panel
  - Line numbers always visible (28px gutter)

- **Tablet (760px–1024px):**
  - flex-direction: column-reverse on .c-gui
  - Nav at BOTTOM of viewport
  - Info panel full-width bottom sheet when open
  - No transition on panel (instant)

- **Mobile (<760px):**
  - Info panel as full-screen overlay when open
  - Nav at TOP

## Props Interface
```typescript
interface GUIShellProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}
```

## Implementation Notes
- GUIShell manages: isLightMode, isSidebarOpen, hasMouse, isSiteLoaded state
- Adds state-light-mode, state-info-open, state-mouse-events, state-site-loaded classes to html element on mount and toggle
- Contains the NavTabBar, line numbers column, and page scroll container
- The c-cover div should be rendered inside GUIShell (fades out after mount)
- Line numbers: render ~200 sequential numbers as a list, CSS clips the visible ones
- Use useRef for the scroll container (c-page) to enable programmatic scroll if needed
- IMPORTANT: Read docs/next.js guide before writing any Next.js-specific code
