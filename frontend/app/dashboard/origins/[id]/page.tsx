import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { originsApi, gemsApi, parcelsApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gem, Package, MapPin } from "lucide-react";
import type { GemSummaryDto, GemParcelSummaryDto } from "@/lib/types";

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
    <div className="flex flex-col gap-6 max-w-5xl">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/dashboard/origins">
          <ArrowLeft size={16} />
          All origins
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start gap-3">
        <MapPin size={28} className="mt-1 shrink-0 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{origin.country}</h1>
          {(origin.mine || origin.region) && (
            <p className="mt-1 text-muted-foreground">
              {[origin.mine, origin.region].filter(Boolean).join(" · ")}
            </p>
          )}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-muted">
        {gem.coverPhotoUrl ? (
          <Image
            src={gem.coverPhotoUrl}
            alt={gem.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Gem size={40} strokeWidth={1} />
          </div>
        )}
        {gem.isPublic && (
          <Badge variant="secondary" className="absolute right-2 top-2 text-xs">
            Public
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="font-medium leading-none">{gem.name}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {gem.weightCarats && (
          <p className="text-xs text-muted-foreground">{gem.weightCarats} ct</p>
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
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-muted">
        {parcel.coverPhotoUrl ? (
          <Image
            src={parcel.coverPhotoUrl}
            alt={parcel.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Package size={40} strokeWidth={1} />
          </div>
        )}
        {parcel.isPublic && (
          <Badge variant="secondary" className="absolute right-2 top-2 text-xs">
            Public
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="font-medium leading-none">{parcel.name}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{parcel.quantity} stones</p>
      </div>
    </Link>
  );
}
