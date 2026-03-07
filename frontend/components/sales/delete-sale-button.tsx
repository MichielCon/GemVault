"use client";

import { useActionState } from "react";
import { deleteSale } from "@/lib/sale-actions";
import { Button } from "@/components/ui/button";

const initialState = { error: null as string | null };

export function DeleteSaleButton({ id }: { id: string }) {
  const [, formAction, pending] = useActionState(deleteSale, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Delete this sale? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting…" : "Delete sale"}
      </Button>
    </form>
  );
}
