import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export type CampaignStatus = "active" | "draft" | "completed" | "cancelled";
export type CampaignType = "Clipping" | "UGC/Review Konten" | "Videographer";

export const campaigns = pgTable("campaigns", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  dealerId: text("dealer_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  promotionalFocus: text("promotional_focus").default("dealer").notNull(),
  vehicles: jsonb("vehicles"), // array of vehicle IDs
  type: text("type").$type<CampaignType>().notNull(),
  details: jsonb("details"), // generic payload for specific campaign type
  budget: integer("budget").notNull(),
  startDate: timestamp("start_date"),
  deadline: timestamp("deadline").notNull(),
  status: text("status").$type<CampaignStatus>().notNull().default("draft"),
  applicantsCount: integer("applicants_count").default(0).notNull(),
  views: text("views").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  dealer: one(user, {
    fields: [campaigns.dealerId],
    references: [user.id],
  }),
}));

export const vehicles = pgTable("vehicles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  dealerId: text("dealer_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default("available"), // available, in_use
  image: text("image"),
  campaignsCount: integer("campaigns_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  dealer: one(user, {
    fields: [vehicles.dealerId],
    references: [user.id],
  }),
}));

export const dealerProfiles = pgTable("dealer_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  dealerName: text("dealer_name"),
  picName: text("pic_name"),
  phone: text("phone"),
  businessEmail: text("business_email"),
  address: text("address"),
  coverImage: text("cover_image"),
  avatarImage: text("avatar_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const dealerProfilesRelations = relations(dealerProfiles, ({ one }) => ({
  user: one(user, {
    fields: [dealerProfiles.userId],
    references: [user.id],
  }),
}));

export const creatorProfiles = pgTable("creator_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  fullName: text("full_name"),
  username: text("username"),
  phone: text("phone"),
  city: text("city"),
  bio: text("bio"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountHolderName: text("account_holder_name"),
  tiktokUsername: text("tiktok_username"),
  instagramUsername: text("instagram_username"),
  youtubeUsername: text("youtube_username"),
  avatarImage: text("avatar_image"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const creatorProfilesRelations = relations(creatorProfiles, ({ one }) => ({
  user: one(user, {
    fields: [creatorProfiles.userId],
    references: [user.id],
  }),
}));

