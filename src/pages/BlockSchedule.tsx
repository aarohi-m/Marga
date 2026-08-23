import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Pencil,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrainFront,
  Users,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Drawer, DrawerHeader, useConfirm, useToast } from "@/components/ui/overlays";
import { Badge, Button, Card, Progress, SectionLabel } from "@/components/ui/primitives";
import { blocks as seedBlocks, type Block, type BlockType } from "@/lib/mockData";
import { cn } from "@/lib/utils";

/* ------------------------------ Constants ------------------------------ */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_H = 52; // px per hour row
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MIN_DURATION = 1; // hours
const SNAP = 0.5; // snap to 30 minutes

const TYPE_STYLE: Record<
  BlockType,
  { bg: string; border: string; text: string; dot: string; ring: string }
> = {
  Maintenance: {
    bg: "bg-[#DCE7F3]",
    border: "border-[#A9C3DF]",
    text: "text-[#14406F]",
    dot: "#1557A6",
    ring: "ring-[#1557A6]",
  },
  Renewal: {
    bg: "bg-[#E2DBF0]",
    border: "border-[#BFB2DD]",
    text: "text-[#3F2E75]",
    dot: "#6B54B8",
    ring: "ring-[#6B54B8]",
  },
  Inspection: {
    bg: "bg-[#D6EADD]",
    border: "border-[#A4CDB6]",
    text: "text-[#0F5B3C]",
    dot: "#18845B",
    ring: "ring-[#18845B]",
  },
  Emergency: {
    bg: "bg-[#F7D9D9]",
    border: "border-[#E2A3A3]",
    text: "text-[#8F2020]",
    dot: "#D64545",
    ring: "ring-[#D64545]",
  },
};

const fmtHour = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

const weekLabel = (offset: number) => {
  // Base: Week 34, 17–23 Aug 2026
  const base = new Date(2026, 7, 17);
  const start = new Date(base);
  start.setDate(base.getDate() + offset * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const month = (d: Date) => d.toLocaleString("en-GB", { month: "short" });
  const wk = 34 + offset;
  const range =
    start.getMonth() === end.getMonth()
      ? `${start.getDate()}–${end.getDate()} ${month(end)} ${end.getFullYear()}`
      : `${start.getDate()} ${month(start)} – ${end.getDate()} ${month(end)} ${end.getFullYear()}`;
  return { wk, range, start };
};

/* ============================ Main Page ============================ */
export function BlockSchedule() {
  const toast = useToast();
  const confirm = useConfirm();

  const [items, setItems] = useState<Block[]>(seedBlocks);
  const [weekOffset, setWeekOffset] = useState(0);
  const [typeFilter, setTypeFilter] = useState<"all" | BlockType>("all");
  const [corridorFilter, setCorridorFilter] = useState("all");
  const [selected, setSelected] = useState<Block | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { wk, range } = useMemo(() => weekLabel(weekOffset), [weekOffset]);

  const corridors = useMemo(
    () => ["all", ...Array.from(new Set(seedBlocks.map((b) => b.corridor)))],
    []
  );

  const visible = useMemo(
    () =>
      items.filter(
        (b) =>
          (typeFilter === "all" || b.type === typeFilter) &&
          (corridorFilter === "all" || b.corridor === corridorFilter)
      ),
    [items, typeFilter, corridorFilter]
  );

  /* ---- Drag to reschedule (move across days + time) ---- */
  const handleDragEnd = useCallback(
    (block: Block, dx: number, dy: number) => {
      setDragging(null);
      const grid = gridRef.current;
      if (!grid) return;
      const colW = grid.clientWidth / 7;

      const dayShift = Math.round(dx / colW);
      const hourShift = Math.round(dy / HOUR_H / SNAP) * SNAP;

      const duration = block.end - block.start;
      let newDay = Math.min(6, Math.max(0, block.day + dayShift));
      let newStart = Math.min(24 - duration, Math.max(0, block.start + hourShift));
      newStart = Math.round(newStart / SNAP) * SNAP;

      if (newDay === block.day && newStart === block.start) return;

      setItems((prev) =>
        prev.map((b) =>
          b.id === block.id ? { ...b, day: newDay, start: newStart, end: newStart + duration } : b
        )
      );
      toast("Block rescheduled", {
        desc: `${block.id} → ${DAYS[newDay]} ${fmtHour(newStart)}–${fmtHour(newStart + duration)}`,
        tone: "info",
      });
    },
    [toast]
  );

  /* ---- Resize (extend/shrink duration) ---- */
  const handleResizeEnd = useCallback(
    (block: Block, dy: number) => {
      setResizing(null);
      const hourShift = Math.round(dy / HOUR_H / SNAP) * SNAP;
      let newEnd = Math.min(24, Math.max(block.start + MIN_DURATION, block.end + hourShift));
      newEnd = Math.round(newEnd / SNAP) * SNAP;
      if (newEnd === block.end) return;

      setItems((prev) => prev.map((b) => (b.id === block.id ? { ...b, end: newEnd } : b)));
      toast("Block duration updated", {
        desc: `${block.id} now ${fmtHour(block.start)}–${fmtHour(newEnd)}`,
        tone: "info",
      });
    },
    [toast]
  );

  const resetWeek = () => {
    setItems(seedBlocks);
    setWeekOffset(0);
    setTypeFilter("all");
    setCorridorFilter("all");
    toast("Schedule reset", { desc: "Restored to published plan.", tone: "info" });
  };

  const stats = useMemo(
    () => ({
      total: visible.length,
      conflicts: visible.filter((b) => b.conflict).length,
      hours: visible.reduce((a, b) => a + (b.end - b.start), 0),
      trains: visible.reduce((a, b) => a + b.trains, 0),
    }),
    [visible]
  );

  return (
    <PageContainer
      title="Block Schedule"
      subtitle="AI-powered automatic block planning · maximising asset availability"
      meta={
        <>
          <Badge tone="green" dot pulse>
            Live plan
          </Badge>
          <span className="text-[12px] text-sub">
            {stats.total} blocks · {stats.hours.toFixed(1)}h · {stats.trains} trains affected
          </span>
          {stats.conflicts > 0 && (
            <Badge tone="red" dot pulse>
              {stats.conflicts} conflicts
            </Badge>
          )}
        </>
      }
      actions={
        <>
          <Button variant="secondary" size="sm" icon={<RotateCcw />} onClick={resetWeek}>
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus />}
            onClick={() => toast("New block requisition", { desc: "Opens Form E-1 draft.", tone: "info" })}
          >
            New block
          </Button>
        </>
      }
    >
      <Card className="overflow-hidden">
        {/* ---------------- Toolbar ---------------- */}
        <div className="flex flex-col gap-3 border-b border-line p-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Week nav */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ x: -1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setWeekOffset((w) => w - 1)}
              aria-label="Previous week"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-surface text-sub transition-colors hover:border-brand/30 hover:text-brand"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.div
                key={weekOffset}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="min-w-[220px] px-1"
              >
                <div className="font-display text-[15px] font-bold text-ink">
                  Week {wk} · {range}
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.button
              whileHover={{ x: 1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setWeekOffset((w) => w + 1)}
              aria-label="Next week"
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-surface text-sub transition-colors hover:border-brand/30 hover:text-brand"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>

            {weekOffset !== 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setWeekOffset(0)}
                className="rounded-lg px-2 py-1 text-[12px] font-medium text-brand transition-colors hover:bg-brand-soft"
              >
                Today
              </motion.button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-faint" />
            <Select
              value={typeFilter}
              onChange={(v) => setTypeFilter(v as any)}
              options={[
                { v: "all", l: "All types" },
                { v: "Maintenance", l: "Maintenance" },
                { v: "Renewal", l: "Renewal" },
                { v: "Inspection", l: "Inspection" },
                { v: "Emergency", l: "Emergency" },
              ]}
            />
            <Select
              value={corridorFilter}
              onChange={setCorridorFilter}
              options={corridors.map((c) => ({ v: c, l: c === "all" ? "All corridors" : c }))}
            />
          </div>
        </div>

        {/* ---------------- Legend ---------------- */}
        <div className="flex flex-wrap items-center gap-4 border-b border-line bg-cream px-4 py-2.5">
          {(Object.keys(TYPE_STYLE) as BlockType[]).map((t) => {
            const active = typeFilter === t;
            return (
              <motion.button
                key={t}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setTypeFilter(active ? "all" : t)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-medium transition-colors",
                  active ? "bg-surface text-ink ring-1 ring-line" : "text-sub hover:text-ink"
                )}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border-2"
                  style={{ borderColor: TYPE_STYLE[t].dot }}
                />
                {t}
              </motion.button>
            );
          })}
          <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-faint sm:flex">
            <Sparkles className="h-3 w-3 text-brand" /> Drag a block to reschedule · drag its bottom edge to resize
          </span>
        </div>

        {/* ---------------- Calendar ---------------- */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Day headers */}
            <div className="sticky top-0 z-10 flex border-b border-line bg-surface">
              <div className="w-[62px] shrink-0 border-r border-line" />
              {DAYS.map((d, i) => {
                const dayNum = 17 + i + weekOffset * 7;
                const isToday = weekOffset === 0 && i === 6;
                return (
                  <div
                    key={d}
                    className={cn(
                      "flex-1 border-r border-line py-2.5 text-center last:border-r-0",
                      isToday && "bg-brand-tint"
                    )}
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-faint">
                      {d}
                    </div>
                    <div
                      className={cn(
                        "mt-0.5 font-display text-[17px] font-bold",
                        isToday ? "text-brand" : "text-ink"
                      )}
                    >
                      {((dayNum - 1) % 31) + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grid body */}
            <div className="relative flex">
              {/* Hour gutter */}
              <div className="w-[62px] shrink-0 border-r border-line bg-cream/50">
                {HOURS.map((h) => (
                  <div
                    key={h}
                    style={{ height: HOUR_H }}
                    className="relative border-b border-line-soft last:border-b-0"
                  >
                    <span className="absolute -top-[7px] right-2 text-[11px] font-medium tabular-nums text-faint">
                      {String(h).padStart(2, "0")}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              <div ref={gridRef} className="relative flex flex-1">
                {DAYS.map((d, dayIdx) => (
                  <div
                    key={d}
                    className="relative flex-1 border-r border-line last:border-r-0"
                    style={{ height: HOUR_H * 24 }}
                  >
                    {/* hour lines */}
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        style={{ height: HOUR_H }}
                        className="border-b border-line-soft last:border-b-0"
                      />
                    ))}

                    {/* blocks for this day */}
                    <AnimatePresence>
                      {visible
                        .filter((b) => b.day === dayIdx)
                        .map((b) => (
                          <BlockCard
                            key={b.id}
                            block={b}
                            isDragging={dragging === b.id}
                            isResizing={resizing === b.id}
                            isSelected={selected?.id === b.id}
                            onDragStart={() => setDragging(b.id)}
                            onDragEnd={(dx, dy) => handleDragEnd(b, dx, dy)}
                            onResizeStart={() => setResizing(b.id)}
                            onResizeEnd={(dy) => handleResizeEnd(b, dy)}
                            onClick={() => setSelected(b)}
                          />
                        ))}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ---------------- Detail drawer ---------------- */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} width={460}>
        {selected && (
          <BlockDrawer
            block={items.find((b) => b.id === selected.id) ?? selected}
            onClose={() => setSelected(null)}
            onCancel={async (b) => {
              const ok = await confirm({
                title: "Cancel this block?",
                action: "Cancel block",
                impact: "Releases the section back to traffic; work will be unscheduled",
                affected: `${b.trains} train(s)`,
                section: b.section,
                reason: true,
                danger: true,
                twoStep: true,
              });
              if (ok) {
                setItems((prev) => prev.filter((x) => x.id !== b.id));
                setSelected(null);
                toast("Block cancelled", { desc: `${b.id} removed from schedule.`, tone: "warning" });
              }
            }}
            onReschedule={(b) => {
              toast("Reschedule mode", { desc: `Drag ${b.id} on the calendar to move it.`, tone: "info" });
              setSelected(null);
            }}
          />
        )}
      </Drawer>
    </PageContainer>
  );
}

/* ============================ Block Card ============================ */
function BlockCard({
  block,
  isDragging,
  isResizing,
  isSelected,
  onDragStart,
  onDragEnd,
  onResizeStart,
  onResizeEnd,
  onClick,
}: {
  block: Block;
  isDragging: boolean;
  isResizing: boolean;
  isSelected: boolean;
  onDragStart: () => void;
  onDragEnd: (dx: number, dy: number) => void;
  onResizeStart: () => void;
  onResizeEnd: (dy: number) => void;
  onClick: () => void;
}) {
  const style = TYPE_STYLE[block.type];
  const top = block.start * HOUR_H;
  const height = (block.end - block.start) * HOUR_H;
  const [liveResize, setLiveResize] = useState(0);

  return (
    <motion.div
      layout
      layoutId={block.id}
      drag
      dragMomentum={false}
      dragSnapToOrigin
      dragElastic={0.08}
      onDragStart={onDragStart}
      onDragEnd={(_, info) => onDragEnd(info.offset.x, info.offset.y)}
      onClick={(e) => {
        // avoid firing click right after a drag
        if (!isDragging && !isResizing) {
          e.stopPropagation();
          onClick();
        }
      }}
      initial={{ opacity: 0, scale: 0.94, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      whileHover={{ scale: 1.015, zIndex: 25 }}
      whileDrag={{
        scale: 1.05,
        rotate: 0.6,
        zIndex: 60,
        cursor: "grabbing",
        boxShadow: "0 16px 34px rgba(20,32,51,0.20)",
      }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      style={{
        position: "absolute",
        top,
        height: Math.max(height + liveResize, HOUR_H * MIN_DURATION),
        left: 5,
        right: 5,
        zIndex: isSelected ? 30 : 10,
      }}
      className={cn(
        "group cursor-grab overflow-hidden rounded-[10px] border p-2.5 shadow-[0_1px_3px_rgba(20,32,51,0.07)] transition-shadow active:cursor-grabbing",
        style.bg,
        style.border,
        isSelected && `ring-2 ring-offset-1 ${style.ring}`
      )}
    >
      {/* Conflict flag */}
      {block.conflict && (
        <span
          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-critical text-white"
          style={{ animation: "soft-pulse 2.2s ease-in-out infinite" }}
          title="Conflict detected"
        >
          <AlertTriangle className="h-2.5 w-2.5" />
        </span>
      )}

      <div className={cn("truncate text-[12.5px] font-bold", style.text)}>{block.id}</div>
      <div className={cn("truncate text-[12px] opacity-85", style.text)}>{block.section}</div>
      {height >= HOUR_H * 1.5 && (
        <div className={cn("mt-0.5 truncate text-[11.5px] tabular-nums opacity-70", style.text)}>
          {fmtHour(block.start)}–{fmtHour(block.end)}
        </div>
      )}
      {height >= HOUR_H * 3 && (
        <div className={cn("mt-1.5 flex items-center gap-1 text-[10.5px] opacity-65", style.text)}>
          <TrainFront className="h-3 w-3" /> {block.trains} trains
        </div>
      )}

      {/* Resize handle */}
      <motion.div
        drag="y"
        dragMomentum={false}
        dragElastic={0}
        dragSnapToOrigin
        onPointerDown={(e) => e.stopPropagation()}
        onDragStart={(e) => {
          (e as any).stopPropagation?.();
          onResizeStart();
        }}
        onDrag={(_, info) => setLiveResize(info.offset.y)}
        onDragEnd={(_, info) => {
          setLiveResize(0);
          onResizeEnd(info.offset.y);
        }}
        className="absolute inset-x-0 bottom-0 flex h-3 cursor-ns-resize items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
      >
        <div className="h-1 w-8 rounded-full bg-current opacity-30" />
      </motion.div>
    </motion.div>
  );
}

/* ============================ Drawer ============================ */
function BlockDrawer({
  block,
  onClose,
  onCancel,
  onReschedule,
}: {
  block: Block;
  onClose: () => void;
  onCancel: (b: Block) => void;
  onReschedule: (b: Block) => void;
}) {
  const toast = useToast();
  const style = TYPE_STYLE[block.type];

  const safetyChecks = [
    { label: "Section clear of traffic", ok: true },
    { label: "OHE isolation & earthing", ok: block.type !== "Emergency" },
    { label: "Crew & lookouts deployed", ok: true },
    { label: "Caution order issued", ok: !block.conflict },
  ];

  return (
    <>
      <DrawerHeader
        title={
          <span className="flex items-center gap-2">
            {block.id}
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: style.dot }}
              title={block.type}
            />
          </span>
        }
        subtitle={`${block.section} · ${block.corridor} corridor`}
        onClose={onClose}
        right={
          <Badge
            tone={
              block.status === "Approved" ? "green" : block.status === "Pending" ? "amber" : "blue"
            }
            dot
          >
            {block.status}
          </Badge>
        }
      />

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Key facts */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
          <Fact icon={<CalendarDays className="h-3.5 w-3.5" />} label="Day" value={DAYS[block.day]} />
          <Fact
            icon={<Clock className="h-3.5 w-3.5" />}
            label="Window"
            value={`${fmtHour(block.start)}–${fmtHour(block.end)}`}
          />
          <Fact
            icon={<Clock className="h-3.5 w-3.5" />}
            label="Duration"
            value={`${(block.end - block.start).toFixed(1)}h`}
          />
          <Fact
            icon={<TrainFront className="h-3.5 w-3.5" />}
            label="Affected trains"
            value={String(block.trains)}
          />
        </div>

        {/* Type + team */}
        <div className={cn("rounded-xl border p-3", style.bg, style.border)}>
          <div className={cn("text-[12px] font-bold uppercase tracking-wide", style.text)}>
            {block.type} block
          </div>
          <p className={cn("mt-1 text-[13px] leading-relaxed", style.text)}>{block.work}</p>
          <div className={cn("mt-2 flex items-center gap-1.5 text-[11.5px] opacity-80", style.text)}>
            <Users className="h-3.5 w-3.5" /> {block.team}
          </div>
        </div>

        {/* Conflict status */}
        <div>
          <SectionLabel className="mb-2">Conflict status</SectionLabel>
          {block.conflict ? (
            <div className="rounded-xl border border-critical/25 bg-critical-soft/50 p-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-critical">
                <AlertTriangle className="h-4 w-4" /> Path conflict detected
              </div>
              <p className="mt-1 text-[12px] text-sub">
                This block overlaps a premium path window. AI suggests shifting the start by 45
                minutes to clear the conflict.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success-soft/50 p-3 text-[13px] font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" /> No conflicts — path is clear
            </div>
          )}
        </div>

        {/* AI recommendation */}
        <div>
          <SectionLabel className="mb-2">AI recommendation</SectionLabel>
          <div className="rounded-xl border border-brand/20 bg-brand-tint p-3">
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-ink">
              <Sparkles className="h-4 w-4" /> Planning engine v4.2
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
              {block.conflict
                ? `Shift ${block.id} to ${fmtHour(block.start + 0.75)} to avoid premium path overlap while retaining full ${(block.end - block.start).toFixed(1)}h working window.`
                : `Current window is optimal. Retaining ${fmtHour(block.start)} start maximises asset availability across the ${block.corridor} corridor.`}
            </p>
            <div className="mt-2.5">
              <div className="mb-1 flex items-center justify-between text-[11.5px]">
                <span className="text-sub">Plan confidence</span>
                <span className="font-bold text-brand">{block.confidence}%</span>
              </div>
              <Progress value={block.confidence} tone="blue" />
            </div>
          </div>
        </div>

        {/* Safety checks */}
        <div>
          <SectionLabel className="mb-2">Safety checks</SectionLabel>
          <div className="divide-y divide-line-soft rounded-xl border border-line">
            {safetyChecks.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 px-3 py-2.5 text-[12.5px]"
              >
                {c.ok ? (
                  <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                )}
                <span className="text-ink-soft">{c.label}</span>
                <span
                  className={cn(
                    "ml-auto text-[11px] font-semibold",
                    c.ok ? "text-success" : "text-warning"
                  )}
                >
                  {c.ok ? "Cleared" : "Pending"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
        <Button
          variant="secondary"
          size="sm"
          icon={<Pencil className="h-3.5 w-3.5" />}
          onClick={() => toast("Editing block", { desc: block.id, tone: "info" })}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={<RotateCcw className="h-3.5 w-3.5" />}
          onClick={() => onReschedule(block)}
        >
          Reschedule
        </Button>
        <Button
          variant="ai"
          size="sm"
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          onClick={() => toast("Opening conflict view", { desc: block.id, tone: "info" })}
        >
          View conflicts
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={<Trash2 className="h-3.5 w-3.5" />}
          onClick={() => onCancel(block)}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}

/* ============================ Bits ============================ */
function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-faint">
        <span className="text-sub">{icon}</span>
        {label}
      </div>
      <div className="mt-0.5 text-[14px] font-bold text-ink">{value}</div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-[10px] border border-line bg-surface pl-3 pr-8 text-[13px] font-medium text-ink outline-none transition-colors hover:border-brand/30 focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sub"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
