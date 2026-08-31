"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Campaigns", href: "/campaigns" },
    { label: "Cara Kerja", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-6 pointer-events-none">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl rounded-full transition-all duration-500 flex items-center justify-between px-6 py-3 pointer-events-auto"
        style={{
          background: scrolled
            ? "rgba(17, 19, 22, 0.75)"
            : "rgba(17, 19, 22, 0.1)",
          backdropFilter: "blur(24px)",
          border: scrolled
            ? "1px solid rgba(212, 175, 55, 0.15)"
            : "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: scrolled
            ? "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "none",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/carpaign-logo.png"
            alt="Carpaign"
            width={120}
            height={32}
            className="object-contain h-6 w-auto"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium tracking-wide text-white/60 hover:text-[#D4AF37] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-[13px] font-medium text-white/70 hover:text-white transition-colors duration-200"
          >
            Log In
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <Link
            href="/dashboard"
            className="relative text-[13px] font-bold text-[#111316] px-5 py-2 rounded-full overflow-hidden group transition-transform duration-150 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
              boxShadow: "0 0 20px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <span className="relative z-10">Mulai</span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white/70 hover:text-white p-1 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu Dropdown (Nested to float under pill) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-4 md:hidden rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: "rgba(17, 19, 22, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(212,175,55,0.15)",
              }}
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-white/70 hover:text-white py-2 transition-colors border-b border-white/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-center text-white/70 py-2.5"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm font-bold text-center text-[#111316] py-2.5 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Mulai Sekarang
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.nav>
    </div>
  );
}
