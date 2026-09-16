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
  dataKey?: "views" | "engagement";
}

const PERFORMANCE_DATA = [
  { month: "Januari", shortMonth: "Jan", views: 48200, engagement: 3950 },
  { month: "Februari", shortMonth: "Feb", views: 56400, engagement: 4720 },
  { month: "Maret", shortMonth: "Mar", views: 52100, engagement: 4400 },
  { month: "April", shortMonth: "Apr", views: 76800, engagement: 6890 },
  { month: "Mei", shortMonth: "Mei", views: 94500, engagement: 8740 },
  { month: "Juni", shortMonth: "Jun", views: 118200, engagement: 11980 },
];

export default function PerformanceChart({ dataKey = "views" }: PerformanceChartProps) {
  const isViews = dataKey === "views";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={PERFORMANCE_DATA}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="chartFillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
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
          tick={{ fill: "#ffffff50", fontSize: 11, fontWeight: 500 }}
          dy={8}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#ffffff30", fontSize: 10, fontWeight: 400 }}
          tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#0F1114",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            padding: "8px 12px",
          }}
          itemStyle={{
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 600,
          }}
          labelStyle={{
            color: "#ffffff50",
            fontSize: "11px",
            marginBottom: "2px",
          }}
          formatter={(value: any) => [
            `${Number(value).toLocaleString("id-ID")} ${isViews ? "Tayangan" : "Interaksi"}`,
            isViews ? "Total Tayangan" : "Interaksi",
          ]}
        />

        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#D4AF37"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#chartFillGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
