import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Navigation, Clock } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";
import { assistanceCentersQuery } from "@/lib/data";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Assistance Centers Near You — HopeBridge" },
      {
        name: "description",
        content:
          "Find nearby disaster assistance centers, emergency shelters, and distribution points with services, hours, and contact details.",
      },
      { property: "og:title", content: "Assistance Centers Map — HopeBridge" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(assistanceCentersQuery());
  },
  component: MapPage,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function MapPage() {
  const { data: fetchedCenters } = useQuery(assistanceCentersQuery());
  const [centers, setCenters] = useState(fetchedCenters || []);
  
  useEffect(() => {
    if (fetchedCenters) {
      setCenters(fetchedCenters);
    }
  }, [fetchedCenters]);

  const [selectedId, setSelectedId] = useState((centers || [])[0]?.id);
  const selected = (centers || []).find((c) => c.id === selectedId) ?? (centers || [])[0];

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "dummy_key"
  });

  const mapCenter = { lat: -1.2921, lng: 36.8219 };
  const containerStyle = { width: "100%", height: "440px" };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Assistance near you
          </h1>
          <p className="mt-3 text-muted-foreground">
            Shelters, supply points, and recovery hubs — with the services they offer right
            now.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* List */}
          <div className="lg:col-span-2">
            <ul className="space-y-3" aria-label="Assistance centers">
              {(centers || []).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full rounded-2xl border p-5 text-left transition-colors ${
                      selected?.id === c.id
                        ? "border-accent bg-card ring-1 ring-accent"
                        : "border-border bg-card hover:border-accent/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-foreground">{c.name}</h2>
                      <span
                        className={`shrink-0 text-xs font-semibold ${
                          c.is_open ? "text-emerald-600" : "text-muted-foreground"
                        }`}
                      >
                        {c.is_open ? "● Open" : "Closed"}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                      {c.address}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(c.services || []).map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Map + detail */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl ring-1 ring-border">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={12}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                  }}
                >
                  {(centers || []).map(center => (
                    center.lat && center.lng ? (
                      <Marker 
                        key={center.id}
                        position={{ lat: center.lat, lng: center.lng }}
                        onClick={() => setSelectedId(center.id)}
                      />
                    ) : null
                  ))}
                </GoogleMap>
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center bg-muted md:h-[440px]">
                  Loading Map...
                </div>
              )}
              {selected && (
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-card/95 p-6 shadow-soft backdrop-blur-sm sm:left-6 sm:right-auto sm:max-w-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                      {selected.region}
                    </span>
                    {selected.is_open && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <Clock className="size-3.5" aria-hidden="true" /> Active now
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-lg font-semibold text-foreground">
                    {selected.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.address}</p>
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`} target="_blank" rel="noopener noreferrer">
                        <Navigation className="size-4" /> Get Directions
                      </a>
                    </Button>
                    {selected.phone && (
                      <Button asChild variant="outline" size="sm" aria-label="Call center">
                        <a href={`tel:${selected.phone}`}>
                          <Phone className="size-4" /> Call
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
