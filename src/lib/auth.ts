import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";
import { dealerProfiles, creatorProfiles } from "../db/schema";

const getBaseURL = () => {
  if (process.env.NODE_ENV === "production") {
    if (process.env.BETTER_AUTH_URL?.includes("localhost") && !process.env.VERCEL_URL) {
      return process.env.BETTER_AUTH_URL;
    }
    if (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")) {
      return process.env.BETTER_AUTH_URL;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return "https://carpaign.vercel.app";
  }
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "https://carpaign.vercel.app",
    "http://localhost:3000",
    getBaseURL(),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
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
                .values({
                  userId: user.id,
                  dealerName: user.name,
                  businessEmail: user.email,
                })
                .onConflictDoNothing();
            } else {
              await db
                .insert(creatorProfiles)
                .values({
                  userId: user.id,
                  fullName: user.name,
                })
                .onConflictDoNothing();
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
