"use client";

import { useActionState, useState } from "react";
import { deleteGem } from "@/lib/gem-actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const initialState = { error: null as string | null };

export function DeleteGemButton({ id }: { id: string }) {
  const [, formAction, pending] = useActionState(deleteGem, initialState);
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
        {pending ? "Deleting…" : "Delete gem"}
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete gem"
        description="This will permanently delete the gem and all its photos. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
