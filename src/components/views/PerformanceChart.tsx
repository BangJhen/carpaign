"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const MOCK_PERFORMANCE_DATA = [
  { month: "Jan", views: 45000, engagement: 4200 },
  { month: "Feb", views: 52000, engagement: 5100 },
  { month: "Mar", views: 48000, engagement: 4800 },
  { month: "Apr", views: 71000, engagement: 7400 },
  { month: "Mei", views: 89000, engagement: 9200 },
  { month: "Jun", views: 112000, engagement: 12500 },
];

export default function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={MOCK_PERFORMANCE_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#ffffff50", fontSize: 11, fontWeight: 500 }}
          dy={10}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "#111316", 
            borderColor: "rgba(212,175,55,0.2)",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}
          itemStyle={{ color: "#D4AF37", fontSize: "12px", fontWeight: "bold" }}
          labelStyle={{ color: "#ffffff50", fontSize: "11px", marginBottom: "4px" }}
          formatter={(value: any) => [`${Number(value).toLocaleString("id-ID")} Views`, "Reach"]}
        />
        <Area 
          type="monotone" 
          dataKey="views" 
          stroke="#D4AF37" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorViews)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
