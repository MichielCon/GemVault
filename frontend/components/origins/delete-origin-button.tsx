"use client";

import { useActionState } from "react";
import { deleteOrigin } from "@/lib/origin-actions";
import { Button } from "@/components/ui/button";

const initialState = { error: null as string | null };

export function DeleteOriginButton({ id }: { id: string }) {
  const [, formAction, pending] = useActionState(deleteOrigin, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Delete this origin? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting…" : "Delete"}
      </Button>
    </form>
  );
}
