import Link from "next/link";
import { originsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Plus, MapPin } from "lucide-react";
import type { OriginDto } from "@/lib/types";

interface Props {
  searchParams: Promise<{ search?: string }>;
}

export default async function OriginsPage({ searchParams }: Props) {
  const { search } = await searchParams;

  let origins: OriginDto[];
  try {
    origins = await originsApi.list(search);
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <Header />
        <p className="text-muted-foreground">Failed to load origins. Is the API running?</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 mb-5">
        <Header />
      </div>

      <div className="shrink-0 mb-4 flex items-center gap-2">
        <SearchInput basePath="/dashboard/origins" placeholder="Search origins…" defaultValue={search} />
        <Button asChild size="sm" variant="violet" className="ml-auto shrink-0">
          <Link href="/dashboard/origins/new">
            <Plus size={16} />
            Add origin
          </Link>
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {origins.length === 0 ? (
          <EmptyState hasSearch={!!search} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Country</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Mine</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Region</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Gems</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {origins.map((origin) => (
                  <OriginRow key={origin.id} origin={origin} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Origins</h1>
      <p className="text-sm text-muted-foreground">Mine and locality records</p>
    </div>
  );
}

function OriginRow({ origin }: { origin: OriginDto }) {
  const added = new Date(origin.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const total = origin.gemCount + origin.parcelCount;
  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="px-4 py-3 font-medium">
        <Link href={`/dashboard/origins/${origin.id}`} className="hover:underline">
          {origin.country}
        </Link>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{origin.mine ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{origin.region ?? "—"}</td>
      <td className="px-4 py-3">
        {total > 0 ? (
          <Link href={`/dashboard/origins/${origin.id}`} className="text-violet-600 hover:underline text-xs">
            {origin.gemCount > 0 && `${origin.gemCount} gem${origin.gemCount !== 1 ? "s" : ""}`}
            {origin.gemCount > 0 && origin.parcelCount > 0 && ", "}
            {origin.parcelCount > 0 && `${origin.parcelCount} parcel${origin.parcelCount !== 1 ? "s" : ""}`}
          </Link>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground">{added}</td>
    </tr>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white py-16 text-center">
      <MapPin size={48} strokeWidth={1} className="mb-4 text-zinc-300" />
      <p className="font-medium">{hasSearch ? "No results" : "No origins yet"}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasSearch ? "Try a different search term." : "Add mine and locality records to link gems to their source."}
      </p>
      {!hasSearch && (
        <Button asChild size="sm" variant="violet" className="mt-4">
          <Link href="/dashboard/origins/new">
            <Plus size={16} />
            Add origin
          </Link>
        </Button>
      )}
    </div>
  );
}
