import Link from "next/link";
import Image from "next/image";
import { parcelsApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import type { GemParcelSummaryDto } from "@/lib/types";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function ParcelsPage({ searchParams }: Props) {
  const { page: pageStr, search } = await searchParams;
  const page = Number(pageStr ?? 1);

  let result;
  try {
    result = await parcelsApi.list(page, 20, search);
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <Header />
        <p className="text-muted-foreground">Failed to load parcels. Is the API running?</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Header />

      {result.items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((parcel) => (
              <ParcelCard key={parcel.id} parcel={parcel} />
            ))}
          </div>
          <Pagination page={page} totalPages={result.totalPages} search={search} />
        </>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Parcels</h1>
        <p className="text-sm text-muted-foreground">Your gem parcel inventory</p>
      </div>
      <Button asChild size="sm">
        <Link href="/dashboard/parcels/new">
          <Plus size={16} />
          Add parcel
        </Link>
      </Button>
    </div>
  );
}

function ParcelCard({ parcel }: { parcel: GemParcelSummaryDto }) {
  const label = [parcel.species, parcel.variety].filter(Boolean).join(" — ") || "Unknown species";

  return (
    <Link
      href={`/dashboard/parcels/${parcel.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Photo */}
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

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <p className="font-medium leading-none">{parcel.name}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          Qty: {parcel.quantity}
          {parcel.totalWeightCarats != null && ` · ${parcel.totalWeightCarats} ct total`}
        </p>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <Package size={48} strokeWidth={1} className="mb-4 text-muted-foreground" />
      <p className="font-medium">No parcels yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Add your first parcel to start tracking bulk gem lots.
      </p>
      <Button asChild size="sm" className="mt-4">
        <Link href="/dashboard/parcels/new">
          <Plus size={16} />
          Add parcel
        </Link>
      </Button>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  search,
}: {
  page: number;
  totalPages: number;
  search?: string;
}) {
  if (totalPages <= 1) return null;

  function url(p: number) {
    const q = new URLSearchParams({ page: String(p) });
    if (search) q.set("search", search);
    return `/dashboard/parcels?${q}`;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button asChild variant="outline" size="sm" disabled={page <= 1}>
        <Link href={url(page - 1)}>Previous</Link>
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>
      <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
        <Link href={url(page + 1)}>Next</Link>
      </Button>
    </div>
  );
}
