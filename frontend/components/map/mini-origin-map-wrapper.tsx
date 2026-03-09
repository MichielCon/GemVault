"use client";

import dynamic from "next/dynamic";

const MiniOriginMapClient = dynamic(
  () => import("./mini-origin-map").then((m) => m.MiniOriginMap),
  { ssr: false }
);

interface Props {
  country: string;
  mine?: string | null;
  region?: string | null;
}

export function MiniOriginMapWrapper(props: Props) {
  return <MiniOriginMapClient {...props} />;
}
