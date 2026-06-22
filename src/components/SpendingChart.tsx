"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRupiah } from "@/lib/format";

const COLORS = [
  "#9CAF88",
  "#C9A96E",
  "#EED5D2",
  "#C8DAB0",
  "#E8C482",
  "#A8C48A",
  "#D4AF37",
  "#E2BAB5",
  "#8DAF6A",
  "#F2DCB0",
  "#D69F98",
];

interface SpendingChartProps {
  data: { kategori: string; total: number }[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-champagne/20 bg-ivory-50 px-6 py-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-champagne-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-champagne-500">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-warm-700">Belum ada data grafik</h3>
        <p className="mt-1 text-xs text-warm-400">Transaksi akan muncul di sini</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="rounded-xl bg-white border border-champagne/20 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-warm-700">Pengeluaran per Kategori</h2>
        <span className="text-xs text-warm-400">{data.length} kategori</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="kategori"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={2}
          >
            {data.map((_, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={COLORS[idx % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatRupiah(value)}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #EFEBE4",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              fontSize: "13px",
              padding: "8px 12px",
              background: "white",
            }}
            labelStyle={{ color: "#2D2A26", fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((item, idx) => (
          <div key={item.kategori} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="text-warm-600">{item.kategori}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-warm-300">
                {((item.total / total) * 100).toFixed(1)}%
              </span>
              <span className="font-medium text-warm-700">{formatRupiah(item.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
