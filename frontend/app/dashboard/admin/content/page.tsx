import { adminApi } from "@/lib/api";
import ContentTable from "./content-table";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "certificates" ? "certificates" : params.tab === "design-files" ? "design-files" : "photos";
  const page = Number(params.page ?? 1);
  const search = params.search ?? "";

  const [photos, certificates, designFiles] = await Promise.all([
    tab === "photos" ? adminApi.getPhotos(page, 20, search || undefined) : null,
    tab === "certificates" ? adminApi.getCertificates(page, 20, search || undefined) : null,
    tab === "design-files" ? adminApi.getDesignFiles(page, 20, search || undefined) : null,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Content Moderation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor and manage uploaded photos, certificates, and cutting diagrams</p>
      </div>
      <ContentTable
        tab={tab}
        page={page}
        search={search}
        photos={photos}
        certificates={certificates}
        designFiles={designFiles}
      />
    </div>
  );
}
