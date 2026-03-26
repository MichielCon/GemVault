"use client";

import { useActionState, useEffect, useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Pencil, X, Check, Upload, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateGemCuttingDesign } from "@/lib/gem-actions";
import { uploadDesignFile, deleteDesignFile } from "@/lib/design-file-actions";
import { proxyPhotoUrl } from "@/lib/utils";
import type { GemDto, DesignFileDto } from "@/lib/types";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const ACCEPTED = "image/*,.pdf,.gem,.gcs,.asc";

function fileExt(name: string) {
  return name.slice(name.lastIndexOf(".")).toLowerCase();
}

function isImage(file: DesignFileDto) {
  return IMAGE_EXTS.has(fileExt(file.fileName));
}

function FileIcon({ file }: { file: DesignFileDto }) {
  const ext = fileExt(file.fileName);
  if (IMAGE_EXTS.has(ext)) return <ImageIcon size={13} className="text-blue-400" />;
  if (ext === ".pdf") return <FileText size={13} className="text-red-400" />;
  return <FileText size={13} className="text-violet-400" />;
}

interface Props {
  gem: GemDto;
}

const uploadInitial = { error: null as string | null };

export function CuttingDesignCard({ gem }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [design, setDesign] = useState(gem.cuttingDesign ?? "");
  const [editError, setEditError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadPendingRef = useRef(false);

  const uploadAction = uploadDesignFile.bind(null, gem.id);
  const [uploadState, uploadFormAction, uploading] = useActionState(uploadAction, uploadInitial);

  useEffect(() => {
    if (!uploading && uploadPendingRef.current) {
      uploadPendingRef.current = false;
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (uploadState.error === null) router.refresh();
    }
  }, [uploading, uploadState, router]);

  function handleSave() {
    startTransition(async () => {
      const result = await updateGemCuttingDesign(gem.id, {
        cuttingDesign: design || null,
      });
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditing(false);
        setEditError(null);
        router.refresh();
      }
    });
  }

  function handleCancel() {
    setDesign(gem.cuttingDesign ?? "");
    setEditError(null);
    setEditing(false);
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteDesignFile(id);
      setDeletingId(null);
      router.refresh();
    });
  }

  const files = gem.designFiles ?? [];

  return (
    <Card hoverable>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
            <BookOpen size={13} />
            Cutting Design
          </CardTitle>
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-700"
              onClick={() => setEditing(true)}
            >
              <Pencil size={12} className="mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Design name + facets */}
        {editing ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cdDesign" className="text-xs text-zinc-500">Design name / reference</Label>
              <Input
                id="cdDesign"
                placeholder="e.g. Portuguese 64, OMF Oval 64 (Faceter's Companion p.47)"
                value={design}
                onChange={(e) => setDesign(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            {editError && <p className="text-xs text-red-600">{editError}</p>}
            <div className="flex gap-2">
              <Button size="sm" variant="violet" className="h-7 px-3 text-xs" onClick={handleSave} disabled={isPending}>
                <Check size={12} className="mr-1" />
                {isPending ? "Saving…" : "Save"}
              </Button>
              <Button size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={handleCancel} disabled={isPending}>
                <X size={12} className="mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-zinc-800">{gem.cuttingDesign || <span className="text-zinc-400">No design set</span>}</p>
        )}

        {/* Diagram files */}
        <div className="flex flex-col gap-2">
          {files.length > 0 && (
            <div className="flex flex-col divide-y divide-zinc-100">
              {files.map((f) => (
                <FileRow
                  key={f.id}
                  file={f}
                  deleting={deletingId === f.id}
                  onDelete={() => handleDelete(f.id)}
                />
              ))}
            </div>
          )}

          {/* Upload */}
          <form action={uploadFormAction}>
            <label className="flex items-center gap-2 cursor-pointer group w-fit">
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    uploadPendingRef.current = true;
                    e.target.form?.requestSubmit();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1 text-xs text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 transition-colors disabled:opacity-50"
              >
                <Upload size={11} />
                {uploading ? "Uploading…" : "Upload diagram"}
              </button>
            </label>
            {uploadState.error && (
              <p className="mt-1 text-xs text-red-600">{uploadState.error}</p>
            )}
          </form>
          <p className="text-[10px] text-zinc-400">
            Supports images, PDF, GemCutStudio (.gem/.gcs), GemCAD (.asc) — max 50 MB
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function FileRow({
  file,
  deleting,
  onDelete,
}: {
  file: DesignFileDto;
  deleting: boolean;
  onDelete: () => void;
}) {
  const url = proxyPhotoUrl(file.fileUrl);

  return (
    <div className="flex items-center gap-2 py-2 group">
      <FileIcon file={file} />
      {isImage(file) ? (
        <a
          href={url ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-600 hover:text-violet-600 hover:underline truncate flex-1"
        >
          {file.fileName}
        </a>
      ) : (
        <a
          href={url ?? undefined}
          download={file.fileName}
          className="text-xs text-zinc-600 hover:text-violet-600 hover:underline truncate flex-1"
        >
          {file.fileName}
        </a>
      )}
      <span className="text-[10px] text-zinc-400 shrink-0">
        {(file.fileSize / 1024).toFixed(0)} KB
      </span>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-zinc-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
        title="Delete file"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
