import { gemsApi, parcelsApi } from "@/lib/api";
import { SaleCreateForm } from "./form";

export default async function NewSalePage() {
  const [gemsResult, parcelsResult] = await Promise.allSettled([
    gemsApi.list(1, 200),
    parcelsApi.list(1, 200),
  ]);

  const gems = gemsResult.status === "fulfilled" ? gemsResult.value.items : [];
  const parcels = parcelsResult.status === "fulfilled" ? parcelsResult.value.items : [];

  return <SaleCreateForm gems={gems} parcels={parcels} />;
}
