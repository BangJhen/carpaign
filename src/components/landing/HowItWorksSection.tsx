"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Temukan.",
    description: "Jelajahi kampanye otomotif dan pilih kendaraan yang sesuai dengan kemampuanmu.",
    image: "/process-images/discover.jpg",
  },
  {
    number: "02",
    title: "Pelajari.",
    description: "Baca arahan, format konten, lokasi, dan ketentuan setiap kampanye sebelum mengajukan diri.",
    image: "/process-images/visit.jpg",
  },
  {
    number: "03",
    title: "Ajukan.",
    description: "Ikuti langkah pengajuan pada kampanye yang dipilih dan siapkan materi sesuai arahan dealer.",
    image: "/process-images/create.jpg",
  },
  {
    number: "04",
    title: "Pantau.",
    description: "Lihat status pengajuan dan pekerjaanmu melalui dashboard kreator.",
    image: "/process-images/earn.jpg",
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
        <div className="absolute top-12 md:top-16 left-6 md:left-20 z-0">
           <h2 className="text-[10vw] md:text-[8vw] font-bold tracking-tighter leading-none opacity-5 pointer-events-none" style={{ color: "#F5F5E9" }}>
             CARA KERJA
           </h2>
        </div>

        {/* Horizontal Track */}
        <motion.div 
          style={{ x }} 
          className="flex gap-10 px-10 md:px-32 relative z-10 items-center h-full w-[400vw] md:w-[300vw] lg:w-[250vw]"
        >
          {steps.map((step) => (
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
                  loading="eager"
                  unoptimized
                  className="object-cover opacity-80 grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-[#111316]/30 to-transparent" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <span 
                    className="text-sm font-mono tracking-widest"
                    style={{ color: "#D4AF37" }}
                  >
                    {step.number}
                  </span>
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
