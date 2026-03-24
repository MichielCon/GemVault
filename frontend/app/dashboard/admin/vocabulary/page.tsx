import { vocabularyAdminApi } from "@/lib/api";
import { VocabularyAdminTable } from "./vocabulary-admin-table";

const FIELDS = ["species", "variety", "color", "clarity", "cut", "shape", "treatment"] as const;
type VocabField = (typeof FIELDS)[number];

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function VocabularyAdminPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab: VocabField = (FIELDS.includes(tab as VocabField) ? tab : "species") as VocabField;

  const [items, speciesItems] = await Promise.all([
    vocabularyAdminApi.list(activeTab),
    // Always fetch species for the ParentValue select on the variety tab
    activeTab === "variety" ? vocabularyAdminApi.list("species") : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Vocabulary</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the dropdown options used in gem and parcel forms.
        </p>
      </div>

      <VocabularyAdminTable
        activeTab={activeTab}
        fields={FIELDS as unknown as string[]}
        items={items}
        speciesOptions={speciesItems.map((s) => s.value)}
      />
    </div>
  );
}
