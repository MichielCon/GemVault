"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gem } from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { DotPattern } from "@/components/magicui/dot-pattern";

const initialState = { error: null as string | null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen">
      {/* Left panel — dark brand side */}
      <div className="relative hidden lg:flex lg:w-[420px] shrink-0 flex-col items-center justify-center overflow-hidden bg-zinc-950 px-10 py-12">
        <DotPattern className="fill-white/5" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 ring-1 ring-violet-500/30">
            <Gem size={28} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">GemVault</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Your complete gemstone collection<br />management platform.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2 text-xs text-zinc-600">
            <p>Track inventory · Record sales · Generate reports</p>
            <p>QR scan pages · Certificate storage · Provenance maps</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center bg-[#fafaf8] p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Gem size={20} className="text-violet-600" />
            <span className="text-lg font-bold tracking-tight">GemVault</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Sign in</h2>
            <p className="mt-1 text-sm text-zinc-500">Welcome back to your collection</p>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            {state.error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-zinc-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="border-zinc-200 bg-white focus-visible:ring-violet-500/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-zinc-700">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="border-zinc-200 bg-white focus-visible:ring-violet-500/30"
              />
            </div>
            <ShimmerButton
              type="submit"
              disabled={pending}
              className="mt-2 w-full"
              background="rgba(9,9,11,0.95)"
            >
              {pending ? "Signing in…" : "Sign in"}
            </ShimmerButton>
            <p className="text-center text-sm text-zinc-500">
              No account?{" "}
              <Link href="/auth/register" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
