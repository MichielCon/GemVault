import { gemsApi } from "@/lib/api";
import { GemInventoryView } from "@/components/gems/inventory-view";

interface Props {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function GemsPage({ searchParams }: Props) {
  const { page: pageStr, search, status } = await searchParams;
  const page = Number(pageStr ?? 1);

  let result;
  try {
    result = await gemsApi.list(page, 24, search, undefined, status);
  } catch {
    return <p className="text-muted-foreground">Failed to load gems. Is the API running?</p>;
  }

  return <GemInventoryView result={result} page={page} search={search} status={status} />;
}
