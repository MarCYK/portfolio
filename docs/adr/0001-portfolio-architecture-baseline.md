# ADR 0001: Portfolio Architecture Baseline

- Status: Accepted
- Date: 2026-05-04

## Context

This repo already operates as a personal portfolio with two distinct product surfaces: an interactive landing page canvas and editorial interior routes for biography, projects, and writing. Contributors need one baseline decision record that explains current architecture, content shape, and deployment posture before more specific ADRs are added.

## Decision

We will treat current architecture as:

1. Next.js App Router application at repo root.
2. Home route as dedicated canvas-led interactive surface.
3. Interior routes as content-driven editorial pages composed with shared site chrome.
4. Static content for projects, writing, and navigation stored in `src/data/`.
5. Cross-component canvas coordination routed through `src/contexts/CanvasContext.tsx`.
6. Deployment target as server-rendered Next.js output, with Vercel as default host.

## Consequences

- Landing page behavior changes should preserve canvas-first interaction model rather than collapsing into generic static hero layout.
- Interior route work should preserve shared shell and editorial reading experience.
- Content additions usually start in `src/data/projects.ts`, `src/data/posts.ts`, or `src/data/navigation.ts` before route logic changes.
- New shared canvas controls should integrate through `useCanvas()` and existing event model.
- Deployment assumptions should remain compatible with Next.js server output; static export should not be assumed unless explicitly adopted in a later ADR.
