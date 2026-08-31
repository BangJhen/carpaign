"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TestimonialMarquee } from "@/components/landing/TestimonialMarquee";

export function DemoVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Lacak progress scroll saat elemen ini berada dalam viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Mulai animasi saat bagian atas video menyentuh bawah layar ("start end")
    // Selesai animasi saat bagian tengah video menyentuh tengah layar ("center center")
    offset: ["start end", "center center"],
  });

  // Transformasi scale dan radius
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["24px", "24px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  return (
    <section ref={sectionRef} className="relative pt-24 pb-10 overflow-hidden flex flex-col items-center group">
      {/* Top gradient mask to blend with the hero section's bottom fade */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #111316 100%)",
        }}
      />

      {/* Interactive background glow behind the video player that brightens on hover */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="w-full flex flex-col items-center px-6 relative z-10 cursor-pointer">
        <motion.div
          style={{ scale, opacity, borderRadius }}
          className="relative w-full max-w-5xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out group-hover:shadow-[0_30px_80px_-15px_rgba(212,175,55,0.2)] group-hover:-translate-y-2"
        >
          {/* Aspect ratio container (16:9) */}
          <div 
            className="relative aspect-video w-full bg-[#111316]"
          >
            {/* 
              Video berjalan otomatis (autoplay loop muted).
              Tidak ada control play/pause.
            */}
            <video 
              poster="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1600"
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </motion.div>
        
        <p className="text-center mt-6 text-sm" style={{ color: "rgba(245, 245, 233, 0.5)" }}>
          *Cuplikan dashboard kreator (mockup visual)
        </p>
      </div>

      {/* Testimonial Marquee placed immediately after video inside the same section */}
      <div className="w-full mt-24">
        <TestimonialMarquee />
      </div>
    </section>
  );
}
