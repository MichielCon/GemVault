import { gemsApi } from "@/lib/api";
import { GemInventoryView } from "@/components/gems/inventory-view";

interface Props {
  searchParams: Promise<{
    page?: string; pageSize?: string; search?: string;
    status?: string; gemStatus?: string;
    species?: string; color?: string;
    minPrice?: string; maxPrice?: string;
    sortBy?: string; sortDir?: string;
  }>;
}

export default async function GemsPage({ searchParams }: Props) {
  const {
    page: pageStr, pageSize: pageSizeStr, search, status, gemStatus,
    species, color, minPrice, maxPrice, sortBy, sortDir,
  } = await searchParams;
  const page = Number(pageStr ?? 1);
  const pageSize = Math.min(100, Math.max(4, Number(pageSizeStr ?? 8)));

  let result;
  try {
    result = await gemsApi.list({
      page, pageSize, search, status, gemStatus, species, color,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy, sortDir,
    });
  } catch {
    return <p className="text-muted-foreground">Failed to load gems. Is the API running?</p>;
  }

  return (
    <GemInventoryView
      result={result} page={page} pageSize={pageSize}
      search={search} status={status} gemStatus={gemStatus}
      species={species} color={color}
      minPrice={minPrice} maxPrice={maxPrice}
      sortBy={sortBy} sortDir={sortDir}
    />
  );
}
