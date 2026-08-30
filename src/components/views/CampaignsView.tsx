"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Video, Scissors, Film, Share2, Search, Filter, CircleDollarSign, Car, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { campaigns } from "@/lib/campaigns-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const jobTypes = [
  { id: "all", label: "Semua", icon: Search, color: "text-foreground" },
  { id: "shoot", label: "SHOOT", icon: Camera, color: "text-blue-400" },
  { id: "ugc", label: "UGC", icon: Video, color: "text-orange-400" },
  { id: "edit", label: "EDIT", icon: Film, color: "text-emerald-400" },
  { id: "clip", label: "CLIP", icon: Scissors, color: "text-purple-400" },
  { id: "publish", label: "PUBLISH", icon: Share2, color: "text-pink-400" },
];


export function CampaignsView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  const goToJob = (id: number) => router.push(`/campaigns/${id}`);

  const filteredCampaigns = activeTab === "all" 
    ? campaigns 
    : campaigns.filter(c => c.type.toLowerCase() === activeTab);

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20 relative">
      
      {/* Featured Campaign Carousel (Konten.com style) */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <div className="relative w-full h-[420px] rounded-2xl overflow-hidden group">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1600" 
              alt="Featured Campaign" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/90 via-[#0a0a0c]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />

          {/* Content Overlay */}
          <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center max-w-[700px]">
            <Badge className="bg-[#f26522] hover:bg-[#d6571a] text-white font-black tracking-widest text-[10px] w-fit px-3 py-1 mb-5 rounded-sm border-none shadow-[0_0_15px_rgba(242,101,34,0.4)]">
              FEATURED
            </Badge>

            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5">
              BMW X5 Test Drive & Review Experience
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-white flex items-center justify-center p-1">
                  <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">BMW</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-white/90">BMW Tunas</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <Badge className="bg-white/10 hover:bg-white/20 text-white font-medium tracking-wide text-[10px] border-none backdrop-blur-md px-3">
                TEST DRIVE / UGC
              </Badge>
            </div>

            <div className="w-full max-w-[300px] h-[1px] bg-white/10 mb-6" />

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div>
                <p className="text-sm font-medium text-white/60 mb-0.5">Reward</p>
                <p className="text-2xl font-bold text-white tracking-tight">
                  Rp5.000 <span className="text-sm font-normal text-white/70">/ 1K Views</span>
                </p>
              </div>
              
              <Button
                onClick={() => goToJob(campaigns[0].id)}
                className="bg-[#f26522] hover:bg-[#d6571a] text-white font-bold px-8 h-12 rounded-xl text-[15px] shadow-[0_8px_20px_rgba(242,101,34,0.25)] transition-all sm:ml-auto w-full sm:w-auto"
              >
                Lihat Detail
              </Button>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="absolute bottom-6 left-0 right-0 px-8 sm:px-12 flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-[#f26522] shadow-[0_0_10px_rgba(242,101,34,0.5)]" />
              <div className="w-2 h-1.5 rounded-full bg-white/20" />
              <div className="w-2 h-1.5 rounded-full bg-white/20" />
              <div className="w-2 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex items-center justify-center size-10 rounded-full bg-black/40 hover:bg-[#f26522] border border-white/10 hover:border-transparent text-white backdrop-blur-md transition-all">
                <ChevronLeft className="size-5" />
              </button>
              <button className="flex items-center justify-center size-10 rounded-full bg-black/40 hover:bg-[#f26522] border border-white/10 hover:border-transparent text-white backdrop-blur-md transition-all">
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
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
              {activeTab === 'all' ? 'Semua Job Tersedia' : `Job ${activeTab.toUpperCase()} Tersedia`}
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
                <SelectValue placeholder="Brand Mobil" />
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
                <SelectValue placeholder="Urutkan" />
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
