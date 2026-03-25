"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, List, Plus, Package, Search, X, Filter, ArrowUp, ArrowDown, CheckSquare, Check, Trash2, Download, ChevronDown, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";
import type { GemParcelSummaryDto, PagedResult } from "@/lib/types";
import { proxyPhotoUrl } from "@/lib/utils";
import { bulkDeleteParcels } from "@/lib/parcel-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const STORAGE_KEY = "parcel-view";
const STATUS_OPTIONS = ["All", "InStock", "Sold"] as const;
type Status = (typeof STATUS_OPTIONS)[number];

interface Props {
  result: PagedResult<GemParcelSummaryDto>;
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  species?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortDir?: string;
}

function paginationUrl(
  p: number, pageSize: number, search?: string, status?: string,
  species?: string, color?: string, minPrice?: string, maxPrice?: string,
  sortBy?: string, sortDir?: string,
) {
  const q = new URLSearchParams({ page: String(p), pageSize: String(pageSize) });
  if (search) q.set("search", search);
  if (status && status !== "All") q.set("status", status);
  if (species) q.set("species", species);
  if (color) q.set("color", color);
  if (minPrice) q.set("minPrice", minPrice);
  if (maxPrice) q.set("maxPrice", maxPrice);
  if (sortBy && sortBy !== "date") q.set("sortBy", sortBy);
  if (sortDir && sortDir !== "desc") q.set("sortDir", sortDir);
  return `/dashboard/parcels?${q}`;
}

export function ParcelInventoryView({
  result, page, pageSize, search, status,
  species, color, minPrice, maxPrice, sortBy, sortDir,
}: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const headerRef     = useRef<HTMLDivElement>(null);
  const toolbarRef    = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const pageSizeRef = useRef(pageSize);
  pageSizeRef.current = pageSize;
  const viewLoadedRef = useRef(false);
  const activeStatus: Status = (STATUS_OPTIONS.includes(status as Status) ? status : "All") as Status;

  const hasActiveFilters = !!(species || color || minPrice || maxPrice);
  const activeFilterCount = [species, color, minPrice || maxPrice].filter(Boolean).length;

  const [filtersOpen, setFiltersOpen] = useState(hasActiveFilters);
  const [speciesInput, setSpeciesInput] = useState(species ?? "");
  const [colorInput, setColorInput] = useState(color ?? "");
  const [minPriceInput, setMinPriceInput] = useState(minPrice ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice ?? "");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "list" || saved === "grid") setView(saved);
    viewLoadedRef.current = true;
  }, []);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [result.items]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function calcIdealPageSize(currentView: "grid" | "list"): number {
      const c = containerRef.current;
      if (!c) return pageSizeRef.current;
      const totalH      = c.clientHeight;
      const headerH     = (headerRef.current?.offsetHeight   ?? 52) + 20;
      const toolbarH    = (toolbarRef.current?.offsetHeight  ?? 36) + 16;
      const paginationH = paginationRef.current?.offsetHeight ?? 0;
      const available   = Math.max(0, totalH - headerH - toolbarH - paginationH);

      if (currentView === "list") {
        const THEAD_H = 37;
        const ROW_H   = 61;
        return Math.max(1, Math.floor((available - THEAD_H) / ROW_H));
      } else {
        const W    = c.clientWidth;
        const cols = W >= 1536 ? 6 : W >= 1280 ? 5 : W >= 1024 ? 4 : W >= 640 ? 3 : 2;
        const gap  = 12;
        const cardW = Math.max(1, (W - (cols - 1) * gap) / cols);
        const cardH = cardW * 0.75 + 64;
        const rows  = Math.max(1, Math.floor(available / (cardH + gap)));
        return rows * cols;
      }
    }

    function apply() {
      if (!viewLoadedRef.current) return;
      const ideal = calcIdealPageSize(view);
      if (ideal === pageSizeRef.current) return;
      const q = new URLSearchParams({ page: "1", pageSize: String(ideal) });
      if (search)                 q.set("search", search);
      if (activeStatus !== "All") q.set("status", activeStatus);
      if (species) q.set("species", species);
      if (color) q.set("color", color);
      if (minPrice) q.set("minPrice", minPrice);
      if (maxPrice) q.set("maxPrice", maxPrice);
      if (sortBy && sortBy !== "date") q.set("sortBy", sortBy);
      if (sortDir && sortDir !== "desc") q.set("sortDir", sortDir);
      router.replace(`/dashboard/parcels?${q}`);
    }

    apply();
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(apply, 150);
    });
    ro.observe(container);
    return () => { ro.disconnect(); clearTimeout(resizeTimeout); };
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle(v: "grid" | "list") {
    setView(v);
    localStorage.setItem(STORAGE_KEY, v);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    const q = new URLSearchParams({ page: "1", pageSize: String(pageSize) });
    if (value) q.set("search", value);
    if (activeStatus !== "All") q.set("status", activeStatus);
    if (species) q.set("species", species);
    if (color) q.set("color", color);
    if (minPrice) q.set("minPrice", minPrice);
    if (maxPrice) q.set("maxPrice", maxPrice);
    if (sortBy && sortBy !== "date") q.set("sortBy", sortBy);
    if (sortDir && sortDir !== "desc") q.set("sortDir", sortDir);
    router.push(`/dashboard/parcels?${q}`);
  }

  function clearSearch() {
    const q = new URLSearchParams({ page: "1", pageSize: String(pageSize) });
    if (activeStatus !== "All") q.set("status", activeStatus);
    if (species) q.set("species", species);
    if (color) q.set("color", color);
    if (minPrice) q.set("minPrice", minPrice);
    if (maxPrice) q.set("maxPrice", maxPrice);
    if (sortBy && sortBy !== "date") q.set("sortBy", sortBy);
    if (sortDir && sortDir !== "desc") q.set("sortDir", sortDir);
    router.push(`/dashboard/parcels?${q}`);
  }

  function handleStatus(s: Status) {
    const q = new URLSearchParams({ page: "1", pageSize: String(pageSize) });
    if (search) q.set("search", search);
    if (s !== "All") q.set("status", s);
    if (species) q.set("species", species);
    if (color) q.set("color", color);
    if (minPrice) q.set("minPrice", minPrice);
    if (maxPrice) q.set("maxPrice", maxPrice);
    if (sortBy && sortBy !== "date") q.set("sortBy", sortBy);
    if (sortDir && sortDir !== "desc") q.set("sortDir", sortDir);
    router.push(`/dashboard/parcels?${q}`);
  }

  function handleSort(by: string, dir: string) {
    const q = new URLSearchParams({ page: "1", pageSize: String(pageSize) });
    if (search) q.set("search", search);
    if (activeStatus !== "All") q.set("status", activeStatus);
    if (species) q.set("species", species);
    if (color) q.set("color", color);
    if (minPrice) q.set("minPrice", minPrice);
    if (maxPrice) q.set("maxPrice", maxPrice);
    if (by !== "date") q.set("sortBy", by);
    if (dir !== "desc") q.set("sortDir", dir);
    router.push(`/dashboard/parcels?${q}`);
  }

  function applyFilters() {
    const q = new URLSearchParams({ page: "1", pageSize: String(pageSize) });
    if (inputRef.current?.value.trim()) q.set("search", inputRef.current.value.trim());
    if (activeStatus !== "All") q.set("status", activeStatus);
    if (speciesInput.trim()) q.set("species", speciesInput.trim());
    if (colorInput.trim()) q.set("color", colorInput.trim());
    if (minPriceInput) q.set("minPrice", minPriceInput);
    if (maxPriceInput) q.set("maxPrice", maxPriceInput);
    if (sortBy && sortBy !== "date") q.set("sortBy", sortBy);
    if (sortDir && sortDir !== "desc") q.set("sortDir", sortDir);
    router.push(`/dashboard/parcels?${q}`);
  }

  function clearFilters() {
    setSpeciesInput("");
    setColorInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    const q = new URLSearchParams({ page: "1", pageSize: String(pageSize) });
    if (inputRef.current?.value.trim()) q.set("search", inputRef.current.value.trim());
    if (activeStatus !== "All") q.set("status", activeStatus);
    router.push(`/dashboard/parcels?${q}`);
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === result.items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(result.items.map(p => p.id)));
    }
  }

  async function handleBulkDelete() {
    setBulkDeleting(true);
    setBulkError(null);
    const { error } = await bulkDeleteParcels([...selectedIds]);
    setBulkDeleting(false);
    if (error) { setBulkError(error); return; }
    setSelectedIds(new Set());
    router.refresh();
  }

  return (
    <div ref={containerRef} className="relative flex flex-col" style={{ height: "calc(100vh - 2.5rem)" }}>
      {/* Header */}
      <div ref={headerRef} className="shrink-0 mb-5">
        <h1 className="text-xl font-semibold tracking-tight">Parcels</h1>
        <p className="text-sm text-muted-foreground">Bulk gem lot inventory</p>
      </div>

      {/* Toolbar */}
      <div ref={toolbarRef} className="shrink-0 flex flex-col gap-2 mb-4">
        {/* Row 1: search + status toggle + filters button + sort + view toggle + add */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              defaultValue={search ?? ""}
              placeholder="Search parcels…"
              className="w-full rounded-lg border border-zinc-200 bg-white pl-8 pr-8 py-1.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-violet-500/20 focus:border-zinc-300"
            />
            {search && (
              <button type="button" onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={13} />
              </button>
            )}
          </form>

          {/* Select all */}
          {result.items.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-800 transition-colors"
            >
              <CheckSquare size={13} />
              {selectedIds.size === result.items.length && result.items.length > 0 ? "Deselect all" : "Select all"}
            </button>
          )}

          {/* Status filter */}
          <div className="flex rounded-lg border border-zinc-200 bg-white overflow-hidden">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeStatus === s
                    ? "bg-zinc-900 text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-50"
                }`}
              >
                {s === "InStock" ? "In Stock" : s}
              </button>
            ))}
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setFiltersOpen(v => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              filtersOpen || hasActiveFilters
                ? "border-violet-300 bg-violet-50 text-violet-700"
                : "border-zinc-200 bg-white text-zinc-600 hover:text-zinc-800"
            }`}
          >
            <Filter size={12} />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-violet-600 text-white px-1.5 py-0 text-[10px]">{activeFilterCount}</span>
            )}
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy ?? "date"}
              onChange={(e) => handleSort(e.target.value, sortDir ?? "desc")}
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              <option value="date">Date added</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="weight">Weight</option>
            </select>
            <button
              onClick={() => handleSort(sortBy ?? "date", (sortDir ?? "desc") === "asc" ? "desc" : "asc")}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
              title={(sortDir ?? "desc") === "asc" ? "Ascending" : "Descending"}
            >
              {(sortDir ?? "desc") === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            </button>
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg border border-zinc-200 bg-white overflow-hidden">
            <button
              onClick={() => toggle("grid")}
              className={`flex items-center px-2.5 py-1.5 text-sm transition-colors ${
                view === "grid" ? "bg-zinc-900 text-white" : "text-muted-foreground hover:text-foreground hover:bg-zinc-50"
              }`}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => toggle("list")}
              className={`flex items-center px-2.5 py-1.5 text-sm transition-colors ${
                view === "list" ? "bg-zinc-900 text-white" : "text-muted-foreground hover:text-foreground hover:bg-zinc-50"
              }`}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>

          {/* Add button + Export */}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setExportOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <Download size={14} />
                Export
                <ChevronDown size={12} className="text-zinc-400" />
              </button>
              {exportOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                    <a
                      href="/api/export/parcels"
                      download
                      onClick={() => setExportOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                      <FileText size={13} />
                      CSV
                    </a>
                    <a
                      href="/api/export/parcels-pdf"
                      download
                      onClick={() => setExportOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                      <FileText size={13} />
                      PDF
                    </a>
                  </div>
                </>
              )}
            </div>
            <Button asChild size="sm" variant="violet">
              <Link href="/dashboard/parcels/new"><Plus size={15} />Add parcel</Link>
            </Button>
          </div>
        </div>

        {/* Row 2: Filters panel */}
        {filtersOpen && (
          <div className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5">
            <FilterInput
              label="Species"
              value={speciesInput}
              onChange={setSpeciesInput}
              onClear={() => setSpeciesInput("")}
              placeholder="e.g. Corundum"
            />
            <FilterInput
              label="Color"
              value={colorInput}
              onChange={setColorInput}
              onClear={() => setColorInput("")}
              placeholder="e.g. Blue"
            />
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Price range</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={e => setMinPriceInput(e.target.value)}
                  className="w-20 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                <span className="text-zinc-400 text-xs">–</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={e => setMaxPriceInput(e.target.value)}
                  className="w-20 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>
            <Button type="button" size="sm" variant="violet" onClick={applyFilters}>Apply</Button>
            {hasActiveFilters && (
              <Button type="button" size="sm" variant="ghost" onClick={clearFilters} className="text-zinc-500">Clear all</Button>
            )}
          </div>
        )}
      </div>

      {/* Bulk error */}
      {bulkError && (
        <p className="shrink-0 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{bulkError}</p>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {result.items.length === 0 ? (
          <EmptyState />
        ) : view === "grid" ? (
          <GridView parcels={result.items} selectedIds={selectedIds} onToggle={toggleSelect} />
        ) : (
          <ListView parcels={result.items} selectedIds={selectedIds} onToggle={toggleSelect} />
        )}
      </div>

      {/* Pagination — shrink-0 so it's always pinned at the bottom */}
      <div ref={paginationRef} className="shrink-0 py-4">
        <Pagination
          page={page} totalPages={result.totalPages} pageSize={pageSize}
          search={search} status={status}
          species={species} color={color} minPrice={minPrice} maxPrice={maxPrice}
          sortBy={sortBy} sortDir={sortDir}
        />
      </div>

      {/* Floating bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2.5 shadow-2xl">
          <span className="text-xs font-medium text-zinc-300">{selectedIds.size} selected</span>
          <div className="h-3 w-px bg-zinc-700" />
          <button
            onClick={() => setBulkConfirmOpen(true)}
            disabled={bulkDeleting}
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 size={12} />
            {bulkDeleting ? "Deleting…" : "Delete"}
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <ConfirmDialog
        open={bulkConfirmOpen}
        title={`Delete ${selectedIds.size} parcel${selectedIds.size !== 1 ? "s" : ""}`}
        description="This will permanently delete the selected parcels and their photos. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => { setBulkConfirmOpen(false); handleBulkDelete(); }}
        onCancel={() => setBulkConfirmOpen(false)}
      />
    </div>
  );
}

function GridView({ parcels, selectedIds, onToggle }: { parcels: GemParcelSummaryDto[]; selectedIds: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {parcels.map((parcel) => (
        <ParcelCard key={parcel.id} parcel={parcel} isSelected={selectedIds.has(parcel.id)} onToggle={onToggle} />
      ))}
    </div>
  );
}

function ParcelCard({ parcel, isSelected, onToggle }: { parcel: GemParcelSummaryDto; isSelected: boolean; onToggle: (id: string) => void }) {
  const subtitle = [parcel.species, parcel.variety, parcel.color].filter(Boolean).join(" · ") || "Unknown species";
  return (
    <Link href={`/dashboard/parcels/${parcel.id}`} className="group block">
      <MagicCard className="flex flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        <div className="relative aspect-[4/3] w-full bg-zinc-100">
          {parcel.coverPhotoUrl ? (
            <Image
              src={proxyPhotoUrl(parcel.coverPhotoUrl) ?? ""}
              alt={parcel.name}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-300">
              <Package size={32} strokeWidth={1} />
            </div>
          )}
          {/* Checkbox overlay — top left */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onToggle(parcel.id); }}
            className={`absolute left-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
              isSelected
                ? "border-violet-500 bg-violet-500 text-white"
                : "border-white/70 bg-black/20 text-transparent hover:border-violet-300"
            }`}
          >
            {isSelected && <Check size={11} />}
          </button>
          <div className="absolute right-1.5 top-1.5 flex flex-col gap-1">
            {parcel.isSold && (
              <Badge className="text-[10px] px-1.5 py-0 bg-amber-500 text-white border-0 shadow-sm">Sold</Badge>
            )}
            {parcel.isPublic && (
              <Badge className="text-[10px] px-1.5 py-0 bg-white/90 text-slate-700 border-0 shadow-sm">Public</Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-0.5 p-2.5">
          <p className="truncate text-sm font-medium leading-snug">{parcel.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
          <p className="text-[11px] text-muted-foreground">
            {parcel.quantity} stones{parcel.totalWeightCarats != null && ` · ${parcel.totalWeightCarats} ct`}
          </p>
        </div>
      </MagicCard>
    </Link>
  );
}

function ListView({ parcels, selectedIds, onToggle }: { parcels: GemParcelSummaryDto[]; selectedIds: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
            <th className="px-3 py-2.5 w-8" />
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Parcel</th>
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hidden sm:table-cell">Species / Variety</th>
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hidden md:table-cell">Color</th>
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Qty</th>
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hidden sm:table-cell">Total Weight</th>
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hidden lg:table-cell">Added</th>
            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {parcels.map((parcel) => (
            <ParcelRow key={parcel.id} parcel={parcel} isSelected={selectedIds.has(parcel.id)} onToggle={onToggle} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ParcelRow({ parcel, isSelected, onToggle }: { parcel: GemParcelSummaryDto; isSelected: boolean; onToggle: (id: string) => void }) {
  const speciesLabel = [parcel.species, parcel.variety].filter(Boolean).join(" — ") || "—";
  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="px-3 py-2.5 w-8">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onToggle(parcel.id); }}
          className={`flex h-4 w-4 items-center justify-center rounded border-2 transition-colors ${
            isSelected ? "border-violet-500 bg-violet-500 text-white" : "border-zinc-300 hover:border-violet-400"
          }`}
        >
          {isSelected && <Check size={10} />}
        </button>
      </td>
      <td className="px-4 py-2.5">
        <Link href={`/dashboard/parcels/${parcel.id}`} className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
            {parcel.coverPhotoUrl ? (
              <Image
                src={proxyPhotoUrl(parcel.coverPhotoUrl) ?? ""}
                alt={parcel.name}
                fill
                unoptimized
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-300">
                <Package size={16} strokeWidth={1} />
              </div>
            )}
          </div>
          <span className="font-medium hover:underline">{parcel.name}</span>
        </Link>
      </td>
      <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{speciesLabel}</td>
      <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">{parcel.color ?? "—"}</td>
      <td className="px-4 py-2.5 text-muted-foreground">{parcel.quantity}</td>
      <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">
        {parcel.totalWeightCarats ? `${parcel.totalWeightCarats} ct` : "—"}
      </td>
      <td className="px-4 py-2.5 text-muted-foreground hidden lg:table-cell">
        {new Date(parcel.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-2.5">
        {parcel.isSold ? (
          <Badge className="text-[10px] px-1.5 py-0 bg-amber-500 text-white border-0">Sold</Badge>
        ) : parcel.isPublic ? (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Public</Badge>
        ) : null}
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-200 bg-white py-20 text-center">
      <Package size={40} strokeWidth={1} className="mb-3 text-zinc-300" />
      <p className="font-medium">No parcels yet</p>
      <p className="mt-1 text-sm text-muted-foreground">Add your first parcel to start tracking bulk gem lots.</p>
      <Button asChild size="sm" variant="violet" className="mt-4">
        <Link href="/dashboard/parcels/new"><Plus size={15} />Add parcel</Link>
      </Button>
    </div>
  );
}

function Pagination({
  page, totalPages, pageSize, search, status,
  species, color, minPrice, maxPrice, sortBy, sortDir,
}: {
  page: number; totalPages: number; pageSize: number;
  search?: string; status?: string;
  species?: string; color?: string; minPrice?: string; maxPrice?: string;
  sortBy?: string; sortDir?: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      {page <= 1 ? (
        <Button variant="outline" size="sm" disabled>Previous</Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href={paginationUrl(page - 1, pageSize, search, status, species, color, minPrice, maxPrice, sortBy, sortDir)}>Previous</Link>
        </Button>
      )}
      <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
      {page >= totalPages ? (
        <Button variant="outline" size="sm" disabled>Next</Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href={paginationUrl(page + 1, pageSize, search, status, species, color, minPrice, maxPrice, sortBy, sortDir)}>Next</Link>
        </Button>
      )}
    </div>
  );
}

function FilterInput({
  label, value, onChange, onClear, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-32 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs outline-none focus:ring-2 focus:ring-violet-500/20 pr-6"
        />
        {value && (
          <button type="button" onClick={onClear} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            <X size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
