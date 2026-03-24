import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { originsApi, gemsApi, parcelsApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gem, Package, MapPin, Pencil } from "lucide-react";
import { DeleteOriginButton } from "@/components/origins/delete-origin-button";
import type { GemSummaryDto, GemParcelSummaryDto } from "@/lib/types";
import { proxyPhotoUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OriginDetailPage({ params }: Props) {
  const { id } = await params;

  let origin;
  try {
    origin = await originsApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  const [gemsResult, parcelsResult] = await Promise.allSettled([
    gemsApi.list(1, 100, undefined, id),
    parcelsApi.list(1, 100, undefined, id),
  ]);

  const gems = gemsResult.status === "fulfilled" ? gemsResult.value.items : [];
  const parcels = parcelsResult.status === "fulfilled" ? parcelsResult.value.items : [];

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/dashboard/origins">
          <ArrowLeft size={16} />
          All origins
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <MapPin size={28} className="mt-1 shrink-0 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{origin.country}</h1>
            {origin.locality && (
              <p className="mt-1 text-muted-foreground">{origin.locality}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/origins/${origin.id}/edit`}>
              <Pencil size={14} />
              Edit
            </Link>
          </Button>
          <DeleteOriginButton id={origin.id} />
        </div>
      </div>

      {/* Gems section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Gem size={18} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold">Gems ({gems.length})</h2>
        </div>
        {gems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No gems from this origin.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {gems.map((gem) => (
              <GemCard key={gem.id} gem={gem} />
            ))}
          </div>
        )}
      </section>

      {/* Parcels section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold">Parcels ({parcels.length})</h2>
        </div>
        {parcels.length === 0 ? (
          <p className="text-sm text-muted-foreground">No parcels from this origin.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {parcels.map((parcel) => (
              <ParcelCard key={parcel.id} parcel={parcel} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function GemCard({ gem }: { gem: GemSummaryDto }) {
  const label = [gem.species, gem.variety].filter(Boolean).join(" — ") || "Unknown species";
  return (
    <Link
      href={`/dashboard/gems/${gem.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        {gem.coverPhotoUrl ? (
          <Image
            src={proxyPhotoUrl(gem.coverPhotoUrl) ?? ""}
            alt={gem.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/40">
            <Gem size={32} strokeWidth={1} />
          </div>
        )}
        {gem.isPublic && (
          <Badge className="absolute right-1.5 top-1.5 text-[10px] px-1.5 py-0 bg-white/90 text-zinc-700 border-0 shadow-sm">
            Public
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-2.5">
        <p className="truncate text-sm font-medium leading-snug">{gem.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{label}</p>
        {gem.weightCarats && (
          <p className="text-[11px] text-muted-foreground">{gem.weightCarats} ct</p>
        )}
      </div>
    </Link>
  );
}

function ParcelCard({ parcel }: { parcel: GemParcelSummaryDto }) {
  const label = [parcel.species, parcel.variety].filter(Boolean).join(" — ") || "Unknown species";
  return (
    <Link
      href={`/dashboard/parcels/${parcel.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        {parcel.coverPhotoUrl ? (
          <Image
            src={proxyPhotoUrl(parcel.coverPhotoUrl) ?? ""}
            alt={parcel.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/40">
            <Package size={32} strokeWidth={1} />
          </div>
        )}
        {parcel.isPublic && (
          <Badge className="absolute right-1.5 top-1.5 text-[10px] px-1.5 py-0 bg-white/90 text-zinc-700 border-0 shadow-sm">
            Public
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-2.5">
        <p className="truncate text-sm font-medium leading-snug">{parcel.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{parcel.quantity} stones</p>
      </div>
    </Link>
  );
}
