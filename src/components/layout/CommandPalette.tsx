import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  Blocks,
  CornerDownLeft,
  Database,
  Network,
  type LucideIcon,
  RotateCcw,
  Search as SearchIcon,
  Siren,
  Sparkles,
  TrainFront,
  TrainTrack,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp, type PageId } from "@/lib/store";
import { alerts, assets, blocks, conflicts, maintenance, recommendations, sections, stations, trains } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Item {
  label: string;
  sub: string;
  cat: string;
  icon: LucideIcon;
  page: PageId;
}

const items: Item[] = [
  // Trains
  ...trains.map((t) => ({
    label: `${t.no} ${t.name}`,
    sub: `${t.station} → ${t.next} · ${t.status}`,
    cat: "Trains",
    icon: TrainFront,
    page: "operations" as PageId,
  })),
  // Stations
  ...stations.map((s) => ({
    label: `${s.name} (${s.code})`,
    sub: `${s.platforms} platforms · ${s.zone} Zone`,
    cat: "Stations",
    icon: Network,
    page: "network" as PageId,
  })),
  // Sections / blocks
  ...sections.map((s) => ({
    label: `${s.id} · ${s.name}`,
    sub: `${s.distance} km · ${s.status}`,
    cat: "Block Sections",
    icon: Blocks,
    page: "planner" as PageId,
  })),
  // Scheduled blocks
  ...blocks.map((b) => ({
    label: `${b.id} · ${b.section}`,
    sub: `${b.type} · ${b.corridor} · ${b.team}`,
    cat: "Block Sections",
    icon: Blocks,
    page: "schedule" as PageId,
  })),
  // Assets
  ...assets.map((a) => ({
    label: a.name,
    sub: `${a.type} · ${a.location}`,
    cat: "Assets",
    icon: TrainTrack,
    page: "assets" as PageId,
  })),
  // Alerts
  ...alerts.map((a) => ({
    label: a.title,
    sub: `${a.location} · ${a.severity}`,
    cat: "Alerts",
    icon: BellRing,
    page: "alerts" as PageId,
  })),
  // Conflicts
  ...conflicts.map((c) => ({
    label: `${c.id} · ${c.title}`,
    sub: `${c.section} · ${c.severity}`,
    cat: "Conflicts",
    icon: Siren,
    page: "conflicts" as PageId,
  })),
  // Maintenance
  ...maintenance.map((m) => ({
    label: `${m.id} · ${m.title}`,
    sub: `${m.section} · ${m.status}`,
    cat: "Maintenance",
    icon: Wrench,
    page: "maintenance" as PageId,
  })),
  // Recommendations
  ...recommendations.map((r) => ({
    label: `${r.id} · ${r.title}`,
    sub: `${r.scope} · ${r.confidence}% confidence`,
    cat: "AI Recommendations",
    icon: Sparkles,
    page: "explainability" as PageId,
  })),
];

const recent: Item[] = [
  { label: "12951 Mumbai Rajdhani", sub: "KOTA → MTJ · Running", cat: "Trains", icon: TrainFront, page: "operations" },
  { label: "Kota–Mathura Section", sub: "RS005 · Blocked", cat: "Block Sections", icon: Blocks, page: "planner" },
  { label: "AI001 · Hold 12951 at Kota", sub: "Western Main Line · 87%", cat: "AI Recommendations", icon: Sparkles, page: "explainability" },
  { label: "Signal S-42", sub: "Mathura Junction", cat: "Assets", icon: TrainTrack, page: "assets" },
];

const catOrder = ["Trains", "Stations", "Block Sections", "Assets", "Alerts", "Conflicts", "Maintenance", "AI Recommendations"];

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, navigate } = useApp();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [paletteOpen]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return items.filter((i) => (i.label + i.sub + i.cat).toLowerCase().includes(lower)).slice(0, 16);
  }, [q]);

  const list = q.trim() ? results : recent;
  const grouped = useMemo(() => {
    const g: Record<string, Item[]> = {};
    list.forEach((i) => {
      (g[i.cat] ??= []).push(i);
    });
    return catOrder.filter((c) => g[c]).map((c) => ({ cat: c, items: g[c] }));
  }, [list]);

  const flat = list;

  useEffect(() => setActive(0), [q]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = flat[active];
      if (sel) {
        navigate(sel.page);
        setPaletteOpen(false);
      }
    }
  };

  let idx = -1;

  return (
    <AnimatePresence>
      {paletteOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPaletteOpen(false)}
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-[600px] overflow-hidden rounded-card border border-line bg-surface shadow-pop"
          >
            {/* Search field */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <SearchIcon className="h-4.5 w-4.5 text-sub" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onListKey}
                placeholder="Search trains, stations, blocks, sections…"
                className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
              />
              <kbd className="rounded border border-line bg-cream px-1.5 py-0.5 text-[10px] font-semibold text-sub">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[52vh] overflow-y-auto p-2">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
                {q.trim() ? `${flat.length} results` : "Recent"}
              </div>

              {flat.length === 0 ? (
                <div className="flex items-center gap-2 px-3 py-6 text-[13px] text-sub">
                  <RotateCcw className="h-4 w-4" /> No matches. Try a train number, station or block ID.
                </div>
              ) : (
                grouped.map((group) => (
                  <div key={group.cat} className="mb-1">
                    {!q.trim() && (
                      <div className="px-2 pt-2 text-[10.5px] font-semibold uppercase tracking-wider text-faint">{group.cat}</div>
                    )}
                    {group.items.map((it) => {
                      idx++;
                      const i = idx;
                      const isActive = i === active;
                      const Icon = it.icon;
                      return (
                        <button
                          key={it.label + i}
                          onMouseEnter={() => setActive(i)}
                          onClick={() => {
                            navigate(it.page);
                            setPaletteOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-[9px] px-2.5 py-2 text-left transition-colors",
                            isActive ? "bg-brand-soft" : "hover:bg-sand"
                          )}
                        >
                          <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", isActive ? "bg-brand text-white" : "bg-cream text-sub")}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={cn("block truncate text-[13.5px] font-medium", isActive ? "text-brand-ink" : "text-ink")}>{it.label}</span>
                            <span className="block truncate text-[11.5px] text-sub">{it.sub}</span>
                          </span>
                          {q.trim() && <span className="hidden text-[10.5px] font-medium text-faint sm:block">{it.cat}</span>}
                          {isActive && <CornerDownLeft className="h-3.5 w-3.5 text-brand" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-line bg-cream px-3 py-2 text-[11px] text-sub">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> AI-indexed</span>
                <span className="hidden items-center gap-1 sm:flex"><Database className="h-3 w-3" /> {items.length} entities</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-semibold">↑↓</kbd> navigate
                <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-semibold">↵</kbd> open
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
