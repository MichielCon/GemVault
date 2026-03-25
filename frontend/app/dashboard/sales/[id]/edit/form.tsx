"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateSale } from "@/lib/sale-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { SaleDto } from "@/lib/types";

interface Props {
  sale: SaleDto;
}

const initialState = { error: null as string | null, id: null as string | null };

export function SaleEditForm({ sale }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateSale, initialState);

  const saleDateValue = new Date(sale.saleDate).toISOString().split("T")[0];

  useEffect(() => {
    if (state.id) router.push(`/dashboard/sales/${sale.id}`);
  }, [state.id, router, sale.id]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit text-zinc-500 hover:text-zinc-900"
        >
          <Link href={`/dashboard/sales/${sale.id}`}>
            <ArrowLeft size={16} />
            Back to sale
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit sale</CardTitle>
          <CardDescription>Update the sale details below.</CardDescription>
        </CardHeader>

        <form action={formAction}>
          <input type="hidden" name="id" value={sale.id} />

          <CardContent className="flex flex-col gap-5">
            {state.error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}

            <div className="flex flex-col gap-1.5 w-1/2">
              <Label htmlFor="saleDate">
                Sale date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="saleDate"
                name="saleDate"
                type="date"
                defaultValue={saleDateValue}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="buyerName">Buyer name</Label>
                <Input
                  id="buyerName"
                  name="buyerName"
                  placeholder="Jane Smith"
                  defaultValue={sale.buyerName ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="buyerEmail">Buyer email</Label>
                <Input
                  id="buyerEmail"
                  name="buyerEmail"
                  type="email"
                  placeholder="jane@example.com"
                  defaultValue={sale.buyerEmail ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="buyerPhone">Buyer phone</Label>
                <Input
                  id="buyerPhone"
                  name="buyerPhone"
                  placeholder="+1 555 000 0000"
                  defaultValue={sale.buyerPhone ?? ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Sale notes, payment method…"
                defaultValue={sale.notes ?? ""}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {sale.items.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Line items (read-only)</p>
                <div className="overflow-hidden rounded-lg border border-zinc-200/80">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50/60">
                        <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Item</th>
                        <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Qty</th>
                        <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {sale.items.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-50">
                          <td className="px-3 py-2 text-zinc-700">
                            {item.gemName ?? item.gemParcelName ?? <span className="text-zinc-400 italic">No item linked</span>}
                          </td>
                          <td className="px-3 py-2 text-right text-zinc-500">{item.quantity}</td>
                          <td className="px-3 py-2 text-right font-medium text-zinc-800">
                            {item.salePrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-zinc-400">Line items cannot be edited after creation.</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" variant="violet" disabled={pending || !!state.id}>
              {pending || state.id ? "Saving…" : "Save changes"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href={`/dashboard/sales/${sale.id}`}>Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
