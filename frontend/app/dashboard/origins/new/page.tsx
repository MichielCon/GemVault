"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createOrigin } from "@/lib/origin-actions";
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

export default function NewOriginPage() {
  const [state, formAction, pending] = useActionState(createOrigin, initialState);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard/origins">
            <ArrowLeft size={16} />
            Back to origins
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add origin</CardTitle>
          <CardDescription>Record a mine or locality to link gems to their source.</CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="flex flex-col gap-5">
            {state.error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                name="country"
                placeholder="e.g. Sri Lanka"
                required
              />
            </div>

            {/* Mine / Region */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mine">Mine</Label>
                <Input
                  id="mine"
                  name="mine"
                  placeholder="e.g. Ratnapura mine"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  name="region"
                  placeholder="e.g. Sabaragamuwa Province"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save origin"}
            </Button>
            <Button asChild variant="outline" disabled={pending}>
              <Link href="/dashboard/origins">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
