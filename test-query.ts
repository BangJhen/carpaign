import { db } from "./src/db/db";
import { creatorProfiles } from "./src/db/schema";
import { user } from "./src/db/auth-schema";
import { eq } from "drizzle-orm";

async function main() {
  const ref = "bangjun-4458";
  const rows = await db
    .select({
      fullName: creatorProfiles.fullName,
      referralCode: creatorProfiles.referralCode,
    })
    .from(creatorProfiles)
    .innerJoin(user, eq(creatorProfiles.userId, user.id))
    .where(eq(creatorProfiles.referralCode, ref))
    .limit(1);

  console.log("ROWS:", rows);
}

main().catch(console.error);
