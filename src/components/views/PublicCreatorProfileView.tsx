"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, ExternalLink, Copy, Check, ArrowLeft, TrendingUp } from "lucide-react";
import { TikTokIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/social-icons";
import type { PublicCreatorProfile } from "@/app/actions/publicCreator";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const TIER_LABEL: Record<number, string> = {
  1: "Kreator",
  2: "Kreator Pro",
  3: "Kreator Elite",
};

const SOCIAL_PLATFORMS = [
  {
    key: "tiktokUsername" as const,
    label: "TikTok",
    icon: TikTokIcon,
    buildUrl: (u: string) => `https://tiktok.com/@${u.replace(/^@/, "")}`,
    color: "#69C9D0",
  },
  {
    key: "instagramUsername" as const,
    label: "Instagram",
    icon: InstagramIcon,
    buildUrl: (u: string) => `https://instagram.com/${u.replace(/^@/, "")}`,
    color: "#E1306C",
  },
  {
    key: "youtubeUsername" as const,
    label: "YouTube",
    icon: YouTubeIcon,
    buildUrl: (u: string) => u.startsWith("http") ? u : `https://youtube.com/@${u.replace(/^@/, "")}`,
    color: "#FF0000",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const lineReveal = {
  hidden: { scaleX: 0, originX: "0%" },
  show: {
    scaleX: 1,
    originX: "0%",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.3 },
  },
};

function getInitials(name?: string | null) {
  if (!name) return "K";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

function formatJoinDate(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

const MOCK_PERFORMANCE_DATA = [
  { month: "Jan", views: 45000, engagement: 4200 },
  { month: "Feb", views: 52000, engagement: 5100 },
  { month: "Mar", views: 48000, engagement: 4800 },
  { month: "Apr", views: 71000, engagement: 7400 },
  { month: "Mei", views: 89000, engagement: 9200 },
  { month: "Jun", views: 112000, engagement: 12500 },
];

interface Props {
  profile: PublicCreatorProfile;
  ref: string;
}

export function PublicCreatorProfileView({ profile, ref }: Props) {
  const [copied, setCopied] = useState(false);

  const shortlink =
    typeof window !== "undefined"
      ? `${window.location.origin}/c/${profile.referralCode}`
      : `/c/${profile.referralCode}`;

  const handleCopy = () => {
    const url = `${window.location.origin}/c/${profile.referralCode}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    toast.success("Link profil disalin");
    setTimeout(() => setCopied(false), 2500);
  };

  const connectedSocials = SOCIAL_PLATFORMS.filter(
    (p) => !!profile[p.key]
  );

  const tierLabel = TIER_LABEL[profile.tier ?? 1] ?? "Kreator";

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white selection:bg-[#D4AF37]/30">
      {/* Back nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Carpaign</span>
        </Link>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors bg-[#D4AF37]/8 hover:bg-[#D4AF37]/15 border border-[#D4AF37]/20 px-3 py-1.5 rounded-full"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span>{copied ? "Disalin" : "Salin Link"}</span>
        </button>
      </nav>

      {/* Hero — Cover + Identity */}
      <motion.div
        className="relative w-full"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        {/* Cover */}
        <div className="relative h-[44vh] min-h-[280px] max-h-[420px] w-full overflow-hidden">
          {profile.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.coverImage}
              alt="Sampul profil kreator"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1A1710] via-[#111111] to-[#0A0A0C]" />
          )}

          {/* Bottom gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/60 to-transparent" />

          {/* Gold shimmer line */}
          <motion.div
            variants={lineReveal}
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent"
          />
        </div>

        {/* Identity block — overlapping cover */}
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 -mt-16 pb-0 z-10">
          <motion.div variants={fadeUp} className="flex items-end gap-5">
            {/* Avatar */}
            <div className="size-28 sm:size-32 rounded-2xl flex-shrink-0 border-2 border-[#D4AF37]/30 bg-[#111316] overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.12)]">
              {profile.avatarImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarImage}
                  alt={profile.fullName ?? "Kreator"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#D4AF37]/60">
                  {getInitials(profile.fullName)}
                </div>
              )}
            </div>

            {/* Name + tier */}
            <div className="pb-2 space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-[#D4AF37] tracking-[0.15em] uppercase bg-[#D4AF37]/8 border border-[#D4AF37]/20 px-2.5 py-0.5 rounded-full">
                  {tierLabel}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                {profile.fullName ?? profile.username ?? "Kreator Carpaign"}
              </h1>
              {profile.username && profile.username !== profile.fullName && (
                <p className="text-sm text-white/40 font-mono">{profile.username}</p>
              )}
            </div>
          </motion.div>

          {/* Meta row */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-4 mt-4 text-xs text-white/40"
          >
            {profile.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-white/30" />
                {profile.city}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-white/30" />
              Bergabung {formatJoinDate(profile.joinedAt)}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 pb-28 space-y-10"
      >
        {/* Bio */}
        {profile.bio && (
          <motion.section variants={fadeUp}>
            <p className="text-sm leading-relaxed text-white/70 max-w-[52ch]">
              {profile.bio}
            </p>
          </motion.section>
        )}

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          className="h-[1px] bg-white/5"
        />

        {/* Performance Chart */}
        <motion.section variants={fadeUp} className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#D4AF37]" />
            <h2 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.18em]">
              Performa Konten (6 Bulan Terakhir)
            </h2>
          </div>
          
          <div className="h-[280px] w-full rounded-2xl bg-[#0f1114] border border-white/5 p-4 sm:p-6 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_PERFORMANCE_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#ffffff50", fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#111316", 
                    borderColor: "rgba(212,175,55,0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                  }}
                  itemStyle={{ color: "#D4AF37", fontSize: "12px", fontWeight: "bold" }}
                  labelStyle={{ color: "#ffffff50", fontSize: "11px", marginBottom: "4px" }}
                  formatter={(value: any) => [`${Number(value).toLocaleString("id-ID")} Views`, "Reach"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#D4AF37" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          className="h-[1px] bg-white/5"
        />

        {/* Social platforms */}
        {connectedSocials.length > 0 && (
          <motion.section variants={fadeUp} className="space-y-4">
            <h2 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.18em]">
              Platform Konten
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {connectedSocials.map((platform) => {
                const handle = profile[platform.key] as string;
                const url = platform.buildUrl(handle);
                return (
                  <motion.a
                    key={platform.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeUp}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <div
                      className="size-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5 overflow-hidden"
                      style={{ boxShadow: `0 0 20px ${platform.color}20`, color: platform.color }}
                    >
                      <platform.icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white/60 group-hover:text-white/80 transition-colors">
                        {platform.label}
                      </p>
                      <p className="text-sm font-bold text-white truncate">
                        {handle.startsWith("http") ? handle.split("/").pop() : handle}
                      </p>
                    </div>
                    <ExternalLink className="size-3.5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                  </motion.a>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Divider */}
        {connectedSocials.length > 0 && (
          <motion.div variants={fadeUp} className="h-[1px] bg-white/5" />
        )}

        {/* CTA — invite dealer to work with creator */}
        <motion.section variants={fadeUp}>
          <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] p-6 sm:p-8">
            {/* Glow */}
            <div className="absolute top-0 left-[10%] right-[10%] h-[80px] bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

            <div className="relative space-y-3">
              <h2 className="text-base font-bold text-white">
                Ingin berkolaborasi?
              </h2>
              <p className="text-sm text-white/50 leading-relaxed max-w-[44ch]">
                Kreator ini tersedia untuk kampanye konten otomotif melalui platform Carpaign. Daftarkan diri sebagai dealer untuk mulai bekerja sama.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-[#D4AF37] hover:text-white bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 px-5 py-2.5 rounded-xl transition-all duration-200"
              >
                Mulai Berkolaborasi
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center py-4 bg-gradient-to-t from-[#0A0A0C] to-transparent pointer-events-none">
        <span className="text-[11px] text-white/20 font-medium tracking-wide">
          Carpaign — Platform Kreator Otomotif Indonesia
        </span>
      </div>
    </div>
  );
}
