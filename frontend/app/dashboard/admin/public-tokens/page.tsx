import { adminApi } from "@/lib/api";
import PublicTokensTable from "./public-tokens-table";

export default async function AdminPublicTokensPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const filter = params.filter ?? "all";
  const isActive = filter === "active" ? true : filter === "inactive" ? false : undefined;

  const result = await adminApi.getPublicTokens(page, 20, isActive);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Public Tokens</h1>
        <p className="mt-1 text-sm text-slate-500">Manage scan link tokens across all users</p>
      </div>
      <PublicTokensTable result={result} currentPage={page} currentFilter={filter} />
    </div>
  );
}
