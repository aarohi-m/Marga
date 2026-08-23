import { motion } from "framer-motion";
import { Activity, ArrowDownRight, Gauge, Percent, Sparkles } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, Segmented } from "@/components/ui/primitives";
import { AnimatedNumber } from "@/components/ui/feedback";
import { ChartCard, ChartTooltip, axisProps, gridProps } from "@/components/charts";
import { acceptanceSeries, assetHealthDist, delaySeries, punctualitySeries, utilizationSeries } from "@/lib/mockData";

const conflictFreq = [
  { label: "Mon", v: 4 }, { label: "Tue", v: 7 }, { label: "Wed", v: 3 }, { label: "Thu", v: 9 }, { label: "Fri", v: 12 }, { label: "Sat", v: 6 }, { label: "Sun", v: 2 },
];

export function Analytics() {
  const [range, setRange] = useState("30");
  const days = Number(range);
  const ph = punctualitySeries(days);

  return (
    <PageContainer
      title="Operations Analytics"
      subtitle="Performance trends and operational insights"
      meta={<Segmented value={range} onChange={setRange} options={[{ id: "7", label: "Last 7 days" }, { id: "30", label: "Last 30 days" }, { id: "90", label: "Last 90 days" }]} />}
    >
      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={Percent} label="Punctuality" value={92} suffix="%" trend="+1.4%" tone="text-success" />
        <Kpi icon={Activity} label="Avg delay" value={12} suffix=" min" trend="-3.2 min" tone="text-success" />
        <Kpi icon={Gauge} label="Network efficiency" value={88} suffix="%" trend="+0.8%" tone="text-success" />
        <Kpi icon={Sparkles} label="AI acceptance" value={84} suffix="%" trend="+4%" tone="text-success" />
      </motion.div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Train Punctuality" sub="On-time performance vs target">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ph} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="label" {...axisProps} interval={Math.floor(ph.length / 6)} />
                <YAxis {...axisProps} domain={[70, 100]} />
                <Tooltip content={<ChartTooltip suffix="%" />} />
                <Line type="monotone" dataKey="punctuality" stroke="#1557A6" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="#C98218" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Average Delay Trend" sub="Minutes behind schedule">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={delaySeries(days)} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="label" {...axisProps} interval={Math.floor(days / 6)} />
                <YAxis {...axisProps} />
                <Tooltip content={<ChartTooltip suffix=" min" />} />
                <defs>
                  <linearGradient id="delayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C98218" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#C98218" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="delay" stroke="#C98218" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Block Utilization" sub="By maintenance activity type">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationSeries(Math.min(days, 12))} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="label" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F3F0E7" }} />
                <Bar dataKey="maintenance" stackId="a" fill="#1557A6" radius={[0, 0, 0, 0]} maxBarSize={36} />
                <Bar dataKey="renewal" stackId="a" fill="#6B54B8" maxBarSize={36} />
                <Bar dataKey="inspection" stackId="a" fill="#18845B" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ChartCard title="Asset Health" sub="Distribution">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={assetHealthDist()} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={2} stroke="none">
                    {assetHealthDist().map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip suffix="%" />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              {assetHealthDist().map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[11.5px] text-sub">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} /> {d.name} <span className="ml-auto font-semibold text-ink">{d.value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="AI Acceptance" sub="Recommendation uptake">
            <div className="flex h-[180px] items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={acceptanceSeries(Math.min(days, 13))} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="label" {...axisProps} />
                  <YAxis {...axisProps} domain={[50, 100]} />
                  <Tooltip content={<ChartTooltip suffix="%" />} />
                  <Line type="monotone" dataKey="rate" stroke="#6B54B8" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Conflict Frequency" sub="Detected conflicts per day">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conflictFreq} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="label" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F3F0E7" }} />
                <Bar dataKey="v" fill="#D64545" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </PageContainer>
  );
}

function Kpi({ icon: Icon, label, value, suffix, trend, tone }: { icon: any; label: string; value: number; suffix: string; trend: string; tone: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand"><Icon className="h-4 w-4" /></span>
        <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-success"><ArrowDownRight className="h-3 w-3 rotate-45" />{trend}</span>
      </div>
      <div className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-sub">{label}</div>
      <div className="mt-0.5 font-display text-[26px] font-extrabold text-ink"><AnimatedNumber value={value} suffix={suffix} /></div>
      <div className={"text-[11px] " + tone}>{tone.includes("success") ? "improving" : ""}</div>
    </Card>
  );
}
