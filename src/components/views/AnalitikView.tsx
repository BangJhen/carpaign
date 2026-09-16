"use client";

import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Megaphone, Video, CheckCircle2, Calendar, Loader2 } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const analyticsByRange: Record<string, {
  metrics: { totalViews: string; totalCampaign: string; totalVideo: string; totalApproved: string };
  chartData: { date: string; views: number; growth: number }[];
}> = {
  "7_days": {
    metrics: { totalViews: "38.2K", totalCampaign: "4", totalVideo: "11", totalApproved: "10" },
    chartData: [
      { date: "10 Sep", views: 4200, growth: 12 },
      { date: "11 Sep", views: 5100, growth: 21 },
      { date: "12 Sep", views: 4800, growth: -5 },
      { date: "13 Sep", views: 6200, growth: 29 },
      { date: "14 Sep", views: 5900, growth: -4 },
      { date: "15 Sep", views: 7800, growth: 32 },
      { date: "16 Sep", views: 8400, growth: 8 },
    ],
  },
  "28_days": {
    metrics: { totalViews: "142.5K", totalCampaign: "12", totalVideo: "45", totalApproved: "42" },
    chartData: [
      { date: "19 Agu", views: 2400, growth: 10 },
      { date: "23 Agu", views: 4100, growth: 70 },
      { date: "27 Agu", views: 9800, growth: 139 },
      { date: "31 Agu", views: 7900, growth: -19 },
      { date: "4 Sep", views: 12400, growth: 56 },
      { date: "8 Sep", views: 18000, growth: 45 },
      { date: "12 Sep", views: 14200, growth: -21 },
      { date: "16 Sep", views: 21000, growth: 47 },
    ],
  },
  "90_days": {
    metrics: { totalViews: "418.9K", totalCampaign: "28", totalVideo: "118", totalApproved: "110" },
    chartData: [
      { date: "Jul M1", views: 24000, growth: 15 },
      { date: "Jul M2", views: 28500, growth: 18 },
      { date: "Jul M3", views: 32000, growth: 12 },
      { date: "Jul M4", views: 39000, growth: 21 },
      { date: "Agu M1", views: 36000, growth: -7 },
      { date: "Agu M2", views: 44000, growth: 22 },
      { date: "Agu M3", views: 52000, growth: 18 },
      { date: "Agu M4", views: 61000, growth: 17 },
      { date: "Sep M1", views: 58000, growth: -4 },
      { date: "Sep M2", views: 69000, growth: 18 },
    ],
  },
  "this_month": {
    metrics: { totalViews: "84.3K", totalCampaign: "8", totalVideo: "24", totalApproved: "22" },
    chartData: [
      { date: "1 Sep", views: 3100, growth: 8 },
      { date: "4 Sep", views: 4600, growth: 48 },
      { date: "7 Sep", views: 6200, growth: 34 },
      { date: "10 Sep", views: 8900, growth: 43 },
      { date: "13 Sep", views: 11400, growth: 28 },
      { date: "16 Sep", views: 14200, growth: 24 },
    ],
  },
  "all_time": {
    metrics: { totalViews: "892.4K", totalCampaign: "64", totalVideo: "260", totalApproved: "248" },
    chartData: [
      { date: "Mar '26", views: 42000, growth: 10 },
      { date: "Apr '26", views: 78000, growth: 85 },
      { date: "Mei '26", views: 115000, growth: 47 },
      { date: "Jun '26", views: 168000, growth: 46 },
      { date: "Jul '26", views: 224000, growth: 33 },
      { date: "Agu '26", views: 298000, growth: 33 },
      { date: "Sep '26", views: 382000, growth: 28 },
    ],
  },
};

const rangeLabels: Record<string, string> = {
  "7_days": "7 hari terakhir",
  "28_days": "28 hari terakhir",
  "90_days": "90 hari terakhir",
  "this_month": "Bulan ini",
  "all_time": "Semua waktu",
};

const escapeCsvCell = (val: string | number | undefined | null) => {
  const str = String(val ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r") || str.includes(";")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export function AnalitikView() {
  const [chartTab, setChartTab] = useState<"total" | "kenaikan">("total");
  const [timeRange, setTimeRange] = useState("28_days");
  const [isExporting, setIsExporting] = useState(false);

  const currentData = analyticsByRange[timeRange] || analyticsByRange["28_days"];

  const handleExportCSV = () => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat("id-ID", {
          dateStyle: "long",
          timeStyle: "short",
        }).format(now);

        const periodLabel = rangeLabels[timeRange] || "28 hari terakhir";

        const lines: string[] = [];

        // 1. Header Metadata Laporan
        lines.push("LAPORAN ANALITIK PERFORMA KREATOR CARPAIGN");
        lines.push(`Tanggal Ekspor,${escapeCsvCell(formattedDate)} WIB`);
        lines.push(`Periode Filter,${escapeCsvCell(periodLabel)}`);
        lines.push("");

        // 2. Ringkasan Metrik (KPI)
        lines.push("RINGKASAN METRIK PERFORMA");
        lines.push(`Total Views,${escapeCsvCell(currentData.metrics.totalViews)}`);
        lines.push(`Total Campaign,${escapeCsvCell(currentData.metrics.totalCampaign)}`);
        lines.push(`Total Video,${escapeCsvCell(currentData.metrics.totalVideo)}`);
        lines.push(`Total Video Disetujui,${escapeCsvCell(currentData.metrics.totalApproved)}`);
        lines.push("");

        // 3. Rincian Tren Data Harian
        lines.push("RINCIAN TREN PENAYANGAN KONTEN");
        lines.push("No,Periode / Tanggal,Jumlah Penayangan (Views),Pertumbuhan (%),Status Tren");

        currentData.chartData.forEach((item, index) => {
          const trendStatus = item.growth > 0 ? "Kenaikan Positif" : item.growth < 0 ? "Penurunan / Koreksi" : "Stabil";
          const growthFormatted = item.growth > 0 ? `+${item.growth}%` : `${item.growth}%`;
          lines.push([
            index + 1,
            escapeCsvCell(item.date),
            item.views,
            escapeCsvCell(growthFormatted),
            escapeCsvCell(trendStatus),
          ].join(","));
        });

        lines.push("");
        lines.push("Catatan: Data diperbarui secara berkala berdasarkan performa analitik video terverifikasi pada platform Carpaign.");

        const csvContent = lines.join("\r\n");
        // Gunakan UTF-8 BOM (\uFEFF) agar spreadsheet seperti Excel & Google Sheets membacanya dengan akurat
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const dateSlug = now.toISOString().split("T")[0];
        link.setAttribute("href", url);
        link.setAttribute("download", `laporan_analitik_carpaign_${timeRange}_${dateSlug}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("File CSV analitik berhasil diunduh", {
          description: `Laporan analitik periode ${periodLabel} telah tersimpan.`,
        });
      } catch (error) {
        console.error("Gagal mengunduh CSV:", error);
        toast.error("Gagal mengunduh file CSV. Silakan coba kembali.");
      } finally {
        setIsExporting(false);
      }
    }, 350);
  };

  const metricCards = [
    {
      label: "Total Views",
      value: currentData.metrics.totalViews,
      suffix: "Views",
      icon: Eye,
      glowColor: "rgba(212, 175, 55, 0.08)",
      waveColor: "from-primary/0 via-primary/25 to-primary/0",
      valueColor: "text-foreground",
    },
    {
      label: "Total Campaign",
      value: currentData.metrics.totalCampaign,
      suffix: "Campaign",
      icon: Megaphone,
      glowColor: "rgba(212, 175, 55, 0.06)",
      waveColor: "from-primary/0 via-primary/20 to-primary/0",
      valueColor: "text-foreground",
    },
    {
      label: "Total Video",
      value: currentData.metrics.totalVideo,
      suffix: "Video",
      icon: Video,
      glowColor: "rgba(255, 255, 255, 0.03)",
      waveColor: "from-white/0 via-white/10 to-white/0",
      valueColor: "text-foreground",
    },
    {
      label: "Total Approved",
      value: currentData.metrics.totalApproved,
      suffix: "Videos",
      icon: CheckCircle2,
      glowColor: "rgba(255, 255, 255, 0.03)",
      waveColor: "from-white/0 via-white/10 to-white/0",
      valueColor: "text-foreground",
    },
  ];

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
          onClick={handleExportCSV}
          disabled={isExporting}
          className="bg-transparent border-white/10 hover:bg-white/5 text-foreground h-10 px-5 rounded-xl gap-2 font-medium transition-all"
        >
          {isExporting ? (
            <>
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>Mengekspor...</span>
            </>
          ) : (
            <>
              <Download className="size-4 text-primary" />
              <span>Export CSV</span>
            </>
          )}
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
            <div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                {chartTab === "total" ? "Total Views" : "Pertumbuhan Views"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {chartTab === "total" 
                  ? "Akumulasi penayangan konten pada platform sosial media" 
                  : "Persentase kenaikan harian dibanding periode sebelumnya"}
              </p>
            </div>
            
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

              {/* Date Range Select */}
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="bg-[#1A1C20] border-white/5 hover:bg-white/5 text-foreground justify-between w-[200px] h-10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="28 hari terakhir" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1A1C20] border-white/10 text-white text-xs">
                  <SelectItem value="7_days">7 hari terakhir</SelectItem>
                  <SelectItem value="28_days">28 hari terakhir</SelectItem>
                  <SelectItem value="90_days">90 hari terakhir</SelectItem>
                  <SelectItem value="this_month">Bulan ini</SelectItem>
                  <SelectItem value="all_time">Semua waktu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chart Rendering */}
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={currentData.chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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
                  tickFormatter={(value) => chartTab === "total" ? (value >= 1000 ? `${value / 1000}K` : `${value}`) : `${value}%`}
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
                  itemStyle={{ color: chartTab === "total" ? '#D4AF37' : '#10B981', fontWeight: 'bold' }}
                  formatter={(value: any) => [
                    chartTab === "total" ? `${Number(value).toLocaleString('id-ID')} Views` : `${value}% Pertumbuhan`,
                    chartTab === "total" ? "Views" : "Kenaikan"
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartTab === "total" ? "views" : "growth"} 
                  stroke={chartTab === "total" ? "#D4AF37" : "#10B981"} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill={chartTab === "total" ? "url(#colorViews)" : "url(#colorGrowth)"} 
                  activeDot={{ r: 6, fill: chartTab === "total" ? '#D4AF37' : '#10B981', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </Card>
      </motion.div>

    </div>
  );
}
