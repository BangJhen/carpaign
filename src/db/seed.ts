import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";
import * as dotenv from "dotenv";
import { eq, or } from "drizzle-orm";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

async function main() {
  console.log("Seeding dummy dealer data...");
  const connection = await mysql.createConnection(connectionString!);
  const db = drizzle(connection, { schema, mode: "default" });

  // Update dealer@carpaign.id and dealer@auto.com to dealership role if present
  await db
    .update(authSchema.user)
    .set({ role: "dealership" })
    .where(
      or(
        eq(authSchema.user.email, "dealer@carpaign.id"),
        eq(authSchema.user.email, "dealer@auto.com")
      )
    );

  // Get primary dealership user (dealer@carpaign.id)
  const dealers = await db
    .select()
    .from(authSchema.user)
    .where(eq(authSchema.user.email, "dealer@carpaign.id"));

  if (dealers.length === 0) {
    console.log("No dealership user found (dealer@carpaign.id). Skipping seed.");
    process.exit(0);
  }

  for (const dealer of dealers) {
    const dealerId = dealer.id;
    console.log(`Processing dealer: ${dealer.name} (${dealer.email} - ${dealerId})`);

    // Seed Profile
    await db
      .insert(schema.dealerProfiles)
      .ignore()
      .values({
        userId: dealerId,
        dealerName: dealer.name || "AutoPremium Jakarta",
        picName: "Budi Santoso",
        phone: "+62 812-3456-7890",
        businessEmail: dealer.email,
        address: "Jl. Gatot Subroto Kav. 51, Jakarta Selatan",
      });

    // Seed Vehicles
    const mockVehicles = [
      { name: "Honda Brio RS", year: 2024, color: "Crystal Black Pearl", location: "Jakarta Selatan", status: "available", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200" },
      { name: "Toyota Veloz", year: 2023, color: "Silver Metallic", location: "Jakarta Selatan", status: "in_use", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200" },
      { name: "Mitsubishi Xpander", year: 2024, color: "Diamond White", location: "Tangerang", status: "available", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200" },
      { name: "Suzuki Jimny", year: 2023, color: "Kinetic Yellow", location: "Jakarta Barat", status: "in_use", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200" },
    ];

    for (const v of mockVehicles) {
      await db.insert(schema.vehicles).ignore().values({
        dealerId,
        name: v.name,
        year: v.year,
        color: v.color,
        location: v.location,
        status: v.status,
        image: v.image,
      });
    }

    // Seed Campaigns with rich dealer details
    const mockCampaigns = [
      {
        title: "Honda Brio RS UGC Challenge 2026",
        type: "UGC/Review" as const,
        budget: 15000000,
        deadline: new Date(Date.now() + 14 * 86400000),
        status: "active" as const,
        applicantsCount: 24,
        views: "68.4K",
        details: {
          mainObjective: "Meningkatkan brand awareness unit Honda Brio RS dan mendorong booking test drive anak muda.",
          audienceRegion: "Jabodetabek & Nasional",
          publishPlatforms: "TikTok, Instagram Reels",
          contentType: "Review Unit POV & City Lifestyle Drive",
          contentGuidelines: "Format video ulasan santai, natural, percaya diri, dan relatable gaya POV anak muda perkotaan.",
          mandatoryPoints: "Wajib sebutkan promo DP Ringan mulai 10 Juta, konsumsi BBM tembus 20 km/liter, dan kelincahan putar di gang sempit.",
          videosPerCreator: 1,
          videoSpecs: "45 - 60 Detik (Format Vertikal 9:16)",
          cta: "Klik link di bio profil saya untuk konsultasi promo DP & jadwalkan test drive gratis di AutoPremium!",
          captionHashtagTags: "@autopremiumjkt #HondaBrioRS #CarpaignID #MobilPertama #PromoBrio",
          revisionLimit: 1,
          requiredDeliverables: "publish",
          usageRights: "Boleh di-repost akun dealer & digunakan untuk Ads berbayar",
          creatorCount: 5,
          feePerCreator: 1500000,
          productionMethod: "visit",
          productionLocation: "Showroom AutoPremium Kebon Jeruk, Jakarta Barat",
          draftDeadline: "2026-10-15",
          publishDeadline: "2026-10-22",
          creatorCriteria: "Akun TikTok/IG min. 5.000 followers, engagement rate > 3%, niche otomotif/lifestyle/vlog.",
          thumbnail: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200",
          brief: "Pembuatan video ulasan jujur dan menarik (POV Creator) bertema mobil pertama terbaik untuk anak muda dan pekerja urban. Soroti kelincahan handling berkendara di perkotaan, efisiensi bahan bakar yang sangat irit, desain sporty RS, serta kepraktisan kabin untuk aktivitas harian.",
          requirements: [
            "Memiliki akun TikTok atau Instagram dengan minimal 5.000 followers aktif",
            "Niche konten otomotif, lifestyle, daily vlog, atau teknologi",
            "Engagement rate akun minimal 3% dalam 30 hari terakhir",
            "Mampu menyampaikan ulasan secara natural, komunikatif di depan kamera, dan audio jernih"
          ],
          mandatoryHighlights: [
            "Hook 3 detik awal yang memikat (contoh: 'Kenapa mobil ini tetap jadi pilihan no. 1?')",
            "Kenyamanan interior: Head unit layar sentuh, audio steering switch, dan ruang bagasi fleksibel",
            "Highlight promo dealer: Paket kredit DP mulai 10 Juta + gratis servis berkala hingga 50.000 km",
            "Call to Action (CTA) wajib di ending video dan caption untuk klik bio kreator"
          ]
        },
      },
      {
        title: "Toyota Veloz Cinematic Shoot Showcase",
        type: "Videographer/Edit" as const,
        budget: 20000000,
        deadline: new Date(Date.now() + 21 * 86400000),
        status: "active" as const,
        applicantsCount: 18,
        views: "45.2K",
        details: {
          serviceType: "footage_and_edit",
          usagePurpose: "Iklan digital & konten showcase showroom media sosial",
          targetPlatform: "TikTok, Instagram Reels, YouTube Shorts",
          shotList: "1. Dynamic exterior roller shot & front fascia\n2. Interior cockpit & sofa mode seat flexibility\n3. Ambient lighting & wireless charging sequence\n4. Cinematic driving POV exit showroom",
          sessionDuration: "1 Hari Penuh (09:00 - 16:00 WIB)",
          editingGuidelines: "Tone commercial elegan, color grading natural contrast dengan cinematic lighting, sound design ambient mesin halus.",
          outputCount: 2,
          outputDuration: "30 - 60 Detik",
          outputSpecs: "Vertikal (9:16), 4K UHD 60fps",
          mandatoryPoints: "Wajib highlight fitur Toyota Safety Sense (TSS), lampu LED sequential, kabin 7-seater lega, dan emblem Veloz Q.",
          talentRequirements: "1 Talent pengemudi disediakan oleh dealer.",
          revisionLimit: 2,
          usageRights: "Komersial & Bebas untuk Iklan Ads",
          feeAmount: 2500000,
          productionLocation: "Showroom AutoPremium, Jl. Gatot Subroto Kav. 51, Jakarta Selatan",
          productionSchedule: "Sabtu, 10 Oktober 2026",
          draftDeadline: "2026-10-17",
          finalDeadline: "2026-10-24",
          providerCriteria: "Peralatan kamera min. Sony A7 IV / Mirrorless 4K, gimbal stabilizer 3-axis, audio wireless kit.",
          thumbnail: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200",
          brief: "Pengambilan footage sinematik eksterior dan interior Toyota All New Veloz 2024 di area showroom dan rute perkotaan sekitar. Fokus pada dynamic roller shot, pencahayaan dramatis lekuk bodi, detail fitur kabin modern, serta transisi mulus yang memikat audiens muda dan keluarga.",
          requirements: [
            "Kamera mirrorless/cinema minimal resolusi 4K dengan stabilizer gimbal 3-axis",
            "Portofolio video otomotif sinematik aktif (sertakan link saat mendaftar)",
            "Bersedia hadir langsung untuk sesi syuting di Showroom AutoPremium Jakarta",
            "Menandatangani NDA dan mematuhi SOP keselamatan unit pameran dealer"
          ],
          mandatoryHighlights: [
            "Hero shot eksterior: Grille trapesium khas Veloz, velg alloy two-tone 17 inci, dan lampu LED sequential",
            "Fitur kabin: Dashboard two-tone modern, wireless charging pad, dan sofa mode kursi baris kedua",
            "Sequence dinamis: Mobil melaju keluar showroom dengan dynamic tracking shot mulus",
            "Color grading: Clean commercial look dengan kontras tajam dan tone warna natural"
          ]
        },
      },
      {
        title: "Mitsubishi Xpander Promo Clipping Rush",
        type: "Clipping" as const,
        budget: 8000000,
        deadline: new Date(Date.now() + 7 * 86400000),
        status: "active" as const,
        applicantsCount: 16,
        views: "36.0K",
        details: {
          description: "Kampanye kliping video promosi Mitsubishi New Xpander untuk menjangkau keluarga muda di TikTok dan Reels.",
          audienceRegion: "Nasional (Seluruh Indonesia)",
          publishPlatforms: "TikTok, Instagram Reels, YouTube Shorts",
          sourceMaterial: "https://drive.google.com/drive/folders/carpaign-xpander-raw-footage",
          contentGuidelines: "Ambil footage 4K yang telah disediakan di Google Drive, potong momen paling dramatis, beri caption dinamis dan hook audio yang sedang tren.",
          mandatoryPoints: "Wajib cantumkan info promo: DP mulai 15 Juta atau Bunga 0% tenor 1 tahun.",
          videoSpecs: "15 - 45 Detik (Format Vertikal 9:16)",
          captionHashtagTags: "@autopremiumjkt #MitsubishiXpander #XpanderUltimate #CarpaignID #PromoMobilKeluarga",
          cta: "Info simulasi cicilan dan test drive langsung ke rumah, cek tautan di bio!",
          forbiddenContent: "Dilarang memuat klaim diskon yang tidak valid, dilarang merusak citra brand, dilarang menggunakan bot views.",
          cpm: 15000,
          maxViewsPerClipper: 100000,
          viewsCalculationPeriod: 7,
          thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
          brief: "Distribusi konten promosi potongan video (clipping) New Xpander Ultimate. Ambil bahan video mentah berkualitas 4K yang sudah kami sediakan di Google Drive, edit potongan momen paling menarik (kenyamanan suspensi & kabin senyap), pasang auto-caption dinamis, dan publikasikan di channel TikTok/Reels Anda untuk menjangkau calon pembeli MPV keluarga.",
          requirements: [
            "Channel TikTok, Instagram Reels, atau YouTube Shorts aktif dengan audiens Indonesia",
            "Menguasai teknik editing video pendek vertikal (CapCut / Premiere Pro) dengan hook dan caption dinamis",
            "Menjaga keaslian traffic tayangan (Sistem anti-fraud Carpaign memverifikasi views valid)",
            "Mendaftarkan link konten yang sudah tayang melalui dashboard pelaporan kreator"
          ],
          mandatoryHighlights: [
            "Poin keunggulan: Suspensi paling nyaman di kelas MPV, ground clearance 220mm, dan kabin senyap kedap suara",
            "Penawaran spesial: Program DP mulai Rp15 Jutaan, bunga 0%, dan gratis kaca film premium",
            "Call to action (CTA): Arahkan pemirsa klik link di bio profil untuk info promo lengkap",
            "Dilarang menggunakan audio non-lisensi yang terkena mute oleh platform media sosial"
          ]
        },
      },
    ];

    for (const c of mockCampaigns) {
      await db.insert(schema.campaigns).ignore().values({
        dealerId,
        title: c.title,
        type: c.type,
        budget: c.budget,
        deadline: c.deadline,
        status: c.status,
        applicantsCount: c.applicantsCount,
        views: c.views,
        promotionalFocus: "dealer",
        details: c.details,
      });
    }
  }

  console.log("Seeding complete successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
