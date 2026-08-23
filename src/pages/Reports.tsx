import { motion } from "framer-motion";
import { BarChart3, Download, FileBarChart, FileText, History, ShieldCheck, Siren, Wrench } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useToast } from "@/components/ui/overlays";
import { Badge, Button, Card, SectionLabel } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const reportTypes = [
  { icon: BarChart3, name: "Punctuality Report", desc: "Daily & sectional on-time performance", tone: "bg-brand-soft text-brand" },
  { icon: FileBarChart, name: "Block Utilization", desc: "Block windows vs availability", tone: "bg-success-soft text-success" },
  { icon: Siren, name: "Conflict Register", desc: "Logged conflicts & resolutions", tone: "bg-critical-soft text-critical" },
  { icon: Wrench, name: "Maintenance Register", desc: "Planned & emergency maintenance", tone: "bg-warning-soft text-warning" },
  { icon: ShieldCheck, name: "AI Decision Log", desc: "Audit trail of AI recommendations", tone: "bg-violet-soft text-violet" },
  { icon: History, name: "Incident Report", desc: "Operational incident summaries", tone: "bg-sand-deep text-ink-soft" },
];

const recent = [
  { ref: "RPT-2087", name: "Weekly Punctuality — Western Main Line", period: "17–23 Aug 2026", status: "Ready" },
  { ref: "RPT-2071", name: "Conflict Register — Kota Division", period: "August 2026", status: "Ready" },
  { ref: "RPT-2054", name: "AI Decision Log — Q3 Review", period: "Jul–Sep 2026", status: "Drafting" },
  { ref: "RPT-2033", name: "Maintenance Register — Northern", period: "August 2026", status: "Ready" },
];

export function Reports() {
  const toast = useToast();
  return (
    <PageContainer
      title="Reports"
      subtitle="Operational reports and compliance records"
      meta={<Badge tone="blue" dot>Auto-generated daily</Badge>}
      actions={<Button variant="primary" size="sm" icon={<FileText />} onClick={() => toast("Report builder opened", { tone: "info" })}>Generate report</Button>}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((r, i) => (
          <motion.button
            key={r.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            onClick={() => toast(`${r.name} generated`, { tone: "success" })}
            className="rounded-card border border-line bg-surface p-4 text-left shadow-card transition-shadow hover:shadow-lift"
          >
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-[10px]", r.tone)}><r.icon className="h-5 w-5" /></div>
            <div className="mt-3 text-[14px] font-semibold text-ink">{r.name}</div>
            <p className="mt-1 text-[12.5px] text-sub">{r.desc}</p>
            <div className="mt-3 flex items-center gap-1 text-[12px] font-medium text-brand">Generate <Download className="h-3.5 w-3.5" /></div>
          </motion.button>
        ))}
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-line px-4 py-3"><SectionLabel>Recently generated</SectionLabel></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                <th className="px-4 py-2.5 font-semibold">Ref</th>
                <th className="px-3 py-2.5 font-semibold">Report</th>
                <th className="px-3 py-2.5 font-semibold">Period</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.ref} className="border-b border-line-soft transition-colors last:border-0 hover:bg-cream">
                  <td className="px-4 py-3 font-semibold text-ink">{r.ref}</td>
                  <td className="px-3 py-3 text-ink-soft">{r.name}</td>
                  <td className="px-3 py-3 text-[12px] text-sub">{r.period}</td>
                  <td className="px-3 py-3"><Badge tone={r.status === "Ready" ? "green" : "amber"} dot>{r.status}</Badge></td>
                  <td className="px-3 py-3 text-right">
                    <Button variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />} disabled={r.status !== "Ready"} onClick={() => toast(`${r.ref} downloaded`, { tone: "info" })}>Download</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
}
