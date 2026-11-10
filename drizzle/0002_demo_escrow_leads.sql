CREATE TABLE IF NOT EXISTS "demo_escrow_accounts" (
  "dealer_id" text PRIMARY KEY NOT NULL REFERENCES "user"("id") ON DELETE cascade,
  "available" integer DEFAULT 0 NOT NULL,
  "reserved" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "demo_escrow_available_nonnegative" CHECK ("available" >= 0),
  CONSTRAINT "demo_escrow_reserved_nonnegative" CHECK ("reserved" >= 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "demo_escrow_entries" (
  "id" text PRIMARY KEY NOT NULL,
  "dealer_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
  "campaign_id" text REFERENCES "campaigns"("id") ON DELETE set null,
  "kind" text NOT NULL,
  "amount" integer NOT NULL,
  "available_after" integer NOT NULL,
  "reserved_after" integer NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "demo_escrow_entry_amount_positive" CHECK ("amount" > 0),
  CONSTRAINT "demo_escrow_entry_kind" CHECK ("kind" IN ('credit', 'reserve', 'refund'))
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "demo_escrow_entries_dealer_created_idx" ON "demo_escrow_entries" ("dealer_id", "created_at");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "demo_campaign_reserves" (
  "campaign_id" text PRIMARY KEY NOT NULL REFERENCES "campaigns"("id") ON DELETE cascade,
  "dealer_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
  "amount" integer NOT NULL,
  "status" text DEFAULT 'reserved' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "demo_campaign_reserve_amount_positive" CHECK ("amount" > 0),
  CONSTRAINT "demo_campaign_reserve_status" CHECK ("status" IN ('reserved', 'refunded'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lead_clicks" (
  "id" text PRIMARY KEY NOT NULL,
  "campaign_id" text NOT NULL REFERENCES "campaigns"("id") ON DELETE cascade,
  "dealer_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
  "creator_id" text REFERENCES "user"("id") ON DELETE set null,
  "status" text DEFAULT 'baru' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "lead_click_status" CHECK ("status" IN ('baru', 'dihubungi', 'test_drive', 'terjual'))
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lead_clicks_dealer_created_idx" ON "lead_clicks" ("dealer_id", "created_at");
