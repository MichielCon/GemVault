"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, List, Plus, Gem, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GemSummaryDto, PagedResult } from "@/lib/types";
import { proxyPhotoUrl } from "@/lib/utils";

const STORAGE_KEY = "gem-view";
const STATUS_OPTIONS = ["All", "InStock", "Sold"] as const;
type Status = (typeof STATUS_OPTIONS)[number];

interface Props {
  result: PagedResult<GemSummaryDto>;
  page: number;
  search?: string;
  status?: string;
}

function paginationUrl(p: number, search?: string, status?: string) {
  const q = new URLSearchParams({ page: String(p) });
  if (search) q.set("search", search);
  if (status && status !== "All") q.set("status", status);
  return `/dashboard/gems?${q}`;
}

export function GemInventoryView({ result, page, search, status }: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const activeStatus: Status = (STATUS_OPTIONS.includes(status as Status) ? status : "All") as Status;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "list" || saved === "grid") setView(saved);
  }, []);

  function toggle(v: "grid" | "list") {
    setView(v);
    localStorage.setItem(STORAGE_KEY, v);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    const q = new URLSearchParams({ page: "1" });
    if (value) q.set("search", value);
    if (activeStatus !== "All") q.set("status", activeStatus);
    router.push(`/dashboard/gems?${q}`);
  }

  function clearSearch() {
    const q = new URLSearchParams({ page: "1" });
    if (activeStatus !== "All") q.set("status", activeStatus);
    router.push(`/dashboard/gems?${q}`);
  }

  function handleStatus(s: Status) {
    const q = new URLSearchParams({ page: "1" });
    if (search) q.set("search", search);
    if (s !== "All") q.set("status", s);
    router.push(`/dashboard/gems?${q}`);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Gems</h1>
          <p className="text-sm text-muted-foreground">Individual gemstone inventory</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/gems/new">
            <Plus size={15} />
            Add gem
          </Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            defaultValue={search ?? ""}
            placeholder="Search gems…"
            className="w-full rounded-md border bg-card pl-8 pr-8 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          {search && (
            <button type="button" onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={13} />
            </button>
          )}
        </form>

        {/* Status filter */}
        <div className="flex rounded-md border bg-card overflow-hidden">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeStatus === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {s === "InStock" ? "In Stock" : s}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex rounded-md border bg-card overflow-hidden">
          <button
            onClick={() => toggle("grid")}
            className={`flex items-center px-2.5 py-1.5 text-sm transition-colors ${
              view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => toggle("list")}
            className={`flex items-center px-2.5 py-1.5 text-sm transition-colors ${
              view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="List view"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {result.items.length === 0 ? (
        <EmptyState />
      ) : view === "grid" ? (
        <GridView gems={result.items} />
      ) : (
        <ListView gems={result.items} />
      )}

      <Pagination page={page} totalPages={result.totalPages} search={search} status={status} />
    </div>
  );
}

function GridView({ gems }: { gems: GemSummaryDto[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {gems.map((gem) => (
        <GemCard key={gem.id} gem={gem} />
      ))}
    </div>
  );
}

function GemCard({ gem }: { gem: GemSummaryDto }) {
  const subtitle = [gem.species, gem.variety, gem.color].filter(Boolean).join(" · ") || "Unknown species";
  return (
    <Link
      href={`/dashboard/gems/${gem.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        {gem.coverPhotoUrl ? (
          <Image
            src={proxyPhotoUrl(gem.coverPhotoUrl) ?? ""}
            alt={gem.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/40">
            <Gem size={32} strokeWidth={1} />
          </div>
        )}
        <div className="absolute right-1.5 top-1.5 flex flex-col gap-1">
          {gem.isSold && (
            <Badge className="text-[10px] px-1.5 py-0 bg-amber-500 text-white border-0 shadow-sm">Sold</Badge>
          )}
          {gem.isPublic && (
            <Badge className="text-[10px] px-1.5 py-0 bg-white/90 text-slate-700 border-0 shadow-sm">Public</Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5 p-2.5">
        <p className="truncate text-sm font-medium leading-snug">{gem.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
        {gem.weightCarats && (
          <p className="text-[11px] font-medium text-muted-foreground">{gem.weightCarats} ct</p>
        )}
      </div>
    </Link>
  );
}

function ListView({ gems }: { gems: GemSummaryDto[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-left">
            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Gem</th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Species / Variety</th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Color</th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Weight</th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground hidden lg:table-cell">Added</th>
            <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {gems.map((gem) => (
            <GemRow key={gem.id} gem={gem} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GemRow({ gem }: { gem: GemSummaryDto }) {
  const speciesLabel = [gem.species, gem.variety].filter(Boolean).join(" — ") || "—";
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-4 py-2.5">
        <Link href={`/dashboard/gems/${gem.id}`} className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
            {gem.coverPhotoUrl ? (
              <Image
                src={proxyPhotoUrl(gem.coverPhotoUrl) ?? ""}
                alt={gem.name}
                fill
                unoptimized
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground/40">
                <Gem size={16} strokeWidth={1} />
              </div>
            )}
          </div>
          <span className="font-medium hover:underline">{gem.name}</span>
        </Link>
      </td>
      <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{speciesLabel}</td>
      <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">{gem.color ?? "—"}</td>
      <td className="px-4 py-2.5 text-muted-foreground">
        {gem.weightCarats ? `${gem.weightCarats} ct` : "—"}
      </td>
      <td className="px-4 py-2.5 text-muted-foreground hidden lg:table-cell">
        {new Date(gem.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-2.5">
        {gem.isSold ? (
          <Badge className="text-[10px] px-1.5 py-0 bg-amber-500 text-white border-0">Sold</Badge>
        ) : gem.isPublic ? (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Public</Badge>
        ) : null}
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-20 text-center">
      <Gem size={40} strokeWidth={1} className="mb-3 text-muted-foreground/50" />
      <p className="font-medium">No gems yet</p>
      <p className="mt-1 text-sm text-muted-foreground">Add your first gem to start building your inventory.</p>
      <Button asChild size="sm" className="mt-4">
        <Link href="/dashboard/gems/new"><Plus size={15} />Add gem</Link>
      </Button>
    </div>
  );
}

function Pagination({ page, totalPages, search, status }: { page: number; totalPages: number; search?: string; status?: string }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <Button asChild variant="outline" size="sm" disabled={page <= 1}>
        <Link href={paginationUrl(page - 1, search, status)}>Previous</Link>
      </Button>
      <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
      <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
        <Link href={paginationUrl(page + 1, search, status)}>Next</Link>
      </Button>
    </div>
  );
}
