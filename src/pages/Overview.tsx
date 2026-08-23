import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Clock,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Siren,
  TrainFront,
} from "lucide-react";
import { HeroTrain } from "@/components/HeroTrain";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageContainer } from "@/components/layout/PageContainer";
import { KpiCard, RecommendationCard, RecActions } from "@/components/dashboard";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { fadeUp, stagger } from "@/components/ui/feedback";
import { ChartCard, ChartTooltip, axisProps, gridProps } from "@/components/charts";
import { alerts, kpis, punctualitySeries, recommendations, trains } from "@/lib/mockData";
import { useApp } from "@/lib/store";
import { useToast } from "@/components/ui/overlays";
import { cn, timeAgo } from "@/lib/utils";

export function Overview() {
  const { navigate } = useApp();
  const toast = useToast();
  const rec = recommendations[0];

  return (
    <PageContainer
      title="Executive Overview"
      subtitle="Railway operations dashboard · Sunday, 23 August 2026"
      meta={
        <>
          <Badge tone="green" dot pulse>
            All Systems Normal
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-sub">
            <Clock className="h-3.5 w-3.5" /> Last updated: 2 min ago
          </span>
        </>
      }
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={() => navigate("operations")}>
            Open Command Center
          </Button>
          <Button variant="primary" size="sm" icon={<Activity />} onClick={() => navigate("network")}>
            Live Network
          </Button>
        </>
      }
    >
      {/* Hero — animated train */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-4 overflow-hidden rounded-card border border-line bg-cream shadow-card"
      >
        <HeroTrain />
        <div className="relative z-10 grid grid-cols-1 gap-4 p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft/90 px-2.5 py-1 text-[11.5px] font-semibold text-brand-ink backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" style={{ animation: "ring 2.4s ease-out infinite" }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              Planning cycle 34/2026 · auto-published 18:40 IST
            </div>
            <h3 className="mt-3 font-display text-[24px] font-extrabold leading-tight tracking-tight text-ink md:text-[30px] lg:text-[34px]">
              AI-powered railway operations,<br className="hidden sm:block" /> block planning and decision support.
            </h3>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-sub md:text-[14px]">
              238 engineering blocks optimised across 8 zones and 5 trunk corridors — balancing traffic density, asset condition and crew availability in real time.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button variant="primary" size="md" trailingIcon={<ArrowRight />} onClick={() => navigate("planner")}>
                Open AI Block Planner
              </Button>
              <Button variant="secondary" size="md" icon={<Siren />} onClick={() => navigate("conflicts")}>
                Review {kpis.activeConflicts} conflicts
              </Button>
              <span className="ml-1 hidden items-center gap-2 text-[12px] text-sub sm:inline-flex">
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                Planning Engine v4.2 · Healthy
              </span>
            </div>
          </div>

          {/* Right badge cluster */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="ml-auto w-full max-w-[260px] rounded-2xl border border-line bg-surface/90 p-4 shadow-card backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="text-[12px] font-semibold uppercase tracking-wide text-faint">Plan-wide confidence</div>
              </div>
              <div className="mt-2 flex items-end gap-2">
                <div className="font-display text-[36px] font-extrabold leading-none text-brand">87%</div>
                <div className="mb-1 text-[12px] font-semibold text-success">High credibility</div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "87%" }}
                  transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-brand"
                />
              </div>
              <div className="mt-2.5 text-[11.5px] leading-relaxed text-sub">
                Validated against 26 months of section running data.
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* KPI grid */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard icon={TrainFront} label="Active Trains" value={kpis.activeTrains} sub={<span className="text-warning">{kpis.activeTrainsDelayed} delayed</span>} tone="blue" delay={0} />
        <KpiCard icon={Clock} label="Avg Delay" value={kpis.avgDelay} suffix=" min" trend="3.2 min" trendGood sub="from yesterday" tone="amber" delay={0.05} />
        <KpiCard icon={Siren} label="Active Conflicts" value={kpis.activeConflicts} sub={<span className="text-critical">{kpis.activeConflictsCritical} critical</span>} tone="red" delay={0.1} />
        <KpiCard icon={HeartPulse} label="Asset Health" value={kpis.assetHealth} suffix="%" tone="green" delay={0.15} />
        <KpiCard icon={Sparkles} label="AI Recommendations" value={kpis.aiRecs} sub={<span className="text-warning">{kpis.aiRecsPending} pending review</span>} tone="violet" delay={0.2} />
      </motion.div>

      {/* Main grid */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4 xl:col-span-2">
          <ChartCard
            title="Network Punctuality"
            sub="On-time performance · last 30 days"
            action={<Badge tone="green" dot>92.1% today</Badge>}
          >
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={punctualitySeries(30)} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="punctGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1557A6" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#1557A6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="label" {...axisProps} interval={3} />
                  <YAxis {...axisProps} domain={[70, 100]} />
                  <Tooltip content={<ChartTooltip suffix="%" />} />
                  <Area type="monotone" dataKey="punctuality" stroke="#1557A6" strokeWidth={2.5} fill="url(#punctGrad)" dot={false} activeDot={{ r: 4 }} />
                  <Area type="monotone" dataKey="target" stroke="#C98218" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Live train snapshot */}
          <Card>
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-semibold text-ink">Live Train Status</span>
                <Badge tone="green" dot pulse>
                  Live
                </Badge>
              </div>
              <Button variant="ghost" size="sm" trailingIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => navigate("operations")}>
                View all
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-[13px]">
                <thead>
                  <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                    <th className="px-4 py-2 font-semibold">Train</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Station</th>
                    <th className="px-3 py-2 text-right font-semibold">Speed</th>
                    <th className="px-3 py-2 text-right font-semibold">Delay</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.slice(0, 6).map((t) => (
                    <tr key={t.no} className="border-b border-line-soft transition-colors last:border-0 hover:bg-cream">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-ink">{t.no}</div>
                        <div className="text-[11.5px] text-sub">{t.name}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusDot status={t.status} />
                      </td>
                      <td className="px-3 py-2.5 text-ink-soft">{t.station}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-ink-soft">{t.speed} km/h</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={cn("font-semibold tabular-nums", t.delay > 15 ? "text-critical" : t.delay > 0 ? "text-warning" : "text-success")}>
                          {t.delay > 0 ? `+${t.delay}` : "On time"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <RecommendationCard scope={rec.scope} title={rec.title} body={rec.body} confidence={rec.confidence} delay={rec.delay} affected={rec.affected} status="Pending" />
          <div className="rounded-card border border-brand/20 bg-brand-tint p-3">
            <RecActions
              onReview={() => navigate("explainability")}
              onAccept={() => toast("AI recommendation accepted", { desc: `${rec.id} dispatched for execution.`, tone: "info" })}
              onReject={() => toast("Recommendation rejected", { desc: "Logged for review.", tone: "warning" })}
            />
          </div>

          {/* Alerts */}
          <Card>
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-[13.5px] font-semibold text-ink">Priority Alerts</span>
              <Button variant="ghost" size="sm" onClick={() => navigate("alerts")}>
                View all
              </Button>
            </div>
            <div className="divide-y divide-line-soft">
              {alerts.slice(0, 4).map((a) => (
                <button key={a.id} onClick={() => navigate("alerts")} className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-cream">
                  <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", a.severity === "critical" ? "bg-critical" : a.severity === "high" ? "bg-warning" : "bg-sub")} style={a.severity === "critical" ? { animation: "soft-pulse 2.2s ease-in-out infinite" } : undefined} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-ink">{a.title}</div>
                    <div className="mt-0.5 text-[11.5px] text-sub">{a.location} · {timeAgo(a.ts)}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* System health */}
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span className="text-[13.5px] font-semibold text-ink">System Health</span>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Operational data", v: 99 },
                { label: "Planning engine", v: 88 },
                { label: "Notification pipeline", v: 97 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span className="text-sub">{s.label}</span>
                    <span className="font-semibold text-ink">{s.v}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-sand">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.v}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full bg-success/70" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>
    </PageContainer>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, { c: string; t: string }> = {
    Running: { c: "text-success", t: "Running" },
    Delayed: { c: "text-warning", t: "Delayed" },
    Halted: { c: "text-warning", t: "Halted" },
    Departed: { c: "text-brand", t: "Departed" },
    Arrived: { c: "text-sub", t: "Arrived" },
  };
  const m = map[status] ?? { c: "text-sub", t: status };
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12.5px] font-medium", m.c)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" style={status === "Running" ? { animation: "soft-pulse 2.4s ease-in-out infinite" } : undefined} />
      {m.t}
    </span>
  );
}
