import { db } from "@/db/db";
import { campaignPayments, campaigns } from "@/db/schema";
import { getMidtransStatus, midtransConfigured, validMidtransSignature, type MidtransStatus } from "@/lib/midtrans";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!midtransConfigured()) return NextResponse.json({ error: "Midtrans belum dikonfigurasi." }, { status: 503 });

  let notification: MidtransStatus;
  try {
    notification = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON tidak valid." }, { status: 400 });
  }
  if (!notification || !validMidtransSignature(notification)) {
    return NextResponse.json({ error: "Tanda tangan tidak valid." }, { status: 401 });
  }

  const [known] = await db.select().from(campaignPayments)
    .where(eq(campaignPayments.orderId, notification.order_id)).limit(1);
  if (!known) return NextResponse.json({ error: "Pesanan tidak dikenal." }, { status: 404 });

  let current: MidtransStatus;
  try {
    current = await getMidtransStatus(notification.order_id);
  } catch {
    return NextResponse.json({ error: "Verifikasi status tertunda." }, { status: 502 });
  }
  if (current.order_id !== known.orderId ||
      !Number.isSafeInteger(Number(current.gross_amount)) ||
      Number(current.gross_amount) !== known.amount ||
      (current.signature_key && !validMidtransSignature(current))) {
    return NextResponse.json({ error: "Data pembayaran tidak sesuai." }, { status: 400 });
  }

  const allowed = ["pending", "settlement", "capture", "deny", "cancel", "expire", "refund"] as const;
  const nextStatus = allowed.find((status) => status === current.transaction_status);
  if (!nextStatus) return NextResponse.json({ error: "Status belum didukung." }, { status: 422 });
  const paid = nextStatus === "settlement" || (nextStatus === "capture" && current.fraud_status === "accept");

  await db.transaction(async (tx) => {
    const [payment] = await tx.select().from(campaignPayments)
      .where(eq(campaignPayments.orderId, known.orderId)).for("update");
    if (!payment) throw new Error("Pesanan tidak ditemukan.");
    if (payment.paidAt && nextStatus !== "refund") return;
    await tx.update(campaignPayments).set({
      status: nextStatus,
      paidAt: paid ? (payment.paidAt ?? new Date()) : payment.paidAt,
      updatedAt: new Date(),
    }).where(eq(campaignPayments.orderId, known.orderId));
    if (paid) {
      await tx.update(campaigns).set({ status: "active" })
        .where(and(eq(campaigns.id, payment.campaignId), eq(campaigns.status, "draft")));
    }
  });

  revalidatePath("/dealer/campaigns");
  revalidatePath("/dealer/dashboard");
  revalidatePath("/dealer/billing");
  revalidatePath("/campaigns");
  return NextResponse.json({ received: true });
}
