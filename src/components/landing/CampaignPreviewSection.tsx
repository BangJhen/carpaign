"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

const sampleCampaigns = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
    brand: "BMW Tunas",
    title: "X5 M50i",
    type: "SHOOT",
    reward: "Rp2.5M",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
    brand: "Honda Jakarta",
    title: "HRV RS",
    type: "UGC",
    reward: "Rp1.5M",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
    brand: "Porsche Centre",
    title: "911 S/T",
    type: "CLIP",
    reward: "Rp750K",
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
    <section ref={containerRef} className="relative py-40 px-6 overflow-hidden">
      {/* Background Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }}
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
        
        {/* Left: Typography */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.22em] font-mono mb-6"
              style={{ color: "rgba(212, 175, 55, 0.55)" }}
            >
              Exclusive Access
            </p>
            <h2
              className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-8"
              style={{ color: "#F5F5E9" }}
            >
              Akses ke<br/>
              <span className="italic font-light text-[#D4AF37]">Ratusan</span><br/>
              Campaign.
            </h2>
            <p className="text-sm leading-relaxed mb-10 max-w-sm" style={{ color: "rgba(245, 245, 233, 0.5)" }}>
              Tidak perlu membuang waktu mengirim proposal. Semua campaign dari brand otomotif top sudah tersedia dan siap dieksekusi hari ini juga.
            </p>
            
            <Link
              href="/campaigns"
              className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest transition-colors hover:text-[#D4AF37]"
              style={{ color: "#F5F5E9" }}
            >
              <div className="w-12 h-px bg-[#D4AF37] group-hover:w-20 transition-all duration-300" />
              Lihat Katalog
            </Link>
          </motion.div>
        </div>

        {/* Right: Scattered Cards */}
        <div className="w-full lg:w-2/3 h-[600px] relative flex justify-center gap-6 md:gap-10 perspective-[1000px]">
          {sampleCampaigns.map((c, i) => (
            <motion.div
              key={c.id}
              style={{
                y: transforms[i].y,
                rotateZ: transforms[i].rotate,
                zIndex: transforms[i].zIndex,
                alignSelf: transforms[i].align,
                marginTop: transforms[i].marginTop,
              }}
              className="group relative w-[220px] md:w-[280px] h-[320px] md:h-[400px] rounded-sm overflow-hidden p-3 md:p-4 bg-[#1a1c20] shadow-2xl transition-shadow duration-500 hover:shadow-[#D4AF37]/20 cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full h-[75%] overflow-hidden rounded-sm mb-4 bg-black">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              
              {/* Content */}
              <div className="flex justify-between items-end px-1">
                <div>
                  <p className="text-[10px] font-mono tracking-widest uppercase mb-1" style={{ color: "rgba(212,175,55,0.7)" }}>
                    {c.brand}
                  </p>
                  <h3 className="text-lg font-bold leading-none tracking-tight text-[#F5F5E9]">
                    {c.title}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono tracking-wider opacity-40 mb-1">
                    {c.type}
                  </p>
                  <p className="text-sm font-bold text-[#D4AF37]">
                    {c.reward}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
