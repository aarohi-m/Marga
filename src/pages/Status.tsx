import { motion } from "framer-motion";
import { Activity, Cpu, Info, ServerCog, ShieldCheck, Wifi } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge, Card, Progress, SectionLabel } from "@/components/ui/primitives";

const components = [
  { icon: Activity, name: "Operational Data", sub: "COA / FOIS / ICMS ingestion", status: "Available" },
  { icon: Cpu, name: "Simulation Engine", sub: "Planning model v4.2", status: "Running" },
  { icon: Wifi, name: "Notification Pipeline", sub: "Realtime event bus", status: "Healthy" },
  { icon: ServerCog, name: "Frontend Diagnostics", sub: "Client runtime checks", status: "No active faults" },
];

export function Status() {
  return (
    <PageContainer
      title="System Status"
      subtitle="Platform health, diagnostics and controlled demonstration"
      meta={<Badge tone="green" dot pulse>All systems operational</Badge>}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* Checks */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="border-b border-line px-4 py-3"><SectionLabel>Operational checks</SectionLabel></div>
            <div className="divide-y divide-line">
              {components.map((c, i) => (
                <motion.div key={c.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-soft text-success"><c.icon className="h-[18px] w-[18px]" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-ink">{c.name}</div>
                    <div className="text-[11.5px] text-sub">{c.sub}</div>
                  </div>
                  <Badge tone="green" dot>{c.status}</Badge>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2"><Info className="h-4 w-4 text-brand" /><span className="text-[13.5px] font-semibold text-ink">Controlled demonstration</span></div>
            <p className="text-[13px] leading-relaxed text-sub">MARGA remains a frontend-only experience and uses simulated operational data. No backend services are required and no live railway signals are issued from this interface. All actions are locally recorded for demonstration of the workflow.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="blue" dot>Simulated data</Badge>
              <Badge tone="slate">No live dispatch</Badge>
              <Badge tone="green"><ShieldCheck className="mr-1 h-3 w-3" /> Sandbox mode</Badge>
            </div>
          </Card>
        </div>

        {/* Availability */}
        <div className="space-y-4">
          <Card className="flex flex-col items-center p-6">
            <div className="relative h-[150px] w-[150px]">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#E7E2D6" strokeWidth="9" />
                <motion.circle cx="50" cy="50" r="42" fill="none" stroke="#18845B" strokeWidth="9" strokeLinecap="round" strokeDasharray={2 * Math.PI * 42} initial={{ strokeDashoffset: 2 * Math.PI * 42 }} animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.9998) }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-[26px] font-extrabold text-ink">99.98%</span>
                <span className="text-[10.5px] font-semibold uppercase tracking-wide text-faint">available</span>
              </div>
            </div>
            <div className="mt-2 text-center text-[13px] font-semibold text-ink">Interface Availability</div>
            <div className="text-[11.5px] text-sub">Rolling 30-day uptime</div>
          </Card>

          <Card className="p-4">
            <SectionLabel className="mb-3">Service metrics</SectionLabel>
            <div className="space-y-3">
              {[
                { label: "API response (p95)", v: 92, display: "92 ms" },
                { label: "Websocket stability", v: 99, display: "99%" },
                { label: "Cache hit rate", v: 96, display: "96%" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="mb-1 flex justify-between text-[12.5px]"><span className="text-sub">{m.label}</span><span className="font-semibold text-ink">{m.display}</span></div>
                  <Progress value={m.v} tone="blue" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
