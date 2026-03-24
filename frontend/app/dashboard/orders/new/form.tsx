"use client";

import { Fragment, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPurchaseOrder } from "@/lib/order-actions";
import { createSupplierInline } from "@/lib/supplier-actions";
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
import { ArrowLeft, Plus, Trash2, UserPlus, X } from "lucide-react";
import type { SupplierDto, GemSummaryDto, GemParcelSummaryDto } from "@/lib/types";

interface LineItem {
  key: number;
  description: string;       // maps to notes — what you're buying
  costPrice: string;
  gemOrParcel: string | null; // optional link to existing inventory
}

interface Props {
  suppliers: SupplierDto[];
  gems: GemSummaryDto[];
  parcels: GemParcelSummaryDto[];
}

const initialState = { error: null as string | null, id: null as string | null };

export function PurchaseOrderCreateForm({ suppliers, gems, parcels }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createPurchaseOrder, initialState);

  const [localSuppliers, setLocalSuppliers] = useState(suppliers);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [items, setItems] = useState<LineItem[]>([{ key: 0, description: "", costPrice: "", gemOrParcel: null }]);
  const [nextKey, setNextKey] = useState(1);

  // Inline supplier creation
  const [showNewSupplier, setShowNewSupplier] = useState(suppliers.length === 0);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierEmail, setNewSupplierEmail] = useState("");
  const [supplierSaving, setSupplierSaving] = useState(false);
  const [supplierError, setSupplierError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const supplierOptions = localSuppliers.map((s) => ({ value: s.id, label: s.name }));
  const gemParcelOptions = [
    ...gems.map((g) => ({ value: `gem:${g.id}`, label: `${g.name} (Gem)` })),
    ...parcels.map((p) => ({ value: `parcel:${p.id}`, label: `${p.name} (Parcel)` })),
  ];

  const runningTotal = items.reduce((sum, i) => sum + (Number(i.costPrice) || 0), 0);

  // Navigate after successful creation
  useEffect(() => {
    if (state.id) router.push(`/dashboard/orders/${state.id}`);
  }, [state.id, router]);

  function addItem() {
    setItems((prev) => [...prev, { key: nextKey, description: "", costPrice: "", gemOrParcel: null }]);
    setNextKey((k) => k + 1);
  }

  function removeItem(key: number) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function updateItem(key: number, patch: Partial<Omit<LineItem, "key">>) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }

  async function handleCreateSupplier() {
    if (!newSupplierName.trim()) return;
    setSupplierSaving(true);
    setSupplierError(null);
    const fd = new FormData();
    fd.append("name", newSupplierName.trim());
    if (newSupplierEmail.trim()) fd.append("email", newSupplierEmail.trim());
    const result = await createSupplierInline(fd);
    setSupplierSaving(false);
    if (result.error) {
      setSupplierError(result.error);
    } else if (result.supplier) {
      setLocalSuppliers((prev) => [
        ...prev,
        { ...result.supplier!, email: null, phone: null, website: null, address: null, notes: null, orderCount: 0, createdAt: new Date().toISOString() },
      ]);
      setSupplierId(result.supplier.id);
      setShowNewSupplier(false);
      setNewSupplierName("");
      setNewSupplierEmail("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
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

        <form action={formAction}>
          {/* Hidden inputs for each line item — React-controlled from state */}
          {items.map((item) => {
            const isGem = item.gemOrParcel?.startsWith("gem:");
            const gpId = item.gemOrParcel?.split(":")[1] ?? "";
            return (
              <Fragment key={item.key}>
                <input type="hidden" name="item_gemId" value={isGem ? gpId : ""} />
                <input type="hidden" name="item_parcelId" value={isGem === false ? gpId : ""} />
                <input type="hidden" name="item_costPrice" value={item.costPrice} />
                <input type="hidden" name="item_notes" value={item.description} />
              </Fragment>
            );
          })}

          <CardContent className="flex flex-col gap-5">
            {state.error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}

            {/* Supplier */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Supplier <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
                  {localSuppliers.length > 0 && !showNewSupplier && (
                    <Combobox
                      name="supplierId"
                      options={supplierOptions}
                      value={supplierId}
                      onChange={setSupplierId}
                      placeholder="Select supplier…"
                    />
                  )}
                  {localSuppliers.length === 0 && !showNewSupplier && (
                    <p className="text-sm text-muted-foreground italic">No suppliers yet — create one below.</p>
                  )}
                  {!supplierId && !showNewSupplier && (
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-muted-foreground">Or bought from</Label>
                      <Input
                        name="boughtFrom"
                        placeholder="e.g. Gem show, eBay, private sale…"
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reference">Reference / Invoice #</Label>
                  <Input id="reference" name="reference" placeholder="INV-2024-001" />
                </div>
              </div>

              {/* Inline new supplier */}
              {showNewSupplier ? (
                <div className="rounded-lg border border-dashed p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">New supplier</p>
                    {localSuppliers.length > 0 && (
                      <button
                        type="button"
                        onClick={() => { setShowNewSupplier(false); setSupplierError(null); }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                  {supplierError && <p className="text-sm text-red-600">{supplierError}</p>}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs">Name <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="Supplier name"
                        value={newSupplierName}
                        onChange={(e) => setNewSupplierName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleCreateSupplier(); } }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs">Email</Label>
                      <Input
                        type="email"
                        placeholder="supplier@example.com"
                        value={newSupplierEmail}
                        onChange={(e) => setNewSupplierEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleCreateSupplier(); } }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={!newSupplierName.trim() || supplierSaving}
                      onClick={() => void handleCreateSupplier()}
                    >
                      {supplierSaving ? "Creating…" : "Create & select"}
                    </Button>
                    {localSuppliers.length > 0 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => { setShowNewSupplier(false); setSupplierError(null); }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewSupplier(true)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground w-fit"
                >
                  <UserPlus size={13} />
                  Add new supplier
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5 w-1/2">
              <Label htmlFor="orderDate">
                Order date <span className="text-red-500">*</span>
              </Label>
              <Input id="orderDate" name="orderDate" type="date" defaultValue={today} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Order notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Payment terms, delivery notes…"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Line items */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold">Items ordered</p>
                  <p className="text-xs text-muted-foreground">What are you buying? You can link to your inventory later.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus size={14} />
                  Add item
                </Button>
              </div>

              {items.map((item) => (
                <div key={item.key} className="rounded-lg border p-3 flex flex-col gap-3">
                  <div className="grid grid-cols-[1fr_140px_auto] gap-3 items-end">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <Input
                        placeholder="e.g. 3ct Ruby rough, unheated"
                        value={item.description}
                        onChange={(e) => updateItem(item.key, { description: e.target.value })}
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
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Link to existing gem/parcel (optional)</Label>
                    <Combobox
                      options={gemParcelOptions}
                      value={item.gemOrParcel}
                      onChange={(v) => updateItem(item.key, { gemOrParcel: v })}
                      placeholder="Search your inventory…"
                    />
                  </div>
                </div>
              ))}

              {items.some((i) => Number(i.costPrice) > 0) && (
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
              {pending || state.id ? "Saving…" : "Create order"}
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
