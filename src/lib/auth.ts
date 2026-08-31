import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";

export const auth = betterAuth({
  trustedOrigins: ["https://carpaign.vercel.app", "http://localhost:3000"],
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "creator", // "creator" | "dealership"
      },
      tier: {
        type: "number",
        required: false,
        defaultValue: 1, // 1 to 5
      },
      coverImage: {
        type: "string",
        required: false,
      },
    }
  }
});

export type Session = typeof auth.$Infer.Session;
