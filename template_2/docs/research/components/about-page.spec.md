# About Page Specification

## Overview
- **Target files:**
  - `src/app/about/page.tsx`
- **Screenshot:** `docs/design-references/about-desktop.png`
- **Interaction model:** Static content. Links open externally. Details/summary native disclosure.

## Page Layout Structure

Same two-column layout as Words page:

```tsx
// src/app/about/page.tsx
<body dark>
  <SiteHeader />
  <main id="scroll-root" className="flex-1 overflow-y-auto flex flex-col">
    <div
      className="px-6 sm:px-8 mx-auto flex-1 flex flex-col w-full"
      style={{ maxWidth: '80rem' }}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 flex-1">
        {/* LEFT SIDEBAR */}
        <div className="lg:w-1/4 lg:pr-12 xl:pr-24 shrink-0 pt-12 sm:pt-20 pb-8">
          <h1 style={{fontSize:'30px',fontWeight:600,letterSpacing:'-0.025em',marginBottom:'12px',color:'var(--text-primary)'}}>
            About
          </h1>
          <p style={{fontSize:'14px',color:'var(--text-secondary)',marginBottom:'32px'}}>
            Existentially ambiguous.
          </p>

          {/* Contact + Links tree */}
          <div className="space-y-6">
            <details className="about-details" open>
              <summary className="tree-label">CONTACT</summary>
              <ul className="tree-children">
                <li>
                  <a href="mailto:zach@wvrk.org" className="about-link">
                    <EnvelopeOutlineIcon style={{width:'14px',height:'14px',flexShrink:0}} />
                    zach@wvrk.org
                  </a>
                </li>
              </ul>
            </details>
            <details className="about-details" open>
              <summary className="tree-label">LINKS</summary>
              <ul className="tree-children">
                <li>
                  <a href="https://www.linkedin.com/in/zchry/" className="about-link" target="_blank" rel="noopener noreferrer">
                    <LinkedInLogoIcon style={{width:'14px',height:'14px',flexShrink:0}} />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </details>
          </div>
        </div>

        {/* VERTICAL DIVIDER (desktop only) */}
        <div
          className="hidden lg:block w-px shrink-0"
          style={{ borderLeft: '1px solid var(--border)' }}
        />

        {/* MAIN CONTENT */}
        <div className="lg:pl-12 xl:pl-24 flex-1 pt-2 lg:pt-20 pb-28">
          <div className="lg:max-w-xl space-y-12">

            {/* Big name heading */}
            <h1 style={{fontSize:'30px',fontWeight:600,letterSpacing:'-0.025em',color:'var(--text-primary)'}}>
              Zachary
            </h1>

            {/* Bio section */}
            <section>
              <p className="prose-content">
                Zachary, a Senior Product Designer / Design Engineer at WarpStream working on{' '}
                <code>product</code>, <code>ui/ux</code>, <code>frontend development</code>,{' '}
                <code>web</code> and <code>gtm</code> initiatives.
              </p>
              <p className="prose-content">
                I'm entirely motivated by making sense of it all. In the existential sense.
              </p>
            </section>

            {/* THE PIANO section */}
            <section>
              <h2 style={{fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-tertiary)',marginBottom:'16px'}}>
                THE PIANO
              </h2>
              <div className="prose-content">
                <p>
                  The piano song on the homepage is a cover of Maxence Cyrin's solo piano rendition of
                  the Pixies' "Where Is My Mind," sourced from an OnlineSequencer.net arrangement whose
                  protobuf-encoded note data was decoded with a custom Python script to extract all 527
                  note events. The sequencer runs at 80 BPM inside the <code>requestAnimationFrame</code> loop
                  so audio and visuals fire in the same tick with zero drift. Each note plays through the
                  MusyngKite acoustic grand piano soundfont loaded via soundfont-player, with volume shaping
                  that boosts melody, cuts bass, and softens high notes.
                </p>
                <p>
                  Every playing note maps its MIDI pitch to a row on the Joy Division waveform and injects
                  energy that decays over time, bleeding into neighboring rows so chords spread across the
                  canvas. Simultaneous notes that collide on the same row get nudged apart so every note
                  stays visible as the song ripples through. Low notes render warm, high notes cool.
                </p>
              </div>
            </section>

            {/* THE WAVEFORM section */}
            <section>
              <h2 style={{fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-tertiary)',marginBottom:'16px'}}>
                THE WAVEFORM
              </h2>
              <div className="prose-content">
                <p>
                  The background canvas draws a stacked-line waveform modeled after the Unknown Pleasures
                  album cover by Joy Division, itself a plot of radio pulses from the pulsar CP 1919. Each
                  row is filled beneath its curve to occlude the row behind it, producing the same layered
                  depth as the original. The waveform is continuously animated with layered sine functions
                  that shift over time.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
    <SiteFooter />
  </main>
</body>
```

## Sidebar Styles

### About tree labels (.tree-label = summary element)
- font-size: 12px
- font-weight: 600
- text-transform: uppercase
- letter-spacing: 0.05em (tracking-wider)
- color: var(--text-tertiary) = #525252 dark
- display: flex
- align-items: center
- gap: 12px
- margin-bottom: 8px
- cursor: default (not clickable, both open by default)
- list-style: none (remove details marker)

### About links (.about-link)
- font-size: 14px
- color: var(--text-secondary) = #a3a3a3
- display: inline-flex
- align-items: center
- gap: 6px
- padding-left: 4px
- text-decoration: none
- transition: color 0.15s, text-decoration-color 0.15s
- text-underline-offset: 2px
- hover: text-decoration underline, color: var(--text-primary)

### Tree children (.tree-children = ul)
- list-style: none
- padding-left: 16px
- margin: 0

### Code elements in prose
- font-size: 12px
- padding: 2px 4px
- border-radius: 4px
- background: var(--inline-code-bg) = #262626 dark
- font-family: var(--font-mono) = IBM Plex Mono

## Main Content Styles

### Section labels (THE PIANO, THE WAVEFORM)
- font-size: 12px
- font-weight: 600
- text-transform: uppercase
- letter-spacing: 0.05em
- color: var(--text-tertiary) = #525252
- margin-bottom: 16px

### Prose content (.prose-content)
- font-size: 16px (text-base)
- line-height: 24px
- color: var(--text-secondary) = #a3a3a3

### Max width on main content
- max-width: 576px (lg:max-w-xl) on desktop

## Responsive Behavior
Same as Words page:
- Desktop (≥1024px): sidebar (25%) | divider | content (75%)
- Mobile (<1024px): stacked, no divider

## Import Requirements
```typescript
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { EnvelopeOutlineIcon, LinkedInLogoIcon } from '@/components/icons';
```

## TypeScript
Run `npx tsc --noEmit` before finishing.
