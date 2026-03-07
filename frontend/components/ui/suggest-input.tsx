"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SuggestInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: string[];
  listId: string;
}

/** Text input with a datalist for guided suggestions.
 *  Allows free text but nudges users toward canonical values. */
const SuggestInput = React.forwardRef<HTMLInputElement, SuggestInputProps>(
  ({ className, options, listId, ...props }, ref) => (
    <>
      <input
        ref={ref}
        list={listId}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      <datalist id={listId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  )
);
SuggestInput.displayName = "SuggestInput";

export { SuggestInput };
