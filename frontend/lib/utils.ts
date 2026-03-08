import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Wraps a MinIO URL so it's served through the local /api/photos proxy.
 *  This avoids Next.js remotePatterns issues with Docker-internal hostnames. */
export function proxyPhotoUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return `/api/photos?url=${encodeURIComponent(url)}`;
}
