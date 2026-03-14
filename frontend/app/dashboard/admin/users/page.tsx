import { adminApi } from "@/lib/api";
import UserAdminTable from "./user-admin-table";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search;
  const role = params.role;
  const isDeleted =
    params.status === "inactive" ? true : params.status === "active" ? false : undefined;

  const result = await adminApi.getUsers(page, 20, search, role, isDeleted);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <p className="mt-1 text-sm text-slate-500">Manage roles, status, and sessions</p>
      </div>
      <UserAdminTable
        result={result}
        currentPage={page}
        search={search ?? ""}
        role={role ?? ""}
        status={params.status ?? ""}
      />
    </div>
  );
}
