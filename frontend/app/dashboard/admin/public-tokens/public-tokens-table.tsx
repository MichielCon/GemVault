"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import type { PagedResult, AdminPublicTokenDto } from "@/lib/types";
import { togglePublicToken } from "@/lib/admin-actions";

interface Props {
  result: PagedResult<AdminPublicTokenDto>;
  currentPage: number;
  currentFilter: string;
}

function TokenRow({ token }: { token: AdminPublicTokenDto }) {
  const router = useRouter();
  const [state, action] = useActionState(togglePublicToken, { token: null, error: null });
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (prevStateRef.current !== state && state.error === null && state.token !== null) {
      router.refresh();
    }
    prevStateRef.current = state;
  }, [state, router]);

  const linkedRecord = token.gemName ?? token.gemParcelName ?? "(unknown)";
  const recordType = token.gemId ? "Gem" : "Parcel";

  return (
    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
      <td className="px-4 py-3 font-mono text-xs text-slate-500">{token.token.slice(0, 12)}…</td>
      <td className="px-4 py-3 text-sm text-slate-700">
        <span className="text-xs text-slate-400">{recordType}: </span>
        {linkedRecord}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500">{token.ownerEmail}</td>
      <td className="px-4 py-3">
        {token.isActive ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            Inactive
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-slate-400">{new Date(token.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <form action={action}>
          <input type="hidden" name="tokenId" value={token.id} />
          <button
            type="submit"
            className={`rounded px-2 py-1 text-xs font-medium ${
              token.isActive
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {token.isActive ? "Disable" : "Enable"}
          </button>
        </form>
        {state.error && <p className="mt-1 text-xs text-red-500">{state.error}</p>}
      </td>
    </tr>
  );
}

export default function PublicTokensTable({ result, currentPage, currentFilter }: Props) {
  const router = useRouter();

  function setFilter(f: string) {
    router.push(`/dashboard/admin/public-tokens?filter=${f}`);
  }

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex items-center gap-2">
        {(["all", "active", "inactive"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              currentFilter === f
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-400">{result.totalCount} token{result.totalCount !== 1 ? "s" : ""}</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">Linked Record</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((token) => (
              <TokenRow key={token.id} token={token} />
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No public tokens found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Page {result.page} of {result.totalPages}</span>
          <div className="flex gap-2">
            {result.hasPreviousPage && (
              <button
                onClick={() => router.push(`/dashboard/admin/public-tokens?filter=${currentFilter}&page=${currentPage - 1}`)}
                className="rounded border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50"
              >
                Previous
              </button>
            )}
            {result.hasNextPage && (
              <button
                onClick={() => router.push(`/dashboard/admin/public-tokens?filter=${currentFilter}&page=${currentPage + 1}`)}
                className="rounded border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
