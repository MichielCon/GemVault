import Link from "next/link";
import { salesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { SaleTableRow } from "@/components/sales/sale-table-row";
import { Plus, TrendingUp } from "lucide-react";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function SalesPage({ searchParams }: Props) {
  const { page: pageStr, search } = await searchParams;
  const page = Number(pageStr ?? 1);

  let result;
  try {
    result = await salesApi.list(page, 12, search);
  } catch {
    return <p className="text-muted-foreground">Failed to load sales. Is the API running?</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Sales</h1>
          <p className="text-sm text-muted-foreground">Record and track gem sales</p>
        </div>
        <Button asChild size="sm" variant="violet">
          <Link href="/dashboard/sales/new"><Plus size={16} />New sale</Link>
        </Button>
      </div>

      <div className="shrink-0 mb-4">
        <SearchInput basePath="/dashboard/sales" placeholder="Search by buyer name…" defaultValue={search} />
      </div>

      <div className="flex-1 min-h-0">
        {result.items.length === 0 ? (
          <EmptyState hasSearch={!!search} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Date</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Buyer</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Items</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {result.items.map((sale) => (
                  <SaleTableRow key={sale.id} sale={sale} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="shrink-0 pt-3">
        <Pagination page={page} totalPages={result.totalPages} search={search} />
      </div>
    </div>
  );
}


function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white py-16 text-center">
      <TrendingUp size={40} strokeWidth={1} className="mb-3 text-zinc-300" />
      <p className="font-medium">{hasSearch ? "No results" : "No sales yet"}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasSearch ? "Try a different search term." : "Record your first sale to track revenue."}
      </p>
      {!hasSearch && (
        <Button asChild size="sm" variant="violet" className="mt-4">
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
      {page <= 1 ? (
        <Button variant="outline" size="sm" disabled>Previous</Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href={url(page - 1)}>Previous</Link>
        </Button>
      )}
      <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
      {page >= totalPages ? (
        <Button variant="outline" size="sm" disabled>Next</Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href={url(page + 1)}>Next</Link>
        </Button>
      )}
    </div>
  );
}
