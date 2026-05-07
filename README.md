# Manuals

> Your personal manual for what works.

Manuals is a polished, mobile-first web app for saving fixes, tips, routines, settings, checklists, lessons, and recommendations you do not want to rediscover later.

This is a local-first MVP. Everything lives in your browser — no backend, no accounts, no sync.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- `lucide-react` for outline icons
- Browser `localStorage` for persistence

## Run locally

```bash
npm install
npm run dev
npm run build
```

Open the printed URL on a phone-sized viewport (around 390px wide) for the intended experience.

## Features

- 4 main tabs: Home, Create, Library, Settings
- Onboarding flow shown on first launch (persisted locally)
- Create, edit, delete, pin, search, filter, sort manuals
- Detail screen with copy-steps, share, pin, delete
- Export as JSON, export as Markdown, import JSON (merges with existing)
- Restore demo data, clear all data
- Light, dark, and system appearance
- Soft, premium, warm visual system with the orange accent

## Project layout

```
src/
  app/             App shell, tab + view routing
  components/     Reusable UI (buttons, cards, dialogs, tabs, …)
  data/           Seed manuals
  hooks/          useManuals, useLocalStorage
  screens/        Onboarding, Home, Create, Library, Detail, Settings
  storage/        Local-storage layer (manualsStorage.ts)
  types/          ManualCard, AppSettings, …
  utils/          search, format, export, id
  index.css       Design tokens + Tailwind
```
