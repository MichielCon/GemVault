import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { gemsApi } from "@/lib/api";
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
import type { GemDto } from "@/lib/types";
import { PhotoUploader } from "@/components/gems/photo-uploader";
import { DeleteGemButton } from "@/components/gems/delete-gem-button";
import { QrCodeButton } from "@/components/gems/qr-code-button";
import { ScanLinkCard } from "@/components/gems/scan-link-card";
import { proxyPhotoUrl } from "@/lib/utils";
import { CertificateManager } from "@/components/gems/certificate-manager";
import { MiniOriginMapWrapper } from "@/components/map/mini-origin-map-wrapper";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GemDetailPage({ params }: Props) {
  const { id } = await params;

  let gem: GemDto;
  try {
    gem = await gemsApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  const coverPhoto = gem.photos.find((p) => p.isCover) ?? gem.photos[0];
  const otherPhotos = gem.photos.filter((p) => p !== coverPhoto);

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/dashboard/gems">
          <ArrowLeft size={16} />
          All gems
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{gem.name}</h1>
            {gem.soldInfo && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 border text-sm">
                <Tag size={12} className="mr-1" />
                Sold
              </Badge>
            )}
          </div>
          {(gem.species || gem.variety) && (
            <p className="mt-1 text-muted-foreground">
              {[gem.species, gem.variety].filter(Boolean).join(" — ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {!gem.soldInfo && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/sales/new?gemId=${gem.id}`}>
                <ShoppingCart size={14} />
                Record sale
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/gems/${gem.id}/edit`}>
              <Pencil size={14} />
              Edit
            </Link>
          </Button>
          {gem.publicToken && <QrCodeButton token={gem.publicToken} name={gem.name} />}
          <DeleteGemButton id={gem.id} />
          <Badge variant={gem.isPublic ? "default" : "outline"}>
          {gem.isPublic ? (
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
            <div className="relative aspect-[4/3] max-h-72 w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={proxyPhotoUrl(coverPhoto.url) ?? ""}
                alt={gem.name}
                fill
                unoptimized
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] max-h-72 w-full items-center justify-center rounded-xl border border-dashed bg-muted text-muted-foreground text-sm">
              No photo
            </div>
          )}
          {otherPhotos.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {otherPhotos.slice(0, 4).map((p) => (
                <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image src={proxyPhotoUrl(p.url) ?? ""} alt="" fill unoptimized className="object-cover" sizes="15vw" />
                </div>
              ))}
            </div>
          )}
          <PhotoUploader id={gem.id} type="gem" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Properties</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Detail label="Weight" value={gem.weightCarats ? `${gem.weightCarats} ct` : null} />
                <Detail label="Color" value={gem.color} />
                <Detail label="Clarity" value={gem.clarity} />
                <Detail label="Cut" value={gem.cut} />
                <Detail label="Shape" value={gem.shape} />
                <Detail label="Treatment" value={gem.treatment} />
                {gem.lengthMm && gem.widthMm && (
                  <Detail
                    label="Dimensions"
                    value={`${gem.lengthMm} × ${gem.widthMm}${gem.heightMm ? ` × ${gem.heightMm}` : ""} mm`}
                  />
                )}
                <Detail label="Origin" value={gem.originCountry} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Acquisition</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Detail
                  label="Purchase price"
                  value={gem.purchasePrice != null ? `$${gem.purchasePrice.toFixed(2)}` : null}
                />
                <Detail
                  label="Added"
                  value={new Date(gem.createdAt).toLocaleDateString()}
                />
              </dl>
              {gem.notes && (
                <p className="mt-3 text-sm text-muted-foreground">{gem.notes}</p>
              )}
            </CardContent>
          </Card>

          {gem.soldInfo && (
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
                  <dd className="font-medium">{new Date(gem.soldInfo.saleDate).toLocaleDateString()}</dd>
                  <dt className="text-amber-700">Sale price</dt>
                  <dd className="font-medium font-semibold">
                    {gem.soldInfo.salePrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </dd>
                  {gem.purchasePrice != null && gem.soldInfo.salePrice > 0 && (
                    <>
                      <dt className="text-amber-700">Profit</dt>
                      <dd className={`font-medium font-semibold ${gem.soldInfo.salePrice - gem.purchasePrice >= 0 ? "text-green-700" : "text-red-700"}`}>
                        {(gem.soldInfo.salePrice - gem.purchasePrice).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </dd>
                    </>
                  )}
                </dl>
                <div className="mt-3">
                  <Link
                    href={`/dashboard/sales/${gem.soldInfo.saleId}`}
                    className="text-xs text-amber-700 hover:underline"
                  >
                    View full sale record →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {gem.originCountry && (
            <MiniOriginMapWrapper country={gem.originCountry} />
          )}

          {gem.publicToken && <ScanLinkCard token={gem.publicToken} />}

          <CertificateManager gemId={gem.id} certificates={gem.certificates} />
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
