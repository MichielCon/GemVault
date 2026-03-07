"use client";

import { useActionState } from "react";
import { deleteSupplier } from "@/lib/supplier-actions";
import { Button } from "@/components/ui/button";

const initialState = { error: null as string | null };

export function DeleteSupplierButton({ id }: { id: string }) {
  const [, formAction, pending] = useActionState(deleteSupplier, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Delete this supplier? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting…" : "Delete supplier"}
      </Button>
    </form>
  );
}
