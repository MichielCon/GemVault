"use client";

import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <MiniOriginMapClient {...props} />;
}
