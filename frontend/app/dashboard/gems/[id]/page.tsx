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
import { ArrowLeft, Globe, Lock } from "lucide-react";
import type { GemDto } from "@/lib/types";

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
    <div className="flex flex-col gap-6 max-w-4xl">
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
          <h1 className="text-3xl font-bold tracking-tight">{gem.name}</h1>
          {(gem.species || gem.variety) && (
            <p className="mt-1 text-muted-foreground">
              {[gem.species, gem.variety].filter(Boolean).join(" — ")}
            </p>
          )}
        </div>
        <Badge variant={gem.isPublic ? "default" : "outline"} className="shrink-0">
          {gem.isPublic ? (
            <><Globe size={12} className="mr-1" />Public</>
          ) : (
            <><Lock size={12} className="mr-1" />Private</>
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Photos */}
        <div className="flex flex-col gap-3">
          {coverPhoto ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={coverPhoto.url}
                alt={gem.name}
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

          {gem.publicToken && (
            <Card>
              <CardHeader><CardTitle className="text-base">Public link</CardTitle></CardHeader>
              <CardContent>
                <p className="break-all font-mono text-xs text-muted-foreground">
                  /scan/{gem.publicToken}
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
