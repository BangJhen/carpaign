"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function DemoVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Lacak progress scroll saat elemen ini berada dalam viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Mulai animasi saat bagian atas video menyentuh bawah layar ("start end")
    // Selesai animasi saat bagian tengah video menyentuh tengah layar ("center center")
    offset: ["start end", "center center"],
  });

  // Transformasi dari ukuran 80% ke 100% (membesar saat di-scroll ke bawah)
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  return (
    <section ref={sectionRef} className="relative py-12 px-6 overflow-hidden">
      {/* Background glow behind the video player */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
        <motion.div
          style={{ scale, opacity }}
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Aspect ratio container (16:9) */}
          <div 
            className="relative aspect-video w-full"
            style={{
              background: "#111316",
              border: "1px solid rgba(212,175,55,0.15)",
              boxShadow: "0 20px 60px -10px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.05)",
            }}
          >
            {/* 
              Video berjalan otomatis (autoplay loop muted).
              Tidak ada control play/pause.
            */}
            <video 
              // TODO: Insert your video URL below (e.g. src="/video.mp4")
              poster="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1600"
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </motion.div>
        
        {/* Helper text below video */}
        <p
          className="text-center mt-6 text-xs font-mono tracking-wider uppercase"
          style={{ color: "rgba(245, 245, 233, 0.4)" }}
        >
          Lihat cara kerja Carpaign dari awal hingga submit campaign
        </p>
      </div>
    </section>
  );
}
