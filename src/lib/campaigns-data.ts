export type Campaign = {
  id: number | string;
  brand: string;
  vehicle: string;
  title?: string;
  type: string;
  reward: string;
  rawBudget?: number;
  description: string;
  image: string;
  quota: string;
  tags: string[];
  typeColor: string;
  location: string;
  deadline: string;
  requirements: string[];
  brief: string;
  specs: { label: string; value: string }[];
  mandatoryHighlights?: string[];
  guidelines?: string;
  deliverables?: string;
  usageRights?: string;
  sourceMaterialUrl?: string;
  cta?: string;
  details?: any;
};

export function getAutomotiveThumbnail(
  titleOrVehicle?: string | null,
  providedThumbnail?: string | null,
  coverImage?: string | null,
  indexFallback = 0
): string {
  if (providedThumbnail && providedThumbnail.trim().length > 0) {
    return providedThumbnail;
  }
  if (coverImage && coverImage.trim().length > 0) {
    return coverImage;
  }

  const name = (titleOrVehicle || "").toLowerCase();
  if (name.includes("veloz") || name.includes("avanza") || name.includes("toyota")) {
    return "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200";
  }
  if (name.includes("brio") || name.includes("honda") || name.includes("hrv") || name.includes("crv")) {
    return "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200";
  }
  if (name.includes("xpander") || name.includes("mitsubishi") || name.includes("pajero")) {
    return "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200";
  }
  if (name.includes("ioniq") || name.includes("hyundai") || name.includes("creta")) {
    return "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200";
  }
  if (name.includes("bmw") || name.includes("mercedes") || name.includes("lexus")) {
    return "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200";
  }
  if (name.includes("wuling") || name.includes("air ev") || name.includes("binguo")) {
    return "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200";
  }

  const defaultPool = [
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200",
  ];
  return defaultPool[indexFallback % defaultPool.length];
}

export function mapDbRowToCampaign(row: any, index = 0): Campaign {
  const details = (row.details as any) || {};
  const rawDeadlineTime = row.deadline ? new Date(row.deadline).getTime() : NaN;
  const validDeadline = isNaN(rawDeadlineTime) ? Date.now() + 14 * 86400000 : rawDeadlineTime;
  const daysRemaining = Math.max(
    1,
    Math.ceil((validDeadline - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const rawType = String(row.type || "Videographer/Edit");
  const isVideography = rawType === "Videographer/Edit" || rawType.toLowerCase().includes("video") || rawType.toLowerCase().includes("shoot");
  const isUgc = rawType === "UGC/Review" || rawType.toLowerCase().includes("ugc") || rawType.toLowerCase().includes("review");
  const isClipping = rawType === "Clipping" || rawType.toLowerCase().includes("clip");

  const brandName = row.dealerName || row.userDealerName || "AutoPremium Jakarta";
  const vehicleTitle = row.title || "Unit Otomotif";
  const thumbnail = details.thumbnail || row.coverImage;
  const autoImage = getAutomotiveThumbnail(vehicleTitle, thumbnail, row.coverImage, index);

  let formattedType = "Shoot & Edit";
  let typeColor = "bg-primary/10 text-primary border-primary/20";
  let rewardStr = `Rp${(row.budget || 1500000).toLocaleString("id-ID")}`;
  let quotaStr = `${row.applicantsCount || 1} dari 3 Kreator`;
  let locationStr = details.productionLocation || "Showroom AutoPremium, Jakarta";
  let tags: string[] = ["4K Cinema", "Showroom Visit"];
  let briefStr = details.brief || "";
  let requirements: string[] = [];
  let mandatoryHighlights: string[] = [];
  let specs: { label: string; value: string }[] = [];

  if (isVideography) {
    formattedType = "Shoot & Edit";
    typeColor = "bg-primary/10 text-primary border-primary/20";
    rewardStr = details.feeAmount ? `Rp${Number(details.feeAmount).toLocaleString("id-ID")} per Video` : `Rp${(row.budget || 20000000).toLocaleString("id-ID")}`;
    quotaStr = "1 dari 2 Videografer";
    locationStr = details.productionLocation || "Showroom AutoPremium, Jakarta Selatan";
    tags = ["4K Cinema", "Showroom Visit", "Reels & TikTok"];
    briefStr = details.brief || `Pengambilan footage sinematik eksterior dan interior ${vehicleTitle} di area showroom dan rute perkotaan sekitar. Fokus pada dynamic roller shot, pencahayaan dramatis lekuk bodi, detail fitur kabin modern, serta transisi mulus yang memikat audiens muda dan keluarga.`;
    
    specs = [
      { label: "Tipe Layanan", value: details.serviceType === "footage_only" ? "Footage Mentah Saja" : details.serviceType === "edit_only" ? "Editing Mentah Saja" : "Produksi Footage & Editing Lengkap" },
      { label: "Jumlah Output", value: details.outputCount ? `${details.outputCount} Video` : "2 Video (1 Hero + 1 Hook)" },
      { label: "Format & Resolusi", value: details.outputSpecs || "Vertikal (9:16), 4K UHD 60fps" },
      { label: "Durasi Video", value: details.outputDuration || "30 - 60 Detik" },
      { label: "Platform Target", value: details.targetPlatform || "TikTok, Instagram Reels, YouTube Shorts" },
      { label: "Hak Penggunaan", value: details.usageRights || "Komersial & Bebas untuk Iklan Ads" },
      { label: "Batas Revisi", value: details.revisionLimit ? `Maksimal ${details.revisionLimit}x Revisi` : "Maksimal 2x Revisi" },
      { label: "Jadwal Syuting", value: details.productionSchedule || "Sesi Showroom 1 Hari Penuh" },
    ];

    requirements = Array.isArray(details.requirements) && details.requirements.length > 0
      ? details.requirements
      : [
          details.providerCriteria || "Peralatan kamera min. Sony A7 IV / Mirrorless 4K dengan stabilizer gimbal 3-axis",
          "Portofolio video otomotif sinematik aktif (sertakan link saat mendaftar)",
          "Bersedia hadir langsung untuk sesi syuting di Showroom AutoPremium Jakarta",
          "Menandatangani NDA dan mematuhi SOP keselamatan unit pameran dealer"
        ];

    mandatoryHighlights = Array.isArray(details.mandatoryHighlights) && details.mandatoryHighlights.length > 0
      ? details.mandatoryHighlights
      : [
          "Hero shot eksterior: Grille trapesium khas, velg alloy two-tone, dan sequential LED lamp",
          "Fitur kabin: Dashboard modern, infotainment touchscreen display, dan sofa mode kursi baris kedua",
          "Sequence dinamis: Mobil melaju keluar showroom dengan dynamic tracking shot mulus",
          "Color grading: Clean commercial look dengan kontras tajam dan tone warna natural"
        ];
  } else if (isUgc) {
    formattedType = "UGC & Review";
    typeColor = "bg-primary/10 text-primary border-primary/20";
    rewardStr = details.feePerCreator ? `Rp${Number(details.feePerCreator).toLocaleString("id-ID")} per Kreator` : `Rp${(row.budget || 15000000).toLocaleString("id-ID")}`;
    quotaStr = `${details.creatorCount ? `3 dari ${details.creatorCount}` : "2 dari 5"} Kreator`;
    locationStr = details.productionLocation || "Jakarta / Jabodetabek (Showroom & Test Drive)";
    tags = ["UGC Review", "Test Drive Unit", "Reels & TikTok"];
    briefStr = details.brief || `Pembuatan video ulasan jujur dan menarik (POV Creator) bertema mobil pertama terbaik untuk anak muda dan pekerja urban. Soroti kelincahan handling berkendara di perkotaan, efisiensi bahan bakar yang sangat irit, desain sporty, serta kepraktisan kabin untuk aktivitas harian.`;

    specs = [
      { label: "Tipe Konten", value: details.contentType || "Review Unit POV & City Lifestyle Drive" },
      { label: "Durasi Video", value: details.videoSpecs || "45 - 60 Detik (Format Vertikal 9:16)" },
      { label: "Platform Publish", value: details.publishPlatforms || "TikTok, Instagram Reels" },
      { label: "Metode Produksi", value: details.productionMethod === "remote" ? "Remote / Unit Pickup" : "Kunjungan Showroom & Test Drive" },
      { label: "Hak Penggunaan", value: details.usageRights || "Boleh di-repost akun dealer & digunakan untuk Ads" },
      { label: "Batas Revisi", value: details.revisionLimit ? `Maksimal ${details.revisionLimit}x Revisi` : "Maksimal 1x Revisi" },
      { label: "Target Audiens", value: details.audienceRegion || "Jabodetabek & Nasional" },
      { label: "Jumlah Video", value: details.videosPerCreator ? `${details.videosPerCreator} Video per Kreator` : "1 Video per Kreator" },
    ];

    requirements = Array.isArray(details.requirements) && details.requirements.length > 0
      ? details.requirements
      : [
          details.creatorCriteria || "Akun media sosial min. 5.000 followers aktif dengan engagement rate > 3%",
          "Niche konten otomotif, lifestyle, daily vlog, atau teknologi",
          "Mampu menyampaikan ulasan secara natural, komunikatif di depan kamera",
          "Audio jernih menggunakan mic clip-on / wireless"
        ];

    mandatoryHighlights = Array.isArray(details.mandatoryHighlights) && details.mandatoryHighlights.length > 0
      ? details.mandatoryHighlights
      : [
          "Hook 3 detik awal yang memikat (contoh: 'Kenapa mobil ini tetap jadi pilihan no. 1?')",
          "Kenyamanan interior: Head unit layar sentuh, audio steering switch, dan ruang bagasi fleksibel",
          "Highlight promo dealer: Paket kredit DP ringan + gratis servis berkala hingga 50.000 km",
          "Call to Action (CTA) wajib di ending video dan caption untuk klik bio kreator"
        ];
  } else if (isClipping) {
    formattedType = "Clip & Publish";
    typeColor = "bg-primary/10 text-primary border-primary/20";
    rewardStr = details.cpm ? `Rp${Number(details.cpm).toLocaleString("id-ID")} / 1.000 Views` : "Rp15.000 / 1.000 Views";
    quotaStr = "15 dari 20 Clipper";
    locationStr = details.audienceRegion || "Remote (Seluruh Indonesia)";
    tags = ["Klip & Publish", "Remote Work", "CPM Reward"];
    briefStr = details.brief || `Distribusi konten promosi potongan video (clipping) ${vehicleTitle}. Ambil bahan video mentah berkualitas 4K yang sudah kami sediakan di Google Drive, edit potongan momen paling menarik (kenyamanan suspensi & kabin senyap), pasang auto-caption dinamis, dan publikasikan di channel TikTok/Reels Anda untuk menjangkau calon pembeli MPV keluarga.`;

    specs = [
      { label: "Skema Monetisasi", value: details.cpm ? `CPM Rp${Number(details.cpm).toLocaleString("id-ID")} / 1.000 Tayangan Valid` : "CPM Rp15.000 / 1.000 Views" },
      { label: "Format & Durasi", value: details.videoSpecs || "15 - 45 Detik (Vertikal 9:16)" },
      { label: "Platform Publish", value: details.publishPlatforms || "TikTok, Instagram Reels, YouTube Shorts" },
      { label: "Sumber Materi", value: details.sourceMaterial ? "Google Drive Dealer (Tersedia Siap Download)" : "Footage 4K Disediakan Showroom" },
      { label: "Periode Hitung Views", value: details.viewsCalculationPeriod ? `Siklus Verifikasi ${details.viewsCalculationPeriod} Hari` : "Siklus Verifikasi 7 Hari" },
      { label: "Batas Maks Payout", value: details.maxViewsPerClipper ? `Hingga Rp${Math.floor((Number(details.maxViewsPerClipper) / 1000) * (Number(details.cpm) || 15000)).toLocaleString("id-ID")} per Clipper` : "Hingga Rp500.000 per Clipper" },
      { label: "Call to Action (CTA)", value: details.cta || "Klik tautan di bio untuk info promo dan simulasi kredit" },
      { label: "Ketentuan Konten", value: details.forbiddenContent ? "Patuhi panduan klaim resmi dealer" : "Dilarang memuat klaim diskon tidak resmi" },
    ];

    requirements = Array.isArray(details.requirements) && details.requirements.length > 0
      ? details.requirements
      : [
          "Channel TikTok, Instagram Reels, atau YouTube Shorts aktif dengan audiens Indonesia",
          "Menguasai teknik editing video pendek vertikal (CapCut / Premiere Pro) dengan hook dan caption dinamis",
          "Menjaga keaslian traffic tayangan (Sistem anti-fraud Carpaign memverifikasi views valid)",
          "Mendaftarkan link konten yang sudah tayang melalui dashboard pelaporan kreator"
        ];

    mandatoryHighlights = Array.isArray(details.mandatoryHighlights) && details.mandatoryHighlights.length > 0
      ? details.mandatoryHighlights
      : [
          "Poin keunggulan: Suspensi paling nyaman di kelasnya, ground clearance tinggi, dan kabin senyap",
          "Penawaran spesial: Program DP mulai ringan, bunga 0%, dan gratis kaca film premium",
          "Call to action (CTA): Arahkan pemirsa klik link di bio profil untuk info promo lengkap",
          "Dilarang menggunakan audio non-lisensi yang terkena mute oleh platform media sosial"
        ];
  }

  return {
    id: row.id,
    brand: brandName,
    vehicle: vehicleTitle,
    title: vehicleTitle,
    type: formattedType,
    reward: rewardStr,
    rawBudget: row.budget,
    description: `Kampanye ${formattedType} resmi dari ${brandName}.`,
    image: autoImage,
    quota: quotaStr,
    tags,
    typeColor,
    location: locationStr,
    deadline: `${daysRemaining} Hari`,
    requirements,
    brief: briefStr,
    specs,
    mandatoryHighlights,
    cta: details.cta,
    sourceMaterialUrl: details.sourceMaterial || details.sourceMaterialUrl,
    usageRights: details.usageRights,
    details,
  };
}

export const campaigns: Campaign[] = [
  {
    id: 1,
    brand: "Honda Jakarta Center",
    vehicle: "All New HRV RS",
    type: "Shoot & Edit",
    reward: "Rp1.500.000",
    description: "Ambil footage cinematic exterior dan interior dari HRV RS warna merah. Lokasi: Showroom Kebon Jeruk.",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200",
    quota: "1 dari 3 Kreator",
    tags: ["On-Site", "Cinematic"],
    typeColor: "bg-primary/10 text-primary border-primary/20",
    location: "Kebon Jeruk, Jakarta Barat",
    deadline: "7 Hari",
    requirements: [
      "Kamera minimal Sony A7 IV atau setara (resolusi 4K)",
      "Pengalaman syuting otomotif minimal 3 karya",
      "Bersedia hadir langsung ke showroom",
      "Portofolio video mobil dilampirkan saat apply",
      "NDA wajib ditandatangani sebelum sesi dimulai",
    ],
    brief: "Kami membutuhkan footage cinematic berkualitas tinggi untuk kampanye digital All New HRV RS. Fokus pada detail eksterior (dynamic shot, detail emblem, velg RS), interior premium (dashboard, kursi, layar infotainment), dan satu sequence POV berkendara dari pintu masuk showroom ke jalan raya. Mood: premium, modern, dan sporty.",
    specs: [
      { label: "Durasi Proyek", value: "1 Hari Syuting" },
      { label: "Output File", value: "Raw dan Color Graded 4K" },
      { label: "Format", value: "H.265 atau ProRes" },
      { label: "Aspek Rasio", value: "16:9 dan 9:16 format vertikal" },
    ],
  },
  {
    id: 2,
    brand: "Toyota Auto2000",
    vehicle: "Avanza Veloz 2023",
    type: "UGC & Review",
    reward: "Rp750.000 + Rp5 per view",
    description: "Buat konten review POV keluarga tentang kelapisan kabin Avanza Veloz.",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200",
    quota: "2 dari 5 Kreator",
    tags: ["Review", "Family"],
    typeColor: "bg-primary/10 text-primary border-primary/20",
    location: "Bisa Remote atau Pickup Unit",
    deadline: "14 Hari",
    requirements: [
      "Minimal 10.000 followers Instagram atau TikTok",
      "Niche konten keluarga atau otomotif",
      "Mampu memproduksi konten vertikal format Reels atau TikTok",
      "Penggunaan unit mobil selama maksimal 48 jam",
    ],
    brief: "Buat video review jujur gaya POV seolah-olah Anda adalah kepala keluarga yang baru mengambil unit Avanza Veloz. Highlight fitur: kapasitas bagasi, kenyamanan kursi baris 3, sistem audio, dan efisiensi bahan bakar. Tone: warm, relatable, dan natural, bukan iklan formal.",
    specs: [
      { label: "Panjang Video", value: "60 sampai 90 detik (Reels dan TikTok)" },
      { label: "Platform", value: "Instagram Reels dan TikTok" },
      { label: "Watermark", value: "Boleh branding kreator sendiri" },
      { label: "Monetisasi", value: "Rp5 per 1 view valid selama 30 hari" },
    ],
  },
  {
    id: 3,
    brand: "Hyundai Motors ID",
    vehicle: "Ioniq 5 Signature",
    type: "Shoot & Edit",
    reward: "Rp500.000 per Video",
    description: "Edit raw footage test drive Ioniq 5 menjadi video YouTube 5 menit bergaya dinamis.",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200",
    quota: "0 dari 2 Editor",
    tags: ["Premiere Pro", "Dynamic"],
    typeColor: "bg-primary/10 text-primary border-primary/20",
    location: "Remote (Raw footage dikirim via cloud drive)",
    deadline: "5 Hari per Video",
    requirements: [
      "Menguasai Adobe Premiere Pro atau DaVinci Resolve",
      "Portofolio video otomotif yang sudah diedit sebelumnya",
      "Mampu color grading dengan LUT EV tone futuristik",
      "Dapat deliver dalam 5 hari kerja",
    ],
    brief: "Raw footage test drive Ioniq 5 dari event Jakarta sudah tersedia. Diperlukan editing dengan feel video review channel otomotif premium: opening hook kuat 5 detik, B-roll eksterior dinamis, suara ambient kabin masuk, dan closing CTA yang tidak hard-sell. Referensi gaya editorial Autotrader UK.",
    specs: [
      { label: "Durasi Output", value: "5 sampai 7 menit (YouTube)" },
      { label: "Format Output", value: "H.264 1080p60" },
      { label: "Jumlah Video", value: "3 Video per batch" },
      { label: "Musik", value: "Disediakan dari lisensi Hyundai" },
    ],
  },
  {
    id: 4,
    brand: "BMW Tunas",
    vehicle: "BMW 330i M Sport",
    type: "Clip & Publish",
    reward: "Rp50.000 per Klip",
    description: "Potong video review 10 menit menjadi 10 short hooks untuk TikTok dan Reels.",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200",
    quota: "5 dari 10 Clipper",
    tags: ["Hooks", "TikTok"],
    typeColor: "bg-primary/10 text-primary border-primary/20",
    location: "Remote",
    deadline: "3 Hari",
    requirements: [
      "Mengerti konsep hook TikTok dan Reels yang viral",
      "Mampu bekerja cepat dengan target minimal 5 klip per hari",
      "Pahami tren audio otomotif yang sedang viral",
    ],
    brief: "Tersedia 5 video YouTube BMW 330i M Sport berdurasi 10 menit. Setiap video harus dipotong menjadi 10 short hooks berdurasi 15-30 detik untuk TikTok dan Reels. Fokus pada momen yang paling dramatis: akselerasi, cornering, suara mesin, dan reaksi pengemudi.",
    specs: [
      { label: "Durasi per Clip", value: "15 sampai 45 detik" },
      { label: "Rasio Aspek", value: "9:16 Vertikal" },
      { label: "Caption", value: "Auto caption dari tools yang disediakan" },
      { label: "Total Output", value: "50 Klip dari 5 video" },
    ],
  },
  {
    id: 5,
    brand: "Wuling Arista",
    vehicle: "Wuling Air EV",
    type: "Clip & Publish",
    reward: "Rp20.000 per 1.000 Views",
    description: "Publikasikan materi promosi cicilan ringan Wuling Air EV di channel TikTok otomotif Anda.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200",
    quota: "12 dari 20 Publisher",
    tags: ["Distribution", "Promo"],
    typeColor: "bg-primary/10 text-primary border-primary/20",
    location: "Remote",
    deadline: "30 Hari",
    requirements: [
      "Channel TikTok, YouTube, atau Instagram aktif dengan minimal 5.000 followers",
      "Niche otomotif, lifestyle, atau teknologi",
      "Minimal engagement rate 3%",
    ],
    brief: "Wuling menyediakan materi video siap publish tentang program cicilan ringan Air EV mulai Rp2 jutaan per bulan. Anda cukup publish di channel Anda dengan caption yang disediakan, lalu laporkan views melalui dashboard Carpaign setiap minggu.",
    specs: [
      { label: "Materi", value: "Disediakan oleh Wuling (siap upload)" },
      { label: "Durasi Campaign", value: "30 Hari per siklus" },
      { label: "Reporting", value: "Mingguan via dashboard" },
      { label: "Pembayaran", value: "Rp20.000 per 1.000 valid views" },
    ],
  },
  {
    id: 6,
    brand: "Mitsubishi Dipo",
    vehicle: "Pajero Sport Dakar",
    type: "Shoot & Edit",
    reward: "Rp2.000.000",
    description: "Off-road footage requirement. Kamera drone sangat diutamakan untuk shoot ini.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
    quota: "0 dari 1 Kreator",
    tags: ["Off-road", "Drone"],
    typeColor: "bg-primary/10 text-primary border-primary/20",
    location: "Sentul, Bogor (Off-road track)",
    deadline: "10 Hari",
    requirements: [
      "Memiliki drone DJI Mavic 3 Pro atau setara (wajib)",
      "Sertifikat pilot drone aktif",
      "Pengalaman syuting off-road dan petualangan",
      "Asuransi alat sendiri (peralatan di luar tanggung jawab klien)",
    ],
    brief: "Kami memerlukan footage aerial dan ground-level Pajero Sport Dakar Ultimate Edition saat melintas di track off-road Sentul. Drone shot wajib: bird-eye mengikuti kendaraan, orbit di bukit, dan low-angle saat melewati lumpur. Ground shot: side-tracking, close-up bumper guard, dan reaction pengemudi dari luar kabin.",
    specs: [
      { label: "Lokasi", value: "Sentul Off-road Track, Bogor" },
      { label: "Durasi Syuting", value: "1 Hari Penuh (diutamakan saat matahari terbit)" },
      { label: "Output", value: "Raw 4K dan highlight teredit 2 menit" },
      { label: "Drone Spec", value: "Minimal DJI Mavic 3 atau Air 3" },
    ],
  },
];
