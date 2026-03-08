import { originsApi } from "@/lib/api";
import { MapClientWrapper } from "@/components/map/map-client-wrapper";
import type { OriginMapDto } from "@/lib/types";

export default async function MapPage() {
  let origins: OriginMapDto[] = [];
  try {
    origins = await originsApi.mapData();
  } catch {
    // show empty map
  }

  return (
    <div className="-m-8 flex flex-col" style={{ height: "100vh" }}>
      <MapClientWrapper origins={origins} />
    </div>
  );
}
