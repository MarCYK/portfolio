# Words Page Specification

## Overview
- **Target files:**
  - `src/app/words/page.tsx`
- **Screenshot:** `docs/design-references/words-desktop.png`
- **Interaction model:** Static list. Row links open article pages.

## Page Layout Structure

```tsx
// src/app/words/page.tsx
export default function WordsPage() {
  return (
    <body with dark class>
      <SiteHeader />
      <main id="scroll-root" className="flex-1 overflow-y-auto flex flex-col">
        <div
          className="px-6 sm:px-8 mx-auto flex-1 flex flex-col w-full"
          style={{ maxWidth: '80rem' }}
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 flex-1">
            {/* LEFT SIDEBAR */}
            <div className="lg:w-1/4 lg:pr-12 xl:pr-24 shrink-0 pt-12 sm:pt-20">
              <h1 style={{fontSize:'30px',fontWeight:600,letterSpacing:'-0.025em',marginBottom:'12px',color:'var(--text-primary)'}}>
                Words
              </h1>
              <p style={{fontSize:'14px',color:'var(--text-secondary)'}}>
                Thoughts and things.
              </p>
            </div>

            {/* VERTICAL DIVIDER (desktop only) */}
            <div
              className="hidden lg:block w-px shrink-0"
              style={{ borderLeft: '1px solid var(--border)' }}
            />

            {/* MAIN CONTENT */}
            <div className="lg:pl-12 xl:pl-24 flex-1 pt-2 lg:pt-20 pb-16 lg:pb-8">
              <div id="posts-list">
                {/* Column header */}
                <div className="words-row-header">
                  <span>Date</span>
                  <span>Title</span>
                </div>

                {/* Recent posts */}
                {recentPosts.map(post => <WordsRow key={post.href} {...post} />)}

                {/* Archive section */}
                <div style={{paddingTop:'32px'}}>
                  <div
                    className="words-row-header"
                    style={{color:'var(--text-tertiary)'}}
                  >
                    <span>Archive</span>
                    <span></span>
                  </div>
                  {archivePosts.map(post => <WordsRow key={post.href} {...post} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </main>
    </body>
  );
}
```

## WordsRow Component

### Structure
```tsx
<a
  href={href}
  className="words-row group"
>
  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
    {date}
  </span>
  <span className="flex items-center min-w-0">
    <span
      className="text-sm font-medium transition-colors duration-200 group-hover:underline underline-offset-2 truncate"
      style={{ color: 'var(--text-primary)' }}
    >
      {title}
    </span>
    <ArrowRightIcon
      className="w-3.5 h-3.5 ml-4 shrink-0 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
      style={{ color: 'var(--text-secondary)' }}
    />
  </span>
</a>
```

### CSS for .words-row
- display: grid
- grid-template-columns: 6rem 1fr
- gap: 0 12px (sm: 0 24px)
- align-items: center
- padding: 20px 0
- border-bottom: 1px solid var(--border)
- text-decoration: none
- transition: background-color 0.2s

### Arrow hover behavior
- Default: opacity 0, transform: translateX(-8px) = -translate-x-2
- Hover: opacity 1, transform: translateX(0)
- Transition: all 0.2s

### Column header (.words-row-header)
- Same grid layout as words-row
- padding: 12px 0
- border-bottom: 1px solid var(--border)
- font-size: 12px
- text-transform: uppercase
- letter-spacing: 0.05em (tracking-wider)
- color: var(--text-tertiary)

## Post Data

### Recent Posts
```typescript
const recentPosts = [
  { date: 'Mar 24, 2026', title: 'On Researching with LLMs', href: '/words/on-researching-with-llms' },
  { date: 'Feb 27, 2026', title: "It's Been Awhile", href: '/words/hi-again' },
];
```

### Archive Posts
```typescript
const archivePosts = [
  { date: 'Oct 15, 2023', title: 'I Know Nothing', href: '/words/i-know-nothing' },
  { date: 'Jun 10, 2023', title: 'Quantum Leap: An Ongoing Game of Self-Interrogation', href: '/words/questioning-my-quantum-leap-an-ongoing-game-of-self-interrogation' },
  { date: 'Jun 8, 2023', title: 'Building a Brand Identity With Code', href: '/words/building-a-brand-identity-with-code' },
  { date: 'Jun 6, 2023', title: 'Objectively Evolving Your Own Subjectivity', href: '/words/objectively-evolving-your-own-subjectivity' },
  { date: 'Jun 2, 2023', title: 'LLMs Helped Me Understand How I Work', href: '/words/chatgpt-helped-me-realize-how-i-work' },
  { date: 'Feb 20, 2023', title: 'On AI, the Internet, and Everything In-Between', href: '/words/on-ai-the-internet-and-everything-in-between' },
  { date: 'Jan 5, 2023', title: 'The Revision Hole', href: '/words/revision-hole' },
];
```

## Two-Column Layout Styles

### Outer wrapper
- padding: 0 24px (sm: 0 32px)
- max-width: 80rem
- margin: 0 auto
- width: 100%
- display: flex
- flex-direction: column

### Inner layout row
- display: flex
- flex-direction: column (default), row on lg (≥1024px)
- gap: 32px (default), 0 on lg

### Sidebar
- width: 25% on lg
- padding-right: 48px on lg, 96px on xl
- flex-shrink: 0
- padding-top: 48px (sm: 80px)

### Divider
- hidden by default, block on lg
- width: 1px
- border-left: 1px solid var(--border)
- flex-shrink: 0

### Main content
- padding-left: 48px on lg, 96px on xl
- flex: 1
- padding-top: 8px (lg: 80px)
- padding-bottom: 64px (lg: 32px)

## Responsive Behavior
- Desktop (≥1024px): sidebar (25%) | divider | content (75%)
- Mobile/Tablet (<1024px): sidebar stacked on top, full-width content
  - gap: 32px between sidebar and content
  - No divider visible

## Import Requirements
```typescript
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { ArrowRightIcon } from '@/components/icons';
```

## TypeScript
Run `npx tsc --noEmit` before finishing.
