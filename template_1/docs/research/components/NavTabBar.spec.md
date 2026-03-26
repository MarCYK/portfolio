# NavTabBar Specification

## Overview
- **Target file:** `src/components/NavTabBar.tsx`
- **Screenshot:** `docs/design-references/desktop-full.png` (top strip)
- **Interaction model:** click-driven (tab navigation, light mode toggle, sidebar toggle)

## DOM Structure
```
nav.c-gui__panel__header
├── div.c-gui__panel__header__tabs
│   └── button.c-gui__panel__header__tabs__tab.c-gui__panel__header__tabs__tab--active
│       └── "fine-thought.js"
└── div.c-gui__panel__header__actions
    ├── button.c-gui__panel__header__button.c-gui__panel__header__button--light-mode
    │   └── <SunIcon>
    └── button.c-gui__panel__header__button.c-gui__panel__header__button--sidebar
        └── <SidebarIcon>
```

## Computed Styles (exact values from getComputedStyle)

### nav.c-gui__panel__header
- display: flex
- align-items: stretch
- height: 1.6875rem (27px) at desktop ≥1024px, 2.25rem (36px) at mobile/tablet
- border-bottom: 0.0625rem solid #5e5e5e (dark) / #d6e2fb (light)
- background-color: #3c3c3c (dark) / #eef2f9 (light)
- position: relative
- z-index: 10
- flex-shrink: 0

### div.c-gui__panel__header__tabs
- display: flex
- align-items: stretch
- flex: 1
- overflow: hidden

### tab button (active state — "fine-thought.js")
- display: flex
- align-items: center
- padding: 0 0.625rem (0 10px)
- font-family: "code-saver", sans-serif
- font-weight: 500
- font-size: 0.75rem (12px)
- color: #bababa (dark) / #5c5c5c (light) — inactive
- color: #eaeaea (dark) / #282828 (light) — active
- border-right: 0.0625rem solid #5e5e5e (dark) / #d6e2fb (light)
- border-bottom: 0.125rem solid #aec6f6 (accent, active state)
- border-bottom: 0.125rem solid transparent (inactive state)
- background-color: #282828 (dark) / #ffffff (light) [active — matches page bg]
- cursor: pointer
- white-space: nowrap
- transition: color 0.25s, background-color 0.25s, border-color 0.25s

### div.c-gui__panel__header__actions
- display: flex
- align-items: center
- flex-shrink: 0

### button.c-gui__panel__header__button
- position: relative
- display: flex
- align-items: center
- justify-content: center
- width: 1.625rem (26px)
- height: 100% (full nav height)
- cursor: pointer
- background: transparent
- border: none
- color: #898989 (dark) / #919191 (light) — default
- transition: color 0.25s

### button::before (circular hover indicator)
- content: ""
- position: absolute
- inset: 0.25rem
- border-radius: 50%
- background-color: rgba(255, 255, 255, 0) — default
- transition: background-color 0.25s
- On hover (.state-mouse-events active): background-color: rgba(255, 255, 255, 0.075)

## States & Behaviors

### Light mode toggle
- **Trigger:** click on .c-gui__panel__header__button--light-mode
- **State A (off — dark mode):** toggles `state-light-mode` OFF on html element; icon color #898989
- **State B (on — light mode):** adds `state-light-mode` to html element; icon color #2756c9
- **Transition:** All color changes 0.25s
- **Implementation approach:** React state + class toggle on document.documentElement

### Sidebar toggle
- **Trigger:** click on .c-gui__panel__header__button--sidebar
- **State A (closed):** icon color #898989
- **State B (open):** adds `state-info-open` to html element; icon color #2756c9; info panel becomes visible
- **Transition:** Panel opacity 0.4s linear with delay
- **Implementation approach:** React state passed as prop / context

### Hover state (buttons)
- **Element:** .c-gui__panel__header__button
- **Condition:** .state-mouse-events class must be on html element (mouse device detection)
- **Before:** ::before background rgba(255,255,255,0)
- **After:** ::before background rgba(255,255,255,0.075)
- **Transition:** background-color 0.25s

### Tab hover
- **Before:** color: #898989 (dark)
- **After:** color: #eaeaea (dark); background: rgba(255,255,255,0.075)
- **Condition:** .state-mouse-events

## Assets
- Icons: `SunIcon`, `SidebarIcon` from `src/components/icons.tsx`

## Text Content (verbatim)
- Tab label: "fine-thought.js"

## Responsive Behavior
- **Desktop (≥1024px):** height 1.6875rem (27px); shown at top of main panel
- **Tablet (760px–1024px):** height 2.25rem (36px); nav at BOTTOM of viewport (flex-direction: column-reverse on .c-gui)
- **Mobile (<760px):** height 2.25rem (36px); nav at top; sidebar button opens full-screen overlay

## Props Interface
```typescript
interface NavTabBarProps {
  isLightMode: boolean;
  isSidebarOpen: boolean;
  onLightModeToggle: () => void;
  onSidebarToggle: () => void;
}
```
