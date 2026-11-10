import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const formats = [
  {
    type: "Shoot & Edit",
    title: "Produksi langsung di showroom",
    description: "Rekam detail eksterior, kabin, dan pengalaman berkendara untuk video katalog.",
    image: "/campaign-preview/showroom.jpg",
    alt: "Mobil di dalam showroom",
    position: "object-center",
  },
  {
    type: "UGC & Review",
    title: "Ulasan dari sudut pandangmu",
    description: "Ceritakan fitur dan rasa berkendara dengan gaya kontenmu.",
    image: "/campaign-preview/review.jpg",
    alt: "Mobil sport merah di depan showroom",
    position: "object-center",
  },
  {
    type: "Clip & Publish",
    title: "Potong dan publikasikan",
    description: "Ubah materi kendaraan menjadi video pendek yang siap tayang.",
    image: "/campaign-preview/clip.jpg",
    alt: "Mobil biru di jalan terbuka",
    position: "object-center",
  },
] as const;

export function CampaignPreviewSection() {
  return (
    <section className="bg-[#101214] px-5 pb-24 pt-40 sm:px-8 md:pb-32 md:pt-44" aria-labelledby="campaign-preview-title">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-9 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <h2
              id="campaign-preview-title"
              className="max-w-[720px] text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[1.03] tracking-[-0.055em] text-[#F5F5E9]"
            >
              Pilih cara kamu membuat konten otomotif.
            </h2>
            <p className="mt-5 max-w-[590px] text-sm leading-relaxed text-[#A9AEAF] sm:text-base">
              Tiap kampanye memuat unit, arahan konten, dan ketentuan reward sebelum kamu mengajukan diri.
            </p>
          </div>
          <Link
            href="/campaigns"
            className="inline-flex shrink-0 items-center gap-3 border-b border-[#D4AF37] pb-2 text-sm font-semibold text-[#F0D778] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            Jelajahi kampanye
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <CampaignFormatCard format={formats[0]} featured />
          <div className="grid gap-4">
            <CampaignFormatCard format={formats[1]} />
            <CampaignFormatCard format={formats[2]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CampaignFormatCard({
  format,
  featured = false,
}: {
  format: (typeof formats)[number];
  featured?: boolean;
}) {
  return (
    <Link
      href="/campaigns"
      aria-label={`Jelajahi kampanye ${format.type}`}
      className={`group relative block overflow-hidden rounded-[20px] border border-white/10 bg-[#1A1D20] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] ${
        featured ? "min-h-[390px] lg:min-h-[548px]" : "min-h-[250px] sm:min-h-[266px]"
      }`}
    >
      <Image
        src={format.image}
        alt={format.alt}
        fill
        unoptimized
        sizes={featured ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 1024px) 100vw, 45vw"}
        className={`object-cover ${format.position}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0F] via-[#0B0D0F]/50 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-8">
        <div className="min-w-0 max-w-[450px]">
          <p className="mb-2 text-xs font-semibold text-[#E7C95A]">{format.type}</p>
          <h3 className={`font-semibold leading-tight tracking-[-0.035em] text-white ${featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[28px]"}`}>
            {format.title}
          </h3>
          <p className="mt-3 max-w-[380px] text-sm leading-relaxed text-white/75">{format.description}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white transition-colors group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#111316]"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </Link>
  );
}
