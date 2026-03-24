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
import { ArrowLeft, Globe, Lock, Pencil, ShoppingCart, Tag, ExternalLink, Scissors, Gem } from "lucide-react";
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
    <div className="flex flex-col gap-5">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-zinc-500 hover:text-zinc-900">
        <Link href="/dashboard/parcels">
          <ArrowLeft size={15} />
          All parcels
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{parcel.name}</h1>
            {parcel.soldInfo && (
              <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
                <Tag size={11} className="mr-1" />
                Sold
              </Badge>
            )}
          </div>
          {(parcel.species || parcel.variety) && (
            <p className="mt-0.5 text-sm text-zinc-500">
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
            <Link href={`/dashboard/parcels/${parcel.id}/split`}>
              <Scissors size={14} />
              Split into gems
            </Link>
          </Button>
          <Button asChild variant="violet" size="sm">
            <Link href={`/dashboard/parcels/${parcel.id}/edit`}>
              <Pencil size={14} />
              Edit
            </Link>
          </Button>
          {parcel.publicToken && <QrCodeButton token={parcel.publicToken} name={parcel.name} />}
          <DeleteParcelButton id={parcel.id} />
          <Badge variant={parcel.isPublic ? "violet" : "outline"}>
            {parcel.isPublic ? (
              <><Globe size={11} className="mr-1" />Public</>
            ) : (
              <><Lock size={11} className="mr-1" />Private</>
            )}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          <PhotoGallery photos={parcel.photos} name={parcel.name} entityId={parcel.id} type="parcel" />
          {parcel.originCountry && (
            <MiniOriginMapWrapper country={parcel.originCountry} />
          )}
          {parcel.publicToken && <ScanLinkCard token={parcel.publicToken} />}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          <Card hoverable>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Lot Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                <Detail label="Quantity" value={String(parcel.quantity)} />
                <Detail
                  label="Total weight"
                  value={parcel.totalWeightCarats ? `${parcel.totalWeightCarats} ct` : null}
                />
                {parcel.totalWeightCarats != null && parcel.quantity > 1 && (
                  <Detail
                    label="Avg per stone"
                    value={`${(parcel.totalWeightCarats / parcel.quantity).toFixed(2)} ct`}
                  />
                )}
                <Detail label="Color" value={parcel.color} />
                <Detail label="Treatment" value={parcel.treatment} />
                {parcel.originId && parcel.originCountry ? (
                  <>
                    <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Origin</dt>
                    <dd className="font-medium text-zinc-800">
                      <Link
                        href={`/dashboard/origins/${parcel.originId}`}
                        className="text-zinc-700 hover:text-violet-600 hover:underline underline-offset-2 transition-colors"
                      >
                        {parcel.originCountry}
                        <ExternalLink size={11} className="inline ml-1 opacity-50" />
                      </Link>
                    </dd>
                  </>
                ) : (
                  <Detail label="Origin" value={parcel.originCountry} />
                )}
              </dl>
            </CardContent>
          </Card>

          <Card hoverable>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Acquisition</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                <Detail
                  label="Purchase price"
                  value={parcel.purchasePrice != null ? `$${parcel.purchasePrice.toFixed(2)}` : null}
                />
                <Detail
                  label="Acquired on"
                  value={parcel.acquiredAt ? new Date(parcel.acquiredAt).toLocaleDateString() : null}
                />
                <Detail
                  label="Added"
                  value={new Date(parcel.createdAt).toLocaleDateString()}
                />
                <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Linked order</dt>
                <dd className="font-medium text-zinc-800">—</dd>
              </dl>
              {parcel.notes && (
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed">{parcel.notes}</p>
              )}
            </CardContent>
          </Card>

          {parcel.splitGemCount > 0 && (
            <Card hoverable>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Gem size={13} />
                  Split Gems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-700">
                  <span className="font-semibold">{parcel.splitGemCount}</span>{" "}
                  {parcel.splitGemCount === 1 ? "gem has" : "gems have"} been split from this parcel.
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  View them in your{" "}
                  <Link
                    href={`/dashboard/gems`}
                    className="text-violet-600 hover:underline underline-offset-2"
                  >
                    gem inventory
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          )}

          {parcel.soldInfo && (
            <Card className="border-amber-200/80 bg-amber-50/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Tag size={13} />
                  Sale record
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                  <dt className="text-amber-600/80">Sale date</dt>
                  <dd className="font-medium">{new Date(parcel.soldInfo.saleDate).toLocaleDateString()}</dd>
                  <dt className="text-amber-600/80">Sale price</dt>
                  <dd className="font-semibold">
                    {parcel.soldInfo.salePrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </dd>
                  {parcel.purchasePrice != null && parcel.soldInfo.salePrice > 0 && (
                    <>
                      <dt className="text-amber-600/80">Profit</dt>
                      <dd className={`font-semibold ${parcel.soldInfo.salePrice - parcel.purchasePrice >= 0 ? "text-green-700" : "text-red-700"}`}>
                        {(parcel.soldInfo.salePrice - parcel.purchasePrice).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </dd>
                    </>
                  )}
                </dl>
                <div className="mt-3">
                  <Link
                    href={`/dashboard/sales/${parcel.soldInfo.saleId}`}
                    className="text-xs font-medium text-amber-700 hover:underline"
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
      <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">{label}</dt>
      <dd className="font-medium text-zinc-800">{value}</dd>
    </>
  );
}
