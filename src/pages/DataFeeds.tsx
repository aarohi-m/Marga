import { motion } from "framer-motion";
import { Activity, ArrowRight, CheckCircle2, Database, RefreshCw, TriangleAlert } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useToast } from "@/components/ui/overlays";
import { Badge, Button, Card, Progress } from "@/components/ui/primitives";
import { dataFeeds, lineage } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const statusTone: Record<string, "green" | "amber" | "blue" | "red"> = {
  Connected: "green",
  Degraded: "amber",
  Pending: "blue",
  Failed: "red",
};

export function DataFeeds() {
  const toast = useToast();
  const connected = dataFeeds.filter((f) => f.status === "Connected").length;

  return (
    <PageContainer
      title="Data Feeds"
      subtitle="Integration health, data lineage and reconciliation"
      meta={
        <>
          <Badge tone={connected >= 5 ? "green" : "amber"} dot pulse>{connected} of {dataFeeds.length} streaming</Badge>
          <span className="text-[12px] text-sub">8.1M records/day</span>
          <span className="text-[12px] text-sub">Last reconciliation: 22 Aug 18:30 IST</span>
        </>
      }
      actions={<Button variant="primary" size="sm" icon={<RefreshCw />} onClick={() => toast("Synchronizing all feeds", { desc: "Re-sync started across 6 systems.", tone: "info" })}>Re-sync all</Button>}
    >
      {/* System cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dataFeeds.map((f, i) => {
          const tone = statusTone[f.status];
          return (
            <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="h-full p-4" hover>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={cn("flex h-10 w-10 items-center justify-center rounded-[10px]", f.status === "Failed" ? "bg-critical-soft text-critical" : f.status === "Pending" ? "bg-brand-soft text-brand" : f.status === "Degraded" ? "bg-warning-soft text-warning" : "bg-success-soft text-success")}>
                      <Database className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-display text-[15px] font-bold text-ink">{f.abbr}</div>
                      <div className="text-[11.5px] text-sub">{f.name}</div>
                    </div>
                  </div>
                  <Badge tone={tone} dot pulse={f.status === "Degraded" || f.status === "Pending"}>{f.status}</Badge>
                </div>

                <p className="mt-3 text-[12px] text-sub">{f.desc}</p>

                <div className="mt-3 space-y-2.5">
                  <div>
                    <div className="mb-1 flex justify-between text-[11.5px]"><span className="flex items-center gap-1 text-sub"><Activity className="h-3 w-3" /> Data completeness</span><span className="font-semibold text-ink">{f.completeness ? `${f.completeness}%` : "—"}</span></div>
                    <Progress value={f.completeness} tone={f.completeness > 98 ? "green" : f.completeness > 90 ? "amber" : "blue"} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <Stat label="Latency" value={f.latency ? `${f.latency}ms` : "—"} />
                    <Stat label="Volume" value={f.volume} />
                    <Stat label="Last sync" value={f.lastSync} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Data lineage */}
      <Card className="mt-4 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Database className="h-4 w-4 text-brand" />
          <span className="text-[14px] font-semibold text-ink">Data lineage</span>
          <Badge tone="green" dot className="ml-1">Flowing</Badge>
        </div>
        <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
          {lineage.map((node, i) => (
            <div key={node.label} className="flex flex-col items-center gap-2 lg:flex-1 lg:flex-row">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12 }}
                className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-center lg:flex-1"
              >
                <div className="text-[13px] font-semibold text-ink">{node.label}</div>
                <div className="text-[11px] text-sub">{node.sub}</div>
              </motion.div>
              {i < lineage.length - 1 && (
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} className="text-brand">
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Foot icon={<CheckCircle2 className="h-4 w-4 text-success" />} text="Schema validation passed" />
          <Foot icon={<CheckCircle2 className="h-4 w-4 text-success" />} text="No record loss detected" />
          <Foot icon={<TriangleAlert className="h-4 w-4 text-warning" />} text="TMS latency above SLA threshold" />
        </div>
      </Card>
    </PageContainer>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-cream py-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-faint">{label}</div>
      <div className="font-semibold text-ink-soft">{value}</div>
    </div>
  );
}

function Foot({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-line bg-cream px-3 py-2 text-[12px] text-ink-soft">
      {icon} {text}
    </div>
  );
}
