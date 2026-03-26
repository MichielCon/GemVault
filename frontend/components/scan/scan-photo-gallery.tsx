"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  isCover: boolean;
}

interface ScanPhotoGalleryProps {
  photos: Photo[];
  gemName: string;
}

function proxyUrl(url: string) {
  return `/api/public-photos?url=${encodeURIComponent(url)}`;
}

export function ScanPhotoGallery({ photos, gemName }: ScanPhotoGalleryProps) {
  const initialIndex = photos.findIndex((p) => p.isCover) !== -1
    ? photos.findIndex((p) => p.isCover)
    : 0;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activePhoto = photos[activeIndex] ?? null;

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center bg-zinc-50 border-b border-zinc-100 h-48 gap-2 text-zinc-400">
        <ImageOff size={28} />
        <span className="text-sm">No photo</span>
      </div>
    );
  }

  return (
    <div>
      {/* Main photo */}
      <div className="flex items-center justify-center bg-zinc-50 border-b border-zinc-100" style={{ minHeight: "220px", maxHeight: "420px" }}>
        <img
          key={activePhoto.id}
          src={proxyUrl(activePhoto.url)}
          alt={gemName}
          className="object-contain mx-auto"
          style={{ maxHeight: "420px", maxWidth: "100%" }}
        />
      </div>

      {/* Thumbnail strip — only shown when there are multiple photos */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-zinc-100 justify-center flex-wrap">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === activeIndex
                  ? "border-violet-500 shadow-sm"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-zinc-300"
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              <img
                src={proxyUrl(p.url)}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
