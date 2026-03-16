import { notFound } from "next/navigation";
import { purchaseOrdersApi, suppliersApi, ApiError } from "@/lib/api";
import { OrderEditForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderEditPage({ params }: Props) {
  const { id } = await params;

  let order;
  try {
    order = await purchaseOrdersApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  const suppliers = await suppliersApi.list();

  return <OrderEditForm order={order} suppliers={suppliers} />;
}
