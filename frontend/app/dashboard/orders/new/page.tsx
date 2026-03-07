import { suppliersApi, gemsApi, parcelsApi } from "@/lib/api";
import { PurchaseOrderCreateForm } from "./form";

export default async function NewOrderPage() {
  const [suppliersResult, gemsResult, parcelsResult] = await Promise.allSettled([
    suppliersApi.list(),
    gemsApi.list(1, 200),
    parcelsApi.list(1, 200),
  ]);

  const suppliers = suppliersResult.status === "fulfilled" ? suppliersResult.value : [];
  const gems = gemsResult.status === "fulfilled" ? gemsResult.value.items : [];
  const parcels = parcelsResult.status === "fulfilled" ? parcelsResult.value.items : [];

  return <PurchaseOrderCreateForm suppliers={suppliers} gems={gems} parcels={parcels} />;
}
