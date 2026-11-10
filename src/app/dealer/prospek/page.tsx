import { db } from "@/db/db";
import { campaigns, creatorProfiles, dealerProfiles, leadClicks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { updateLeadStatus } from "@/app/actions/leads";
import { CopyLeadLink } from "@/components/views/dealer/CopyLeadLink";
import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DealerLeadsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "dealership") redirect("/login");
  const dealerId = session.user.id;
  const [profile] = await db.select({ phone: dealerProfiles.phone }).from(dealerProfiles)
    .where(eq(dealerProfiles.userId, dealerId)).limit(1);
  const hasWhatsApp = Boolean(profile?.phone && /^62\d{8,13}$/.test(profile.phone.replace(/\D/g, "").replace(/^0/, "62")));
  const [activeCampaigns, clicks] = await Promise.all([
    db.select({ id: campaigns.id, title: campaigns.title }).from(campaigns)
      .where(and(eq(campaigns.dealerId, dealerId), eq(campaigns.status, "active")))
      .orderBy(desc(campaigns.createdAt)),
    db.select({
      id: leadClicks.id, createdAt: leadClicks.createdAt, status: leadClicks.status,
      campaignTitle: campaigns.title, creatorName: creatorProfiles.fullName,
    }).from(leadClicks)
      .innerJoin(campaigns, eq(leadClicks.campaignId, campaigns.id))
      .leftJoin(creatorProfiles, eq(leadClicks.creatorId, creatorProfiles.userId))
      .where(eq(leadClicks.dealerId, dealerId))
      .orderBy(desc(leadClicks.createdAt)).limit(100),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20 text-white">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Prospek WhatsApp</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
          Tercatat saat seseorang membuka tautan menuju WhatsApp dealer. Klik belum memastikan pesan terkirim atau kendaraan terjual.
        </p>
      </header>

      <section aria-labelledby="lead-links-title">
        <h2 id="lead-links-title" className="mb-4 text-lg font-semibold">Tautan kampanye aktif</h2>
        {!hasWhatsApp && <p className="mb-4 text-sm text-amber-300">Lengkapi nomor WhatsApp dealer di Profil sebelum membagikan tautan.</p>}
        {activeCampaigns.length === 0 ? <p className="text-sm text-white/50">Belum ada kampanye aktif.</p> : (
          <div className="divide-y divide-white/10 border-y border-white/10">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <span className="text-sm">{campaign.title}</span>
                {hasWhatsApp && <CopyLeadLink campaignId={campaign.id} />}
              </div>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="lead-clicks-title">
        <h2 id="lead-clicks-title" className="mb-1 text-lg font-semibold">Aktivitas tautan</h2>
        <p className="mb-4 text-xs text-white/45">Status setelah klik diperbarui secara manual oleh dealer.</p>
        {clicks.length === 0 ? <p className="text-sm text-white/50">Belum ada klik yang tercatat.</p> : (
          <div className="divide-y divide-white/10 border-y border-white/10">
            {clicks.map((click) => (
              <div key={click.id} className="grid gap-3 py-4 text-sm sm:grid-cols-[1fr_150px_190px] sm:items-center">
                <div>
                  <p className="font-medium">{click.campaignTitle}</p>
                  <p className="mt-1 text-xs text-white/45">
                    {click.createdAt.toLocaleString("id-ID")} · {click.creatorName ? `Rujukan ${click.creatorName}` : "Tanpa rujukan kreator"}
                  </p>
                </div>
                <span className="text-xs text-white/55">Klik menuju WhatsApp</span>
                <form action={updateLeadStatus.bind(null, click.id)}>
                  <label className="sr-only" htmlFor={`status-${click.id}`}>Status prospek</label>
                  <select id={`status-${click.id}`} name="status" defaultValue={click.status}
                    className="w-full rounded-md border border-white/15 bg-[#1A1D20] px-3 py-2 text-xs text-white">
                    <option value="baru">Baru</option>
                    <option value="dihubungi">Sudah dihubungi</option>
                    <option value="test_drive">Jadwal uji kendaraan</option>
                    <option value="terjual">Terjual</option>
                  </select>
                  <button type="submit" className="mt-2 text-xs underline underline-offset-4">Simpan status</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
