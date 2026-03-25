"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html>
      <body style={{ backgroundColor: "#09090b", color: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>GemVault</h1>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Something went wrong</h2>
          <p style={{ fontSize: "0.875rem", color: "#a1a1aa", maxWidth: "28rem" }}>
            {error.message || "An unexpected error occurred."}
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#71717a", fontFamily: "monospace" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: "500", borderRadius: "0.375rem", backgroundColor: "#7c3aed", color: "white", border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
