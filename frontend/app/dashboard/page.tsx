import type { ReactNode } from "react";
import Link from "next/link";
import { dashboardApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Gem, Package, DollarSign, TrendingUp, Building2, ShoppingCart, ArrowUpRight, AlertTriangle, BarChart3 } from "lucide-react";
import type { DashboardStatsDto } from "@/lib/types";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SpeciesDonut } from "@/components/dashboard/species-donut";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";
import { DotPattern } from "@/components/magicui/dot-pattern";

function fmt(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const EMPTY_STATS: DashboardStatsDto = {
  gemCount: 0, parcelCount: 0, parcelTotalQuantity: 0,
  unsoldGemCount: 0, unsoldParcelCount: 0,
  totalPurchaseValue: 0, totalSalesValue: 0,
  unsoldInventoryValue: 0, netProfit: 0, profitMarginPct: 0,
  supplierCount: 0, purchaseOrderCount: 0, saleCount: 0,
  monthlyRevenue: [], inventoryBySpecies: [], recentSales: [], recentItems: [],
};

export default async function DashboardPage() {
  let stats: DashboardStatsDto | null = null;
  let statsError = false;
  try {
    stats = await dashboardApi.stats();
  } catch {
    statsError = true;
  }

  const s = stats ?? EMPTY_STATS;
  const profitPositive = s.netProfit >= 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Collection and business overview</p>
      </div>

      {statsError && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle size={16} className="shrink-0" />
          <span>Dashboard statistics are temporarily unavailable. Showing placeholder data.</span>
        </div>
      )}

      {/* Bento grid — 12-col */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">

        {/* In Stock — col 3 */}
        <Link
          href="/dashboard/gems"
          className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:col-span-3"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">In Stock</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-100 text-violet-600">
              <Gem size={14} />
            </div>
          </div>
          <NumberTicker
            value={s.unsoldGemCount}
            className="text-3xl font-bold tracking-tight"
          />
          <p className="mt-1 text-xs text-muted-foreground">{s.gemCount} total gems</p>
        </Link>

        {/* Inventory Value — col 3 */}
        <Link
          href="/dashboard/gems"
          className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:col-span-3"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Inventory Value</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-600">
              <Package size={14} />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight">{fmt(s.unsoldInventoryValue)}</p>
          <p className="mt-1 text-xs text-muted-foreground">cost of unsold items</p>
        </Link>

        {/* Revenue Chart — col 6, row 2 */}
        <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:col-span-6 sm:row-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Revenue</p>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <Link href="/dashboard/sales" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              View sales <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="h-40 flex-1">
            <RevenueChart data={s.monthlyRevenue} />
          </div>
        </div>

        {/* Inventory vs Revenue — col 6 */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:col-span-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Inventory vs Revenue</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
              <BarChart3 size={14} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Unsold cost</p>
              <p className="text-lg font-bold tracking-tight text-zinc-800">{fmt(s.unsoldInventoryValue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Total revenue</p>
              <p className="text-lg font-bold tracking-tight text-green-700">{fmt(s.totalSalesValue)}</p>
            </div>
          </div>
          {s.totalSalesValue > 0 && s.unsoldInventoryValue > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {Math.round((s.totalSalesValue / (s.totalSalesValue + s.unsoldInventoryValue)) * 100)}% of total value realized
            </p>
          )}
        </div>

        {/* Net Profit — col 6 with BorderBeam */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:col-span-6">
          <BorderBeam size={120} duration={12} colorFrom="#7c3aed" colorTo="#a78bfa" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Net Profit</span>
            <div className={`flex h-7 w-7 items-center justify-center rounded-md ${profitPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              <TrendingUp size={14} />
            </div>
          </div>
          <p className={`text-3xl font-bold tracking-tight ${profitPositive ? "text-green-700" : "text-red-700"}`}>
            {profitPositive ? "+" : ""}{fmt(s.netProfit)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {s.totalSalesValue > 0 ? `${s.profitMarginPct}% margin` : "no sales yet"}
          </p>
        </div>

        {/* Species Donut — col 4, row 2 */}
        <div className="flex flex-col gap-3 overflow-hidden rounded-xl border border-zinc-200/80 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:col-span-4 sm:row-span-2">
          <div>
            <p className="text-sm font-semibold">Inventory Composition</p>
            <p className="text-xs text-muted-foreground">Unsold gems by species</p>
          </div>
          <div className="flex-1 min-h-[140px]">
            <SpeciesDonut data={s.inventoryBySpecies} totalUnsold={s.unsoldGemCount} />
          </div>
        </div>

        {/* Recent Sales — col 8 */}
        <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:col-span-8">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <p className="text-sm font-semibold">Recent Sales</p>
            <Link href="/dashboard/sales" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {s.recentSales.length === 0 ? (
            <p className="px-4 pb-4 pt-3 text-sm text-muted-foreground">No sales recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
                  <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Date</th>
                  <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Buyer</th>
                  <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Items</th>
                  <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {s.recentSales.map((sale) => (
                  <tr key={sale.saleId} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium">
                      <Link href={`/dashboard/sales/${sale.saleId}`} className="hover:underline">
                        {new Date(sale.saleDate).toLocaleDateString()}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{sale.buyerName ?? "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{sale.itemCount}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-green-700">
                      {fmt(sale.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recently Added — col 8 */}
        <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:col-span-8">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <p className="text-sm font-semibold">Recently Added</p>
            <Link href="/dashboard/gems" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {s.recentItems.length === 0 ? (
            <p className="px-4 pb-4 pt-3 text-sm text-muted-foreground">No gems added yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
                  <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Name</th>
                  <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Type</th>
                  <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Species</th>
                  <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {s.recentItems.map((item) => {
                  const href = item.type === "Gem"
                    ? `/dashboard/gems/${item.id}`
                    : `/dashboard/parcels/${item.id}`;
                  const label = [item.species, item.variety].filter(Boolean).join(" — ") || "—";
                  return (
                    <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-2.5 font-medium">
                        <Link href={href} className="hover:underline">{item.name}</Link>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant={item.type === "Gem" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                          {item.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{label}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Business counters — col 12 */}
        <div className="grid grid-cols-3 gap-3 sm:col-span-12">
          <MiniStat label="Suppliers" value={s.supplierCount} icon={<Building2 size={14} />} href="/dashboard/suppliers" />
          <MiniStat label="Orders" value={s.purchaseOrderCount} icon={<ShoppingCart size={14} />} href="/dashboard/orders" />
          <MiniStat label="Sales" value={s.saleCount} icon={<TrendingUp size={14} />} href="/dashboard/sales" />
        </div>

      </div>
    </div>
  );
}

function MiniStat({ label, value, icon, href }: { label: string; value: number; icon: ReactNode; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-card px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">{icon}</div>
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </Link>
  );
}
