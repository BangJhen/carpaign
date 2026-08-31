"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Sistem tracking view-nya transparan. Dulu susah nego rate, sekarang bayaran jelas sesuai performa video kita.",
    name: "Rizky Firmansyah",
    role: "Automotive Reviewer",
    tier: "Tier 4",
  },
  {
    quote: "Akses ke showroom premium yang dulunya susah tembus sekarang difasilitasi penuh. Relasi dealership jadi gampang.",
    name: "Ahmad Rayhan",
    role: "TikTok Creator",
    tier: "Tier 5 Elite",
  },
  {
    quote: "Pencairan super cepat. Tidak perlu tunggu invoice berbulan-bulan cair dari agency. Views divalidasi, besoknya bisa ditarik.",
    name: "Dinda Shafira",
    role: "Motovlogger",
    tier: "Tier 3",
  },
  {
    quote: "Dari sekadar iseng bikin konten mobil, sekarang bisa jadi pendapatan tetap tiap minggu berkat Carpaign.",
    name: "Kevin Santoso",
    role: "UGC Creator",
    tier: "Tier 4",
  },
  {
    quote: "Brief dari dealership sangat jelas, tidak banyak revisi subjektif. Kalau views tinggi, bayaran juga tinggi. Sangat fair.",
    name: "Bima Arya",
    role: "Cinematographer",
    tier: "Tier 5 Elite",
  },
];

// Duplicate the array to create a seamless loop
const marqueeItems = [...testimonials, ...testimonials];

export function TestimonialMarquee() {
  return (
    <section className="py-20 overflow-hidden relative">
      {/* Edge masks for smooth fade out */}
      <div
        className="absolute top-0 bottom-0 left-0 w-32 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #111316 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-32 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, #111316 0%, transparent 100%)",
        }}
      />

      {/* Decorative Overline */}
      <div className="text-center mb-10">
        <p
          className="text-[11px] uppercase tracking-[0.22em] font-mono"
          style={{ color: "rgba(212, 175, 55, 0.4)" }}
        >
          Dipercaya oleh 5.800+ Creator
        </p>
      </div>

      <div className="flex w-full">
        <motion.div
          className="flex gap-6 pr-6 w-max"
          animate={{ x: [0, -100 * testimonials.length + "%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
          // The total translation depends on the width. Framer Motion can animate 
          // percentage based on the parent, but since width is dynamic, animating to a 
          // specific percentage of the total track is easier when we double the items 
          // and translate by -50%.
          style={{ x: "0%" }}
          initial={{ x: "0%" }}
          //@ts-expect-error Animate to -50% to seamlessly loop the doubled array
          animate={{ x: ["0%", "-50%"] }}
        >
          {marqueeItems.map((t, i) => (
            <div
              key={i}
              className="w-[340px] md:w-[420px] shrink-0 rounded-2xl p-6"
              style={{
                background: "rgba(245, 245, 233, 0.02)",
                border: "1px solid rgba(245, 245, 233, 0.06)",
              }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, starIdx) => (
                  <svg
                    key={starIdx}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#D4AF37"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <p
                className="text-sm md:text-base leading-relaxed mb-6"
                style={{ color: "rgba(245, 245, 233, 0.85)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div
                className="pt-4 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(245, 245, 233, 0.06)" }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: "#F5F5E9" }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(245, 245, 233, 0.4)" }}>
                    {t.role}
                  </p>
                </div>
                <div
                  className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded"
                  style={{
                    background: "rgba(212, 175, 55, 0.1)",
                    color: "#D4AF37",
                  }}
                >
                  {t.tier}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
