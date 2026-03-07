import { notFound } from "next/navigation";
import { suppliersApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { SupplierEditForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSupplierPage({ params }: Props) {
  const { id } = await params;

  let supplier;
  try {
    supplier = await suppliersApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  return <SupplierEditForm supplier={supplier} />;
}
