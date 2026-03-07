"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { updateGem } from "@/lib/gem-actions";
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
import type { GemDto } from "@/lib/types";

const initialState = { error: null as string | null };

export function GemEditForm({ gem }: { gem: GemDto }) {
  const [state, formAction, pending] = useActionState(updateGem, initialState);
  const [species, setSpecies] = useState(gem.species ?? "");

  const varietyOptions =
    GEM_VARIETIES[species as keyof typeof GEM_VARIETIES] ?? ALL_VARIETIES;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
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
                  defaultValue={gem.variety ?? ""}
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
                <Label htmlFor="color">Color</Label>
                <SuggestInput
                  id="color"
                  name="color"
                  listId="color-list"
                  options={GEM_COLORS}
                  placeholder="e.g. Vivid Blue"
                  defaultValue={gem.color ?? ""}
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
                  defaultValue={gem.clarity ?? ""}
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
                  defaultValue={gem.cut ?? ""}
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
                  defaultValue={gem.treatment ?? ""}
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
                  defaultValue={gem.shape ?? ""}
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
                defaultValue={gem.purchasePrice ?? ""}
              />
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
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
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
