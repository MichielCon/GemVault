"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import type { PagedResult, AdminSessionDto } from "@/lib/types";
import { revokeSessionById, revokeUserSessionsById } from "@/lib/admin-actions";

interface Props {
  result: PagedResult<AdminSessionDto>;
  currentPage: number;
  search: string;
}

function RevokeAllButton({ userId, email, count }: { userId: string; email: string; count: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleRevokeAll() {
    startTransition(async () => {
      const result = await revokeUserSessionsById(userId);
      if (result.error) {
        setError(result.error);
      } else {
        setConfirming(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-zinc-600">
        <span className="font-medium">{email}</span>
        <span className="ml-2 text-zinc-400">— {count} active session{count !== 1 ? "s" : ""}</span>
      </span>
      {confirming ? (
        <div className="flex items-center gap-1">
          <button
            onClick={handleRevokeAll}
            disabled={isPending}
            className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Revoking…" : "Confirm revoke all"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200"
        >
          Revoke all
        </button>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SessionRow({ session }: { session: AdminSessionDto }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleRevoke() {
    startTransition(async () => {
      const result = await revokeSessionById(session.id);
      if (result.error) {
        setError(result.error);
      } else {
        setConfirming(false);
        router.refresh();
      }
    });
  }

  return (
    <tr className={`border-b border-zinc-50 last:border-0 ${session.isExpired ? "opacity-50" : "hover:bg-zinc-50"}`}>
      <td className="px-4 py-3 text-sm text-zinc-700">{session.userEmail}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">{new Date(session.createdAt).toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">{new Date(session.expiresAt).toLocaleString()}</td>
      <td className="px-4 py-3">
        {session.isExpired ? (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
            Expired
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        )}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-zinc-400">{session.tokenHashMasked}</td>
      <td className="px-4 py-3">
        {!session.isExpired && (
          confirming ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleRevoke}
                disabled={isPending}
                className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Revoking…" : "Confirm"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
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
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </td>
    </tr>
  );
}

export default function SessionsTable({ result, currentPage, search }: Props) {
  const router = useRouter();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams();
    if (search && key !== "search") params.set("search", search);
    if (value) params.set(key, value);
    router.push(`/dashboard/admin/sessions?${params.toString()}`);
  }

  const handleSearchChange = useCallback((value: string) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => updateParam("search", value), 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Group active sessions by user to show "Revoke All" per user
  const userSessionMap = new Map<string, { userId: string; email: string; count: number }>();
  for (const session of result.items) {
    if (!session.isExpired) {
      const existing = userSessionMap.get(session.userId);
      if (existing) {
        existing.count++;
      } else {
        userSessionMap.set(session.userId, { userId: session.userId, email: session.userEmail, count: 1 });
      }
    }
  }
  const usersWithMultipleSessions = Array.from(userSessionMap.values()).filter((u) => u.count > 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Filter by email…"
          defaultValue={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        <span className="ml-auto text-sm text-zinc-400">
          {result.totalCount} session{result.totalCount !== 1 ? "s" : ""}
        </span>
      </div>

      {usersWithMultipleSessions.length > 0 && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-red-400">Users with multiple active sessions</p>
          {usersWithMultipleSessions.map((u) => (
            <RevokeAllButton key={u.userId} userId={u.userId} email={u.email} count={u.count} />
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">
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
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                  {search ? `No sessions found for "${search}".` : "No active sessions."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>Page {result.page} of {result.totalPages}</span>
          <div className="flex gap-2">
            {result.hasPreviousPage && (
              <button
                onClick={() => updateParam("page", String(currentPage - 1))}
                className="rounded border border-zinc-200 bg-white px-3 py-1 hover:bg-zinc-50"
              >
                Previous
              </button>
            )}
            {result.hasNextPage && (
              <button
                onClick={() => updateParam("page", String(currentPage + 1))}
                className="rounded border border-zinc-200 bg-white px-3 py-1 hover:bg-zinc-50"
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
