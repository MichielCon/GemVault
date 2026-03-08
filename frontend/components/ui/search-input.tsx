"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface Props {
  basePath: string;
  placeholder?: string;
  defaultValue?: string;
  extraParams?: Record<string, string>;
}

export function SearchInput({ basePath, placeholder = "Search…", defaultValue, extraParams }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function navigate(value: string) {
    const q = new URLSearchParams({ page: "1", ...extraParams });
    if (value) q.set("search", value);
    router.push(`${basePath}?${q}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(inputRef.current?.value.trim() ?? "");
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-md border bg-card pl-8 pr-8 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      />
      {defaultValue && (
        <button
          type="button"
          onClick={() => navigate("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X size={13} />
        </button>
      )}
    </form>
  );
}
