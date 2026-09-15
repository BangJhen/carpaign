"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

const EASE = [0.23, 1, 0.32, 1] as const;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await signIn.email({
      email: form.email,
      password: form.password,
    });
    
    if (error) {
      toast.error(error.message || "Gagal masuk. Periksa kembali kredensial Anda.");
      setLoading(false);
    } else {
      toast.success("Berhasil masuk!");
      const role = (data?.user as any)?.role;
      if (role === "dealership" || role === "dealer") {
        router.push("/dealer/dashboard");
      } else {
        router.push("/creator/dashboard");
      }
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
          Masuk ke Akun
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#F5F5E9" }}
        >
          Selamat datang kembali.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
          className="text-sm mt-2"
          style={{ color: "rgba(245, 245, 233, 0.45)" }}
        >
          Masuk untuk mengakses dashboard dan campaign Anda.
        </motion.p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="block text-[10px] uppercase tracking-[0.2em] font-mono"
            style={{ color: "rgba(245, 245, 233, 0.4)" }}
          >
            Email
          </label>
          <input
            id="login-email"
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-[10px] uppercase tracking-[0.2em] font-mono"
              style={{ color: "rgba(245, 245, 233, 0.4)" }}
            >
              Password
            </label>
            <Link
              href="/lupa-password"
              className="text-[10px] font-mono transition-colors duration-200 hover:text-[#D4AF37]"
              style={{ color: "rgba(212, 175, 55, 0.55)" }}
            >
              Lupa password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
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
        </div>

        {/* Submit */}
        <button
          id="login-submit"
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
          <span className="relative z-10">{loading ? "Memproses..." : "Masuk"}</span>
          {!loading && <ArrowRight size={15} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />}
        </button>
      </motion.form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px" style={{ background: "rgba(245,245,233,0.07)" }} />
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "rgba(245,245,233,0.25)" }}>
          atau
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(245,245,233,0.07)" }} />
      </div>

      {/* Register CTA */}
      <p className="text-center text-sm" style={{ color: "rgba(245, 245, 233, 0.4)" }}>
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold transition-colors duration-200 hover:text-[#D4AF37]"
          style={{ color: "rgba(212, 175, 55, 0.8)" }}
        >
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
