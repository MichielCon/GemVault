"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, X } from "lucide-react";

const DISMISS_KEY = "passwordBannerDismissed";

export function PasswordBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) setShow(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="shrink-0 flex items-center gap-3 bg-blue-50 border-b border-blue-200 px-5 py-2.5 text-sm text-blue-800">
      <ShieldAlert size={15} className="shrink-0 text-blue-600" />
      <span className="flex-1">
        Your password may not meet our current security requirements.{" "}
        <Link href="/profile" className="font-medium underline underline-offset-2 hover:text-blue-900 transition-colors">
          Update your password
        </Link>
      </span>
      <button
        onClick={dismiss}
        className="p-0.5 text-blue-500 hover:text-blue-800 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
