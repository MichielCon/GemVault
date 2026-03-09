import type { ReactNode } from "react";
import Link from "next/link";
import { dashboardApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Gem, Package, DollarSign, TrendingUp, Building2, ShoppingCart, ArrowUpRight, AlertTriangle } from "lucide-react";
import type { DashboardStatsDto } from "@/lib/types";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SpeciesDonut } from "@/components/dashboard/species-donut";

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
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Collection and business overview</p>
      </div>

      {statsError && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <AlertTriangle size={16} className="shrink-0" />
          <span>Dashboard statistics are temporarily unavailable. Showing placeholder data.</span>
        </div>
      )}

      {/* Row 1 — Primary KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard
          label="In Stock"
          value={s.unsoldGemCount.toLocaleString()}
          sub={`${s.gemCount} total gems`}
          icon={<Gem size={16} />}
          iconBg="bg-violet-100 text-violet-600"
          href="/dashboard/gems"
        />
        <KpiCard
          label="Inventory Value"
          value={fmt(s.unsoldInventoryValue)}
          sub="cost of unsold items"
          icon={<Package size={16} />}
          iconBg="bg-blue-100 text-blue-600"
          href="/dashboard/gems"
        />
        <KpiCard
          label="Revenue"
          value={fmt(s.totalSalesValue)}
          sub={`from ${s.saleCount} sale${s.saleCount !== 1 ? "s" : ""}`}
          icon={<DollarSign size={16} />}
          iconBg="bg-amber-100 text-amber-600"
          href="/dashboard/sales"
        />
        <KpiCard
          label="Net Profit"
          value={`${profitPositive ? "+" : ""}${fmt(s.netProfit)}`}
          sub={s.totalSalesValue > 0 ? `${s.profitMarginPct}% margin` : "no sales yet"}
          icon={<TrendingUp size={16} />}
          iconBg={profitPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
          valueColor={profitPositive ? "text-green-700" : "text-red-700"}
          href="/dashboard/sales"
        />
      </div>

      {/* Row 2 — Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue bar chart — 2/3 */}
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Revenue</p>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <Link href="/dashboard/sales" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              View sales <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="h-48">
            <RevenueChart data={s.monthlyRevenue} />
          </div>
        </div>

        {/* Species donut — 1/3 */}
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold">Inventory Composition</p>
            <p className="text-xs text-muted-foreground">Unsold gems by species</p>
          </div>
          <div className="flex-1 min-h-[192px]">
            <SpeciesDonut data={s.inventoryBySpecies} totalUnsold={s.unsoldGemCount} />
          </div>
        </div>
      </div>

      {/* Row 3 — Activity tables */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent sales */}
        <div className="flex flex-col gap-3 rounded-lg border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Recent Sales</p>
            <Link href="/dashboard/sales" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {s.recentSales.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-muted-foreground">No sales recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20 text-left">
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Buyer</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {s.recentSales.map((sale) => (
                  <tr key={sale.saleId} className="hover:bg-muted/20 transition-colors">
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

        {/* Recently added */}
        <div className="flex flex-col gap-3 rounded-lg border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Recently Added</p>
            <Link href="/dashboard/gems" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {s.recentItems.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-muted-foreground">No gems added yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20 text-left">
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Species</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted-foreground">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {s.recentItems.map((item) => {
                  const href = item.type === "Gem"
                    ? `/dashboard/gems/${item.id}`
                    : `/dashboard/parcels/${item.id}`;
                  const label = [item.species, item.variety].filter(Boolean).join(" — ") || "—";
                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
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
      </div>

      {/* Row 4 — Business counters */}
      <div className="grid grid-cols-3 gap-4">
        <MiniStat label="Suppliers" value={s.supplierCount} icon={<Building2 size={14} />} href="/dashboard/suppliers" />
        <MiniStat label="Orders" value={s.purchaseOrderCount} icon={<ShoppingCart size={14} />} href="/dashboard/orders" />
        <MiniStat label="Sales" value={s.saleCount} icon={<TrendingUp size={14} />} href="/dashboard/sales" />
      </div>
    </div>
  );
}

function KpiCard({
  label, value, sub, icon, iconBg, href, valueColor,
}: {
  label: string; value: string; sub: string;
  icon: ReactNode; iconBg: string; href: string;
  valueColor?: string;
}) {
  return (
    <Link href={href} className="group flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-md ${iconBg}`}>{icon}</div>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight ${valueColor ?? ""}`}>{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
      </div>
    </Link>
  );
}

function MiniStat({ label, value, icon, href }: { label: string; value: number; icon: ReactNode; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm transition-all hover:shadow-md">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">{icon}</div>
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </Link>
  );
}
