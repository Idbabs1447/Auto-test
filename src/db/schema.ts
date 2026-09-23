import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Core inventory table for Dashlink Integrated Autos.
 * Unknown fields for a real unit are intentionally nullable so the UI can
 * display "Contact for details" instead of inventing data.
 */
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  trim: text("trim"),
  year: integer("year").notNull(),
  condition: text("condition").notNull().default("Foreign Used"),
  bodyType: text("body_type"),
  transmission: text("transmission"),
  fuelType: text("fuel_type"),
  drivetrain: text("drivetrain"),
  engine: text("engine"),
  exteriorColor: text("exterior_color"),
  interiorColor: text("interior_color"),
  mileageKm: integer("mileage_km"),
  priceNgn: numeric("price_ngn", { precision: 14, scale: 0 }),
  priceOnRequest: boolean("price_on_request").notNull().default(true),
  status: text("status").notNull().default("available"),
  clearance: text("clearance"),
  arrivalNote: text("arrival_note"),
  badge: text("badge"),
  titleStatus: text("title_status"),
  location: text("location").notNull().default("47 Ogunnusi Road, Ogba, Ikeja, Lagos"),
  description: text("description").notNull().default(""),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull().default([]),
  isDemo: boolean("is_demo").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  listingRank: integer("listing_rank").notNull().default(100),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Photographs and video links attached to a listing. */
export const vehicleMedia = pgTable("vehicle_media", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  kind: text("kind").notNull().default("image"), // image | video
  url: text("url").notNull(),
  platform: text("platform"), // youtube | tiktok | instagram
  embedId: text("embed_id"),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** "Find me a car" / vehicle sourcing and import pre-orders. */
export const preorderRequests = pgTable("preorder_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  make: text("make").notNull(),
  model: text("model"),
  yearFrom: integer("year_from"),
  yearTo: integer("year_to"),
  budgetMax: integer("budget_max"),
  bodyType: text("body_type"),
  transmission: text("transmission"),
  fuelType: text("fuel_type"),
  exteriorColor: text("exterior_color"),
  timeline: text("timeline"),
  notes: text("notes"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Enquiries raised from a listing page or the contact page. */
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  vehicleSlug: text("vehicle_slug"),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  message: text("message").notNull().default(""),
  channel: text("channel").notNull().default("form"), // form | whatsapp | phone
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Reservation interest. Online reservation + payment is not live yet, so the
 * site records intent here and moves the conversation to WhatsApp.
 */
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  vehicleSlug: text("vehicle_slug"),
  reference: text("reference").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  preferredDate: text("preferred_date"),
  inspectionMode: text("inspection_mode"),
  notes: text("notes"),
  paymentStatus: text("payment_status").notNull().default("not_started"),
  status: text("status").notNull().default("interest_recorded"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type VehicleTableRow = typeof vehicles.$inferSelect;
export type VehicleMediaRow = typeof vehicleMedia.$inferSelect;
