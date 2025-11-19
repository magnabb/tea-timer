# Repository Guidelines

## Project Structure & Module Organization
- `src/main.tsx` boots the Vite + React app and should remain lean; register providers elsewhere.
- `src/App.tsx` holds feature orchestration; break UI into focused components under `src/components` and stateful hooks under `src/hooks`.
- Pure helpers (timing math, formatting) live in `src/utils`. Keep them framework-agnostic for reuse and unit testing.
- Static artwork belongs in `src/assets`; anything needed at build time (icons, manifest) goes in `public/`. Vite writes production bundles to `dist/`.

## Build, Test, and Development Commands
- `npm install` — Install all dependencies; rerun after lockfile changes.
- `npm run dev` — Start the Vite dev server with hot module replacement; ideal for UI iteration.
- `npm run build` — Type-check via `tsc -b` then emit optimized assets using `vite build`.
- `npm run preview` — Serve the output from `dist/` to sanity-check production bundles.
- `npm run lint` — Run the flat ESLint config (`eslint.config.js`) across TS/TSX files; fix findings before opening a PR.

## Coding Style & Naming Conventions
- TypeScript everywhere; favor explicit interfaces over `any`. Keep indentation at two spaces (matches existing files).
- Use functional React components with hooks; name components in `PascalCase` and hooks in `useCamelCase`.
- Co-locate component styles in `App.css` or component-level CSS modules; avoid inline styles for reusable widgets.
- Prefer descriptive filenames (`TimerControls.tsx`, `useCountdown.ts`) and keep exports default unless multiple helpers coexist.

## Testing Guidelines
- No automated suite exists yet. When adding features, introduce Vitest + React Testing Library and add a `test` npm script.
- Place specs beside the unit (`TimerControls.test.tsx`) or under `src/__tests__/`. Name tests after the behavior, not the implementation.
- Aim for >80% coverage on timing logic and hook state transitions; smoke-test interactive components via RTL.
- Document new test commands in this guide and CI configs once established.

## Commit & Pull Request Guidelines
- Follow an imperative, present-tense subject line (`Add long-press reset button`); include context in the body and reference issue IDs.
- Squash local work before opening a PR targeting `main`. PR descriptions should list changes, testing evidence (`npm run lint`, `npm run build`), and UI screenshots when visuals shift.
- Highlight any new environment variables or migrations so reviewers can reproduce the setup quickly.
