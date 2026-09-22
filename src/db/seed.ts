import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";
import * as dotenv from "dotenv";
import { eq, or } from "drizzle-orm";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

async function main() {
  console.log("Seeding dummy dealer data...");
  const connection = await mysql.createConnection(connectionString!);
  const db = drizzle(connection, { schema, mode: "default" });

  // Update dealer@carpaign.id and dealer@auto.com to dealership role if present
  await db
    .update(authSchema.user)
    .set({ role: "dealership" })
    .where(
      or(
        eq(authSchema.user.email, "dealer@carpaign.id"),
        eq(authSchema.user.email, "dealer@auto.com")
      )
    );

  // Get all dealership users
  const dealers = await db
    .select()
    .from(authSchema.user)
    .where(
      or(
        eq(authSchema.user.role, "dealership"),
        eq(authSchema.user.role, "dealer")
      )
    );

  if (dealers.length === 0) {
    console.log("No dealership user found. Skipping seed.");
    process.exit(0);
  }

  for (const dealer of dealers) {
    const dealerId = dealer.id;
    console.log(`Processing dealer: ${dealer.name} (${dealer.email} - ${dealerId})`);

    // Seed Profile
    await db
      .insert(schema.dealerProfiles)
      .ignore()
      .values({
        userId: dealerId,
        dealerName: dealer.name || "AutoPremium Jakarta",
        picName: "Budi Santoso",
        phone: "+62 812-3456-7890",
        businessEmail: dealer.email,
        address: "Jl. Gatot Subroto Kav. 51, Jakarta Selatan",
      });

    // Seed Vehicles
    const mockVehicles = [
      { name: "Honda Brio RS", year: 2024, color: "Crystal Black Pearl", location: "Jakarta Selatan", status: "available", image: "https://picsum.photos/seed/honda-brio-rs-2024/400/240" },
      { name: "Toyota Veloz", year: 2023, color: "Silver Metallic", location: "Jakarta Selatan", status: "in_use", image: "https://picsum.photos/seed/toyota-veloz-2023/400/240" },
      { name: "Mitsubishi Xpander", year: 2024, color: "Diamond White", location: "Tangerang", status: "available", image: "https://picsum.photos/seed/mitsubishi-xpander/400/240" },
      { name: "Suzuki Jimny", year: 2023, color: "Kinetic Yellow", location: "Jakarta Barat", status: "in_use", image: "https://picsum.photos/seed/suzuki-jimny-yellow/400/240" },
    ];

    for (const v of mockVehicles) {
      await db.insert(schema.vehicles).ignore().values({
        dealerId,
        name: v.name,
        year: v.year,
        color: v.color,
        location: v.location,
        status: v.status,
        image: v.image,
      });
    }

    // Seed Campaigns
    const mockCampaigns = [
      {
        title: "Honda Brio RS UGC Challenge 2026",
        type: "UGC/Review" as const,
        budget: 15000000,
        deadline: new Date(Date.now() + 14 * 86400000),
        status: "active" as const,
        applicantsCount: 24,
        views: "68.4K",
      },
      {
        title: "Toyota Veloz Cinematic Shoot Showcase",
        type: "Videographer/Edit" as const,
        budget: 20000000,
        deadline: new Date(Date.now() + 21 * 86400000),
        status: "active" as const,
        applicantsCount: 18,
        views: "45.2K",
      },
      {
        title: "Mitsubishi Xpander Promo Clipping Rush",
        type: "Clipping" as const,
        budget: 8000000,
        deadline: new Date(Date.now() + 7 * 86400000),
        status: "active" as const,
        applicantsCount: 16,
        views: "36.0K",
      },
    ];

    for (const c of mockCampaigns) {
      await db.insert(schema.campaigns).ignore().values({
        dealerId,
        title: c.title,
        type: c.type,
        budget: c.budget,
        deadline: c.deadline,
        status: c.status,
        applicantsCount: c.applicantsCount,
        views: c.views,
        promotionalFocus: "dealer",
      });
    }
  }

  console.log("Seeding complete successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
