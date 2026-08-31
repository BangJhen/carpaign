"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

// Helper component for staggered text reveal
function KineticText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-2">
          <motion.span
            initial={{ y: "100%", opacity: 0, rotateZ: 5 }}
            animate={{ y: 0, opacity: 1, rotateZ: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1 + i * 0.08,
              ease: EASE,
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden"
    >
      {/* 
        High-Res Cinematic Background
        Uses an Unsplash premium-looking automotive image.
      */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <Image
          src="https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&q=80&w=2400"
          alt="Cinematic Porsche"
          fill
          priority
          className="object-cover object-center opacity-40 brightness-75 contrast-125"
        />
        {/* Film grain / noise overlay */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none"
          style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }}
        />
        {/* Gradient mask for smooth blending to the next section */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 60%, #111316 100%)",
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 w-full px-6 flex flex-col items-center justify-center text-center mt-20"
        style={{ y: textY, opacity }}
      >
        {/* Editorial Overline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mb-8 overflow-hidden"
        >
          <p
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-mono"
            style={{ color: "rgba(245, 245, 233, 0.6)" }}
          >
            The New Era of Creator Economy
          </p>
        </motion.div>

        {/* Massive Kinetic Headline */}
        <h1 
          className="text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.9] tracking-tighter mb-8"
          style={{ color: "#F5F5E9" }}
        >
          <KineticText text="SHIFT INTO" />
          <br />
          <span 
            className="italic font-light pr-2"
            style={{
              backgroundImage: "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            OVERDRIVE.
          </span>
        </h1>

        {/* Subcopy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="text-sm md:text-lg max-w-lg mx-auto font-light leading-relaxed mb-12"
          style={{ color: "rgba(245, 245, 233, 0.7)" }}
        >
          Hubungkan passion otomotifmu dengan dealership premium. Rekam konten, publikasi, dan raih bayaran otomatis berdasarkan performa karya nyata.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        >
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden"
          >
            {/* Outline / glow ring */}
            <div 
              className="absolute inset-0 border border-[#D4AF37]/30 rounded-full transition-all duration-500 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10"
            />
            {/* Minimalist dot indicator */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mr-3 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#F5F5E9] group-hover:text-[#D4AF37] transition-colors">
              Mulai Eksplorasi
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent overflow-hidden relative">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-full h-1/2 bg-[#D4AF37]"
          />
        </div>
        <span className="text-[9px] uppercase tracking-[0.3em] font-mono text-white/30">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
