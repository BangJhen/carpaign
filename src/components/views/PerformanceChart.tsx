"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PerformanceChartProps {
  metric?: "views" | "engagement";
}

const PERFORMANCE_DATA = [
  { month: "Januari", shortMonth: "Jan", views: 48200, engagement: 3950 },
  { month: "Februari", shortMonth: "Feb", views: 56400, engagement: 4720 },
  { month: "Maret", shortMonth: "Mar", views: 52100, engagement: 4400 },
  { month: "April", shortMonth: "Apr", views: 76800, engagement: 6890 },
  { month: "Mei", shortMonth: "Mei", views: 94500, engagement: 8740 },
  { month: "Juni", shortMonth: "Jun", views: 118200, engagement: 11980 },
];

export default function PerformanceChart({ metric = "views" }: PerformanceChartProps) {
  const isViews = metric === "views";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={PERFORMANCE_DATA}
        margin={{ top: 12, right: 8, left: -20, bottom: 4 }}
      >
        <defs>
          <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isViews ? "#D4AF37" : "#38BDF8"} stopOpacity={0.28} />
            <stop offset="95%" stopColor={isViews ? "#D4AF37" : "#38BDF8"} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255, 255, 255, 0.04)"
          vertical={false}
        />

        <XAxis
          dataKey="shortMonth"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#ffffff55", fontSize: 11, fontWeight: 500 }}
          dy={8}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#ffffff35", fontSize: 10, fontWeight: 400 }}
          tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#0D0F12",
            borderColor: isViews ? "rgba(212,175,55,0.3)" : "rgba(56,189,248,0.3)",
            borderRadius: "12px",
            boxShadow: "0 14px 40px rgba(0,0,0,0.65)",
            padding: "10px 14px",
          }}
          itemStyle={{
            color: isViews ? "#D4AF37" : "#38BDF8",
            fontSize: "12px",
            fontWeight: "bold",
          }}
          labelStyle={{
            color: "#ffffff70",
            fontSize: "11px",
            fontWeight: "600",
            marginBottom: "4px",
          }}
          formatter={(value: any) => [
            `${Number(value).toLocaleString("id-ID")} ${isViews ? "Tayangan" : "Interaksi"}`,
            isViews ? "Total Views" : "Total Interaksi",
          ]}
        />

        <Area
          type="monotone"
          dataKey={isViews ? "views" : "engagement"}
          stroke={isViews ? "#D4AF37" : "#38BDF8"}
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#performanceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
