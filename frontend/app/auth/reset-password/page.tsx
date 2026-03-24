"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gem, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const emailFromParams = searchParams.get("email") ?? "";
  const tokenFromParams = searchParams.get("token") ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const token = formData.get("token") as string;
    const newPassword = formData.get("newPassword") as string;

    startTransition(async () => {
      const result = await resetPassword(email, token, newPassword);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/auth/login?reset=1");
      }
    });
  }

  return (
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
          defaultValue={emailFromParams}
          className="border-zinc-200 bg-white focus-visible:ring-violet-500/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="token" className="text-zinc-700">Reset token</Label>
        <Input
          id="token"
          name="token"
          type="text"
          placeholder="Paste your reset token"
          required
          defaultValue={tokenFromParams}
          className="border-zinc-200 bg-white focus-visible:ring-violet-500/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="newPassword" className="text-zinc-700">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="At least 8 characters"
          required
          autoComplete="new-password"
          className="border-zinc-200 bg-white focus-visible:ring-violet-500/30"
        />
      </div>
      <Button type="submit" variant="violet" disabled={isPending} className="mt-1">
        {isPending ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Reset password</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Enter the token from your email and choose a new password.
          </p>
        </div>

        <Suspense fallback={<p className="text-sm text-zinc-400">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
