import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  console.log("Seeding dummy data...");

  // Get the first dealership user
  const users = await db.select().from(authSchema.user);
  
  if (users.length === 0) {
    console.log("No dealership user found. Skipping seed.");
    process.exit(0);
  }

  const dealerId = users[0].id;
  console.log(`Found dealer: ${users[0].name} (${dealerId})`);

  // Seed Profile
  await db.insert(schema.dealerProfiles).values({
    userId: dealerId,
    dealerName: "AutoPremium Jakarta",
    picName: "Budi Santoso",
    phone: "+62 21 1234-5678",
    businessEmail: "info@autopremium.id",
    address: "Jl. Gatot Subroto Kav. 51, Jakarta Selatan",
  }).onConflictDoNothing();

  // Seed Vehicles
  const mockVehicles = [
    { name: "Honda Brio RS", year: 2024, color: "Crystal Black Pearl", location: "Jakarta Selatan", status: "available", image: "https://picsum.photos/seed/honda-brio-rs-2024/400/240" },
    { name: "Toyota Veloz", year: 2023, color: "Silver Metallic", location: "Jakarta Selatan", status: "in_use", image: "https://picsum.photos/seed/toyota-veloz-2023/400/240" },
    { name: "Mitsubishi Xpander", year: 2024, color: "Diamond White", location: "Tangerang", status: "available", image: "https://picsum.photos/seed/mitsubishi-xpander/400/240" },
    { name: "Suzuki Jimny", year: 2023, color: "Kinetic Yellow", location: "Jakarta Barat", status: "in_use", image: "https://picsum.photos/seed/suzuki-jimny-yellow/400/240" },
  ];

  for (const v of mockVehicles) {
    await db.insert(schema.vehicles).values({
      dealerId,
      name: v.name,
      year: v.year,
      color: v.color,
      location: v.location,
      status: v.status,
      image: v.image,
    });
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
