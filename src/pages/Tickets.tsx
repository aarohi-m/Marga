import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { GripVertical, Plus, Tag } from "lucide-react";
import { useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useToast } from "@/components/ui/overlays";
import { Avatar, Badge, Button, SeverityTag } from "@/components/ui/primitives";
import { tickets as seed, type Ticket } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const columns = [
  { id: "todo", title: "To Do", accent: "#98A2B3" },
  { id: "progress", title: "In Progress", accent: "#1557A6" },
  { id: "review", title: "In Review", accent: "#C98218" },
  { id: "done", title: "Done", accent: "#18845B" },
] as const;

type ColId = (typeof columns)[number]["id"];

export function Tickets() {
  const toast = useToast();
  const [items, setItems] = useState<Ticket[]>(seed);
  const [dragId, setDragId] = useState<string | null>(null);
  const colRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const move = (id: string, target: ColId) => {
    setItems((prev) => {
      const found = prev.find((t) => t.id === id);
      if (!found || found.status === target) return prev;
      toast("Ticket moved", { desc: `${id} → ${columns.find((c) => c.id === target)?.title}`, tone: "info" });
      return prev.map((t) => (t.id === id ? { ...t, status: target } : t));
    });
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const point = info.point;
    for (const col of columns) {
      const el = colRefs.current[col.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom) {
        if (dragId) move(dragId, col.id);
        break;
      }
    }
    setDragId(null);
  };

  return (
    <PageContainer
      title="Operations Tickets"
      subtitle="Track and prioritise operational work items"
      meta={<><Badge tone="amber" dot>{items.filter((t) => t.status !== "done").length} open</Badge><span className="text-[12px] text-sub">{items.length} total</span></>}
      actions={<Button variant="primary" size="sm" icon={<Plus />} onClick={() => toast("New ticket draft", { tone: "info" })}>New ticket</Button>}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const colItems = items.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              ref={(el) => { colRefs.current[col.id] = el; }}
              className={cn("flex flex-col rounded-card border bg-cream/60 transition-colors", dragId ? "border-line-strong" : "border-line")}
            >
              <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: col.accent }} />
                  <span className="text-[13px] font-semibold text-ink">{col.title}</span>
                  <span className="rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-sub ring-1 ring-line">{colItems.length}</span>
                </div>
              </div>

              <div className="flex-1 space-y-2 p-2" style={{ minHeight: 200 }}>
                <AnimatePresence>
                  {colItems.map((t) => (
                    <motion.div
                      layout
                      layoutId={t.id}
                      key={t.id}
                      drag
                      dragSnapToOrigin
                      dragElastic={0.12}
                      dragMomentum={false}
                      whileDrag={{ scale: 1.05, rotate: 1, zIndex: 50, cursor: "grabbing", boxShadow: "0 12px 28px rgba(20,32,51,0.16)" }}
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={onDragEnd}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      className="group cursor-grab rounded-xl border border-line bg-surface p-3 shadow-card active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[13px] font-semibold leading-snug text-ink">{t.title}</span>
                        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <SeverityTag severity={t.priority} />
                        <span className="inline-flex items-center gap-1 rounded-md bg-sand px-1.5 py-0.5 text-[10.5px] font-semibold text-sub"><Tag className="h-2.5 w-2.5" />{t.zone}</span>
                        <span className="ml-auto rounded-md bg-brand-soft px-1.5 py-0.5 text-[10.5px] font-bold text-brand-ink">{t.points} pts</span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5 border-t border-line-soft pt-2">
                        <Avatar initials={t.assignee.split(" ").map((x) => x[0]).join("").slice(0, 2)} size={22} />
                        <span className="text-[11.5px] text-sub">{t.assignee}</span>
                        <span className="ml-auto text-[10.5px] font-medium text-faint">{t.id}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
