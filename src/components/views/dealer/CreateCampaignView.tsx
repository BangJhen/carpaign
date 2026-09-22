"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Video, Camera } from "lucide-react";
import type { CampaignType } from "@/db/schema";
import { ClippingCampaignForm } from "./ClippingCampaignForm";
import { UgcCampaignForm } from "./UgcCampaignForm";
import { VideographyCampaignForm } from "./VideographyCampaignForm";

const CAMPAIGN_TYPES: { value: CampaignType; title: string; description: string; objective: string; icon: any }[] = [
  {
    value: "Clipping",
    title: "Clipping",
    objective: "Meningkatkan awareness",
    description: "Menyebarkan konten agar lebih banyak orang mengenal dealer atau unitnya",
    icon: Scissors,
  },
  {
    value: "UGC/Review",
    title: "UGC/Review",
    objective: "Mendukung peningkatan sales",
    description: "Konten kreator yang menjelaskan produk dan membangun kepercayaan calon pembeli",
    icon: Video,
  },
  {
    value: "Videographer/Edit",
    title: "Videographer/Edit",
    objective: "Memenuhi kebutuhan konten",
    description: "Jasa pengambilan footage, produksi video, atau pengeditan konten",
    icon: Camera,
  },
];

type Vehicle = {
  id: string;
  name: string;
  location: string;
  image?: string | null;
  year?: number | null;
  color?: string | null;
  status?: string | null;
};

export function CreateCampaignView({ vehicles }: { vehicles: Vehicle[] }) {
  const [selectedType, setSelectedType] = useState<CampaignType | "">("");

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full pb-20">
      <AnimatePresence mode="wait">
        {!selectedType ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">Buat Baru</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">Pilih Jenis Kampanye</h1>
              <p className="text-[13px] text-white/40">Sesuaikan dengan tujuan dan kebutuhan marketing Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CAMPAIGN_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => setSelectedType(t.value)}
                    className="group flex flex-col text-left p-6 rounded-2xl border border-white/[0.06] bg-[#111316] hover:bg-white/[0.02] hover:border-white/[0.15] transition-all h-full"
                  >
                    <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                      <Icon className="size-6 text-white/70 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[15px] font-semibold text-white mb-1.5">{t.title}</p>
                    <p className="text-[12px] font-medium text-primary/70 mb-3">{t.objective}</p>
                    <p className="text-[12px] text-white/40 leading-relaxed">{t.description}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {selectedType === "Clipping" && (
              <ClippingCampaignForm onBack={() => setSelectedType("")} vehicles={vehicles} />
            )}
            {selectedType === "UGC/Review" && (
              <UgcCampaignForm onBack={() => setSelectedType("")} vehicles={vehicles} />
            )}
            {selectedType === "Videographer/Edit" && (
              <VideographyCampaignForm onBack={() => setSelectedType("")} vehicles={vehicles} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
