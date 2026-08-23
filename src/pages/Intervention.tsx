import { motion } from "framer-motion";
import { CheckCircle2, ClipboardCheck, Clock, OctagonAlert, Plus, ShieldAlert } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useConfirm, useToast } from "@/components/ui/overlays";
import { Avatar, Badge, Button, Card, SeverityTag } from "@/components/ui/primitives";
import { interventions } from "@/lib/mockData";

const statusTone: Record<string, "green" | "amber" | "red"> = {
  Executed: "green",
  "Pending Review": "amber",
  Reverted: "red",
};

export function Intervention() {
  const toast = useToast();
  const confirm = useConfirm();

  const newIntervention = async (critical: boolean) => {
    const ok = await confirm({
      title: critical ? "Confirm critical intervention" : "Log manual intervention",
      action: critical ? "Close section" : "Apply speed restriction",
      impact: critical ? "Closes a live operational section to traffic" : "Temporarily restricts train speed",
      affected: "12951, 12009",
      section: "RS005 · Kota–Agra",
      reason: true,
      danger: critical,
      twoStep: critical,
    });
    if (ok) toast("Manual intervention logged", { desc: "Recorded to audit trail.", tone: "success" });
  };

  return (
    <PageContainer
      title="Manual Intervention"
      subtitle="Controlled manual override and emergency operations"
      meta={<Badge tone="amber" dot pulse>1 active override</Badge>}
      actions={
        <>
          <Button variant="secondary" size="sm" icon={<Plus />} onClick={() => newIntervention(false)}>Speed restriction</Button>
          <Button variant="danger" size="sm" icon={<ShieldAlert />} onClick={() => newIntervention(true)}>Critical override</Button>
        </>
      }
    >
      {/* KPIs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4"><div className="flex items-center gap-2"><OctagonAlert className="h-4 w-4 text-warning" /><span className="text-[12px] font-semibold uppercase tracking-wide text-sub">Active interventions</span></div><div className="mt-2 font-display text-[28px] font-extrabold text-ink">1</div><div className="text-[12px] text-sub">RS005 section closure</div></Card>
        <Card className="p-4"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /><span className="text-[12px] font-semibold uppercase tracking-wide text-sub">Executed today</span></div><div className="mt-2 font-display text-[28px] font-extrabold text-ink">14</div><div className="text-[12px] text-sub">All within authority</div></Card>
        <Card className="p-4"><div className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-warning" /><span className="text-[12px] font-semibold uppercase tracking-wide text-sub">Pending review</span></div><div className="mt-2 font-display text-[28px] font-extrabold text-ink">1</div><div className="text-[12px] text-sub">Awaiting DEN sign-off</div></Card>
      </motion.div>

      {/* Log */}
      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-line px-4 py-3 text-[13.5px] font-semibold text-ink">Intervention log</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                <th className="px-4 py-2.5 font-semibold">Action</th>
                <th className="px-3 py-2.5 font-semibold">Operator</th>
                <th className="px-3 py-2.5 font-semibold">Timestamp</th>
                <th className="px-3 py-2.5 font-semibold">Severity</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {interventions.map((it, i) => (
                <motion.tr key={it.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-line-soft transition-colors last:border-0 hover:bg-cream">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{it.action}</div>
                    <div className="text-[11.5px] text-sub">{it.id}</div>
                  </td>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><Avatar initials={it.operator.split(" ").map((x) => x[0]).join("")} size={24} /><span className="text-ink-soft">{it.operator}</span></div></td>
                  <td className="px-3 py-3 text-[12px] text-sub">{it.ts}</td>
                  <td className="px-3 py-3"><SeverityTag severity={it.severity} /></td>
                  <td className="px-3 py-3"><Badge tone={statusTone[it.status]} dot pulse={it.status === "Pending Review"}>{it.status}</Badge></td>
                  <td className="px-3 py-3 text-[12px] text-sub">{it.result}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 border-t border-line bg-cream px-4 py-2.5 text-[11.5px] text-sub">
          <Clock className="h-3.5 w-3.5" /> All interventions are cryptographically signed and written to the immutable audit log.
        </div>
      </Card>
    </PageContainer>
  );
}
