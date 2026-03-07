"use client";

import { useActionState, useRef } from "react";
import { uploadGemPhoto } from "@/lib/gem-actions";
import { uploadParcelPhoto } from "@/lib/parcel-actions";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  type: "gem" | "parcel";
}

export function PhotoUploader({ id, type }: Props) {
  const action =
    type === "gem"
      ? uploadGemPhoto.bind(null, id)
      : uploadParcelPhoto.bind(null, id);

  const [state, formAction, isPending] = useActionState(action, { error: null });
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/*"
          className="flex-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-secondary-foreground file:cursor-pointer cursor-pointer"
          disabled={isPending}
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Uploading…" : "Upload photo"}
        </Button>
      </div>
      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </form>
  );
}
