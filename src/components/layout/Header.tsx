import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  LogOut,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  UserCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, Badge, Button, Tooltip } from "@/components/ui/primitives";
import { HamburgerButton } from "@/components/ui/HamburgerButton";
import { useApp } from "@/lib/store";
import { pad2 } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* ------------------------ Live clock ------------------------ */
function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const h = t.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return (
    <span className="tabular-nums">
      {pad2(h12)}:{pad2(t.getMinutes())}:{pad2(t.getSeconds())}{" "}
      <span className="text-faint">{ampm}</span>
    </span>
  );
}

/* -------- Elegant status pill with animated pulse ring -------- */
function StatusPill({
  dot,
  label,
  ring,
  icon,
  tone = "neutral",
}: {
  dot: string;
  label: string;
  ring?: boolean;
  icon?: React.ReactNode;
  tone?: "neutral" | "brand";
}) {
  return (
    <motion.span
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "hidden cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors lg:inline-flex",
        tone === "brand"
          ? "border-brand/20 bg-brand-soft text-brand-ink hover:border-brand/35"
          : "border-line bg-surface text-ink-soft hover:border-line-strong"
      )}
    >
      {icon ? (
        <span className="flex h-3.5 w-3.5 items-center justify-center">{icon}</span>
      ) : (
        <span className="relative flex h-1.5 w-1.5">
          {ring && (
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: dot, animation: "ring 2.6s ease-out infinite" }}
            />
          )}
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ background: dot }}
          />
        </span>
      )}
      {label}
    </motion.span>
  );
}

/* -------------- Icon button with animated press + hover halo -------------- */
function HeaderIcon({
  label,
  onClick,
  children,
  badge,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <Tooltip label={label} side="bottom">
      <motion.button
        onClick={onClick}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        aria-label={label}
        className="group relative flex h-9 w-9 items-center justify-center rounded-[10px] text-sub outline-none transition-colors hover:bg-brand-soft hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/35"
      >
        {children}
        {badge !== undefined && (
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="absolute right-1 top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-critical px-1 text-[9px] font-bold text-white ring-2 ring-canvas"
            style={{ animation: "soft-pulse 2.4s ease-in-out infinite" }}
          >
            {badge}
          </motion.span>
        )}
      </motion.button>
    </Tooltip>
  );
}

/* ---------------------- Click-away hook ---------------------- */
function useClickAway<T extends HTMLElement>(onAway: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onAway();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onAway]);
  return ref;
}

/* ==============================================================
   HEADER — compact, focused control bar
   Removed: inline search field and duplicate page title
   ============================================================== */
export function Header() {
  const { navigate, setPaletteOpen, setNotifOpen, collapsed, toggleCollapsed } = useApp();
  const [userMenu, setUserMenu] = useState(false);
  const [emergMenu, setEmergMenu] = useState(false);
  const userRef = useClickAway<HTMLDivElement>(() => setUserMenu(false));
  const emergRef = useClickAway<HTMLDivElement>(() => setEmergMenu(false));

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-line bg-canvas/85 px-3 backdrop-blur-md md:gap-3 md:px-5">
      {/* Left cluster: hamburger + context breadcrumb */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <HamburgerButton sidebarOpen={!collapsed} onClick={toggleCollapsed} />

        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="hidden min-w-0 items-center gap-2 sm:flex"
        >
          <span className="rounded-md bg-brand-soft px-2 py-0.5 font-display text-[11px] font-bold tracking-wide text-brand-ink">
            MARGA
          </span>
          <span className="text-line-strong">·</span>
          <span className="truncate text-[12.5px] font-medium text-sub">
            Northern Division
          </span>
        </motion.div>
      </div>

      {/* Right cluster: status + actions */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Live clock */}
        <span className="hidden shrink-0 items-center rounded-[9px] border border-line bg-surface px-2.5 py-1.5 text-[12px] font-semibold text-sub xl:inline-flex">
          <LiveClock />
        </span>

        {/* Status pills */}
        <StatusPill dot="#18845B" label="Network Operational" ring />
        <StatusPill
          dot="#1557A6"
          label="AI Engine Online"
          tone="brand"
          icon={
            <motion.span
              animate={{ opacity: [0.55, 1, 0.55], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-3.5 w-3.5" />
            </motion.span>
          }
        />

        {/* Search icon → opens command palette */}
        <HeaderIcon label="Search (⌘K)" onClick={() => setPaletteOpen(true)}>
          <Search className="h-[18px] w-[18px]" />
        </HeaderIcon>

        {/* Emergency */}
        <div ref={emergRef} className="relative hidden sm:block">
          <Button
            variant="danger"
            size="sm"
            icon={<ShieldAlert />}
            onClick={() => setEmergMenu((v) => !v)}
            trailingIcon={
              <motion.span
                animate={{ rotate: emergMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            }
          >
            <span className="hidden md:inline">Emergency</span>
          </Button>
          <AnimatePresence>
            {emergMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="absolute right-0 top-11 w-64 origin-top-right overflow-hidden rounded-card border border-line bg-surface p-1.5 shadow-pop"
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
                  Emergency controls
                </div>
                {[
                  { label: "Close section", tone: "text-critical", danger: true },
                  { label: "Halt all trains", tone: "text-critical", danger: true },
                  { label: "Broadcast caution order", tone: "text-ink-soft" },
                  { label: "Override AI dispatch", tone: "text-ink-soft" },
                ].map((a, i) => (
                  <motion.button
                    key={a.label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    whileHover={{ x: 2 }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors",
                      a.danger
                        ? "text-ink-soft hover:bg-critical-soft"
                        : "text-ink-soft hover:bg-sand"
                    )}
                  >
                    <Zap className={cn("h-4 w-4", a.tone)} />
                    {a.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help */}
        <div className="hidden md:block">
          <HeaderIcon label="Help & shortcuts">
            <CircleHelp className="h-[18px] w-[18px]" />
          </HeaderIcon>
        </div>

        {/* Notifications */}
        <HeaderIcon label="Notifications" onClick={() => setNotifOpen(true)} badge={2}>
          <Bell className="h-[18px] w-[18px]" />
        </HeaderIcon>

        {/* User */}
        <div ref={userRef} className="relative">
          <motion.button
            onClick={() => setUserMenu((v) => !v)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className={cn(
              "flex items-center gap-2 rounded-[10px] border p-1 pr-2 transition-colors",
              userMenu
                ? "border-line bg-cream"
                : "border-transparent hover:border-line hover:bg-surface"
            )}
          >
            <Avatar initials="RS" name="Rajesh Sharma" size={30} />
            <div className="hidden text-left leading-tight lg:block">
              <div className="text-[12.5px] font-semibold text-ink">R. Sharma</div>
              <div className="text-[10.5px] text-sub">Section Controller</div>
            </div>
            <motion.span
              animate={{ rotate: userMenu ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block"
            >
              <ChevronDown className="h-3.5 w-3.5 text-sub" />
            </motion.span>
          </motion.button>
          <AnimatePresence>
            {userMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="absolute right-0 top-12 w-64 origin-top-right overflow-hidden rounded-card border border-line bg-surface p-1.5 shadow-pop"
              >
                <div className="flex items-center gap-2.5 px-2 py-2">
                  <Avatar initials="RS" size={38} />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-ink">
                      Rajesh Sharma
                    </div>
                    <div className="truncate text-[11px] text-sub">
                      Northern Division · NDLS
                    </div>
                  </div>
                </div>
                <div className="mx-2 mb-1">
                  <Badge tone="green" dot pulse>
                    On shift · 06:00–14:00
                  </Badge>
                </div>
                <div className="my-1.5 h-px bg-line" />
                {[
                  { label: "My profile", icon: UserCircle, page: "settings" as const },
                  { label: "Settings", icon: Settings, page: "settings" as const },
                  { label: "Sign out", icon: LogOut, page: "settings" as const },
                ].map((i, idx) => (
                  <motion.button
                    key={i.label}
                    onClick={() => {
                      navigate(i.page);
                      setUserMenu(false);
                    }}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx }}
                    whileHover={{ x: 2 }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-sand hover:text-ink"
                  >
                    <i.icon className="h-4 w-4 text-sub" />
                    {i.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
