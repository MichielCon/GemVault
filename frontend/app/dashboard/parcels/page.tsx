import { parcelsApi } from "@/lib/api";
import { ParcelInventoryView } from "@/components/parcels/inventory-view";

interface Props {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string }>;
}

export default async function ParcelsPage({ searchParams }: Props) {
  const { page: pageStr, pageSize: pageSizeStr, search, status } = await searchParams;
  const page = Number(pageStr ?? 1);
  const pageSize = Math.min(100, Math.max(4, Number(pageSizeStr ?? 8)));

  let result;
  try {
    result = await parcelsApi.list(page, pageSize, search, undefined, status);
  } catch {
    return <p className="text-muted-foreground">Failed to load parcels. Is the API running?</p>;
  }

  return <ParcelInventoryView result={result} page={page} pageSize={pageSize} search={search} status={status} />;
}
