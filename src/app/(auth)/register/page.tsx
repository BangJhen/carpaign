"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Car, Video } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

const EASE = [0.23, 1, 0.32, 1] as const;

type Role = "creator" | "dealership";

const roles: { key: Role; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    key: "creator",
    label: "Kreator",
    desc: "Saya membuat konten otomotif",
    icon: <Video size={16} />,
  },
  {
    key: "dealership",
    label: "Dealership",
    desc: "Saya ingin mempromosikan unit",
    icon: <Car size={16} />,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>("creator");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      role: role,
    });

    if (error) {
      toast.error(error.message || "Gagal membuat akun.");
      setLoading(false);
    } else {
      toast.success("Akun berhasil dibuat!");
      router.push("/dashboard");
    }
  };

  return (
    <div
      className="w-full rounded-[2rem] p-8 md:p-10"
      style={{
        background: "rgba(13, 15, 18, 0.7)",
        backdropFilter: "blur(28px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
          className="text-[10px] uppercase tracking-[0.3em] font-mono mb-3"
          style={{ color: "rgba(212, 175, 55, 0.6)" }}
        >
          Buat Akun Baru
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#F5F5E9" }}
        >
          Mulai dari sini.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
          className="text-sm mt-2"
          style={{ color: "rgba(245, 245, 233, 0.45)" }}
        >
          Gratis. Tidak ada komitmen. Pilih role Anda.
        </motion.p>
      </div>

      {/* Role Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
        className="grid grid-cols-2 gap-3 mb-7"
      >
        {roles.map((r) => {
          const isActive = role === r.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setRole(r.key)}
              className="relative flex flex-col gap-1.5 rounded-xl p-4 text-left transition-all duration-300"
              style={{
                background: isActive
                  ? "rgba(212, 175, 55, 0.08)"
                  : "rgba(245, 245, 233, 0.03)",
                border: isActive
                  ? "1px solid rgba(212, 175, 55, 0.35)"
                  : "1px solid rgba(245, 245, 233, 0.07)",
              }}
            >
              <div
                className="flex items-center gap-2 transition-colors duration-300"
                style={{ color: isActive ? "#D4AF37" : "rgba(245,245,233,0.4)" }}
              >
                {r.icon}
                <span className="text-xs font-bold uppercase tracking-widest font-mono">
                  {r.label}
                </span>
              </div>
              <p
                className="text-[11px] leading-relaxed transition-colors duration-300"
                style={{
                  color: isActive
                    ? "rgba(245,245,233,0.65)"
                    : "rgba(245,245,233,0.28)",
                }}
              >
                {r.desc}
              </p>
              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="role-active-dot"
                  className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full"
                  style={{ background: "#D4AF37" }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-name"
            className="block text-[10px] uppercase tracking-[0.2em] font-mono"
            style={{ color: "rgba(245, 245, 233, 0.4)" }}
          >
            Nama Lengkap
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama Anda"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-[rgba(245,245,233,0.2)]"
            style={{
              background: "rgba(245, 245, 233, 0.04)",
              border: "1px solid rgba(245, 245, 233, 0.08)",
              color: "#F5F5E9",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(212, 175, 55, 0.4)";
              e.target.style.background = "rgba(212, 175, 55, 0.03)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(245, 245, 233, 0.08)";
              e.target.style.background = "rgba(245, 245, 233, 0.04)";
            }}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-email"
            className="block text-[10px] uppercase tracking-[0.2em] font-mono"
            style={{ color: "rgba(245, 245, 233, 0.4)" }}
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="nama@email.com"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-[rgba(245,245,233,0.2)]"
            style={{
              background: "rgba(245, 245, 233, 0.04)",
              border: "1px solid rgba(245, 245, 233, 0.08)",
              color: "#F5F5E9",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(212, 175, 55, 0.4)";
              e.target.style.background = "rgba(212, 175, 55, 0.03)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(245, 245, 233, 0.08)";
              e.target.style.background = "rgba(245, 245, 233, 0.04)";
            }}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-password"
            className="block text-[10px] uppercase tracking-[0.2em] font-mono"
            style={{ color: "rgba(245, 245, 233, 0.4)" }}
          >
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 8 karakter"
              className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-[rgba(245,245,233,0.2)]"
              style={{
                background: "rgba(245, 245, 233, 0.04)",
                border: "1px solid rgba(245, 245, 233, 0.08)",
                color: "#F5F5E9",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(212, 175, 55, 0.4)";
                e.target.style.background = "rgba(212, 175, 55, 0.03)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(245, 245, 233, 0.08)";
                e.target.style.background = "rgba(245, 245, 233, 0.04)";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors duration-200"
              style={{ color: "rgba(245, 245, 233, 0.3)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(212, 175, 55, 0.8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(245, 245, 233, 0.3)";
              }}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* Password strength hint */}
          <AnimatePresence>
            {form.password.length > 0 && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="text-[10px] font-mono overflow-hidden"
                style={{
                  color:
                    form.password.length >= 8
                      ? "rgba(16, 252, 28, 0.7)"
                      : "rgba(212, 175, 55, 0.6)",
                }}
              >
                {form.password.length >= 8
                  ? "✓ Password cukup kuat"
                  : `${8 - form.password.length} karakter lagi`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Terms note */}
        <p className="text-[10px] leading-relaxed" style={{ color: "rgba(245,245,233,0.28)" }}>
          Dengan mendaftar, Anda menyetujui{" "}
          <Link href="/syarat" className="underline underline-offset-2 hover:text-[#D4AF37] transition-colors" style={{ color: "rgba(212,175,55,0.5)" }}>
            Syarat Layanan
          </Link>{" "}
          dan{" "}
          <Link href="/privasi" className="underline underline-offset-2 hover:text-[#D4AF37] transition-colors" style={{ color: "rgba(212,175,55,0.5)" }}>
            Kebijakan Privasi
          </Link>{" "}
          Carpaign.
        </p>

        {/* Submit */}
        <button
          id="register-submit"
          type="submit"
          disabled={loading}
          className="group relative w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold overflow-hidden transition-all duration-500 ease-[0.23,1,0.32,1] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
          style={{
            background:
              "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #B8941F 100%)",
            boxShadow:
              "0 0 30px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            color: "#111316",
          }}
        >
          {/* Shimmer */}
          {!loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 skew-x-12" />}
          <span className="relative z-10">{loading ? "Memproses..." : "Buat Akun"}</span>
          {!loading && <ArrowRight size={15} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />}
        </button>
      </motion.form>

      {/* Login CTA */}
      <p className="text-center text-sm mt-7" style={{ color: "rgba(245, 245, 233, 0.4)" }}>
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold transition-colors duration-200 hover:text-[#D4AF37]"
          style={{ color: "rgba(212, 175, 55, 0.8)" }}
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}
