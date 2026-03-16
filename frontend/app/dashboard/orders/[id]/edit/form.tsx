"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updatePurchaseOrder } from "@/lib/order-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { PurchaseOrderDto, SupplierDto } from "@/lib/types";

interface Props {
  order: PurchaseOrderDto;
  suppliers: SupplierDto[];
}

const initialState = { error: null as string | null, id: null as string | null };

export function OrderEditForm({ order, suppliers }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updatePurchaseOrder, initialState);

  const [supplierId, setSupplierId] = useState<string | null>(order.supplierId);

  const supplierOptions = suppliers.map((s) => ({ value: s.id, label: s.name }));

  const defaultDate = new Date(order.orderDate).toISOString().split("T")[0];

  useEffect(() => {
    if (state.id) router.push(`/dashboard/orders/${order.id}`);
  }, [state.id, router, order.id]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit text-zinc-500 hover:text-zinc-900"
        >
          <Link href={`/dashboard/orders/${order.id}`}>
            <ArrowLeft size={15} />
            Back to order
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit purchase order</CardTitle>
          <CardDescription>
            Update the order details. Line items cannot be changed after creation.
          </CardDescription>
        </CardHeader>

        <form action={formAction}>
          <input type="hidden" name="id" value={order.id} />

          <CardContent className="flex flex-col gap-5">
            {state.error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>
                  Supplier <span className="text-red-500">*</span>
                </Label>
                <Combobox
                  name="supplierId"
                  options={supplierOptions}
                  value={supplierId}
                  onChange={setSupplierId}
                  placeholder="Select supplier…"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reference">Reference / Invoice #</Label>
                <Input
                  id="reference"
                  name="reference"
                  placeholder="INV-2024-001"
                  defaultValue={order.reference ?? ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-1/2">
              <Label htmlFor="orderDate">
                Order date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="orderDate"
                name="orderDate"
                type="date"
                defaultValue={defaultDate}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Order notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Payment terms, delivery notes…"
                defaultValue={order.notes ?? ""}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" variant="violet" disabled={pending || !!state.id}>
              {pending || state.id ? "Saving…" : "Save changes"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href={`/dashboard/orders/${order.id}`}>Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
