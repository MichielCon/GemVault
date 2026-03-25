"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Trash2, Plus, X, Check, ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";
import { createVocabularyItem, updateVocabularyItem, deleteVocabularyItemById } from "@/lib/vocabulary-actions";
import type { VocabularyAdminDto } from "@/lib/types";

interface Props {
  activeTab: string;
  fields: string[];
  items: VocabularyAdminDto[];
  speciesOptions: string[];
}

type SortKey = "value" | "parentValue" | "sortOrder";
type SortDir = "asc" | "desc";

// ─── Sort icon ─────────────────────────────────────────────────────────────────

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-slate-300" />;
  return sortDir === "asc"
    ? <ChevronUp size={13} className="text-violet-500" />
    : <ChevronDown size={13} className="text-violet-500" />;
}

function SortableHeader({
  label, col, sortKey, sortDir, onSort,
}: {
  label: string; col: SortKey; sortKey: SortKey; sortDir: SortDir; onSort: (c: SortKey) => void;
}) {
  return (
    <th
      className="cursor-pointer select-none px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600"
      onClick={() => onSort(col)}
    >
      <span className="flex items-center gap-1">
        {label}
        <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
      </span>
    </th>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vocab-modal-title"
      onClick={onClose}
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 id="vocab-modal-title" className="text-base font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Add form ─────────────────────────────────────────────────────────────────

function AddForm({ field, speciesOptions, onClose }: { field: string; speciesOptions: string[]; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createVocabularyItem, { item: null, error: null });

  useEffect(() => {
    if (state.item) { onClose(); router.refresh(); }
  }, [state.item, onClose, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="field" value={field} />
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Value <span className="text-red-500">*</span></label>
        <input name="value" required maxLength={100} autoFocus
          placeholder={`e.g. ${field === "species" ? "Corundum" : field === "color" ? "Blue" : "…"}`}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200" />
      </div>
      {field === "variety" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Parent Species <span className="text-red-500">*</span></label>
          <select name="parentValue" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200">
            <option value="">— select species —</option>
            {speciesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Sort Order</label>
        <input name="sortOrder" type="number" defaultValue={0}
          className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200" />
      </div>
      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={pending} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50">
          <Plus size={14} />{pending ? "Adding…" : "Add entry"}
        </button>
      </div>
    </form>
  );
}

// ─── Edit form ────────────────────────────────────────────────────────────────

function EditForm({ item, speciesOptions, onClose }: { item: VocabularyAdminDto; speciesOptions: string[]; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateVocabularyItem, { item: null, error: null });

  useEffect(() => {
    if (state.item) { onClose(); router.refresh(); }
  }, [state.item, onClose, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={item.id} />
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Value <span className="text-red-500">*</span></label>
        <input name="value" required maxLength={100} autoFocus defaultValue={item.value}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200" />
      </div>
      {item.field === "variety" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Parent Species <span className="text-red-500">*</span></label>
          <select name="parentValue" required defaultValue={item.parentValue ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200">
            <option value="">— select species —</option>
            {speciesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Sort Order</label>
        <input name="sortOrder" type="number" defaultValue={item.sortOrder}
          className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200" />
      </div>
      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={pending} className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
          <Check size={14} />{pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Delete button ─────────────────────────────────────────────────────────────

function DeleteButton({ item, onDeleteRequest }: { item: VocabularyAdminDto; onDeleteRequest: (item: VocabularyAdminDto) => void }) {
  return (
    <button
      type="button"
      onClick={() => onDeleteRequest(item)}
      title="Delete"
      aria-label={`Delete ${item.value}`}
      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 size={14} />
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function VocabularyAdminTable({ activeTab, fields, items, speciesOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<VocabularyAdminDto | null>(null);
  const [deleteItem, setDeleteItem] = useState<VocabularyAdminDto | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("sortOrder");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleDeleteRequest(item: VocabularyAdminDto) {
    setDeleteError(null);
    setDeleteItem(item);
  }

  function confirmDelete() {
    if (!deleteItem) return;
    const id = deleteItem.id;
    setDeleteItem(null);
    startTransition(async () => {
      const result = await deleteVocabularyItemById(id);
      if (result.error) { setDeleteError(result.error); return; }
      router.refresh();
    });
  }

  function switchTab(field: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", field);
    router.push(`?${params.toString()}`);
    setShowAdd(false);
    setEditingItem(null);
    setSearch("");
    setSortKey("sortOrder");
    setSortDir("asc");
  }

  function handleSort(col: SortKey) {
    if (col === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(col); setSortDir("asc"); }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) =>
      !q ||
      i.value.toLowerCase().includes(q) ||
      (i.parentValue?.toLowerCase().includes(q) ?? false)
    );
  }, [items, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number = sortKey === "sortOrder" ? a.sortOrder : (a[sortKey] ?? "");
      let bv: string | number = sortKey === "sortOrder" ? b.sortOrder : (b[sortKey] ?? "");
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  return (
    <>
      {showAdd && (
        <Modal title={`Add ${activeTab} entry`} onClose={() => setShowAdd(false)}>
          <AddForm field={activeTab} speciesOptions={speciesOptions} onClose={() => setShowAdd(false)} />
        </Modal>
      )}
      {editingItem && (
        <Modal title={`Edit "${editingItem.value}"`} onClose={() => setEditingItem(null)}>
          <EditForm item={editingItem} speciesOptions={speciesOptions} onClose={() => setEditingItem(null)} />
        </Modal>
      )}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true" aria-labelledby="delete-vocab-title">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl p-6">
            <h2 id="delete-vocab-title" className="text-base font-semibold text-slate-900 mb-2">Delete entry</h2>
            <p className="text-sm text-slate-600 mb-5">
              Delete &ldquo;{deleteItem.value}&rdquo;? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteItem(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} disabled={isPending} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                {isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b border-slate-200">
        {fields.map((f) => (
          <button key={f} onClick={() => switchTab(f)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              f === activeTab ? "border-b-2 border-violet-600 text-violet-700" : "text-slate-500 hover:text-slate-800"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {deleteError && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{deleteError}</p>
      )}

      {/* Search + Add */}
      <div className="mb-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}s…`}
            className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
        {search && (
          <span className="text-xs text-slate-400">
            {sorted.length} of {items.length}
          </span>
        )}
        <div className="ml-auto">
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
            <Plus size={14} />Add entry
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-400">No entries yet for <span className="font-medium">{activeTab}</span>.</p>
            <button onClick={() => setShowAdd(true)} className="mt-3 text-sm font-medium text-violet-600 hover:underline">
              Add the first one →
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-400">No results for &ldquo;{search}&rdquo;.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <SortableHeader label="Value" col="value" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                {activeTab === "variety" && (
                  <SortableHeader label="Parent Species" col="parentValue" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                )}
                <SortableHeader label="Sort" col="sortOrder" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">ID</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.value}</td>
                  {activeTab === "variety" && (
                    <td className="px-4 py-3 text-sm text-slate-500">{item.parentValue ?? "—"}</td>
                  )}
                  <td className="px-4 py-3 text-sm text-slate-400">{item.sortOrder}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{item.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => setEditingItem(item)} title="Edit" aria-label={`Edit ${item.value}`}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <Pencil size={14} />
                      </button>
                      <DeleteButton item={item} onDeleteRequest={handleDeleteRequest} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
