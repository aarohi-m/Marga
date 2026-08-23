import { motion } from "framer-motion";
import { CalendarClock, Clock, Hammer, HardHat, Pencil, RefreshCw, Wrench } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useToast } from "@/components/ui/overlays";
import { Badge, Button, Card, Segmented, Tabs } from "@/components/ui/primitives";
import { maintenance, type Maintenance as M } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const typeTone: Record<M["type"], "blue" | "violet" | "green" | "red"> = {
  Planned: "blue",
  Renewal: "violet",
  Inspection: "green",
  Emergency: "red",
};
const statusTone: Record<M["status"], "amber" | "blue" | "green"> = {
  Active: "amber",
  Upcoming: "blue",
  Completed: "green",
};

export function Maintenance() {
  const toast = useToast();
  const [tab, setTab] = useState("All");
  const [view, setView] = useState("cards");

  const filtered = maintenance.filter((m) => (tab === "All" ? true : m.status === tab));

  return (
    <PageContainer
      title="Maintenance Planning"
      subtitle="Planned, active and completed maintenance operations"
      meta={
        <>
          <Badge tone="amber" dot pulse>{maintenance.filter((m) => m.status === "Active").length} active</Badge>
          <span className="text-[12px] text-sub">{maintenance.filter((m) => m.status === "Upcoming").length} upcoming</span>
        </>
      }
      actions={<Button variant="primary" size="sm" icon={<Wrench />} onClick={() => toast("Maintenance request created", { tone: "success" })}>New request</Button>}
    >
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            onChange={setTab}
            tabs={[
              { id: "All", label: "All" },
              { id: "Active", label: "Active" },
              { id: "Upcoming", label: "Upcoming" },
              { id: "Completed", label: "Completed" },
            ]}
          />
          <Segmented value={view} onChange={setView} options={[{ id: "cards", label: "Cards" }, { id: "timeline", label: "Timeline" }]} />
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "rounded-card border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift",
                  m.type === "Emergency" ? "border-critical/25" : "border-line"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-[9px]", m.type === "Emergency" ? "bg-critical-soft text-critical" : m.type === "Renewal" ? "bg-violet-soft text-violet" : m.type === "Inspection" ? "bg-success-soft text-success" : "bg-brand-soft text-brand")}>
                      <Hammer className="h-[18px] w-[18px]" />
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold text-ink">{m.section}</div>
                      <div className="text-[12.5px] text-sub">{m.title}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge tone={typeTone[m.type]} dot pulse={m.status === "Active"}>{m.type}</Badge>
                    <Badge tone={statusTone[m.status]} dot>{m.status}</Badge>
                  </div>
                </div>

                <p className="mt-3 text-[13px] leading-relaxed text-sub">{m.desc}</p>

                <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-[12px]">
                  <Row icon={<CalendarClock className="h-3.5 w-3.5" />} value={m.window} />
                  <Row icon={<Clock className="h-3.5 w-3.5" />} value={m.downtime} />
                </div>

                <div className="mt-2 flex items-start gap-2 rounded-lg bg-warning-soft/60 px-3 py-2 text-[12px] text-ink-soft">
                  <HardHat className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                  {m.impact}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                  <span className="text-[11.5px] text-sub">{m.team}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => toast("Maintenance opened", { desc: m.id, tone: "info" })}>Edit</Button>
                    <Button variant="ghost" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => toast("Maintenance rescheduled", { tone: "info" })}>Reschedule</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}

function Row({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-surface px-3 py-2 text-ink-soft">
      <span className="text-sub">{icon}</span> {value}
    </div>
  );
}
