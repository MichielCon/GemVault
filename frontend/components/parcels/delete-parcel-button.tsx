"use client";

import { useActionState, useState } from "react";
import { deleteParcel } from "@/lib/parcel-actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const initialState = { error: null as string | null };

export function DeleteParcelButton({ id }: { id: string }) {
  const [, formAction, pending] = useActionState(deleteParcel, initialState);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleConfirm() {
    setConfirmOpen(false);
    const fd = new FormData();
    fd.append("id", id);
    formAction(fd);
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => setConfirmOpen(true)}
      >
        {pending ? "Deleting…" : "Delete parcel"}
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete parcel"
        description="This will permanently delete the parcel and all its photos. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
