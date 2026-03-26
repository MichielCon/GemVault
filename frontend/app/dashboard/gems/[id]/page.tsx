import { notFound } from "next/navigation";
import Link from "next/link";
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
import { ArrowLeft, Globe, Lock, Pencil, ShoppingCart, Tag, ExternalLink, Package } from "lucide-react";
import type { GemDto } from "@/lib/types";

const GEM_STATUS_STYLES: Record<string, string> = {
  Available: "bg-green-100 text-green-700",
  Reserved: "bg-yellow-100 text-yellow-700",
  OnConsignment: "bg-blue-100 text-blue-700",
  InRepair: "bg-orange-100 text-orange-700",
  Lost: "bg-red-100 text-red-700",
};

const GEM_STATUS_LABELS: Record<string, string> = {
  Available: "Available",
  Reserved: "Reserved",
  OnConsignment: "On Consignment",
  InRepair: "In Repair",
  Lost: "Lost",
};
import { PhotoGallery } from "@/components/gems/photo-gallery";
import { DeleteGemButton } from "@/components/gems/delete-gem-button";
import { QrCodeButton } from "@/components/gems/qr-code-button";
import { ScanLinkCard } from "@/components/gems/scan-link-card";
import { CertificateManager } from "@/components/gems/certificate-manager";
import { MiniOriginMapWrapper } from "@/components/map/mini-origin-map-wrapper";
import { CutPlanCard } from "@/components/gems/cut-plan-card";
import { FacetingSpecsCard } from "@/components/gems/faceting-specs-card";
import { CuttingJournalCard } from "@/components/gems/cutting-journal-card";

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

  return (
    <div className="flex flex-col gap-5">
      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-zinc-500 hover:text-zinc-900">
        <Link href="/dashboard/gems">
          <ArrowLeft size={15} />
          All gems
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{gem.name}</h1>
            {gem.status && (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${GEM_STATUS_STYLES[gem.status] ?? "bg-zinc-100 text-zinc-700"}`}>
                {GEM_STATUS_LABELS[gem.status] ?? gem.status}
              </span>
            )}
            {gem.soldInfo && (
              <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
                <Tag size={11} className="mr-1" />
                Sold
              </Badge>
            )}
          </div>
          {(gem.species || gem.variety) && (
            <p className="mt-0.5 text-sm text-zinc-500">
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
          <Button asChild variant="violet" size="sm">
            <Link href={`/dashboard/gems/${gem.id}/edit`}>
              <Pencil size={14} />
              Edit
            </Link>
          </Button>
          {gem.publicToken && <QrCodeButton token={gem.publicToken} name={gem.name} />}
          <DeleteGemButton id={gem.id} />
          <Badge variant={gem.isPublic ? "violet" : "outline"}>
            {gem.isPublic ? (
              <><Globe size={11} className="mr-1" />Public</>
            ) : (
              <><Lock size={11} className="mr-1" />Private</>
            )}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Left column — photos + map + scan link */}
        <div className="flex flex-col gap-3">
          <PhotoGallery photos={gem.photos} name={gem.name} entityId={gem.id} type="gem" />
          {gem.originCountry && (
            <MiniOriginMapWrapper country={gem.originCountry} />
          )}
          {gem.publicToken && <ScanLinkCard token={gem.publicToken} />}
        </div>

        {/* Right column — property cards */}
        <div className="flex flex-col gap-3">
          <Card hoverable>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
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
                {gem.originId && gem.originCountry ? (
                  <>
                    <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Origin</dt>
                    <dd className="font-medium text-zinc-800">
                      <Link
                        href={`/dashboard/origins/${gem.originId}`}
                        className="text-zinc-700 hover:text-violet-600 hover:underline underline-offset-2 transition-colors"
                      >
                        {gem.originCountry}
                        <ExternalLink size={11} className="inline ml-1 opacity-50" />
                      </Link>
                    </dd>
                  </>
                ) : (
                  <Detail label="Origin" value={gem.originCountry} />
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
                  value={gem.purchasePrice != null ? `$${gem.purchasePrice.toFixed(2)}` : null}
                  hint={gem.purchasePrice != null ? "Also recorded in your purchase order if acquired via one." : undefined}
                />
                <Detail
                  label="Acquired on"
                  value={gem.acquiredAt ? new Date(gem.acquiredAt).toLocaleDateString() : null}
                />
                <Detail
                  label="Added"
                  value={new Date(gem.createdAt).toLocaleDateString()}
                />
                {gem.sourceParcelId && (
                  <>
                    <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide flex items-center gap-1">
                      <Package size={10} />
                      Split from parcel
                    </dt>
                    <dd className="font-medium text-zinc-800">
                      <Link
                        href={`/dashboard/parcels/${gem.sourceParcelId}`}
                        className="text-zinc-700 hover:text-violet-600 hover:underline underline-offset-2 transition-colors"
                      >
                        {gem.sourceParcelName ?? "View parcel"}
                        <ExternalLink size={11} className="inline ml-1 opacity-50" />
                      </Link>
                    </dd>
                  </>
                )}
              </dl>
              {gem.notes && (
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed">{gem.notes}</p>
              )}
            </CardContent>
          </Card>

          {gem.soldInfo && (
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
                  <dd className="font-medium">{new Date(gem.soldInfo.saleDate).toLocaleDateString()}</dd>
                  <dt className="text-amber-600/80">Sale price</dt>
                  <dd className="font-semibold">
                    {gem.soldInfo.salePrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </dd>
                  {gem.purchasePrice != null && gem.soldInfo.salePrice > 0 && (
                    <>
                      <dt className="text-amber-600/80">Profit</dt>
                      <dd className={`font-semibold ${gem.soldInfo.salePrice - gem.purchasePrice >= 0 ? "text-green-700" : "text-red-700"}`}>
                        {(gem.soldInfo.salePrice - gem.purchasePrice).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </dd>
                    </>
                  )}
                </dl>
                <div className="mt-3">
                  <Link
                    href={`/dashboard/sales/${gem.soldInfo.saleId}`}
                    className="text-xs font-medium text-amber-700 hover:underline"
                  >
                    View full sale record →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <FacetingSpecsCard gem={gem} />
          <CutPlanCard gem={gem} />
          <CuttingJournalCard gem={gem} />
          <CertificateManager gemId={gem.id} certificates={gem.certificates} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, hint }: { label: string; value: string | null | undefined; hint?: string }) {
  if (!value) return null;
  return (
    <>
      <dt className="text-zinc-400 text-xs font-medium uppercase tracking-wide">{label}</dt>
      <dd className="font-medium text-zinc-800">
        {value}
        {hint && <span className="ml-1 text-[10px] font-normal text-zinc-400" title={hint}>ⓘ</span>}
      </dd>
    </>
  );
}
