import Link from "next/link";
import { purchaseOrdersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import type { PurchaseOrderSummaryDto } from "@/lib/types";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr ?? 1);

  let result;
  try {
    result = await purchaseOrdersApi.list(page, 20);
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <Header />
        <p className="text-muted-foreground">Failed to load orders. Is the API running?</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Header />

      {result.items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Reference</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Supplier</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.items.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={result.totalPages} />
        </>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Purchase Orders</h1>
        <p className="text-sm text-muted-foreground">Track gem acquisitions</p>
      </div>
      <Button asChild size="sm">
        <Link href="/dashboard/orders/new">
          <Plus size={16} />
          New order
        </Link>
      </Button>
    </div>
  );
}

function OrderRow({ order }: { order: PurchaseOrderSummaryDto }) {
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3 font-medium">
        <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
          {order.reference ?? <span className="text-muted-foreground">—</span>}
        </Link>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{order.supplierName}</td>
      <td className="px-4 py-3 text-muted-foreground">
        {new Date(order.orderDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-muted-foreground">{order.itemCount}</td>
      <td className="px-4 py-3 font-medium">
        {order.totalCost.toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <ShoppingCart size={48} strokeWidth={1} className="mb-4 text-muted-foreground" />
      <p className="font-medium">No orders yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Record your first purchase order to track acquisition costs.
      </p>
      <Button asChild size="sm" className="mt-4">
        <Link href="/dashboard/orders/new">
          <Plus size={16} />
          New order
        </Link>
      </Button>
    </div>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button asChild variant="outline" size="sm" disabled={page <= 1}>
        <Link href={`/dashboard/orders?page=${page - 1}`}>Previous</Link>
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>
      <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
        <Link href={`/dashboard/orders?page=${page + 1}`}>Next</Link>
      </Button>
    </div>
  );
}
