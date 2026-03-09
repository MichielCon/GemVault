import { notFound } from "next/navigation";
import Link from "next/link";
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
import { ArrowLeft, Globe, Lock, Pencil, ShoppingCart, Tag } from "lucide-react";
import type { GemParcelDto } from "@/lib/types";
import { PhotoGallery } from "@/components/gems/photo-gallery";
import { DeleteParcelButton } from "@/components/parcels/delete-parcel-button";
import { QrCodeButton } from "@/components/gems/qr-code-button";
import { ScanLinkCard } from "@/components/gems/scan-link-card";
import { MiniOriginMapWrapper } from "@/components/map/mini-origin-map-wrapper";

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

  return (
    <div className="flex flex-col gap-6">
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
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{parcel.name}</h1>
            {parcel.soldInfo && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 border text-sm">
                <Tag size={12} className="mr-1" />
                Sold
              </Badge>
            )}
          </div>
          {(parcel.species || parcel.variety) && (
            <p className="mt-1 text-muted-foreground">
              {[parcel.species, parcel.variety].filter(Boolean).join(" — ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {!parcel.soldInfo && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/sales/new?gemParcelId=${parcel.id}`}>
                <ShoppingCart size={14} />
                Record sale
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/parcels/${parcel.id}/edit`}>
              <Pencil size={14} />
              Edit
            </Link>
          </Button>
          {parcel.publicToken && <QrCodeButton token={parcel.publicToken} name={parcel.name} />}
          <DeleteParcelButton id={parcel.id} />
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
          <PhotoGallery photos={parcel.photos} name={parcel.name} entityId={parcel.id} type="parcel" />
          {parcel.originCountry && (
            <MiniOriginMapWrapper country={parcel.originCountry} />
          )}
          {parcel.publicToken && <ScanLinkCard token={parcel.publicToken} />}
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

          {parcel.soldInfo && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-base text-amber-800 flex items-center gap-2">
                  <Tag size={15} />
                  Sale record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-amber-700">Sale date</dt>
                  <dd className="font-medium">{new Date(parcel.soldInfo.saleDate).toLocaleDateString()}</dd>
                  <dt className="text-amber-700">Sale price</dt>
                  <dd className="font-medium font-semibold">
                    {parcel.soldInfo.salePrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </dd>
                  {parcel.purchasePrice != null && parcel.soldInfo.salePrice > 0 && (
                    <>
                      <dt className="text-amber-700">Profit</dt>
                      <dd className={`font-medium font-semibold ${parcel.soldInfo.salePrice - parcel.purchasePrice >= 0 ? "text-green-700" : "text-red-700"}`}>
                        {(parcel.soldInfo.salePrice - parcel.purchasePrice).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </dd>
                    </>
                  )}
                </dl>
                <div className="mt-3">
                  <Link
                    href={`/dashboard/sales/${parcel.soldInfo.saleId}`}
                    className="text-xs text-amber-700 hover:underline"
                  >
                    View full sale record →
                  </Link>
                </div>
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
