"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Headset, Mail, MessageSquare, Send } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
};

export function SupportView() {
  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto w-full pb-20">
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-foreground mb-2">Butuh Bantuan?</h2>
        <p className="text-muted-foreground">Tim Carpaign siap membantu menyelesaikan kendala atau menjawab pertanyaan Anda seputar campaign.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Methods */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
            <Card className="bg-[#111316] border-white/5 hover:border-[#D4AF37]/30 transition-colors cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="size-12 rounded-full bg-[#1A1C20] border border-white/5 flex items-center justify-center group-hover:bg-[#1F190B] group-hover:border-[#D4AF37]/20 transition-all">
                  <MessageSquare className="size-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">WhatsApp Admin</h3>
                  <p className="text-xs text-muted-foreground mb-4">Respon cepat (Senin sampai Jumat, 09:00 sampai 17:00 WIB)</p>
                  <Button className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20">
                    Chat Sekarang
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
            <Card className="bg-[#111316] border-white/5 hover:border-white/10 transition-colors cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="size-12 rounded-full bg-[#1A1C20] border border-white/5 flex items-center justify-center transition-all">
                  <Mail className="size-5 text-muted-foreground group-hover:text-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Email Support</h3>
                  <p className="text-xs text-muted-foreground mb-4">Untuk kendala teknis atau pengaduan resmi</p>
                  <p className="text-sm font-semibold text-foreground">support@carpaign.id</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Ticket Form */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3} className="lg:col-span-2">
          <Card className="bg-[#111316] border-white/5 shadow-2xl relative overflow-hidden h-full">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Headset className="size-5 text-[#D4AF37]" />
                Kirim Tiket Bantuan
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategori</label>
                  <Select>
                    <SelectTrigger className="bg-[#0A0A0C] border-white/5">
                      <SelectValue placeholder="Pilih Kendala" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Pencairan Dana Saldo</SelectItem>
                      <SelectItem value="campaign">Masalah Submit Campaign</SelectItem>
                      <SelectItem value="account">Kendala Akun dan Profil</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subjek</label>
                  <Input placeholder="Contoh: Dana belum masuk" className="bg-[#0A0A0C] border-white/5" />
                </div>
              </div>
              
              <div className="space-y-2 mt-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detail Kendala</label>
                <Textarea 
                  placeholder="Ceritakan detail kendala yang Anda alami..." 
                  className="min-h-[120px] bg-[#0A0A0C] border-white/5 resize-none" 
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button className="bg-[#D4AF37] hover:bg-[#c4a030] text-black font-bold gap-2 rounded-lg px-6">
                  <Send className="size-4" />
                  Kirim Pesan
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
