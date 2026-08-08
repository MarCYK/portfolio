# portfolio

A personal portfolio site built with Next.js, featuring an interactive canvas-based music visualizer.

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-gray?logo=tailwindcss)

## Quick Start

```bash
bun install
bun run dev
```

Visit `http://localhost:3000`

## Documentation

- [Development](docs/development.md) - Local development setup and workflows
- [Deployment](docs/deployment.md) - Build and deployment instructions
- [Context](CONTEXT.md) - Project vocabulary, architecture boundaries, and operating assumptions
- [ADRs](docs/adr/README.md) - Architecture decision records for durable technical choices

## Features

- **Interactive Canvas**: Full-screen music visualizer responding to mouse/touch
- **Theme System**: Light/dark mode with persistent preference
- **Sound Controls**: Toggle UI sound effects independently
- **Music Playback**: Piano song plays through canvas rows
- **Visual Effects**: Disco mode (color cycling), Sunset mode (warm palette)

## Project Structure

```plaintext
src/
├── app/                  # Next.js pages
├── components/           # React components
├── contexts/             # React context providers
├── lib/                  # Core utilities
├── data/                 # Static data
└── types/                # Type definitions
```

## License

Copyright 2026 marcyk. All rights reserved.
