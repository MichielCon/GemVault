import Link from "next/link";
import Image from "next/image";
import { gemsApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Gem } from "lucide-react";
import type { GemSummaryDto } from "@/lib/types";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function GemsPage({ searchParams }: Props) {
  const { page: pageStr, search } = await searchParams;
  const page = Number(pageStr ?? 1);

  let result;
  try {
    result = await gemsApi.list(page, 20, search);
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <Header />
        <p className="text-muted-foreground">Failed to load gems. Is the API running?</p>
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
            {result.items.map((gem) => (
              <GemCard key={gem.id} gem={gem} />
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
        <h1 className="text-2xl font-bold tracking-tight">Gems</h1>
        <p className="text-sm text-muted-foreground">Your individual gemstone inventory</p>
      </div>
      <Button asChild size="sm">
        <Link href="/dashboard/gems/new">
          <Plus size={16} />
          Add gem
        </Link>
      </Button>
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
      {/* Photo */}
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

      {/* Info */}
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <Gem size={48} strokeWidth={1} className="mb-4 text-muted-foreground" />
      <p className="font-medium">No gems yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Add your first gem to start building your inventory.
      </p>
      <Button asChild size="sm" className="mt-4">
        <Link href="/dashboard/gems/new">
          <Plus size={16} />
          Add gem
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
    return `/dashboard/gems?${q}`;
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
