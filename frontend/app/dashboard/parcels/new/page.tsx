import { vocabularyApi, originsApi } from "@/lib/api";
import { ParcelCreateForm } from "./form";

export default async function NewParcelPage() {
  const [species, variety, color, treatment, origins] = await Promise.all([
    vocabularyApi.getField("species"),
    vocabularyApi.getField("variety"),
    vocabularyApi.getField("color"),
    vocabularyApi.getField("treatment"),
    originsApi.list(),
  ]);

  return (
    <ParcelCreateForm
      vocabulary={{ species, variety, color, treatment }}
      origins={origins}
    />
  );
}
