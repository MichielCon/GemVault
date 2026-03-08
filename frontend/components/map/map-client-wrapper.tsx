"use client";

import dynamic from "next/dynamic";
import type { OriginMapDto } from "@/lib/types";

const ProvenanceMap = dynamic(
  () => import("@/components/map/provenance-map"),
  { ssr: false }
);

export function MapClientWrapper({ origins }: { origins: OriginMapDto[] }) {
  return <ProvenanceMap origins={origins} />;
}
