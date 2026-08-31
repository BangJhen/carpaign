"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

export function DemoVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // In a real implementation, you would attach a ref to the <video> element
  // and call videoRef.current.play() or .pause(). For this demo, we mock the UI.

  return (
    <section className="relative py-12 px-6 overflow-hidden">
      {/* Background glow behind the video player */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%)",
        }}
      />

      <div ref={sectionRef} className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative rounded-2xl overflow-hidden group cursor-pointer"
          style={{
            background: "#0d0f12",
            border: "1px solid rgba(212,175,55,0.15)",
            boxShadow: "0 20px 60px -10px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.05)",
          }}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {/* Aspect ratio container (16:9) */}
          <div className="relative aspect-video w-full bg-[#111316]">
            {/* 
              TODO: Replace this Image with a real <video> tag once you have the recording.
              Example:
              <video 
                src="/demo-video.mp4" 
                poster="/video-poster.jpg"
                className="w-full h-full object-cover"
                playsInline
                muted={isMuted}
                autoPlay={isPlaying}
                loop
              />
            */}
            
            <Image
              src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1600"
              alt="Dashboard Demo Placeholder"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Dark overlay when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 transition-colors duration-300" />
            )}

            {/* Big central Play button (hides when playing) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "rgba(212, 175, 55, 0.9)",
                    boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Play size={32} className="text-[#111316] ml-2" fill="currentColor" />
                </div>
              </div>
            )}

            {/* Glassmorphism Controls Bar */}
            <div
              className={`absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3 flex items-center justify-between transition-opacity duration-300 ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
              style={{
                background: "rgba(21, 24, 28, 0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(245, 245, 233, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()} // Prevent toggling play when interacting with controls
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-[#D4AF37] transition-colors"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-[#D4AF37] transition-colors"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="text-[11px] font-mono text-white/50">
                  00:00 / 01:24
                </div>
              </div>
              
              {/* Fake progress bar */}
              <div className="hidden sm:block flex-1 mx-6 relative h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group/bar">
                <div 
                  className="absolute top-0 left-0 bottom-0 w-1/3 rounded-full transition-colors group-hover/bar:bg-[#F0D060]"
                  style={{ background: "#D4AF37" }}
                />
              </div>

              <button className="text-white hover:text-[#D4AF37] transition-colors">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Helper text below video */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-4 text-xs font-mono tracking-wider uppercase"
          style={{ color: "rgba(245, 245, 233, 0.4)" }}
        >
          Lihat cara kerja Carpaign dari awal hingga submit campaign
        </motion.p>
      </div>
    </section>
  );
}
