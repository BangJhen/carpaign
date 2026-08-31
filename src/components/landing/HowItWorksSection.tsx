"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, MapPin, Camera, DollarSign } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Temukan Campaign",
    description:
      "Browse ratusan campaign otomotif dari dealership top Indonesia. Filter berdasarkan jenis konten, lokasi, merek, atau besaran reward.",
    tag: "Pilih Campaign",
    color: "rgba(212, 175, 55, 0.9)",
    glow: "rgba(212, 175, 55, 0.12)",
  },
  {
    number: "02",
    icon: MapPin,
    title: "Kunjungi Showroom",
    description:
      "Datang langsung ke showroom atau ambil unit untuk sesi rekaman. Semua koordinasi dilakukan via platform — tidak perlu negosiasi manual.",
    tag: "Koordinasi Mudah",
    color: "rgba(212, 175, 55, 0.8)",
    glow: "rgba(212, 175, 55, 0.1)",
  },
  {
    number: "03",
    icon: Camera,
    title: "Rekam & Publish",
    description:
      "Buat konten berkualitas sesuai brief campaign. Upload ke TikTok, Instagram Reels, atau YouTube Shorts — lalu submit via dashboard.",
    tag: "Konten Dinilai",
    color: "rgba(212, 175, 55, 0.7)",
    glow: "rgba(212, 175, 55, 0.08)",
  },
  {
    number: "04",
    icon: DollarSign,
    title: "Raih Penghasilan",
    description:
      "Views terakumulasi otomatis setiap hari. Saldo langsung masuk ke akunmu dan dapat dicairkan ke e-wallet atau rekening bank.",
    tag: "Cair Otomatis",
    color: "rgba(212, 175, 55, 0.95)",
    glow: "rgba(212, 175, 55, 0.15)",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.12,
        duration: 0.65,
        ease: EASE,
      }}
      className="relative group"
    >
      {/* Connector line (not on last) */}
      {index < steps.length - 1 && (
        <div
          className="absolute top-[52px] left-[calc(50%+52px)] right-0 h-px hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.05) 100%)",
            zIndex: 0,
          }}
        />
      )}

      <div
        className="relative rounded-2xl p-6 border transition-all duration-300 group-hover:border-[rgba(212,175,55,0.2)]"
        style={{
          background:
            "linear-gradient(145deg, rgba(21,24,28,0.8) 0%, rgba(17,19,22,0.95) 100%)",
          border: "1px solid rgba(212, 175, 55, 0.08)",
          boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${step.glow}`,
        }}
      >
        {/* Step number */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: step.glow,
              border: `1px solid rgba(212,175,55,0.15)`,
            }}
          >
            <Icon size={20} style={{ color: step.color }} />
          </div>
          <span
            className="text-4xl font-black leading-none tracking-tighter"
            style={{ color: "rgba(212, 175, 55, 0.08)" }}
          >
            {step.number}
          </span>
        </div>

        {/* Tag */}
        <div
          className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{
            background: "rgba(212, 175, 55, 0.08)",
            color: "rgba(212, 175, 55, 0.8)",
          }}
        >
          {step.tag}
        </div>

        <h3
          className="text-lg font-bold mb-2"
          style={{ color: "#F5F5E9" }}
        >
          {step.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(245, 245, 233, 0.45)" }}
        >
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export function HowItWorksSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="how-it-works" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(212, 175, 55, 0.06)",
              border: "1px solid rgba(212, 175, 55, 0.15)",
              color: "#D4AF37",
            }}
          >
            Cara Kerja
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: "#F5F5E9" }}
          >
            Empat langkah menuju{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
              }}
            >
              penghasilan pertamamu
            </span>
          </h2>
          <p
            className="text-base max-w-xl mx-auto leading-relaxed"
            style={{ color: "rgba(245, 245, 233, 0.45)" }}
          >
            Tidak perlu beli mobil, tidak perlu follower jutaan. Cukup passion
            otomotif dan kemampuan membuat konten.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
