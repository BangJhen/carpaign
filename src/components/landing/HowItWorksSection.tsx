"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Discover.",
    description: "Browse campaign otomotif dari dealership tier-1. Filter berdasarkan jenis konten, lokasi, atau reward.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
  },
  {
    number: "02",
    title: "Visit.",
    description: "Kunjungi showroom eksklusif untuk sesi rekaman. Koordinasi dilakukan 100% via platform, tanpa negosiasi manual.",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800",
  },
  {
    number: "03",
    title: "Create.",
    description: "Buat konten sesuai brief, upload ke media sosial pilihanmu (TikTok/Reels), lalu submit link lewat dashboard.",
    image: "https://images.unsplash.com/photo-1512758117904-7b6cecea82f8?auto=format&fit=crop&q=80&w=800",
  },
  {
    number: "04",
    title: "Earn.",
    description: "Views terakumulasi otomatis. Tarik saldo ke e-wallet atau bank kapan saja tanpa potongan tersembunyi.",
    image: "https://images.unsplash.com/photo-1580509988188-34861e69b59e?auto=format&fit=crop&q=80&w=800",
  },
];

export function HowItWorksSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Create a tall container to allow scrolling. We have 4 items + some offset.
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map scroll progress to horizontal translation
  // It moves from 0% to the negative width needed to see the last item.
  // With 4 items, moving -75% will put the 4th item on screen (if they are 100vw each).
  // I'll make the track slightly less than 100vw per item to show part of the next one.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  return (
    <section 
      ref={targetRef} 
      className="relative h-[400vh] bg-[#0d0f12]"
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Absolute Title behind the sliding cards */}
        <div className="absolute top-20 left-10 md:left-20 z-0">
           <h2 className="text-[12vw] font-bold tracking-tighter leading-none opacity-5 pointer-events-none" style={{ color: "#F5F5E9" }}>
             PROCESS
           </h2>
        </div>

        {/* Horizontal Track */}
        <motion.div 
          style={{ x }} 
          className="flex gap-10 px-10 md:px-32 relative z-10 items-center h-full w-[400vw] md:w-[300vw] lg:w-[250vw]"
        >
          {steps.map((step, i) => (
            <div 
              key={step.number} 
              className="relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-[60vh] md:h-[70vh] flex flex-col justify-end p-8 md:p-12 overflow-hidden"
            >
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-[#111316]/50 to-transparent" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <span 
                    className="text-sm font-mono tracking-widest"
                    style={{ color: "#D4AF37" }}
                  >
                    {step.number}
                  </span>
                  <div className="h-px w-12 bg-[#D4AF37]/50" />
                </div>
                <h3 
                  className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                  style={{ color: "#F5F5E9" }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-sm md:text-base max-w-sm font-light leading-relaxed"
                  style={{ color: "rgba(245, 245, 233, 0.6)" }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
