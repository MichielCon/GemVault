import Link from "next/link";
import { salesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Plus, TrendingUp } from "lucide-react";
import type { SaleSummaryDto } from "@/lib/types";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function SalesPage({ searchParams }: Props) {
  const { page: pageStr, search } = await searchParams;
  const page = Number(pageStr ?? 1);

  let result;
  try {
    result = await salesApi.list(page, 20, search);
  } catch {
    return <p className="text-muted-foreground">Failed to load sales. Is the API running?</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Sales</h1>
          <p className="text-sm text-muted-foreground">Record and track gem sales</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/sales/new"><Plus size={16} />New sale</Link>
        </Button>
      </div>

      <SearchInput basePath="/dashboard/sales" placeholder="Search by buyer name…" defaultValue={search} />

      {result.items.length === 0 ? (
        <EmptyState hasSearch={!!search} />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Buyer</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.items.map((sale) => (
                  <SaleRow key={sale.id} sale={sale} />
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={result.totalPages} search={search} />
        </>
      )}
    </div>
  );
}

function SaleRow({ sale }: { sale: SaleSummaryDto }) {
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3 font-medium">
        <Link href={`/dashboard/sales/${sale.id}`} className="hover:underline">
          {new Date(sale.saleDate).toLocaleDateString()}
        </Link>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{sale.buyerName ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{sale.itemCount}</td>
      <td className="px-4 py-3 font-medium">
        {sale.totalSaleValue.toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </td>
    </tr>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <TrendingUp size={40} strokeWidth={1} className="mb-3 text-muted-foreground/50" />
      <p className="font-medium">{hasSearch ? "No results" : "No sales yet"}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasSearch ? "Try a different search term." : "Record your first sale to track revenue."}
      </p>
      {!hasSearch && (
        <Button asChild size="sm" className="mt-4">
          <Link href="/dashboard/sales/new"><Plus size={16} />New sale</Link>
        </Button>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, search }: { page: number; totalPages: number; search?: string }) {
  if (totalPages <= 1) return null;
  function url(p: number) {
    const q = new URLSearchParams({ page: String(p) });
    if (search) q.set("search", search);
    return `/dashboard/sales?${q}`;
  }
  return (
    <div className="flex items-center justify-center gap-2">
      <Button asChild variant="outline" size="sm" disabled={page <= 1}>
        <Link href={url(page - 1)}>Previous</Link>
      </Button>
      <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
      <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
        <Link href={url(page + 1)}>Next</Link>
      </Button>
    </div>
  );
}
