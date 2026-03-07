"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createGem } from "@/lib/gem-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuggestInput } from "@/components/ui/suggest-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  GEM_SPECIES,
  GEM_VARIETIES,
  ALL_VARIETIES,
  GEM_COLORS,
  GEM_CLARITIES,
  GEM_CUTS,
  GEM_SHAPES,
  GEM_TREATMENTS,
} from "@/lib/gem-options";

const initialState = { error: null as string | null };

export default function NewGemPage() {
  const [state, formAction, pending] = useActionState(createGem, initialState);
  const [species, setSpecies] = useState("");

  // Show species-specific varieties when the entered species matches a known one,
  // otherwise show the full list.
  const varietyOptions =
    GEM_VARIETIES[species as keyof typeof GEM_VARIETIES] ?? ALL_VARIETIES;

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

            {/* Species / Variety — variety list filters based on species */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="species">Species</Label>
                <SuggestInput
                  id="species"
                  name="species"
                  listId="species-list"
                  options={GEM_SPECIES}
                  placeholder="e.g. Corundum"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="variety">Variety</Label>
                <SuggestInput
                  id="variety"
                  name="variety"
                  listId="variety-list"
                  options={varietyOptions}
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
                <Label htmlFor="color">Color</Label>
                <SuggestInput
                  id="color"
                  name="color"
                  listId="color-list"
                  options={GEM_COLORS}
                  placeholder="e.g. Vivid Blue"
                />
              </div>
            </div>

            {/* Clarity / Cut */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="clarity">Clarity</Label>
                <SuggestInput
                  id="clarity"
                  name="clarity"
                  listId="clarity-list"
                  options={GEM_CLARITIES}
                  placeholder="e.g. Eye Clean"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cut">Cut</Label>
                <SuggestInput
                  id="cut"
                  name="cut"
                  listId="cut-list"
                  options={GEM_CUTS}
                  placeholder="e.g. Oval Brilliant"
                />
              </div>
            </div>

            {/* Treatment / Shape */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="treatment">Treatment</Label>
                <SuggestInput
                  id="treatment"
                  name="treatment"
                  listId="treatment-list"
                  options={GEM_TREATMENTS}
                  placeholder="e.g. None"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shape">Shape</Label>
                <SuggestInput
                  id="shape"
                  name="shape"
                  listId="shape-list"
                  options={GEM_SHAPES}
                  placeholder="e.g. Oval"
                />
              </div>
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
