"use client";

import { useActionState } from "react";
import { deletePurchaseOrder } from "@/lib/order-actions";
import { Button } from "@/components/ui/button";

const initialState = { error: null as string | null };

export function DeleteOrderButton({ id }: { id: string }) {
  const [, formAction, pending] = useActionState(deletePurchaseOrder, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Delete this order? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting…" : "Delete order"}
      </Button>
    </form>
  );
}
