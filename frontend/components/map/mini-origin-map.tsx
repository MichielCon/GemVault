"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getCountryCoords } from "@/lib/country-coords";

import "leaflet/dist/leaflet.css";

interface Props {
  country: string;
  mine?: string | null;
  region?: string | null;
}

export function MiniOriginMap({ country, mine, region }: Props) {
  const coords = getCountryCoords(country);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: coords ?? [20, 10],
        zoom: coords ? 5 : 3,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      });

      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(map);

      if (coords) {
        const label = [mine, region, country].filter(Boolean).join(", ");

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:28px;height:28px;border-radius:50%;
            background:rgba(139,92,246,0.9);
            border:2px solid rgba(167,139,250,0.9);
            box-shadow:0 0 0 6px rgba(139,92,246,0.2);
            display:flex;align-items:center;justify-content:center;
          ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker(coords, { icon })
          .bindTooltip(label, { permanent: false, direction: "top", offset: [0, -16] })
          .addTo(map);
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label = [mine, region, country].filter(Boolean).join(", ");

  return (
    <div className="overflow-hidden rounded-lg border">
      <div
        ref={containerRef}
        className="w-full bg-[#1a1a2e]"
        style={{ height: 140 }}
      />
      <div className="flex items-center justify-between border-t bg-card px-3 py-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={12} />
          {label}
        </span>
        <Link
          href="/dashboard/map"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          Full map →
        </Link>
      </div>
    </div>
  );
}
