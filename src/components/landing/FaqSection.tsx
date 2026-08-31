"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    q: "Apa itu Carpaign?",
    a: "Carpaign adalah marketplace campaign konten otomotif yang menghubungkan content creator dengan dealership kendaraan bermotor di Indonesia. Creator buat konten tentang mobil dari dealership partner, lalu mendapat bayaran berdasarkan views yang dihasilkan.",
  },
  {
    q: "Apakah perlu punya banyak followers untuk bergabung?",
    a: "Tidak. Carpaign tidak mensyaratkan jumlah followers tertentu untuk kebanyakan campaign. Kualitas konten dan pemahaman tentang otomotif jauh lebih penting. Beberapa campaign premium memang mensyaratkan audience tertentu, tapi banyak campaign terbuka untuk semua creator.",
  },
  {
    q: "Bagaimana cara saya mendapatkan bayaran?",
    a: "Views dari konten yang kamu publish terakumulasi otomatis setiap hari pukul 24.00 WIB. Setelah masa validasi 7 hari (untuk filter bot dan stabilisasi data), penghasilan otomatis masuk ke saldo dashboard-mu. Kamu bisa cairkan kapan saja ke GoPay, OVO, DANA, ShopeePay, BCA, BRI, Mandiri, dan banyak lagi.",
  },
  {
    q: "Apakah saya harus datang langsung ke showroom?",
    a: "Tergantung jenis campaign-nya. Campaign tipe SHOOT memang mengharuskan kamu hadir langsung. Tapi campaign tipe EDIT, CLIP, atau PUBLISH bisa dilakukan sepenuhnya remote — kamu cukup mengerjakan materi yang sudah disediakan oleh dealership.",
  },
  {
    q: "Berapa lama hingga bayaran saya cair?",
    a: "Views diproses setiap hari, lalu masuk masa validasi 7 hari untuk memastikan views organik dan bukan bot. Setelah itu saldo otomatis tersedia di dashboard-mu. Proses pencairan ke e-wallet atau bank biasanya selesai kurang dari 1 hari kerja.",
  },
  {
    q: "Apakah data dan akun sosmed saya aman?",
    a: "Sangat aman. Kami hanya meminta akses read-only ke statistik views konten — tidak ada akses untuk posting, mengubah profil, atau tindakan lainnya. Semua data dienkripsi end-to-end. Kami tidak pernah menyimpan password akun sosmed kamu.",
  },
  {
    q: "Apa itu sistem Tier Kreator?",
    a: "Tier adalah sistem reputasi di Carpaign. Semakin banyak campaign yang berhasil kamu selesaikan dengan performa baik, semakin naik tier-mu. Tier 1 (Base) hingga Tier 5 (Elite) — dan setiap kenaikan tier memberikan bonus multiplier pada bayaranmu, hingga +20% di Tier 5.",
  },
];

function FaqItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.5, ease: EASE }}
    >
      <div
        className="border rounded-xl overflow-hidden transition-all duration-300"
        style={{
          border: isOpen
            ? "1px solid rgba(212, 175, 55, 0.2)"
            : "1px solid rgba(245, 245, 233, 0.06)",
          background: isOpen
            ? "linear-gradient(145deg, rgba(21,24,28,0.9) 0%, rgba(17,19,22,0.95) 100%)"
            : "rgba(17, 19, 22, 0.6)",
        }}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 p-5 text-left"
        >
          <span
            className="text-sm font-semibold"
            style={{ color: isOpen ? "#F5F5E9" : "rgba(245,245,233,0.7)" }}
          >
            {faq.q}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="shrink-0"
          >
            <ChevronDown
              size={16}
              style={{ color: isOpen ? "#D4AF37" : "rgba(245,245,233,0.3)" }}
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <p
                className="px-5 pb-5 text-sm leading-relaxed"
                style={{ color: "rgba(245, 245, 233, 0.5)" }}
              >
                {faq.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="faq" className="relative py-28 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-14"
        >
          <p
            className="text-[11px] uppercase tracking-[0.22em] font-mono mb-4"
            style={{ color: "rgba(212, 175, 55, 0.55)" }}
          >
            FAQ
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: "#F5F5E9" }}
          >
            Pertanyaan yang{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #F0D060 0%, #D4AF37 100%)",
              }}
            >
              sering ditanyakan
            </span>
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "rgba(245, 245, 233, 0.45)" }}
          >
            Masih punya pertanyaan? Hubungi tim kami melalui halaman{" "}
            <a
              href="/bantuan"
              className="underline underline-offset-2 hover:text-[#D4AF37] transition-colors duration-200"
              style={{ color: "rgba(212, 175, 55, 0.7)" }}
            >
              Bantuan
            </a>
            .
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
