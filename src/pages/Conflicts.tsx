import { AnimatePresence, motion } from "framer-motion";
import { AlertOctagon, Clock, GitCompare, ListChecks, Route, Siren, Sparkles, TrainFront } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Drawer, DrawerHeader, useConfirm, useToast } from "@/components/ui/overlays";
import { Badge, Button, Card, Progress, SectionLabel, SeverityTag, Tabs } from "@/components/ui/primitives";
import { EmptyState } from "@/components/ui/feedback";
import { conflicts, type Conflict } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function Conflicts() {
  const toast = useToast();
  const confirm = useConfirm();
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState<Conflict | null>(null);

  const filtered = conflicts.filter((c) => (tab === "All" ? true : c.status === tab));

  return (
    <PageContainer
      title="Conflict Manager"
      subtitle="Detect, analyze and resolve operational conflicts"
      meta={
        <>
          <Badge tone="red" dot pulse>{conflicts.filter((c) => c.status === "Active").length} active</Badge>
          <span className="text-[12px] text-sub">{conflicts.filter((c) => c.status === "Resolved").length} resolved today</span>
        </>
      }
    >
      <Card className="overflow-hidden">
        <Tabs
          onChange={setTab}
          tabs={[
            { id: "All", label: "All", count: conflicts.length },
            { id: "Active", label: "Active", count: conflicts.filter((c) => c.status === "Active").length },
            { id: "Acknowledged", label: "Acknowledged", count: conflicts.filter((c) => c.status === "Acknowledged").length },
            { id: "Resolved", label: "Resolved", count: conflicts.filter((c) => c.status === "Resolved").length },
          ]}
        />

        <div className="p-4">
          {filtered.length === 0 ? (
            <EmptyState icon={Siren} title="No active conflicts" desc="All monitored railway sections are currently operating within expected parameters." action={<Button variant="secondary" size="sm">View Network</Button>} />
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AnimatePresence>
                {filtered.map((c) => (
                  <motion.button
                    layout
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelected(c)}
                    className={cn(
                      "flex flex-col rounded-card border bg-surface p-4 text-left shadow-card transition-colors",
                      c.severity === "critical" ? "border-critical/25 hover:border-critical/40" : "border-line hover:border-line-strong"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", c.severity === "critical" ? "bg-critical-soft text-critical" : "bg-warning-soft text-warning")}>
                          <Siren className="h-4 w-4" style={c.severity === "critical" ? { animation: "soft-pulse 2.4s ease-in-out infinite" } : undefined} />
                        </span>
                        <div>
                          <div className="text-[13.5px] font-semibold text-ink">{c.title}</div>
                          <div className="text-[11.5px] text-sub">{c.section}</div>
                        </div>
                      </div>
                      <SeverityTag severity={c.severity} />
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Badge tone={c.status === "Active" ? "red" : c.status === "Acknowledged" ? "amber" : "green"} dot>
                        {c.status}
                      </Badge>
                      {c.status === "Active" && (
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-warning">
                          <Clock className="h-3.5 w-3.5" /> T-{c.minsTo}min to conflict
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 border-t border-line-soft pt-3">
                      <TrainFront className="h-3.5 w-3.5 text-sub" />
                      <span className="text-[12px] text-sub">Trains:</span>
                      {c.trains.map((t) => (
                        <span key={t} className="rounded-md bg-sand px-1.5 py-0.5 text-[11.5px] font-semibold text-ink-soft">{t}</span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </Card>

      <Drawer open={!!selected} onClose={() => setSelected(null)} width={460}>
        {selected && <ConflictDrawer c={selected} toast={toast} confirm={confirm} />}
      </Drawer>
    </PageContainer>
  );
}

function ConflictDrawer({ c, toast, confirm }: { c: Conflict; toast: (t: string, o?: any) => void; confirm: (o: any) => Promise<boolean> }) {
  return (
    <>
      <DrawerHeader
        title={<span className="flex items-center gap-2">{c.title} <span className="text-sub">({c.id})</span></span>}
        subtitle={c.section}
        onClose={() => {}}
        right={<SeverityTag severity={c.severity} />}
      />
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-2">
          <Mini label="Risk level" value={c.risk} tone={c.risk === "critical" ? "text-critical" : "text-warning"} />
          <Mini label="Time to conflict" value={c.status === "Active" ? `${c.minsTo} min` : "—"} />
        </div>

        {/* Timeline */}
        <div>
          <SectionLabel className="mb-2">Conflict timeline</SectionLabel>
          <div className="space-y-0 rounded-xl border border-line">
            {[
              { t: "18:40", e: "Block RS005 closure initiated", tone: "amber" },
              { t: "18:52", e: "12951 & 12009 paths overlap detected", tone: "red" },
              { t: "18:55", e: "AI recommendation generated", tone: "blue" },
              { t: "now", e: "Awaiting controller acknowledgement", tone: "neutral" },
            ].map((tl, i) => (
              <div key={i} className={cn("flex items-center gap-3 px-3 py-2.5", i > 0 && "border-t border-line-soft")}>
                <span className="w-12 text-[12px] font-semibold tabular-nums text-sub">{tl.t}</span>
                <span className={cn("h-2 w-2 rounded-full", tl.tone === "red" ? "bg-critical" : tl.tone === "amber" ? "bg-warning" : tl.tone === "blue" ? "bg-brand" : "bg-sub")} />
                <span className="text-[12.5px] text-ink-soft">{tl.e}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Train paths */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-line p-3">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-ink"><GitCompare className="h-3.5 w-3.5 text-brand" /> Train paths</div>
            <div className="mt-2 space-y-1.5">
              {c.trains.map((t) => (
                <div key={t} className="flex items-center gap-2 text-[12px] text-sub">
                  <TrainFront className="h-3.5 w-3.5" /> {t}
                  <div className="h-px flex-1 bg-line-strong" />
                  <span className="text-ink-soft">contended</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line p-3">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-ink"><Route className="h-3.5 w-3.5 text-brand" /> Block availability</div>
            <div className="mt-2 space-y-2">
              <div><div className="mb-0.5 flex justify-between text-[11px] text-sub"><span>RS005</span><span className="text-critical">closed</span></div><Progress value={0} tone="red" /></div>
              <div><div className="mb-0.5 flex justify-between text-[11px] text-sub"><span>RS006</span><span className="text-success">86%</span></div><Progress value={86} tone="green" /></div>
            </div>
          </div>
        </div>

        {/* AI recommendation */}
        <div className="rounded-xl border border-brand/20 bg-brand-tint p-3">
          <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-ink"><Sparkles className="h-4 w-4" /> AI recommendation</div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">Hold 12951 Rajdhani at Kota Junction for 20 minutes, then dispatch on alternative block timing to allow 12009 to pass first.</p>
          <div className="mt-2 flex items-center gap-3 text-[11.5px] text-sub">
            <span><b className="text-brand">87%</b> confidence</span>
            <span><b className="text-ink">20 min</b> delay</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="primary" size="sm" icon={<Sparkles />} onClick={async () => { const ok = await confirm({ title: "Accept AI recommendation?", action: "Resolve conflict", impact: "Reroutes affected trains per AI plan", affected: c.trains.join(", "), section: c.section }); if (ok) toast("AI recommendation accepted", { tone: "info" }); }}>Accept AI</Button>
          <Button variant="secondary" size="sm" onClick={() => toast("Recommendation opened for modification", { tone: "info" })}>Modify</Button>
          <Button variant="secondary" size="sm" icon={<ListChecks />} onClick={() => toast("Manual intervention requested", { tone: "warning" })}>Manual</Button>
          <Button variant="danger" size="sm" icon={<AlertOctagon />} onClick={async () => { const ok = await confirm({ title: "Resolve critical conflict?", action: "Resolve conflict", impact: "Closes the active conflict record", affected: c.trains.join(", "), section: c.section, danger: true, twoStep: true }); if (ok) toast("Conflict resolved", { tone: "success" }); }}>Resolve</Button>
        </div>
      </div>
    </>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-line bg-cream p-3">
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-faint">{label}</div>
      <div className={cn("mt-0.5 text-[15px] font-bold capitalize", tone ?? "text-ink")}>{value}</div>
    </div>
  );
}
