"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0">
        <Image 
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000"
          alt="CTA Background"
          fill
          className="object-cover"
        />
        {/* Dark Overlays for Text Legibility */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-transparent to-[#111316]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="p-10 md:p-16 rounded-[2.5rem] shadow-2xl perspective-[1000px]"
          style={{
            background: "rgba(17, 19, 22, 0.6)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            transformStyle: "preserve-3d"
          }}
        >
          <div className="flex items-center justify-center mb-8">
            {/* Removed the yellow dot as requested */}
            <p
              className="text-[11px] uppercase tracking-[0.22em] font-mono px-4 py-1.5 rounded-full"
              style={{ 
                color: "rgba(212, 175, 55, 0.8)",
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.2)"
              }}
            >
              128 Campaign Aktif Sekarang
            </p>
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.1]"
            style={{ color: "#F5F5E9" }}
          >
            Siap mulai menghasilkan
            <br />
            dari{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #F0D060 0%, #D4AF37 45%, #B8941F 100%)",
              }}
            >
              passion otomotifmu?
            </span>
          </h2>

          <p
            className="text-base leading-relaxed max-w-xl mx-auto mb-10"
            style={{ color: "rgba(245, 245, 233, 0.6)" }}
          >
            Bergabung gratis, tidak ada komitmen jangka panjang. Pilih campaign
            pertamamu hari ini dan lihat berapa yang bisa kamu hasilkan minggu ini.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="relative w-full sm:w-auto px-10 py-4 rounded-xl text-sm font-bold text-[#111316] overflow-hidden group transition-all duration-500 ease-[0.16,1,0.3,1] hover:scale-105 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
                boxShadow: "0 0 40px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              <span className="relative z-10">Mulai Sekarang — Gratis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out skew-x-12 z-0" />
            </Link>
            <Link
              href="/campaigns"
              className="w-full sm:w-auto px-10 py-4 rounded-xl text-sm font-semibold text-white/90 hover:text-white transition-colors duration-200 backdrop-blur-md"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              Lihat Semua Campaigns
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-12 pt-8 border-t border-white/5">
            {[
              "Daftar Gratis",
              "Tanpa Komitmen",
              "Cairkan ke 10+ E-Wallet",
              "Support 7/24",
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/50"
              >
                <span className="w-1 h-1 rounded-full bg-white/20" />
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
