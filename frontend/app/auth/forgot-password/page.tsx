"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gem, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    startTransition(async () => {
      const result = await forgotPassword(email);
      if (result.error) {
        setError(result.error);
      } else {
        setSent(true);
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <Gem size={20} className="text-violet-600" />
          <span className="text-lg font-bold tracking-tight">GemVault</span>
        </div>

        <Link
          href="/auth/login"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>

        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Forgot password?</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Enter your email and we&apos;ll send reset instructions if the account exists.
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-green-200 bg-green-50 px-6 py-8 text-center">
            <CheckCircle2 size={36} className="text-green-500" />
            <div>
              <p className="font-semibold text-green-800">Check your inbox</p>
              <p className="mt-1 text-sm text-green-700">
                If that email exists, you&apos;ll receive reset instructions shortly.
              </p>
            </div>
            <Link href="/auth/login" className="text-sm font-medium text-green-700 hover:underline underline-offset-4">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-zinc-700">Email address</Label>
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
            <Button type="submit" variant="violet" disabled={isPending} className="mt-1">
              {isPending ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
