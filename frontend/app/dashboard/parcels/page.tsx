import { parcelsApi } from "@/lib/api";
import { ParcelInventoryView } from "@/components/parcels/inventory-view";

interface Props {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function ParcelsPage({ searchParams }: Props) {
  const { page: pageStr, search, status } = await searchParams;
  const page = Number(pageStr ?? 1);

  let result;
  try {
    result = await parcelsApi.list(page, 12, search, undefined, status);
  } catch {
    return <p className="text-muted-foreground">Failed to load parcels. Is the API running?</p>;
  }

  return <ParcelInventoryView result={result} page={page} search={search} status={status} />;
}
