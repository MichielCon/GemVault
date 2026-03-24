"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createGem } from "@/lib/gem-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Gem, Globe, MapPin, DollarSign, StickyNote, Hexagon } from "lucide-react";
import { OriginPicker } from "@/components/origins/origin-picker";
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
  const speciesOptions = vocabulary.species.map((v) => ({ value: v.value, label: v.value }));
  const varietyOptions = species
    ? vocabulary.variety.filter((v) => v.parentValue === species).map((v) => ({ value: v.value, label: v.value }))
    : vocabulary.variety.map((v) => ({ value: v.value, label: v.value }));
  const colorOptions = vocabulary.color.map((v) => ({ value: v.value, label: v.value }));
  const clarityOptions = vocabulary.clarity.map((v) => ({ value: v.value, label: v.value }));
  const cutOptions = vocabulary.cut.map((v) => ({ value: v.value, label: v.value }));
  const shapeOptions = vocabulary.shape.map((v) => ({ value: v.value, label: v.value }));
  const treatmentOptions = vocabulary.treatment.map((v) => ({ value: v.value, label: v.value }));

  function handleSpeciesChange(val: string | null) {
    setSpecies(val);
    setVariety(null);
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">
        {/* Back */}
        <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-zinc-500 hover:text-zinc-900">
          <Link href="/dashboard/gems">
            <ArrowLeft size={15} />
            All gems
          </Link>
        </Button>

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Gem</h1>
          <p className="mt-1 text-sm text-zinc-500">Record a new gemstone in your inventory.</p>
        </div>

        {state.error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          {/* Identity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
                <Gem size={13} />
                Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input id="name" name="name" placeholder="e.g. Ceylon Sapphire #1" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Species</Label>
                  <Combobox name="species" options={speciesOptions} value={species} onChange={handleSpeciesChange} placeholder="e.g. Corundum" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Variety</Label>
                  <Combobox name="variety" options={varietyOptions} value={variety} onChange={setVariety} placeholder="e.g. Sapphire" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical properties */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
                <Hexagon size={14} className="text-zinc-400" />
                Physical Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="weightCarats">Weight (carats)</Label>
                  <Input id="weightCarats" name="weightCarats" type="number" min="0" step="0.01" placeholder="e.g. 2.35" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Color</Label>
                  <Combobox name="color" options={colorOptions} value={color} onChange={setColor} placeholder="e.g. Vivid Blue" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Clarity</Label>
                  <Combobox name="clarity" options={clarityOptions} value={clarity} onChange={setClarity} placeholder="e.g. Eye Clean" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Cut</Label>
                  <Combobox name="cut" options={cutOptions} value={cut} onChange={setCut} placeholder="e.g. Oval Brilliant" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Shape</Label>
                  <Combobox name="shape" options={shapeOptions} value={shape} onChange={setShape} placeholder="e.g. Oval" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Treatment</Label>
                  <Combobox name="treatment" options={treatmentOptions} value={treatment} onChange={setTreatment} placeholder="e.g. None" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lengthMm">Length (mm)</Label>
                  <Input id="lengthMm" name="lengthMm" type="number" min="0" step="0.1" placeholder="L" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="widthMm">Width (mm)</Label>
                  <Input id="widthMm" name="widthMm" type="number" min="0" step="0.1" placeholder="W" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="heightMm">Height (mm)</Label>
                  <Input id="heightMm" name="heightMm" type="number" min="0" step="0.1" placeholder="H" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provenance & acquisition */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
                <MapPin size={13} />
                Provenance &amp; Acquisition
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <OriginPicker allOrigins={origins} />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="purchasePrice">
                    <DollarSign size={12} className="inline mr-0.5" />
                    Purchase price
                  </Label>
                  <Input id="purchasePrice" name="purchasePrice" type="number" min="0" step="0.01" placeholder="e.g. 1500.00" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="acquiredAt">Acquired on</Label>
                  <Input id="acquiredAt" name="acquiredAt" type="date" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">
                  <StickyNote size={12} className="inline mr-0.5" />
                  Notes
                </Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Provenance, certificate numbers, observations…"
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-zinc-300 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
                <Globe size={13} />
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  id="isPublic"
                  name="isPublic"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-violet-600"
                />
                <div>
                  <p className="text-sm font-medium group-hover:text-zinc-700 transition-colors">Make publicly viewable</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Enables a public scan link and QR code for this gem.</p>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" variant="violet" disabled={pending} className="min-w-[100px]">
              {pending ? "Saving…" : "Save gem"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href="/dashboard/gems">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
