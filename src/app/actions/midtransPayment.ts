"use server";

import { db } from "@/db/db";
import { campaignPayments, campaigns } from "@/db/schema";
import { auth } from "@/lib/auth";
import { campaignTotalWithFee } from "@/lib/demo-finance";
import { createSnapTransaction, midtransConfigured } from "@/lib/midtrans";
import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function startMidtransPayment(campaignId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !["dealer", "dealership"].includes(role ?? "")) throw new Error("Akses ditolak.");
  if (!midtransConfigured()) throw new Error("Pembayaran Midtrans belum dikonfigurasi.");

  const dealerId = session.user.id;
  const prepared = await db.transaction(async (tx) => {
    const [campaign] = await tx.select().from(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.dealerId, dealerId))).for("update");
    if (!campaign || campaign.status !== "draft") throw new Error("Kampanye draf tidak ditemukan.");

    const [latest] = await tx.select().from(campaignPayments)
      .where(eq(campaignPayments.campaignId, campaignId))
      .orderBy(desc(campaignPayments.createdAt)).limit(1);
    if (latest?.status === "pending" && latest.redirectUrl) return { redirectUrl: latest.redirectUrl };
    if (latest && ["initiating", "pending", "settlement", "capture"].includes(latest.status)) {
      throw new Error("Pembayaran sebelumnya masih diproses. Muat ulang halaman sebentar lagi.");
    }

    const orderId = `carpaign-${crypto.randomUUID()}`;
    const amount = campaignTotalWithFee(campaign.budget);
    await tx.insert(campaignPayments).values({ orderId, campaignId, dealerId, amount });
    return { orderId, amount, title: campaign.title };
  });

  if ("redirectUrl" in prepared) return { redirectUrl: prepared.redirectUrl as string };
  try {
    const redirectUrl = await createSnapTransaction(prepared.orderId, prepared.amount, prepared.title);
    await db.update(campaignPayments).set({ redirectUrl, status: "pending", updatedAt: new Date() })
      .where(and(eq(campaignPayments.orderId, prepared.orderId), eq(campaignPayments.status, "initiating")));
    return { redirectUrl };
  } catch (error) {
    await db.update(campaignPayments).set({ status: "failed", updatedAt: new Date() })
      .where(and(eq(campaignPayments.orderId, prepared.orderId), eq(campaignPayments.status, "initiating")));
    throw error;
  }
}
