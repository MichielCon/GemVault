"use client";

import { Fragment, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSale } from "@/lib/sale-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { GemSummaryDto, GemParcelSummaryDto } from "@/lib/types";

interface LineItem {
  key: number;
  gemOrParcel: string | null;
  quantity: string;
  salePrice: string;
}

interface Props {
  gems: GemSummaryDto[];
  parcels: GemParcelSummaryDto[];
  preselectedItem?: string | null;
}

const initialState = { error: null as string | null, id: null as string | null };

export function SaleCreateForm({ gems, parcels, preselectedItem }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createSale, initialState);
  const [items, setItems] = useState<LineItem[]>([
    { key: 0, gemOrParcel: preselectedItem ?? null, quantity: "1", salePrice: "" },
  ]);
  const [nextKey, setNextKey] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  const gemParcelOptions = [
    ...gems.map((g) => ({ value: `gem:${g.id}`, label: `${g.name} (Gem)` })),
    ...parcels.map((p) => ({ value: `parcel:${p.id}`, label: `${p.name} (Parcel)` })),
  ];

  const runningTotal = items.reduce((sum, i) => sum + (Number(i.salePrice) || 0), 0);

  // Navigate after successful creation
  useEffect(() => {
    if (state.id) router.push(`/dashboard/sales/${state.id}`);
  }, [state.id, router]);

  function addItem() {
    setItems((prev) => [...prev, { key: nextKey, gemOrParcel: null, quantity: "1", salePrice: "" }]);
    setNextKey((k) => k + 1);
  }

  function removeItem(key: number) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function updateItem(key: number, patch: Partial<Omit<LineItem, "key">>) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard/sales">
            <ArrowLeft size={16} />
            Back to sales
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">New sale</CardTitle>
          <CardDescription>Record a gem sale transaction.</CardDescription>
        </CardHeader>

        <form action={formAction}>
          {/* Hidden inputs for each line item — React-controlled from state */}
          {items.map((item) => {
            const isGem = item.gemOrParcel?.startsWith("gem:");
            const gpId = item.gemOrParcel?.split(":")[1] ?? "";
            return (
              <Fragment key={item.key}>
                <input type="hidden" name="item_gemId" value={isGem ? gpId : ""} />
                <input type="hidden" name="item_parcelId" value={isGem === false ? gpId : ""} />
                <input type="hidden" name="item_qty" value={item.quantity} />
                <input type="hidden" name="item_price" value={item.salePrice} />
              </Fragment>
            );
          })}

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
              <Input id="saleDate" name="saleDate" type="date" defaultValue={today} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="buyerName">Buyer name</Label>
                <Input id="buyerName" name="buyerName" placeholder="Jane Smith" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="buyerEmail">Buyer email</Label>
                <Input id="buyerEmail" name="buyerEmail" type="email" placeholder="jane@example.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="buyerPhone">Buyer phone</Label>
                <Input id="buyerPhone" name="buyerPhone" placeholder="+1 555 000 0000" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Sale notes, payment method…"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Line items */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Items sold</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus size={14} />
                  Add item
                </Button>
              </div>

              {items.map((item) => (
                <div
                  key={item.key}
                  className="grid grid-cols-[1fr_80px_130px_auto] gap-3 items-end rounded-lg border p-3"
                >
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Gem / Parcel</Label>
                    <Combobox
                      options={gemParcelOptions}
                      value={item.gemOrParcel}
                      onChange={(v) => updateItem(item.key, { gemOrParcel: v })}
                      placeholder="Search inventory…"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.key, { quantity: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Sale price ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={item.salePrice}
                      onChange={(e) => updateItem(item.key, { salePrice: e.target.value })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.key)}
                    disabled={items.length === 1}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              ))}

              {items.some((i) => Number(i.salePrice) > 0) && (
                <div className="flex justify-end">
                  <p className="text-sm font-medium">
                    Total:{" "}
                    <span className="font-semibold">
                      ${runningTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" disabled={pending || !!state.id}>
              {pending || state.id ? "Saving…" : "Record sale"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href="/dashboard/sales">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
