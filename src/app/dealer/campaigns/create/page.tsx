"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Car, FileText, DollarSign, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DealerLayout } from "@/components/layout/DealerLayout";

const DEALER_ACCENT = "#B87333";

const CAMPAIGN_TYPES = ["UGC", "Cinematic Shoot", "Edit Only", "Publish & Post"];

const VEHICLES = [
  { id: 1, name: "Honda Brio RS 2024", location: "Jakarta Selatan", status: "available" },
  { id: 3, name: "Mitsubishi Xpander 2024", location: "Tangerang", status: "available" },
  { id: 5, name: "Daihatsu Terios 2024", location: "Bekasi", status: "available" },
  { id: 6, name: "Honda HR-V Turbo 2023", location: "Jakarta Selatan", status: "available" },
];

const steps = [
  { id: 1, label: "Pilih Kendaraan", icon: Car },
  { id: 2, label: "Detail Kampanye", icon: FileText },
  { id: 3, label: "Budget & Deadline", icon: DollarSign },
  { id: 4, label: "Konfirmasi", icon: CheckCircle2 },
];

function CreateCampaignContent() {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    brief: "",
    budget: "",
    deadline: "",
  });

  return (
    <div className="flex flex-col gap-8 max-w-[800px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">Buat Baru</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Kampanye</h1>
        <p className="text-sm text-white/40 mt-1">Ikuti langkah-langkah berikut untuk membuat kampanye baru.</p>
      </motion.div>

      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-2"
      >
        {steps.map((s, i) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="size-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                  style={
                    isDone
                      ? { background: "#6BCB7720", border: "1px solid #6BCB7750", color: "#6BCB77" }
                      : isActive
                      ? { background: `${DEALER_ACCENT}20`, border: `1px solid ${DEALER_ACCENT}50`, color: DEALER_ACCENT }
                      : { background: "#ffffff08", border: "1px solid #ffffff10", color: "#ffffff30" }
                  }
                >
                  {isDone ? <CheckCircle2 className="size-4" /> : <s.icon className="size-4" />}
                </div>
                <span
                  className="text-[12px] font-medium hidden sm:block"
                  style={{ color: isActive ? "white" : "#ffffff30" }}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="h-[1px] w-8 sm:w-12 flex-shrink-0"
                  style={{ background: isDone ? `${DEALER_ACCENT}50` : "#ffffff10" }}
                />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Step Content */}
      <Card className="bg-[#111316] border-white/5 p-6 sm:p-8">
        {/* Step 1 — Vehicle */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-[16px] font-semibold text-white mb-4">Pilih Unit Kendaraan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VEHICLES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className="text-left p-4 rounded-xl border transition-all"
                  style={
                    selectedVehicle === v.id
                      ? { background: `${DEALER_ACCENT}10`, borderColor: `${DEALER_ACCENT}50` }
                      : { background: "#ffffff05", borderColor: "#ffffff10" }
                  }
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-white">{v.name}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{v.location}</p>
                    </div>
                    {selectedVehicle === v.id && (
                      <CheckCircle2 className="size-4 flex-shrink-0" style={{ color: DEALER_ACCENT }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2 — Detail */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <h2 className="text-[16px] font-semibold text-white mb-4">Detail Kampanye</h2>
            
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50">Judul Kampanye</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Cth: Honda Brio RS — UGC Challenge"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50">Tipe Kampanye</label>
              <div className="grid grid-cols-2 gap-2">
                {CAMPAIGN_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className="py-2.5 px-4 rounded-lg text-[12px] font-medium border transition-all text-left"
                    style={
                      selectedType === type
                        ? { background: `${DEALER_ACCENT}15`, borderColor: `${DEALER_ACCENT}40`, color: DEALER_ACCENT }
                        : { background: "#ffffff05", borderColor: "#ffffff10", color: "#ffffff50" }
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50">Brief / Instruksi Kreator</label>
              <Textarea
                value={form.brief}
                onChange={(e) => setForm((f) => ({ ...f, brief: e.target.value }))}
                placeholder="Tuliskan detail kampanye, do's & don'ts, style yang diinginkan..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/20 min-h-[120px] resize-none"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3 — Budget & Deadline */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <h2 className="text-[16px] font-semibold text-white mb-4">Budget & Deadline</h2>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50">Budget per Kreator (Rp)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/30">Rp</span>
                <Input
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                  placeholder="500.000"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-white/50">Deadline Pengumpulan</label>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                className="bg-white/5 border-white/10 text-white focus:border-white/20 [color-scheme:dark]"
              />
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[12px] text-white/40 mb-1">Saldo Saat Ini</p>
              <p className="text-[20px] font-bold text-white">Rp 7.950.000</p>
              {form.budget && (
                <p className="text-[11px] mt-1" style={{ color: `${DEALER_ACCENT}99` }}>
                  Sisa setelah kampanye: Rp{" "}
                  {(7950000 - parseInt(form.budget.replace(/\./g, "") || "0")).toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 4 — Confirmation */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-[16px] font-semibold text-white mb-4">Konfirmasi Kampanye</h2>
            <div className="space-y-3">
              {[
                { label: "Kendaraan", value: VEHICLES.find((v) => v.id === selectedVehicle)?.name || "—" },
                { label: "Tipe", value: selectedType || "—" },
                { label: "Judul", value: form.title || "—" },
                { label: "Budget", value: form.budget ? `Rp ${form.budget}` : "—" },
                { label: "Deadline", value: form.deadline || "—" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-[12px] text-white/40">{row.label}</span>
                  <span className="text-[13px] font-medium text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="gap-1.5 text-[12px] text-white/50 hover:text-white disabled:opacity-20"
          >
            <ChevronLeft className="size-4" /> Kembali
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="gap-1.5 h-9 px-5 rounded-lg text-[12px] font-bold uppercase tracking-widest"
              style={{
                background: `linear-gradient(135deg, ${DEALER_ACCENT}25, ${DEALER_ACCENT}10)`,
                border: `1px solid ${DEALER_ACCENT}50`,
                color: DEALER_ACCENT,
              }}
            >
              Lanjut <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              className="gap-1.5 h-9 px-6 rounded-lg text-[12px] font-bold uppercase tracking-widest"
              style={{
                background: `${DEALER_ACCENT}`,
                color: "#0a0a0c",
              }}
            >
              <CheckCircle2 className="size-4" /> Publikasikan
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
