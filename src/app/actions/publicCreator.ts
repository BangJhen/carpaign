"use server";

import { db } from "@/db/db";
import { creatorProfiles } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { eq, or } from "drizzle-orm";

export type PublicPromotedCampaign = {
  id: string | number;
  title: string;
  brand: string;
  vehicle: string;
  type: string;
  image: string;
  promoHighlight: string;
  description: string;
  location: string;
  deadline: string;
  reward?: string;
  tags: string[];
  brief: string;
  specs: { label: string; value: string }[];
  dealerPhone?: string;
};

export type PublicCreatorProfile = {
  fullName: string | null;
  username: string | null;
  city: string | null;
  bio: string | null;
  phone?: string | null;
  tiktokUsername: string | null;
  instagramUsername: string | null;
  youtubeUsername: string | null;
  avatarImage: string | null;
  coverImage: string | null;
  referralCode: string | null;
  tier: number | null;
  joinedAt: Date;
  promotedCampaigns?: PublicPromotedCampaign[];
};

const DEFAULT_PROMOTED_CAMPAIGNS: PublicPromotedCampaign[] = [
  {
    id: 1,
    title: "All New Honda HR-V RS — Paket Spesial Showroom Kebon Jeruk",
    brand: "Honda Jakarta Center",
    vehicle: "Honda HR-V RS Turbo 2024",
    type: "Shoot & Edit",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200",
    promoHighlight: "DP Mulai 15% & Free Servis 4 Tahun",
    description: "Unit SUV sporty premium dengan Honda Sensing lengkap, panoramic sunroof, dan mesin 1.5L VTEC Turbo.",
    location: "Kebon Jeruk, Jakarta Barat",
    deadline: "7 Hari Lagi",
    reward: "Rp1.500.000",
    tags: ["SUV Premium", "Honda Sensing", "Ready Stock"],
    brief: "Review mendalam seputar akselerasi mesin turbo, kelegaan kabin, serta kenyamanan handling harian di perkotaan.",
    specs: [
      { label: "Mesin", value: "1.5L VTEC Turbo 177 PS" },
      { label: "Transmisi", value: "CVT Otomatis" },
      { label: "Fitur Keselamatan", value: "Honda SENSING Suite" },
      { label: "Kapasitas", value: "5 Penumpang" },
    ],
    dealerPhone: "6281234567890",
  },
  {
    id: 2,
    title: "Toyota All New Veloz 2024 — Pilihan Favorit Keluarga Indonesia",
    brand: "Toyota Auto2000 Sudirman",
    vehicle: "Toyota Veloz Q CVT TSS",
    type: "UGC & Review",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200",
    promoHighlight: "Bunga 0% Tenor 1 Tahun + Bonus Asuransi",
    description: "MPV modern dengan fitur keselamatan Toyota Safety Sense, wireless charger, dan kabin lega 7-seater.",
    location: "Sudirman, Jakarta Pusat",
    deadline: "14 Hari Lagi",
    reward: "Rp750.000",
    tags: ["Family MPV", "TSS Safety", "Cicilan Ringan"],
    brief: "Ulasan POV keluarga mengenai kenyamanan kursi baris kedua, kesenyapan kabin, dan konsumsi BBM yang hemat.",
    specs: [
      { label: "Mesin", value: "1.5L Dual VVT-i 106 PS" },
      { label: "Transmisi", value: "CVT 7-Speed Sequential" },
      { label: "Fitur Unggulan", value: "Toyota Safety Sense (TSS)" },
      { label: "Kapasitas", value: "7 Penumpang" },
    ],
    dealerPhone: "6281234567891",
  },
  {
    id: 3,
    title: "Hyundai Ioniq 5 Signature — Era Baru Mobil Listrik Futuristik",
    brand: "Hyundai Motors Indonesia",
    vehicle: "Hyundai Ioniq 5 Signature Long Range",
    type: "Shoot & Edit",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200",
    promoHighlight: "Garansi Baterai 8 Tahun + Free Wall Charger",
    description: "Kendaraan listrik murni dengan jarak tempuh hingga 451 km, fitur V2L untuk suplai daya eksternal, dan fast charging.",
    location: "SCBD, Jakarta Selatan",
    deadline: "5 Hari Lagi",
    reward: "Rp500.000",
    tags: ["Electric Vehicle", "Ultra Fast Charge", "V2L Ready"],
    brief: "Pengalaman berkendara mobil listrik senyap bertenaga instan serta kemudahan pengisian daya di SPKLU.",
    specs: [
      { label: "Jarak Tempuh", value: "Hingga 451 km (WLTP)" },
      { label: "Kapasitas Baterai", value: "72.6 kWh Liquid Cooled" },
      { label: "Pengisian Daya", value: "10-80% dalam 18 Menit" },
      { label: "Fitur Canggih", value: "Vehicle-to-Load (V2L) 3.6 kW" },
    ],
    dealerPhone: "6281234567892",
  },
  {
    id: 4,
    title: "BMW 330i M Sport — Sensasi Sedan Sport Jerman Sejati",
    brand: "BMW Tunas Tomang",
    vehicle: "BMW 330i M Sport Pro 2024",
    type: "Clip & Publish",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200",
    promoHighlight: "Free Service 5 Tahun & BSI Warranty",
    description: "Sedan premium dengan karakter berkendara presisi, M Sport Aerodynamics, dan BMW Curved Display beresolusi tinggi.",
    location: "Tomang, Jakarta Barat",
    deadline: "3 Hari Lagi",
    reward: "Rp50.000 per Klip",
    tags: ["Luxury Sport", "M Performance", "BSI Warranty"],
    brief: "Klip video akselerasi 0-100 km/j, knalpot sport M, dan kemewahan interior cockpit pengemudi.",
    specs: [
      { label: "Mesin", value: "2.0L TwinPower Turbo 258 hp" },
      { label: "Torsi", value: "400 Nm @ 1.550 - 4.400 rpm" },
      { label: "Akselerasi", value: "0-100 km/j dalam 5.8 detik" },
      { label: "Interior", value: "BMW Operating System 8.5" },
    ],
    dealerPhone: "6281234567893",
  },
  {
    id: 5,
    title: "Wuling Air EV Long Range — Solusi Cerdas Mobilitas Perkotaan",
    brand: "Wuling Arista Kalimalang",
    vehicle: "Wuling Air EV Long Range",
    type: "Clip & Publish",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200",
    promoHighlight: "Cicilan Ringan Mulai Rp2 Jutaan / Bulan",
    description: "Mobil listrik kompak yang lincah di kemacetan, mudah parkir di mana saja, dan bebas ganjil genap Jakarta.",
    location: "Kalimalang, Jakarta Timur",
    deadline: "30 Hari Lagi",
    reward: "Rp20.000 / 1K Views",
    tags: ["City EV", "Bebas Ganjil Genap", "Easy Park"],
    brief: "Ulasan kepraktisan harian, biaya cas listrik super hemat, dan fitur easy charging di stopkontak rumah.",
    specs: [
      { label: "Jarak Tempuh", value: "300 km per pengisian" },
      { label: "Baterai", value: "26.7 kWh IP67 Waterproof" },
      { label: "Fitur", value: "Wuling Indonesian Command (WIND)" },
      { label: "Radius Putar", value: "3.7 meter (Sangat Lincah)" },
    ],
    dealerPhone: "6281234567894",
  },
  {
    id: 6,
    title: "Mitsubishi Pajero Sport Dakar Ultimate 4x4 — Raja Segala Medan",
    brand: "Mitsubishi Dipo Alam Sutera",
    vehicle: "Pajero Sport Dakar Ultimate 4x4",
    type: "Shoot & Edit",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
    promoHighlight: "Diskon PPnBM + Paket Aksesoris Resmi",
    description: "Tough SUV ladder-frame dengan sistem penggerak Super Select 4WD-II, sunroof, dan adaptive cruise control.",
    location: "Alam Sutera, Tangerang Selatan",
    deadline: "10 Hari Lagi",
    reward: "Rp2.000.000",
    tags: ["4x4 SUV", "Off-Road Ready", "Super Select 4WD"],
    brief: "Aksi ketangguhan di medan off-road, kemampuan melibas genangan, serta kenyamanan suspensi saat touring luar kota.",
    specs: [
      { label: "Mesin", value: "2.4L MIVEC Turbo Diesel 181 PS" },
      { label: "Transmisi", value: "8-Speed Automatic" },
      { label: "Sistem Penggerak", value: "Super Select 4WD-II" },
      { label: "Ground Clearance", value: "218 mm" },
    ],
    dealerPhone: "6281234567895",
  },
];

/** Fetch the public (non-sensitive) profile of a creator by their referral code, username, or name. */
export async function getPublicCreatorByRef(
  ref: string
): Promise<PublicCreatorProfile | null> {
  const normalizedRef = ref.toLowerCase().trim();
  const cleanUsername = normalizedRef.replace(/^@/, "");

  let rows = await db
    .select({
      fullName: creatorProfiles.fullName,
      userNameFallback: user.name,
      username: creatorProfiles.username,
      city: creatorProfiles.city,
      bio: creatorProfiles.bio,
      phone: creatorProfiles.phone,
      tiktokUsername: creatorProfiles.tiktokUsername,
      instagramUsername: creatorProfiles.instagramUsername,
      youtubeUsername: creatorProfiles.youtubeUsername,
      avatarImage: creatorProfiles.avatarImage,
      userImageFallback: user.image,
      coverImage: creatorProfiles.coverImage,
      userCoverFallback: user.coverImage,
      referralCode: creatorProfiles.referralCode,
      tier: user.tier,
      joinedAt: user.createdAt,
    })
    .from(creatorProfiles)
    .innerJoin(user, eq(creatorProfiles.userId, user.id))
    .where(
      or(
        eq(creatorProfiles.referralCode, normalizedRef),
        eq(creatorProfiles.referralCode, cleanUsername),
        eq(creatorProfiles.username, cleanUsername),
        eq(creatorProfiles.username, `@${cleanUsername}`),
        eq(user.name, normalizedRef),
        eq(user.name, cleanUsername)
      )
    )
    .limit(1);

  if (rows.length === 0) {
    // If no exact match found, query the most recently updated creator profile as fallback
    const fallbackRows = await db
      .select({
        fullName: creatorProfiles.fullName,
        userNameFallback: user.name,
        username: creatorProfiles.username,
        city: creatorProfiles.city,
        bio: creatorProfiles.bio,
        phone: creatorProfiles.phone,
        tiktokUsername: creatorProfiles.tiktokUsername,
        instagramUsername: creatorProfiles.instagramUsername,
        youtubeUsername: creatorProfiles.youtubeUsername,
        avatarImage: creatorProfiles.avatarImage,
        userImageFallback: user.image,
        coverImage: creatorProfiles.coverImage,
        userCoverFallback: user.coverImage,
        referralCode: creatorProfiles.referralCode,
        tier: user.tier,
        joinedAt: user.createdAt,
      })
      .from(creatorProfiles)
      .innerJoin(user, eq(creatorProfiles.userId, user.id))
      .limit(1);

    if (fallbackRows.length > 0) {
      rows = fallbackRows;
    } else {
      return null;
    }
  }

  const row = rows[0];

  return {
    fullName: row.fullName || row.userNameFallback || "Kreator Otomotif",
    username: row.username || normalizedRef,
    city: row.city || "Jakarta Selatan, Indonesia",
    bio: row.bio || "Kreator otomotif yang menyajikan ulasan kendaraan terbaru dan penawaran promo dealer resmi.",
    phone: row.phone,
    tiktokUsername: row.tiktokUsername || "kreator.otomotif",
    instagramUsername: row.instagramUsername || "kreator.otomotif",
    youtubeUsername: row.youtubeUsername || "kreatorotomotif",
    avatarImage: row.avatarImage || row.userImageFallback || null,
    coverImage: row.coverImage || row.userCoverFallback || null,
    referralCode: row.referralCode || normalizedRef,
    tier: row.tier || 1,
    joinedAt: row.joinedAt || new Date(),
    promotedCampaigns: DEFAULT_PROMOTED_CAMPAIGNS,
  };
}

/** Fetch public campaign details by ID with creator referral attribution. */
export async function getPublicCampaignDetail(
  campaignId: string | number,
  ref?: string
): Promise<{ campaign: PublicPromotedCampaign; creator: PublicCreatorProfile | null } | null> {
  const idStr = String(campaignId);
  const found = DEFAULT_PROMOTED_CAMPAIGNS.find((c) => String(c.id) === idStr);

  let creator: PublicCreatorProfile | null = null;
  if (ref) {
    creator = await getPublicCreatorByRef(ref);
  }

  if (!found) return null;

  return {
    campaign: found,
    creator,
  };
}
