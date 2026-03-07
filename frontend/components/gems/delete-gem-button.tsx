"use client";

import { useActionState } from "react";
import { deleteGem } from "@/lib/gem-actions";
import { Button } from "@/components/ui/button";

const initialState = { error: null as string | null };

export function DeleteGemButton({ id }: { id: string }) {
  const [, formAction, pending] = useActionState(deleteGem, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Delete this gem? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting…" : "Delete gem"}
      </Button>
    </form>
  );
}
