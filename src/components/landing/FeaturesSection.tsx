"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

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
    },
    {
      brand: "Honda Kebon Jeruk",
      title: "HRV RS — Cinematic",
      type: "UGC",
      reward: "Rp1.500.000",
      views: "34.7K",
      payout: "Rp412.000",
    },
    {
      brand: "Porsche Centre Jakarta",
      title: "911 S/T — Short Hooks",
      type: "CLIP",
      reward: "Rp750.000",
      views: "18.1K",
      payout: "Rp198.000",
    },
  ];

  return (
    <div
      className="relative rounded-lg overflow-hidden w-full max-w-[600px]"
      style={{
        background: "linear-gradient(145deg, #15181c 0%, #0d0f12 100%)",
        border: "1px solid rgba(212,175,55,0.15)",
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
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {[
          { label: "Total Views", value: "104.0K", delta: "+12.4%" },
          { label: "Saldo Aktif", value: "Rp1.41M", delta: "Bisa ditarik" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{
              background: "rgba(245,245,233,0.02)",
              border: "1px solid rgba(245,245,233,0.04)",
            }}
          >
            <p className="text-[10px] mb-2 uppercase tracking-widest font-mono" style={{ color: "rgba(245,245,233,0.35)" }}>
              {s.label}
            </p>
            <p className="text-2xl font-bold tracking-tight" style={{ color: "#F5F5E9" }}>{s.value}</p>
            <p className="text-[10px] mt-1" style={{ color: "#D4AF37" }}>{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Campaign list */}
      <div className="px-4 pb-4 space-y-2">
        <p className="text-[10px] uppercase tracking-[0.2em] font-mono mb-3 mt-2" style={{ color: "rgba(245,245,233,0.3)" }}>
          Active Campaigns
        </p>
        {campaigns.map((c, i) => (
          <div
            key={c.title}
            className="flex items-center gap-3 rounded-xl p-3"
            style={{
              background: "rgba(245,245,233,0.015)",
              border: "1px solid rgba(245,245,233,0.03)",
            }}
          >
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold truncate" style={{ color: "#F5F5E9" }}>
                {c.title}
              </p>
              <p className="text-[10px] font-mono tracking-wider mt-0.5" style={{ color: "rgba(245,245,233,0.4)" }}>
                {c.brand}
              </p>
            </div>
            {/* Views + payout */}
            <div className="text-right shrink-0">
              <p className="text-[12px] font-bold" style={{ color: "#10FC1C" }}>{c.payout}</p>
              <p className="text-[9px] mt-0.5" style={{ color: "rgba(245,245,233,0.3)" }}>{c.views} views</p>
            </div>
          </div>
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
      title: "Bayaran per View",
      description: "Penghasilan pasif terus mengalir selama videomu ditonton.",
      stat: "Rp5",
      statLabel: "per view rata-rata",
    },
    {
      title: "Akses Showroom",
      description: "Buat konten di area premium yang tertutup untuk publik umum.",
      stat: "200+",
      statLabel: "showroom partner",
    },
    {
      title: "Sistem Tier & Bonus",
      description: "Naikkan tier untuk melipatgandakan pendapatan hingga +20%.",
      stat: "+20%",
      statLabel: "bonus Tier Elite",
    },
  ],
  dealership: [
    {
      title: "Jangkauan Organik",
      description: "Sebaran video kreator menghasilkan impresi yang tak bisa ditandingi iklan statis.",
      stat: "10×",
      statLabel: "lebih efisien vs iklan",
    },
    {
      title: "Pay-Per-View",
      description: "Hanya bayar untuk views nyata yang benar-benar didapatkan.",
      stat: "CPV",
      statLabel: "model pembayaran",
    },
    {
      title: "Brand Safety",
      description: "Setiap konten wajib lolos review. Melanggar brief = tidak ada bayaran.",
      stat: "100%",
      statLabel: "terverifikasi",
    },
  ],
};

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("creator");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Static sticky without parallax translation to avoid bleeding out of bounds
  // const yMockup = ... (removed)

  return (
    <section ref={containerRef} className="relative bg-[#111316] pt-24 lg:pt-32">
      {/* 
        Sticky Container Layout:
        The dashboard mockup stays sticky on the left side (desktop)
        while the massive typography features scroll by on the right.
      */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row relative">
        
        {/* Left: Sticky Mockup area */}
        <div className="w-full lg:w-1/2 lg:h-[200vh] relative pt-20 lg:pt-0">
          <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center px-6 lg:pl-12 lg:pr-20">
            <p
              className="text-[11px] uppercase tracking-[0.22em] font-mono mb-8"
              style={{ color: "rgba(212, 175, 55, 0.55)" }}
            >
              Cara Kerja Ekosistem
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-8"
              style={{ color: "#F5F5E9" }}
            >
              Buat Konten.<br/>Raih Penjualan.
            </h2>
            
            <div className="flex gap-4 mb-12">
              {(["creator", "dealership"] as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="text-xs uppercase tracking-widest font-bold pb-2 transition-colors relative"
                  style={{
                    color: activeTab === tab ? "#D4AF37" : "rgba(245,245,233,0.3)",
                  }}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: "#D4AF37" }}
                    />
                  )}
                </button>
              ))}
            </div>

            <motion.div>
              <DashboardMockup />
            </motion.div>
          </div>
        </div>

        {/* Right: Scrolling Features Content */}
        <div className="w-full lg:w-1/2 px-6 pt-20 lg:pt-40 pb-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col gap-32"
            >
              {features[activeTab].map((f, i) => (
                <div key={i} className="relative group">
                  <div 
                    className="absolute -left-6 md:-left-12 top-0 text-[10rem] font-bold leading-none opacity-5 pointer-events-none transition-transform duration-700 group-hover:-translate-x-4"
                    style={{ color: "#D4AF37", fontFamily: "serif" }}
                  >
                    {i + 1}
                  </div>
                  
                  <div className="relative z-10 pt-8 pl-4">
                    {f.stat && (
                      <div className="mb-6">
                        <span 
                          className="text-5xl md:text-7xl font-bold tracking-tighter block mb-2"
                          style={{
                            backgroundImage: "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {f.stat}
                        </span>
                        {f.statLabel && (
                          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "rgba(245,245,233,0.4)" }}>
                            {f.statLabel}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold mb-4 tracking-tight" style={{ color: "#F5F5E9" }}>
                      {f.title}
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed max-w-sm font-light" style={{ color: "rgba(245,245,233,0.5)" }}>
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
