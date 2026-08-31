"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

const sampleCampaigns = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&q=80&w=800",
    brand: "BMW Tunas",
    title: "X5 M50i — Test Drive",
    type: "SHOOT",
    reward: "Rp2.500.000",
    status: "Aktif",
    slots: "3/5",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
    brand: "Honda Jakarta",
    title: "HRV RS — Cinematic",
    type: "UGC",
    reward: "Rp1.500.000",
    status: "Aktif",
    slots: "1/10",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
    brand: "Porsche Centre",
    title: "911 S/T — Short Hooks",
    type: "CLIP",
    reward: "Rp750.000",
    status: "Terisi",
    slots: "0/3",
  },
];

export function CampaignPreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Unique parallax and rotation transforms for each card to create an organic scatter effect
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [250, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  const rot1 = useTransform(scrollYProgress, [0, 1], [-5, 2]);
  const rot2 = useTransform(scrollYProgress, [0, 1], [8, -4]);
  const rot3 = useTransform(scrollYProgress, [0, 1], [-2, -8]);

  const transforms = [
    { y: y1, rotate: rot1, zIndex: 10, align: "self-start", marginTop: "10%" },
    { y: y2, rotate: rot2, zIndex: 20, align: "self-center", marginTop: "0%" },
    { y: y3, rotate: rot3, zIndex: 5, align: "self-end", marginTop: "20%" },
  ];

  return (
    <section ref={containerRef} className="relative py-40 px-6 overflow-hidden bg-[#111316]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
        
        {/* Left: Typography */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-mono text-[#D4AF37] mb-6">
              Live Campaigns
            </p>
            <h2
              className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-8"
              style={{ color: "#F5F5E9" }}
            >
              Akses ke<br/>
              <span className="italic font-light text-[#D4AF37]">Ratusan</span><br/>
              Campaign.
            </h2>
            <p className="text-[#A0A0A0] max-w-xl text-sm md:text-base font-light leading-relaxed mb-12">
              Pilih kendaraan, pesan jadwal rekaman, dan mulai buat konten hari ini tanpa perlu mengirim proposal.
            </p>
            
            {/* Replaced yellow line with a premium solid button */}
            <Link
              href="/campaigns"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-bold text-[#111316] transition-transform duration-150 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
                boxShadow: "0 0 20px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              Lihat Semua Campaign
            </Link>
          </motion.div>
        </div>

        {/* Right: Scattered Cards */}
        <div className="w-full lg:w-2/3 h-[500px] relative flex justify-center gap-4 md:gap-6 perspective-[1200px]">
          {sampleCampaigns.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
              style={{
                y: transforms[i].y,
                rotateZ: transforms[i].rotate,
                zIndex: transforms[i].zIndex,
                marginTop: transforms[i].marginTop,
              }}
              className="group relative w-[220px] md:w-[280px] h-[320px] md:h-[400px] rounded-[1.5rem] overflow-hidden bg-[#0a0a0c] shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(212,175,55,0.15)] cursor-pointer ring-1 ring-white/5 hover:ring-[#D4AF37]/30"
            >
              {/* Full Background Image */}
              <Image
                src={c.image}
                alt={c.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-[0.16,1,0.3,1]"
              />

              {/* Gradient fade from bottom for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-0 pointer-events-none" />

              {/* Content Overlay directly on card */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-col justify-end">
                <p className="text-[10px] font-mono tracking-widest uppercase mb-1.5" style={{ color: "#D4AF37" }}>
                  {c.brand}
                </p>
                <h3 className="text-xl font-bold leading-tight tracking-tight text-white mb-6 line-clamp-1">
                  {c.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-white/80">{c.type}</span>
                  </div>
                  <span className="text-sm font-bold text-[#D4AF37]">{c.reward}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
