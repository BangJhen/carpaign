"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Custom animated SVG step markers — no Lucide icons
function StepPathSvg({ step }: { step: number }) {
  const paths = [
    // Step 1: Search / scan lines (viewfinder)
    <svg key={1} width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="18" r="9" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="9" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="27" x2="20" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="11" y1="18" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="29" y1="18" x2="32" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="18" r="3" fill="currentColor" opacity="0.4"/>
      <line x1="26" y1="26" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>,
    // Step 2: Location pin with car silhouette
    <svg key={2} width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M20 6C15.03 6 11 10.03 11 15C11 22 20 34 20 34C20 34 29 22 29 15C29 10.03 24.97 6 20 6Z" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="13" width="12" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M15 13L16.5 10H23.5L25 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="16" cy="18" r="1" fill="currentColor"/>
      <circle cx="24" cy="18" r="1" fill="currentColor"/>
    </svg>,
    // Step 3: Camera shutter
    <svg key={3} width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="7" y="12" width="26" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="20" cy="21" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="20" cy="21" r="2" fill="currentColor" opacity="0.4"/>
      <path d="M28 15L30 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="15" y="9" width="10" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>,
    // Step 4: Ascending bar chart (earnings)
    <svg key={4} width="40" height="40" viewBox="0 0 40 40" fill="none">
      <line x1="8" y1="32" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="10" y="22" width="5" height="10" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="17.5" y="16" width="5" height="16" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="25" y="10" width="5" height="22" rx="1" fill="currentColor"/>
      <path d="M12.5 20L20 14L27.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2"/>
    </svg>,
  ];
  return <div style={{ color: "#D4AF37" }}>{paths[step - 1]}</div>;
}

const steps = [
  {
    number: "01",
    title: "Temukan Campaign",
    description:
      "Browse campaign otomotif dari dealership top. Filter berdasarkan jenis konten, lokasi, atau reward.",
    detail: "128 campaign aktif",
  },
  {
    number: "02",
    title: "Kunjungi Showroom",
    description:
      "Datang langsung ke showroom untuk sesi rekaman. Koordinasi dilakukan via platform, tidak perlu negosiasi manual.",
    detail: "200+ showroom partner",
  },
  {
    number: "03",
    title: "Rekam & Publish",
    description:
      "Buat konten sesuai brief, upload ke TikTok atau Reels, lalu submit lewat dashboard.",
    detail: "TikTok · Reels · YouTube",
  },
  {
    number: "04",
    title: "Terima Penghasilan",
    description:
      "Views terakumulasi otomatis. Saldo masuk dan dapat dicairkan ke e-wallet atau bank kapan saja.",
    detail: "Cair < 24 jam",
  },
];

// Animated connector line between steps
function ConnectorLine({ active }: { active: boolean }) {
  return (
    <div className="hidden lg:flex items-center justify-center w-full px-2">
      <motion.div
        className="h-px w-full"
        style={{ background: "rgba(212,175,55,0.15)" }}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={active ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
      />
    </div>
  );
}

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="relative py-28 px-6 overflow-hidden">
      {/* Subtle background texture via repeating gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #D4AF37 0px, #D4AF37 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, #D4AF37 0px, #D4AF37 1px, transparent 1px, transparent 80px)",
        }}
      />
      {/* Radial mask over grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, #111316 75%)",
        }}
      />

      <div ref={sectionRef} className="max-w-6xl mx-auto relative">
        {/* Header — no eyebrow badge, just overline text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          className="mb-20"
        >
          <p
            className="text-[11px] uppercase tracking-[0.22em] font-mono mb-4"
            style={{ color: "rgba(212, 175, 55, 0.55)" }}
          >
            Cara Kerja
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]"
            style={{ color: "#F5F5E9" }}
          >
            Empat langkah
            <br />
            <em
              className="not-italic"
              style={{
                backgroundImage: "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              penghasilan pertamamu.
            </em>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col lg:flex-row">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.13, duration: 0.6, ease: EASE }}
                className="relative lg:pr-8 pb-10 lg:pb-0"
              >
                {/* Vertical line for mobile */}
                {i < steps.length - 1 && (
                  <div
                    className="lg:hidden absolute left-5 top-14 w-px bottom-0"
                    style={{ background: "rgba(212,175,55,0.1)" }}
                  />
                )}

                {/* Step marker row */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="shrink-0 relative">
                    {/* SVG icon — no Lucide */}
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-xl"
                      style={{
                        background: "rgba(212,175,55,0.07)",
                        border: "1px solid rgba(212,175,55,0.12)",
                      }}
                    >
                      <StepPathSvg step={i + 1} />
                    </div>
                  </div>

                  {/* Number */}
                  <span
                    className="text-[11px] font-mono tracking-[0.15em] mt-3"
                    style={{ color: "rgba(212,175,55,0.4)" }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className="text-lg font-bold mb-2 leading-snug"
                  style={{ color: "#F5F5E9" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "rgba(245,245,233,0.4)" }}
                >
                  {step.description}
                </p>
                <span
                  className="text-[11px] font-mono tracking-wide"
                  style={{ color: "rgba(212,175,55,0.5)" }}
                >
                  — {step.detail}
                </span>
              </motion.div>

              {/* Connector between cards (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex items-start pt-5 shrink-0">
                  <ConnectorLine active={inView} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
