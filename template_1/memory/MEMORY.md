# Project Memory — finethought.com.au Clone

## Environment
- Node: use `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 22` before any npm/node commands
- Node 16 is the system default — always switch to 22 first
- Dev server: `npm run dev` — runs on port 3001 if 3000 is in use

## Project Status (as of 2026-03-27)
- **Clone complete:** All major sections built and working
- **Build:** Passing clean (`npm run build`)
- Components: GUIShell, NavTabBar, HeroSection, SkillsSection, ProjectsList, ContactSection, ASCIIBackground

## Architecture
- Code editor (VS Code) metaphor UI
- Custom BEM CSS with `c-` prefix in globals.css (not Tailwind classes)
- Adobe Fonts via TypeKit CDN: `https://use.typekit.net/awl2qrt.css`
  - `neue-haas-grotesk-display` — display/headings
  - `code-saver` — monospace/code
- Dark/light mode via `state-light-mode` class on `html` element
- Site load via `state-site-loaded` on `html`
- Mouse detection via `state-mouse-events` on `html`

## Key CSS Variables (globals.css)
- `--ft-bg: #282828` (dark), `#fff` (light)
- `--ft-text-secondary: #bababa` (dark), `#5c5c5c` (light)
- `--ft-text-muted: #898989` (dark)
- `--ft-accent: #aec6f6` (dark), `#2756c9` (light)
- `--ft-accent-strong: #2756c9`
- `--ft-text-faded-bg: #222` (dark) — for large background display words

## Asset Locations
- Images: `public/images/` — actual filenames from `__NEXT_DATA__`
- Videos: `public/videos/`
- Favicons: `public/seo/`

## Known Gaps
- No smooth scroll library (site uses native scroll)
- No sidebar panel content (info panel opens but is empty)
- Adobe Fonts may not load (TypeKit CDN requires authorization)
  - Fallback: serif/sans-serif system fonts
- ASCII background texture is approximate (not exact match to original)
- Project row click is prevented (href leads to 404)

## Content Notes (replace with your own)
- ALL text is from finethought.com.au (Nathan Leigh Davis's portfolio)
- Replace hero title, bio, skills, projects, contact with your own content
- Update PROJECT_PREFIX image names in ProjectsList.tsx when replacing content
