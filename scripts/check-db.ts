import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const pool = mysql.createPool(process.env.DATABASE_URL!);
  const [tables] = await pool.query("SHOW TABLES");
  console.log("MySQL Tables:", tables);
  await pool.end();
}

main().catch(console.error);
