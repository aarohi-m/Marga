import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip as LTooltip,
  useMap,
  ZoomControl,
} from "react-leaflet";
import {
  Gauge,
  Layers,
  Locate,
  TrainFront,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Drawer, DrawerHeader, useToast } from "@/components/ui/overlays";
import { Badge, Button, Card, Switch } from "@/components/ui/primitives";
import { SectionLabel } from "@/components/ui/primitives";
import { sections, stations, trains, type Station } from "@/lib/mockData";
import { cn } from "@/lib/utils";

/* ---- Fix Leaflet default icon path for bundlers ---- */
// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---- Styles ---- */
const sectionColor: Record<string, string> = {
  operational: "#1557A6",
  degraded: "#C98218",
  maintenance: "#D97C0E",
  offline: "#D64545",
};

const sectionDash: Record<string, string> = {
  operational: "",
  degraded: "8 6",
  maintenance: "6 8",
  offline: "4 4",
};

const INDIA_CENTER: [number, number] = [22.5, 79.5];
const INDIA_ZOOM = 5;

/* ---- Custom SVG train marker icon factory ---- */
function trainIcon(delayed: boolean) {
  const color = delayed ? "#C98218" : "#1557A6";
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.18;animation:soft-pulse 2s ease-in-out infinite;"></div>
      <div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;">
        <div style="width:5px;height:5px;border-radius:50%;background:#fff;"></div>
      </div>
    </div>`,
  });
}

/* ---- Custom station marker ---- */
function stationIcon(major: boolean, maint: boolean) {
  const size = major ? 14 : 10;
  const stroke = maint ? "#C98218" : "#174F91";
  const fill = maint ? "#FFF7EB" : "#fff";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${fill};border:2.5px solid ${stroke};box-shadow:0 1px 4px rgba(0,0,0,0.14);"></div>`,
  });
}

/* ---- Fit to bounds controller ---- */
function FitBounds({ stations: ss }: { stations: Station[] }) {
  const map = useMap();
  useEffect(() => {
    if (ss.length < 2) return;
    const bounds = L.latLngBounds(ss.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
  }, []);
  return null;
}

/* ---- Animated train layer (moves train markers along sections) ---- */
function AnimatedTrains({ show }: { show: boolean }) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Clean up on unmount or toggle off
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!show) return;

    trains.forEach((t) => {
      const from = stations.find((s) => s.code === t.station);
      const to = stations.find((s) => s.code === t.next);
      if (!from || !to) return;

      const icon = trainIcon(t.delay > 10);
      const startLat = from.lat + (to.lat - from.lat) * t.progress;
      const startLng = from.lng + (to.lng - from.lng) * t.progress;
      const marker = L.marker([startLat, startLng], { icon, interactive: true })
        .bindTooltip(
          `<div style="font-family:Inter,sans-serif;padding:2px 4px;">
            <b>${t.no}</b> ${t.name}<br/>
            <span style="color:#667085">${t.speed} km/h · ${t.delay > 0 ? `+${t.delay}m delay` : "On time"}</span>
          </div>`,
          { direction: "top", offset: [0, -12] }
        )
        .addTo(map);

      markersRef.current.push(marker);

      // Animate
      let progress = t.progress;
      const speed = 0.003 + Math.random() * 0.002;
      let direction = 1;
      const anim = () => {
        progress += speed * direction;
        if (progress >= 1) {
          progress = 1;
          direction = -1;
        }
        if (progress <= 0) {
          progress = 0;
          direction = 1;
        }
        const lat = from.lat + (to.lat - from.lat) * progress;
        const lng = from.lng + (to.lng - from.lng) * progress;
        marker.setLatLng([lat, lng]);
      };
      const interval = setInterval(anim, 120);
      // Store cleanup
      const origRemove = marker.remove.bind(marker);
      marker.remove = () => {
        clearInterval(interval);
        return origRemove();
      };
    });
  }, [show, map]);

  return null;
}

/* ---- Main component ---- */
export function LiveNetwork() {
  const toast = useToast();
  const [selected, setSelected] = useState<Station | null>(null);
  const [show, setShow] = useState({ trains: true, maintenance: true, conflicts: true });
  const mapRef = useRef<L.Map | null>(null);

  const majorStations = useMemo(
    () => new Set(["NDLS", "BCT", "HWH", "MAS", "SBC", "SC", "BPL", "ADI", "LKO", "PNBE"]),
    []
  );

  const resetView = useCallback(() => {
    if (mapRef.current) {
      const bounds = L.latLngBounds(stations.map((s) => [s.lat, s.lng]));
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
    }
  }, []);

  const stationsByCode = useMemo(
    () => Object.fromEntries(stations.map((s) => [s.code, s])),
    []
  );

  return (
    <PageContainer
      title="Live Network"
      subtitle="Real-time railway network monitoring across India"
      meta={
        <>
          <Badge tone="green" dot pulse>Telemetry streaming</Badge>
          <span className="text-[12px] text-sub">{stations.length} stations · {sections.length} sections</span>
        </>
      }
      actions={
        <>
          <Button variant="secondary" size="sm" icon={<Locate />} onClick={resetView}>Fit Network</Button>
          <Button variant="primary" size="sm" icon={<TrainFront />} onClick={() => toast("Network snapshot exported", { desc: "Topology saved to reports." })}>Export</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        {/* Map */}
        <Card className="overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-cream px-3 py-2">
            <div className="flex items-center gap-3 text-[12px]">
              <LegendDot color="#1557A6" label="Operational" />
              <LegendDot color="#C98218" label="Maintenance" dashed />
              <LegendDot color="#D64545" label="Blocked" />
              <span className="hidden items-center gap-1.5 text-sub sm:flex">
                <TrainFront className="h-3.5 w-3.5 text-brand" /> {trains.length} trains active
              </span>
            </div>
            <span className="text-[11px] text-faint">Scroll to zoom · drag to pan</span>
          </div>

          <div className="relative h-[clamp(420px,65vh,700px)] w-full">
            <MapContainer
              center={INDIA_CENTER}
              zoom={INDIA_ZOOM}
              scrollWheelZoom
              zoomControl={false}
              attributionControl={false}
              className="h-full w-full"
              ref={mapRef}
              style={{ background: "#F3F0E7" }}
            >
              {/* Beautiful muted tile layer — CartoDB Voyager for enterprise feel */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                maxZoom={18}
              />

              <ZoomControl position="bottomright" />
              <FitBounds stations={stations} />

              {/* Railway route lines */}
              {sections.map((sec) => {
                const from = stationsByCode[sec.from];
                const to = stationsByCode[sec.to];
                if (!from || !to) return null;

                const isMaint = sec.status === "maintenance" || sec.status === "offline";
                if (isMaint && !show.maintenance) return null;

                return (
                  <Polyline
                    key={sec.id}
                    positions={[
                      [from.lat, from.lng],
                      [to.lat, to.lng],
                    ]}
                    pathOptions={{
                      color: sectionColor[sec.status],
                      weight: sec.status === "operational" ? 3.5 : 4.5,
                      opacity: sec.status === "operational" ? 0.65 : 0.9,
                      dashArray: sectionDash[sec.status] || undefined,
                      lineCap: "round",
                      lineJoin: "round",
                    }}
                  >
                    <LTooltip direction="top" sticky>
                      <div className="text-[12px]">
                        <b>{sec.id}</b> · {sec.name}<br />
                        <span className="text-sub">{sec.distance} km · {sec.speedLimit} km/h · <span className="capitalize">{sec.status}</span></span>
                      </div>
                    </LTooltip>
                  </Polyline>
                );
              })}

              {/* Station markers */}
              {stations.map((s) => {
                const isMaint = sections.some(
                  (sec) =>
                    (sec.from === s.code || sec.to === s.code) &&
                    (sec.status === "maintenance" || sec.status === "offline")
                );
                const major = majorStations.has(s.code);
                return (
                  <Marker
                    key={s.code}
                    position={[s.lat, s.lng]}
                    icon={stationIcon(major, isMaint)}
                    eventHandlers={{ click: () => setSelected(s) }}
                  >
                    <LTooltip direction="top" offset={[0, -8]}>
                      <div className="text-[12px]">
                        <b>{s.code}</b> — {s.name}
                        <br />
                        <span className="text-sub">{s.zone} Zone · {s.platforms} platforms</span>
                      </div>
                    </LTooltip>
                  </Marker>
                );
              })}

              {/* Maintenance zone pulses */}
              {show.maintenance &&
                sections
                  .filter((s) => s.status === "maintenance" || s.status === "offline")
                  .map((sec) => {
                    const from = stationsByCode[sec.from];
                    const to = stationsByCode[sec.to];
                    if (!from || !to) return null;
                    const midLat = (from.lat + to.lat) / 2;
                    const midLng = (from.lng + to.lng) / 2;
                    const color = sec.status === "offline" ? "#D64545" : "#C98218";
                    return (
                      <CircleMarker
                        key={sec.id + "-maint"}
                        center={[midLat, midLng]}
                        radius={8}
                        pathOptions={{
                          color: color,
                          fillColor: color,
                          fillOpacity: 0.2,
                          weight: 2,
                          opacity: 0.6,
                        }}
                      >
                        <LTooltip>
                          <div className="text-[12px]">
                            <b>⚠ {sec.status === "offline" ? "BLOCKED" : "MAINTENANCE"}</b><br />
                            {sec.name}
                          </div>
                        </LTooltip>
                      </CircleMarker>
                    );
                  })}

              {/* Animated train markers */}
              <AnimatedTrains show={show.trains} />
            </MapContainer>

            {/* Attribution overlay */}
            <div className="pointer-events-none absolute bottom-0 left-0 z-[400] bg-surface/70 px-2 py-0.5 text-[9px] text-faint backdrop-blur-sm">
              © CartoDB · OpenStreetMap contributors
            </div>
          </div>

          {/* Layer toggles */}
          <div className="flex flex-wrap items-center gap-4 border-t border-line px-4 py-2.5">
            <div className="flex items-center gap-2 text-[12px] font-medium text-sub">
              <Layers className="h-3.5 w-3.5" /> Layers
            </div>
            {([
              ["trains", "Trains"],
              ["maintenance", "Maintenance"],
              ["conflicts", "Conflicts"],
            ] as const).map(([k, label]) => (
              <label key={k} className="flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-ink-soft">
                <Switch
                  checked={show[k]}
                  onChange={(v) => setShow((p) => ({ ...p, [k]: v }))}
                />
                {label}
              </label>
            ))}
          </div>
        </Card>

        {/* Side summary */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-brand" />
              <span className="text-[13.5px] font-semibold text-ink">Network Snapshot</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Snapshot label="Throughput" value={String(trains.length)} sub="trains" tone="text-brand" />
              <Snapshot label="Avg speed" value="98" sub="km/h" tone="text-ink" />
              <Snapshot label="Maint" value={String(sections.filter((s) => s.status === "maintenance").length)} sub="sections" tone="text-warning" />
              <Snapshot label="Degraded" value={String(sections.filter((s) => s.status === "degraded").length)} sub="sections" tone="text-critical" />
            </div>
          </Card>

          <Card className="p-4">
            <SectionLabel className="mb-2">Affected sections</SectionLabel>
            <div className="space-y-2">
              {sections
                .filter((s) => s.status !== "operational")
                .map((s) => {
                  const toStation = stations.find((st) => st.code === s.to);
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (toStation) setSelected(toStation);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border border-line bg-cream px-3 py-2 text-left transition-colors hover:border-brand/30"
                    >
                      <div>
                        <div className="text-[13px] font-semibold text-ink">
                          {s.id} · {s.name}
                        </div>
                        <div className="text-[11.5px] text-sub">
                          {s.distance} km · {s.speedLimit} km/h limit
                        </div>
                      </div>
                      <Badge
                        tone={s.status === "offline" ? "red" : s.status === "degraded" ? "amber" : "amber"}
                        dot
                      >
                        {s.status === "offline" ? "Blocked" : s.status === "degraded" ? "Degraded" : "Maint"}
                      </Badge>
                    </button>
                  );
                })}
            </div>
          </Card>

          <Card className="p-4">
            <SectionLabel className="mb-2">Active trains</SectionLabel>
            <div className="max-h-[260px] space-y-1.5 overflow-y-auto pr-1">
              {trains.map((t) => (
                <div key={t.no} className="flex items-center justify-between rounded-lg border border-line bg-cream px-3 py-2">
                  <div>
                    <div className="text-[12.5px] font-semibold text-ink">{t.no}</div>
                    <div className="text-[11px] text-sub">{t.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-semibold tabular-nums text-ink">{t.speed} km/h</div>
                    <div className={cn("text-[11px] font-medium", t.delay > 0 ? "text-warning" : "text-success")}>
                      {t.delay > 0 ? `+${t.delay}m` : "On time"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Station drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} width={440}>
        {selected && <StationPanel station={selected} />}
      </Drawer>
    </PageContainer>
  );
}

/* ---- Sub-components ---- */

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-sub">
      <svg width="22" height="6">
        <line
          x1="0"
          y1="3"
          x2="22"
          y2="3"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={dashed ? "5 4" : "0"}
        />
      </svg>
      {label}
    </span>
  );
}

function Snapshot({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: string }) {
  return (
    <div className="rounded-xl border border-line bg-cream p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-faint">{label}</div>
      <div className={cn("mt-1 font-display text-[22px] font-extrabold leading-none", tone)}>
        {value}{" "}
        <span className="text-[12px] font-semibold text-sub">{sub}</span>
      </div>
    </div>
  );
}

function StationPanel({ station }: { station: Station }) {
  const activeTrains = trains.filter((t) => t.station === station.code || t.next === station.code);
  const affectedSections = sections.filter(
    (s) => (s.from === station.code || s.to === station.code) && s.status !== "operational"
  );

  return (
    <>
      <DrawerHeader
        title={
          <span>
            {station.name} <span className="text-sub">({station.code})</span>
          </span>
        }
        subtitle={`${station.zone} Zone · ${station.division} Division`}
        onClose={() => {}}
      />
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-2">
          <Mini label="Platforms" value={String(station.platforms)} />
          <Mini label="Active trains" value={String(activeTrains.length)} />
          <Mini label="Coord" value={`${station.lat.toFixed(1)}°N`} />
        </div>

        {affectedSections.length > 0 && (
          <div>
            <SectionLabel className="mb-2">Current issues</SectionLabel>
            {affectedSections.map((s) => (
              <div key={s.id} className="mb-2 rounded-xl border border-critical/20 bg-critical-soft/50 p-3 text-[13px]">
                <div className="flex items-center gap-2 font-semibold text-critical">
                  <Wrench className="h-4 w-4" /> {s.name} — {s.status}
                </div>
                <p className="mt-1 text-[12px] text-sub">
                  {s.distance} km · Speed limit {s.speedLimit} km/h
                </p>
              </div>
            ))}
          </div>
        )}

        <div>
          <SectionLabel className="mb-2">Upcoming arrivals</SectionLabel>
          <div className="divide-y divide-line-soft rounded-xl border border-line">
            {activeTrains.length === 0 && (
              <div className="p-3 text-[12.5px] text-sub">No active trains at this station.</div>
            )}
            {activeTrains.slice(0, 6).map((t) => (
              <div key={t.no} className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <div className="text-[13px] font-semibold text-ink">{t.no}</div>
                  <div className="text-[11.5px] text-sub">{t.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-ink tabular-nums">{t.eta}</div>
                  <div className={cn("text-[11.5px]", t.delay > 0 ? "text-warning" : "text-success")}>
                    {t.delay > 0 ? `+${t.delay}m` : "On time"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel className="mb-2">AI recommendation</SectionLabel>
          <div className="rounded-xl border border-brand/20 bg-brand-tint p-3 text-[13px] text-ink-soft">
            <span className="font-semibold text-brand-ink">Hold through path:</span> allow{" "}
            {station.code} arrivals to stage on platforms 2 & 4 while maintenance clearance completes.
          </div>
        </div>
      </div>
    </>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-cream p-2.5 text-center">
      <div className="font-display text-[20px] font-extrabold text-ink">{value}</div>
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-faint">{label}</div>
    </div>
  );
}
