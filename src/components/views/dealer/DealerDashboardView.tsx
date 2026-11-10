import Link from "next/link";

type Campaign = {
  id: string;
  title: string;
  status: string;
  applicants: number;
};

export function DealerDashboardView({
  dealerName,
  campaigns,
  totalCampaigns,
  activeCampaigns,
  draftCampaigns,
  totalVehicles,
  leadClicks,
}: {
  dealerName: string;
  campaigns: Campaign[];
  totalCampaigns: number;
  activeCampaigns: number;
  draftCampaigns: number;
  totalVehicles: number;
  leadClicks: number;
}) {
  const metrics = [
    { label: "Unit terdaftar", value: totalVehicles, href: "/dealer/inventory" },
    { label: "Kampanye aktif", value: activeCampaigns, href: "/dealer/campaigns" },
    { label: "Draf kampanye", value: draftCampaigns, href: "/dealer/campaigns" },
    { label: "Klik ke WhatsApp", value: leadClicks, href: "/dealer/prospek" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-20 text-white">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Selamat datang, {dealerName}</h1>
          <p className="mt-3 text-sm text-white/55">Pantau unit, kampanye, dan minat calon pembeli dari data yang tercatat.</p>
        </div>
        <Link href="/dealer/campaigns/create" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/85">
          Buat kampanye
        </Link>
      </header>

      <section aria-label="Ringkasan aktivitas" className="grid grid-cols-2 gap-5 border-y border-white/15 py-8 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Link key={metric.label} href={metric.href} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <p className="text-sm text-white/50">{metric.label}</p>
            <p className="mt-2 text-4xl font-semibold tabular-nums group-hover:text-[#D4AF37]">{metric.value}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr]">
        <section aria-labelledby="campaign-list-title">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 id="campaign-list-title" className="text-lg font-semibold">Kampanye terbaru</h2>
            <span className="text-xs text-white/45">{totalCampaigns} kampanye tercatat</span>
          </div>
          {campaigns.length === 0 ? (
            <p className="border-y border-white/10 py-6 text-sm text-white/50">Belum ada kampanye. Mulai dengan memilih unit dari inventaris.</p>
          ) : (
            <div className="divide-y divide-white/10 border-y border-white/10">
              {campaigns.map((campaign) => (
                <Link key={campaign.id} href="/dealer/campaigns" className="flex items-center justify-between gap-4 py-4 hover:text-[#D4AF37]">
                  <span className="min-w-0 truncate text-sm font-medium">{campaign.title}</span>
                  <span className="shrink-0 text-xs text-white/45">{campaign.status === "draft" ? "Draf" : campaign.status === "active" ? "Aktif" : campaign.status === "cancelled" ? "Dibatalkan" : "Selesai"}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
        <aside className="space-y-5 border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h2 className="text-lg font-semibold">Alur berikutnya</h2>
          <p className="text-sm leading-6 text-white/55">Daftarkan unit, susun arahan konten, lalu aktifkan kampanye dengan kredit uji pada simulasi MVP.</p>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/dealer/inventory" className="underline underline-offset-4 hover:text-[#D4AF37]">Kelola inventaris</Link>
            <Link href="/dealer/billing" className="underline underline-offset-4 hover:text-[#D4AF37]">Lihat buku besar simulasi</Link>
            <Link href="/dealer/prospek" className="underline underline-offset-4 hover:text-[#D4AF37]">Lihat klik WhatsApp</Link>
          </div>
          <p className="text-xs leading-5 text-white/40">Klik WhatsApp menunjukkan pembukaan tautan, bukan pesan masuk atau penjualan yang terverifikasi.</p>
        </aside>
      </div>
    </div>
  );
}
