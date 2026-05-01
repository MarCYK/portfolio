# Deployment Guide

## Pre-Deploy Checks

Run the full validation set from the repository root.

```bash
bun install
bun run lint
bunx tsc --noEmit
bun run build
```

The production build outputs to `.next/` in the repository root.

## Vercel

Vercel is the default target for this repo.

### Dashboard Settings

- Framework Preset: Next.js
- Root Directory: repository root
- Install Command: `bun install`
- Build Command: `bun run build`
- Output Directory: leave blank and let Next.js defaults apply

### CLI Deploy

```bash
bun install -g vercel
vercel
```

If you use preview deployments, Vercel can also run the built app with the
default Next.js server output. No custom adapter is configured in
`next.config.js`.

## Self-Hosted Node Runtime

This repo is not configured for static export. If you deploy outside
Vercel, use a host that can run the Next.js server.

```bash
bun install
bun run build
bun run start
```

Default local startup uses port `3000`. Set `PORT` in the host environment
if your platform requires a different port.

## Environment Variables

No runtime environment variables are required today.

If analytics, APIs, or third-party services are added later, document the
variables here and configure them in the deployment platform before the
build runs.

## Troubleshooting

### Build Fails

```bash
rm -rf .next
bun run lint
bunx tsc --noEmit
bun run build
```

### Production Differs From Local

- Check the deployment logs first.
- Confirm assets in `public/` resolve correctly.
- Confirm route-level imports still resolve through the `@/` alias.
- Confirm browser-only code stays behind client components.

### Canvas Surface Does Not Render

- Inspect browser console errors.
- Check `src/components/CanvasHome.tsx` for sizing or lifecycle issues.
- Check `src/lib/audio.ts` and `src/lib/canvas-engine.ts` if the failure
  appeared after control changes.
