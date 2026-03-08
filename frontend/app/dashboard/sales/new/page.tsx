import { gemsApi, parcelsApi } from "@/lib/api";
import { SaleCreateForm } from "./form";

interface Props {
  searchParams: Promise<{ gemId?: string; parcelId?: string }>;
}

export default async function NewSalePage({ searchParams }: Props) {
  const { gemId, parcelId } = await searchParams;

  const [gemsResult, parcelsResult] = await Promise.allSettled([
    gemsApi.list(1, 200),
    parcelsApi.list(1, 200),
  ]);

  const gems = gemsResult.status === "fulfilled" ? gemsResult.value.items : [];
  const parcels = parcelsResult.status === "fulfilled" ? parcelsResult.value.items : [];

  const preselectedItem = gemId
    ? `gem:${gemId}`
    : parcelId
    ? `parcel:${parcelId}`
    : null;

  return <SaleCreateForm gems={gems} parcels={parcels} preselectedItem={preselectedItem} />;
}
