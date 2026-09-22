import { CampaignsView } from "@/components/views/CampaignsView";
import { db } from "@/db/db";
import { campaigns as campaignsTable, dealerProfiles } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { eq, desc } from "drizzle-orm";
import { campaigns as fallbackCampaigns, type Campaign } from "@/lib/campaigns-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eksplorasi Kampanye Carpaign",
  description: "Daftar job dan kampanye promosi mobil yang tersedia untuk kreator.",
};

export default async function CreatorCampaignsPage() {
  const dbRows = await db
    .select({
      id: campaignsTable.id,
      title: campaignsTable.title,
      type: campaignsTable.type,
      budget: campaignsTable.budget,
      status: campaignsTable.status,
      views: campaignsTable.views,
      deadline: campaignsTable.deadline,
      applicantsCount: campaignsTable.applicantsCount,
      promotionalFocus: campaignsTable.promotionalFocus,
      thumbnail: campaignsTable.thumbnail,
      details: campaignsTable.details,
      dealerName: dealerProfiles.dealerName,
      userDealerName: user.name,
      coverImage: dealerProfiles.coverImage,
    })
    .from(campaignsTable)
    .leftJoin(dealerProfiles, eq(campaignsTable.dealerId, dealerProfiles.userId))
    .leftJoin(user, eq(campaignsTable.dealerId, user.id))
    .where(eq(campaignsTable.status, "active"))
    .orderBy(desc(campaignsTable.createdAt));

  const mappedDbCampaigns: Campaign[] = dbRows.map((row) => {
    const daysRemaining = Math.max(
      1,
      Math.ceil((new Date(row.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );
    return {
      id: row.id as any,
      brand: row.dealerName || row.userDealerName || "Dealer Rekanan",
      vehicle: row.title,
      type: row.type,
      reward: `Rp${row.budget.toLocaleString("id-ID")}`,
      description: `Kampanye ${row.type} resmi dari ${row.dealerName || row.userDealerName || "dealer rekanan"}.`,
      image:
        row.thumbnail ||
        (row.details as any)?.thumbnail ||
        row.coverImage ||
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200",
      quota: `${row.applicantsCount} Pelamar`,
      tags: [row.type, "Aktif"],
      typeColor: "bg-white/10 text-white border-white/20",
      location: "Indonesia",
      deadline: `${daysRemaining} Hari`,
      requirements: [
        "Kamera berkualitas tinggi resolusi 4K",
        "Pengalaman pembuatan konten otomotif",
        "Mampu mematuhi timeline pengerjaan",
      ],
      brief: `Pengerjaan materi promosi otomotif untuk kampanye ${row.title}. Fokus pada kualitas visual, audio jernih, dan pesan promosi dealer.`,
      specs: [
        { label: "Tipe Kampanye", value: row.type },
        { label: "Batas Waktu", value: `${daysRemaining} Hari Tersisa` },
      ],
    };
  });

  const allCampaigns = [...mappedDbCampaigns, ...fallbackCampaigns];

  return <CampaignsView initialCampaigns={allCampaigns} />;
}
