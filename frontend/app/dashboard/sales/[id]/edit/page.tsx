import { notFound } from "next/navigation";
import { salesApi, ApiError } from "@/lib/api";
import { SaleEditForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SaleEditPage({ params }: Props) {
  const { id } = await params;
  let sale;
  try {
    sale = await salesApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
  return <SaleEditForm sale={sale} />;
}
