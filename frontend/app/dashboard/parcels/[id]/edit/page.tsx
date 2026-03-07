import { notFound } from "next/navigation";
import { parcelsApi, vocabularyApi, originsApi, ApiError } from "@/lib/api";
import type { GemParcelDto } from "@/lib/types";
import { ParcelEditForm } from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ParcelEditPage({ params }: Props) {
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

  const [speciesVocab, varietyVocab, colorVocab, treatmentVocab, origins] =
    await Promise.all([
      vocabularyApi.getField("species"),
      vocabularyApi.getField("variety"),
      vocabularyApi.getField("color"),
      vocabularyApi.getField("treatment"),
      originsApi.list(),
    ]);

  return (
    <ParcelEditForm
      parcel={parcel}
      vocabulary={{
        species: speciesVocab,
        variety: varietyVocab,
        color: colorVocab,
        treatment: treatmentVocab,
      }}
      origins={origins}
    />
  );
}
