## Purpose

This file gives concise, repo-specific guidance to AI coding agents (Copilot / code assistants) so they can be productive immediately when editing the Webhook-Tester app.

## Quick start (important commands)
- Install deps: `npm install` (project uses npm + Vite)
- Dev server: `npm run dev` (starts Vite on default port)
- Build: `npm run build` (Vite build)
- Lint: `npm run lint` (runs ESLint over the repo)
- Preview production build: `npm run preview`

## Big picture
- This is a single-page React + TypeScript app powered by Vite and Tailwind. There is no backend in the repo — the app sends HTTP requests directly from the browser (see `fetch` usage).
- Primary UI is in `src/components/` and composed by `src/components/WebhookTester.tsx`, mounted by `src/App.tsx` → `src/main.tsx`.

## Key components and data flow (examples)
- Profiles and persistence
  - Profiles are persisted to localStorage via `useLocalStorage` hook (`src/hooks/useLocalStorage.ts`).
  - Keys used: `webhook-profiles` (array of `WebhookProfile`) and `active-profile-id` (string|null). See `WebhookTester.tsx` where these are set/read.
- Sending requests
  - Request composition and send logic lives in `WebhookTester.tsx` and `RequestForm.tsx`.
  - Code uses browser `fetch`. Headers are normalized into an object and Content-Type is added when a body exists.
  - Response parsing checks `content-type` and attempts JSON parse; falls back to text. See `WebhookTester.tsx` (response parsing and history push).
- Chat flow
  - `ChatInterface.tsx` uses the active profile (if present) and posts JSON { message, timestamp } to the profile URL. It converts profile headers into the chat request headers in `useEffect` when `activeProfile` changes.

## Types & conventions
- Type definitions are centralized in `src/types/webhook.ts` — prefer updating types there and then update components that import them.
- Components export default React functional components. Keep props typed and import interfaces from `src/types/webhook.ts` when applicable.
- UI styling: Tailwind utility classes are used throughout. Keep markup semantic and Tailwind-friendly (no CSS files except `index.css`).

## Local data and history
- Request history is kept in component state (in `WebhookTester.tsx`), capped to the most recent 10 items via `setHistory(prev => [item, ...prev.slice(0, 9)])`.
- When changing persistence shapes (profiles, history), update `useLocalStorage` keys and migration logic if needed.

## Common patterns & small examples
- Add a profile: create object with `id = Date.now().toString()` and `createdAt = new Date().toISOString()` (see `handleCreateProfile`).
- Header handling: components store headers as array of { key, value } in forms; when sending, code filters out empty keys.

## Gotchas & developer notes
- CORS: requests are performed from the browser; debugging real webhooks often requires the target endpoint to allow CORS. Use the browser Network panel when testing.
- No test runner configured in this repo. There is a lint script (`npm run lint`) but no unit tests yet — be conservative when adding heavy infra.
- Keep the JSON response pretty-printed when setting `response.body` for display (already done in `WebhookTester.tsx`).

## Where to make common changes
- Add UI components: `src/components/` and export default, then wire through `WebhookTester.tsx` or `App.tsx`.
- Shared types: update `src/types/webhook.ts` and search usages across `src/components`.
- Persistence keys: `src/hooks/useLocalStorage.ts` and any callers (search for `localStorage` or the keys above).

## When to ask the repo owner
- If you need to change the persistence strategy (from localStorage to remote), ask before renaming keys or migrating data.
- If adding automated tests or CI, confirm preferred test runner and Node/npm versions.

---
If anything here is unclear or you want more detail (example PR, migration snippet, or test scaffolding), tell me which area to expand and I'll update this file.
