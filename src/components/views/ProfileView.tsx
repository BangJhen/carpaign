"use client";

import { useState, useRef, useTransition } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  User,
  Link as LinkIcon,
  MapPin,
  Mail,
  Phone,
  Wallet,
  Check,
  Loader2,
  Film,
  ShieldCheck,
  Copy,
  ExternalLink,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { compressImage } from "@/lib/image-compression";
import { updateCreatorProfile } from "@/app/actions/creatorProfile";
import { TikTokIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/social-icons";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export type CreatorProfileData = {
  fullName: string | null;
  username: string | null;
  phone: string | null;
  city: string | null;
  bio: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolderName: string | null;
  tiktokUsername: string | null;
  instagramUsername: string | null;
  youtubeUsername: string | null;
  avatarImage?: string | null;
  coverImage?: string | null;
  referralCode?: string | null;
};

export interface SocialValidationResult {
  isValid: boolean;
  normalizedUrl: string | null;
  errorMsg: string;
}

export function validateTikTok(input?: string | null): SocialValidationResult {
  if (!input || !input.trim()) return { isValid: false, normalizedUrl: null, errorMsg: "" };
  const val = input.trim();

  if (val.includes("tiktok.com")) {
    const match = val.match(/^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9_.]+)(?:\/.*)?$/i);
    if (match && match[1] && match[1].length >= 2 && match[1].length <= 24) {
      return { isValid: true, normalizedUrl: `https://www.tiktok.com/@${match[1]}`, errorMsg: "" };
    }
    return {
      isValid: false,
      normalizedUrl: null,
      errorMsg: "Format link TikTok tidak valid (contoh: https://tiktok.com/@username)",
    };
  }

  // Handle format @username or username
  const cleanHandle = val.replace(/^@/, "");
  if (/^[a-zA-Z0-9_.]+$/.test(cleanHandle) && cleanHandle.length >= 2 && cleanHandle.length <= 24 && !val.includes(" ") && !val.includes("http")) {
    return { isValid: true, normalizedUrl: `https://www.tiktok.com/@${cleanHandle}`, errorMsg: "" };
  }

  return {
    isValid: false,
    normalizedUrl: null,
    errorMsg: "Username TikTok tidak valid (2-24 karakter: huruf, angka, titik, garis bawah)",
  };
}

export function validateInstagram(input?: string | null): SocialValidationResult {
  if (!input || !input.trim()) return { isValid: false, normalizedUrl: null, errorMsg: "" };
  const val = input.trim();

  if (val.includes("instagram.com")) {
    const match = val.match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)(?:\/.*)?$/i);
    if (match && match[1] && match[1].length >= 1 && match[1].length <= 30) {
      return { isValid: true, normalizedUrl: `https://www.instagram.com/${match[1]}`, errorMsg: "" };
    }
    return {
      isValid: false,
      normalizedUrl: null,
      errorMsg: "Format link Instagram tidak valid (contoh: https://instagram.com/username)",
    };
  }

  // Handle format @username or username
  const cleanHandle = val.replace(/^@/, "");
  if (/^[a-zA-Z0-9_.]+$/.test(cleanHandle) && cleanHandle.length >= 1 && cleanHandle.length <= 30 && !val.includes(" ") && !val.includes("http")) {
    return { isValid: true, normalizedUrl: `https://www.instagram.com/${cleanHandle}`, errorMsg: "" };
  }

  return {
    isValid: false,
    normalizedUrl: null,
    errorMsg: "Username Instagram tidak valid (1-30 karakter: huruf, angka, titik, garis bawah)",
  };
}

export function validateYouTube(input?: string | null): SocialValidationResult {
  if (!input || !input.trim()) return { isValid: false, normalizedUrl: null, errorMsg: "" };
  const val = input.trim();

  if (val.includes("youtube.com") || val.includes("youtu.be")) {
    // Channel handle: youtube.com/@channel
    const matchHandle = val.match(/^(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_.-]+)(?:\/.*)?$/i);
    if (matchHandle && matchHandle[1] && matchHandle[1].length >= 3) {
      return { isValid: true, normalizedUrl: `https://www.youtube.com/@${matchHandle[1]}`, errorMsg: "" };
    }

    // Custom or Channel ID: youtube.com/c/name, youtube.com/channel/id, youtube.com/user/id
    const matchCustom = val.match(/^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(c\/|channel\/|user\/)([a-zA-Z0-9_.-]+)(?:\/.*)?$/i);
    if (matchCustom && matchCustom[2] && matchCustom[2].length >= 3) {
      return { isValid: true, normalizedUrl: `https://www.youtube.com/${matchCustom[1]}${matchCustom[2]}`, errorMsg: "" };
    }

    return {
      isValid: false,
      normalizedUrl: null,
      errorMsg: "Format link YouTube tidak valid (contoh: https://youtube.com/@channel)",
    };
  }

  // Handle format @channel or channel name
  const cleanHandle = val.replace(/^@/, "");
  if (/^[a-zA-Z0-9_.-]+$/.test(cleanHandle) && cleanHandle.length >= 3 && !val.includes(" ") && !val.includes("http")) {
    return { isValid: true, normalizedUrl: `https://www.youtube.com/@${cleanHandle}`, errorMsg: "" };
  }

  return {
    isValid: false,
    normalizedUrl: null,
    errorMsg: "Channel YouTube tidak valid (contoh: @channel atau link resmi YouTube)",
  };
}

export function ProfileView({
  initialProfile,
}: {
  initialProfile: CreatorProfileData | null;
}) {
  const { data: session } = useSession();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: initialProfile?.fullName || session?.user?.name || "",
    username:
      initialProfile?.username ||
      (session?.user?.email ? `@${session.user.email.split("@")[0]}` : "@kreator"),
    phone: initialProfile?.phone || "",
    city: initialProfile?.city || "Jakarta Selatan, Indonesia",
    bio:
      initialProfile?.bio ||
      "Kreator otomotif berfokus pada ulasan mobil, sinematografi, dan konten digital.",
    bankName: initialProfile?.bankName || "BCA",
    accountNumber: initialProfile?.accountNumber || "",
    accountHolderName:
      initialProfile?.accountHolderName || initialProfile?.fullName || session?.user?.name || "",
    tiktokUsername: initialProfile?.tiktokUsername || "",
    instagramUsername: initialProfile?.instagramUsername || "",
    youtubeUsername: initialProfile?.youtubeUsername || "",
    avatarImage: initialProfile?.avatarImage || (session?.user as any)?.image || "",
    coverImage: initialProfile?.coverImage || (session?.user as any)?.coverImage || "",
    referralCode: initialProfile?.referralCode || "",
  });

  const referralCode = form.referralCode || initialProfile?.referralCode || "";
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${referralCode}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const [isPending, startTransition] = useTransition();

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Mengoptimalkan foto sampul...", { id: "upload-cover" });
      const base64 = await compressImage(file, 1280, 720, 0.8);
      setForm((prev) => ({ ...prev, coverImage: base64 }));
      
      startTransition(async () => {
        try {
          await updateCreatorProfile({ coverImage: base64 });
          toast.success("Foto sampul berhasil diperbarui dan disimpan", { id: "upload-cover" });
        } catch {
          toast.error("Gagal menyimpan foto sampul ke database", { id: "upload-cover" });
        }
      });
    } catch {
      toast.error("Gagal memproses gambar sampul", { id: "upload-cover" });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Mengoptimalkan foto profil...", { id: "upload-avatar" });
      const base64 = await compressImage(file, 400, 400, 0.85);
      setForm((prev) => ({ ...prev, avatarImage: base64 }));

      startTransition(async () => {
        try {
          await updateCreatorProfile({ avatarImage: base64 });
          toast.success("Foto profil berhasil diperbarui dan disimpan", { id: "upload-avatar" });
        } catch {
          toast.error("Gagal menyimpan foto profil ke database", { id: "upload-avatar" });
        }
      });
    } catch {
      toast.error("Gagal memproses gambar profil", { id: "upload-avatar" });
    }
  };

  const handleSaveAll = (sectionName = "Profil") => {
    if (!form.fullName.trim()) {
      toast.error("Nama lengkap wajib diisi");
      return;
    }

    // Validate social media formats if filled
    if (form.tiktokUsername?.trim()) {
      const tiktokRes = validateTikTok(form.tiktokUsername);
      if (!tiktokRes.isValid) {
        toast.error("Format TikTok tidak valid", { description: tiktokRes.errorMsg });
        return;
      }
    }

    if (form.instagramUsername?.trim()) {
      const igRes = validateInstagram(form.instagramUsername);
      if (!igRes.isValid) {
        toast.error("Format Instagram tidak valid", { description: igRes.errorMsg });
        return;
      }
    }

    if (form.youtubeUsername?.trim()) {
      const ytRes = validateYouTube(form.youtubeUsername);
      if (!ytRes.isValid) {
        toast.error("Format YouTube tidak valid", { description: ytRes.errorMsg });
        return;
      }
    }

    startTransition(async () => {
      try {
        await updateCreatorProfile({
          fullName: form.fullName,
          username: form.username,
          phone: form.phone,
          city: form.city,
          bio: form.bio,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          accountHolderName: form.accountHolderName,
          tiktokUsername: form.tiktokUsername,
          instagramUsername: form.instagramUsername,
          youtubeUsername: form.youtubeUsername,
          avatarImage: form.avatarImage,
          coverImage: form.coverImage,
          referralCode: form.referralCode,
        });

        toast.success(`${sectionName} berhasil disimpan`, {
          description: "Data profil kreator Anda telah diperbarui secara permanen di sistem.",
        });
      } catch (err: any) {
        toast.error("Gagal menyimpan profil", {
          description: err?.message || "Terjadi kendala saat menyimpan perubahan.",
        });
      }
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "K";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const userEmail = session?.user?.email || "kreator@carpaign.id";
  const userTier = (session?.user as any)?.tier || 1;

  // Real-time social validations
  const tiktokValidation = validateTikTok(form.tiktokUsername);
  const instagramValidation = validateInstagram(form.instagramUsername);
  const youtubeValidation = validateYouTube(form.youtubeUsername);

  return (
    <div className="flex flex-col gap-8 max-w-[1020px] mx-auto w-full pb-20">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={coverInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleCoverUpload}
      />
      <input
        type="file"
        ref={avatarInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleAvatarUpload}
      />

      {/* Header Visual Card */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <Card className="bg-[#111316] border border-white/10 overflow-hidden relative rounded-3xl shadow-none">
          {/* Cover Photo */}
          <div
            onClick={() => coverInputRef.current?.click()}
            className="h-44 sm:h-60 w-full bg-gradient-to-br from-[#1C180E] via-[#121418] to-[#0B0C0E] relative group cursor-pointer overflow-hidden border-b border-white/5"
          >
            {form.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.coverImage}
                alt="Cover Profil"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 text-white/40 group-hover:text-primary transition-colors">
                <div className="size-11 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/10 flex items-center justify-center transition-all">
                  <Camera className="size-5" />
                </div>
                <p className="text-xs font-semibold tracking-wide">Klik untuk menambahkan foto sampul</p>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs">
              <Camera className="size-4 text-primary" />
              <span className="text-xs font-bold text-white">Ganti Foto Sampul</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#111316] via-[#111316]/60 to-transparent pointer-events-none" />
          </div>

          <CardContent className="p-6 sm:p-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-14 sm:-mt-18">
              <div className="flex items-end gap-5">
                {/* Avatar with Gold Obsidian Frame */}
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="size-24 sm:size-28 rounded-2xl flex items-center justify-center border-2 border-[#D4AF37]/35 bg-gradient-to-br from-[#1C180E] via-[#14161A] to-[#0E1013] relative group cursor-pointer shrink-0 overflow-hidden"
                >
                  {form.avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.avatarImage}
                      alt="Avatar Kreator"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-black text-primary font-mono select-none tracking-wider">
                      {getInitials(form.fullName)}
                    </span>
                  )}

                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/70">
                    <Camera className="size-5 text-primary" />
                  </div>
                </div>

                <div className="pb-1.5 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                      {form.fullName || "Nama Kreator"}
                    </h1>
                  </div>

                  <p className="text-xs text-white/60 flex items-center gap-1.5 font-medium">
                    <MapPin className="size-3.5 text-primary/70" />
                    <span>{form.city || "Lokasi belum diatur"}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-stretch sm:self-end">
                {/* Portfolio Modal Dialog */}
                <Dialog>
                  <DialogTrigger className="inline-flex h-10 items-center justify-center rounded-xl bg-[#16181D] border border-white/10 hover:border-primary/40 hover:bg-[#1A1E24] px-4 text-xs font-semibold text-white hover:text-primary transition-all gap-2 cursor-pointer shrink-0">
                    <Film className="size-3.5 text-primary/80" />
                    <span>Lihat Portofolio</span>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111316] border-white/10 text-white max-w-2xl rounded-2xl shadow-none">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold flex items-center gap-2 text-white">
                        <Film className="size-4 text-primary" />
                        <span>Portofolio Konten Kreator</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 mt-3">
                      {[
                        { title: "Review BMW M4 Competition", views: "142K Views" },
                        { title: "Cinematic Reel Porsche 911", views: "98K Views" },
                        { title: "Shorts Toyota GR Yaris", views: "65K Views" },
                        { title: "Showroom Walkthrough Mercedes", views: "83K Views" },
                        { title: "Highlights Honda Civic Type R", views: "52K Views" },
                        { title: "Audio Exhaust Sound Compilation", views: "115K Views" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="aspect-[9/16] rounded-xl bg-[#16181C] border border-white/10 relative overflow-hidden group cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                          <div className="w-full h-full bg-[#181A1F] flex items-center justify-center text-xs text-white/40 font-medium">
                            Unit Video {i + 1}
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 z-20 space-y-0.5">
                            <p className="text-[11px] font-bold text-white truncate group-hover:text-primary transition-colors">
                              {item.title}
                            </p>
                            <span className="text-[10px] text-primary font-mono font-semibold">
                              {item.views}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  type="button"
                  onClick={() => handleSaveAll("Profil")}
                  disabled={isPending}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-primary text-black hover:bg-primary/90 transition-all gap-2 cursor-pointer shrink-0 shadow-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin text-black" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5 stroke-[2.5]" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Personal Info & Payout Accounts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Personal Info Card */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
            <Card className="bg-[#111316] border border-white/10 p-6 sm:p-8 rounded-3xl space-y-6 shadow-none">
              <div className="border-b border-white/5 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                    <User className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Informasi Pribadi & Kreator
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      Data identitas resmi yang tercatat untuk kontrak kerja sama dengan dealer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/80">
                      Nama Lengkap
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-primary transition-colors" />
                      <Input
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Contoh: Rian Pratama"
                        className="pl-10 bg-[#16181C] border-white/10 hover:border-white/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 text-xs text-white rounded-xl h-11 transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/80">
                      Username Publik
                    </label>
                    <Input
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="@username"
                      className="bg-[#16181C] border-white/10 hover:border-white/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 text-xs text-white rounded-xl h-11 transition-all placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/80">
                      Email Akun
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                      <Input
                        value={userEmail}
                        disabled
                        className="pl-10 bg-[#0E1013] border-white/5 text-xs text-white/40 rounded-xl h-11 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/80">
                      Nomor WhatsApp
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-primary transition-colors" />
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+62 812 3456 7890"
                        className="pl-10 bg-[#16181C] border-white/10 hover:border-white/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 text-xs text-white rounded-xl h-11 transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-white/80">
                      Custom Shortlink Bio (Kode Profil Kreator)
                    </label>
                    {referralCode && (
                      <span className="text-[11px] text-primary font-medium">
                        Wajib ditaruh di bio medsos
                      </span>
                    )}
                  </div>

                  <div className="flex items-center rounded-xl bg-[#16181C] border border-white/10 hover:border-white/20 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30 overflow-hidden h-11 transition-all">
                    <span className="px-3.5 text-xs font-mono text-white/40 bg-white/[0.02] border-r border-white/5 h-full flex items-center shrink-0 select-none">
                      carpaign.id/
                    </span>
                    <input
                      value={form.referralCode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          referralCode: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                        })
                      }
                      placeholder="nama-kreator"
                      className="w-full bg-transparent px-3 text-xs text-white outline-none placeholder:text-white/30 font-mono"
                    />

                    {/* Direct clickable action buttons inside the input */}
                    <div className="flex items-center gap-1 pr-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        title="Salin link bio"
                        className={`inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                          linkCopied
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                        }`}
                      >
                        {linkCopied ? (
                          <Check className="size-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        <span className="hidden sm:inline">{linkCopied ? "Disalin" : "Salin"}</span>
                      </button>

                      <a
                        href={`/${referralCode || form.referralCode || "creators"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buka halaman profil publik"
                        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-semibold bg-primary text-black hover:bg-primary/90 transition-colors shadow-none"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Buka</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-1 text-[11px] mt-1">
                    <p className="text-white/40">
                      Gunakan huruf kecil, angka, dan strip (-) tanpa spasi.
                    </p>
                    {(referralCode || form.referralCode) && (
                      <a
                        href={`/${referralCode || form.referralCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-mono inline-flex items-center gap-1"
                      >
                        <span>{typeof window !== "undefined" ? `${window.location.origin}/${referralCode || form.referralCode}` : `carpaign.id/${referralCode || form.referralCode}`}</span>
                        <ExternalLink className="size-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80">
                    Domisili atau Wilayah Operasional
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-primary transition-colors" />
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                      className="pl-10 bg-[#16181C] border-white/10 hover:border-white/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 text-xs text-white rounded-xl h-11 transition-all placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80">
                    Bio Singkat
                  </label>
                  <Textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    placeholder="Tuliskan spesialisasi konten Anda (misal: Video Reel Otomotif, Fotografi Showroom, dsb)..."
                    className="w-full p-3.5 bg-[#16181C] border-white/10 hover:border-white/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 text-xs text-white rounded-xl resize-none leading-relaxed transition-all placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => handleSaveAll("Informasi Pribadi")}
                  disabled={isPending}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-primary text-black hover:bg-primary/90 transition-all gap-2 cursor-pointer shadow-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin text-black" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5 stroke-[2.5]" />
                      <span>Simpan Informasi Pribadi</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Payout Bank Account Card */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
            <Card className="bg-[#111316] border border-white/10 p-6 sm:p-8 rounded-3xl space-y-6 shadow-none">
              <div className="border-b border-white/5 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                    <Wallet className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Rekening Pencairan Penghasilan (Withdrawal)
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      Rekening tujuan transfer reward setiap kali Anda mencairkan saldo kampanye.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/80">
                      Bank atau Dompet Digital (E-Wallet)
                    </label>
                    <Select
                      value={form.bankName}
                      onValueChange={(val) => setForm({ ...form, bankName: val })}
                    >
                      <SelectTrigger className="bg-[#16181C] border-white/10 hover:border-white/20 text-xs text-white rounded-xl h-11 focus:border-primary/60 transition-all font-medium">
                        <SelectValue placeholder={form.bankName || "BCA"} />
                      </SelectTrigger>
                      <SelectContent className="bg-[#14161A] border-white/10 text-white text-xs rounded-xl shadow-none">
                        <SelectItem value="BCA">BCA</SelectItem>
                        <SelectItem value="Mandiri">Mandiri</SelectItem>
                        <SelectItem value="BRI">BRI</SelectItem>
                        <SelectItem value="BNI">BNI</SelectItem>
                        <SelectItem value="CIMB Niaga">CIMB Niaga</SelectItem>
                        <SelectItem value="BSI">BSI</SelectItem>
                        <SelectItem value="GoPay">GoPay</SelectItem>
                        <SelectItem value="OVO">OVO</SelectItem>
                        <SelectItem value="DANA">DANA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/80">
                      Nomor Rekening atau Akun E-Wallet
                    </label>
                    <div className="relative group">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-primary transition-colors" />
                      <Input
                        value={form.accountNumber}
                        onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                        placeholder="Contoh: 1234567890"
                        className="pl-10 bg-[#16181C] border-white/10 hover:border-white/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 text-xs text-white rounded-xl h-11 transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80">
                    Nama Lengkap Pemilik Rekening
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-primary transition-colors" />
                    <Input
                      value={form.accountHolderName}
                      onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
                      placeholder="Nama harus sesuai dengan buku tabungan"
                      className="pl-10 bg-[#16181C] border-white/10 hover:border-white/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 text-xs text-white rounded-xl h-11 transition-all placeholder:text-white/30"
                    />
                  </div>
                  <p className="text-[11px] text-white/40 mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-primary/70 shrink-0" />
                    <span>Pastikan nama pemilik rekening sesuai untuk menghindari keterlambatan verifikasi transfer.</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => handleSaveAll("Rekening Pencairan")}
                  disabled={isPending}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-primary text-black hover:bg-primary/90 transition-all gap-2 cursor-pointer shadow-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin text-black" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5 stroke-[2.5]" />
                      <span>Simpan Rekening</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right 1 Column: Media Sosial Terhubung */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3}>
            <Card className="bg-[#111316] border border-white/10 p-5 sm:p-6 rounded-3xl space-y-6 shadow-none">
              <div className="border-b border-white/5 pb-4 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                  <LinkIcon className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Media Sosial Terhubung
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    Tautkan akun media sosial resmi Anda.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* TikTok */}
                <div className="p-4 rounded-2xl bg-[#15171B] border border-white/5 hover:border-white/10 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-black border border-white/15 flex items-center justify-center text-white shrink-0">
                        <TikTokIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">TikTok</p>
                        <p className="text-[10px] text-white/40">Akun video pendek</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        !form.tiktokUsername?.trim()
                          ? "text-white/40 bg-white/5 border border-white/5"
                          : tiktokValidation.isValid
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                      }`}
                    >
                      {!form.tiktokUsername?.trim()
                        ? "Belum diisi"
                        : tiktokValidation.isValid
                        ? "Tersambung"
                        : "Tidak Valid"}
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <Input
                      value={form.tiktokUsername}
                      onChange={(e) => setForm({ ...form, tiktokUsername: e.target.value })}
                      placeholder="@username_tiktok"
                      className={`bg-[#0E1013] text-xs rounded-xl h-10 pr-9 transition-all placeholder:text-white/30 ${
                        form.tiktokUsername?.trim() && !tiktokValidation.isValid
                          ? "border-rose-500/50 focus:border-rose-500 text-rose-100"
                          : "border-white/10 hover:border-white/20 focus:border-primary/50 text-white"
                      }`}
                    />
                    {form.tiktokUsername?.trim() && (
                      tiktokValidation.isValid ? (
                        <a
                          href={tiktokValidation.normalizedUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2 size-6 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                          title="Buka profil TikTok resmi"
                        >
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <div
                          className="absolute right-2 size-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 cursor-not-allowed"
                          title="Link tidak valid"
                        >
                          <AlertCircle className="size-3" />
                        </div>
                      )
                    )}
                  </div>
                  {form.tiktokUsername?.trim() && !tiktokValidation.isValid && (
                    <p className="text-[11px] text-rose-400 leading-tight">
                      {tiktokValidation.errorMsg}
                    </p>
                  )}
                </div>

                {/* Instagram */}
                <div className="p-4 rounded-2xl bg-[#15171B] border border-white/5 hover:border-white/10 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] flex items-center justify-center text-white shrink-0">
                        <InstagramIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Instagram</p>
                        <p className="text-[10px] text-white/40">Reels & Feed</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        !form.instagramUsername?.trim()
                          ? "text-white/40 bg-white/5 border border-white/5"
                          : instagramValidation.isValid
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                      }`}
                    >
                      {!form.instagramUsername?.trim()
                        ? "Belum diisi"
                        : instagramValidation.isValid
                        ? "Tersambung"
                        : "Tidak Valid"}
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <Input
                      value={form.instagramUsername}
                      onChange={(e) => setForm({ ...form, instagramUsername: e.target.value })}
                      placeholder="@username_ig"
                      className={`bg-[#0E1013] text-xs rounded-xl h-10 pr-9 transition-all placeholder:text-white/30 ${
                        form.instagramUsername?.trim() && !instagramValidation.isValid
                          ? "border-rose-500/50 focus:border-rose-500 text-rose-100"
                          : "border-white/10 hover:border-white/20 focus:border-primary/50 text-white"
                      }`}
                    />
                    {form.instagramUsername?.trim() && (
                      instagramValidation.isValid ? (
                        <a
                          href={instagramValidation.normalizedUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2 size-6 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                          title="Buka profil Instagram resmi"
                        >
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <div
                          className="absolute right-2 size-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 cursor-not-allowed"
                          title="Link tidak valid"
                        >
                          <AlertCircle className="size-3" />
                        </div>
                      )
                    )}
                  </div>
                  {form.instagramUsername?.trim() && !instagramValidation.isValid && (
                    <p className="text-[11px] text-rose-400 leading-tight">
                      {instagramValidation.errorMsg}
                    </p>
                  )}
                </div>

                {/* YouTube */}
                <div className="p-4 rounded-2xl bg-[#15171B] border border-white/5 hover:border-white/10 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white shrink-0">
                        <YouTubeIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">YouTube</p>
                        <p className="text-[10px] text-white/40">Longform & Shorts</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        !form.youtubeUsername?.trim()
                          ? "text-white/40 bg-white/5 border border-white/5"
                          : youtubeValidation.isValid
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                      }`}
                    >
                      {!form.youtubeUsername?.trim()
                        ? "Belum diisi"
                        : youtubeValidation.isValid
                        ? "Tersambung"
                        : "Tidak Valid"}
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <Input
                      value={form.youtubeUsername}
                      onChange={(e) => setForm({ ...form, youtubeUsername: e.target.value })}
                      placeholder="https://youtube.com/@channel"
                      className={`bg-[#0E1013] text-xs rounded-xl h-10 pr-9 transition-all placeholder:text-white/30 ${
                        form.youtubeUsername?.trim() && !youtubeValidation.isValid
                          ? "border-rose-500/50 focus:border-rose-500 text-rose-100"
                          : "border-white/10 hover:border-white/20 focus:border-primary/50 text-white"
                      }`}
                    />
                    {form.youtubeUsername?.trim() && (
                      youtubeValidation.isValid ? (
                        <a
                          href={youtubeValidation.normalizedUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2 size-6 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                          title="Buka channel YouTube resmi"
                        >
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <div
                          className="absolute right-2 size-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 cursor-not-allowed"
                          title="Link tidak valid"
                        >
                          <AlertCircle className="size-3" />
                        </div>
                      )
                    )}
                  </div>
                  {form.youtubeUsername?.trim() && !youtubeValidation.isValid && (
                    <p className="text-[11px] text-rose-400 leading-tight">
                      {youtubeValidation.errorMsg}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={() => handleSaveAll("Media Sosial")}
                  disabled={isPending}
                  className="w-full h-10 rounded-xl text-xs font-bold bg-primary text-black hover:bg-primary/90 transition-all gap-2 cursor-pointer shadow-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin text-black" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5 stroke-[2.5]" />
                      <span>Simpan Media Sosial</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
