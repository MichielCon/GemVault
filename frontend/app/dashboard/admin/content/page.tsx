import { adminApi } from "@/lib/api";
import ContentTable from "./content-table";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "certificates" ? "certificates" : "photos";
  const page = Number(params.page ?? 1);
  const search = params.search ?? "";

  const [photos, certificates] = await Promise.all([
    tab === "photos" ? adminApi.getPhotos(page, 20, search || undefined) : null,
    tab === "certificates" ? adminApi.getCertificates(page, 20, search || undefined) : null,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Content Moderation</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor and manage uploaded photos and certificates</p>
      </div>
      <ContentTable
        tab={tab}
        page={page}
        search={search}
        photos={photos}
        certificates={certificates}
      />
    </div>
  );
}
