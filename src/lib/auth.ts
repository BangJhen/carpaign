import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";
import { dealerProfiles, creatorProfiles } from "../db/schema";
import * as authSchema from "../db/auth-schema";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: ["https://carpaign.vercel.app", "http://localhost:3000"],
  database: drizzleAdapter(db, { provider: "mysql", schema: authSchema }),
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
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const role = (user as any).role;
            if (role === "dealership" || role === "dealer") {
              await db
                .insert(dealerProfiles)
                .ignore()
                .values({
                  userId: user.id,
                  dealerName: user.name,
                  businessEmail: user.email,
                });
            } else {
              await db
                .insert(creatorProfiles)
                .ignore()
                .values({
                  userId: user.id,
                  fullName: user.name,
                });
            }
          } catch (e) {
            console.error("Failed to initialize profile in databaseHook:", e);
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
