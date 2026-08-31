"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Animated inline dashboard mockup — real UI, no screenshots
function DashboardMockup() {
  const [activeTab, setActiveTab] = useState(0);
  const campaigns = [
    {
      brand: "BMW Tunas",
      title: "X5 M50i — Test Drive",
      type: "SHOOT",
      reward: "Rp2.500.000",
      views: "51.2K",
      payout: "Rp800.000",
      progress: 68,
    },
    {
      brand: "Honda Kebon Jeruk",
      title: "HRV RS — Cinematic",
      type: "UGC",
      reward: "Rp1.500.000",
      views: "34.7K",
      payout: "Rp412.000",
      progress: 45,
    },
    {
      brand: "Porsche Centre Jakarta",
      title: "911 S/T — Short Hooks",
      type: "CLIP",
      reward: "Rp750.000",
      views: "18.1K",
      payout: "Rp198.000",
      progress: 26,
    },
  ];

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #15181c 0%, #0d0f12 100%)",
        border: "1px solid rgba(212,175,55,0.1)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(212,175,55,0.04)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "rgba(245,245,233,0.05)" }}
      >
        <div className="flex gap-1.5">
          {["#FF5F57","#FFBD2E","#28CA41"].map((c) => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div
          className="mx-auto text-[11px] font-mono px-4 py-1 rounded"
          style={{
            background: "rgba(245,245,233,0.04)",
            color: "rgba(245,245,233,0.3)",
          }}
        >
          carpaign.com/dashboard
        </div>
      </div>

      {/* Nav strip */}
      <div
        className="flex gap-1 px-4 pt-3 pb-0"
      >
        {["Beranda", "Campaigns", "Pendapatan", "Analitik"].map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className="relative px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors duration-150"
            style={{
              color: activeTab === i ? "#D4AF37" : "rgba(245,245,233,0.35)",
              background: activeTab === i ? "rgba(212,175,55,0.08)" : "transparent",
            }}
          >
            {tab}
            {activeTab === i && (
              <motion.div
                layoutId="mockup-tab"
                className="absolute inset-0 rounded-md"
                style={{ background: "rgba(212,175,55,0.08)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {[
          { label: "Total Views", value: "104.0K", delta: "+12.4%" },
          { label: "Saldo Aktif", value: "Rp1.41M", delta: "3 campaign" },
          { label: "Campaign", value: "3", delta: "Aktif" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3"
            style={{
              background: "rgba(245,245,233,0.03)",
              border: "1px solid rgba(245,245,233,0.05)",
            }}
          >
            <p className="text-[10px] mb-1" style={{ color: "rgba(245,245,233,0.35)" }}>
              {s.label}
            </p>
            <p className="text-base font-bold" style={{ color: "#F5F5E9" }}>{s.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "#D4AF37" }}>{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Campaign list */}
      <div className="px-4 pb-4 space-y-2">
        <p className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ color: "rgba(245,245,233,0.25)" }}>
          Campaign Saya
        </p>
        {campaigns.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
            className="flex items-center gap-3 rounded-xl p-3"
            style={{
              background: "rgba(245,245,233,0.025)",
              border: "1px solid rgba(245,245,233,0.05)",
            }}
          >
            {/* Type chip */}
            <div
              className="text-[9px] font-bold px-2 py-0.5 rounded shrink-0"
              style={{
                background: "rgba(212,175,55,0.1)",
                color: "#D4AF37",
                letterSpacing: "0.1em",
              }}
            >
              {c.type}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold truncate" style={{ color: "#F5F5E9" }}>
                {c.title}
              </p>
              <p className="text-[10px]" style={{ color: "rgba(245,245,233,0.3)" }}>
                {c.brand}
              </p>
            </div>
            {/* Views + payout */}
            <div className="text-right shrink-0">
              <p className="text-[11px] font-bold" style={{ color: "#10FC1C" }}>{c.payout}</p>
              <p className="text-[9px]" style={{ color: "rgba(245,245,233,0.3)" }}>{c.views} views</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

type TabKey = "creator" | "dealership";

const features: Record<TabKey, {
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}[]> = {
  creator: [
    {
      title: "Bayaran per View, bukan per Post",
      description: "Penghasilan terus mengalir selama video masih ditonton. Tidak ada bayaran flat yang dibatasi.",
      stat: "Rp5/view",
      statLabel: "rata-rata CPM",
    },
    {
      title: "Akses Showroom Eksklusif",
      description: "Rekam di lingkungan yang normalnya tertutup untuk publik. Konten premium dari lokasi premium.",
      stat: "200+",
      statLabel: "showroom partner",
    },
    {
      title: "Sistem Tier & Bonus",
      description: "Semakin sering kamu bekerja, semakin tinggi tier dan multiplier bonusmu — hingga +20% di level teratas.",
      stat: "+20%",
      statLabel: "bonus Tier Elite",
    },
    {
      title: "Cairkan ke Mana Saja",
      description: "GoPay, OVO, DANA, ShopeePay, BCA, BRI, Mandiri — semua tersedia langsung dari dashboard.",
    },
    {
      title: "Analitik Real-Time",
      description: "Pantau views harian, estimasi payout, dan peringkat kamu di antara creator lain dalam campaign yang sama.",
    },
    {
      title: "Data Sosial Aman",
      description: "Hanya akses read-only untuk views. Tidak ada posting otomatis. Enkripsi end-to-end di semua data.",
    },
  ],
  dealership: [
    {
      title: "Konten Organik yang Terpercaya",
      description: "Ratusan video dari creator nyata — bukan iklan tradisional. Konten authentic menghasilkan trust lebih tinggi.",
      stat: "10×",
      statLabel: "lebih efisien vs iklan",
    },
    {
      title: "Pool Creator Terverifikasi",
      description: "Pilih dari creator yang sudah punya track record, tier terukur, dan keahlian spesifik di otomotif.",
      stat: "5.800+",
      statLabel: "creator aktif",
    },
    {
      title: "Pay-Per-View, Bukan Per Janji",
      description: "Kamu hanya membayar berdasarkan views nyata yang dihasilkan — bukan janji jumlah tayangan di proposal.",
      stat: "CPV",
      statLabel: "model pembayaran",
    },
    {
      title: "Laporan Otomatis Mingguan",
      description: "Laporan komprehensif tentang performa campaign, distribusi konten, dan ROI yang dihasilkan.",
    },
    {
      title: "Setup Campaign dalam Menit",
      description: "Set brief, budget, kuota creator, dan deadline dari dashboard. Tidak perlu tim agency.",
    },
    {
      title: "Brand Safety Terjamin",
      description: "Setiap konten melalui review sebelum dihitung. Konten tidak sesuai brief? Tidak ada bayaran.",
    },
  ],
};

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("creator");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const mockupRef = useRef<HTMLDivElement>(null);
  const mockupInView = useInView(mockupRef, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* === DASHBOARD MOCKUP SECTION === */}
        <div
          ref={mockupRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-32"
        >
          {/* Left: Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={mockupInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <DashboardMockup />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={mockupInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.22em] font-mono mb-5"
              style={{ color: "rgba(212, 175, 55, 0.55)" }}
            >
              Dashboard Creator
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-5 tracking-tight leading-tight"
              style={{ color: "#F5F5E9" }}
            >
              Pantau semua campaign
              <br />
              dan penghasilan dari
              <br />
              <em
                className="not-italic"
                style={{
                  backgroundImage: "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                satu tempat.
              </em>
            </h2>
            <p
              className="text-sm leading-relaxed mb-8 max-w-sm"
              style={{ color: "rgba(245, 245, 233, 0.45)" }}
            >
              Dashboard Carpaign menampilkan views real-time, estimasi payout, status
              campaign, dan ranking-mu dibandingkan creator lain — semuanya transparan
              tanpa angka tersembunyi.
            </p>
            <div className="space-y-4">
              {[
                "Views terakumulasi setiap hari pukul 24.00 WIB",
                "Saldo otomatis tersedia setelah validasi 7 hari",
                "Cairkan kapan saja ke 10+ e-wallet dan bank",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    className="w-px h-full mt-1.5 shrink-0"
                    style={{ background: "rgba(212,175,55,0.3)", minHeight: "16px" }}
                  />
                  <p className="text-sm" style={{ color: "rgba(245,245,233,0.55)" }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* === FEATURES SECTION === */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12"
        >
          <p
            className="text-[11px] uppercase tracking-[0.22em] font-mono mb-4"
            style={{ color: "rgba(212, 175, 55, 0.55)" }}
          >
            Fitur Platform
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
              style={{ color: "#F5F5E9" }}
            >
              Satu platform,
              <br />
              dua pihak untung.
            </h2>

            {/* Tab switch — no rounded-full pill styling */}
            <div
              className="inline-flex rounded-lg overflow-hidden"
              style={{
                border: "1px solid rgba(245,245,233,0.08)",
                background: "rgba(17,19,22,0.8)",
              }}
            >
              {(["creator", "dealership"] as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-5 py-2 text-sm font-semibold capitalize transition-colors duration-200"
                  style={{
                    color: activeTab === tab ? "#111316" : "rgba(245,245,233,0.4)",
                  }}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="feature-tab"
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
                      }}
                      transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab === "creator" ? "Creator" : "Dealership"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features grid — bento-style, no icon */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features[activeTab].map((f, i) => (
              <motion.div
                key={`${activeTab}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}
                className="group relative rounded-2xl p-6 transition-all duration-300"
                style={{
                  background: "linear-gradient(145deg, rgba(21,24,28,0.6) 0%, rgba(17,19,22,0.9) 100%)",
                  border: "1px solid rgba(245,245,233,0.05)",
                }}
                whileHover={{ borderColor: "rgba(212,175,55,0.12)" } as never}
              >
                {/* Stat — displayed as a large typographic number instead of an icon */}
                {f.stat && (
                  <div className="mb-4">
                    <span
                      className="text-3xl font-black tracking-tighter"
                      style={{
                        backgroundImage: "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {f.stat}
                    </span>
                    {f.statLabel && (
                      <p
                        className="text-[10px] uppercase tracking-[0.12em] mt-0.5"
                        style={{ color: "rgba(212,175,55,0.4)" }}
                      >
                        {f.statLabel}
                      </p>
                    )}
                  </div>
                )}
                {!f.stat && (
                  /* Decorative line accent instead of icon */
                  <div
                    className="w-8 h-px mb-5"
                    style={{ background: "rgba(212,175,55,0.3)" }}
                  />
                )}
                <h3
                  className="text-sm font-bold mb-2 leading-snug"
                  style={{ color: "#F5F5E9" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(245,245,233,0.38)" }}
                >
                  {f.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
