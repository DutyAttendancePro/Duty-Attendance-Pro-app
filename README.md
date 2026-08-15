# Duty AttendancePro

A complete, installable PWA for daily duty attendance and salary tracking.

## What's inside
- `index.html` — splash screen, 3-step onboarding, and the main app (single page, tabbed)
- `app.js` — all app logic (punch clock, calendar, salary math, settings) — vanilla JS, no build step
- `manifest.json` — PWA manifest (installable, standalone display, app shortcuts)
- `sw.js` — service worker (offline caching, app-shell + asset caching)
- `icons/` — full icon set (16–512px, maskable variants, Apple touch icon, favicon.ico)

## Features
- **Punch in / punch out** with a one-tap stamp button and a rubber-stamp animation
- **Splash screen** with animated logo reveal
- **Onboarding** — swipeable 3-slide intro, skippable, shown once
- **Monthly calendar** — colour-coded present / absent / leave, tap any day to mark it manually
- **Salary summary** — set a daily wage once, salary totals automatically from present + leave days
- **Settings** — name, currency symbol, dark mode, notification permission toggle, JSON export, full reset
- **Offline-ready** — service worker caches the app shell so it opens with no connection after first load
- **All data stays on-device** — stored in `localStorage`, nothing is sent to a server

## Run it locally
Any static file server works, e.g.:
```
cd duty-attendancepro
python3 -m http.server 8080
```
Then open `http://localhost:8080` in a browser. On mobile Chrome/Safari you'll get an "Add to Home Screen" / install prompt.

## Deploy
Upload the whole folder as-is to any static host (GitHub Pages, Netlify, Vercel, Firebase Hosting, or your own domain). No build step, no dependencies to install.

## Customize
- **Brand colors / fonts**: edit the `:root` CSS variables at the top of `index.html`
- **App icon**: regenerate with `gen_icons.py` (requires Python + Pillow) if you want a different mark
- **App name**: update `manifest.json` (`name`, `short_name`) and the `<title>` in `index.html`
