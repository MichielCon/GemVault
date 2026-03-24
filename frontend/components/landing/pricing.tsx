import Link from "next/link";
import { Check } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Collector",
    price: "Free",
    priceNote: "forever",
    description: "For hobbyists building their first collection.",
    cta: "Get started free",
    ctaHref: "/auth/register",
    featured: false,
    features: [
      "Up to 50 gems",
      "Photo gallery (5 photos/gem)",
      "Provenance map",
      "QR code & public links",
      "Basic origin tracking",
    ],
  },
  {
    name: "Business",
    price: "$29",
    priceNote: "per month",
    description: "For dealers and serious collectors who need full power.",
    cta: "Start free trial",
    ctaHref: "/auth/register",
    featured: true,
    badge: "Most Popular",
    features: [
      "Unlimited gems & parcels",
      "Unlimited photos",
      "Purchase orders & sales pipeline",
      "Certificate storage",
      "Supplier management",
      "Revenue & profit analytics",
      "Advanced provenance map",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "contact us",
    description: "For gem houses, auction houses, and large operations.",
    cta: "Contact us",
    ctaHref: "mailto:hello@gemvault.app",
    featured: false,
    features: [
      "Everything in Business",
      "Multi-user / teams",
      "Custom integrations",
      "Dedicated onboarding",
      "SLA guarantee",
      "On-premises deployment",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-[#fafaf8]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-zinc-500">
            Start free, upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative overflow-hidden rounded-2xl ${
                tier.featured
                  ? "ring-2 ring-violet-500/25 shadow-[0_8px_32px_rgba(124,58,237,0.12)]"
                  : "border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              }`}
            >
              <MagicCard
                className="h-full bg-white p-7 rounded-2xl flex flex-col"
                gradientColor="#7c3aed"
                gradientOpacity={tier.featured ? 0.06 : 0.04}
              >
                {tier.featured && <BorderBeam size={250} duration={14} />}

                {tier.badge && (
                  <div className="inline-flex mb-4">
                    <span className="rounded-full bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-700">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-zinc-900 mb-1">{tier.name}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{tier.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-zinc-900">{tier.price}</span>
                    <span className="text-sm text-zinc-400">/{tier.priceNote}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check size={15} className="text-violet-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-zinc-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.featured ? "violet" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href={tier.ctaHref}>{tier.cta}</Link>
                </Button>
              </MagicCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
