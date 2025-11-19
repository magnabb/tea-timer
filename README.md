# Tea Timer

A configurable tea brewing timer application built with React, TypeScript, and Vite. Perfect for Gong Fu tea ceremonies with multiple steeping stages.

## Features

- **Configurable Brewing Stages**: Define custom brewing sequences with fixed or range-based durations
- **Visual & Audio Feedback**: Background color changes and audio alerts for timing phases
- **Keyboard Controls**: Full keyboard navigation for hands-free operation
- **Saved Configurations**: Store and load multiple tea brewing profiles
- **Rinse Stage Support**: Special handling for tea rinsing steps
- **Responsive Timer**: Real-time countdown with progress visualization

## Configuration Format

Tea brewing sequences are defined using a simple text format:

```
(3-5 -> 5-7) -> 10 -> 10-12 -> 15 -> 20 -> 25-30 -> 35-40 -> 50-60 -> 70-80 -> 90-100 -> 120-180
```

- **Fixed Duration**: `10` (10 seconds)
- **Range Duration**: `10-12` (10-12 seconds, user advances when ready)
- **Rinse Stages**: `(3-5 -> 5-7)` (parentheses indicate rinse steps with visual distinction)
- **Stage Separator**: `->` separates brewing stages

## Keyboard Shortcuts

- **Space / K / ↑**: Start/Pause timer
- **J / ↓**: Reset current stage
- **H / ←**: Previous stage
- **L / →**: Next stage
- **R**: Restart from first stage
- **0-9**: Jump to specific stage (0 = stage 10)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Start the Vite dev server with hot module replacement at `http://localhost:5173`

### Build

```bash
npm run build
```

Type-check via `tsc -b` then emit optimized production assets to `dist/`

### Preview Production Build

```bash
npm run preview
```

Serve the production bundle from `dist/` for testing

### Linting

```bash
npm run lint
```

Run ESLint across TypeScript/TSX files using the flat config

## Project Structure

```
src/
├── components/       # React components
│   ├── ConfigInput.tsx
│   ├── ConfigSidebar.tsx
│   └── TeaTimer.tsx
├── hooks/           # Custom React hooks
│   └── useTeaTimer.ts
├── utils/           # Framework-agnostic utilities
│   ├── audio.ts
│   ├── formatTime.ts
│   ├── parser.ts
│   └── storage.ts
├── assets/          # Static artwork
├── App.tsx          # Main app orchestration
├── main.tsx         # Vite + React bootstrap
└── index.css        # Global styles
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool and dev server
- **ESLint 9** - Code linting

## Contributing

See `AGENTS.md` for detailed development guidelines including coding style, testing approach, and commit conventions.
