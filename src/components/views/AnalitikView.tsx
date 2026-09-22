"use client";

import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Eye, Megaphone, Video, CheckCircle2, Calendar, Loader2 } from "lucide-react";
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


const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  // Berikan jeda waktu agar download manager browser selesai mengambil file sebelum blob URL direvoke
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 10000);
};

const generateXlsxReport = async (
  periodLabel: string,
  formattedDate: string,
  metrics: { totalViews: string; totalCampaign: string; totalVideo: string; totalApproved: string },
  chartData: { date: string; views: number; growth: number }[]
) => {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Carpaign Indonesia";
  wb.lastModifiedBy = "Carpaign Platform";
  wb.created = new Date();
  wb.modified = new Date();

  const ws = wb.addWorksheet("Laporan Analitik", {
    views: [{ showGridLines: true }],
    properties: { defaultRowHeight: 20 },
  });

  // Set column widths
  ws.columns = [
    { key: "colA", width: 8 },   // No
    { key: "colB", width: 22 },  // Periode / Tanggal
    { key: "colC", width: 28 },  // Total Penayangan (Views)
    { key: "colD", width: 22 },  // Pertumbuhan (%)
    { key: "colE", width: 28 },  // Status Performa
  ];

  // 1. Header Banner
  ws.mergeCells("A2:E2");
  const titleCell = ws.getCell("A2");
  titleCell.value = "CARPAIGN  |  LAPORAN ANALITIK PERFORMA KREATOR";
  titleCell.font = { name: "Segoe UI", size: 14, bold: true, color: { argb: "FFD4AF37" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF111316" } };
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(2).height = 36;

  ws.mergeCells("A3:E3");
  const subCell = ws.getCell("A3");
  subCell.value = "Rekapitulasi performa akumulasi penayangan konten video dan progres kampanye.";
  subCell.font = { name: "Segoe UI", size: 10, italic: true, color: { argb: "FF94A3B8" } };
  subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1C20" } };
  subCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(3).height = 22;

  // 2. Metadata Rows
  const metaRow = ws.getRow(5);
  metaRow.values = ["", "Periode Laporan:", periodLabel, "Waktu Unduh:", `${formattedDate} WIB`];
  metaRow.height = 20;
  ws.getCell("B5").font = { name: "Segoe UI", bold: true, size: 10, color: { argb: "FF64748B" } };
  ws.getCell("C5").font = { name: "Segoe UI", size: 10, color: { argb: "FF0F172A" } };
  ws.getCell("D5").font = { name: "Segoe UI", bold: true, size: 10, color: { argb: "FF64748B" } };
  ws.getCell("E5").font = { name: "Segoe UI", size: 10, color: { argb: "FF0F172A" } };

  // 3. KPI Section Header
  ws.mergeCells("A7:E7");
  const kpiHeader = ws.getCell("A7");
  kpiHeader.value = "RINGKASAN METRIK UTAMA (KPI)";
  kpiHeader.font = { name: "Segoe UI", bold: true, size: 11, color: { argb: "FF1E293B" } };
  kpiHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
  kpiHeader.alignment = { vertical: "middle", indent: 1 };
  ws.getRow(7).height = 24;

  // KPI Cards in Rows 8 & 9
  const kpis = [
    { col: "B", title: "TOTAL VIEWS", val: `${metrics.totalViews} Views`, color: "FFB45309" },
    { col: "C", title: "TOTAL KAMPANYE", val: `${metrics.totalCampaign} Campaign`, color: "FF1E293B" },
    { col: "D", title: "TOTAL VIDEO", val: `${metrics.totalVideo} Video`, color: "FF1E293B" },
    { col: "E", title: "VIDEO DISETUJUI", val: `${metrics.totalApproved} Videos`, color: "FF047857" },
  ];

  kpis.forEach(k => {
    const tCell = ws.getCell(`${k.col}8`);
    tCell.value = k.title;
    tCell.font = { name: "Segoe UI", size: 9, bold: true, color: { argb: "FF64748B" } };
    tCell.alignment = { horizontal: "center", vertical: "middle" };
    tCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
    tCell.border = {
      top: { style: "thin", color: { argb: "FFE2E8F0" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };

    const vCell = ws.getCell(`${k.col}9`);
    vCell.value = k.val;
    vCell.font = { name: "Segoe UI", size: 13, bold: true, color: { argb: k.color } };
    vCell.alignment = { horizontal: "center", vertical: "middle" };
    vCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
    vCell.border = {
      bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  });
  ws.getRow(8).height = 18;
  ws.getRow(9).height = 28;

  // 4. Data Breakdown Table Header
  ws.mergeCells("A11:E11");
  const dataHeader = ws.getCell("A11");
  dataHeader.value = "RINCIAN TREN PENAYANGAN KONTEN HARIAN";
  dataHeader.font = { name: "Segoe UI", bold: true, size: 11, color: { argb: "FF1E293B" } };
  dataHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
  dataHeader.alignment = { vertical: "middle", indent: 1 };
  ws.getRow(11).height = 24;

  const thRow = ws.getRow(12);
  thRow.values = ["No", "Periode / Tanggal", "Jumlah Penayangan (Views)", "Pertumbuhan (%)", "Status Performa"];
  thRow.height = 26;
  ["A", "B", "C", "D", "E"].forEach((col, idx) => {
    const cell = thRow.getCell(idx + 1);
    cell.font = { name: "Segoe UI", bold: true, size: 10, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E2229" } };
    cell.alignment = { 
      vertical: "middle", 
      horizontal: idx === 0 || idx === 3 ? "center" : idx === 2 ? "right" : "left" 
    };
  });

  // Table Data Rows
  let currentLine = 13;
  chartData.forEach((item, idx) => {
    const row = ws.getRow(currentLine);
    const isEven = idx % 2 === 0;
    const bgColor = isEven ? "FFFFFFFF" : "FFF8FAFC";
    const status = item.growth > 0 ? "Kenaikan Positif" : item.growth < 0 ? "Koreksi / Penurunan" : "Stabil";
    const growthStr = item.growth > 0 ? `+${item.growth}%` : `${item.growth}%`;

    row.values = [idx + 1, item.date, item.views, growthStr, status];
    row.height = 22;

    ["A", "B", "C", "D", "E"].forEach((c, cIdx) => {
      const cell = row.getCell(cIdx + 1);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
      cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF1E293B" } };

      if (cIdx === 0) cell.alignment = { horizontal: "center", vertical: "middle" };
      if (cIdx === 1) cell.alignment = { horizontal: "left", vertical: "middle" };
      if (cIdx === 2) {
        cell.alignment = { horizontal: "right", vertical: "middle" };
        cell.numFmt = "#,##0";
      }
      if (cIdx === 3) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.font = {
          name: "Segoe UI",
          size: 10,
          bold: true,
          color: { argb: item.growth >= 0 ? "FF047857" : "FFDC2626" },
        };
      }
      if (cIdx === 4) cell.alignment = { horizontal: "left", vertical: "middle" };
    });
    currentLine++;
  });

  // Total Summary Row
  const totalRow = ws.getRow(currentLine);
  totalRow.height = 26;
  totalRow.values = [
    "", 
    "Total Penayangan", 
    { formula: `SUM(C13:C${currentLine - 1})` }, 
    "-", 
    "Akumulasi Periode"
  ];

  ["A", "B", "C", "D", "E"].forEach((c, cIdx) => {
    const cell = totalRow.getCell(cIdx + 1);
    cell.font = { name: "Segoe UI", bold: true, size: 10, color: { argb: "FF0F172A" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
    cell.border = {
      top: { style: "thin", color: { argb: "FF94A3B8" } },
      bottom: { style: "double", color: { argb: "FF0F172A" } },
    };
    if (cIdx === 1) cell.alignment = { horizontal: "left", vertical: "middle" };
    if (cIdx === 2) {
      cell.alignment = { horizontal: "right", vertical: "middle" };
      cell.numFmt = "#,##0";
    }
    if (cIdx === 3) cell.alignment = { horizontal: "center", vertical: "middle" };
    if (cIdx === 4) cell.alignment = { horizontal: "left", vertical: "middle" };
  });

  // Footer Note
  currentLine += 2;
  ws.mergeCells(`A${currentLine}:E${currentLine}`);
  const noteCell = ws.getCell(`A${currentLine}`);
  noteCell.value = "Catatan: Laporan resmi ini diterbitkan otomatis oleh platform Carpaign. Seluruh data penayangan terverifikasi secara berkala.";
  noteCell.font = { name: "Segoe UI", size: 9, italic: true, color: { argb: "FF64748B" } };
  noteCell.alignment = { vertical: "middle" };

  const buffer = await wb.xlsx.writeBuffer();
  return buffer;
};

export function AnalitikView() {
  const [chartTab, setChartTab] = useState<"total" | "kenaikan">("total");
  const [timeRange, setTimeRange] = useState("28_days");
  const [isExporting, setIsExporting] = useState(false);

  const currentData = analyticsByRange[timeRange] || analyticsByRange["28_days"];

  const handleExportXLSX = async () => {
    setIsExporting(true);

    try {
      const now = new Date();
      const formattedDate = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(now);

      const periodLabel = rangeLabels[timeRange] || "28 hari terakhir";
      const dateSlug = now.toISOString().split("T")[0];

      const buffer = await generateXlsxReport(
        periodLabel,
        formattedDate,
        currentData.metrics,
        currentData.chartData
      );

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const filename = `laporan_analitik_carpaign_${timeRange}_${dateSlug}.xlsx`;
      triggerDownload(blob, filename);

      toast.success("Laporan Excel (.xlsx) berhasil diunduh", {
        description: `Laporan analitik periode ${periodLabel} telah tersimpan dalam format XLSX.`,
      });
    } catch (error) {
      console.error("Gagal mengekspor laporan Excel:", error);
      toast.error("Gagal membuat laporan Excel. Silakan coba kembali.");
    } finally {
      setIsExporting(false);
    }
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
        <div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-foreground tracking-tight">
            Analitik Performa Kamu
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pantau statistik penayangan dan ekspor laporan resmi dalam format Excel (.xlsx).
          </p>
        </div>

        {/* Action Button: Export Laporan Excel (.xlsx) */}
        <div>
          <Button
            variant="outline"
            onClick={handleExportXLSX}
            disabled={isExporting}
            className="bg-[#1A1C20] border-white/10 hover:bg-white/10 hover:border-primary/40 text-foreground h-10 px-5 rounded-xl gap-2.5 font-medium transition-all shadow-sm group"
          >
            {isExporting ? (
              <>
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>Menyusun Laporan XLSX...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="size-4 text-primary group-hover:text-primary transition-colors" />
                <span>Export Laporan Excel (.xlsx)</span>
              </>
            )}
          </Button>
        </div>
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
