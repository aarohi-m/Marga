import { AnimatePresence, motion } from "framer-motion";
import { BellRing, CheckCheck, Clock, MapPin, ShieldAlert, TrainFront, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useToast } from "@/components/ui/overlays";
import { Badge, Button, Card, SeverityTag, Tabs } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/feedback";
import { alerts as seed, type Alert } from "@/lib/mockData";
import { cn, timeAgo } from "@/lib/utils";

const meta = {
  critical: { icon: ShieldAlert, color: "text-critical", bg: "bg-critical-soft" },
  high: { icon: TriangleAlert, color: "text-warning", bg: "bg-warning-soft" },
  medium: { icon: BellRing, color: "text-brand", bg: "bg-brand-soft" },
  low: { icon: BellRing, color: "text-sub", bg: "bg-sand" },
} as const;

export function Alerts() {
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [items, setItems] = useState<Alert[]>(seed);

  const filtered = items.filter((a) => (tab === "all" ? true : a.status.toLowerCase() === tab));
  const counts = (k: string) => (k === "all" ? items.length : items.filter((a) => a.status.toLowerCase() === k).length);

  const ack = (id: string) => setItems((p) => p.map((a) => (a.id === id ? { ...a, status: "Acknowledged" } : a)));
  const resolve = (id: string) => setItems((p) => p.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a)));
  const markAll = () => setItems((p) => p.map((a) => ({ ...a, status: a.status === "Unread" ? "Read" : a.status })));

  return (
    <PageContainer
      title="Alerts & Notifications"
      subtitle="Operational alerts, warnings and acknowledgements"
      meta={<><Badge tone="red" dot pulse>{counts("unread")} unread</Badge><span className="text-[12px] text-sub">{counts("acknowledged")} acknowledged</span></>}
      actions={<Button variant="secondary" size="sm" icon={<CheckCheck />} onClick={() => { markAll(); toast("All alerts marked read", { tone: "info" }); }}>Mark all read</Button>}
    >
      <Card className="overflow-hidden">
        <Tabs
          onChange={setTab}
          tabs={[
            { id: "all", label: "All Alerts", count: counts("all") },
            { id: "unread", label: "Unread", count: counts("unread") },
            { id: "read", label: "Read", count: counts("read") },
            { id: "acknowledged", label: "Acknowledged", count: counts("acknowledged") },
            { id: "resolved", label: "Resolved", count: counts("resolved") },
          ]}
        />

        <div className="divide-y divide-line">
          {filtered.length === 0 ? (
            <EmptyState icon={BellRing} title="No alerts here" desc="There are no alerts matching this filter. The network is operating normally." />
          ) : (
            <AnimatePresence>
              {filtered.map((a) => {
                const m = meta[a.severity];
                const unread = a.status === "Unread";
                return (
                  <motion.div
                    layout
                    key={a.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn("flex flex-col gap-3 p-4 transition-colors hover:bg-cream sm:flex-row sm:items-start", unread && "bg-brand-tint/50")}
                  >
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", m.bg, m.color)}>
                      <m.icon className="h-[18px] w-[18px]" style={a.severity === "critical" ? { animation: "soft-pulse 2.4s ease-in-out infinite" } : undefined} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {unread && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                        <span className="text-[14px] font-semibold text-ink">{a.title}</span>
                        <SeverityTag severity={a.severity} />
                        <Badge tone="slate">{a.status}</Badge>
                      </div>
                      <p className="mt-1 text-[13px] text-sub">{a.desc}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-faint">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.location}</span>
                        {a.train && <span className="inline-flex items-center gap-1"><TrainFront className="h-3 w-3" /> {a.train}</span>}
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(a.ts)}</span>
                        {a.clearance && <span className="font-semibold text-warning">Est. clearance: {a.clearance}</span>}
                      </div>
                      {a.affected && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {a.affected.map((x) => <span key={x} className="rounded-md bg-sand px-1.5 py-0.5 text-[11px] font-medium text-ink-soft">{x}</span>)}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-1.5 sm:flex-col">
                      {a.status !== "Acknowledged" && a.status !== "Resolved" && (
                        <Button variant="secondary" size="sm" onClick={() => { ack(a.id); toast("Alert acknowledged", { desc: a.title, tone: "info" }); }}>Acknowledge</Button>
                      )}
                      {a.status !== "Resolved" && (
                        <Button variant="ghost" size="sm" onClick={() => { resolve(a.id); toast("Alert resolved", { tone: "success" }); }}>Resolve</Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
