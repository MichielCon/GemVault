import { notFound } from "next/navigation";
import { gemsApi, vocabularyApi, originsApi, ApiError } from "@/lib/api";
import type { GemDto } from "@/lib/types";
import { GemEditForm } from "./form";
import { CertificateManager } from "@/components/gems/certificate-manager";

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

  const [
    speciesVocab,
    varietyVocab,
    colorVocab,
    clarityVocab,
    cutVocab,
    shapeVocab,
    treatmentVocab,
    origins,
  ] = await Promise.all([
    vocabularyApi.getField("species"),
    vocabularyApi.getField("variety"),
    vocabularyApi.getField("color"),
    vocabularyApi.getField("clarity"),
    vocabularyApi.getField("cut"),
    vocabularyApi.getField("shape"),
    vocabularyApi.getField("treatment"),
    originsApi.list(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <GemEditForm
        gem={gem}
        vocabulary={{
          species: speciesVocab,
          variety: varietyVocab,
          color: colorVocab,
          clarity: clarityVocab,
          cut: cutVocab,
          shape: shapeVocab,
          treatment: treatmentVocab,
        }}
        origins={origins}
      />
      <CertificateManager gemId={gem.id} certificates={gem.certificates} />
    </div>
  );
}
