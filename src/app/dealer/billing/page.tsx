import type { Metadata } from "next";
import { BillingView } from "@/components/views/dealer/BillingView";
import { db } from "@/db/db";
import { campaignPayments, campaigns, demoEscrowAccounts, demoEscrowEntries } from "@/db/schema";
import { auth } from "@/lib/auth";
import { isDemoFinanceEnabled } from "@/lib/demo-finance";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Keuangan - Dealer Dashboard | Carpaign",
};

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "dealership") redirect("/login");
  const [account] = await db.select().from(demoEscrowAccounts)
    .where(eq(demoEscrowAccounts.dealerId, session.user.id)).limit(1);
  const rows = await db.select({
    id: demoEscrowEntries.id, kind: demoEscrowEntries.kind,
    amount: demoEscrowEntries.amount, createdAt: demoEscrowEntries.createdAt,
    campaignTitle: campaigns.title,
  }).from(demoEscrowEntries)
    .leftJoin(campaigns, eq(demoEscrowEntries.campaignId, campaigns.id))
    .where(eq(demoEscrowEntries.dealerId, session.user.id))
    .orderBy(desc(demoEscrowEntries.createdAt)).limit(50);
  const payments = await db.select({
    orderId: campaignPayments.orderId, amount: campaignPayments.amount,
    status: campaignPayments.status, createdAt: campaignPayments.createdAt,
    campaignTitle: campaigns.title,
  }).from(campaignPayments)
    .innerJoin(campaigns, eq(campaignPayments.campaignId, campaigns.id))
    .where(eq(campaignPayments.dealerId, session.user.id))
    .orderBy(desc(campaignPayments.createdAt)).limit(50);
  return <BillingView
    available={account?.available ?? 0}
    reserved={account?.reserved ?? 0}
    demoEnabled={isDemoFinanceEnabled()}
    entries={rows.map((row) => ({ ...row, createdAt: row.createdAt.toLocaleString("id-ID") }))}
    payments={payments.map((row) => ({ ...row, createdAt: row.createdAt.toLocaleString("id-ID") }))}
  />;
}
