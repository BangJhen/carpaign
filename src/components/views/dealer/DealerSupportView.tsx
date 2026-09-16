"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Headset, Mail, MessageSquare, Send, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

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

export function DealerSupportView() {
  const [category, setCategory] = useState("topup");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast.error("Silakan pilih kategori kendala");
      return;
    }
    if (!subject.trim()) {
      toast.error("Subjek kendala wajib diisi");
      return;
    }
    if (!details.trim()) {
      toast.error("Detail kendala wajib diisi");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubject("");
      setDetails("");
      setCategory("");
      toast.success("Tiket bantuan dealer berhasil dikirim", {
        description: "Tim operasional Carpaign akan merespons melalui email atau WhatsApp resmi showroom Anda dalam 1x24 jam.",
      });
    }, 800);
  };

  const handleOpenWhatsApp = () => {
    const waUrl = "https://wa.me/6281234567890?text=Halo%20Admin%20Carpaign%2C%20saya%20dari%20pihak%20dealer%20ingin%20berkonsultasi%20mengenai%20portal%20dan%20kampanye.";
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Bantuan Khusus Showroom
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Hubungi Admin Carpaign
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Layanan prioritas untuk membantu kendala teknis, pembayaran saldo, dan operasional kampanye dealer Anda.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Channels */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
            <Card className="bg-[#0f1114] border-white/10 hover:border-white/20 transition-all rounded-2xl h-full shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base mb-1">
                    WhatsApp Priority Dealer
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Respons cepat untuk koordinasi mendesak, Senin sampai Jumat pukul 09.00 hingga 18.00 WIB.
                  </p>
                  <Button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    className="w-full bg-white text-black hover:bg-white/90 text-xs font-semibold rounded-xl h-10 shadow-sm"
                  >
                    Hubungi via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
            <Card className="bg-[#0f1114] border-white/10 hover:border-white/20 transition-all rounded-2xl h-full shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base mb-1">
                    Email Resmi Kemitraan
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Untuk surat perjanjian, permintaan faktur pajak, atau kerja sama korporasi.
                  </p>
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/90">
                    dealer@carpaign.id
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3}>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-muted-foreground flex items-start gap-3">
              <Clock className="size-4 text-white/60 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Tiket bantuan yang diajukan di luar jam kerja operasional akan diproses pada hari kerja berikutnya.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Ticket Form */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={4} className="lg:col-span-2">
          <Card className="bg-[#0f1114] border-white/10 shadow-xl rounded-2xl h-full flex flex-col justify-between">
            <div>
              <CardHeader className="p-6 sm:p-8 pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2.5">
                  <Headset className="size-5 text-white/80" />
                  Kirim Tiket Kendala Dealer
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Sampaikan detail kendala yang dialami showroom Anda untuk ditindaklanjuti oleh Account Manager Carpaign.
                </p>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 pt-2">
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/90">
                        Kategori Kendala
                      </label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-white/[0.02] border-white/10 text-xs text-white rounded-xl h-10">
                          <SelectValue placeholder="Top Up Saldo dan Faktur Pajak" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#14161a] border-white/10 text-white text-xs">
                          <SelectItem value="topup">Top Up Saldo dan Faktur Pajak</SelectItem>
                          <SelectItem value="campaign">Pembuatan dan Manajemen Kampanye</SelectItem>
                          <SelectItem value="review">Verifikasi Konten dan Submisi Kreator</SelectItem>
                          <SelectItem value="inventory">Inventory Kendaraan Showroom</SelectItem>
                          <SelectItem value="account">Akses Akun dan Profil Dealer</SelectItem>
                          <SelectItem value="other">Pertanyaan dan Kendala Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/90">
                        Subjek Kendala
                      </label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Contoh: Konfirmasi pembayaran saldo kampanye"
                        className="bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/90">
                      Detail Kendala atau Pertanyaan
                    </label>
                    <Textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={5}
                      placeholder="Jelaskan secara spesifik kendala, ID kampanye terkait, atau pertanyaan yang ingin ditanyakan..."
                      className="w-full bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl resize-none leading-relaxed p-3.5"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <CheckCircle2 className="size-3.5 text-white/50" />
                      <span>Tiket akan langsung ditautkan ke akun dealer Anda</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-white text-black hover:bg-white/90 text-xs font-semibold rounded-xl h-10 px-6 gap-2 shadow-sm transition-all"
                    >
                      <Send className="size-3.5" />
                      <span>{isSubmitting ? "Mengirim..." : "Kirim Tiket"}</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
