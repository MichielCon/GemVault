import { notFound } from "next/navigation";
import Image from "next/image";
import { publicApi, ApiError } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
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
      notFound();
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

  const origin = [gem.originCountry, gem.originMine, gem.originRegion]
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
              src={coverPhoto.url}
              alt={gem.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 672px) 100vw, 672px"
            />
          </div>
        ) : (
          <div className="mb-6 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed bg-muted text-muted-foreground">
            No photo
          </div>
        )}

        {/* Gallery */}
        {otherPhotos.length > 0 && (
          <div className="mb-6 grid grid-cols-4 gap-2">
            {otherPhotos.slice(0, 4).map((p) => (
              <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image src={p.url} alt="" fill className="object-cover" sizes="25vw" />
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
