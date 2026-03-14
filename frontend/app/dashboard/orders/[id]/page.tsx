import { notFound } from "next/navigation";
import Link from "next/link";
import { purchaseOrdersApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { DeleteOrderButton } from "@/components/orders/delete-order-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  let order;
  try {
    order = await purchaseOrdersApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  return (
    <div className="flex flex-col gap-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-zinc-500 hover:text-zinc-900">
        <Link href="/dashboard/orders">
          <ArrowLeft size={15} />
          All orders
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {order.reference ?? "Purchase Order"}
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {order.supplierName} · {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        <DeleteOrderButton id={order.id} />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card hoverable>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
              <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Supplier</dt>
              <dd className="font-medium text-zinc-800">{order.supplierName}</dd>
              <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Date</dt>
              <dd className="font-medium text-zinc-800">{new Date(order.orderDate).toLocaleDateString()}</dd>
              {order.reference && (
                <>
                  <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Reference</dt>
                  <dd className="font-medium text-zinc-800">{order.reference}</dd>
                </>
              )}
              <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Total cost</dt>
              <dd className="text-xl font-bold text-zinc-900">
                {order.totalCost.toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </dd>
            </dl>
            {order.notes && (
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed">{order.notes}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {order.items.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Line items ({order.items.length})</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Item</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Type</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Cost</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {order.items.map((item) => {
                  const name = item.gemName ?? item.gemParcelName ?? "—";
                  const type = item.gemId ? "Gem" : "Parcel";
                  const href = item.gemId
                    ? `/dashboard/gems/${item.gemId}`
                    : item.gemParcelId
                    ? `/dashboard/parcels/${item.gemParcelId}`
                    : null;

                  return (
                    <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        {href ? (
                          <Link href={href} className="text-violet-600 hover:underline">
                            {name}
                          </Link>
                        ) : (
                          name
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{type}</td>
                      <td className="px-4 py-3 font-medium">
                        {item.costPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{item.notes ?? "—"}</td>
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
