import { notFound } from "next/navigation";
import Link from "next/link";
import { salesApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { DeleteSaleButton } from "@/components/sales/delete-sale-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SaleDetailPage({ params }: Props) {
  const { id } = await params;

  let sale;
  try {
    sale = await salesApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/dashboard/sales">
          <ArrowLeft size={16} />
          All sales
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sale — {new Date(sale.saleDate).toLocaleDateString()}
          </h1>
          {sale.buyerName && (
            <p className="mt-1 text-sm text-muted-foreground">Buyer: {sale.buyerName}</p>
          )}
        </div>
        <DeleteSaleButton id={sale.id} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Date</dt>
              <dd className="font-medium">{new Date(sale.saleDate).toLocaleDateString()}</dd>
              {sale.buyerName && (
                <>
                  <dt className="text-muted-foreground">Buyer</dt>
                  <dd className="font-medium">{sale.buyerName}</dd>
                </>
              )}
              {sale.buyerEmail && (
                <>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{sale.buyerEmail}</dd>
                </>
              )}
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-bold text-lg">
                {sale.totalSaleValue.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </dd>
            </dl>
            {sale.notes && (
              <p className="mt-3 text-sm text-muted-foreground">{sale.notes}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {sale.items.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Line items ({sale.items.length})</h2>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Sale price</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, i) => {
                  const name = item.gemName ?? item.gemParcelName ?? "—";
                  const type = item.gemId ? "Gem" : "Parcel";
                  const href = item.gemId
                    ? `/dashboard/gems/${item.gemId}`
                    : item.gemParcelId
                    ? `/dashboard/parcels/${item.gemParcelId}`
                    : null;

                  return (
                    <tr key={item.id} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                      <td className="px-4 py-3 font-medium">
                        {href ? (
                          <Link href={href} className="hover:underline">
                            {name}
                          </Link>
                        ) : (
                          name
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.quantity}</td>
                      <td className="px-4 py-3 font-medium">
                        {item.salePrice.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
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
