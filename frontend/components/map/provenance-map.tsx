"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { X, Gem, Package, MapPin, DollarSign } from "lucide-react";
import type { OriginMapDto } from "@/lib/types";
import { getCountryCoords } from "@/lib/country-coords";

// Leaflet CSS must be imported client-side
import "leaflet/dist/leaflet.css";

interface CountryGroup {
  country: string;
  coords: [number, number];
  origins: OriginMapDto[];
  totalGems: number;
  totalParcels: number;
  totalCarats: number;
  totalInvested: number;
  allSpecies: string[];
}

function buildCountryGroups(origins: OriginMapDto[]): CountryGroup[] {
  const map = new Map<string, OriginMapDto[]>();
  for (const o of origins) {
    const list = map.get(o.country) ?? [];
    list.push(o);
    map.set(o.country, list);
  }

  const groups: CountryGroup[] = [];
  for (const [country, list] of map.entries()) {
    const coords = getCountryCoords(country);
    if (!coords) continue; // skip unknown countries

    groups.push({
      country,
      coords,
      origins: list,
      totalGems: list.reduce((s, o) => s + o.gemCount, 0),
      totalParcels: list.reduce((s, o) => s + o.parcelCount, 0),
      totalCarats: list.reduce((s, o) => s + o.totalCarats, 0),
      totalInvested: list.reduce((s, o) => s + o.totalInvested, 0),
      allSpecies: [...new Set(list.flatMap((o) => o.species))].sort(),
    });
  }
  return groups.sort((a, b) => b.totalGems - a.totalGems);
}

function markerSize(total: number) {
  if (total <= 2) return 34;
  if (total <= 5) return 42;
  if (total <= 15) return 52;
  return 64;
}

function markerColor(total: number) {
  if (total <= 2) return { bg: "rgba(167,139,250,0.85)", pulse: "rgba(167,139,250,0.25)" };
  if (total <= 5) return { bg: "rgba(139,92,246,0.9)", pulse: "rgba(139,92,246,0.25)" };
  if (total <= 15) return { bg: "rgba(109,40,217,0.92)", pulse: "rgba(109,40,217,0.3)" };
  return { bg: "rgba(76,29,149,0.95)", pulse: "rgba(76,29,149,0.35)" };
}

function fmt(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function fmtCt(v: number) {
  return v % 1 === 0 ? `${v} ct` : `${v.toFixed(2)} ct`;
}

const COUNTRY_FLAG: Record<string, string> = {
  Afghanistan: "🇦🇫", Albania: "🇦🇱", Algeria: "🇩🇿", Angola: "🇦🇴", Argentina: "🇦🇷",
  Armenia: "🇦🇲", Australia: "🇦🇺", Austria: "🇦🇹", Azerbaijan: "🇦🇿", Bangladesh: "🇧🇩",
  Belgium: "🇧🇪", Bolivia: "🇧🇴", Brazil: "🇧🇷", Bulgaria: "🇧🇬", Cambodia: "🇰🇭",
  Cameroon: "🇨🇲", Canada: "🇨🇦", Chile: "🇨🇱", China: "🇨🇳", Colombia: "🇨🇴",
  "Democratic Republic of Congo": "🇨🇩", "DR Congo": "🇨🇩", "Congo (DRC)": "🇨🇩",
  Ecuador: "🇪🇨", Egypt: "🇪🇬", Ethiopia: "🇪🇹", France: "🇫🇷", Georgia: "🇬🇪",
  Germany: "🇩🇪", Ghana: "🇬🇭", Greece: "🇬🇷", India: "🇮🇳", Indonesia: "🇮🇩",
  Iran: "🇮🇷", Iraq: "🇮🇶", Italy: "🇮🇹", Japan: "🇯🇵", Jordan: "🇯🇴",
  Kazakhstan: "🇰🇿", Kenya: "🇰🇪", Kyrgyzstan: "🇰🇬", Laos: "🇱🇦", Lebanon: "🇱🇧",
  Madagascar: "🇲🇬", Malawi: "🇲🇼", Malaysia: "🇲🇾", Mali: "🇲🇱", Mexico: "🇲🇽",
  Mongolia: "🇲🇳", Morocco: "🇲🇦", Mozambique: "🇲🇿", Myanmar: "🇲🇲", Namibia: "🇳🇦",
  Nepal: "🇳🇵", Nigeria: "🇳🇬", Pakistan: "🇵🇰", Peru: "🇵🇪", Philippines: "🇵🇭",
  Russia: "🇷🇺", Rwanda: "🇷🇼", "Saudi Arabia": "🇸🇦", "Sierra Leone": "🇸🇱",
  "South Africa": "🇿🇦", "South Korea": "🇰🇷", Spain: "🇪🇸", "Sri Lanka": "🇱🇰",
  Sudan: "🇸🇩", Sweden: "🇸🇪", Switzerland: "🇨🇭", Syria: "🇸🇾", Taiwan: "🇹🇼",
  Tajikistan: "🇹🇯", Tanzania: "🇹🇿", Thailand: "🇹🇭", Turkey: "🇹🇷",
  Turkmenistan: "🇹🇲", Uganda: "🇺🇬", Ukraine: "🇺🇦",
  "United Arab Emirates": "🇦🇪", "United Kingdom": "🇬🇧",
  "United States": "🇺🇸", USA: "🇺🇸", Uzbekistan: "🇺🇿", Venezuela: "🇻🇪",
  Vietnam: "🇻🇳", Zambia: "🇿🇲", Zimbabwe: "🇿🇼",
};

interface Props {
  origins: OriginMapDto[];
}

export default function ProvenanceMap({ origins }: Props) {
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<CountryGroup | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  const groups = buildCountryGroups(origins);

  const totalCountries = groups.length;
  const totalGems = groups.reduce((s, g) => s + g.totalGems, 0);
  const totalParcels = groups.reduce((s, g) => s + g.totalParcels, 0);
  const totalCarats = groups.reduce((s, g) => s + g.totalCarats, 0);
  const totalInvested = groups.reduce((s, g) => s + g.totalInvested, 0);

  function selectGroup(group: CountryGroup) {
    setSelected(group);
    setPanelVisible(true);
    mapRef.current?.flyTo(group.coords, 5, { duration: 1.2, easeLinearity: 0.25 });
  }

  function closePanel() {
    setPanelVisible(false);
    setTimeout(() => setSelected(null), 250);
    mapRef.current?.flyTo([20, 10], 3, { duration: 1.0, easeLinearity: 0.25 });
  }

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return; // already initialised

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      const map = L.map(containerRef.current!, {
        center: [20, 10],
        zoom: 3,
        minZoom: 3,
        maxZoom: 10,
        zoomControl: false,
        attributionControl: true,
        maxBounds: [[-85, -Infinity], [85, Infinity]],
        maxBoundsViscosity: 1.0,
      });

      mapRef.current = map;

      // Dark Matter tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Add zoom control to bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add markers
      for (const group of groups) {
        const total = group.totalGems + group.totalParcels;
        const size = markerSize(total);
        const colors = markerColor(total);
        const pulseSize = size + 28;
        const fontSize = size <= 34 ? 11 : size <= 42 ? 13 : 15;

        const icon = L.divIcon({
          className: "",
          html: `
            <div class="gem-marker-wrap" style="width:${pulseSize}px;height:${pulseSize}px;position:relative">
              <div class="gem-marker-pulse" style="
                width:${pulseSize}px;height:${pulseSize}px;
                background:${colors.pulse};
                top:0;left:0;position:absolute;
              "></div>
              <div class="gem-marker-pulse gem-marker-pulse-2" style="
                width:${pulseSize}px;height:${pulseSize}px;
                background:${colors.pulse};
                top:0;left:0;position:absolute;
              "></div>
              <div class="gem-marker-dot" style="
                width:${size}px;height:${size}px;
                font-size:${fontSize}px;
                background:${colors.bg};
                position:absolute;
                top:${(pulseSize - size) / 2}px;
                left:${(pulseSize - size) / 2}px;
              ">${total}</div>
            </div>
          `,
          iconSize: [pulseSize, pulseSize],
          iconAnchor: [pulseSize / 2, pulseSize / 2],
          tooltipAnchor: [pulseSize / 2, 0],
        });

        const marker = L.marker(group.coords, { icon });

        marker.bindTooltip(
          `<div style="font-weight:600;font-size:13px">${COUNTRY_FLAG[group.country] ?? "🌍"} ${group.country}</div>
           <div style="font-size:11px;color:#999;margin-top:2px">${total} item${total !== 1 ? "s" : ""} · ${fmtCt(group.totalCarats)}</div>`,
          { direction: "top", offset: [0, -size / 2 - 4], className: "" }
        );

        marker.on("click", () => selectGroup(group));
        marker.addTo(map);
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full bg-[#1a1a2e]">
      {/* Stats strip */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center gap-6 px-5 py-2.5 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 text-sm">
        <div className="flex items-center gap-1.5 text-violet-400 font-semibold">
          <MapPin size={14} />
          <span>{totalCountries} {totalCountries === 1 ? "country" : "countries"}</span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-1.5 text-slate-300">
          <Gem size={13} />
          <span>{totalGems} gem{totalGems !== 1 ? "s" : ""}</span>
        </div>
        {totalParcels > 0 && (
          <>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Package size={13} />
              <span>{totalParcels} parcel{totalParcels !== 1 ? "s" : ""}</span>
            </div>
          </>
        )}
        {totalCarats > 0 && (
          <>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-slate-300">{fmtCt(totalCarats)}</span>
          </>
        )}
        {totalInvested > 0 && (
          <>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1 text-slate-300">
              <DollarSign size={12} />
              <span>{fmt(totalInvested)} invested</span>
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-4 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-700/50 px-3 py-2.5 text-xs text-slate-400 space-y-1.5">
        <p className="font-semibold text-slate-300 mb-2">Items per location</p>
        {[
          { label: "1–2", color: "rgba(167,139,250,0.85)", size: 16 },
          { label: "3–5", color: "rgba(139,92,246,0.9)", size: 19 },
          { label: "6–15", color: "rgba(109,40,217,0.92)", size: 22 },
          { label: "16+", color: "rgba(76,29,149,0.95)", size: 26 },
        ].map(({ label, color, size }) => (
          <div key={label} className="flex items-center gap-2">
            <div style={{ width: size, height: size, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Leaflet container */}
      <div ref={containerRef} className="w-full h-full" style={{ paddingTop: "44px" }} />

      {/* Side panel */}
      {selected && (
        <div
          key={selected.country}
          className={`absolute top-[44px] right-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-md border-l border-slate-700/50 z-[1000] flex flex-col overflow-hidden ${panelVisible ? "map-panel-enter" : "map-panel-exit"}`}
        >
          {/* Panel header */}
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-700/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{COUNTRY_FLAG[selected.country] ?? "🌍"}</span>
                <h2 className="text-lg font-bold text-white leading-tight">{selected.country}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selected.totalGems + selected.totalParcels} items · {fmtCt(selected.totalCarats)}
              </p>
            </div>
            <button
              onClick={closePanel}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors shrink-0 mt-0.5"
            >
              <X size={16} />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-px bg-slate-700/30 border-b border-slate-700/50">
            <div className="bg-slate-900/80 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Invested</p>
              <p className="text-sm font-bold text-violet-300">{fmt(selected.totalInvested)}</p>
            </div>
            <div className="bg-slate-900/80 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Total weight</p>
              <p className="text-sm font-bold text-violet-300">{fmtCt(selected.totalCarats)}</p>
            </div>
          </div>

          {/* Species tags */}
          {selected.allSpecies.length > 0 && (
            <div className="px-5 py-3 border-b border-slate-700/30">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Species</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.allSpecies.map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-violet-900/50 text-violet-300 border border-violet-700/40">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Origins list */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
              {selected.origins.length === 1 ? "Origin" : `${selected.origins.length} Origins`}
            </p>
            {selected.origins.map((o) => (
              <Link
                key={o.id}
                href={`/dashboard/origins/${o.id}`}
                className="block rounded-lg border border-slate-700/40 bg-slate-800/50 px-4 py-3 hover:border-violet-500/40 hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                      {o.mine ?? o.region ?? o.country}
                    </p>
                    {o.region && o.mine && (
                      <p className="text-[11px] text-slate-500 truncate">{o.region}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-slate-300">{o.gemCount + o.parcelCount} items</p>
                    {o.totalCarats > 0 && (
                      <p className="text-[10px] text-slate-500">{fmtCt(o.totalCarats)}</p>
                    )}
                  </div>
                </div>
                {o.species.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {o.species.slice(0, 4).map((s) => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-400">
                        {s}
                      </span>
                    ))}
                    {o.species.length > 4 && (
                      <span className="text-[10px] text-slate-600">+{o.species.length - 4}</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-700/50">
            <Link
              href="/dashboard/origins"
              className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-violet-300 transition-colors"
            >
              <MapPin size={12} />
              View all origins
            </Link>
          </div>
        </div>
      )}

      {/* Empty state */}
      {groups.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none" style={{ paddingTop: "44px" }}>
          <MapPin size={48} strokeWidth={1} className="mb-4 text-slate-600" />
          <p className="text-slate-400 font-medium">No origin data yet</p>
          <p className="text-slate-600 text-sm mt-1">Add origins to gems and parcels to see them on the map.</p>
        </div>
      )}
    </div>
  );
}
