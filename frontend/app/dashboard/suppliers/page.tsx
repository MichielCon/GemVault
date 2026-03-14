import Link from "next/link";
import { suppliersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Plus, Building2 } from "lucide-react";
import type { SupplierDto } from "@/lib/types";

interface Props {
  searchParams: Promise<{ search?: string }>;
}

export default async function SuppliersPage({ searchParams }: Props) {
  const { search } = await searchParams;

  let suppliers: SupplierDto[];
  try {
    suppliers = await suppliersApi.list(search);
  } catch {
    return <p className="text-muted-foreground">Failed to load suppliers. Is the API running?</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">Manage your gem suppliers</p>
        </div>
        <Button asChild size="sm" variant="violet">
          <Link href="/dashboard/suppliers/new">
            <Plus size={16} />
            Add supplier
          </Link>
        </Button>
      </div>

      <div className="shrink-0 mb-4">
        <SearchInput basePath="/dashboard/suppliers" placeholder="Search suppliers…" defaultValue={search} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {suppliers.length === 0 ? (
          <EmptyState hasSearch={!!search} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Name</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Email</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Phone</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {suppliers.map((supplier) => (
                  <SupplierRow key={supplier.id} supplier={supplier} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SupplierRow({ supplier }: { supplier: SupplierDto }) {
  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="px-4 py-3 font-medium">
        <Link href={`/dashboard/suppliers/${supplier.id}`} className="hover:underline">
          {supplier.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{supplier.email ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{supplier.phone ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{supplier.orderCount}</td>
    </tr>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white py-16 text-center">
      <Building2 size={40} strokeWidth={1} className="mb-3 text-zinc-300" />
      <p className="font-medium">{hasSearch ? "No results" : "No suppliers yet"}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasSearch ? "Try a different search term." : "Add suppliers to track where your gems come from."}
      </p>
      {!hasSearch && (
        <Button asChild size="sm" variant="violet" className="mt-4">
          <Link href="/dashboard/suppliers/new"><Plus size={16} />Add supplier</Link>
        </Button>
      )}
    </div>
  );
}
