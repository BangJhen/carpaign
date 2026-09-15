CREATE TABLE "dealer_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"dealer_name" text,
	"pic_name" text,
	"phone" text,
	"business_email" text,
	"address" text,
	"cover_image" text,
	"avatar_image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dealer_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" text PRIMARY KEY NOT NULL,
	"dealer_id" text NOT NULL,
	"name" text NOT NULL,
	"year" integer NOT NULL,
	"color" text NOT NULL,
	"location" text NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"image" text,
	"campaigns_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dealer_profiles" ADD CONSTRAINT "dealer_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_dealer_id_user_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;