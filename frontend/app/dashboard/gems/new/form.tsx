"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createGem } from "@/lib/gem-actions";
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
import { ArrowLeft } from "lucide-react";
import type { VocabularyItemDto, OriginDto } from "@/lib/types";

interface Props {
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

const initialState = { error: null as string | null };

export function GemCreateForm({ vocabulary, origins }: Props) {
  const [state, formAction, pending] = useActionState(createGem, initialState);
  const [species, setSpecies] = useState<string | null>(null);
  const [variety, setVariety] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [clarity, setClarity] = useState<string | null>(null);
  const [cut, setCut] = useState<string | null>(null);
  const [shape, setShape] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<string | null>(null);
  const [originId, setOriginId] = useState<string | null>(null);

  const speciesOptions = vocabulary.species.map((v) => ({ value: v.value, label: v.value }));

  const varietyOptions = species
    ? vocabulary.variety
        .filter((v) => v.parentValue === species)
        .map((v) => ({ value: v.value, label: v.value }))
    : vocabulary.variety.map((v) => ({ value: v.value, label: v.value }));

  const colorOptions = vocabulary.color.map((v) => ({ value: v.value, label: v.value }));
  const clarityOptions = vocabulary.clarity.map((v) => ({ value: v.value, label: v.value }));
  const cutOptions = vocabulary.cut.map((v) => ({ value: v.value, label: v.value }));
  const shapeOptions = vocabulary.shape.map((v) => ({ value: v.value, label: v.value }));
  const treatmentOptions = vocabulary.treatment.map((v) => ({ value: v.value, label: v.value }));

  const originOptions = origins.map((o) => ({
    value: o.id,
    label: [o.country, o.mine, o.region].filter(Boolean).join(" — "),
  }));

  function handleSpeciesChange(val: string | null) {
    setSpecies(val);
    setVariety(null);
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard/gems">
            <ArrowLeft size={16} />
            Back to gems
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add gem</CardTitle>
          <CardDescription>Record a new gemstone in your inventory.</CardDescription>
        </CardHeader>

        <form action={formAction}>
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
                placeholder="e.g. Ceylon Sapphire #1"
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
                  placeholder="e.g. 2.35"
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
            <div className="flex flex-col gap-1.5">
              <Label>Origin</Label>
              <Combobox
                name="originId"
                options={originOptions}
                value={originId}
                onChange={setOriginId}
                placeholder="Select origin..."
              />
            </div>

            {/* Purchase price */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="purchasePrice">Purchase price</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1500.00"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Provenance, certificate numbers, observations…"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Is Public */}
            <div className="flex items-center gap-2">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <Label htmlFor="isPublic" className="cursor-pointer font-normal">
                Make this gem publicly viewable via a scan link
              </Label>
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save gem"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href="/dashboard/gems">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
