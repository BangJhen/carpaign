"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Shield,
  BarChart3,
  MapPin,
  Smartphone,
  Award,
  Building2,
  Star,
  Users,
  Eye,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type TabKey = "creator" | "dealership";

const tabs: { key: TabKey; label: string }[] = [
  { key: "creator", label: "Untuk Creator" },
  { key: "dealership", label: "Untuk Dealership" },
];

const features: Record<TabKey, {
  icon: React.ElementType;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}[]> = {
  creator: [
    {
      icon: Wallet,
      title: "Bayaran Transparan",
      description:
        "Lihat secara real-time berapa views yang sudah terakumulasi dan estimasi payout-mu. Tidak ada angka tersembunyi.",
      stat: "Rp5/view",
      statLabel: "rata-rata CPM",
    },
    {
      icon: MapPin,
      title: "Akses Eksklusif ke Showroom",
      description:
        "Dapatkan akses ke showroom premium yang normalnya tertutup untuk publik — dan rekam konten dalam lingkungan profesional.",
      stat: "200+",
      statLabel: "showroom partner",
    },
    {
      icon: Award,
      title: "Sistem Tier & Reputasi",
      description:
        "Semakin banyak campaign yang kamu kerjakan, semakin tinggi tier dan bonus multipliermu. Tier 5 dapat bonus hingga +20%.",
      stat: "5 Tier",
      statLabel: "hingga +20% bonus",
    },
    {
      icon: Smartphone,
      title: "Cairkan ke Semua E-Wallet",
      description:
        "Saldo bisa langsung cair ke GoPay, OVO, DANA, ShopeePay, atau rekening bank BCA, BRI, Mandiri, dan lainnya.",
      stat: "<1 Hari",
      statLabel: "proses pencairan",
    },
    {
      icon: BarChart3,
      title: "Dashboard Analitik",
      description:
        "Pantau performa setiap konten — views harian, estimasi payout, dan ranking dibandingkan creator lain dalam campaign yang sama.",
    },
    {
      icon: Shield,
      title: "Data Aman & Terenkripsi",
      description:
        "Akun sosmed kamu hanya digunakan untuk tracking views. Tidak ada akses posting otomatis. End-to-end encryption di semua data sensitif.",
    },
  ],
  dealership: [
    {
      icon: Building2,
      title: "Jangkauan Konten Organik",
      description:
        "Dapatkan ratusan video organik dari creator nyata, bukan iklan tradisional. Konten yang authentic menghasilkan trust lebih tinggi.",
      stat: "10x",
      statLabel: "lebih efisien vs iklan",
    },
    {
      icon: Users,
      title: "Ribuan Creator Terverifikasi",
      description:
        "Pilih dari pool creator yang sudah terverifikasi, memiliki track record, dan keahlian spesifik di bidang otomotif.",
      stat: "5.800+",
      statLabel: "creator aktif",
    },
    {
      icon: Eye,
      title: "Track Performa Real-Time",
      description:
        "Lihat berapa views yang dihasilkan setiap creator untuk campaign-mu. Bayar hanya berdasarkan hasil nyata — bukan janji.",
      stat: "Pay-Per-View",
      statLabel: "model bayar",
    },
    {
      icon: BarChart3,
      title: "Laporan Otomatis",
      description:
        "Terima laporan mingguan komprehensif tentang performa campaign, distribusi konten, dan ROI yang dihasilkan.",
    },
    {
      icon: Star,
      title: "Manajemen Campaign Mudah",
      description:
        "Buat campaign baru dalam hitungan menit. Set brief, budget, kuota creator, dan deadline — kami yang urus sisanya.",
    },
    {
      icon: Shield,
      title: "Brand Safety Terjamin",
      description:
        "Setiap konten melalui review sebelum dihitung. Jika tidak sesuai brief, tidak ada bayaran. Reputasi brand kamu aman.",
    },
  ],
};

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features.creator)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.55, ease: EASE }}
      className="group relative rounded-2xl p-5 border transition-all duration-300 hover:border-[rgba(212,175,55,0.15)]"
      style={{
        background: "linear-gradient(145deg, rgba(21,24,28,0.7) 0%, rgba(17,19,22,0.9) 100%)",
        border: "1px solid rgba(245, 245, 233, 0.06)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[rgba(212,175,55,0.12)]"
          style={{ background: "rgba(212, 175, 55, 0.07)" }}
        >
          <Icon size={18} className="text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold" style={{ color: "#F5F5E9" }}>
              {feature.title}
            </h3>
            {feature.stat && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(212, 175, 55, 0.1)",
                  color: "#D4AF37",
                }}
              >
                {feature.stat}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(245,245,233,0.4)" }}>
            {feature.description}
          </p>
          {feature.statLabel && (
            <p className="text-[10px] mt-2 font-medium" style={{ color: "rgba(212,175,55,0.5)" }}>
              {feature.statLabel}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("creator");
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="relative py-28 px-6">
      {/* subtle gold glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(212, 175, 55, 0.06)",
              border: "1px solid rgba(212, 175, 55, 0.15)",
              color: "#D4AF37",
            }}
          >
            Fitur Unggulan
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: "#F5F5E9" }}
          >
            Satu platform,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
              }}
            >
              dua pihak untung
            </span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto leading-relaxed"
            style={{ color: "rgba(245, 245, 233, 0.45)" }}
          >
            Carpaign dirancang untuk memudahkan creator menghasilkan uang dan
            dealership mendapatkan konten berkualitas.
          </p>
        </motion.div>

        {/* Tab Switch */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-flex p-1 rounded-xl gap-1"
            style={{
              background: "rgba(21, 24, 28, 0.9)",
              border: "1px solid rgba(212, 175, 55, 0.1)",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                style={{
                  color:
                    activeTab === tab.key
                      ? "#111316"
                      : "rgba(245, 245, 233, 0.45)",
                }}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
                    }}
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features[activeTab].map((feature, i) => (
              <FeatureCard key={`${activeTab}-${i}`} feature={feature} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
