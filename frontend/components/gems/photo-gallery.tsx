"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { proxyPhotoUrl } from "@/lib/utils";
import { uploadGemPhoto, deleteGemPhoto } from "@/lib/gem-actions";
import { uploadParcelPhoto, deleteParcelPhoto } from "@/lib/parcel-actions";

interface Photo {
  id: string;
  url: string;
  isCover: boolean;
}

interface Props {
  photos: Photo[];
  name: string;
  entityId: string;
  type: "gem" | "parcel";
}

export function PhotoGallery({ photos, name, entityId, type }: Props) {
  const coverIdx = photos.findIndex((p) => p.isCover);
  const [activeIdx, setActiveIdx] = useState(coverIdx >= 0 ? coverIdx : 0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Keep activeIdx in bounds when photos change
  useEffect(() => {
    if (photos.length > 0 && activeIdx >= photos.length) setActiveIdx(photos.length - 1);
  }, [photos.length, activeIdx]);

  // Scroll active thumbnail into view
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumb = strip.children[activeIdx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [activeIdx]);

  const activePhoto = photos[activeIdx] ?? null;

  const lbPrev = useCallback(() => setLightboxIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)), [photos.length]);
  const lbNext = useCallback(() => setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length)), [photos.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, lbPrev, lbNext]);

  async function handleUpload(files: FileList) {
    setUploading(true);
    setUploadError(null);
    const action = type === "gem"
      ? uploadGemPhoto.bind(null, entityId)
      : uploadParcelPhoto.bind(null, entityId);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file, file.name);
      const result = await action({ error: null }, fd);
      if (result.error) {
        setUploadError(result.error);
        setUploading(false);
        return;
      }
    }
    setUploading(false);
    router.refresh();
  }

  async function handleDelete(photoId: string, idx: number) {
    const deleteAction = type === "gem" ? deleteGemPhoto : deleteParcelPhoto;
    const result = await deleteAction(photoId);
    if (result.error) { setUploadError(result.error); return; }
    if (idx === activeIdx) setActiveIdx(Math.max(0, idx - 1));
    router.refresh();
  }

  return (
    <>
      {/* ── Main image ── */}
      <div className="group relative w-full overflow-hidden rounded-xl bg-muted" style={{ height: 300 }}>
        {activePhoto ? (
          <>
            <Image
              key={activePhoto.id}
              src={proxyPhotoUrl(activePhoto.url) ?? ""}
              alt={name}
              fill
              unoptimized
              className="object-contain object-center cursor-zoom-in transition-opacity duration-200"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              onClick={() => setLightboxIdx(activeIdx)}
            />
            {/* Delete — visible on group hover */}
            <button
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white/70
                         opacity-0 group-hover:opacity-100 transition-all duration-150
                         hover:text-white hover:bg-red-600 hover:scale-110"
              onClick={() => handleDelete(activePhoto.id, activeIdx)}
              title="Delete photo"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No photos yet
          </div>
        )}
      </div>

      {/* ── Thumbnail carousel ── */}
      <div className="flex items-center gap-1.5">
        {/* Scroll left */}
        <button
          onClick={() => stripRef.current?.scrollBy({ left: -160, behavior: "smooth" })}
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full
                     bg-muted text-muted-foreground border border-border
                     hover:bg-accent hover:text-foreground transition-all duration-150 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Scrollable strip */}
        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto min-w-0 flex-1 py-1"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveIdx(i)}
              className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2
                          transition-all duration-150 cursor-pointer
                          hover:scale-105 hover:brightness-110
                          ${i === activeIdx
                            ? "border-primary ring-1 ring-primary/30"
                            : "border-transparent opacity-60 hover:opacity-100"
                          }`}
            >
              <Image
                src={proxyPhotoUrl(p.url) ?? ""}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>

        {/* Scroll right */}
        <button
          onClick={() => stripRef.current?.scrollBy({ left: 160, behavior: "smooth" })}
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full
                     bg-muted text-muted-foreground border border-border
                     hover:bg-accent hover:text-foreground transition-all duration-150 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight size={14} />
        </button>

        {/* Add photos */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 w-14 h-14 items-center justify-center rounded-lg
                     border-2 border-dashed border-muted-foreground/30 text-muted-foreground
                     transition-all duration-150 cursor-pointer
                     hover:border-primary/60 hover:text-primary hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed"
          title="Add photos"
        >
          {uploading
            ? <span className="text-[10px] animate-pulse">...</span>
            : <Plus size={18} />
          }
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 animate-in fade-in duration-150"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full p-2 text-white/70
                       hover:text-white hover:bg-white/10 transition-all duration-150"
            onClick={() => setLightboxIdx(null)}
          >
            <X size={24} />
          </button>

          {photos.length > 1 && (
            <button
              className="absolute left-4 rounded-full p-2 text-white/70
                         hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110"
              onClick={(e) => { e.stopPropagation(); lbPrev(); }}
            >
              <ChevronLeft size={36} />
            </button>
          )}

          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={lightboxIdx}
              src={proxyPhotoUrl(photos[lightboxIdx].url) ?? ""}
              alt={name}
              fill
              unoptimized
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {photos.length > 1 && (
            <button
              className="absolute right-4 rounded-full p-2 text-white/70
                         hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110"
              onClick={(e) => { e.stopPropagation(); lbNext(); }}
            >
              <ChevronRight size={36} />
            </button>
          )}

          <span className="absolute bottom-4 rounded-full bg-black/40 px-3 py-1 text-white/60 text-xs">
            {lightboxIdx + 1} / {photos.length}
          </span>
        </div>
      )}
    </>
  );
}
