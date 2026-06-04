# הלל ועדי — Wedding Invitation

A standalone portrait wedding invitation (Hebrew, RTL) for Hillel & Adi — 3.8.26, אולם אדמה, אשדוד.

Built with Vite + React + Tailwind CSS. Three texture-framed sections:

1. **Hero** — looping video background with a "כניסה" button that scrolls to the details.
2. **Details** — invitation artwork with a navigation pin to the venue (Google Maps).
3. **RSVP** — live form (Supabase + EmailJS) over the RSVP artwork.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your Supabase + EmailJS keys
npm run dev
```

Open the printed local URL.

## Environment variables

RSVP submissions are saved to Supabase and a notification is emailed via EmailJS.
Both are optional — without keys the form still validates and shows the success
screen, it just won't persist or notify. See `.env.example`:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase project + anon key (table `rsvp`).
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, `VITE_NOTIFICATION_EMAIL` — EmailJS notification.

## Editing content

All text, dates, contacts, venue link, and RSVP colours live in [`src/config.js`](src/config.js).
Artwork lives in [`src/assets/`](src/assets) (`hero.mp4`, `details.png`, `rsvp.png`, `background.png`).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```
