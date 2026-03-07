"use client";

import { useActionState } from "react";
import { deleteParcel } from "@/lib/parcel-actions";
import { Button } from "@/components/ui/button";

const initialState = { error: null as string | null };

export function DeleteParcelButton({ id }: { id: string }) {
  const [, formAction, pending] = useActionState(deleteParcel, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Delete this parcel? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting…" : "Delete parcel"}
      </Button>
    </form>
  );
}
