import { DealerLayout } from "@/components/layout/DealerLayout";
import { DealerProfileView } from "@/components/views/dealer/DealerProfileView";
import { db } from "@/db/db";
import { dealerProfiles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Profil Dealer - Carpaign",
};

export default async function DealerProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  let profile = null;

  if (session?.user?.id) {
    const rows = await db
      .select()
      .from(dealerProfiles)
      .where(eq(dealerProfiles.userId, session.user.id));
    if (rows.length > 0) {
      profile = rows[0];
    }
  }

  return (
    <DealerLayout title="Profil Dealer">
      <DealerProfileView initialProfile={profile} />
    </DealerLayout>
  );
}
