"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateOrigin } from "@/lib/origin-actions";
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
import type { OriginDto } from "@/lib/types";

interface Props {
  origin: OriginDto;
}

const initialState = { error: null as string | null, id: null as string | null };

export function OriginEditForm({ origin }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateOrigin, initialState);

  useEffect(() => {
    if (state.id) router.push(`/dashboard/origins/${origin.id}`);
  }, [state.id, router, origin.id]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={`/dashboard/origins/${origin.id}`}>
            <ArrowLeft size={16} />
            Back to origin
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit origin</CardTitle>
          <CardDescription>Update the locality details.</CardDescription>
        </CardHeader>

        <form action={formAction}>
          <input type="hidden" name="id" value={origin.id} />

          <CardContent className="flex flex-col gap-5">
            {state.error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                name="country"
                placeholder="e.g. Sri Lanka"
                defaultValue={origin.country}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="locality">Locality</Label>
              <Input
                id="locality"
                name="locality"
                placeholder="e.g. Ratnapura mine"
                defaultValue={origin.locality ?? ""}
              />
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" variant="violet" disabled={pending || !!state.id}>
              {pending || state.id ? "Saving…" : "Save changes"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href={`/dashboard/origins/${origin.id}`}>Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
