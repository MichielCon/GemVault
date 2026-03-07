"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createPurchaseOrder } from "@/lib/order-actions";
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
import type { SupplierDto, GemSummaryDto, GemParcelSummaryDto } from "@/lib/types";

interface LineItem {
  key: number;
  gemOrParcel: string | null; // "gem:<id>" or "parcel:<id>"
  costPrice: string;
  notes: string;
}

interface Props {
  suppliers: SupplierDto[];
  gems: GemSummaryDto[];
  parcels: GemParcelSummaryDto[];
}

const initialState = { error: null as string | null };

export function PurchaseOrderCreateForm({ suppliers, gems, parcels }: Props) {
  const [state, formAction, pending] = useActionState(createPurchaseOrder, initialState);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [items, setItems] = useState<LineItem[]>([]);
  const [nextKey, setNextKey] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const supplierOptions = suppliers.map((s) => ({ value: s.id, label: s.name }));

  const gemParcelOptions = [
    ...gems.map((g) => ({ value: `gem:${g.id}`, label: `${g.name} (Gem)` })),
    ...parcels.map((p) => ({ value: `parcel:${p.id}`, label: `${p.name} (Parcel)` })),
  ];

  function addItem() {
    setItems((prev) => [
      ...prev,
      { key: nextKey, gemOrParcel: null, costPrice: "", notes: "" },
    ]);
    setNextKey((k) => k + 1);
  }

  function removeItem(key: number) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function updateItem(key: number, patch: Partial<Omit<LineItem, "key">>) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }

  function buildItemsJson() {
    return JSON.stringify(
      items.map((i) => {
        const isGem = i.gemOrParcel?.startsWith("gem:");
        const id = i.gemOrParcel?.split(":")[1] ?? null;
        return {
          gemId: isGem ? id : null,
          gemParcelId: isGem ? null : id,
          costPrice: Number(i.costPrice) || 0,
          notes: i.notes || null,
        };
      })
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard/orders">
            <ArrowLeft size={16} />
            Back to orders
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">New purchase order</CardTitle>
          <CardDescription>Record a gem acquisition from a supplier.</CardDescription>
        </CardHeader>

        <form
          action={formAction}
          onSubmit={(e) => {
            // Inject items JSON into hidden input before submit
            const form = e.currentTarget;
            const hidden = form.querySelector<HTMLInputElement>('input[name="itemsJson"]');
            if (hidden) hidden.value = buildItemsJson();
          }}
        >
          <input type="hidden" name="itemsJson" value="" />

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
                <Label htmlFor="reference">Reference</Label>
                <Input id="reference" name="reference" placeholder="INV-2024-001" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="orderDate">
                  Order date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orderDate"
                  name="orderDate"
                  type="date"
                  defaultValue={today}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Order notes, payment terms…"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Line items */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Line items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus size={14} />
                  Add item
                </Button>
              </div>

              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No items yet. Click &quot;Add item&quot; to add gems or parcels.
                </p>
              )}

              {items.map((item) => (
                <div
                  key={item.key}
                  className="grid grid-cols-[1fr_120px_1fr_auto] gap-3 items-end rounded-lg border p-3"
                >
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Gem / Parcel</Label>
                    <Combobox
                      options={gemParcelOptions}
                      value={item.gemOrParcel}
                      onChange={(v) => updateItem(item.key, { gemOrParcel: v })}
                      placeholder="Select…"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Cost ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={item.costPrice}
                      onChange={(e) => updateItem(item.key, { costPrice: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Notes</Label>
                    <Input
                      placeholder="Optional"
                      value={item.notes}
                      onChange={(e) => updateItem(item.key, { notes: e.target.value })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.key)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Create order"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href="/dashboard/orders">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
