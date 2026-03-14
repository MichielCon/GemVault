"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import type { PagedResult, AdminSessionDto } from "@/lib/types";
import { revokeSession } from "@/lib/admin-actions";

interface Props {
  result: PagedResult<AdminSessionDto>;
  currentPage: number;
  search: string;
}

function SessionRow({ session }: { session: AdminSessionDto }) {
  const router = useRouter();
  const [state, action] = useActionState(revokeSession, { error: null });
  const prevStateRef = useRef(state);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (prevStateRef.current !== state && state.error === null) {
      router.refresh();
    }
    prevStateRef.current = state;
  }, [state, router]);

  return (
    <tr className={`border-b border-slate-50 last:border-0 ${session.isExpired ? "opacity-50" : "hover:bg-slate-50"}`}>
      <td className="px-4 py-3 text-sm text-slate-700">{session.userEmail}</td>
      <td className="px-4 py-3 text-sm text-slate-400">{new Date(session.createdAt).toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-slate-400">{new Date(session.expiresAt).toLocaleString()}</td>
      <td className="px-4 py-3">
        {session.isExpired ? (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            Expired
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        )}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-slate-400">{session.tokenHashMasked}</td>
      <td className="px-4 py-3">
        {!session.isExpired && (
          confirming ? (
            <div className="flex items-center gap-1">
              <form action={action} onSubmit={() => setConfirming(false)}>
                <input type="hidden" name="sessionId" value={session.id} />
                <button
                  type="submit"
                  className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </form>
              <button
                onClick={() => setConfirming(false)}
                className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200"
            >
              Revoke
            </button>
          )
        )}
        {state.error && <p className="mt-1 text-xs text-red-500">{state.error}</p>}
      </td>
    </tr>
  );
}

export default function SessionsTable({ result, currentPage, search }: Props) {
  const router = useRouter();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams();
    if (search && key !== "search") params.set("search", search);
    if (value) params.set(key, value);
    router.push(`/dashboard/admin/sessions?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Filter by email…"
          defaultValue={search}
          onChange={(e) => updateParam("search", e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        <span className="ml-auto text-sm text-slate-400">
          {result.totalCount} session{result.totalCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((session) => (
              <SessionRow key={session.id} session={session} />
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  {search ? `No sessions found for "${search}".` : "No active sessions."}
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
                onClick={() => updateParam("page", String(currentPage - 1))}
                className="rounded border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50"
              >
                Previous
              </button>
            )}
            {result.hasNextPage && (
              <button
                onClick={() => updateParam("page", String(currentPage + 1))}
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
