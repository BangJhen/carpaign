import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  datetime,
  int,
  json,
} from "drizzle-orm/mysql-core";
import { user } from "./auth-schema";

export type CampaignStatus = "active" | "draft" | "completed" | "cancelled";
export type CampaignType = "Clipping" | "UGC/Review" | "Videographer/Edit";

export const campaigns = mysqlTable("campaigns", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  dealerId: varchar("dealer_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  promotionalFocus: varchar("promotional_focus", { length: 64 }).default("dealer").notNull(),
  vehicles: json("vehicles"), // array of vehicle IDs
  type: varchar("type", { length: 64 }).$type<CampaignType>().notNull(),
  details: json("details"), // generic payload for specific campaign type
  budget: int("budget").notNull(),
  startDate: datetime("start_date", { mode: "date" }),
  deadline: timestamp("deadline").notNull(),
  status: varchar("status", { length: 32 }).$type<CampaignStatus>().notNull().default("draft"),
  applicantsCount: int("applicants_count").default(0).notNull(),
  views: varchar("views", { length: 64 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  dealer: one(user, {
    fields: [campaigns.dealerId],
    references: [user.id],
  }),
}));

export const vehicles = mysqlTable("vehicles", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  dealerId: varchar("dealer_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  year: int("year").notNull(),
  color: varchar("color", { length: 64 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("available"), // available, in_use
  image: text("image"),
  campaignsCount: int("campaigns_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  dealer: one(user, {
    fields: [vehicles.dealerId],
    references: [user.id],
  }),
}));

export const dealerProfiles = mysqlTable("dealer_profiles", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  dealerName: varchar("dealer_name", { length: 255 }),
  picName: varchar("pic_name", { length: 255 }),
  phone: varchar("phone", { length: 64 }),
  businessEmail: varchar("business_email", { length: 255 }),
  address: text("address"),
  coverImage: text("cover_image"),
  avatarImage: text("avatar_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const dealerProfilesRelations = relations(dealerProfiles, ({ one }) => ({
  user: one(user, {
    fields: [dealerProfiles.userId],
    references: [user.id],
  }),
}));

export const creatorProfiles = mysqlTable("creator_profiles", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  fullName: varchar("full_name", { length: 255 }),
  username: varchar("username", { length: 255 }),
  phone: varchar("phone", { length: 64 }),
  city: varchar("city", { length: 255 }),
  bio: text("bio"),
  bankName: varchar("bank_name", { length: 64 }),
  accountNumber: varchar("account_number", { length: 64 }),
  accountHolderName: varchar("account_holder_name", { length: 255 }),
  tiktokUsername: varchar("tiktok_username", { length: 255 }),
  instagramUsername: varchar("instagram_username", { length: 255 }),
  youtubeUsername: varchar("youtube_username", { length: 255 }),
  avatarImage: text("avatar_image"),
  coverImage: text("cover_image"),
  referralCode: varchar("referral_code", { length: 64 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const creatorProfilesRelations = relations(creatorProfiles, ({ one }) => ({
  user: one(user, {
    fields: [creatorProfiles.userId],
    references: [user.id],
  }),
}));
