"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Easing from animate skill — strong ease-out for entrances
const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

// Helper component for staggered text reveal
function KineticText({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-2">
          <motion.span
            initial={{ transform: "translateY(110%)", opacity: 0 }}
            animate={{ transform: "translateY(0%)", opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.08,
              ease: EASE_OUT_STRONG,
            }}
            className="inline-block origin-bottom-left"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scroll parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Letterbox open: starts with inset(45% 0 45% 0) — two bars covering 90% of height
  // Reveals to inset(0% 0 0% 0) — fully open
  // Duration: 1200ms marketing tier, strong ease-out (allowed per animate skill)
  const letterboxVariants = {
    initial: {
      clipPath: "inset(46% 0 46% 0)",
      opacity: 0,
    },
    open: {
      clipPath: "inset(0% 0 0% 0)",
      opacity: 1,
      transition: {
        clipPath: {
          duration: prefersReducedMotion ? 0.2 : 1.2,
          ease: EASE_OUT_STRONG,
          delay: 0.1,
        },
        opacity: {
          duration: 0.4,
          ease: [0, 0, 1, 1] as const,
          delay: 0.1,
        },
      },
    },
  };

  // Dark bars (top and bottom letterbox) that slide away
  const barTopVariants = {
    initial: { transform: "translateY(0%)" },
    open: {
      transform: "translateY(-100%)",
      transition: {
        duration: prefersReducedMotion ? 0.2 : 1.1,
        ease: EASE_OUT_STRONG,
        delay: 0.15,
      },
    },
  };

  const barBottomVariants = {
    initial: { transform: "translateY(0%)" },
    open: {
      transform: "translateY(100%)",
      transition: {
        duration: prefersReducedMotion ? 0.2 : 1.1,
        ease: EASE_OUT_STRONG,
        delay: 0.15,
      },
    },
  };

  // Text content starts revealing midway through the letterbox opening
  const contentDelay = prefersReducedMotion ? 0.1 : 0.7;

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden"
    >
      {/* ─── Letterbox Bars (Dark Cinematic Overlay) ─── */}
      {/* Top bar — slides up and off */}
      <motion.div
        variants={barTopVariants}
        initial="initial"
        animate="open"
        className="absolute top-0 left-0 right-0 h-[46%] z-30 pointer-events-none"
        style={{ background: "#0d0f12" }}
        aria-hidden="true"
      />
      {/* Bottom bar — slides down and off */}
      <motion.div
        variants={barBottomVariants}
        initial="initial"
        animate="open"
        className="absolute bottom-0 left-0 right-0 h-[46%] z-30 pointer-events-none"
        style={{ background: "#0d0f12" }}
        aria-hidden="true"
      />

      {/* ─── Cinematic Background with clip-path reveal ─── */}
      <motion.div
        variants={letterboxVariants}
        initial="initial"
        animate="open"
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <Image
          src="/hero-bg.png"
          alt="Cinematic Hero Background"
          fill
          priority
          className="object-cover object-center opacity-40 brightness-75 contrast-125"
        />
        {/* Film grain overlay */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')",
          }}
        />
      </motion.div>

      {/* Gradient mask — smooth blend to next section */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "linear-gradient(to bottom, transparent 30%, #111316 100%)",
        }}
      />

      {/* ─── Main Content ─── */}
      <motion.div
        className="relative z-10 w-full px-6 flex flex-col items-center justify-center text-center mt-20"
        style={{ y: textY, opacity }}
      >
        {/* Editorial Overline */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.6, delay: contentDelay, ease: EASE_OUT_STRONG }}
          className="mb-8"
        >
          <p
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-mono"
            style={{ color: "rgba(245, 245, 233, 0.6)" }}
          >
            Platform Kampanye Otomotif
          </p>
        </motion.div>

        {/* Massive Kinetic Headline */}
        <h1
          className="text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.9] tracking-tighter mb-8"
          style={{ color: "#F5F5E9" }}
        >
          {/* KineticText delay aligned to post-letterbox-open */}
          <KineticText text="SHIFT INTO" delay={contentDelay + 0.1} />
          <br />
          <motion.span
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.9, delay: contentDelay + 0.4, ease: EASE_OUT_STRONG }}
            className="inline-block italic font-light pr-2"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            OVERDRIVE.
          </motion.span>
        </h1>

        {/* Subcopy */}
        <motion.p
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.7, delay: contentDelay + 0.6, ease: EASE_OUT_STRONG }}
          className="text-sm md:text-lg max-w-lg mx-auto font-light leading-relaxed mb-12"
          style={{ color: "rgba(245, 245, 233, 0.7)" }}
        >
          Buat konten dari inventory dealership premium dan dapatkan bayaran untuk setiap view yang Anda hasilkan.
        </motion.p>
      </motion.div>
    </section>
  );
}
