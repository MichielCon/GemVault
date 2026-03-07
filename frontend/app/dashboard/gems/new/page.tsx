import { vocabularyApi, originsApi } from "@/lib/api";
import { GemCreateForm } from "./form";

export default async function NewGemPage() {
  const [species, variety, color, clarity, cut, shape, treatment, origins] =
    await Promise.all([
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
    <GemCreateForm
      vocabulary={{ species, variety, color, clarity, cut, shape, treatment }}
      origins={origins}
    />
  );
}
