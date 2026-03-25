"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useCallback } from "react";
import type { PagedResult, AdminUserDto } from "@/lib/types";
import {
  changeUserRole,
  deactivateUser,
  reactivateUser,
  revokeUserSessions,
} from "@/lib/admin-actions";

interface Props {
  result: PagedResult<AdminUserDto>;
  currentPage: number;
  search: string;
  role: string;
  status: string;
}

function RoleBadge({ role }: { role: string }) {
  const cls =
    role === "Admin"
      ? "bg-violet-100 text-violet-700"
      : role === "Business"
      ? "bg-blue-100 text-blue-700"
      : "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {role}
    </span>
  );
}

function StatusBadge({ isDeleted }: { isDeleted: boolean }) {
  return isDeleted ? (
    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
      Inactive
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
      Active
    </span>
  );
}

function UserRow({ user }: { user: AdminUserDto }) {
  const router = useRouter();

  const [roleState, roleAction] = useActionState(changeUserRole, { error: null });
  const [deactivateState, deactivateAction] = useActionState(deactivateUser, { error: null });
  const [reactivateState, reactivateAction] = useActionState(reactivateUser, { error: null });
  const [revokeState, revokeAction] = useActionState(revokeUserSessions, { error: null });

  const prevRoleRef = useRef(roleState);
  const prevDeactivateRef = useRef(deactivateState);
  const prevReactivateRef = useRef(reactivateState);
  const prevRevokeRef = useRef(revokeState);

  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  useEffect(() => {
    if (prevRoleRef.current !== roleState && roleState.error === null) router.refresh();
    prevRoleRef.current = roleState;
  }, [roleState, router]);

  useEffect(() => {
    if (prevDeactivateRef.current !== deactivateState && deactivateState.error === null) router.refresh();
    prevDeactivateRef.current = deactivateState;
  }, [deactivateState, router]);

  useEffect(() => {
    if (prevReactivateRef.current !== reactivateState && reactivateState.error === null) router.refresh();
    prevReactivateRef.current = reactivateState;
  }, [reactivateState, router]);

  useEffect(() => {
    if (prevRevokeRef.current !== revokeState && revokeState.error === null) router.refresh();
    prevRevokeRef.current = revokeState;
  }, [revokeState, router]);

  const error =
    roleState.error ?? deactivateState.error ?? reactivateState.error ?? revokeState.error;

  const contentSearch = encodeURIComponent(user.email);

  return (
    <>
      <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
        <td className="px-4 py-3 text-sm text-slate-700">{user.email}</td>
        <td className="px-4 py-3">
          <RoleBadge role={user.role} />
        </td>
        <td className="px-4 py-3">
          <StatusBadge isDeleted={user.isDeleted} />
        </td>
        <td className="px-4 py-3 text-sm">
          {user.gemCount > 0 ? (
            <Link
              href={`/dashboard/admin/content?tab=photos&search=${contentSearch}`}
              className="text-violet-600 hover:underline"
            >
              {user.gemCount}
            </Link>
          ) : (
            <span className="text-slate-400">0</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm">
          {user.parcelCount > 0 ? (
            <Link
              href={`/dashboard/admin/content?tab=photos&search=${contentSearch}`}
              className="text-violet-600 hover:underline"
            >
              {user.parcelCount}
            </Link>
          ) : (
            <span className="text-slate-400">0</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-slate-400">
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Change role */}
            {user.role !== "Admin" && (
              <form action={roleAction} className="flex items-center gap-1">
                <input type="hidden" name="userId" value={user.id} />
                <select
                  name="role"
                  defaultValue={user.role}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-400"
                >
                  <option value="Business">Business</option>
                  <option value="Collector">Collector</option>
                </select>
                <button
                  type="submit"
                  className="rounded bg-violet-600 px-2 py-1 text-xs font-medium text-white hover:bg-violet-700"
                >
                  Set
                </button>
              </form>
            )}

            {/* Deactivate / Reactivate */}
            {!user.isDeleted ? (
              confirmDeactivate ? (
                <div className="flex items-center gap-1">
                  <form action={deactivateAction} onSubmit={() => setConfirmDeactivate(false)}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Confirm
                    </button>
                  </form>
                  <button
                    onClick={() => setConfirmDeactivate(false)}
                    className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeactivate(true)}
                  className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200"
                >
                  Deactivate
                </button>
              )
            ) : (
              <form action={reactivateAction}>
                <input type="hidden" name="userId" value={user.id} />
                <button
                  type="submit"
                  className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                >
                  Reactivate
                </button>
              </form>
            )}

            {/* Revoke sessions */}
            {confirmRevoke ? (
              <div className="flex items-center gap-1">
                <form action={revokeAction} onSubmit={() => setConfirmRevoke(false)}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    className="rounded bg-orange-600 px-2 py-1 text-xs font-medium text-white hover:bg-orange-700"
                  >
                    Confirm
                  </button>
                </form>
                <button
                  onClick={() => setConfirmRevoke(false)}
                  className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmRevoke(true)}
                className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                Revoke Sessions
              </button>
            )}
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </td>
      </tr>
    </>
  );
}

export default function UserAdminTable({ result, currentPage, search, role, status }: Props) {
  const router = useRouter();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams();
    if (search && key !== "search") params.set("search", search);
    if (role && key !== "role") params.set("role", role);
    if (status && key !== "status") params.set("status", status);
    if (value) params.set(key, value);
    router.push(`/dashboard/admin/users?${params.toString()}`);
  }

  const handleSearchChange = useCallback((value: string) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => updateParam("search", value), 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, status]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search email…"
          defaultValue={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        <select
          defaultValue={role}
          onChange={(e) => updateParam("role", e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="">All Roles</option>
          <option value="Business">Business</option>
          <option value="Collector">Collector</option>
        </select>
        <select
          defaultValue={status}
          onChange={(e) => updateParam("status", e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className="ml-auto text-sm text-slate-400">{result.totalCount} user{result.totalCount !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Gems</th>
              <th className="px-4 py-3">Parcels</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
            {result.items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
