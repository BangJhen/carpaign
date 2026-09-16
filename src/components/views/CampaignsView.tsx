"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Video, Scissors, Film, Share2, LayoutGrid, Filter, CircleDollarSign, Car, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { campaigns, type Campaign } from "@/lib/campaigns-data";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const jobTypes = [
  { id: "all", label: "Semua", icon: LayoutGrid, color: "text-muted-foreground", campaignType: "all" },
  { id: "clipping", label: "Clipping", icon: Scissors, color: "text-muted-foreground", campaignType: "Clipping" },
  { id: "ugc", label: "UGC/Review", icon: Video, color: "text-muted-foreground", campaignType: "UGC/Review" },
  { id: "videographer", label: "Videographer/Edit", icon: Camera, color: "text-muted-foreground", campaignType: "Videographer/Edit" },
];

const featuredCampaigns = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1600",
    title: "BMW X5 Test Drive dan Review Experience",
    brand: "BMW Tunas",
    brandLogo: "BMW",
    type: "UGC/Review",
    reward: "Rp5.000",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1600",
    title: "Lexus RX Luxury Review",
    brand: "Lexus Gallery",
    brandLogo: "L",
    type: "Videographer/Edit",
    reward: "Rp7.500",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1600",
    title: "Porsche 911 Carrera S Cinematic",
    brand: "Porsche Centre",
    brandLogo: "P",
    type: "Clipping",
    reward: "Rp10.000",
  }
];


export function CampaignsView({ initialCampaigns }: { initialCampaigns?: Campaign[] } = {}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  const allCampaigns = initialCampaigns && initialCampaigns.length > 0 ? initialCampaigns : campaigns;
  const goToJob = (id: number | string) => router.push(`/creator/campaigns/${id}`);

  const selectedJobType = jobTypes.find(t => t.id === activeTab);
  const filteredCampaigns = activeTab === "all" 
    ? allCampaigns 
    : allCampaigns.filter(c => c.type === selectedJobType?.campaignType);

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20 relative">
      
      {/* Featured Campaign Carousel */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
            }),
          ]}
          className="relative w-full rounded-2xl overflow-hidden group h-[420px]"
        >
          <CarouselContent className="h-full ml-0">
            {featuredCampaigns.map((featured) => (
              <CarouselItem key={featured.id} className="relative w-full h-[420px] pl-0">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={featured.image} 
                    alt={featured.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Gradients for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/90 via-[#0a0a0c]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center max-w-[700px]">
                  <Badge className="bg-primary text-primary-foreground font-black tracking-widest text-[10px] w-fit px-3 py-1 mb-5 rounded-sm border-none shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                    FEATURED
                  </Badge>

                  <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                    {featured.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-white flex items-center justify-center p-1">
                        <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">{featured.brandLogo}</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-white/90">{featured.brand}</span>
                    </div>
                    <Badge className="bg-white/10 hover:bg-white/20 text-white font-medium tracking-wide text-[10px] border-none backdrop-blur-md px-3">
                      {featured.type}
                    </Badge>
                  </div>

                  <div className="w-full max-w-[300px] h-[1px] bg-white/10 mb-6" />

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div>
                      <p className="text-sm font-medium text-white/60 mb-0.5">Reward</p>
                      <p className="text-2xl font-bold text-white tracking-tight">
                        {featured.reward} <span className="text-sm font-normal text-white/70">per 1.000 Views</span>
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => goToJob(featured.id)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 h-12 rounded-xl text-[15px] shadow-[0_8px_20px_rgba(212,175,55,0.2)] transition-all sm:ml-auto w-full sm:w-auto z-10"
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <div className="absolute bottom-6 right-8 sm:right-12 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselPrevious className="static translate-y-0 size-10 rounded-full bg-black/40 hover:bg-primary hover:text-black border border-white/10 hover:border-transparent text-white backdrop-blur-md transition-all" />
            <CarouselNext className="static translate-y-0 size-10 rounded-full bg-black/40 hover:bg-primary hover:text-black border border-white/10 hover:border-transparent text-white backdrop-blur-md transition-all" />
          </div>
        </Carousel>
      </motion.div>

      {/* 5 Core Job Types Navigation */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[19px] font-semibold text-foreground tracking-tight">Kategori Layanan</h3>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
          {jobTypes.map((type) => {
            const isActive = activeTab === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border transition-all shrink-0 font-bold text-[13px] tracking-wide
                  ${isActive 
                    ? "bg-[#1F190B] border-primary/50 text-primary shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                    : "bg-[#111316] border-white/5 text-muted-foreground hover:bg-[#15171A] hover:border-white/10"
                  }
                `}
              >
                <type.icon className={`size-4 ${isActive ? "text-primary" : type.color}`} />
                {type.label}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Filters and List */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-[19px] font-semibold text-foreground tracking-tight">
              {activeTab === 'all' ? 'Semua Job Tersedia' : `Job ${selectedJobType?.label} Tersedia`}
            </h3>
            <Badge variant="secondary" className="bg-[#15171A] text-muted-foreground border-white/5">
              {filteredCampaigns.length} Job
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="size-9 bg-[#111316] border-white/5 hover:bg-white/10 text-muted-foreground rounded-lg shrink-0">
              <Filter className="size-4" />
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="h-9 text-[13px] bg-[#111316] border-white/5 hover:bg-white/10 w-[140px] rounded-lg shrink-0 font-medium">
                <SelectValue placeholder="Semua Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Brand</SelectItem>
                <SelectItem value="toyota">Toyota</SelectItem>
                <SelectItem value="honda">Honda</SelectItem>
                <SelectItem value="hyundai">Hyundai</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="newest">
              <SelectTrigger className="h-9 text-[13px] bg-[#111316] border-white/5 hover:bg-white/10 w-[120px] rounded-lg shrink-0 font-medium">
                <SelectValue placeholder="Terbaru" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="highest_pay">Bayaran Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Campaign Grid with Automotive focus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredCampaigns.map((campaign, i) => (
            <motion.div key={campaign.id} initial="hidden" animate="show" variants={fadeUp} custom={3 + i}>
              <Card
                onClick={() => goToJob(campaign.id)}
                className="group cursor-pointer border-white/5 bg-[#111316] hover:bg-[#15171A] hover:border-white/10 transition-all duration-300 overflow-hidden shadow-none rounded-2xl flex flex-col sm:flex-row h-full"
              >
                
                {/* Image Section - Left side on desktop, top on mobile */}
                <div className="relative w-full sm:w-[200px] h-[200px] sm:h-full bg-muted/20 shrink-0 overflow-hidden">
                  <img 
                    src={campaign.image} 
                    alt={campaign.vehicle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#111316] via-[#111316]/50 to-transparent sm:via-transparent" />
                  
                  {/* Job Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${campaign.typeColor}`}>
                      {campaign.type}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-5 sm:p-6 flex flex-col grow justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-muted-foreground/80 text-[12px] font-medium">
                        <Car className="size-3.5" />
                        <span>{campaign.brand}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded text-[11px] text-muted-foreground/80">
                        <Users className="size-3" />
                        <span>{campaign.quota}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-[17px] text-foreground mb-2 group-hover:text-primary transition-colors">
                      {campaign.vehicle}
                    </h4>
                    
                    <p className="text-[13px] text-muted-foreground/80 line-clamp-2 leading-relaxed mb-4">
                      {campaign.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CircleDollarSign className="size-4" />
                      </div>
                      <p className="text-[14px] font-bold text-foreground">{campaign.reward}</p>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); goToJob(campaign.id); }}
                      className="rounded-full bg-white/10 hover:bg-white/20 text-foreground font-semibold px-4 h-8 text-[12px] transition-colors"
                    >
                      Lihat Detail
                    </Button>
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
