# SiteFooter Specification

## Overview
- **Target file:** `src/components/SiteFooter.tsx`
- **Interaction model:** Static links
- **Present on:** /projects, /words, /about (NOT home page /)

## DOM Structure

```tsx
<footer className="site-footer text-xs">
  <div
    className="flex items-center justify-between px-6 sm:px-8 mx-auto w-full"
    style={{ maxWidth: '80rem' }}
  >
    <span style={{ color: 'var(--text-secondary)' }}>© 2026 zchry</span>
    <a href="/" className="footer-logo hidden sm:block">
      <LogoDiamond className="footer-logo" />
    </a>
    <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
      <a
        href="https://www.linkedin.com/in/zchry/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
        className="hover:underline"
      >
        LinkedIn
      </a>
      <a
        href="/rss.xml"
        style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
        className="hover:underline"
      >
        RSS
      </a>
    </div>
  </div>
</footer>
```

## Computed Styles

### Footer container (.site-footer)
- font-size: 12px
- color: var(--text-secondary) = #a3a3a3 in dark mode, #525252 in light
- padding: 24px 0
- border-top: 1px solid var(--border)
- flex-shrink: 0

### Footer logo
- height: 12px
- width: auto
- hidden on mobile (<640px): `hidden sm:block`

### Inner container
- display: flex
- align-items: center
- justify-content: space-between
- padding: 0 24px (sm: 0 32px)
- max-width: 80rem
- margin: 0 auto
- width: 100%

### Links
- color: var(--text-secondary)
- text-decoration: none
- hover: underline

## Responsive Behavior
- All viewports: flex row, space-between
- Mobile: footer-logo hidden (only visible sm+)
