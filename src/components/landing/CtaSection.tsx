"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Horizontal border lines */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.2) 30%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.2) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.2) 30%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.2) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              color: "#D4AF37",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            128 Campaign Aktif Sekarang
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight leading-[1.05]"
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
            style={{ color: "rgba(245, 245, 233, 0.45)" }}
          >
            Bergabung gratis, tidak ada komitmen jangka panjang. Pilih campaign
            pertamamu hari ini dan lihat berapa yang bisa kamu hasilkan minggu ini.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="relative w-full sm:w-auto px-10 py-4 rounded-xl text-sm font-bold text-[#111316] overflow-hidden group transition-transform duration-150 active:scale-[0.97]"
              style={{
                background:
                  "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
                boxShadow:
                  "0 0 40px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              <span className="relative z-10">Mulai Sekarang — Gratis</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200 rounded-xl" />
            </Link>
            <Link
              href="/campaigns"
              className="w-full sm:w-auto px-10 py-4 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200"
              style={{
                background: "rgba(245, 245, 233, 0.04)",
                border: "1px solid rgba(245, 245, 233, 0.08)",
              }}
            >
              Lihat Semua Campaigns
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {[
              "Daftar Gratis",
              "Tanpa Komitmen",
              "Cairkan ke 10+ E-Wallet",
              "Support 7/24",
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 text-xs"
                style={{ color: "rgba(245, 245, 233, 0.35)" }}
              >
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ background: "rgba(212, 175, 55, 0.5)" }}
                />
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
