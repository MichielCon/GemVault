"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Truck, Pencil, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateConsignmentInfo } from "@/lib/gem-actions";
import type { GemDto } from "@/lib/types";

interface Props {
  gem: GemDto;
}

export function ConsignmentInfoCard({ gem }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [consigneeName, setConsigneeName] = useState(gem.consigneeName ?? "");
  const [consigneeContact, setConsigneeContact] = useState(gem.consigneeContact ?? "");
  const [targetPrice, setTargetPrice] = useState(
    gem.consignmentTargetPrice != null ? String(gem.consignmentTargetPrice) : ""
  );
  const [consignmentDate, setConsignmentDate] = useState(gem.consignmentDate ?? "");
  const [returnDate, setReturnDate] = useState(gem.consignmentReturnDate ?? "");

  const hasData =
    gem.consigneeName ||
    gem.consigneeContact ||
    gem.consignmentTargetPrice != null ||
    gem.consignmentDate ||
    gem.consignmentReturnDate;

  function handleSave() {
    startTransition(async () => {
      setError(null);
      const result = await updateConsignmentInfo(gem.id, {
        consigneeName: consigneeName || null,
        consigneeContact: consigneeContact || null,
        consignmentTargetPrice: targetPrice ? Number(targetPrice) : null,
        consignmentDate: consignmentDate || null,
        consignmentReturnDate: returnDate || null,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setEditing(false);
        router.refresh();
      }
    });
  }

  return (
    <Card className="border-orange-200/80 bg-orange-50/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-orange-700 uppercase tracking-wide flex items-center gap-1.5">
            <Truck size={13} />
            On Consignment
          </CardTitle>
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-orange-600 hover:text-orange-800 hover:bg-orange-100"
              onClick={() => setEditing(true)}
            >
              <Pencil size={12} className="mr-1" />
              {hasData ? "Edit" : "Add details"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consigneeName" className="text-xs text-orange-700/70">Consignee name</Label>
                <Input
                  id="consigneeName"
                  placeholder="Shop or person name"
                  value={consigneeName}
                  onChange={(e) => setConsigneeName(e.target.value)}
                  className="h-8 text-sm bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consigneeContact" className="text-xs text-orange-700/70">Contact</Label>
                <Input
                  id="consigneeContact"
                  placeholder="Phone or email"
                  value={consigneeContact}
                  onChange={(e) => setConsigneeContact(e.target.value)}
                  className="h-8 text-sm bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="targetPrice" className="text-xs text-orange-700/70">Target price (USD)</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 250.00"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="h-8 text-sm bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consignmentDate" className="text-xs text-orange-700/70">Date sent</Label>
                <Input
                  id="consignmentDate"
                  type="date"
                  value={consignmentDate}
                  onChange={(e) => setConsignmentDate(e.target.value)}
                  className="h-8 text-sm bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="returnDate" className="text-xs text-orange-700/70">Due back</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="h-8 text-sm bg-white"
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 px-3 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleSave}
                disabled={isPending}
              >
                <Check size={11} className="mr-1" />
                {isPending ? "Saving…" : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-xs"
                onClick={() => { setEditing(false); setError(null); }}
                disabled={isPending}
              >
                <X size={11} className="mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : hasData ? (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {gem.consigneeName && (
              <>
                <dt className="text-orange-600/80 text-xs font-medium uppercase tracking-wide">With</dt>
                <dd className="font-medium text-zinc-800">{gem.consigneeName}</dd>
              </>
            )}
            {gem.consigneeContact && (
              <>
                <dt className="text-orange-600/80 text-xs font-medium uppercase tracking-wide">Contact</dt>
                <dd className="font-medium text-zinc-800">{gem.consigneeContact}</dd>
              </>
            )}
            {gem.consignmentTargetPrice != null && (
              <>
                <dt className="text-orange-600/80 text-xs font-medium uppercase tracking-wide">Target price</dt>
                <dd className="font-medium text-zinc-800">
                  {gem.consignmentTargetPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </dd>
              </>
            )}
            {gem.consignmentDate && (
              <>
                <dt className="text-orange-600/80 text-xs font-medium uppercase tracking-wide">Sent</dt>
                <dd className="font-medium text-zinc-800">
                  {new Date(gem.consignmentDate).toLocaleDateString()}
                </dd>
              </>
            )}
            {gem.consignmentReturnDate && (
              <>
                <dt className="text-orange-600/80 text-xs font-medium uppercase tracking-wide">Due back</dt>
                <dd className="font-medium text-zinc-800">
                  {new Date(gem.consignmentReturnDate).toLocaleDateString()}
                </dd>
              </>
            )}
          </dl>
        ) : (
          <p className="text-sm text-orange-600/60">No consignment details recorded yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
