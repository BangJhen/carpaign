import "dotenv/config";
import { readFile } from "node:fs/promises";
import postgres from "postgres";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL belum diatur.");

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  prepare: false,
  max: 1,
});

try {
  await sql.begin(async (transaction) => {
    for (const file of ["0002_demo_escrow_leads.sql", "0003_midtrans_campaign_payments.sql"]) {
      const source = await readFile(new URL(`../drizzle/${file}`, import.meta.url), "utf8");
      const statements = source.split("--> statement-breakpoint").map((part) => part.trim()).filter(Boolean);
      for (const statement of statements) await transaction.unsafe(statement);
    }
  });
  console.log("Tabel simulasi, prospek, dan pembayaran Midtrans siap.");
} finally {
  await sql.end();
}
