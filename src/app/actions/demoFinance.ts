"use server";

import { db } from "@/db/db";
import { demoEscrowAccounts, demoEscrowEntries } from "@/db/schema";
import { auth } from "@/lib/auth";
import { isDemoFinanceEnabled } from "@/lib/demo-finance";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addDemoCredit(amount: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "dealership") throw new Error("Akses dealer diperlukan.");
  if (!isDemoFinanceEnabled()) throw new Error("Simulasi dana belum diaktifkan pada lingkungan ini.");
  if (!Number.isSafeInteger(amount) || amount < 500_000 || amount > 50_000_000) {
    throw new Error("Nominal simulasi harus Rp 500.000–Rp 50.000.000.");
  }

  const dealerId = session.user.id;
  await db.transaction(async (tx) => {
    await tx.insert(demoEscrowAccounts).values({ dealerId }).onConflictDoNothing();
    const [account] = await tx.select().from(demoEscrowAccounts)
      .where(eq(demoEscrowAccounts.dealerId, dealerId)).for("update");
    if (!account) throw new Error("Akun simulasi tidak tersedia.");
    const available = account.available + amount;
    await tx.update(demoEscrowAccounts).set({ available, updatedAt: new Date() })
      .where(eq(demoEscrowAccounts.dealerId, dealerId));
    await tx.insert(demoEscrowEntries).values({
      dealerId, kind: "credit", amount, availableAfter: available, reservedAfter: account.reserved,
    });
  });

  revalidatePath("/dealer/billing");
  revalidatePath("/dealer/campaigns");
  return { success: true };
}
