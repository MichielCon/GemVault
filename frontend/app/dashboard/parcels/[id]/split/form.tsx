"use client";

import { useState } from "react";
import Link from "next/link";
import { createGemDirect } from "@/lib/gem-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Scissors, Gem, Package, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { GemParcelDto } from "@/lib/types";

interface Props {
  parcel: GemParcelDto;
}

interface CreatedGem {
  id: string;
  name: string;
}

export function SplitParcelForm({ parcel }: Props) {
  const [count, setCount] = useState(1);
  const [weightPerGem, setWeightPerGem] = useState<string>(
    parcel.totalWeightCarats ? (parcel.totalWeightCarats / 1).toFixed(2) : ""
  );
  const [loading, setLoading] = useState(false);
  const [createdGems, setCreatedGems] = useState<CreatedGem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCountChange(val: number) {
    const clamped = Math.max(1, Math.min(20, val || 1));
    setCount(clamped);
    if (parcel.totalWeightCarats) {
      setWeightPerGem((parcel.totalWeightCarats / clamped).toFixed(2));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCreatedGems(null);

    const weight = weightPerGem ? parseFloat(weightPerGem) : null;
    const pricePerGem =
      parcel.purchasePrice != null ? parcel.purchasePrice / count : null;

    const acquiredAt = parcel.acquiredAt
      ? parcel.acquiredAt.substring(0, 10)
      : undefined;

    const results: CreatedGem[] = [];
    const errors: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = `${parcel.name} #${i + 1}`;
      const result = await createGemDirect({
        name,
        species: parcel.species ?? null,
        variety: parcel.variety ?? null,
        weightCarats: weight && weight > 0 ? weight : null,
        color: parcel.color ?? null,
        treatment: parcel.treatment ?? null,
        purchasePrice: pricePerGem,
        acquiredAt: acquiredAt ?? null,
        originId: parcel.originId ?? null,
        sourceParcelId: parcel.id,
        isPublic: false,
      });

      if (result.error || !result.id) {
        errors.push(`${name}: ${result.error ?? "Unknown error"}`);
      } else {
        results.push({ id: result.id, name });
      }
    }

    setLoading(false);

    if (results.length > 0) {
      setCreatedGems(results);
    }
    if (errors.length > 0) {
      setError(
        errors.length === count
          ? errors[0]
          : `${results.length} of ${count} gems created. Errors: ${errors.join("; ")}`
      );
    }
  }

  // Success state
  if (createdGems && createdGems.length > 0 && !error) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit text-zinc-500 hover:text-zinc-900"
        >
          <Link href={`/dashboard/parcels/${parcel.id}`}>
            <ArrowLeft size={15} />
            Back to parcel
          </Link>
        </Button>

        <Card className="border-green-200/80 bg-green-50/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-green-700 uppercase tracking-wide">
              <CheckCircle2 size={14} />
              {createdGems.length} gem{createdGems.length !== 1 ? "s" : ""} created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 mb-4">
              The following gems have been added to your inventory from{" "}
              <span className="font-medium text-zinc-800">{parcel.name}</span>:
            </p>
            <ul className="flex flex-col gap-1.5">
              {createdGems.map((gem) => (
                <li key={gem.id}>
                  <Link
                    href={`/dashboard/gems/${gem.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline underline-offset-2 transition-colors"
                  >
                    <Gem size={13} />
                    {gem.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <Button asChild variant="violet" size="sm">
                <Link href="/dashboard/gems">View gem inventory</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/parcels/${parcel.id}`}>
                  Back to parcel
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">
      {/* Back */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit text-zinc-500 hover:text-zinc-900"
      >
        <Link href={`/dashboard/parcels/${parcel.id}`}>
          <ArrowLeft size={15} />
          Back to parcel
        </Link>
      </Button>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <Scissors size={20} className="text-zinc-400" />
          Split into Gems
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create individual gem records from this parcel. Each gem will inherit the
          parcel&apos;s properties.
        </p>
      </div>

      {/* Parcel context */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
            <Package size={13} />
            Source Parcel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Name</dt>
            <dd className="font-medium text-zinc-800">{parcel.name}</dd>
            {parcel.species && (
              <>
                <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Species</dt>
                <dd className="font-medium text-zinc-800">
                  {[parcel.species, parcel.variety].filter(Boolean).join(" — ")}
                </dd>
              </>
            )}
            {parcel.totalWeightCarats != null && (
              <>
                <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Total weight</dt>
                <dd className="font-medium text-zinc-800">{parcel.totalWeightCarats} ct</dd>
              </>
            )}
            {parcel.color && (
              <>
                <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Color</dt>
                <dd className="font-medium text-zinc-800">{parcel.color}</dd>
              </>
            )}
            {parcel.purchasePrice != null && (
              <>
                <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Purchase price</dt>
                <dd className="font-medium text-zinc-800">
                  ${parcel.purchasePrice.toFixed(2)}
                </dd>
              </>
            )}
          </dl>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
              <Scissors size={13} />
              Split Options
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="count">
                How many gems to create?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) => handleCountChange(parseInt(e.target.value) || 1)}
                className="w-32"
              />
              <p className="text-[11px] text-zinc-400">
                Maximum 20 gems per split. Gems will be named{" "}
                <span className="font-medium text-zinc-600">
                  {parcel.name} #1
                </span>
                ,{" "}
                <span className="font-medium text-zinc-600">
                  {parcel.name} #2
                </span>
                {count > 2 && (
                  <>
                    , …{" "}
                    <span className="font-medium text-zinc-600">
                      {parcel.name} #{count}
                    </span>
                  </>
                )}
                .
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="weightPerGem">Weight per gem (ct)</Label>
              <Input
                id="weightPerGem"
                type="number"
                min={0}
                step={0.001}
                placeholder="e.g. 1.25"
                value={weightPerGem}
                onChange={(e) => setWeightPerGem(e.target.value)}
                className="w-40"
              />
              {parcel.totalWeightCarats != null && (
                <p className="text-[11px] text-zinc-400">
                  Auto-calculated from total parcel weight ÷ gem count.
                </p>
              )}
            </div>

            {parcel.purchasePrice != null && count > 0 && (
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2.5 text-sm">
                <p className="text-zinc-500 text-xs uppercase tracking-wide font-semibold mb-0.5">
                  Price per gem
                </p>
                <p className="font-medium text-zinc-800">
                  ${(parcel.purchasePrice / count).toFixed(2)}
                  <span className="text-xs font-normal text-zinc-400 ml-1.5">
                    (${parcel.purchasePrice.toFixed(2)} ÷ {count})
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 pt-1">
          <Button
            type="submit"
            variant="violet"
            disabled={loading || count < 1}
            className="min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating {count} gem{count !== 1 ? "s" : ""}…
              </>
            ) : (
              <>
                <Scissors size={14} />
                Create {count} gem{count !== 1 ? "s" : ""}
              </>
            )}
          </Button>
          <Button asChild variant="outline" disabled={loading}>
            <Link href={`/dashboard/parcels/${parcel.id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
