import Image from "next/image";
import { publicApi, ApiError } from "@/lib/api";
import { proxyPhotoUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Lock, Gem, ImageOff, MapPin, Weight, Palette, Sparkles } from "lucide-react";
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

  const coverPhoto = gem.photos.find((p) => p.isCover) ?? gem.photos[0];
  const otherPhotos = gem.photos.filter((p) => p !== coverPhoto);

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

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero photo — full-width, no padding */}
      <div className="relative w-full aspect-[4/3] bg-zinc-900 max-h-[60vw] sm:max-h-80">
        {coverPhoto ? (
          <Image
            src={proxyPhotoUrl(coverPhoto.url) ?? ""}
            alt={gem.name}
            fill
            unoptimized
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center gap-2 text-zinc-600">
            <ImageOff size={32} />
            <span className="text-sm">No photo</span>
          </div>
        )}

        {/* Badge overlay */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-black/60 text-white border-0 backdrop-blur-sm text-xs px-2 py-0.5"
          >
            {gem.recordType}
          </Badge>
        </div>
      </div>

      {/* Thumbnail strip */}
      {otherPhotos.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto px-4 py-2 bg-white border-b border-zinc-100">
          {otherPhotos.slice(0, 6).map((p) => (
            <div key={p.id} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={proxyPhotoUrl(p.url) ?? ""}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="56px"
              />
            </div>
          ))}
        </div>
      )}

      {/* Content — constrained and centred */}
      <div className="mx-auto max-w-lg px-4 pb-10 pt-5">
        {/* Name + species */}
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 leading-tight">{gem.name}</h1>
        {speciesLine && (
          <p className="mt-0.5 text-base text-zinc-500">{speciesLine}</p>
        )}

        {/* Key stat pills */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {origin && (
            <StatCard icon={<MapPin size={14} />} label="Origin" value={origin} />
          )}
          {weight && (
            <StatCard icon={<Weight size={14} />} label="Weight" value={weight} />
          )}
          {gem.color && (
            <StatCard icon={<Palette size={14} />} label="Color" value={gem.color} />
          )}
          {gem.clarity && (
            <StatCard icon={<Sparkles size={14} />} label="Clarity" value={gem.clarity} />
          )}
        </div>

        {/* Properties detail */}
        {(gem.cut || gem.shape || gem.treatment) && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Details</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Prop label="Cut" value={gem.cut} />
              <Prop label="Shape" value={gem.shape} />
              <Prop label="Treatment" value={gem.treatment} />
            </dl>
          </div>
        )}

        {/* Notes */}
        {gem.notes && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">Notes</h2>
            <p className="text-sm text-zinc-600 leading-relaxed">{gem.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Gem size={12} />
            <span className="font-semibold">GemVault</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Authenticated gem record · {new Date(gem.createdAt).toLocaleDateString()}
          </p>
          {gem.scanCount > 0 && (
            <p className="text-[11px] text-zinc-400/60">
              Viewed {gem.scanCount} {gem.scanCount === 1 ? "time" : "times"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="mt-0.5 shrink-0 text-zinc-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-800 leading-snug truncate">{value}</p>
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
