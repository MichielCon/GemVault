import { adminApi } from "@/lib/api";
import SessionsTable from "./sessions-table";

export default async function AdminSessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search ?? "";
  const result = await adminApi.getSessions(page, 20, search || undefined);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Active Sessions</h1>
        <p className="mt-1 text-sm text-slate-500">Manage refresh tokens across all users</p>
      </div>
      <SessionsTable result={result} currentPage={page} search={search} />
    </div>
  );
}
