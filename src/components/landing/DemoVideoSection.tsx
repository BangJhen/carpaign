"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const chapters = [
  { label: "Mulai", time: 0 },
  { label: "Cari kampanye", time: 3.14 },
  { label: "Baca panduan", time: 5.74 },
  { label: "Kirim pengajuan", time: 15.5 },
];

export function DemoVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const reduceMotion = useReducedMotion();

  // Bingkai mengikuti posisi bagian video dalam viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const frameScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.94]);

  const jumpToChapter = (index: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.currentTime = chapters[index].time;
    setActiveChapter(index);
    void player.play().catch(() => {});
  };

  const updateChapter = () => {
    const currentTime = playerRef.current?.currentTime ?? 0;
    const index = chapters.findLastIndex((chapter) => currentTime >= chapter.time);
    setActiveChapter(Math.max(index, 0));
  };

  return (
    <section className="relative flex flex-col items-center overflow-hidden pt-24 pb-10">
      <div ref={sectionRef} className="relative z-10 w-full max-w-[1500px] px-5 sm:px-8">
        <motion.div
          className="rounded-[28px] border border-[#D4AF37]/40 bg-[#1B1C1B] p-2 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)] sm:p-3"
          style={reduceMotion ? undefined : { scale: frameScale, transformOrigin: "center center" }}
        >
          <div className="relative aspect-video overflow-hidden rounded-[19px] bg-[#111316]">
            <video
              ref={playerRef}
              src="/creator-guided-campaign-demo.mp4"
              poster="/creator-guided-campaign-poster.png"
              aria-label="Alur kreator CARPAIGN dari dashboard sampai pengajuan kampanye"
              className="h-full w-full object-contain"
              autoPlay={!reduceMotion}
              controls={Boolean(reduceMotion)}
              muted
              loop
              playsInline
              preload="metadata"
              onTimeUpdate={updateChapter}
            />
          </div>
        </motion.div>
        <p className="mt-5 text-center text-sm text-[#AEB4B7]">
          Dari dashboard kreator hingga pengajuan kampanye
        </p>
        <nav aria-label="Tahap cuplikan kreator" className="mx-auto mt-5 grid w-full max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.label}
              type="button"
              onClick={() => jumpToChapter(index)}
              aria-pressed={activeChapter === index}
              className={`flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] sm:px-3 sm:text-[13px] ${
                activeChapter === index
                  ? "border-[#D4AF37]/70 bg-[#D4AF37]/10 text-[#F1D772]"
                  : "border-white/10 bg-white/[0.03] text-[#B9BFC1] hover:border-white/25 hover:bg-white/[0.06]"
              }`}
            >
              <span className="font-mono text-[10px] opacity-65">{String(index + 1).padStart(2, "0")}</span>
              {chapter.label}
            </button>
          ))}
        </nav>
      </div>

    </section>
  );
}
