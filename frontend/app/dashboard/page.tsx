import type { ReactNode } from "react";
import Link from "next/link";
import { dashboardApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gem, Package, DollarSign, TrendingUp, Building2, ShoppingCart } from "lucide-react";
import type { DashboardStatsDto } from "@/lib/types";

function fmt(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function DashboardPage() {
  let stats: DashboardStatsDto | null = null;
  try {
    stats = await dashboardApi.stats();
  } catch {
    // gracefully show zeros
  }

  const s: DashboardStatsDto = stats ?? {
    gemCount: 0,
    parcelCount: 0,
    parcelTotalQuantity: 0,
    totalPurchaseValue: 0,
    totalSalesValue: 0,
    supplierCount: 0,
    purchaseOrderCount: 0,
    saleCount: 0,
    recentItems: [],
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your collection and business</p>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Gems"
          value={s.gemCount.toLocaleString()}
          description="Individual gemstones"
          icon={<Gem size={20} className="text-muted-foreground" />}
          href="/dashboard/gems"
        />
        <StatCard
          label="Parcels"
          value={s.parcelCount.toLocaleString()}
          description={`${s.parcelTotalQuantity.toLocaleString()} stones total`}
          icon={<Package size={20} className="text-muted-foreground" />}
          href="/dashboard/parcels"
        />
        <StatCard
          label="Total Invested"
          value={fmt(s.totalPurchaseValue)}
          description="Sum of purchase orders"
          icon={<DollarSign size={20} className="text-muted-foreground" />}
          href="/dashboard/orders"
        />
        <StatCard
          label="Total Sales"
          value={fmt(s.totalSalesValue)}
          description="Sum of recorded sales"
          icon={<TrendingUp size={20} className="text-muted-foreground" />}
          href="/dashboard/sales"
        />
      </div>

      {/* Secondary stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Suppliers"
          value={s.supplierCount.toLocaleString()}
          description="Active suppliers"
          icon={<Building2 size={20} className="text-muted-foreground" />}
          href="/dashboard/suppliers"
        />
        <StatCard
          label="Purchase Orders"
          value={s.purchaseOrderCount.toLocaleString()}
          description="All time orders"
          icon={<ShoppingCart size={20} className="text-muted-foreground" />}
          href="/dashboard/orders"
        />
        <StatCard
          label="Sales"
          value={s.saleCount.toLocaleString()}
          description="Completed sales"
          icon={<TrendingUp size={20} className="text-muted-foreground" />}
          href="/dashboard/sales"
        />
      </div>

      {/* Recent items */}
      {s.recentItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Recently added</h2>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Species / Variety</th>
                  <th className="px-4 py-3 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {s.recentItems.slice(0, 5).map((item, i) => {
                  const href =
                    item.type === "Gem"
                      ? `/dashboard/gems/${item.id}`
                      : `/dashboard/parcels/${item.id}`;
                  const label = [item.species, item.variety].filter(Boolean).join(" — ") || "—";
                  return (
                    <tr key={item.id} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                      <td className="px-4 py-3 font-medium">
                        <Link href={href} className="hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={item.type === "Gem" ? "default" : "secondary"}>
                          {item.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{label}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  href,
}: {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
