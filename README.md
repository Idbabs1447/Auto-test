# Dashlink Integrated Autos — dealership website

A production-style online dealership for **Dashlink Integrated Autos** (47 Ogunnusi Road, Ogba,
Ikeja, Lagos) built with Next.js (App Router), PostgreSQL and Drizzle ORM.

## What is included

- **Home** — automotive hero, in-hero vehicle search (keyword / make / model / year / price),
  browse-by-make, recently added (real units first), pre-order band, services, prototype inventory
  preview, video & social section, visit-us block with map.
- **Shop Cars** (`/inventory`) — server-side filtering and sorting (make, model, body type,
  transmission, year range, price range, availability, real vs sample inventory), active filter
  chips, pagination, mobile filter drawer.
- **Vehicle detail** (`/vehicles/[slug]`) — photo gallery with lightbox, spec sheet that shows
  “Contact for details” for anything unverified, feature list, YouTube/TikTok/Instagram video block,
  WhatsApp + call CTAs, save, compare, share, enquiry form, reservation-interest form, similar cars.
- **Pre-Order / Find Me A Car** (`/pre-order`) — sourcing request form (saved to the database) with
  WhatsApp hand-off, process steps, FAQ.
- **About** and **Contact** — dealership information, buyer guidance, phone/WhatsApp/Instagram,
  opening hours, Google map embed, enquiry form.
- **Saved** (`/saved`) and **Compare** (`/compare`) — favourites and side-by-side comparison kept in
  the browser (`localStorage`), hydrated from the API.
- **APIs** — `/api/health`, `/api/vehicles`, `/api/inquiries`, `/api/preorders`, `/api/reservations`.

## Data model (`src/db/schema.ts`)

`vehicles`, `vehicle_media`, `preorder_requests`, `inquiries`, `reservations`.
The `reservations` table records reservation **interest** only — online reservation/payment can be
switched on later without redesigning the UI.

## Inventory content

- The first **six listings are real Dashlink units**. Only supplied facts are stored (year, make,
  model, condition, known feature, clearance/arrival notes). Unknown fields are `null` and render as
  “Contact for details”. No mileage, price, VIN or history has been invented for them.
- Ten further listings are clearly-labelled **sample/prototype** records (`is_demo = true`) with
  prices so the marketplace features (filtering, comparison, spec sheets) can be demonstrated.

### Replacing photography with real dealer photos

1. Upload the photos (e.g. to `public/inventory/<slug>/1.jpg`).
2. Update the image URLs for that listing — either in the database
   (`vehicle_media.url`) or in `src/db/seed-data.ts` for a fresh database.
3. The detail page gallery, cards and comparison table pick the pictures up automatically.

## Self-contained assets

All photography is stored locally in `public/images/` and all Poppins font files
(weights 400/500/600/700, self-hosted via `src/app/fonts.css`) in `public/fonts/`. The site makes
no requests to external image or font CDNs, so the exported project reproduces the current website
anywhere. The only remaining external embed is the live Google Maps iframe on the Contact/Home
pages, which is a runtime map view rather than a static asset.

## Configuration

Business details, phone numbers, WhatsApp number and Instagram handle live in `src/lib/site.ts`.
`DATABASE_URL` is read from the environment (`.env` / `.env.local` locally — see `.env.example`).
Set `NEXT_PUBLIC_SITE_URL` to the public domain so WhatsApp messages and the sitemap use absolute
links; on Vercel it falls back to the project's production domain automatically.

## Deploying to Vercel

1. **Add the `public/` folder to the repository.** Photos (`public/images/`) and fonts
   (`public/fonts/`) are served from there. If it is missing, the site builds but every picture
   returns 404.
2. **Connect a PostgreSQL database.** In the Vercel project open **Storage → Create Database →
   Neon (Postgres)** and connect it to the project. This adds `DATABASE_URL` for you. Any hosted
   Postgres works — add its connection string as `DATABASE_URL` under **Settings → Environment
   Variables**. (`localhost` URLs do not work on Vercel.)
3. **Redeploy.** `npm run build` first runs `scripts/migrate.mjs`, which creates or updates the
   tables from `drizzle/`, then runs `next build`. The inventory seeds itself on the first page
   view.

Without a database the build still succeeds, but the inventory pages and forms only work once
`DATABASE_URL` is set.

## Local commands

```bash
cp .env.example .env    # then point DATABASE_URL at your database
npm install
npm run db:migrate      # apply the schema (also runs automatically during `npm run build`)
npm run build && npm run start
```

After changing `src/db/schema.ts`, run `npm run db:generate` to create a new migration in
`drizzle/` and commit it.

Inventory seeds itself on first request (idempotent), so a fresh database is never left empty.
