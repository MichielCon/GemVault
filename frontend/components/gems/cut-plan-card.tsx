"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Scissors, Pencil, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateGemCutPlan } from "@/lib/gem-actions";
import type { GemDto } from "@/lib/types";

interface Props {
  gem: GemDto;
}

export function CutPlanCard({ gem }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [roughWeight, setRoughWeight] = useState(
    gem.roughWeightCarats?.toString() ?? ""
  );
  const [planNotes, setPlanNotes] = useState(gem.cutPlanNotes ?? "");
  const [error, setError] = useState<string | null>(null);

  const yieldPct =
    gem.roughWeightCarats && gem.roughWeightCarats > 0 && gem.weightCarats
      ? Math.round((gem.weightCarats / gem.roughWeightCarats) * 100)
      : null;

  function handleCancel() {
    setRoughWeight(gem.roughWeightCarats?.toString() ?? "");
    setPlanNotes(gem.cutPlanNotes ?? "");
    setError(null);
    setEditing(false);
  }

  function handleSave() {
    startTransition(async () => {
      const rw = roughWeight ? Number(roughWeight) : null;
      const result = await updateGemCutPlan(gem.id, rw, planNotes || null);
      if (result.error) {
        setError(result.error);
      } else {
        setEditing(false);
        setError(null);
        router.refresh();
      }
    });
  }

  return (
    <Card hoverable>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
            <Scissors size={13} />
            Cut Plan
          </CardTitle>
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-700"
              onClick={() => setEditing(true)}
            >
              <Pencil size={12} className="mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="roughWeight" className="text-xs text-zinc-500">
                Rough weight (ct)
              </Label>
              <Input
                id="roughWeight"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 5.20"
                value={roughWeight}
                onChange={(e) => setRoughWeight(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="planNotes" className="text-xs text-zinc-500">
                Plan notes
              </Label>
              <textarea
                id="planNotes"
                rows={3}
                placeholder="Intended cut style, angles, lap type…"
                value={planNotes}
                onChange={(e) => setPlanNotes(e.target.value)}
                maxLength={2000}
                className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 resize-none"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="violet"
                className="h-7 px-3 text-xs"
                onClick={handleSave}
                disabled={isPending}
              >
                <Check size={12} className="mr-1" />
                {isPending ? "Saving…" : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-xs"
                onClick={handleCancel}
                disabled={isPending}
              >
                <X size={12} className="mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Rough</dt>
            <dd className="font-medium text-zinc-800">
              {gem.roughWeightCarats ? `${gem.roughWeightCarats} ct` : "—"}
            </dd>
            <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Finished</dt>
            <dd className="font-medium text-zinc-800">
              {gem.weightCarats ? `${gem.weightCarats} ct` : "—"}
            </dd>
            <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Yield</dt>
            <dd className="font-medium text-zinc-800">
              {yieldPct !== null ? (
                <span className={yieldPct >= 50 ? "text-green-700" : "text-amber-700"}>
                  {yieldPct}%
                </span>
              ) : "—"}
            </dd>
            {gem.cutPlanNotes && (
              <>
                <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide col-span-2 mt-1">Notes</dt>
                <dd className="text-zinc-600 leading-relaxed col-span-2">{gem.cutPlanNotes}</dd>
              </>
            )}
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
