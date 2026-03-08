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
    <div className="rounded-lg border bg-white px-3 py-2 shadow-md text-sm">
      <p className="font-medium text-slate-700">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value} gems</p>
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
      <div className="relative flex-1">
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
          <span className="text-2xl font-bold">{totalUnsold}</span>
          <span className="text-xs text-muted-foreground">in stock</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 pb-1">
        {chartData.slice(0, 6).map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-[11px] text-muted-foreground truncate max-w-[80px]">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
