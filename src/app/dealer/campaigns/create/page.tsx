"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DealerLayout } from "@/components/layout/DealerLayout";

const CAMPAIGN_TYPES = ["UGC", "Cinematic Shoot", "Edit Only", "Publish & Post"];

const VEHICLES = [
  { id: 1, name: "Honda Brio RS 2024", location: "Jakarta Selatan" },
  { id: 3, name: "Mitsubishi Xpander 2024", location: "Tangerang" },
  { id: 5, name: "Daihatsu Terios 2024", location: "Bekasi" },
  { id: 6, name: "Honda HR-V Turbo 2023", location: "Jakarta Selatan" },
];

const steps = ["Kendaraan", "Detail", "Budget", "Konfirmasi"];

function CreateCampaignContent() {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [form, setForm] = useState({ title: "", brief: "", budget: "", deadline: "" });

  return (
    <div className="flex flex-col gap-8 max-w-[700px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">Buat Baru</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Kampanye</h1>
      </motion.div>

      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-0"
      >
        {steps.map((label, i) => {
          const num = i + 1;
          const isActive = step === num;
          const isDone = step > num;
          return (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className="size-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                  style={
                    isDone
                      ? { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }
                      : isActive
                      ? { background: "var(--primary)", color: "#0a0a0c" }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.2)" }
                  }
                >
                  {isDone ? "✓" : num}
                </div>
                <span
                  className="text-[12px] font-medium hidden sm:block"
                  style={{ color: isActive ? "white" : "rgba(255,255,255,0.25)" }}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 sm:w-12 h-[1px] mx-2" style={{ background: isDone ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)" }} />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Step Content */}
      <Card className="bg-[#111316] border-white/[0.06] p-6 sm:p-8">
        {/* Step 1 - Vehicle */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-[15px] font-semibold text-white mb-4">Pilih Unit Kendaraan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {VEHICLES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className="text-left p-4 rounded-xl border transition-all"
                  style={
                    selectedVehicle === v.id
                      ? { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.2)" }
                      : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }
                  }
                >
                  <p className="text-[13px] font-medium text-white">{v.name}</p>
                  <p className="text-[11px] text-white/35 mt-0.5">{v.location}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2 - Detail */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <h2 className="text-[15px] font-semibold text-white mb-4">Detail Kampanye</h2>
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-white/40">Judul Kampanye</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Honda Brio RS - UGC Challenge"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-white/40">Tipe Kampanye</label>
              <div className="grid grid-cols-2 gap-2">
                {CAMPAIGN_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className="py-2.5 px-4 rounded-lg text-[12px] font-medium border transition-all text-left"
                    style={
                      selectedType === type
                        ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.18)", color: "white" }
                        : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-white/40">Brief & Instruksi</label>
              <Textarea
                value={form.brief}
                onChange={(e) => setForm((f) => ({ ...f, brief: e.target.value }))}
                placeholder="Detail kampanye, do's & don'ts, style yang diinginkan..."
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20 min-h-[110px] resize-none"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3 - Budget */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <h2 className="text-[15px] font-semibold text-white mb-4">Budget & Deadline</h2>
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-white/40">Budget per Kreator</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/25">Rp</span>
                <Input
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                  placeholder="500.000"
                  className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-white/40">Deadline Pengumpulan</label>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                className="bg-white/[0.04] border-white/[0.08] text-white focus:border-white/20 [color-scheme:dark]"
              />
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[11px] text-white/30 mb-1">Saldo tersedia</p>
              <p className="text-[20px] font-bold text-white">Rp 7.950.000</p>
            </div>
          </motion.div>
        )}

        {/* Step 4 - Confirm */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-[15px] font-semibold text-white mb-4">Konfirmasi</h2>
            <div className="space-y-0 divide-y divide-white/[0.05]">
              {[
                { label: "Kendaraan", value: VEHICLES.find((v) => v.id === selectedVehicle)?.name || "-" },
                { label: "Tipe", value: selectedType || "-" },
                { label: "Judul", value: form.title || "-" },
                { label: "Budget", value: form.budget ? `Rp ${form.budget}` : "-" },
                { label: "Deadline", value: form.deadline || "-" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-3.5">
                  <span className="text-[12px] text-white/35">{row.label}</span>
                  <span className="text-[13px] font-medium text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/[0.05]">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="gap-1.5 text-[12px] text-white/30 hover:text-white/60 disabled:opacity-20"
          >
            <ChevronLeft className="size-4" /> Kembali
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="gap-1.5 h-9 px-5 rounded-lg text-[12px] font-semibold bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 transition-colors"
            >
              Lanjut <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              className="gap-1.5 h-9 px-6 rounded-lg text-[12px] font-bold"
              style={{ background: "var(--primary)", color: "#0a0a0c" }}
            >
              Publikasikan
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function CreateCampaignPage() {
  return (
    <DealerLayout title="Buat Kampanye">
      <CreateCampaignContent />
    </DealerLayout>
  );
}
