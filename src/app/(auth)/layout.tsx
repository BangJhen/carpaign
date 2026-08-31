"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden" style={{ background: "#0d0f12" }}>
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Background"
          fill
          priority
          className="object-cover object-center opacity-30 brightness-50 contrast-125"
        />
        {/* Layered dark gradient to improve readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,15,18,0.75) 0%, rgba(13,15,18,0.55) 50%, rgba(13,15,18,0.80) 100%)",
          }}
        />
        {/* Subtle gold glow center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)",
          }}
        />
        {/* Film grain overlay */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')",
          }}
        />
      </div>

      {/* Logo — top left */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/carpaign-logo.png"
            alt="Carpaign"
            width={120}
            height={30}
            className="object-contain h-7 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        </Link>
      </div>

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md px-4 py-8"
      >
        {children}
      </motion.div>
    </div>
  );
}
