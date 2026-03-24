import Link from "next/link";
import { verifyEmail } from "@/lib/auth";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<{ email?: string; token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email, token } = await searchParams;

  if (!email || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <Mail size={24} className="text-zinc-400" />
            </div>
          </div>
          <h1 className="text-xl font-semibold">Invalid verification link</h1>
          <p className="mt-2 text-sm text-zinc-500">
            This link is missing required parameters. Please use the link from your verification email.
          </p>
          <Button asChild size="sm" variant="violet" className="mt-6">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { error } = await verifyEmail(email, token);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <XCircle size={24} className="text-red-500" />
            </div>
          </div>
          <h1 className="text-xl font-semibold">Verification failed</h1>
          <p className="mt-2 text-sm text-zinc-500">{error}</p>
          <p className="mt-1 text-xs text-zinc-400">
            The link may have expired. Log in and use the banner to resend.
          </p>
          <Button asChild size="sm" variant="violet" className="mt-6">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle size={24} className="text-green-500" />
          </div>
        </div>
        <h1 className="text-xl font-semibold">Email verified!</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Your email address has been confirmed. You&apos;re all set.
        </p>
        <Button asChild size="sm" variant="violet" className="mt-6">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
