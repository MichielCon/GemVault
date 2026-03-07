"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createGem } from "@/lib/gem-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const initialState = { error: null as string | null };

export default function NewGemPage() {
  const [state, formAction, pending] = useActionState(createGem, initialState);

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
              <Input id="name" name="name" placeholder="e.g. Blue Sapphire #1" required />
            </div>

            {/* Species / Variety */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="species">Species</Label>
                <Input id="species" name="species" placeholder="e.g. Corundum" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="variety">Variety</Label>
                <Input id="variety" name="variety" placeholder="e.g. Sapphire" />
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
                <Input id="color" name="color" placeholder="e.g. Vivid blue" />
              </div>
            </div>

            {/* Clarity / Cut */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="clarity">Clarity</Label>
                <Input id="clarity" name="clarity" placeholder="e.g. Eye-clean" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cut">Cut</Label>
                <Input id="cut" name="cut" placeholder="e.g. Excellent" />
              </div>
            </div>

            {/* Treatment / Shape */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="treatment">Treatment</Label>
                <Input id="treatment" name="treatment" placeholder="e.g. Heat treated" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shape">Shape</Label>
                <Input id="shape" name="shape" placeholder="e.g. Oval" />
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
                placeholder="Any additional notes…"
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
