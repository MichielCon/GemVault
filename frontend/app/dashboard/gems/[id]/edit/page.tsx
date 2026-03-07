import { notFound } from "next/navigation";
import { gemsApi, ApiError } from "@/lib/api";
import type { GemDto } from "@/lib/types";
import { GemEditForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GemEditPage({ params }: Props) {
  const { id } = await params;

  let gem: GemDto;
  try {
    gem = await gemsApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  return <GemEditForm gem={gem} />;
}
