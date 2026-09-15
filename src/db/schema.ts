import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
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
  vehicle: text("vehicle").notNull(),
  type: text("type").$type<CampaignType>().notNull(),
  brief: text("brief"),
  budget: integer("budget").notNull(),
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
