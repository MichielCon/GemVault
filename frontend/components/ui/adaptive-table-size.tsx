"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  basePath: string;
  currentPageSize: number;
  extraParams?: Record<string, string | undefined>;
  /** Height of each data row in px. Default 45 (py-3 text rows). */
  rowHeight?: number;
  /** Height of thead in px. Default 33. */
  tableHeaderHeight?: number;
  /** Fixed vertical chrome above+below the table (header, search bar, gaps, pagination, p-8). Default 270. */
  fixedChrome?: number;
}

function computeOptimal(rowHeight: number, tableHeaderHeight: number, fixedChrome: number): number {
  const available = window.innerHeight - fixedChrome - tableHeaderHeight;
  return Math.max(5, Math.floor(available / rowHeight));
}

/** Drop this anywhere in a server-component page to auto-adapt pageSize to the viewport. Renders nothing. */
export function AdaptiveTableSize({
  basePath,
  currentPageSize,
  extraParams = {},
  rowHeight = 45,
  tableHeaderHeight = 33,
  fixedChrome = 270,
}: Props) {
  const router = useRouter();
  const currentPageSizeRef = useRef(currentPageSize);
  currentPageSizeRef.current = currentPageSize;

  useEffect(() => {
    function navigate(optimal: number) {
      const q = new URLSearchParams({ page: "1", pageSize: String(optimal) });
      Object.entries(extraParams).forEach(([k, v]) => {
        if (v) q.set(k, v);
      });
      router.replace(`${basePath}?${q}`);
    }

    function adjust() {
      const optimal = computeOptimal(rowHeight, tableHeaderHeight, fixedChrome);
      if (optimal !== currentPageSizeRef.current) navigate(optimal);
    }

    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  // extraParams object identity changes every render — stringify for stable dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath, rowHeight, tableHeaderHeight, fixedChrome]);

  return null;
}
