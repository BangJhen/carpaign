import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";
import { dealerProfiles, creatorProfiles } from "../db/schema";

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
