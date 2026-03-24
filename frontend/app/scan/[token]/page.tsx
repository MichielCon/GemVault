import Image from "next/image";
import { publicApi, ApiError } from "@/lib/api";
import { proxyPhotoUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Lock, Gem, ImageOff } from "lucide-react";
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

  const subtitle =
    gem.recordType === "Parcel"
      ? `Parcel — ${gem.quantity} stones${gem.totalWeightCarats ? `, ${gem.totalWeightCarats} ct total` : ""}`
      : gem.weightCarats
      ? `${gem.weightCarats} ct`
      : null;

  const origin = [gem.originCountry, gem.originLocality]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-background">
      {/* Simple top bar — no auth required */}
      <header className="border-b bg-card px-4 py-3">
        <span className="font-bold tracking-tight">GemVault</span>
        <span className="ml-2 text-sm text-muted-foreground">/ Public record</span>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Cover photo */}
        {coverPhoto ? (
          <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={proxyPhotoUrl(coverPhoto.url) ?? ""}
              alt={gem.name}
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 672px) 100vw, 672px"
            />
          </div>
        ) : (
          <div className="mb-6 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-muted text-muted-foreground">
            <ImageOff size={32} className="text-zinc-300" />
            <span>No photo</span>
          </div>
        )}

        {/* Gallery */}
        {otherPhotos.length > 0 && (
          <div className="mb-6 grid grid-cols-4 gap-2">
            {otherPhotos.slice(0, 4).map((p) => (
              <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image src={proxyPhotoUrl(p.url) ?? ""} alt="" fill unoptimized className="object-cover" sizes="25vw" />
              </div>
            ))}
          </div>
        )}

        {/* Name + subtitle */}
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{gem.name}</h1>
          <Badge variant="secondary">{gem.recordType}</Badge>
        </div>
        {(gem.species || gem.variety) && (
          <p className="mb-1 text-muted-foreground">
            {[gem.species, gem.variety].filter(Boolean).join(" — ")}
          </p>
        )}
        {subtitle && <p className="mb-6 text-sm text-muted-foreground">{subtitle}</p>}

        {/* Properties */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-3 font-semibold">Properties</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Prop label="Color" value={gem.color} />
            <Prop label="Treatment" value={gem.treatment} />
            {gem.recordType === "Gem" && (
              <>
                <Prop label="Clarity" value={gem.clarity} />
                <Prop label="Cut" value={gem.cut} />
                <Prop label="Shape" value={gem.shape} />
              </>
            )}
            <Prop label="Origin" value={origin || null} />
          </dl>
          {gem.notes && (
            <p className="mt-4 border-t pt-4 text-sm text-muted-foreground">{gem.notes}</p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Scanned via GemVault · {new Date(gem.createdAt).toLocaleDateString()}
        </p>
        {gem.scanCount > 0 && (
          <p className="mt-1 text-center text-xs text-muted-foreground/60">
            Viewed {gem.scanCount} {gem.scanCount === 1 ? "time" : "times"}
          </p>
        )}
      </div>
    </div>
  );
}

function Prop({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </>
  );
}

function PrivatePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-3">
        <span className="font-bold tracking-tight">GemVault</span>
        <span className="ml-2 text-sm text-muted-foreground">/ Public record</span>
      </header>

      <div className="mx-auto max-w-md px-4 py-24 flex flex-col items-center text-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
          <Gem size={36} className="text-zinc-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">This item is private</h1>
          <p className="mt-2 text-muted-foreground">
            This item is private and can’t be viewed.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-500">
          <Lock size={13} />
          Private collection
        </div>
        <p className="text-xs text-muted-foreground">
          If you think this is a mistake, contact the owner directly.
        </p>
      </div>
    </div>
  );
}
