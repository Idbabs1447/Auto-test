-- Initial schema. Written to be idempotent (IF NOT EXISTS / duplicate_object guards)
-- so it also applies cleanly to a database that was set up earlier with `drizzle-kit push`.
CREATE TABLE IF NOT EXISTS "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer,
	"vehicle_slug" text,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"message" text DEFAULT '' NOT NULL,
	"channel" text DEFAULT 'form' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preorder_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"make" text NOT NULL,
	"model" text,
	"year_from" integer,
	"year_to" integer,
	"budget_max" integer,
	"body_type" text,
	"transmission" text,
	"fuel_type" text,
	"exterior_color" text,
	"timeline" text,
	"notes" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer,
	"vehicle_slug" text,
	"reference" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"preferred_date" text,
	"inspection_mode" text,
	"notes" text,
	"payment_status" text DEFAULT 'not_started' NOT NULL,
	"status" text DEFAULT 'interest_recorded' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"kind" text DEFAULT 'image' NOT NULL,
	"url" text NOT NULL,
	"platform" text,
	"embed_id" text,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"trim" text,
	"year" integer NOT NULL,
	"condition" text DEFAULT 'Foreign Used' NOT NULL,
	"body_type" text,
	"transmission" text,
	"fuel_type" text,
	"drivetrain" text,
	"engine" text,
	"exterior_color" text,
	"interior_color" text,
	"mileage_km" integer,
	"price_ngn" numeric(14, 0),
	"price_on_request" boolean DEFAULT true NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"clearance" text,
	"arrival_note" text,
	"badge" text,
	"title_status" text,
	"location" text DEFAULT '47 Ogunnusi Road, Ogba, Ikeja, Lagos' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"specs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"listing_rank" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle_media" ADD CONSTRAINT "vehicle_media_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;