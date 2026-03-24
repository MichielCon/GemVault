import { gemsApi } from "@/lib/api";
import { GemInventoryView } from "@/components/gems/inventory-view";

interface Props {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string; gemStatus?: string }>;
}

export default async function GemsPage({ searchParams }: Props) {
  const { page: pageStr, pageSize: pageSizeStr, search, status, gemStatus } = await searchParams;
  const page = Number(pageStr ?? 1);
  const pageSize = Math.min(100, Math.max(4, Number(pageSizeStr ?? 8)));

  let result;
  try {
    result = await gemsApi.list(page, pageSize, search, undefined, status, gemStatus);
  } catch {
    return <p className="text-muted-foreground">Failed to load gems. Is the API running?</p>;
  }

  return <GemInventoryView result={result} page={page} pageSize={pageSize} search={search} status={status} gemStatus={gemStatus} />;
}
