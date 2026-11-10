"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

type Role = "dealer" | "kreator";
type Step = {
  label: string;
  title: string;
  description: string;
  video: string;
  poster: string;
  start?: number;
  end?: number;
};

const creatorVideo = "/creator-guided-campaign-demo.mp4";
const creatorPoster = "/creator-guided-campaign-poster.png";

const journeys: Record<Role, Step[]> = {
  dealer: [
    { label: "Masukkan unit", title: "Kendaraan masuk ke inventaris.", description: "Dealer menyiapkan unit yang akan ditawarkan kepada kreator.", video: "/landing-flow/dealer-inventory.mp4", poster: "/landing-flow/dealer-inventory-poster.jpg" },
    { label: "Susun kampanye", title: "Arahan konten mulai terbentuk.", description: "Dealer memilih jenis kampanye dan menjelaskan kebutuhan kontennya.", video: "/landing-flow/dealer-create.mp4", poster: "/landing-flow/dealer-create-poster.jpg" },
    { label: "Terima pengajuan", title: "Karya kreator masuk untuk ditinjau.", description: "Pengajuan dan hasil konten dapat diperiksa di satu tempat.", video: "/landing-flow/dealer-submissions.mp4", poster: "/landing-flow/dealer-submissions-poster.jpg" },
    { label: "Pantau aktivitas", title: "Seluruh aktivitas terlihat bersama.", description: "Dashboard merangkum unit, kampanye, dan pengajuan yang berjalan.", video: "/landing-flow/dealer-dashboard.mp4", poster: "/landing-flow/dealer-dashboard-poster.jpg" },
  ],
  kreator: [
    { label: "Mulai", title: "Masuk ke ruang kerja kreator.", description: "Panduan awal mengantar kreator menuju kampanye yang tersedia.", video: creatorVideo, poster: creatorPoster, start: 0, end: 3.14 },
    { label: "Cari kampanye", title: "Pilih kendaraan yang ingin dibuatkan konten.", description: "Kreator menjelajahi pilihan kampanye dari dealer.", video: creatorVideo, poster: creatorPoster, start: 3.14, end: 5.74 },
    { label: "Baca panduan", title: "Pahami pekerjaan sebelum mengajukan diri.", description: "Rincian kampanye membantu kreator menyiapkan pengajuan.", video: creatorVideo, poster: creatorPoster, start: 5.74, end: 15.5 },
    { label: "Kirim pengajuan", title: "Ajukan diri melalui kampanye.", description: "Kreator mengikuti langkah pengajuan dari halaman kampanye.", video: creatorVideo, poster: creatorPoster, start: 15.5, end: 20.16 },
  ],
};

export function FeaturesSection() {
  const [role, setRole] = useState<Role>("dealer");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const steps = journeys[role];
  const step = steps[stepIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!inView || !playing || reduceMotion) {
      video.pause();
      return;
    }
    void video.play().catch(() => {});
  }, [inView, playing, reduceMotion, role, stepIndex]);

  const nextStep = () => setStepIndex((index) => (index + 1) % steps.length);

  const handleReady = (video: HTMLVideoElement) => {
    if (step.start !== undefined) video.currentTime = step.start;
    else if (inView && playing && !reduceMotion) void video.play().catch(() => {});
  };

  const handleSeeked = (video: HTMLVideoElement) => {
    if (inView && playing && !reduceMotion) void video.play().catch(() => {});
  };

  const handleTimeUpdate = (video: HTMLVideoElement) => {
    if (!reduceMotion && playing && step.end !== undefined && video.currentTime >= step.end - 0.08) nextStep();
  };

  return (
    <section ref={sectionRef} aria-labelledby="ecosystem-title" className="bg-[#101214] px-5 py-24 text-[#F5F5E9] sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:mb-14 lg:flex-row lg:items-end">
          <div>
            <h2 id="ecosystem-title" className="max-w-[900px] text-[clamp(2.5rem,5.3vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.055em]">
              Dari unit kendaraan<br />menjadi konten.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#A7AAAB]">Lihat bagaimana dealer dan kreator bekerja di CARPAIGN.</p>
          </div>
          <div role="group" aria-label="Pilih alur" className="flex shrink-0 gap-7 self-start lg:self-auto">
            {(["dealer", "kreator"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={role === item}
                onClick={() => { setRole(item); setStepIndex(0); }}
                className={`text-base font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${role === item ? "text-white" : "text-[#72787B] hover:text-[#D8DADB]"}`}
              >
                {item === "dealer" ? "Dealer" : "Kreator"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.65fr)] lg:gap-14">
          <div className="relative min-w-0 aspect-video overflow-hidden bg-[#080A0B]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.video
                ref={videoRef}
                key={`${role}-${stepIndex}`}
                src={step.video}
                poster={step.poster}
                aria-label={`Rekaman CARPAIGN: ${step.label}`}
                muted
                playsInline
                preload="auto"
                controls={Boolean(reduceMotion)}
                className="absolute inset-0 h-full w-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: [0.23, 1, 0.32, 1] }}
                onLoadedMetadata={(event) => handleReady(event.currentTarget)}
                onSeeked={(event) => handleSeeked(event.currentTarget)}
                onTimeUpdate={(event) => handleTimeUpdate(event.currentTarget)}
                onEnded={() => { if (!reduceMotion && playing) nextStep(); }}
              />
            </AnimatePresence>
          </div>

          <div aria-live="polite" aria-atomic="true" className="min-w-0">
            <span className="block text-sm tabular-nums text-[#858B8E]">{String(stepIndex + 1).padStart(2, "0")} / 04</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${role}-${stepIndex}-text`}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-12px)" }}
                transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <h3 className="mt-5 text-[clamp(1.9rem,3vw,3.3rem)] font-semibold leading-[1.1] tracking-[-0.045em]">{step.title}</h3>
                <p className="mt-5 max-w-md text-base leading-7 text-[#A7AAAB]">{step.description}</p>
              </motion.div>
            </AnimatePresence>
            {!reduceMotion && (
              <button type="button" onClick={() => setPlaying((value) => !value)} className="mt-8 text-sm text-[#D4D7D8] underline decoration-[#73797C] underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {playing ? "Jeda tutorial" : "Putar tutorial"}
              </button>
            )}
          </div>
        </div>

        <nav aria-label={`Tahapan ${role}`} className="mt-10 overflow-x-auto border-t border-white/15 pt-5 lg:mt-12">
          <div className="grid min-w-[660px] grid-cols-4 gap-5 sm:min-w-0 sm:gap-8">
            {steps.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-current={stepIndex === index ? "step" : undefined}
                onClick={() => setStepIndex(index)}
                className={`flex min-w-0 items-baseline gap-3 whitespace-nowrap text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${stepIndex === index ? "text-white" : "text-[#777D80] hover:text-[#D8DADB]"}`}
              >
                <span className="text-xs tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium sm:text-base">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
