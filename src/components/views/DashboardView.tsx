"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Video, Wallet, Banknote, Flame, Gift, Info, ChevronRight, RefreshCw, Filter } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { TikTokIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/social-icons";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const metricCards = [
  {
    label: "Total Pendapatan",
    value: "Rp0",
    icon: Wallet,
    accent: "bg-primary/20",
    glowColor: "rgba(212, 175, 55, 0.08)",
    waveColor: "from-primary/0 via-primary/25 to-primary/0",
    valueColor: "text-foreground",
    info: true,
  },
  {
    label: "Bisa Dicairkan",
    value: "Rp0",
    subtitle: "Saldo siap ditarik",
    icon: Banknote,
    accent: "bg-primary/10",
    glowColor: "rgba(212, 175, 55, 0.06)",
    waveColor: "from-primary/0 via-primary/20 to-primary/0",
    valueColor: "text-foreground",
  },
  {
    label: "Total Views",
    value: "0",
    suffix: "Views",
    subtitle: "Semua konten terpublikasi",
    icon: Eye,
    accent: "bg-white/5",
    glowColor: "rgba(255, 255, 255, 0.03)",
    waveColor: "from-white/0 via-white/10 to-white/0",
    valueColor: "text-foreground",
  },
  {
    label: "Total Video",
    value: "0",
    suffix: "Video",
    subtitle: "Total video terselesaikan",
    icon: Video,
    accent: "bg-white/5",
    glowColor: "rgba(255, 255, 255, 0.03)",
    waveColor: "from-white/0 via-white/10 to-white/0",
    valueColor: "text-foreground",
  },
];

const campaignCategories = [
  { id: "all", label: "Semua Campaign" },
  { id: "active", label: "Aktif" },
  { id: "pending", label: "Review" },
  { id: "rejected", label: "Ditolak" }
];

const activeCampaigns = [
  {
    id: 1,
    title: "Review Singkat All New HRV Tipe RS",
    category: "Promo Dealer",
    brand: "Honda Jakarta Center",
    reward: "Rp5.000 per 1.000 Views",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
    type: "Clipping",
    views: "24.844",
    socials: ["tiktok", "instagram"],
    categoryTag: "OTOMOTIF"
  },
  {
    id: 2,
    title: "Promo Akhir Tahun Avanza Veloz",
    category: "Review",
    brand: "Toyota Auto2000",
    reward: "Rp3.000 per 1.000 Views",
    image: "https://images.unsplash.com/photo-1629897048514-3dd741427cb1?auto=format&fit=crop&q=80&w=600",
    type: "Clipping",
    views: "33.328",
    socials: ["tiktok", "instagram", "youtube"],
    categoryTag: "DEALER"
  },
  {
    id: 3,
    title: "Test Drive Hyundai Ioniq 5 UGC Contest",
    category: "Test Drive",
    brand: "Hyundai Motors ID",
    reward: "Rp7.000 per 1.000 Views",
    image: "https://images.unsplash.com/photo-1663248386850-8b173ccff5d8?auto=format&fit=crop&q=80&w=600",
    type: "UGC/Review",
    views: "1.712",
    socials: ["tiktok", "youtube"],
    categoryTag: "EV"
  }
];

export function DashboardView({
  initialCampaigns,
  userStats,
}: {
  initialCampaigns?: any[];
  userStats?: {
    totalViews?: number | string;
    totalVideos?: number | string;
    availableBalance?: number | string;
    totalEarnings?: number | string;
  };
} = {}) {
  const router = useRouter();
  const { data: session } = useSession();

  const userName = session?.user?.name || "Kreator";
  const roleName = (session?.user as any)?.role === "dealership" ? "Dealership" : "Kreator";

  const campaignsList =
    initialCampaigns && initialCampaigns.length > 0
      ? initialCampaigns
      : activeCampaigns;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20 relative">
      {/* Welcome Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        custom={0}
        className="flex items-center gap-4"
      >
        <h2 className="text-[22px] font-semibold text-foreground tracking-tight">
          Selamat datang, {userName}
        </h2>
        <Badge
          variant="outline"
          className="border border-[#382C10] text-[#D4AF37] bg-[#1F190B] px-3 py-0.5 text-[10px] font-medium rounded-full shadow-[0_0_10px_rgba(212,175,55,0.1)]"
        >
          {roleName}
        </Badge>
      </motion.div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <motion.div key={card.label} initial="hidden" animate="show" variants={fadeUp} custom={i + 1}>
            <Card 
              className="relative overflow-hidden border-white/5 bg-[#111316] h-[140px] flex flex-col justify-between transition-all hover:bg-[#15181c]"
            >
              <div 
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[150%] h-12 rounded-[100%] blur-[15px] pointer-events-none"
                style={{ backgroundColor: card.glowColor }}
              />
              <div 
                className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${card.waveColor} pointer-events-none`}
              />
              
              <CardContent className="p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-auto">
                  <card.icon className="size-[18px] text-muted-foreground/60" />
                  <span className="text-sm font-medium text-foreground/80">{card.label}</span>
                  {card.info && <Info className="size-3.5 text-muted-foreground/40 ml-1" />}
                </div>
                
                <div className="mt-2 relative z-10">
                  <p className="text-[32px] font-medium tracking-tight leading-none mb-1.5">
                    <span className={card.valueColor}>{card.value}</span>
                    {card.suffix && (
                      <span className={`ml-2 text-sm font-medium opacity-80 ${card.valueColor}`}>
                        {card.suffix}
                      </span>
                    )}
                  </p>
                  {card.subtitle && (
                    <p className="text-[11px] text-muted-foreground">{card.subtitle}</p>
                  )}
                  {!card.subtitle && (
                    <div className="w-4 h-0.5 rounded bg-muted-foreground/20 mt-1" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mission Banner */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={5}>
        <Card className="border border-primary/20 bg-gradient-to-b from-[#181611] to-[#111316] overflow-hidden rounded-xl shadow-[0_0_40px_rgba(212,175,55,0.03)] p-6 relative">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/5 text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <Flame className="size-6 fill-primary/20" />
              </div>
              <div className="flex flex-col gap-1 mt-0.5">
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  MISI UANG GRATIS!
                </h3>
                <p className="text-sm text-muted-foreground/80">
                  Submit 1 video per hari sampai 7 kali
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="h-10 rounded-full border-primary/30 bg-[#1F190B]/50 hover:bg-[#1F190B] text-primary font-bold text-[13px] px-5 gap-2 shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all"
            >
              <Gift className="size-4" />
              RP 15.000
            </Button>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-6">
            {["H1", "H2", "H3", "H4", "H5", "H6"].map((day) => (
              <div 
                key={day}
                className="flex items-center justify-center h-20 rounded-xl bg-[#1A1C20] border border-white/5 text-sm font-medium text-muted-foreground/80 transition-colors hover:bg-white/5"
              >
                {day}
              </div>
            ))}
            {/* Special H7 Box */}
            <div className="flex flex-col items-center justify-center h-20 rounded-xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/40 text-sm font-bold text-primary shadow-[0_0_20px_rgba(212,175,55,0.15)] gap-1.5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <Gift className="size-5 mb-0.5 relative z-10" />
              <span className="relative z-10">H7</span>
            </div>
          </div>

          {/* Claim Stats */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2">
              <Avatar className="size-7 border-2 border-[#111316]">
                <AvatarFallback className="bg-white/10 text-white/90 text-[9px] font-bold border border-white/10">DA</AvatarFallback>
              </Avatar>
              <Avatar className="size-7 border-2 border-[#111316]">
                <AvatarFallback className="bg-white/10 text-white/90 text-[9px] font-bold border border-white/10">RE</AvatarFallback>
              </Avatar>
              <Avatar className="size-7 border-2 border-[#111316]">
                <AvatarFallback className="bg-white/10 text-white/90 text-[9px] font-bold border border-white/10">NC</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm">
              <span className="text-primary font-bold">1.000+</span>{" "}
              <span className="text-muted-foreground/80">Orang Telah Claim Hadiah</span>
            </p>
          </div>

          {/* Bottom Progress Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#15171A] border border-white/5">
            <p className="text-sm text-foreground/90 font-medium">
              Submit 1 Video hari ini
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-[#0A0A0C] border border-white/5 rounded-full pl-4 pr-1 py-1">
                <span className="text-sm font-medium text-foreground">Onboarding Progress</span>
                <div className="flex items-center gap-1.5 bg-[#1F190B] border border-primary/20 rounded-full px-3 py-1">
                  <div className="size-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-[spin_3s_linear_infinite]" />
                  <span className="text-[11px]"><span className="text-primary font-bold">1 dari 3 langkah</span> <span className="text-muted-foreground">selesai</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-[13px] text-muted-foreground">
              0 dari 7 hari, <span className="text-foreground font-semibold">tersisa 7 hari lagi</span>
            </p>
            <Button variant="link" className="text-muted-foreground hover:text-foreground text-[13px] h-auto p-0 gap-1">
              Aturan misi
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Floating Onboarding Progress Toast Approximation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-3 bg-[#0A0A0C] border border-white/10 rounded-full pl-5 pr-2 py-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      >
        <span className="text-[13px] font-medium text-foreground">Onboarding Progress</span>
        <div className="flex items-center gap-1.5 bg-[#1F190B] border border-primary/20 rounded-full px-3 py-1">
          <div className="size-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-[spin_3s_linear_infinite]" />
          <span className="text-[11px]"><span className="text-primary font-bold">1 dari 3 langkah</span> <span className="text-muted-foreground">selesai</span></span>
        </div>
      </motion.div>

      {/* Video Kamu Section */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={6}>
        <Card className="border-white/5 bg-[#0a0a0c] overflow-hidden rounded-xl shadow-none border">
          <CardContent className="p-0">
            {/* Header Area inside Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 pb-2 gap-4">
              <h3 className="text-[19px] font-semibold text-foreground tracking-tight">Video Kamu</h3>
              <div className="flex items-center justify-between sm:justify-start gap-3 text-[12px] text-muted-foreground bg-[#15171A] border border-white/5 px-4 py-2 rounded-full font-medium w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <RefreshCw className="size-3.5 text-primary/70" />
                  <span>Refresh Views dalam</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground tracking-wider">09:29:32</span>
                  <ChevronRight className="size-3.5 rotate-90 opacity-50" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <div className="w-full overflow-x-auto no-scrollbar border-b border-white/5 px-6">
                <TabsList className="bg-transparent gap-8 h-auto p-0 inline-flex justify-start">
                  {campaignCategories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="rounded-none border-b-[3px] border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent text-muted-foreground/60 text-[13px] font-medium px-1 pb-3 pt-3 transition-colors shrink-0"
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {campaignCategories.map((cat) => (
                  <TabsContent key={cat.id} value={cat.id} className="mt-0 outline-none">
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[200px] h-9 text-[13px] bg-transparent border-white/10 hover:bg-white/5 transition-colors rounded-lg">
                          <SelectValue placeholder="Semua campaign" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua campaign</SelectItem>
                          <SelectItem value="honda">Honda Jakarta</SelectItem>
                          <SelectItem value="toyota">Toyota Auto2000</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-lg w-full sm:w-auto px-4">
                        Urutkan dari
                        <Filter className="size-3.5" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-transparent py-20 text-center">
                      <p className="text-[13px] text-muted-foreground/60">Belum ada submission untuk campaign ini.</p>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Semua Campaign Aktif */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={7} className="mb-8 mt-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4">
          <h3 className="text-[19px] font-semibold text-foreground tracking-tight">Semua Campaign Aktif</h3>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="icon" className="size-9 bg-[#15171A] border-transparent hover:bg-white/10 text-muted-foreground rounded-lg shrink-0">
              <Filter className="size-4" />
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="h-9 text-[13px] bg-[#15171A] border-transparent hover:bg-white/10 w-[130px] rounded-lg shrink-0 font-medium">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="dealer">Dealer</SelectItem>
                <SelectItem value="test-drive">Test Drive</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="h-9 text-[13px] bg-[#15171A] border-transparent hover:bg-white/10 w-[140px] rounded-lg shrink-0 font-medium">
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="clipping">Clipping</SelectItem>
                <SelectItem value="ugc">UGC/Review</SelectItem>
                <SelectItem value="videographer">Videographer/Edit</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Social Icons Filters */}
            <div className="flex items-center gap-2 ml-2">
              <Button variant="outline" size="icon" className="size-9 bg-[#15171A] border-transparent hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-lg shrink-0" title="TikTok">
                <TikTokIcon className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-9 bg-[#15171A] border-transparent hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-lg shrink-0" title="Instagram">
                <InstagramIcon className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-9 bg-[#15171A] border-transparent hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-lg shrink-0" title="YouTube">
                <YouTubeIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {campaignsList.map((campaign, i) => (
            <motion.div key={campaign.id} initial="hidden" animate="show" variants={fadeUp} custom={8 + i}>
              <Card 
                onClick={() => router.push(`/creator/campaigns/${campaign.id}`)}
                className="group cursor-pointer border-transparent bg-[#111316] hover:bg-[#15171A] transition-all duration-300 overflow-hidden shadow-none rounded-2xl flex flex-col h-full border border-white/5"
              >
                {/* Image Section */}
                <div className="relative h-[220px] w-full bg-muted/20 overflow-hidden">
                  <img 
                    src={campaign.image} 
                    alt={campaign.brand}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-[#111316]/60 to-transparent" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-[11px] font-bold text-foreground/80 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded">
                      Film <span className="text-primary">{campaign.category}</span>
                    </span>
                  </div>
                  
                  {/* Bottom Elements (Inside Image Area) */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                        <span className="text-[8px] font-bold text-white">Car</span>
                      </div>
                      <span className="text-[12px] font-medium text-foreground">{campaign.brand}</span>
                    </div>
                    <Badge className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-[10px] text-muted-foreground uppercase border-white/10 px-3 font-semibold">
                      {campaign.type}
                    </Badge>
                  </div>
                </div>

                {/* Details Section */}
                <CardContent className="p-5 pt-4 flex flex-col grow">
                  <h4 className="font-bold text-[15px] text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {campaign.title}
                  </h4>
                  
                  <div className="flex items-center gap-1.5 mb-5 mt-1">
                    <p className="text-[15px] font-bold text-foreground">{campaign.reward}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-auto">
                    {/* Social Icons */}
                    <div className="flex items-center gap-1.5 mr-2 text-muted-foreground/70">
                      {campaign.socials.includes('tiktok') && <TikTokIcon className="size-3.5" />}
                      {campaign.socials.includes('instagram') && <InstagramIcon className="size-3.5" />}
                      {campaign.socials.includes('youtube') && <YouTubeIcon className="size-3.5" />}
                    </div>
                    <Badge variant="secondary" className="text-[9px] uppercase tracking-wider bg-white/5 text-muted-foreground/80 hover:bg-white/10 transition-colors px-2.5 py-0.5 rounded font-bold border-transparent">
                      {campaign.categoryTag}
                    </Badge>
                    <div className="flex items-center gap-1.5 ml-auto text-muted-foreground/60 bg-white/5 px-2.5 py-0.5 rounded-full">
                      <Eye className="size-3" />
                      <span className="text-[10px] font-semibold">{campaign.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
