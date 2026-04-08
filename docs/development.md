# Development Guide

## Local Development

### Installation

```bash
cd /home/marcyk/Documents/GITHUB/portfolio/src
bun install
```

### Running Dev Server

```bash
bun dev
# Runs on http://localhost:3000
```

### Build

```bash
bun build
# Outputs to .next/ (gitignored)
```

### Type Checking

```bash
bunx --build
# Type-checks without emitting files
```

## Project Structure

The project uses a non-standard layout where `src/` is the actual Next.js project root:

```
portfolio/
└── src/              # Project root (package.json, tsconfig, next.config)
    ├── app/          # App Router pages
    ├── components/    # React components
    ├── lib/          # Utilities
    ├── data/         # Static data
    └── types/        # Type definitions
```

### Adding New Components

1. Create component in `src/components/`
2. Import from `@/components/ComponentName`
3. Export default function component

### Adding New Pages

1. Create `src/app/[route-name]/page.tsx`
2. Export default function with page content
3. Add metadata export for SEO:
   ```tsx
   export const metadata: Metadata = {
     title: 'Page Title',
   };
   ```

### Using the Page Shell

For sub-pages (not homepage), wrap content in `PageShell`:

```tsx
import PageShell from '@/components/PageShell';

export default function MyPage() {
  return (
    <PageShell>
      {/* Your content */}
    </PageShell>
  );
}
```

`PageShell` includes:
- `SiteHeader` (navigation, theme/sound controls)
- `MobileMenu` (mobile navigation)
- `SiteFooter` (copyright and links)

## Working with the Canvas

### Adding Canvas Interactions

To add new controls that interact with the canvas:

1. Define event type in `lib/canvas-events.ts`:
   ```tsx
   type EventMap = {
     // ...existing events
     yourNewEvent: { payloadType: PayloadType };
   };
   ```

2. Emit event from header component:
   ```tsx
   import { canvasEvents } from '@/lib/canvas-events';
   canvasEvents.emit('yourNewEvent', { payload });
   ```

3. Listen in `CanvasHome.tsx`:
   ```tsx
   useEffect(() => {
     const unsub = canvasEvents.on('yourNewEvent', (detail) => {
       // Handle event
     });
     return unsub;
   }, []);
   ```

### Modifying Canvas Behavior

Edit `lib/canvas-engine.ts`:
- `drawFrame()` - Main rendering loop
- `createCanvasState()` - Initial state
- Colors, energy decay, noise functions are customizable

## Styling

### CSS Variables

Use CSS variables for theming (defined in `globals.css`):
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--border`, `--border-hover`

### Tailwind Classes

Prefer existing CSS classes over inline styles. Common patterns:
- Layout: `flex`, `flex-col`, `items-center`, `justify-between`
- Spacing: `gap-2`, `gap-4`, `gap-8`
- Typography: `text-sm`, `text-base`, `font-semibold`, `font-bold`
- Responsive: `hidden md:flex`, `md:hidden`

## Data Management

### Adding Projects

Edit `data/projects.tsx`:
```tsx
export const newProject: Project = {
  title: 'Project Name',
  description: 'Short description.',
  date: 'Month YYYY',
  href: '/projects/slug',
  external: false,
  status: 'Prototype',
  content: ['Paragraph 1', 'Paragraph 2'],
  icon: <YourIcon className="icon-sm" />,
};
```

Lookup functions are in `lib/projects.ts` - no changes needed there.

### Adding Blog Posts

Edit `data/posts.ts`:
```tsx
export const newPost: Post = {
  date: 'MMM DD, YYYY',
  title: 'Post Title',
  href: '/words/slug',
  author: 'Your Name',
  content: ['Paragraph 1', 'Paragraph 2'],
};
```

## Common Issues

### Build Fails

Clear `.next` cache:
```bash
rm -rf .next
bun build
```

### Port Already in Use

On Linux/Mac:
```bash
lsof -ti:3000 -i:3000 kill -9 3000
```

On Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID /F
```

### Type Errors

If you see type errors after changes:
1. Run `bunx` to check
2. Restart dev server
3. Check imports use correct `@/` aliases

## Testing

### Manual Testing Checklist

- [ ] Homepage canvas loads and responds to mouse
- [ ] Theme toggle works and persists
- [ ] Sound toggle works and persists
- [ ] Music plays and animates canvas rows
- [ ] Disco mode cycles colors
- [ ] Sunset mode applies warm palette
- [ ] Color palette changes stroke color
- [ ] Canvas clear button resets everything
- [ ] Navigation works on all pages
- [ ] Mobile menu opens and closes
- [ ] All internal project pages load correctly
- [ ] All blog post pages load correctly
- [ ] Footer links work

### Browser Testing

Test in Chrome, Firefox, and Safari if possible.
- Canvas API behaves differently across browsers
- Audio autoplay policies may require user interaction first
