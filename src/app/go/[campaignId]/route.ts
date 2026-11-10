import { db } from "@/db/db";
import { campaigns, creatorProfiles, dealerProfiles, leadClicks } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizePhone(value: string | null) {
  const digits = (value ?? "").replace(/\D/g, "");
  const phone = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return /^62\d{8,13}$/.test(phone) ? phone : null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const { campaignId } = await params;
  const [row] = await db.select({
    id: campaigns.id,
    title: campaigns.title,
    dealerId: campaigns.dealerId,
    phone: dealerProfiles.phone,
  }).from(campaigns)
    .leftJoin(dealerProfiles, eq(campaigns.dealerId, dealerProfiles.userId))
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.status, "active")))
    .limit(1);

  if (!row) return new NextResponse("Kampanye tidak tersedia.", { status: 404 });
  const phone = normalizePhone(row.phone);
  if (!phone) return new NextResponse("Nomor WhatsApp dealer belum tersedia.", { status: 404 });

  const ref = new URL(request.url).searchParams.get("c")?.trim().slice(0, 64);
  let creatorId: string | null = null;
  if (ref) {
    const [creator] = await db.select({ userId: creatorProfiles.userId })
      .from(creatorProfiles).where(eq(creatorProfiles.referralCode, ref)).limit(1);
    creatorId = creator?.userId ?? null;
  }

  await db.insert(leadClicks).values({
    campaignId: row.id, dealerId: row.dealerId, creatorId,
  });
  const message = `Halo, saya tertarik dengan kampanye ${row.title} (ID: ${row.id.slice(0, 8)}) dari CARPAIGN.`;
  const destination = new URL(`https://wa.me/${phone}`);
  destination.searchParams.set("text", message);
  return NextResponse.redirect(destination, {
    status: 302,
    headers: { "Cache-Control": "no-store, private" },
  });
}
