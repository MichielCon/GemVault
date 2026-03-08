import Link from "next/link";
import { suppliersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import type { SupplierDto } from "@/lib/types";

export default async function SuppliersPage() {
  let suppliers: SupplierDto[];
  try {
    suppliers = await suppliersApi.list();
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <Header />
        <p className="text-muted-foreground">Failed to load suppliers. Is the API running?</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Header />

      {suppliers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left">
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Phone</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {suppliers.map((supplier) => (
                <SupplierRow key={supplier.id} supplier={supplier} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Suppliers</h1>
        <p className="text-sm text-muted-foreground">Manage your gem suppliers</p>
      </div>
      <Button asChild size="sm">
        <Link href="/dashboard/suppliers/new">
          <Plus size={16} />
          Add supplier
        </Link>
      </Button>
    </div>
  );
}

function SupplierRow({ supplier }: { supplier: SupplierDto }) {
  return (
    <tr className="hover:bg-muted/20 transition-colors">
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <Building2 size={40} strokeWidth={1} className="mb-3 text-muted-foreground/50" />
      <p className="font-medium">No suppliers yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Add suppliers to track where your gems come from.
      </p>
      <Button asChild size="sm" className="mt-4">
        <Link href="/dashboard/suppliers/new">
          <Plus size={16} />
          Add supplier
        </Link>
      </Button>
    </div>
  );
}
