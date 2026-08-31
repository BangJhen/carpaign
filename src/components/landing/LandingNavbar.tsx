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
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Glassmorphism BG */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(17, 19, 22, 0.85)"
            : "rgba(17, 19, 22, 0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          borderBottom: scrolled
            ? "1px solid rgba(212, 175, 55, 0.08)"
            : "1px solid transparent",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/Carpaign Logo.png"
            alt="Carpaign"
            width={140}
            height={40}
            className="object-contain h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 px-3 py-2"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="relative text-sm font-semibold text-[#111316] px-5 py-2 rounded-lg overflow-hidden group transition-transform duration-150 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
              boxShadow: "0 0 20px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <span className="relative z-10">Mulai Sekarang</span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(17, 19, 22, 0.95)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(212,175,55,0.1)",
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-white/70 py-2 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  className="text-sm text-center text-white/60 py-2 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-center text-[#111316] py-2.5 rounded-lg"
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
  );
}
