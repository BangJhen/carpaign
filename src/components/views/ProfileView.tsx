"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, User, Link as LinkIcon, Music, PlaySquare, MapPin, Mail, Phone, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
};

export function ProfileView() {
  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto w-full pb-20">
      
      {/* Header / Cover */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <Card className="bg-[#111316] border-white/5 overflow-hidden relative shadow-none">
          {/* Cover Image Placeholder */}
          <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-[#1A1C20] to-[#0A0A0C] relative">
            <div className="absolute inset-0 bg-[#D4AF37]/5 mix-blend-overlay" />
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            
            <Button size="sm" variant="outline" className="absolute top-4 right-4 bg-black/50 border-white/10 hover:bg-black/70 backdrop-blur-md">
              <Camera className="size-4 mr-2" />
              Ubah Cover
            </Button>
          </div>

          <CardContent className="p-6 sm:p-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8 -mt-12 sm:-mt-16">
              
              <div className="relative group">
                <Avatar className="size-24 sm:size-32 border-4 border-[#111316] shadow-xl rounded-2xl bg-[#1A1C20]">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl font-bold bg-[#1A1C20] text-muted-foreground rounded-2xl">AR</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer backdrop-blur-sm">
                  <Camera className="size-6 text-white" />
                </div>
              </div>

              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                      Ammar Ridho
                      <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                        Creator Gold
                      </Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                      <MapPin className="size-3.5" />
                      Jakarta Selatan, Indonesia
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-[#1A1C20] border-white/10 hover:bg-white/5">
                      Lihat Portofolio
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Forms) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
            <Card className="bg-[#111316] border-white/5 shadow-none">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-[17px] flex items-center gap-2">
                  <User className="size-4 text-[#D4AF37]" />
                  Informasi Pribadi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama Lengkap</label>
                    <Input defaultValue="Ammar Ridho" className="bg-[#0A0A0C] border-white/5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</label>
                    <Input defaultValue="@ammarrdho" className="bg-[#0A0A0C] border-white/5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input defaultValue="ammar.ridho@example.com" disabled className="bg-[#1A1C20] border-white/5 pl-9 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">No. WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input defaultValue="081234567890" className="bg-[#0A0A0C] border-white/5 pl-9" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button className="bg-[#D4AF37] hover:bg-[#c4a030] text-black font-bold gap-2">
                    <Save className="size-4" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
            <Card className="bg-[#111316] border-white/5 shadow-none">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-[17px] flex items-center gap-2">
                  <Wallet className="size-4 text-[#D4AF37]" />
                  Rekening Pencairan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bank / E-Wallet</label>
                    <Input defaultValue="BCA" className="bg-[#0A0A0C] border-white/5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nomor Rekening</label>
                    <Input defaultValue="8726192837" className="bg-[#0A0A0C] border-white/5" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama Pemilik Rekening</label>
                    <Input defaultValue="Ammar Ridho" className="bg-[#0A0A0C] border-white/5" />
                    <p className="text-[11px] text-muted-foreground mt-1">*Nama pemilik harus sesuai dengan nama profil untuk menghindari kegagalan transfer.</p>
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end">
                  <Button variant="outline" className="bg-[#1A1C20] border-white/10 hover:bg-white/5 gap-2">
                    <Save className="size-4" />
                    Update Rekening
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column (Socials & Stats) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3}>
            <Card className="bg-[#111316] border-white/5 shadow-none overflow-hidden relative">
              {/* Subtle glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-[40px] pointer-events-none" />
              
              <CardHeader className="border-b border-white/5 pb-4 relative z-10">
                <CardTitle className="text-[17px] flex items-center gap-2">
                  <LinkIcon className="size-4 text-[#D4AF37]" />
                  Social Connect
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 flex flex-col gap-3 relative z-10">
                
                <div className="flex items-center justify-between bg-[#1A1C20] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-black flex items-center justify-center">
                      <Music className="size-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">TikTok</span>
                      <span className="text-xs text-emerald-400 font-medium">Tersambung</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-400 h-8 px-2">Putus</Button>
                </div>

                <div className="flex items-center justify-between bg-[#1A1C20] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center">
                      <Camera className="size-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Instagram</span>
                      <span className="text-xs text-emerald-400 font-medium">Tersambung</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-400 h-8 px-2">Putus</Button>
                </div>

                <div className="flex items-center justify-between bg-[#0A0A0C] p-3 rounded-xl border border-white/5 border-dashed">
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="size-8 rounded bg-red-600 flex items-center justify-center">
                      <PlaySquare className="size-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">YouTube</span>
                      <span className="text-xs text-muted-foreground">Belum tersambung</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 px-3 border-white/10 bg-white/5 text-xs">Hubungkan</Button>
                </div>

              </CardContent>
            </Card>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
