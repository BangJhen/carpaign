"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Phone, Mail, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { useSession } from "@/lib/auth-client";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

function DealerProfileContent() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-8 max-w-[700px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">Pengaturan</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Profil Dealer</h1>
        <p className="text-sm text-white/40 mt-1">Identitas dealership yang ditampilkan ke kreator.</p>
      </motion.div>

      {/* Cover + Avatar */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <Card className="bg-[#111316] border-white/[0.06] overflow-hidden">
          {/* Cover */}
          <div className="relative h-36 bg-[#17191d] group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <Camera className="size-4 text-white/40" />
              <span className="text-[12px] text-white/40">Unggah foto showroom</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#111316]" />
          </div>

          {/* Avatar + name */}
          <div className="px-6 pb-6 -mt-6 relative flex items-end gap-4">
            <div
              className="size-14 rounded-xl flex items-center justify-center border border-white/10 bg-[#111316] relative group cursor-pointer flex-shrink-0"
            >
              <Building2 className="size-6 text-white/20" />
              <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <Camera className="size-3.5 text-white/50" />
              </div>
            </div>
            <div className="pb-0.5">
              <h2 className="text-[15px] font-semibold text-white">{session?.user?.name || "Nama Dealer"}</h2>
              <p className="text-[12px] text-white/30">Dealership | Jakarta</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Form */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
        <Card className="bg-[#111316] border-white/[0.06] p-6 sm:p-8">
          <h2 className="text-[13px] font-semibold text-white mb-6">Informasi Dealership</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/35">Nama Dealer / Showroom</label>
                <Input
                  defaultValue={session?.user?.name || ""}
                  placeholder="AutoPremium Jakarta"
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/35">Nama PIC</label>
                <Input
                  placeholder="Budi Santoso"
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/35 flex items-center gap-1.5">
                  <Phone className="size-3 text-white/20" /> Telepon
                </label>
                <Input
                  placeholder="+62 21 1234-5678"
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/35 flex items-center gap-1.5">
                  <Mail className="size-3 text-white/20" /> Email Bisnis
                </label>
                <Input
                  defaultValue={session?.user?.email || ""}
                  placeholder="info@autopremium.id"
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-white/35 flex items-center gap-1.5">
                <MapPin className="size-3 text-white/20" /> Alamat Showroom
              </label>
              <Input
                placeholder="Jl. Gatot Subroto Kav. 51, Jakarta Selatan"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                className="h-9 px-6 rounded-lg text-[12px] font-bold"
                style={{ background: "var(--primary)", color: "#0a0a0c" }}
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function DealerProfilePage() {
  return (
    <DealerLayout title="Profil Dealer">
      <DealerProfileContent />
    </DealerLayout>
  );
}
