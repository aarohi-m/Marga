import { motion } from "framer-motion";
import { ArrowUpDown, HeartPulse, Search, SlidersHorizontal, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Drawer, DrawerHeader, useToast } from "@/components/ui/overlays";
import { Badge, Button, Card, Progress, StatusBadge, Tabs } from "@/components/ui/primitives";
import { assets, type Asset, type Status } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type SortKey = "health" | "util" | "name";

export function Assets() {
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("health");
  const [asc, setAsc] = useState(false);
  const [selected, setSelected] = useState<Asset | null>(null);

  const filtered = useMemo(() => {
    let list = assets.filter((a) => (tab === "all" ? true : a.status === tab));
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((a) => (a.name + a.type + a.location).toLowerCase().includes(s));
    }
    list = [...list].sort((a, b) => {
      const dir = asc ? 1 : -1;
      if (sort === "name") return a.name.localeCompare(b.name) * (asc ? 1 : -1);
      return (a[sort] - b[sort]) * dir;
    });
    return list;
  }, [tab, q, sort, asc]);

  const counts = (s: Status | "all") => (s === "all" ? assets.length : assets.filter((a) => a.status === s).length);

  const toggleSort = (k: SortKey) => {
    if (sort === k) setAsc(!asc);
    else {
      setSort(k);
      setAsc(false);
    }
  };

  return (
    <PageContainer
      title="Asset Availability"
      subtitle="Track, signal, platform and equipment status"
      meta={<><Badge tone="green" dot>{counts("operational")} operational</Badge><span className="text-[12px] text-sub">{assets.length} assets monitored</span></>}
      actions={<Button variant="secondary" size="sm" icon={<SlidersHorizontal />} onClick={() => toast("Filters panel", { tone: "info" })}>Advanced filters</Button>}
    >
      <Card className="overflow-hidden">
        <Tabs
          onChange={setTab}
          tabs={[
            { id: "all", label: "All Assets", count: counts("all") },
            { id: "operational", label: "Operational", count: counts("operational") },
            { id: "degraded", label: "Degraded", count: counts("degraded") },
            { id: "maintenance", label: "In Maintenance", count: counts("maintenance") },
            { id: "offline", label: "Out of Service", count: counts("offline") },
          ]}
        />

        <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sub" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search assets, types, locations…"
              className="h-9 w-full rounded-lg border border-line bg-cream pl-9 pr-3 text-[13px] text-ink outline-none placeholder:text-faint focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="flex items-center gap-2 text-[12px] text-sub">
            <span>{filtered.length} results</span>
            <span className="text-line-strong">·</span>
            <span>Sorted by {sort}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                <th className="px-4 py-2.5 font-semibold">
                  <SortBtn label="Asset" k="name" sort={sort} asc={asc} onClick={toggleSort} />
                </th>
                <th className="px-3 py-2.5 font-semibold">Type</th>
                <th className="px-3 py-2.5 font-semibold">Location</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold"><SortBtn label="Health" k="health" sort={sort} asc={asc} onClick={toggleSort} /></th>
                <th className="px-3 py-2.5 font-semibold"><SortBtn label="Utilization" k="util" sort={sort} asc={asc} onClick={toggleSort} /></th>
                <th className="px-3 py-2.5 font-semibold">Last inspection</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(a)}
                  className="cursor-pointer border-b border-line-soft transition-colors last:border-0 hover:bg-cream"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{a.name}</div>
                    <div className="text-[11.5px] text-sub">{a.id}</div>
                  </td>
                  <td className="px-3 py-3"><span className="rounded-md bg-sand px-2 py-0.5 text-[11.5px] font-medium text-ink-soft">{a.type}</span></td>
                  <td className="px-3 py-3 text-ink-soft">{a.location}</td>
                  <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16"><Progress value={a.health} tone={a.health > 80 ? "green" : a.health > 60 ? "amber" : "red"} /></div>
                      <span className="w-8 text-[12px] font-semibold tabular-nums text-ink-soft">{a.health}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16"><Progress value={a.util} tone="blue" /></div>
                      <span className="w-8 text-[12px] font-semibold tabular-nums text-ink-soft">{a.util}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-sub">{a.lastInspection}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer open={!!selected} onClose={() => setSelected(null)} width={420}>
        {selected && <AssetDrawer a={selected} toast={toast} />}
      </Drawer>
    </PageContainer>
  );
}

function SortBtn({ label, k, sort, asc, onClick }: { label: string; k: SortKey; sort: string; asc: boolean; onClick: (k: SortKey) => void }) {
  const active = sort === k;
  return (
    <button onClick={() => onClick(k)} className={cn("inline-flex items-center gap-1 font-semibold uppercase tracking-wide transition-colors", active ? "text-brand" : "hover:text-ink")}>
      {label}
      <ArrowUpDown className={cn("h-3 w-3", active ? "text-brand" : "text-faint")} style={active && asc ? { transform: "rotate(180deg)" } : undefined} />
    </button>
  );
}

function AssetDrawer({ a, toast }: { a: Asset; toast: (t: string, o?: any) => void }) {
  return (
    <>
      <DrawerHeader title={a.name} subtitle={`${a.type} · ${a.id}`} onClose={() => {}} right={<StatusBadge status={a.status} />} />
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-2">
          <Mini label="Location" value={a.location} />
          <Mini label="Last inspection" value={a.lastInspection} />
        </div>
        <div className="space-y-3 rounded-xl border border-line p-4">
          <div>
            <div className="mb-1 flex justify-between text-[12.5px]"><span className="flex items-center gap-1.5 text-sub"><HeartPulse className="h-4 w-4" /> Health score</span><span className="font-semibold text-ink">{a.health}%</span></div>
            <Progress value={a.health} tone={a.health > 80 ? "green" : a.health > 60 ? "amber" : "red"} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12.5px]"><span className="text-sub">Utilization</span><span className="font-semibold text-ink">{a.util}%</span></div>
            <Progress value={a.util} tone="blue" />
          </div>
        </div>
        <div className="rounded-xl border border-line bg-cream p-3 text-[12.5px] text-sub">
          <div className="flex items-center gap-1.5 font-semibold text-ink"><Wrench className="h-4 w-4 text-brand" /> Maintenance status</div>
          <p className="mt-1">{a.status === "maintenance" ? "Currently under scheduled maintenance. Crew on site." : a.status === "offline" ? "Marked out of service pending inspection." : "No active maintenance. Next inspection scheduled."}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={() => toast("Inspection scheduled", { tone: "info" })}>Schedule inspection</Button>
          <Button variant="primary" size="sm" onClick={() => toast("Work order created", { tone: "success" })}>Create work order</Button>
        </div>
      </div>
    </>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-cream p-3">
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-0.5 text-[13.5px] font-semibold text-ink">{value}</div>
    </div>
  );
}
