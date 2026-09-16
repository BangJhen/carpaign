export type Campaign = {
  id: number;
  brand: string;
  vehicle: string;
  type: string;
  reward: string;
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
};

export const campaigns: Campaign[] = [
  {
    id: 1,
    brand: "Honda Jakarta Center",
    vehicle: "All New HRV RS",
    type: "Videographer/Edit",
    reward: "Rp1.500.000",
    description: "Ambil footage cinematic exterior dan interior dari HRV RS warna merah. Lokasi: Showroom Kebon Jeruk.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200",
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
    type: "UGC/Review",
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
    type: "Videographer/Edit",
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
    type: "Clipping",
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
    type: "Clipping",
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
    type: "Videographer/Edit",
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
