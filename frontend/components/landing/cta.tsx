import Link from "next/link";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export function CTA() {
  return (
    <section className="py-24 bg-[#fafaf8]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-8 py-16 text-center">
          <DotPattern
            className="fill-white/5"
            width={20}
            height={20}
          />
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[300px] rounded-full bg-violet-600/15 blur-3xl" />
          </div>

          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400 mb-4">
              Get started today
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Start cataloging your gems today.
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Join collectors and dealers who use GemVault to track their
              inventory from acquisition to sale.
            </p>
            <Link href="/auth/register">
              <ShimmerButton
                className="h-11 px-8 text-sm font-medium rounded-lg mx-auto"
                background="rgba(124, 58, 237, 1)"
                shimmerColor="#ffffff"
              >
                Create free account
              </ShimmerButton>
            </Link>
            <p className="mt-4 text-xs text-zinc-500">
              No credit card required · Free tier includes 50 gems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
