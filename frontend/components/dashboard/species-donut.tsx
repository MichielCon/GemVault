"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { SpeciesBreakdownDto } from "@/lib/types";

const COLORS = [
  "#7c3aed", // violet
  "#2563eb", // blue
  "#d97706", // amber
  "#16a34a", // green
  "#dc2626", // red
  "#0d9488", // teal
  "#ea580c", // orange
  "#4f46e5", // indigo
];

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-sm">
      <p className="font-medium text-zinc-700">{payload[0].name}</p>
      <p className="text-zinc-500">{payload[0].value} gems</p>
    </div>
  );
}

export function SpeciesDonut({
  data,
  totalUnsold,
}: {
  data: SpeciesBreakdownDto[];
  totalUnsold: number;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No inventory yet
      </div>
    );
  }

  const chartData = data.map(d => ({ name: d.species, value: d.count }));

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight">{totalUnsold}</span>
          <span className="text-[11px] text-zinc-400 font-medium">in stock</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 pb-1">
        {chartData.slice(0, 6).map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-[11px] text-zinc-500 truncate max-w-[80px]">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
