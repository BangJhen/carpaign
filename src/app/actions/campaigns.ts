"use server";

import { db } from "@/db/db";
import { campaigns, campaignPayments, demoCampaignReserves, demoEscrowAccounts, demoEscrowEntries } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import type { CampaignType, CampaignStatus } from "@/db/schema";
import { campaignTotalWithFee, isDemoFinanceEnabled } from "@/lib/demo-finance";

export type CreateCampaignInput = {
  title: string;
  thumbnail?: string;
  promotionalFocus: "dealer" | "single_unit" | "multiple_units";
  vehicles: string[];
  type: CampaignType;
  budget: number;
  startDate: string;
  deadline: string;
  status: CampaignStatus;
  details: any;
};

function safeParseDate(val: any, fallbackDaysFromNow: number = 14): Date {
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val;
  }
  if (typeof val === "string" && val.trim()) {
    const trimmed = val.trim();
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const d = new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
      if (!isNaN(d.getTime())) return d;
    }
    const monthMap: Record<string, number> = {
      jan: 0, januari: 0,
      feb: 1, februari: 1,
      mar: 2, maret: 2,
      apr: 3, april: 3,
      mei: 4, may: 4,
      jun: 5, juni: 5,
      jul: 6, juli: 6,
      agu: 7, agustus: 7, aug: 7, august: 7,
      sep: 8, september: 8,
      okt: 9, oktober: 9, oct: 9, october: 9,
      nov: 10, november: 10,
      des: 11, desember: 11, dec: 11, december: 11,
    };
    const idMatch = trimmed.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
    if (idMatch) {
      const day = parseInt(idMatch[1], 10);
      const monthKey = idMatch[2].toLowerCase();
      const year = parseInt(idMatch[3], 10);
      if (monthMap[monthKey] !== undefined) {
        const d = new Date(year, monthMap[monthKey], day);
        if (!isNaN(d.getTime())) return d;
      }
    }
  }
  return new Date(Date.now() + fallbackDaysFromNow * 24 * 60 * 60 * 1000);
}

export async function createCampaign(input: CreateCampaignInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "dealership" && role !== "dealer")) {
    throw new Error("Unauthorized");
  }

  if (!input.title || input.title.trim().length < 3) {
    throw new Error("Judul campaign minimal 3 karakter.");
  }

  if (input.budget < 1000000) {
    throw new Error("Budget campaign minimal Rp 1.000.000");
  }

  if (input.type === "Clipping") {
    if (input.details?.cpm && input.details.cpm < 500) {
      throw new Error("Tarif CPM minimal Rp 500 per 1.000 views.");
    }
    if (input.details?.maxViewsPerClipper && input.details.maxViewsPerClipper < 10000) {
      throw new Error("Batas maksimal views minimal 10.000 views per clipper.");
    }
  }

  const campaignThumbnail = input.thumbnail?.trim() || null;
  const mergedDetails = {
    ...(input.details || {}),
    thumbnail: campaignThumbnail,
  };

  const newId = crypto.randomUUID();

  await db.insert(campaigns).values({
    id: newId,
    dealerId: session.user.id,
    title: input.title,
    thumbnail: campaignThumbnail,
    promotionalFocus: input.promotionalFocus,
    vehicles: input.vehicles,
    type: input.type,
    details: mergedDetails,
    budget: input.budget,
    startDate: safeParseDate(input.startDate, 0),
    deadline: safeParseDate(input.deadline, 14),
    status: "draft", // Kampanye wajib berstatus draft hingga pembayaran diselesaikan
  });

  revalidatePath("/dealer/campaigns");
  revalidatePath("/dealer/dashboard");
  return { success: true, campaignId: newId };
}

export async function payCampaign(campaignId: string, paymentMethod: string = "demo") {
  const session = await auth.api.getSession({ headers: await headers() });

  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "dealership" && role !== "dealer")) {
    throw new Error("Unauthorized");
  }

  if (!isDemoFinanceEnabled() || paymentMethod !== "demo") {
    throw new Error("Pembayaran sungguhan belum tersedia. Aktifkan mode simulasi untuk menguji alur MVP.");
  }
  const dealerId = session.user.id;
  await db.transaction(async (tx) => {
    const [existing] = await tx.select().from(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.dealerId, dealerId))).for("update");
    if (!existing) throw new Error("Kampanye tidak ditemukan.");
    if (existing.status !== "draft") throw new Error("Hanya kampanye draf yang dapat diaktifkan.");
    const midtransPayments = await tx.select({ status: campaignPayments.status }).from(campaignPayments)
      .where(eq(campaignPayments.campaignId, campaignId));
    if (midtransPayments.some((payment) => !["failed", "deny", "cancel", "expire"].includes(payment.status))) {
      throw new Error("Kampanye ini sedang memiliki transaksi Midtrans.");
    }
    const [oldReserve] = await tx.select().from(demoCampaignReserves)
      .where(eq(demoCampaignReserves.campaignId, campaignId));
    if (oldReserve) throw new Error("Alokasi simulasi untuk kampanye ini sudah tercatat.");

    await tx.insert(demoEscrowAccounts).values({ dealerId }).onConflictDoNothing();
    const [account] = await tx.select().from(demoEscrowAccounts)
      .where(eq(demoEscrowAccounts.dealerId, dealerId)).for("update");
    const amount = campaignTotalWithFee(existing.budget);
    if (!account || account.available < amount) {
      throw new Error(`Saldo simulasi kurang. Diperlukan Rp ${amount.toLocaleString("id-ID")}.`);
    }
    const available = account.available - amount;
    const reserved = account.reserved + amount;
    await tx.update(demoEscrowAccounts).set({ available, reserved, updatedAt: new Date() })
      .where(eq(demoEscrowAccounts.dealerId, dealerId));
    await tx.insert(demoCampaignReserves).values({ campaignId, dealerId, amount });
    await tx.insert(demoEscrowEntries).values({
      dealerId, campaignId, kind: "reserve", amount, availableAfter: available, reservedAfter: reserved,
    });
    await tx.update(campaigns).set({ status: "active" })
      .where(eq(campaigns.id, campaignId));
  });

  revalidatePath("/dealer/campaigns");
  revalidatePath("/dealer/dashboard");
  revalidatePath("/campaigns");
  revalidatePath("/dealer/billing");
  return { success: true };
}

export async function cancelCampaign(campaignId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "dealership" && role !== "dealer")) {
    throw new Error("Unauthorized");
  }

  const [existing] = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.dealerId, session.user.id)))
    .limit(1);

  if (!existing) {
    throw new Error("Kampanye tidak ditemukan atau Anda tidak memiliki akses.");
  }

  await db.transaction(async (tx) => {
    const [campaign] = await tx.select().from(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.dealerId, session.user.id))).for("update");
    if (!campaign || campaign.status === "cancelled" || campaign.status === "completed") {
      throw new Error("Kampanye tidak dapat dibatalkan.");
    }
    const midtransPayments = await tx.select().from(campaignPayments)
      .where(eq(campaignPayments.campaignId, campaignId));
    if (midtransPayments.some((payment) => !["failed", "deny", "cancel", "expire"].includes(payment.status))) {
      throw new Error("Kampanye dengan pembayaran Midtrans harus ditangani melalui proses pengembalian dana.");
    }
    const [reserve] = await tx.select().from(demoCampaignReserves)
      .where(eq(demoCampaignReserves.campaignId, campaignId)).for("update");
    if (reserve?.status === "reserved") {
      const [account] = await tx.select().from(demoEscrowAccounts)
        .where(eq(demoEscrowAccounts.dealerId, session.user.id)).for("update");
      if (!account || account.reserved < reserve.amount) throw new Error("Saldo cadangan tidak sesuai.");
      const available = account.available + reserve.amount;
      const reserved = account.reserved - reserve.amount;
      await tx.update(demoEscrowAccounts).set({ available, reserved, updatedAt: new Date() })
        .where(eq(demoEscrowAccounts.dealerId, session.user.id));
      await tx.update(demoCampaignReserves).set({ status: "refunded" })
        .where(eq(demoCampaignReserves.campaignId, campaignId));
      await tx.insert(demoEscrowEntries).values({
        dealerId: session.user.id, campaignId, kind: "refund", amount: reserve.amount,
        availableAfter: available, reservedAfter: reserved,
      });
    }
    await tx.update(campaigns).set({ status: "cancelled" }).where(eq(campaigns.id, campaignId));
  });

  revalidatePath("/dealer/campaigns");
  revalidatePath("/dealer/dashboard");
  revalidatePath("/dealer/billing");
  return { success: true };
}
