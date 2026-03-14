"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PagedResult, AdminPhotoDto, AdminCertificateDto } from "@/lib/types";
import { adminDeletePhoto, adminDeleteCertificate } from "@/lib/admin-actions";
import { proxyPhotoUrl } from "@/lib/utils";

interface Props {
  tab: string;
  page: number;
  search: string;
  photos: PagedResult<AdminPhotoDto> | null;
  certificates: PagedResult<AdminCertificateDto> | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function PhotoRow({ photo }: { photo: AdminPhotoDto }) {
  const router = useRouter();
  const [state, action] = useActionState(adminDeletePhoto, { error: null });
  const prevRef = useRef(state);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (prevRef.current !== state && state.error === null) router.refresh();
    prevRef.current = state;
  }, [state, router]);

  const linkedRecord = photo.gemName ?? photo.gemParcelName ?? "(unknown)";
  const recordType = photo.gemId ? "Gem" : "Parcel";
  const proxyUrl = proxyPhotoUrl(photo.url);

  return (
    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
      <td className="px-4 py-3">
        <div className="relative h-12 w-16 overflow-hidden rounded bg-slate-100">
          {proxyUrl ? (
            <Image src={proxyUrl} alt={photo.fileName} fill unoptimized className="object-cover" sizes="64px" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300 text-xs">No img</div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-700">
        <div className="truncate max-w-[160px]" title={photo.fileName}>{photo.fileName}</div>
        <div className="text-xs text-slate-400">{formatBytes(photo.fileSizeBytes)}</div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        <span className="text-xs text-slate-400">{recordType}: </span>{linkedRecord}
        {photo.isCover && (
          <span className="ml-1 inline-flex items-center rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">Cover</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-slate-500">{photo.ownerEmail}</td>
      <td className="px-4 py-3 text-sm text-slate-400">{new Date(photo.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        {confirming ? (
          <div className="flex items-center gap-1">
            <form action={action} onSubmit={() => setConfirming(false)}>
              <input type="hidden" name="photoId" value={photo.id} />
              <button
                type="submit"
                className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </form>
            <button
              onClick={() => setConfirming(false)}
              className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200"
          >
            Delete
          </button>
        )}
        {state.error && <p className="mt-1 text-xs text-red-500">{state.error}</p>}
      </td>
    </tr>
  );
}

function CertRow({ cert }: { cert: AdminCertificateDto }) {
  const router = useRouter();
  const [state, action] = useActionState(adminDeleteCertificate, { error: null });
  const prevRef = useRef(state);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (prevRef.current !== state && state.error === null) router.refresh();
    prevRef.current = state;
  }, [state, router]);

  return (
    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
      <td className="px-4 py-3 text-sm font-medium text-slate-700">{cert.certNumber}</td>
      <td className="px-4 py-3 text-sm text-slate-500">{cert.lab ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-slate-500">{cert.grade ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{cert.gemName}</td>
      <td className="px-4 py-3 text-sm text-slate-500">{cert.ownerEmail}</td>
      <td className="px-4 py-3 text-sm text-slate-400">
        {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {cert.fileUrl && (
            <a
              href={cert.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              View
            </a>
          )}
          {confirming ? (
            <div className="flex items-center gap-1">
              <form action={action} onSubmit={() => setConfirming(false)}>
                <input type="hidden" name="certId" value={cert.id} />
                <button
                  type="submit"
                  className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </form>
              <button
                onClick={() => setConfirming(false)}
                className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200"
            >
              Delete
            </button>
          )}
        </div>
        {state.error && <p className="mt-1 text-xs text-red-500">{state.error}</p>}
      </td>
    </tr>
  );
}

export default function ContentTable({ tab, page, search, photos, certificates }: Props) {
  const router = useRouter();

  function setTab(t: string) {
    const params = new URLSearchParams({ tab: t, page: "1" });
    if (search) params.set("search", search);
    router.push(`/dashboard/admin/content?${params.toString()}`);
  }

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams({ tab });
    if (search && key !== "search") params.set("search", search);
    if (value) params.set(key, value);
    router.push(`/dashboard/admin/content?${params.toString()}`);
  }

  const result = tab === "photos" ? photos : certificates;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 w-fit">
        {(["photos", "certificates"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "photos"
              ? `Photos${photos ? ` (${photos.totalCount})` : ""}`
              : `Certificates${certificates ? ` (${certificates.totalCount})` : ""}`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Filter by owner email…"
          defaultValue={search}
          onChange={(e) => updateParam("search", e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        {search && (
          <button
            onClick={() => updateParam("search", "")}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
        {result && (
          <span className="ml-auto text-sm text-slate-400">{result.totalCount} item{result.totalCount !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Photos table */}
      {tab === "photos" && photos && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Linked To</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Uploaded</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {photos.items.map((photo) => (
                <PhotoRow key={photo.id} photo={photo} />
              ))}
              {photos.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    {search ? `No photos found for "${search}".` : "No photos found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Certificates table */}
      {tab === "certificates" && certificates && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Cert #</th>
                <th className="px-4 py-3">Lab</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Gem</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.items.map((cert) => (
                <CertRow key={cert.id} cert={cert} />
              ))}
              {certificates.items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    {search ? `No certificates found for "${search}".` : "No certificates found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {result && result.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Page {result.page} of {result.totalPages} ({result.totalCount} total)</span>
          <div className="flex gap-2">
            {result.hasPreviousPage && (
              <button onClick={() => updateParam("page", String(page - 1))} className="rounded border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50">
                Previous
              </button>
            )}
            {result.hasNextPage && (
              <button onClick={() => updateParam("page", String(page + 1))} className="rounded border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50">
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
