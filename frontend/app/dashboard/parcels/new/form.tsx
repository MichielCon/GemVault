"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createParcel } from "@/lib/parcel-actions";
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
import { OriginPicker } from "@/components/origins/origin-picker";
import type { VocabularyItemDto, OriginDto } from "@/lib/types";

interface Props {
  vocabulary: {
    species: VocabularyItemDto[];
    variety: VocabularyItemDto[];
    color: VocabularyItemDto[];
    treatment: VocabularyItemDto[];
  };
  origins: OriginDto[];
}

const initialState = { error: null as string | null, id: null as string | null };

export function ParcelCreateForm({ vocabulary, origins }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createParcel, initialState);
  const [species, setSpecies] = useState<string | null>(null);
  const [variety, setVariety] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<string | null>(null);

  // Navigate to the new parcel on success
  useEffect(() => {
    if (state.id) {
      router.push(`/dashboard/parcels/${state.id}`);
    }
  }, [state.id, router]);

  const speciesOptions = vocabulary.species.map((v) => ({ value: v.value, label: v.value }));

  const varietyOptions = species
    ? vocabulary.variety
        .filter((v) => v.parentValue === species)
        .map((v) => ({ value: v.value, label: v.value }))
    : vocabulary.variety.map((v) => ({ value: v.value, label: v.value }));

  const colorOptions = vocabulary.color.map((v) => ({ value: v.value, label: v.value }));
  const treatmentOptions = vocabulary.treatment.map((v) => ({ value: v.value, label: v.value }));

  function handleSpeciesChange(val: string | null) {
    setSpecies(val);
    setVariety(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard/parcels">
            <ArrowLeft size={16} />
            Back to parcels
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add parcel</CardTitle>
          <CardDescription>Record a new gem parcel (bulk lot) in your inventory.</CardDescription>
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
                placeholder="e.g. Burma Ruby Lot #3"
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
                  placeholder="e.g. Ruby"
                />
              </div>
            </div>

            {/* Quantity / Total weight */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="quantity">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue="1"
                  required
                  placeholder="e.g. 50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="totalWeightCarats">Total weight (carats)</Label>
                <Input
                  id="totalWeightCarats"
                  name="totalWeightCarats"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 12.50"
                />
              </div>
            </div>

            {/* Color / Treatment */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Color</Label>
                <Combobox
                  name="color"
                  options={colorOptions}
                  value={color}
                  onChange={setColor}
                  placeholder="e.g. Vivid Red"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Treatment</Label>
                <Combobox
                  name="treatment"
                  options={treatmentOptions}
                  value={treatment}
                  onChange={setTreatment}
                  placeholder="e.g. Heat Treatment"
                />
              </div>
            </div>

            {/* Origin */}
            <OriginPicker allOrigins={origins} />

            {/* Purchase price */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="purchasePrice">Purchase price</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 3500.00"
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
                Make this parcel publicly viewable via a scan link
              </Label>
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save parcel"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href="/dashboard/parcels">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
