import { Gem, MapPin, TrendingUp, Camera, QrCode, FileText } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";

const features = [
  {
    icon: Gem,
    title: "Gem Cataloging",
    description:
      "Log every detail: species, variety, weight, color, clarity, cut, and custom attributes. Combobox search with 29 species and 75+ variety types.",
    colSpan: 4 as const,
    accent: "text-violet-600",
    accentBg: "bg-violet-50",
  },
  {
    icon: MapPin,
    title: "Provenance Map",
    description:
      "Interactive world map showing exactly where each gem was found. Color-coded markers, country stats, and side-panel detail view.",
    colSpan: 4 as const,
    accent: "text-blue-600",
    accentBg: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "Sales & Profit",
    description:
      "Full purchase order and sales pipeline. Automatic profit calculation, revenue chart by month, and gem-level sold status.",
    colSpan: 4 as const,
    accent: "text-emerald-600",
    accentBg: "bg-emerald-50",
  },
  {
    icon: Camera,
    title: "Photo Gallery",
    description:
      "Multi-photo upload with lightbox viewer. Store gem images in MinIO — your own private S3-compatible storage.",
    colSpan: 3 as const,
    accent: "text-orange-600",
    accentBg: "bg-orange-50",
  },
  {
    icon: QrCode,
    title: "QR & Public Links",
    description:
      "Generate a scannable QR code for each gem. Share a public page with provenance, photos, and certificates — no login required.",
    colSpan: 3 as const,
    accent: "text-pink-600",
    accentBg: "bg-pink-50",
  },
  {
    icon: FileText,
    title: "Gemological Certificates",
    description:
      "Upload and store PDF certificates from any lab (GIA, AGL, Gübelin, etc.). Certificate number, lab, grade, and issue date tracked alongside your gem.",
    colSpan: 6 as const,
    accent: "text-violet-600",
    accentBg: "bg-violet-50",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-zinc-50/60">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Everything you need to manage your gems
          </h2>
          <p className="mt-4 text-zinc-500 max-w-xl mx-auto">
            Built for collectors and dealers who take their gemstone inventory seriously.
          </p>
        </div>

        <BentoGrid>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <BentoCard key={feature.title} colSpan={feature.colSpan}>
                <MagicCard
                  className="h-full p-6 rounded-xl"
                  gradientColor="#7c3aed"
                  gradientOpacity={0.07}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${feature.accentBg} mb-4`}>
                    <Icon size={18} className={feature.accent} />
                  </div>
                  <h3 className="font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                </MagicCard>
              </BentoCard>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
