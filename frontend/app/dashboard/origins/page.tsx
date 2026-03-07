import Link from "next/link";
import { originsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import type { OriginDto } from "@/lib/types";

export default async function OriginsPage() {
  let origins: OriginDto[];
  try {
    origins = await originsApi.list();
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <Header />
        <p className="text-muted-foreground">Failed to load origins. Is the API running?</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Header />

      {origins.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Mine</th>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {origins.map((origin, i) => (
                <OriginRow key={origin.id} origin={origin} even={i % 2 === 0} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Origins</h1>
        <p className="text-sm text-muted-foreground">Mine and locality records</p>
      </div>
      <Button asChild size="sm">
        <Link href="/dashboard/origins/new">
          <Plus size={16} />
          Add origin
        </Link>
      </Button>
    </div>
  );
}

function OriginRow({ origin, even }: { origin: OriginDto; even: boolean }) {
  const added = new Date(origin.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <tr className={even ? "bg-card hover:bg-muted/30" : "bg-muted/20 hover:bg-muted/40"}>
      <td className="px-4 py-3 font-medium">
        <Link href={`/dashboard/origins/${origin.id}`} className="hover:underline">
          {origin.country}
        </Link>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{origin.mine ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{origin.region ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{added}</td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <MapPin size={48} strokeWidth={1} className="mb-4 text-muted-foreground" />
      <p className="font-medium">No origins yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Add mine and locality records to link gems to their source.
      </p>
      <Button asChild size="sm" className="mt-4">
        <Link href="/dashboard/origins/new">
          <Plus size={16} />
          Add origin
        </Link>
      </Button>
    </div>
  );
}
