import { auth } from "../lib/auth";
import { db } from "./db";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";
import { eq, or } from "drizzle-orm";

async function main() {
  console.log("Creating/verifying dealer user in Better-Auth...");

  // Try signing up dealer
  try {
    const dealerRes = await auth.api.signUpEmail({
      body: {
        email: "dealer@carpaign.id",
        password: "password123",
        name: "AutoPremium Jakarta",
        role: "dealership",
      } as any,
    });
    console.log("Dealer user created:", dealerRes);
  } catch (err: any) {
    console.log("Dealer user might already exist or signup note:", err?.message || err);
  }

  // Ensure role is 'dealership'
  await db
    .update(authSchema.user)
    .set({ role: "dealership" })
    .where(eq(authSchema.user.email, "dealer@carpaign.id"));

  // Try signing up creator
  try {
    const creatorRes = await auth.api.signUpEmail({
      body: {
        email: "creator@carpaign.id",
        password: "password123",
        name: "Rian Creator",
        role: "creator",
      } as any,
    });
    console.log("Creator user created:", creatorRes);
  } catch (err: any) {
    console.log("Creator user note:", err?.message || err);
  }

  // Find dealer
  const [dealer] = await db
    .select()
    .from(authSchema.user)
    .where(eq(authSchema.user.email, "dealer@carpaign.id"))
    .limit(1);

  if (dealer) {
    const dealerId = dealer.id;
    console.log(`Seeding profile and data for dealer ${dealerId}...`);

    // Ensure dealer profile
    await db
      .insert(schema.dealerProfiles)
      .ignore()
      .values({
        userId: dealerId,
        dealerName: "AutoPremium Jakarta",
        picName: "Budi Santoso",
        phone: "+62 812-3456-7890",
        businessEmail: "dealer@carpaign.id",
        address: "Jl. Gatot Subroto Kav. 51, Jakarta Selatan",
      });

    // Seed Vehicles
    const mockVehicles = [
      { name: "Honda Brio RS", year: 2024, color: "Crystal Black Pearl", location: "Jakarta Selatan", status: "available", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60" },
      { name: "Toyota Veloz", year: 2023, color: "Silver Metallic", location: "Jakarta Selatan", status: "in_use", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60" },
      { name: "Mitsubishi Xpander", year: 2024, color: "Diamond White", location: "Tangerang", status: "available", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=60" },
      { name: "Suzuki Jimny", year: 2023, color: "Kinetic Yellow", location: "Jakarta Barat", status: "in_use", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60" },
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

  // Test sign in
  console.log("Testing sign in for dealer@carpaign.id...");
  const signInRes = await auth.api.signInEmail({
    body: {
      email: "dealer@carpaign.id",
      password: "password123",
    },
  });
  console.log("Sign-in test result:", signInRes ? "SUCCESS! User token generated." : "FAILED");

  console.log("Seed & Verification complete!");
  process.exit(0);
}

main().catch((e) => {
  console.error("Error in seed-auth:", e);
  process.exit(1);
});
