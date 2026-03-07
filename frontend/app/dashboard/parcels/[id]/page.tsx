import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { parcelsApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Globe, Lock, Pencil } from "lucide-react";
import type { GemParcelDto } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ParcelDetailPage({ params }: Props) {
  const { id } = await params;

  let parcel: GemParcelDto;
  try {
    parcel = await parcelsApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  const coverPhoto = parcel.photos.find((p) => p.isCover) ?? parcel.photos[0];
  const otherPhotos = parcel.photos.filter((p) => p !== coverPhoto);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/dashboard/parcels">
          <ArrowLeft size={16} />
          All parcels
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{parcel.name}</h1>
          {(parcel.species || parcel.variety) && (
            <p className="mt-1 text-muted-foreground">
              {[parcel.species, parcel.variety].filter(Boolean).join(" — ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/parcels/${parcel.id}/edit`}>
              <Pencil size={14} />
              Edit
            </Link>
          </Button>
          <Badge variant={parcel.isPublic ? "default" : "outline"}>
          {parcel.isPublic ? (
            <><Globe size={12} className="mr-1" />Public</>
          ) : (
            <><Lock size={12} className="mr-1" />Private</>
          )}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Photos */}
        <div className="flex flex-col gap-3">
          {coverPhoto ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={coverPhoto.url}
                alt={parcel.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed bg-muted text-muted-foreground text-sm">
              No photo
            </div>
          )}
          {otherPhotos.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {otherPhotos.slice(0, 4).map((p) => (
                <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image src={p.url} alt="" fill className="object-cover" sizes="15vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Lot details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Detail label="Quantity" value={String(parcel.quantity)} />
                <Detail
                  label="Total weight"
                  value={parcel.totalWeightCarats ? `${parcel.totalWeightCarats} ct` : null}
                />
                <Detail label="Color" value={parcel.color} />
                <Detail label="Treatment" value={parcel.treatment} />
                <Detail label="Origin" value={parcel.originCountry} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Acquisition</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Detail
                  label="Purchase price"
                  value={parcel.purchasePrice != null ? `$${parcel.purchasePrice.toFixed(2)}` : null}
                />
                <Detail
                  label="Added"
                  value={new Date(parcel.createdAt).toLocaleDateString()}
                />
              </dl>
              {parcel.notes && (
                <p className="mt-3 text-sm text-muted-foreground">{parcel.notes}</p>
              )}
            </CardContent>
          </Card>

          {parcel.publicToken && (
            <Card>
              <CardHeader><CardTitle className="text-base">Public link</CardTitle></CardHeader>
              <CardContent>
                <p className="break-all font-mono text-xs text-muted-foreground">
                  /scan/{parcel.publicToken}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </>
  );
}
