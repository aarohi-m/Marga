import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BellRing,
  Blocks,
  BrainCircuit,
  CalendarDays,
  Database,
  FileBarChart,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  Network,
  Radio,
  ScanSearch,
  Siren,
  TrainTrack,
  Users,
  Wrench,
} from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import { Avatar } from "@/components/ui/primitives";
import { Tooltip } from "@/components/ui/primitives";
import { type PageId, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavItemDef {
  id: PageId;
  label: string;
  icon: LucideIcon;
  badge?: number;
  pulse?: boolean;
}

const primary: NavItemDef[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "operations", label: "Operations", icon: Radio },
  { id: "network", label: "Live Network", icon: Network },
  { id: "planner", label: "AI Block Planner", icon: Blocks },
  { id: "schedule", label: "Block Schedule", icon: CalendarDays },
  { id: "conflicts", label: "Conflicts", icon: Siren, badge: 2, pulse: true },
  { id: "assets", label: "Assets", icon: TrainTrack },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "explainability", label: "AI Explainability", icon: ScanSearch },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "alerts", label: "Alerts", icon: BellRing, badge: 2, pulse: true },
];

const secondary: NavItemDef[] = [
  { id: "collaboration", label: "Collaboration", icon: Users },
  { id: "forms", label: "Forms / e-Fill", icon: FileText },
  { id: "reports", label: "Reports", icon: FileBarChart },
  { id: "datafeeds", label: "Data Feeds", icon: Database },
];

function NavItem({ item, collapsed }: { item: NavItemDef; collapsed: boolean }) {
  const { page, navigate } = useApp();
  const active = page === item.id;
  const Icon = item.icon;

  const inner = (
    <motion.button
      onClick={() => navigate(item.id)}
      whileHover={{ x: collapsed ? 0 : 1.5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-current={active ? "page" : undefined}
      className={cn(
        // In collapsed mode use a fixed square so icons stay perfectly centered
        // and never overlap regardless of the aside's animating width.
        "group relative flex items-center overflow-hidden rounded-[9px] text-[13.5px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/30",
        collapsed
          ? "mx-auto h-10 w-10 justify-center"
          : "h-9 w-full gap-2.5 px-2.5",
        active ? "bg-brand-soft text-brand-ink" : "text-sub hover:bg-sand hover:text-ink"
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className={cn(
            "absolute top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand",
            collapsed ? "-left-[7px]" : "left-0"
          )}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <motion.span
        whileHover={{ x: collapsed ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className={cn(
          "shrink-0 transition-colors",
          active ? "text-brand" : "text-sub group-hover:text-ink"
        )}
      >
        <Icon className="h-[17px] w-[17px]" strokeWidth={active ? 2.4 : 2} />
      </motion.span>

      {/* Expanded-only: label + badge (only rendered when not collapsed to
          guarantee zero residual DOM in the compact 40px slot) */}
      {!collapsed && (
        <>
          <motion.span
            key="label"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="truncate whitespace-nowrap"
          >
            {item.label}
          </motion.span>

          {item.badge ? (
            <motion.span
              key="badge"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className={cn(
                "ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-bold",
                active ? "bg-brand text-white" : "bg-critical text-white"
              )}
              style={item.pulse ? { animation: "soft-pulse 2.2s ease-in-out infinite" } : undefined}
            >
              {item.badge}
            </motion.span>
          ) : null}
        </>
      )}

      {/* Collapsed-only badge indicator */}
      {collapsed && item.badge ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="absolute right-1 top-1 h-2 w-2 rounded-full bg-critical ring-2 ring-cream"
          style={{ animation: "soft-pulse 2.2s ease-in-out infinite" }}
        />
      ) : null}
    </motion.button>
  );

  if (collapsed) {
    return (
      <Tooltip label={item.label} side="right">
        {inner}
      </Tooltip>
    );
  }
  return inner;
}

export function Sidebar() {
  const { collapsed, navigate } = useApp();
  const itemsRef = useRef<HTMLDivElement>(null);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const buttons = Array.from(itemsRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const idx = buttons.findIndex((b) => b === document.activeElement);
    const next = e.key === "ArrowDown" ? (idx + 1) % buttons.length : (idx - 1 + buttons.length) % buttons.length;
    buttons[next]?.focus();
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
      className="relative z-30 flex h-screen shrink-0 flex-col overflow-hidden border-r border-line bg-cream"
    >
      {/* Brand */}
      <div className={cn("flex h-16 items-center gap-2.5 border-b border-line px-4", collapsed && "justify-center px-0")}>
        <motion.div
          whileHover={{ rotate: -6, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 340, damping: 18 }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-brand-deep text-white shadow-[0_2px_8px_rgba(21,87,166,0.3)]"
        >
          <TrainTrack className="h-[18px] w-[18px]" strokeWidth={2.4} />
        </motion.div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 whitespace-nowrap"
            >
              <div className="font-display text-[17px] font-extrabold leading-none tracking-tight text-ink">MARGA</div>
              <div className="mt-1 truncate text-[10.5px] font-medium text-sub">Railway Operations Intelligence</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav
        ref={itemsRef}
        onKeyDown={onKey}
        className={cn(
          "no-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-3",
          collapsed ? "px-2" : "px-2.5"
        )}
      >
        {primary.map((item) => (
          <NavItem key={item.id} item={item} collapsed={collapsed} />
        ))}

        <div className={cn("my-2.5 flex items-center gap-2", collapsed ? "px-3" : "px-2.5")}>
          <div className="h-px flex-1 bg-line" />
          {!collapsed && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
              Workspace
            </span>
          )}
          {!collapsed && <div className="h-px flex-1 bg-line" />}
        </div>

        {secondary.map((item) => (
          <NavItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-line p-2.5">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="status-card"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-[10px] border border-line bg-surface p-2.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-semibold text-success">
                    <span className="relative flex h-1.5 w-1.5">
                      <span
                        className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60"
                        style={{ animation: "ring 2.4s ease-out infinite" }}
                      />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                    Network operational
                  </span>
                  <BrainCircuit className="h-3.5 w-3.5 text-brand" />
                </div>
                <div className="mt-1.5 whitespace-nowrap text-[10.5px] font-medium text-sub">
                  Planning Engine v4.2 · Online
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-sand">
                  <motion.div
                    className="h-full rounded-full bg-brand/60"
                    initial={{ width: 0 }}
                    animate={{ width: "88%" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => navigate("settings")}
          whileHover={{ x: collapsed ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className={cn(
            "flex items-center rounded-[10px] transition-colors hover:bg-sand",
            collapsed
              ? "mx-auto h-10 w-10 justify-center p-0"
              : "w-full gap-2.5 p-1.5 text-left"
          )}
        >
          <Avatar initials="RS" name="Rajesh Sharma · Section Controller" size={32} />
          {!collapsed && (
            <motion.div
              key="user-meta"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 flex-1 whitespace-nowrap"
            >
              <div className="truncate text-[12.5px] font-semibold text-ink">Section Controller</div>
              <div className="truncate text-[11px] text-sub">Northern Division</div>
            </motion.div>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
