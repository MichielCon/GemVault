import { notFound } from "next/navigation";
import { originsApi, ApiError } from "@/lib/api";
import { OriginEditForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OriginEditPage({ params }: Props) {
  const { id } = await params;

  let origin;
  try {
    origin = await originsApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  return <OriginEditForm origin={origin} />;
}
