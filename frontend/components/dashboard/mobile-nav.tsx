"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav({ sidebar }: { sidebar: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header bar */}
      <div className="flex h-14 items-center border-b border-zinc-800/60 bg-zinc-950 px-4 md:hidden shrink-0">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <span className="ml-3 text-[15px] font-bold tracking-tight text-white">GemVault</span>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="relative h-full">
          {sidebar}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
