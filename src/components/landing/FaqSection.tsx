"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_ACCORDION = [0.32, 0.72, 0, 1] as const;

const faqs = [
  {
    q: "Apa itu Carpaign?",
    a: "CARPAIGN menghubungkan inventaris kendaraan dealer dengan kreator konten otomotif. Dealer dapat membuat kampanye Clip, UGC, atau Shoot; kreator melihat arahan lalu mengajukan diri.",
  },
  {
    q: "Apakah perlu punya banyak followers untuk bergabung?",
    a: "Pendaftaran tidak mensyaratkan jumlah pengikut tertentu. Persyaratan setiap kampanye dapat berbeda dan perlu dibaca pada halaman detailnya.",
  },
  {
    q: "Bagaimana cara saya mendapatkan bayaran?",
    a: "Skema imbalan mengikuti jenis kampanye dan arahan dealer. Clip dapat menggunakan target tayangan; UGC dan Shoot memiliki ketentuan pekerjaan tersendiri. Pembayaran dan pencairan sungguhan belum tersedia pada MVP ini.",
  },
  {
    q: "Apakah saya harus datang langsung ke showroom?",
    a: "Tergantung format dan arahan kampanye. Shoot dan sebagian UGC memerlukan kunjungan showroom. Clip dapat dikerjakan dari materi yang disediakan dealer.",
  },
  {
    q: "Berapa lama hingga bayaran saya cair?",
    a: "Belum ada jadwal pencairan otomatis pada MVP. Buku besar yang ditampilkan dealer saat ini adalah simulasi; integrasi penyedia pembayaran masih diperlukan sebelum dana sungguhan dapat dicadangkan atau dicairkan.",
  },
  {
    q: "Apakah data dan akun sosmed saya aman?",
    a: "Saat ini kamu tidak perlu menyerahkan kata sandi media sosial kepada CARPAIGN. Periksa data profil dan tautan yang kamu kirim sebelum mengajukan kampanye.",
  },
  {
    q: "Apa perbedaan Clip, UGC, dan Shoot?",
    a: "Clip berfokus pada penyuntingan dan distribusi video pendek dari materi yang tersedia. UGC mengutamakan ulasan dari sudut pandang kreator. Shoot berfokus pada pengambilan gambar kendaraan untuk aset visual dealer.",
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
            transition={{ duration: 0.25, ease: EASE_ACCORDION }}
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
              transition={{ duration: 0.35, ease: EASE_ACCORDION }}
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
            <Link
              href="/bantuan"
              className="underline underline-offset-2 hover:text-[#D4AF37] transition-colors duration-200"
              style={{ color: "rgba(212, 175, 55, 0.7)" }}
            >
              Bantuan
            </Link>
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
