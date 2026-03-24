import { notFound } from "next/navigation";
import Link from "next/link";
import { suppliersApi, purchaseOrdersApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, ShoppingCart, ExternalLink, Mail, Phone, Globe } from "lucide-react";
import { DeleteSupplierButton } from "@/components/suppliers/delete-supplier-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SupplierDetailPage({ params }: Props) {
  const { id } = await params;

  let supplier;
  try {
    supplier = await suppliersApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  const ordersResult = await purchaseOrdersApi.list(1, 100, undefined, id).catch(() => null);
  const orders = ordersResult?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/dashboard/suppliers">
          <ArrowLeft size={16} />
          All suppliers
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{supplier.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {supplier.orderCount} order{supplier.orderCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/suppliers/${supplier.id}/edit`}>
              <Pencil size={14} />
              Edit
            </Link>
          </Button>
          <DeleteSupplierButton id={supplier.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              {supplier.email && (
                <>
                  <dt className="text-muted-foreground flex items-center gap-1"><Mail size={12} />Email</dt>
                  <dd className="font-medium">
                    <a href={`mailto:${supplier.email}`} className="text-violet-600 hover:underline underline-offset-2">
                      {supplier.email}
                    </a>
                  </dd>
                </>
              )}
              {supplier.phone && (
                <>
                  <dt className="text-muted-foreground flex items-center gap-1"><Phone size={12} />Phone</dt>
                  <dd className="font-medium">{supplier.phone}</dd>
                </>
              )}
              {supplier.website && (
                <>
                  <dt className="text-muted-foreground flex items-center gap-1"><Globe size={12} />Website</dt>
                  <dd className="font-medium">
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 hover:underline underline-offset-2 inline-flex items-center gap-1"
                    >
                      {supplier.website.replace(/^https?:\/\//, "")}
                      <ExternalLink size={11} className="opacity-60" />
                    </a>
                  </dd>
                </>
              )}
              <Detail label="Address" value={supplier.address} />
            </dl>
            {supplier.notes && (
              <p className="mt-3 text-sm text-muted-foreground">{supplier.notes}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <Detail label="Orders" value={String(supplier.orderCount)} />
              <Detail label="Added" value={new Date(supplier.createdAt).toLocaleDateString()} />
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Orders section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold">Orders ({orders.length})</h2>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders from this supplier yet.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Reference</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Date</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Items</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/dashboard/orders/${order.id}`} className="text-violet-600 hover:underline">
                        {order.reference ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{order.itemCount}</td>
                    <td className="px-4 py-3 font-medium">
                      {order.totalCost.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </>
  );
}
