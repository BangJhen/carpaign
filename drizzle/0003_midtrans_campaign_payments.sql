CREATE TABLE IF NOT EXISTS "campaign_payments" (
  "order_id" text PRIMARY KEY NOT NULL,
  "campaign_id" text NOT NULL REFERENCES "campaigns"("id") ON DELETE restrict,
  "dealer_id" text NOT NULL REFERENCES "user"("id") ON DELETE restrict,
  "amount" integer NOT NULL,
  "status" text DEFAULT 'initiating' NOT NULL,
  "redirect_url" text,
  "paid_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "campaign_payments_amount_positive" CHECK ("amount" > 0),
  CONSTRAINT "campaign_payments_status_valid" CHECK ("status" IN ('initiating', 'pending', 'settlement', 'capture', 'deny', 'cancel', 'expire', 'refund', 'failed'))
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "campaign_payments_campaign_created_idx" ON "campaign_payments" ("campaign_id", "created_at");
