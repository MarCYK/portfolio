# Deployment Guide

## Build

From the `src/` directory:

```bash
bun build
```

This creates an optimized production build in `.next/` directory.

## Deployment Options

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   bun install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure project settings in Vercel dashboard:
   - Framework Preset: Next.js
   - Root Directory: `src`
   - Build Command: `cd src && bun run build`
   - Output Directory: `src/.next`

### Static Export (Alternative)

For static hosting (Netlify, GitHub Pages):

1. Build with static export:
   ```bash
   bun build
   bun next export
   ```

2. Deploy `out/` directory.

Note: Canvas interactivity and API routes (if added) require server-side rendering.

## Environment Variables

No environment variables are currently required for this project.

If you add API calls or analytics, configure them in Vercel dashboard.

## Performance Considerations

### Images

The canvas is generated client-side - no image optimization needed.

### Bundle Size

Current bundle size is ~80 KB (optimized by Next.js).
To check: Run `bun build` and review output for each route.

### Analytics

Consider adding analytics if you want to track:
- Page views
- Canvas interactions
- Theme usage

## Troubleshooting

### Build Errors

If build fails:
1. Clear cache: `rm -rf .next`
2. Check TypeScript errors: `bunx`
3. Verify all imports use correct `@/` aliases

### Production Issues

If something works locally but not in production:
- Check browser console for errors
- Verify `public/` folder contents are accessible
- Check Vercel deployment logs
- Ensure static paths are correct (no absolute `/` in src)

### Canvas Not Rendering

- Verify canvas dimensions are set correctly in `CanvasHome.tsx`
- Check if any CSS is hiding the canvas (`z-index`, `display`)
- Ensure JavaScript is enabled in user's browser
