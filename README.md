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
`DATABASE_URL` is read from `.env`. Set `NEXT_PUBLIC_SITE_URL` to the public domain so WhatsApp
messages and the sitemap use absolute links.

## Local commands

```bash
npx drizzle-kit push   # apply the schema
npm run build && npm run start
```

Inventory seeds itself on first request (idempotent), so a fresh database is never left empty.
