"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface Props {
  basePath: string;
  from?: string;
  to?: string;
  extraParams?: Record<string, string>;
}

export function DateRangeFilter({ basePath, from, to, extraParams }: Props) {
  const router = useRouter();

  function navigate(newFrom?: string, newTo?: string) {
    const q = new URLSearchParams({ page: "1", ...extraParams });
    if (newFrom) q.set("from", newFrom);
    if (newTo) q.set("to", newTo);
    router.push(`${basePath}?${q}`);
  }

  function clear() {
    const q = new URLSearchParams({ page: "1", ...extraParams });
    router.push(`${basePath}?${q}`);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        defaultValue={from ?? ""}
        onChange={(e) => navigate(e.target.value || undefined, to)}
        className="rounded-md border bg-card px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        aria-label="Filter from date"
        title="From date"
      />
      <span className="text-xs text-muted-foreground">to</span>
      <input
        type="date"
        defaultValue={to ?? ""}
        onChange={(e) => navigate(from, e.target.value || undefined)}
        className="rounded-md border bg-card px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        aria-label="Filter to date"
        title="To date"
      />
      {(from || to) && (
        <button
          type="button"
          onClick={clear}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Clear date filter"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
