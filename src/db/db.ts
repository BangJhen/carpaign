import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as authSchema from "./auth-schema";
import * as campaignSchema from "./schema";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const globalForDb = globalThis as unknown as {
  conn: mysql.Pool | undefined;
};

const pool = globalForDb.conn ?? mysql.createPool(connectionString);
if (process.env.NODE_ENV !== "production") globalForDb.conn = pool;

export const db = drizzle(pool, { schema: { ...authSchema, ...campaignSchema }, mode: "default" });
