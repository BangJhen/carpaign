import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const pool = mysql.createPool(process.env.DATABASE_URL!);
  
  // Create dealer_profiles if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dealer_profiles (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL UNIQUE,
      dealer_name VARCHAR(255),
      pic_name VARCHAR(255),
      phone VARCHAR(64),
      business_email VARCHAR(255),
      address TEXT,
      cover_image TEXT,
      avatar_image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  console.log("Checked dealer_profiles table");

  // Create creator_profiles if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS creator_profiles (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL UNIQUE,
      full_name VARCHAR(255),
      username VARCHAR(255),
      phone VARCHAR(64),
      city VARCHAR(255),
      bio TEXT,
      bank_name VARCHAR(64),
      account_number VARCHAR(64),
      account_holder_name VARCHAR(255),
      tiktok_username VARCHAR(255),
      instagram_username VARCHAR(255),
      youtube_username VARCHAR(255),
      avatar_image TEXT,
      cover_image TEXT,
      referral_code VARCHAR(64) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  console.log("Checked creator_profiles table");

  // Create vehicles if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id VARCHAR(36) PRIMARY KEY,
      dealer_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      year INT NOT NULL,
      color VARCHAR(64) NOT NULL,
      location VARCHAR(255) NOT NULL,
      status VARCHAR(32) DEFAULT 'available' NOT NULL,
      image TEXT,
      campaigns_count INT DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  console.log("Checked vehicles table");

  // Create campaigns if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id VARCHAR(36) PRIMARY KEY,
      dealer_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      promotional_focus VARCHAR(64) DEFAULT 'dealer' NOT NULL,
      vehicles JSON,
      type VARCHAR(64) NOT NULL,
      details JSON,
      budget INT NOT NULL,
      start_date TIMESTAMP NULL,
      deadline TIMESTAMP NOT NULL,
      status VARCHAR(32) DEFAULT 'draft' NOT NULL,
      applicants_count INT DEFAULT 0 NOT NULL,
      views VARCHAR(64) DEFAULT '0' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  console.log("Checked campaigns table");

  await pool.end();
}

main().catch(console.error);
