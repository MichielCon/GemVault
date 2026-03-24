import Link from "next/link";
import { originsApi } from "@/lib/api";
import { MapClientWrapper } from "@/components/map/map-client-wrapper";
import type { OriginMapDto } from "@/lib/types";
import { MapPin, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MapPage() {
  let origins: OriginMapDto[] = [];
  try {
    origins = await originsApi.mapData();
  } catch {
    // show empty state
  }

  if (origins.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50">
            <MapPin size={28} strokeWidth={1} className="text-zinc-400" />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">No provenance data yet</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Your provenance map will appear here once you add gems with origins.
            </p>
          </div>
          <Button asChild size="sm" variant="violet">
            <Link href="/dashboard/gems/new"><Gem size={14} />Add a gem</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <MapClientWrapper origins={origins} />
    </div>
  );
}
