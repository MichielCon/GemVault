"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { updateParcel } from "@/lib/parcel-actions";
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
import type { GemParcelDto, VocabularyItemDto, OriginDto } from "@/lib/types";

interface Props {
  parcel: GemParcelDto;
  vocabulary: {
    species: VocabularyItemDto[];
    variety: VocabularyItemDto[];
    color: VocabularyItemDto[];
    treatment: VocabularyItemDto[];
  };
  origins: OriginDto[];
}

const initialState = { error: null as string | null };

export function ParcelEditForm({ parcel, vocabulary, origins }: Props) {
  const [state, formAction, pending] = useActionState(updateParcel, initialState);
  const [species, setSpecies] = useState<string | null>(parcel.species ?? null);
  const [variety, setVariety] = useState<string | null>(parcel.variety ?? null);
  const [color, setColor] = useState<string | null>(parcel.color ?? null);
  const [treatment, setTreatment] = useState<string | null>(parcel.treatment ?? null);
  const [originId, setOriginId] = useState<string | null>(parcel.originId ?? null);

  const speciesOptions = vocabulary.species.map((v) => ({ value: v.value, label: v.value }));

  const varietyOptions = species
    ? vocabulary.variety
        .filter((v) => v.parentValue === species)
        .map((v) => ({ value: v.value, label: v.value }))
    : vocabulary.variety.map((v) => ({ value: v.value, label: v.value }));

  const colorOptions = vocabulary.color.map((v) => ({ value: v.value, label: v.value }));
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
          <Link href={`/dashboard/parcels/${parcel.id}`}>
            <ArrowLeft size={16} />
            Back to parcel
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit parcel</CardTitle>
          <CardDescription>{parcel.name}</CardDescription>
        </CardHeader>

        <form action={formAction}>
          <input type="hidden" name="id" value={parcel.id} />

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
                defaultValue={parcel.name}
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
                  defaultValue={parcel.quantity}
                  required
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
                  defaultValue={parcel.totalWeightCarats ?? ""}
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
                defaultValue={parcel.purchasePrice ?? ""}
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={parcel.notes ?? ""}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Is Public */}
            <div className="flex items-center gap-2">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                defaultChecked={parcel.isPublic}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <Label htmlFor="isPublic" className="cursor-pointer font-normal">
                Make this parcel publicly viewable via a scan link
              </Label>
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href={`/dashboard/parcels/${parcel.id}`}>Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
