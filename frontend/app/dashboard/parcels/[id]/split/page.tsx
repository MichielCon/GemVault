import { notFound } from "next/navigation";
import { parcelsApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { GemParcelDto } from "@/lib/types";
import { SplitParcelForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SplitParcelPage({ params }: Props) {
  const { id } = await params;

  let parcel: GemParcelDto;
  try {
    parcel = await parcelsApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  return <SplitParcelForm parcel={parcel} />;
}
