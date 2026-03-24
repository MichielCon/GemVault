"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import type { OriginDto } from "@/lib/types";

export interface OriginPickerProps {
  allOrigins: OriginDto[];
  initialOriginId?: string | null;
  initialCountry?: string | null;
  initialLocality?: string | null;
}

export function OriginPicker({
  allOrigins,
  initialOriginId,
  initialCountry,
  initialLocality,
}: OriginPickerProps) {
  // Derive sorted unique country list
  const countries = React.useMemo(() => {
    const unique = [...new Set(allOrigins.map((o) => o.country))].sort();
    return unique.map((c) => ({ value: c, label: c }));
  }, [allOrigins]);

  // Resolve initial values from initialOriginId if provided
  const resolvedInitial = React.useMemo(() => {
    if (initialOriginId) {
      const found = allOrigins.find((o) => o.id === initialOriginId);
      if (found) {
        return { country: found.country, locality: found.locality, id: found.id };
      }
    }
    return {
      country: initialCountry ?? null,
      locality: initialLocality ?? null,
      id: null as string | null,
    };
  }, [allOrigins, initialOriginId, initialCountry, initialLocality]);

  const [selectedCountry, setSelectedCountry] = React.useState<string | null>(
    resolvedInitial.country
  );
  const [selectedLocality, setSelectedLocality] = React.useState<string | null>(
    resolvedInitial.locality
  );
  const [resolvedOriginId, setResolvedOriginId] = React.useState<string | null>(
    resolvedInitial.id
  );

  // Locality options for the selected country
  const localityOptions = React.useMemo(() => {
    if (!selectedCountry) return [];
    return allOrigins
      .filter((o) => o.country === selectedCountry && o.locality)
      .map((o) => ({ value: o.locality!, label: o.locality! }));
  }, [allOrigins, selectedCountry]);

  function handleCountryChange(val: string | null) {
    setSelectedCountry(val);
    setSelectedLocality(null);
    setResolvedOriginId(null);
  }

  function handleLocalityChange(val: string | null) {
    setSelectedLocality(val);
    if (val && selectedCountry) {
      // Try to find an existing origin matching (country, locality)
      const found = allOrigins.find(
        (o) => o.country === selectedCountry && o.locality === val
      );
      setResolvedOriginId(found ? found.id : null);
    } else if (!val && selectedCountry) {
      // No locality — try to find a country-only origin (locality === null)
      const found = allOrigins.find(
        (o) => o.country === selectedCountry && !o.locality
      );
      setResolvedOriginId(found ? found.id : null);
    } else {
      setResolvedOriginId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Country</Label>
          <Combobox
            options={countries}
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder="e.g. Sri Lanka"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Locality</Label>
          <Combobox
            options={localityOptions}
            value={selectedLocality}
            onChange={handleLocalityChange}
            placeholder="e.g. Ratnapura mine (optional)"
            disabled={!selectedCountry}
            allowFreeText={true}
          />
        </div>
      </div>
      <p className="text-xs text-zinc-400 -mt-2">
        Can&apos;t find your locality? Type it in — it&apos;ll be saved for future use.
      </p>

      {/* Hidden inputs for form submission */}
      <input type="hidden" name="originId" value={resolvedOriginId ?? ""} />
      <input type="hidden" name="originCountry" value={selectedCountry ?? ""} />
      <input type="hidden" name="originLocality" value={selectedLocality ?? ""} />
    </div>
  );
}
