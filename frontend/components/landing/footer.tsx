import Link from "next/link";
import { Gem } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <Link href="/" className="flex items-center gap-2">
              <Gem size={16} className="text-violet-600" />
              <span className="font-bold text-zinc-900 tracking-tight text-sm">GemVault</span>
            </Link>
            <p className="text-xs text-zinc-400">
              Gemstone inventory for collectors &amp; businesses.
            </p>
          </div>

          {/* Product links */}
          <nav className="flex flex-col items-center sm:items-start gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1">Product</p>
            <a href="/#features" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Features
            </a>
            <a href="/#pricing" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Pricing
            </a>
            <Link href="/auth/login" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Sign in
            </Link>
            <Link href="/auth/register" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Register
            </Link>
          </nav>

          {/* Legal links */}
          <nav className="flex flex-col items-center sm:items-start gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1">Legal</p>
            <Link href="/privacy" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Cookie Policy
            </Link>
            <Link href="/terms" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Terms of Service
            </Link>
            <Link href="/legal" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Legal Notice
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-400">
            &copy; 2026 GemVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
