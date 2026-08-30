"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Info, ShieldAlert, CreditCard, HelpCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
};

const faqData = [
  {
    category: "Pendaftaran & Akun",
    icon: Info,
    items: [
      {
        q: "Bagaimana cara menjadi kreator di Carpaign?",
        a: "Anda cukup mendaftar dengan akun Google, lengkapi profil media sosial Anda (TikTok/Instagram/YouTube), dan tim kami akan melakukan verifikasi dalam 1x24 jam."
      },
      {
        q: "Apakah ada syarat jumlah followers?",
        a: "Tergantung kategori campaign. Untuk UGC dan Edit, tidak ada syarat followers. Untuk Publish dan Shoot, rata-rata membutuhkan minimal 1.000 followers aktif."
      }
    ]
  },
  {
    category: "Mekanisme Campaign & Job",
    icon: HelpCircle,
    items: [
      {
        q: "Berapa lama batas waktu pengerjaan job?",
        a: "Mayoritas job memberikan tenggat waktu (deadline) 3 - 7 hari sejak job di-approve oleh admin. Detail spesifik selalu tertera pada halaman masing-masing job."
      },
      {
        q: "Apakah saya perlu datang ke dealer untuk semua job?",
        a: "Tidak. Hanya job berkategori 'SHOOT' yang umumnya mengharuskan Anda datang ke lokasi/dealer. Kategori seperti EDIT, CLIP, atau PUBLISH bisa dikerjakan secara remote."
      }
    ]
  },
  {
    category: "Pencairan Dana & Saldo",
    icon: CreditCard,
    items: [
      {
        q: "Kapan saya bisa mencairkan dana (Withdraw)?",
        a: "Dana dapat dicairkan kapan saja asalkan batas minimum penarikan (Rp50.000) telah terpenuhi. Proses transfer biasanya memakan waktu 1x24 jam di hari kerja."
      },
      {
        q: "Apakah ada biaya admin saat pencairan?",
        a: "Ya, terdapat biaya admin flat sebesar Rp2.500 untuk transfer ke semua bank lokal dan e-wallet (GoPay, OVO, DANA)."
      }
    ]
  },
  {
    category: "Peraturan & Pelanggaran",
    icon: ShieldAlert,
    items: [
      {
        q: "Apa yang terjadi jika saya terlambat mengumpulkan tugas?",
        a: "Keterlambatan berturut-turut akan menurunkan Trust Score akun Anda, yang dapat berakibat pada penalti berupa pemotongan reward hingga penangguhan akun (suspend)."
      },
      {
        q: "Bolehkah saya menghapus konten setelah dibayar?",
        a: "Sangat dilarang. Konten harus tayang secara permanen kecuali ada instruksi khusus dari brand/dealer. Penghapusan konten secara sepihak akan mengakibatkan pemblokiran akun dan penarikan saldo."
      }
    ]
  }
];

export function FaqView() {
  return (
    <div className="flex flex-col gap-8 max-w-[800px] mx-auto w-full pb-20">
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">FAQ & Peraturan</h2>
        <p className="text-muted-foreground">Temukan jawaban untuk pertanyaan umum dan aturan main di Carpaign.</p>
      </motion.div>

      <div className="flex flex-col gap-8">
        {faqData.map((section, idx) => (
          <motion.div key={section.category} initial="hidden" animate="show" variants={fadeUp} custom={idx + 1}>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-[#1A1C20] border border-white/5 flex items-center justify-center">
                <section.icon className="size-4 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{section.category}</h3>
            </div>
            
            <Card className="bg-[#111316] border-white/5 shadow-none overflow-hidden">
              <CardContent className="p-0">
                <Accordion className="w-full">
                  {section.items.map((item, i) => (
                    <AccordionItem key={i} value={`item-${idx}-${i}`} className="border-b border-white/5 px-6">
                      <AccordionTrigger className="text-sm font-semibold hover:no-underline hover:text-[#D4AF37] transition-colors py-4 text-left">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pr-6">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
