import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, Gauge, Radio, Sparkles, Siren } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { KpiCard, RecommendationCard } from "@/components/dashboard";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { fadeUp, stagger } from "@/components/ui/feedback";
import { useToast, useConfirm } from "@/components/ui/overlays";
import { kpis, recommendations, trains } from "@/lib/mockData";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Operations() {
  const { navigate } = useApp();
  const toast = useToast();
  const confirm = useConfirm();
  const recs = recommendations;

  return (
    <PageContainer
      title="Operations Command Center"
      subtitle="Real-time railway operations monitoring and decision support"
      meta={
        <>
          <Badge tone="green" dot pulse>
            Live Monitoring Active
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-sub">
            <Clock className="h-3.5 w-3.5" /> <LiveClock />
          </span>
        </>
      }
    >
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard icon={Radio} label="Active Trains" value={kpis.activeTrains} sub="across 9 stations" tone="blue" />
        <KpiCard icon={Gauge} label="Average Speed" value={kpis.avgSpeed} suffix=" km/h" sub="network-wide" tone="green" />
        <KpiCard icon={Siren} label="Active Conflicts" value={kpis.activeConflicts} sub="2 critical" tone="red" delay={0.05} />
        <KpiCard icon={Sparkles} label="AI Recommendations" value={kpis.aiRecs} sub="1 pending review" tone="violet" delay={0.1} />
      </motion.div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Train table */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="xl:col-span-2">
          <Card>
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-semibold text-ink">Live Train Status</span>
                <Badge tone="green" dot pulse>
                  Live · auto-refresh
                </Badge>
              </div>
              <div className="hidden items-center gap-2 text-[12px] text-sub sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> {kpis.activeTrainsDelayed} delayed
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-[13px]">
                <thead>
                  <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                    <th className="px-4 py-2.5 font-semibold">Train</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                    <th className="px-3 py-2.5 font-semibold">Current Station</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Speed</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Delay</th>
                    <th className="px-3 py-2.5 font-semibold">Next Station</th>
                    <th className="px-3 py-2.5 text-right font-semibold">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map((t) => (
                    <tr key={t.no} className="border-b border-line-soft transition-colors last:border-0 hover:bg-cream">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 font-semibold text-ink">{t.no}</div>
                        <div className="text-[11.5px] text-sub">{t.name}</div>
                      </td>
                      <td className="px-3 py-3"><StatusPill status={t.status} /></td>
                      <td className="px-3 py-3 text-ink-soft">{t.station}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink-soft">{t.speed}</td>
                      <td className="px-3 py-3 text-right">
                        <span className={cn("font-semibold tabular-nums", t.delay > 15 ? "text-critical" : t.delay > 0 ? "text-warning" : "text-success")}>
                          {t.delay > 0 ? `+${t.delay}m` : "On time"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-ink-soft">{t.next}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink-soft">{t.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* AI recommendations */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="h-4 w-4 text-brand" />
            <span className="text-[13px] font-semibold text-ink">AI Recommendations</span>
            <Badge tone="amber" className="ml-auto">
              {recs.length}
            </Badge>
          </div>

          {recs.map((rec) => (
            <div key={rec.id} className="space-y-2.5">
              <RecommendationCard scope={rec.scope} title={rec.title} body={rec.body} confidence={rec.confidence} delay={rec.delay} affected={rec.affected} status={rec.status === "pending" ? "Pending" : rec.status === "accepted" ? "Accepted" : "Pending"} />
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate("explainability")}>
                  Explain
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toast("Recommendation rejected", { desc: rec.id, tone: "warning" })}>
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={async () => {
                    const ok = await confirm({
                      title: "Accept AI recommendation?",
                      action: `Dispatch ${rec.id}`,
                      impact: "Adjusts train timing across affected sections",
                      affected: `${rec.affected} train(s)`,
                      section: rec.scope,
                    });
                    if (ok) toast("AI recommendation accepted", { desc: `${rec.id} dispatched for execution.`, tone: "info" });
                  }}
                >
                  Accept
                </Button>
              </div>
            </div>
          ))}

          <Card className="p-3">
            <div className="flex items-center gap-2 text-[12px] text-sub">
              <Activity className="h-4 w-4 text-brand" />
              Optimization model rerun scheduled in <span className="font-semibold text-ink">4 min</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageContainer>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { tone: "green" | "amber" | "blue" | "red" | "neutral"; label: string }> = {
    Running: { tone: "green", label: "Running" },
    Delayed: { tone: "amber", label: "Delayed" },
    Halted: { tone: "amber", label: "Halted" },
    Departed: { tone: "blue", label: "Departed" },
    Arrived: { tone: "neutral", label: "Arrived" },
  };
  const m = map[status] ?? { tone: "neutral" as const, label: status };
  return (
    <Badge tone={m.tone} dot pulse={status === "Running"}>
      {m.label}
    </Badge>
  );
}

function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const h = t.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return (
    <span className="tabular-nums">
      {String(h12).padStart(2, "0")}:{String(t.getMinutes()).padStart(2, "0")}:{String(t.getSeconds()).padStart(2, "0")} {ampm}
    </span>
  );
}
