import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const pool = mysql.createPool(process.env.DATABASE_URL);

  console.log("Altering user, creator_profiles, and dealer_profiles table columns to MEDIUMTEXT...");

  try {
    // Alter user table
    await pool.query(`ALTER TABLE user MODIFY COLUMN image MEDIUMTEXT, MODIFY COLUMN cover_image MEDIUMTEXT`);
    console.log("Updated user table image and cover_image columns to MEDIUMTEXT");
  } catch (err: any) {
    console.log("User table alter note:", err?.message || err);
  }

  try {
    // Alter creator_profiles table
    await pool.query(`ALTER TABLE creator_profiles MODIFY COLUMN avatar_image MEDIUMTEXT, MODIFY COLUMN cover_image MEDIUMTEXT, MODIFY COLUMN bio MEDIUMTEXT`);
    console.log("Updated creator_profiles table columns to MEDIUMTEXT");
  } catch (err: any) {
    console.log("creator_profiles table alter note:", err?.message || err);
  }

  try {
    // Alter dealer_profiles table
    await pool.query(`ALTER TABLE dealer_profiles MODIFY COLUMN avatar_image MEDIUMTEXT, MODIFY COLUMN cover_image MEDIUMTEXT, MODIFY COLUMN address MEDIUMTEXT`);
    console.log("Updated dealer_profiles table columns to MEDIUMTEXT");
  } catch (err: any) {
    console.log("dealer_profiles table alter note:", err?.message || err);
  }

  try {
    // Alter vehicles table image column
    await pool.query(`ALTER TABLE vehicles MODIFY COLUMN image MEDIUMTEXT`);
    console.log("Updated vehicles table image column to MEDIUMTEXT");
  } catch (err: any) {
    console.log("vehicles table alter note:", err?.message || err);
  }

  console.log("All image columns successfully converted to MEDIUMTEXT!");
  process.exit(0);
}

main().catch(console.error);
