"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Megaphone, ShieldCheck, CreditCard } from "lucide-react";

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

const dealerFaqData = [
  {
    category: "Akun dan Profil Showroom",
    icon: Building2,
    items: [
      {
        q: "Bagaimana cara melengkapi verifikasi identitas dealer?",
        a: "Anda dapat melengkapi nama resmi showroom, nama penanggung jawab (PIC), nomor kontak resmi, dan alamat fisik pada menu Profil Dealer. Tim operasional Carpaign akan memverifikasi kelengkapan data dalam 1x24 jam kerja agar kampanye Anda dapat segera dipublikasikan.",
      },
      {
        q: "Apakah satu akun dealer dapat mengelola lebih dari satu cabang showroom?",
        a: "Saat ini setiap akun dealer mewakili satu entitas showroom atau cabang tertentu. Jika Anda mengelola beberapa cabang showroom mandiri, Anda dapat mendaftarkan akun terpisah untuk masing-masing cabang atau menghubungi tim Account Manager kami untuk solusi kemitraan multi-cabang.",
      },
      {
        q: "Apakah data kendaraan yang dimasukkan ke inventory aman?",
        a: "Seluruh data kendaraan yang Anda daftarkan di menu Inventory Kendaraan hanya digunakan untuk keperluan referensi materi kampanye kreator di dalam ekosistem Carpaign dan tidak dibagikan ke pihak ketiga di luar kerja sama promosi.",
      },
    ],
  },
  {
    category: "Manajemen Kampanye dan Arahan Kreator",
    icon: Megaphone,
    items: [
      {
        q: "Apa perbedaan kampanye Clip & Publish, UGC & Review, dan Shoot & Edit?",
        a: "Kampanye Clip & Publish berfokus pada pendistribusian klip video pendek dari materi yang sudah ada oleh kreator kliping. UGC & Review melibatkan kreator membuat video ulasan asli dan testimonial autentik. Sedangkan Shoot & Edit mengharuskan kreator atau videografer profesional datang langsung ke showroom untuk pengambilan footage sinematik atau pengeditan materi video.",
      },
      {
        q: "Bagaimana cara menentukan budget dan batas pengumpulan (deadline)?",
        a: "Saat membuat kampanye, Anda menentukan alokasi total budget serta reward per konten yang disetujui. Batas waktu pengerjaan dapat diatur sesuai timeline promosi showroom Anda, umumnya antara 7 hingga 30 hari kalender.",
      },
      {
        q: "Bisakah mengubah arahan atau materi kampanye setelah dipublikasikan?",
        a: "Informasi umum dapat disunting selama kampanye berstatus aktif. Namun alokasi budget dan jenis kampanye utama tidak dapat diubah setelah ada kreator yang mengajukan submisi demi menjaga transparansi kerja sama.",
      },
    ],
  },
  {
    category: "Review dan Persetujuan Submisi Konten",
    icon: ShieldCheck,
    items: [
      {
        q: "Berapa lama batas waktu dealer untuk meninjau konten yang masuk?",
        a: "Dealer memiliki batas waktu maksimal 3 hari kerja untuk meninjau, menyetujui, atau menolak video yang diserahkan oleh kreator pada menu Review Konten. Jika melewati batas waktu tanpa tindakan, sistem akan memprioritaskan peninjauan oleh tim kurasi Carpaign.",
      },
      {
        q: "Apakah dealer berhak meminta revisi atau menolak submisi?",
        a: "Ya. Jika video yang diunggah kreator tidak memenuhi pedoman arahan (*brief*), melanggar etika promosi, atau tidak menyertakan tautan showroom yang diwajibkan, Anda berhak menolak submisi dengan menyertakan alasan yang jelas.",
      },
      {
        q: "Kapan reward kreator dibayarkan?",
        a: "Reward kreator hanya akan dipotong dari saldo deposit kampanye Anda setelah Anda menekan tombol Setujui pada submisi video yang memenuhi kriteria.",
      },
    ],
  },
  {
    category: "Keuangan, Saldo Escrow, dan Faktur",
    icon: CreditCard,
    items: [
      {
        q: "Bagaimana sistem keamanan saldo kampanye (Escrow)?",
        a: "Saldo yang Anda top-up akan dialokasikan ke kampanye secara aman dalam sistem penampungan (*escrow*). Dana tidak langsung ditransfer ke kreator hingga Anda secara resmi menyetujui konten yang dikerjakan.",
      },
      {
        q: "Bagaimana jika kampanye berakhir namun budget belum habis terpakai?",
        a: "Sisa alokasi dana kampanye yang belum terserap akan otomatis dikembalikan ke Saldo Aktif akun dealer Anda setelah kampanye selesai, dan dapat digunakan kembali untuk kampanye berikutnya.",
      },
      {
        q: "Apakah dealer bisa mendapatkan tanda terima atau faktur resmi?",
        a: "Setiap transaksi top-up saldo dan penggunaan dana kampanye tercatat secara otomatis di menu Keuangan. Anda dapat menghubungi tim Finance kami melalui email dealer@carpaign.id untuk penerbitan faktur atau rekonsiliasi laporan bulanan.",
      },
    ],
  },
];

export function DealerFaqView() {
  return (
    <div className="flex flex-col gap-8 max-w-[840px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Panduan Resmi Showroom
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          FAQ dan Peraturan Dealer
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pertanyaan umum seputar pengelolaan kampanye, kurasi konten kreator, dan ketentuan saldo showroom di Carpaign.
        </p>
      </motion.div>

      {/* FAQ Sections */}
      <div className="flex flex-col gap-6">
        {dealerFaqData.map((section, idx) => (
          <motion.div
            key={section.category}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={idx + 1}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                <section.icon className="size-4" />
              </div>
              <h2 className="text-base font-semibold text-white">
                {section.category}
              </h2>
            </div>

            <Card className="bg-[#0f1114] border-white/10 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <Accordion className="w-full">
                  {section.items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`item-${idx}-${i}`}
                      className="border-b border-white/5 last:border-0 px-6"
                    >
                      <AccordionTrigger className="text-xs sm:text-sm font-medium text-white hover:no-underline py-4 text-left leading-relaxed">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4 pt-1">
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
