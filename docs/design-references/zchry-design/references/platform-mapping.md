# zchry-design — Platform Mapping

## 1. HTML / CSS / Web

### Font loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Soehne is proprietary. Use local self-hosted files if available. Fallback is Inter/system-ui.

### CSS variables

```css
:root {
  --background: #FAFAFA;
  --bg: var(--background);
  --surface1: #FAFAFA;
  --surface2: #F5F5F5;
  --surface3: #EEEEEE;
  --border: #E5E5E5;
  --border-visible: #A3A3A3;
  --text1: #0A0A0A;
  --text2: #525252;
  --text3: #737373;
  --text4: #A3A3A3;
  --accent: #FF0000;
  --accent-subtle: #FFE3E3;
  --success: #22C55E;
  --success-bg: #DCFCE7;
  --warning: #EAB308;
  --warning-bg: #FEF9C3;
  --error: #EF4444;
  --error-bg: #FEE2E2;

  --font-display: "Soehne", "Inter", system-ui, sans-serif;
  --font-body: "Soehne", "Inter", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --text-display: 30px;
  --text-heading: 24px;
  --text-subheading: 18px;
  --text-body: 16px;
  --text-body-sm: 14px;
  --text-caption: 12px;
  --text-label: 12px;

  --space-2xs: 2px;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  --radius-cards: 12px;
  --radius-buttons: 8px;
  --radius-buttons-sm: 8px;
  --radius-inputs: 8px;
  --radius-tags: 999px;
  --radius-modals: 12px;

  --ease-fast: cubic-bezier(.4,0,.2,1);
  --ease-medium: cubic-bezier(.4,0,.2,1);
  --ease-slow: cubic-bezier(.4,0,.2,1);
  --duration-fast: 150ms;
  --duration-medium: 200ms;
  --duration-slow: 200ms;

  --shadow-1: none;
  --shadow-2: none;
  --shadow-3: none;
}

[data-theme="dark"] {
  --background: #0A0A0A;
  --bg: var(--background);
  --surface1: #111111;
  --surface2: #2A2A2A;
  --surface3: #3D3D3D;
  --border: #2A2A2A;
  --border-visible: #3D3D3D;
  --text1: #FAFAFA;
  --text2: #A3A3A3;
  --text3: #525252;
  --text4: #737373;
  --accent: #FF0000;
  --accent-subtle: #3D0000;
  --success: #22C55E;
  --success-bg: #14532D;
  --warning: #EAB308;
  --warning-bg: #78350F;
  --error: #EF4444;
  --error-bg: #7F1D1D;
}
```

## 2. SwiftUI / iOS

Use Asset Catalog for Any/Dark color pairs. Keep semantic names aligned with web tokens.

```swift
extension Color {
    static let zBackground = Color("zBackground")
    static let zSurface1 = Color("zSurface1")
    static let zSurface2 = Color("zSurface2")
    static let zSurface3 = Color("zSurface3")
    static let zBorder = Color("zBorder")
    static let zBorderVisible = Color("zBorderVisible")
    static let zText1 = Color("zText1")
    static let zText2 = Color("zText2")
    static let zText3 = Color("zText3")
    static let zText4 = Color("zText4")
    static let zAccent = Color("zAccent")
    static let zAccentSubtle = Color("zAccentSubtle")
}

extension Font {
    static let zDisplay = Font.custom("Soehne", size: 30).weight(.semibold)
    static let zHeading = Font.custom("Soehne", size: 24).weight(.semibold)
    static let zBody = Font.custom("Soehne", size: 16)
    static let zBodySmall = Font.custom("Soehne", size: 14)
    static let zMono = Font.custom("IBM Plex Mono", size: 12)
}
```

## 3. Tailwind extension

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: {
          1: 'var(--surface1)',
          2: 'var(--surface2)',
          3: 'var(--surface3)',
        },
        border: {
          DEFAULT: 'var(--border)',
          visible: 'var(--border-visible)',
        },
        text: {
          1: 'var(--text1)',
          2: 'var(--text2)',
          3: 'var(--text3)',
          4: 'var(--text4)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          subtle: 'var(--accent-subtle)',
        },
        success: { DEFAULT: 'var(--success)', bg: 'var(--success-bg)' },
        warning: { DEFAULT: 'var(--warning)', bg: 'var(--warning-bg)' },
        error: { DEFAULT: 'var(--error)', bg: 'var(--error-bg)' },
      },
      fontFamily: {
        display: ['Soehne', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Soehne', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        cards: '12px',
        buttons: '8px',
        inputs: '8px',
        tags: '999px',
        modals: '12px',
      },
      transitionDuration: {
        fast: '150ms',
        medium: '200ms',
      },
    },
  },
};
```
