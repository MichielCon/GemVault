"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Pencil, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateGemFacetingSpecs } from "@/lib/gem-actions";
import type { GemDto } from "@/lib/types";

interface Props {
  gem: GemDto;
}

export function FacetingSpecsCard({ gem }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [design, setDesign] = useState(gem.cuttingDesign ?? "");
  const [pavilion, setPavilion] = useState(gem.pavilionAngle?.toString() ?? "");
  const [crown, setCrown] = useState(gem.crownAngle?.toString() ?? "");
  const [table, setTable] = useState(gem.tablePct?.toString() ?? "");
  const [facets, setFacets] = useState(gem.plannedFacets?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  const hasAnySpec =
    gem.cuttingDesign || gem.pavilionAngle != null || gem.crownAngle != null ||
    gem.tablePct != null || gem.plannedFacets != null;

  function handleCancel() {
    setDesign(gem.cuttingDesign ?? "");
    setPavilion(gem.pavilionAngle?.toString() ?? "");
    setCrown(gem.crownAngle?.toString() ?? "");
    setTable(gem.tablePct?.toString() ?? "");
    setFacets(gem.plannedFacets?.toString() ?? "");
    setError(null);
    setEditing(false);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateGemFacetingSpecs(gem.id, {
        cuttingDesign: design || null,
        pavilionAngle: pavilion ? Number(pavilion) : null,
        crownAngle: crown ? Number(crown) : null,
        tablePct: table ? Number(table) : null,
        plannedFacets: facets ? Number(facets) : null,
      });
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
            <FlaskConical size={13} />
            Faceting Specs
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
              <Label htmlFor="fDesign" className="text-xs text-zinc-500">Design name</Label>
              <Input
                id="fDesign"
                placeholder="e.g. Portuguese 64, Custom Oval Barion"
                value={design}
                onChange={(e) => setDesign(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fPavilion" className="text-xs text-zinc-500">Pavilion angle (°)</Label>
                <Input
                  id="fPavilion"
                  type="number"
                  min="0"
                  max="90"
                  step="0.1"
                  placeholder="e.g. 43.5"
                  value={pavilion}
                  onChange={(e) => setPavilion(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fCrown" className="text-xs text-zinc-500">Crown angle (°)</Label>
                <Input
                  id="fCrown"
                  type="number"
                  min="0"
                  max="90"
                  step="0.1"
                  placeholder="e.g. 35.0"
                  value={crown}
                  onChange={(e) => setCrown(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fTable" className="text-xs text-zinc-500">Table (%)</Label>
                <Input
                  id="fTable"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="e.g. 55"
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fFacets" className="text-xs text-zinc-500">Planned facets</Label>
                <Input
                  id="fFacets"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 64"
                  value={facets}
                  onChange={(e) => setFacets(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
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
        ) : hasAnySpec ? (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {gem.cuttingDesign && (
              <>
                <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide col-span-2">Design</dt>
                <dd className="font-medium text-zinc-800 col-span-2">{gem.cuttingDesign}</dd>
              </>
            )}
            <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Pavilion</dt>
            <dd className="font-medium text-zinc-800">{gem.pavilionAngle != null ? `${gem.pavilionAngle}°` : "—"}</dd>
            <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Crown</dt>
            <dd className="font-medium text-zinc-800">{gem.crownAngle != null ? `${gem.crownAngle}°` : "—"}</dd>
            <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Table</dt>
            <dd className="font-medium text-zinc-800">{gem.tablePct != null ? `${gem.tablePct}%` : "—"}</dd>
            <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Facets</dt>
            <dd className="font-medium text-zinc-800">{gem.plannedFacets ?? "—"}</dd>
          </dl>
        ) : (
          <p className="text-sm text-zinc-400">No faceting specs recorded yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
