"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, DollarSign, MapPin } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const sampleCampaigns = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
    brand: "BMW Tunas",
    title: "BMW X5 M50i — Test Drive & Review",
    type: "SHOOT",
    reward: "Rp2.500.000",
    location: "Jakarta Selatan",
    deadline: "7 Hari",
    quota: "2 dari 5 Slot",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
    brand: "Honda Jakarta Center",
    title: "All New HRV RS — Cinematic Exterior",
    type: "UGC",
    reward: "Rp1.500.000",
    location: "Kebon Jeruk",
    deadline: "14 Hari",
    quota: "1 dari 3 Slot",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
    brand: "Porsche Centre Jakarta",
    title: "Porsche 911 S/T — TikTok Short Hooks",
    type: "CLIP",
    reward: "Rp750.000",
    location: "Remote",
    deadline: "3 Hari",
    quota: "8 dari 20 Slot",
  },
];

function CampaignPreviewCard({
  campaign,
  index,
}: {
  campaign: (typeof sampleCampaigns)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: EASE }}
      className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:border-[rgba(212,175,55,0.2)]"
      style={{
        background: "linear-gradient(145deg, rgba(21,24,28,0.9) 0%, rgba(17,19,22,0.95) 100%)",
        border: "1px solid rgba(245, 245, 233, 0.06)",
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(17,19,22,0.95) 100%)",
          }}
        />
        {/* Type Badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest"
          style={{
            background: "rgba(212, 175, 55, 0.12)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            color: "#D4AF37",
          }}
        >
          {campaign.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[11px] font-medium mb-1.5" style={{ color: "rgba(212,175,55,0.7)" }}>
          {campaign.brand}
        </p>
        <h3 className="text-sm font-bold mb-3 leading-tight" style={{ color: "#F5F5E9" }}>
          {campaign.title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(245,245,233,0.4)" }}>
            <DollarSign size={11} style={{ color: "#D4AF37" }} />
            <span className="font-semibold" style={{ color: "#D4AF37" }}>{campaign.reward}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(245,245,233,0.4)" }}>
            <MapPin size={11} />
            {campaign.location}
          </div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(245,245,233,0.4)" }}>
            <Clock size={11} />
            {campaign.deadline}
          </div>
        </div>

        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(245,245,233,0.06)" }}
        >
          <span className="text-[11px]" style={{ color: "rgba(245,245,233,0.35)" }}>
            {campaign.quota}
          </span>
          <Link
            href="/dashboard"
            className="text-[11px] font-semibold flex items-center gap-1 transition-colors duration-200 hover:text-white"
            style={{ color: "#D4AF37" }}
          >
            Apply <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function CampaignPreviewSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="relative py-28 px-6">
      {/* Subtle divider */}
      <div
        className="absolute top-0 left-6 right-6 mx-auto max-w-6xl h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.12) 30%, rgba(212,175,55,0.12) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(212, 175, 55, 0.06)",
                border: "1px solid rgba(212, 175, 55, 0.15)",
                color: "#D4AF37",
              }}
            >
              Campaign Terbaru
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              style={{ color: "#F5F5E9" }}
            >
              Campaign yang bisa
              <br />
              kamu mulai{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
                }}
              >
                hari ini
              </span>
            </h2>
          </div>
          <Link
            href="/campaigns"
            className="flex items-center gap-2 text-sm font-semibold shrink-0 transition-colors duration-200 hover:text-white"
            style={{ color: "rgba(212, 175, 55, 0.8)" }}
          >
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sampleCampaigns.map((campaign, i) => (
            <CampaignPreviewCard key={campaign.id} campaign={campaign} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
