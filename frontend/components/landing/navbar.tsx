"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200/60"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Gem size={20} className="text-violet-600" />
          <span className="font-bold text-zinc-900 tracking-tight">GemVault</span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
            Pricing
          </a>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button variant="violet" size="sm" asChild>
            <Link href="/auth/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
