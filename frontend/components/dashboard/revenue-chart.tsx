"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyRevenueDto } from "@/lib/types";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildChartData(data: MonthlyRevenueDto[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const found = data.find(m => m.year === d.getFullYear() && m.month === d.getMonth() + 1);
    return {
      label: MONTH_LABELS[d.getMonth()],
      revenue: found?.revenue ?? 0,
    };
  });
}

function formatYAxis(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return `$${value}`;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-md text-sm">
      <p className="font-medium text-slate-700">{label}</p>
      <p className="text-violet-600 font-semibold">
        {payload[0].value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}

export function RevenueChart({ data }: { data: MonthlyRevenueDto[] }) {
  const chartData = buildChartData(data);
  const hasData = chartData.some(d => d.revenue > 0);

  if (!hasData) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No sales in the last 6 months
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
        <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
