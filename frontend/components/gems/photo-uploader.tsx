"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadGemPhoto } from "@/lib/gem-actions";
import { uploadParcelPhoto } from "@/lib/parcel-actions";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  type: "gem" | "parcel";
}

export function PhotoUploader({ id, type }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const files = inputRef.current?.files;
    if (!files || files.length === 0) {
      setError("Please select a file.");
      return;
    }

    setIsPending(true);
    setError(null);

    const action = type === "gem" ? uploadGemPhoto.bind(null, id) : uploadParcelPhoto.bind(null, id);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file, file.name);
      const result = await action({ error: null }, fd);
      if (result.error) {
        setError(result.error);
        setIsPending(false);
        return;
      }
    }

    if (inputRef.current) inputRef.current.value = "";
    setIsPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/*"
          multiple
          className="flex-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-secondary-foreground file:cursor-pointer cursor-pointer"
          disabled={isPending}
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
