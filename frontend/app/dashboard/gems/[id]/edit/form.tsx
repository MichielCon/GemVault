"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateGem } from "@/lib/gem-actions";
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
import { ArrowLeft, Scissors } from "lucide-react";
import { OriginPicker } from "@/components/origins/origin-picker";
import type { GemDto, VocabularyItemDto, OriginDto } from "@/lib/types";

interface Props {
  gem: GemDto;
  vocabulary: {
    species: VocabularyItemDto[];
    variety: VocabularyItemDto[];
    color: VocabularyItemDto[];
    clarity: VocabularyItemDto[];
    cut: VocabularyItemDto[];
    shape: VocabularyItemDto[];
    treatment: VocabularyItemDto[];
  };
  origins: OriginDto[];
}

const initialState = { error: null as string | null, id: null as string | null };

export function GemEditForm({ gem, vocabulary, origins }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateGem, initialState);

  useEffect(() => {
    if (state.id) router.push(`/dashboard/gems/${state.id}`);
  }, [state.id, router]);
  const [statusValue, setStatusValue] = useState(gem.status ?? "Available");
  const [species, setSpecies] = useState<string | null>(gem.species ?? null);
  const [variety, setVariety] = useState<string | null>(gem.variety ?? null);
  const [color, setColor] = useState<string | null>(gem.color ?? null);
  const [clarity, setClarity] = useState<string | null>(gem.clarity ?? null);
  const [cut, setCut] = useState<string | null>(gem.cut ?? null);
  const [shape, setShape] = useState<string | null>(gem.shape ?? null);
  const [treatment, setTreatment] = useState<string | null>(gem.treatment ?? null);
  const speciesOptions = useMemo(
    () => vocabulary.species.map((v) => ({ value: v.value, label: v.value })),
    [vocabulary.species]
  );
  const varietyOptions = useMemo(
    () => species
      ? vocabulary.variety.filter((v) => v.parentValue === species).map((v) => ({ value: v.value, label: v.value }))
      : vocabulary.variety.map((v) => ({ value: v.value, label: v.value })),
    [vocabulary.variety, species]
  );
  const colorOptions = useMemo(
    () => vocabulary.color.map((v) => ({ value: v.value, label: v.value })),
    [vocabulary.color]
  );
  const clarityOptions = useMemo(
    () => vocabulary.clarity.map((v) => ({ value: v.value, label: v.value })),
    [vocabulary.clarity]
  );
  const cutOptions = useMemo(
    () => vocabulary.cut.map((v) => ({ value: v.value, label: v.value })),
    [vocabulary.cut]
  );
  const shapeOptions = useMemo(
    () => vocabulary.shape.map((v) => ({ value: v.value, label: v.value })),
    [vocabulary.shape]
  );
  const treatmentOptions = useMemo(
    () => vocabulary.treatment.map((v) => ({ value: v.value, label: v.value })),
    [vocabulary.treatment]
  );

  function handleSpeciesChange(val: string | null) {
    setSpecies(val);
    setVariety(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={`/dashboard/gems/${gem.id}`}>
            <ArrowLeft size={16} />
            Back to gem
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit gem</CardTitle>
          <CardDescription>{gem.name}</CardDescription>
        </CardHeader>

        <form action={formAction}>
          <input type="hidden" name="id" value={gem.id} />

          <CardContent className="flex flex-col gap-5">
            {state.error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={gem.name}
                required
              />
            </div>

            {/* Species / Variety */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Species</Label>
                <Combobox
                  name="species"
                  options={speciesOptions}
                  value={species}
                  onChange={handleSpeciesChange}
                  placeholder="e.g. Corundum"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Variety</Label>
                <Combobox
                  name="variety"
                  options={varietyOptions}
                  value={variety}
                  onChange={setVariety}
                  placeholder="e.g. Sapphire"
                />
              </div>
            </div>

            {/* Weight / Color */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="weightCarats">Weight (carats)</Label>
                <Input
                  id="weightCarats"
                  name="weightCarats"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={gem.weightCarats ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Color</Label>
                <Combobox
                  name="color"
                  options={colorOptions}
                  value={color}
                  onChange={setColor}
                  placeholder="e.g. Vivid Blue"
                />
              </div>
            </div>

            {/* Clarity / Cut */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Clarity</Label>
                <Combobox
                  name="clarity"
                  options={clarityOptions}
                  value={clarity}
                  onChange={setClarity}
                  placeholder="e.g. Eye Clean"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Cut</Label>
                <Combobox
                  name="cut"
                  options={cutOptions}
                  value={cut}
                  onChange={setCut}
                  placeholder="e.g. Oval Brilliant"
                />
              </div>
            </div>

            {/* Treatment / Shape */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Treatment</Label>
                <Combobox
                  name="treatment"
                  options={treatmentOptions}
                  value={treatment}
                  onChange={setTreatment}
                  placeholder="e.g. None"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Shape</Label>
                <Combobox
                  name="shape"
                  options={shapeOptions}
                  value={shape}
                  onChange={setShape}
                  placeholder="e.g. Oval"
                />
              </div>
            </div>

            {/* Origin */}
            <OriginPicker allOrigins={origins} initialOriginId={gem.originId} />

            {/* Purchase price / Acquired on */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="purchasePrice">Purchase price</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={gem.purchasePrice ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="acquiredAt">Acquired on</Label>
                <Input
                  id="acquiredAt"
                  name="acquiredAt"
                  type="date"
                  defaultValue={gem.acquiredAt ? gem.acquiredAt.split("T")[0] : ""}
                />
              </div>
            </div>

            {/* Cut Plan */}
            <div className="flex flex-col gap-4 pt-2 border-t border-zinc-100">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                <Scissors size={11} />
                Cut Plan
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="roughWeightCarats">Rough weight (ct)</Label>
                  <Input
                    id="roughWeightCarats"
                    name="roughWeightCarats"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={gem.roughWeightCarats ?? ""}
                    placeholder="Weight before cutting"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cutPlanNotes">Plan notes</Label>
                <textarea
                  id="cutPlanNotes"
                  name="cutPlanNotes"
                  rows={2}
                  maxLength={2000}
                  defaultValue={gem.cutPlanNotes ?? ""}
                  placeholder="Intended cut style, angles, lap type…"
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              {/* Cutting design reference */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cuttingDesign">Design name</Label>
                <Input
                  id="cuttingDesign"
                  name="cuttingDesign"
                  defaultValue={gem.cuttingDesign ?? ""}
                  placeholder="e.g. Portuguese 64"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={gem.notes ?? ""}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-zinc-300"
              >
                <option value="Rough">Rough (uncut)</option>
                <option value="Cutting">Cutting (in progress)</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="OnConsignment">On Consignment</option>
                <option value="InRepair">In Repair</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Consignment details — shown only when status = OnConsignment */}
            {statusValue === "OnConsignment" && (
              <div className="rounded-lg border border-orange-200 bg-orange-50/60 p-4 flex flex-col gap-3">
                <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Consignment details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="consigneeName" className="text-xs text-orange-700/80">With (name)</Label>
                    <Input
                      id="consigneeName"
                      name="consigneeName"
                      placeholder="Shop or person"
                      defaultValue={gem.consigneeName ?? ""}
                      className="h-8 text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="consigneeContact" className="text-xs text-orange-700/80">Contact</Label>
                    <Input
                      id="consigneeContact"
                      name="consigneeContact"
                      placeholder="Phone or email"
                      defaultValue={gem.consigneeContact ?? ""}
                      className="h-8 text-sm bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="consignmentTargetPrice" className="text-xs text-orange-700/80">Target price (USD)</Label>
                    <Input
                      id="consignmentTargetPrice"
                      name="consignmentTargetPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 250.00"
                      defaultValue={gem.consignmentTargetPrice ?? ""}
                      className="h-8 text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="consignmentDate" className="text-xs text-orange-700/80">Date sent</Label>
                    <Input
                      id="consignmentDate"
                      name="consignmentDate"
                      type="date"
                      defaultValue={gem.consignmentDate ?? ""}
                      className="h-8 text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="consignmentReturnDate" className="text-xs text-orange-700/80">Due back</Label>
                    <Input
                      id="consignmentReturnDate"
                      name="consignmentReturnDate"
                      type="date"
                      defaultValue={gem.consignmentReturnDate ?? ""}
                      className="h-8 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Is Public */}
            <div className="flex items-center gap-2">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                defaultChecked={gem.isPublic}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <Label htmlFor="isPublic" className="cursor-pointer font-normal">
                Make this gem publicly viewable via a scan link
              </Label>
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" disabled={pending || !!state.id}>
              {pending || state.id ? "Saving…" : "Save changes"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href={`/dashboard/gems/${gem.id}`}>Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
