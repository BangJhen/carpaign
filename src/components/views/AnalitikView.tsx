"use client";

import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Megaphone, Video, CheckCircle2, Calendar, ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useState } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

// 4 Metric Cards with unified cohesive palette
const metricCards = [
  {
    label: "Total Views",
    value: "142.5K",
    suffix: "Views",
    icon: Eye,
    glowColor: "rgba(212, 175, 55, 0.08)",
    waveColor: "from-primary/0 via-primary/25 to-primary/0",
    valueColor: "text-foreground",
  },
  {
    label: "Total Campaign",
    value: "12",
    suffix: "Campaign",
    icon: Megaphone,
    glowColor: "rgba(212, 175, 55, 0.06)",
    waveColor: "from-primary/0 via-primary/20 to-primary/0",
    valueColor: "text-foreground",
  },
  {
    label: "Total Video",
    value: "45",
    suffix: "Video",
    icon: Video,
    glowColor: "rgba(255, 255, 255, 0.03)",
    waveColor: "from-white/0 via-white/10 to-white/0",
    valueColor: "text-foreground",
  },
  {
    label: "Total Approved",
    value: "42",
    suffix: "Videos",
    icon: CheckCircle2,
    glowColor: "rgba(255, 255, 255, 0.03)",
    waveColor: "from-white/0 via-white/10 to-white/0",
    valueColor: "text-foreground",
  },
];

// Mock data for the chart (Automotive theme trend)
const chartData = [
  { date: '1 Aug', views: 2400 },
  { date: '4 Aug', views: 1398 },
  { date: '8 Aug', views: 9800 },
  { date: '12 Aug', views: 3908 },
  { date: '16 Aug', views: 4800 },
  { date: '20 Aug', views: 18000 },
  { date: '24 Aug', views: 8300 },
  { date: '28 Aug', views: 11000 },
];

export function AnalitikView() {
  const [chartTab, setChartTab] = useState("total");

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20 relative">
      
      {/* Header Section */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        custom={0}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <h2 className="text-2xl sm:text-[28px] font-bold text-foreground tracking-tight">
          Analitik Performa Kamu
        </h2>
        <Button
          variant="outline"
          className="bg-transparent border-white/10 hover:bg-white/5 text-foreground h-10 px-5 rounded-xl gap-2 font-medium"
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </motion.div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <motion.div key={card.label} initial="hidden" animate="show" variants={fadeUp} custom={i + 1}>
            <Card className="relative overflow-hidden border-white/5 bg-[#111316] h-[130px] flex flex-col justify-between transition-all hover:bg-[#15181c] group">
              <div 
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[150%] h-12 rounded-[100%] blur-[15px] pointer-events-none transition-opacity group-hover:opacity-80 opacity-50"
                style={{ backgroundColor: card.glowColor }}
              />
              <div 
                className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${card.waveColor} pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`}
              />
              
              <CardContent className="p-5 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <card.icon className="size-4 text-white/80" />
                  <span className="text-[13px] font-medium text-muted-foreground/80">{card.label}</span>
                </div>
                
                <div className="relative z-10">
                  <p className="text-3xl font-bold tracking-tight leading-none flex items-baseline gap-1.5">
                    <span className={card.valueColor}>{card.value}</span>
                    {card.suffix && (
                      <span className={`text-[13px] font-medium opacity-80 ${card.valueColor}`}>
                        {card.suffix}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Chart Section */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={5}>
        <Card className="border border-white/5 bg-[#111316] overflow-hidden rounded-2xl p-6 sm:p-8">
          
          {/* Chart Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <h3 className="text-xl font-bold text-foreground tracking-tight">Total Views</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Toggle Total / Kenaikan */}
              <div className="flex items-center bg-[#1A1C20] rounded-lg p-1 border border-white/5">
                <button 
                  onClick={() => setChartTab("total")}
                  className={`px-6 py-2 rounded-md text-[13px] font-bold transition-all ${
                    chartTab === "total" 
                    ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                    : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Total
                </button>
                <button 
                  onClick={() => setChartTab("kenaikan")}
                  className={`px-6 py-2 rounded-md text-[13px] font-bold transition-all ${
                    chartTab === "kenaikan" 
                    ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                    : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Kenaikan
                </button>
              </div>

              {/* Date Picker Approximation */}
              <Button variant="outline" className="bg-[#1A1C20] border-white/5 hover:bg-white/5 text-foreground justify-between w-[200px] h-10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-[13px]">28 hari terakhir</span>
                </div>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Chart Rendering */}
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                  tickFormatter={(value) => `${value >= 1000 ? (value / 1000) + 'K' : value}`}
                  dx={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1C20', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  activeDot={{ r: 6, fill: '#D4AF37', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </Card>
      </motion.div>

    </div>
  );
}
