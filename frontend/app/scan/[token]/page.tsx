import { publicApi, ApiError } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Lock, Gem, MapPin, Weight, Palette, Sparkles,
  Award, AlertTriangle,
} from "lucide-react";
import { ScanPhotoGallery } from "@/components/scan/scan-photo-gallery";
import type { PublicGemDto } from "@/lib/types";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export default async function PublicScanPage({ params }: Props) {
  const { token } = await params;

  let gem: PublicGemDto;
  try {
    gem = await publicApi.scan(token);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return <PrivatePage />;
    }
    throw e;
  }

  const origin = [gem.originLocality, gem.originCountry].filter(Boolean).join(", ");

  const weight =
    gem.recordType === "Parcel"
      ? gem.totalWeightCarats
        ? `${gem.quantity} stones · ${gem.totalWeightCarats} ct total`
        : `${gem.quantity} stones`
      : gem.weightCarats
      ? `${gem.weightCarats} ct`
      : null;

  const speciesLine = [gem.species, gem.variety].filter(Boolean).join(" — ");

  const dimensions =
    gem.lengthMm && gem.widthMm
      ? `${gem.lengthMm} × ${gem.widthMm}${gem.heightMm ? ` × ${gem.heightMm}` : ""} mm`
      : null;

  const hasTreatment = gem.treatment && gem.treatment !== "None";

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-100">
        <div className="flex items-center gap-1.5">
          <Gem size={16} className="text-violet-600" />
          <span className="text-sm font-bold tracking-tight text-zinc-900">GemVault</span>
        </div>
        <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Gem Authenticity Record</span>
      </div>

      {/* Photo gallery */}
      <div className="relative">
        <ScanPhotoGallery photos={gem.photos} gemName={gem.name} />
        <div className="absolute top-3 right-3 z-10">
          <Badge
            variant="secondary"
            className="bg-black/50 text-white border-0 backdrop-blur-sm text-xs px-2 py-0.5"
          >
            {gem.recordType}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg px-4 pb-12 pt-5 flex flex-col gap-4">
        {/* Name + species */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 leading-tight">{gem.name}</h1>
          {speciesLine && (
            <p className="mt-0.5 text-base text-zinc-500">{speciesLine}</p>
          )}
        </div>

        {/* Key stat pills */}
        <div className="grid grid-cols-2 gap-2">
          {origin && <StatCard icon={<MapPin size={14} />} label="Origin" value={origin} />}
          {weight && <StatCard icon={<Weight size={14} />} label="Weight" value={weight} />}
          {gem.color && <StatCard icon={<Palette size={14} />} label="Color" value={gem.color} />}
          {gem.clarity && <StatCard icon={<Sparkles size={14} />} label="Clarity" value={gem.clarity} />}
        </div>

        {/* Full properties */}
        {(gem.cut || gem.shape || gem.treatment || dimensions) && (
          <Section title="Properties">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              <Prop label="Cut" value={gem.cut} />
              <Prop label="Shape" value={gem.shape} />
              <Prop label="Dimensions" value={dimensions} />
              <Prop label="Treatment" value={gem.treatment} />
            </dl>
          </Section>
        )}

        {/* Treatment disclosure */}
        {hasTreatment && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-semibold">Treatment disclosure: </span>
              This stone has been treated ({gem.treatment}). Treatment is standard practice for many gem types
              and has been disclosed in accordance with trade standards.
            </p>
          </div>
        )}

        {/* Certificates */}
        {gem.certificates.length > 0 && (
          <Section title="Laboratory Certificates" icon={<Award size={13} className="text-zinc-400" />}>
            <div className="flex flex-col gap-2">
              {gem.certificates.map((cert, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-zinc-50 border border-zinc-100 px-3 py-2.5">
                  <Award size={14} className="text-violet-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900">
                      {cert.lab ?? "Laboratory Certificate"}
                      {cert.certNumber && (
                        <span className="ml-1.5 text-xs font-normal text-zinc-500">#{cert.certNumber}</span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {[cert.grade, cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Notes */}
        {gem.notes && (
          <Section title="Notes">
            <p className="text-sm text-zinc-600 leading-relaxed">{gem.notes}</p>
          </Section>
        )}

        {/* Footer */}
        <div className="mt-4 flex flex-col items-center gap-1.5 text-center border-t border-zinc-200 pt-6">
          <div className="flex items-center gap-1.5">
            <Gem size={14} className="text-violet-600" />
            <span className="text-sm font-bold text-zinc-800">GemVault</span>
          </div>
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
            This record is maintained by the collection owner and authenticated via GemVault.
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">
            Added {new Date(gem.createdAt).toLocaleDateString()}
            {gem.scanCount > 0 && ` · Scanned ${gem.scanCount} ${gem.scanCount === 1 ? "time" : "times"}`}
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="mt-0.5 shrink-0 text-zinc-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-800 leading-snug break-words">{value}</p>
      </div>
    </div>
  );
}

function Prop({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <>
      <dt className="text-zinc-400">{label}</dt>
      <dd className="font-medium text-zinc-800">{value}</dd>
    </>
  );
}

function PrivatePage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 text-center gap-5">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
        <Gem size={36} className="text-zinc-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">This item is private</h1>
        <p className="mt-2 text-zinc-500">
          This gem record is not publicly accessible.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500">
        <Lock size={13} />
        Private collection
      </div>
      <p className="text-xs text-zinc-400 max-w-xs">
        If you think this is a mistake, contact the collection owner directly.
      </p>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400">
        <Gem size={12} />
        <span className="font-semibold">GemVault</span>
      </div>
    </div>
  );
}
