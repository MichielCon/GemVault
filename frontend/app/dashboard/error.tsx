"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
      <h2 className="text-lg font-semibold text-zinc-100">Something went wrong</h2>
      <p className="text-sm text-zinc-400 text-center max-w-md">
        {error.message || "An unexpected error occurred."}
      </p>
      {error.digest && (
        <p className="text-xs text-zinc-500 font-mono">Reference: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 text-sm font-medium rounded-md bg-violet-600 hover:bg-violet-500 text-white transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
