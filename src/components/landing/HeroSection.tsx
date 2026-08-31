"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Car, TrendingUp, Zap, Users } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const floatingStats = [
  {
    id: "views",
    label: "Total Views Hari Ini",
    value: "2.4M",
    delta: "+18.3%",
    positive: true,
    icon: TrendingUp,
    top: "18%",
    left: "7%",
    delay: 0.6,
  },
  {
    id: "payout",
    label: "Payout Terbaru",
    value: "Rp 1.250.000",
    delta: "Ahmad R.",
    positive: true,
    icon: Zap,
    top: "62%",
    right: "6%",
    delay: 0.8,
  },
  {
    id: "campaigns",
    label: "Campaign Aktif",
    value: "128",
    delta: "+14 minggu ini",
    positive: true,
    icon: Car,
    top: "75%",
    left: "5%",
    delay: 1.0,
  },
  {
    id: "creators",
    label: "Creator Bergabung",
    value: "5.800+",
    delta: "Creator aktif",
    positive: true,
    icon: Users,
    top: "14%",
    right: "7%",
    delay: 0.7,
  },
];

function FloatingCard({
  stat,
  delay,
}: {
  stat: (typeof floatingStats)[0];
  delay: number;
}) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: EASE }}
      className="absolute hidden lg:block"
      style={{
        top: stat.top,
        left: "left" in stat ? stat.left : undefined,
        right: "right" in stat ? stat.right : undefined,
      }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.5,
        }}
        className="rounded-2xl border px-4 py-3 min-w-[180px]"
        style={{
          background:
            "linear-gradient(145deg, rgba(21,24,28,0.95) 0%, rgba(17,19,22,0.9) 100%)",
          borderColor: "rgba(212, 175, 55, 0.15)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "rgba(212, 175, 55, 0.12)" }}
          >
            <Icon size={12} className="text-[#D4AF37]" />
          </div>
          <span className="text-xs text-white/40 font-medium">{stat.label}</span>
        </div>
        <div className="text-lg font-bold text-white">{stat.value}</div>
        <div className="text-xs mt-1" style={{ color: "#D4AF37" }}>
          {stat.delta}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Animated grid lines for the hero background
function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
      {/* Radial fade over grid */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 30%, #111316 75%)",
        }}
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-[#111316]" />

      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 30%, rgba(212,175,55,0.06) 0%, transparent 65%)",
        }}
      />

      {/* Grid lines */}
      <GridLines />

      {/* Horizontal light streak */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "52%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 20%, rgba(212,175,55,0.4) 50%, rgba(212,175,55,0.15) 80%, transparent 100%)",
        }}
      />

      {/* Floating data cards */}
      {floatingStats.map((stat) => (
        <FloatingCard key={stat.id} stat={stat} delay={stat.delay} />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Overline — no pill badge */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
          className="text-[11px] uppercase tracking-[0.22em] font-mono mb-7"
          style={{ color: "rgba(212, 175, 55, 0.55)" }}
        >
          Platform Creator Otomotif Indonesia
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.65, ease: EASE }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
          style={{ color: "#F5F5E9" }}
        >
          Ubah Passion{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #F0D060 0%, #D4AF37 45%, #B8941F 100%)",
            }}
          >
            Otomotif
          </span>
          <br />
          Jadi Penghasilan Nyata
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: "rgba(245, 245, 233, 0.55)" }}
        >
          Hubungkan passion otomotifmu dengan dealership terkemuka. Pilih campaign,
          kunjungi showroom, rekam konten berkualitas — dan raih bayaran dari setiap view
          yang terakumulasi.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.55, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <Link
            href="/dashboard"
            className="relative w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-[#111316] overflow-hidden group transition-transform duration-150 active:scale-[0.97]"
            style={{
              background:
                "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
              boxShadow:
                "0 0 30px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <span className="relative z-10">Mulai Sekarang — Gratis</span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200 rounded-xl" />
          </Link>
          <Link
            href="/campaigns"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97]"
            style={{
              background: "rgba(245, 245, 233, 0.04)",
              border: "1px solid rgba(245, 245, 233, 0.1)",
              color: "rgba(245, 245, 233, 0.8)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(245, 245, 233, 0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212, 175, 55, 0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(245, 245, 233, 0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(245, 245, 233, 0.1)";
            }}
          >
            Jelajahi Campaigns
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="flex items-center -space-x-2">
            {["#D4AF37", "#B8941F", "#8D7A2A", "#6B5A1F"].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                style={{
                  borderColor: "#111316",
                  background: color,
                  color: "#111316",
                  zIndex: 4 - i,
                }}
              >
                {["AR", "BS", "DP", "KF"][i]}
              </div>
            ))}
          </div>
          <div className="text-sm" style={{ color: "rgba(245,245,233,0.45)" }}>
            <span className="font-semibold" style={{ color: "#D4AF37" }}>
              5.800+
            </span>{" "}
            creator sudah bergabung & mendapatkan bayaran
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #111316)",
        }}
      />
    </section>
  );
}
