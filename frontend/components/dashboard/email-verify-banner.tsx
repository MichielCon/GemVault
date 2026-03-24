"use client";

import { useState, useTransition } from "react";
import { Mail, X } from "lucide-react";
import { resendVerification } from "@/lib/auth";

export function EmailVerifyBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (dismissed) return null;

  function handleResend() {
    startTransition(async () => {
      const result = await resendVerification();
      if (result.error) setError(result.error);
      else setSent(true);
    });
  }

  return (
    <div className="shrink-0 flex items-center gap-3 bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-sm text-amber-800">
      <Mail size={15} className="shrink-0 text-amber-600" />
      <span className="flex-1">
        {sent ? (
          "Verification email sent — check your inbox."
        ) : (
          <>
            Please verify your email address to unlock all features.{" "}
            {error ? (
              <span className="text-red-700">{error}</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isPending}
                className="font-medium underline underline-offset-2 hover:text-amber-900 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Sending…" : "Resend verification email"}
              </button>
            )}
          </>
        )}
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="p-0.5 text-amber-500 hover:text-amber-800 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
