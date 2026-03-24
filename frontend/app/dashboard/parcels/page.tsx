import { parcelsApi } from "@/lib/api";
import { ParcelInventoryView } from "@/components/parcels/inventory-view";

interface Props {
  searchParams: Promise<{
    page?: string; pageSize?: string; search?: string; status?: string;
    species?: string; color?: string;
    minPrice?: string; maxPrice?: string;
    sortBy?: string; sortDir?: string;
  }>;
}

export default async function ParcelsPage({ searchParams }: Props) {
  const {
    page: pageStr, pageSize: pageSizeStr, search, status,
    species, color, minPrice, maxPrice, sortBy, sortDir,
  } = await searchParams;
  const page = Number(pageStr ?? 1);
  const pageSize = Math.min(100, Math.max(4, Number(pageSizeStr ?? 8)));

  let result;
  try {
    result = await parcelsApi.list({
      page, pageSize, search, status, species, color,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy, sortDir,
    });
  } catch {
    return <p className="text-muted-foreground">Failed to load parcels. Is the API running?</p>;
  }

  return (
    <ParcelInventoryView
      result={result} page={page} pageSize={pageSize}
      search={search} status={status}
      species={species} color={color}
      minPrice={minPrice} maxPrice={maxPrice}
      sortBy={sortBy} sortDir={sortDir}
    />
  );
}
