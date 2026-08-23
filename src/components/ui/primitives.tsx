import { motion } from "framer-motion";
import {
  type ButtonHTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/* --------------------------------- Button -------------------------------- */
type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "ai";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-deep shadow-[0_1px_2px_rgba(21,87,166,0.3)]",
  secondary:
    "bg-surface text-ink border border-line-strong hover:border-brand/40 hover:text-brand hover:bg-brand-tint",
  outline:
    "bg-transparent text-sub border border-line hover:border-brand/40 hover:text-brand",
  ghost: "bg-transparent text-sub hover:bg-sand hover:text-ink",
  danger: "bg-critical text-white hover:brightness-95 shadow-[0_1px_2px_rgba(214,69,69,0.3)]",
  ai: "bg-brand-soft text-brand-ink border border-brand/25 hover:bg-brand/10",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9.5 px-4 text-sm gap-2",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(
        "inline-flex items-center justify-center rounded-[9px] font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as any)}
    >
      {icon && <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      {children}
      {trailingIcon && (
        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{trailingIcon}</span>
      )}
    </motion.button>
  );
}

export function IconButton({
  children,
  className,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <motion.button
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-[9px] text-sub transition-colors hover:bg-sand hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand/35",
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

/* ---------------------------------- Badge -------------------------------- */
type Tone = "neutral" | "blue" | "green" | "amber" | "red" | "violet" | "slate";
const tones: Record<Tone, string> = {
  neutral: "bg-sand text-ink-soft border-line",
  blue: "bg-brand-soft text-brand-ink border-brand/15",
  green: "bg-success-soft text-success border-success/20",
  amber: "bg-warning-soft text-warning border-warning/25",
  red: "bg-critical-soft text-critical border-critical/20",
  violet: "bg-violet-soft text-violet border-violet/20",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
};

export function Badge({
  tone = "neutral",
  dot,
  pulse,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap",
        tones[tone],
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: "currentColor", animation: "soft-pulse 1.8s ease-in-out infinite" }}
            />
          )}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
        </span>
      )}
      {children}
    </span>
  );
}

/* ----------------------------- Status helpers ---------------------------- */
export function StatusBadge({
  status,
}: {
  status: "operational" | "degraded" | "maintenance" | "offline";
}) {
  const map = {
    operational: { tone: "green" as Tone, label: "Operational" },
    degraded: { tone: "amber" as Tone, label: "Degraded" },
    maintenance: { tone: "blue" as Tone, label: "Maintenance" },
    offline: { tone: "red" as Tone, label: "Out of Service" },
  }[status];
  return (
    <Badge tone={map.tone} dot pulse={status === "degraded"}>
      {map.label}
    </Badge>
  );
}

export function SeverityTag({
  severity,
}: {
  severity: "critical" | "high" | "medium" | "low";
}) {
  const map = {
    critical: { tone: "red" as Tone, label: "Critical" },
    high: { tone: "amber" as Tone, label: "High" },
    medium: { tone: "blue" as Tone, label: "Medium" },
    low: { tone: "neutral" as Tone, label: "Low" },
  }[severity];
  return (
    <Badge tone={map.tone} dot pulse={severity === "critical"}>
      {map.label}
    </Badge>
  );
}

/* ---------------------------------- Card --------------------------------- */
export function Card({
  className,
  children,
  hover,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface shadow-card",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:border-line-strong",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* -------------------------------- Progress ------------------------------- */
export function Progress({
  value,
  tone = "blue",
  className,
  animate = true,
}: {
  value: number;
  tone?: Tone;
  className?: string;
  animate?: boolean;
}) {
  const color = {
    blue: "bg-brand",
    green: "bg-success",
    amber: "bg-warning",
    red: "bg-critical",
    violet: "bg-violet",
    neutral: "bg-sub",
    slate: "bg-slate-400",
  }[tone];
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-sand", className)}>
      <motion.div
        className={cn("h-full rounded-full", color)}
        initial={animate ? { width: 0 } : false}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* --------------------------------- Avatar -------------------------------- */
const avatarColors = ["#1557A6", "#18845B", "#C98218", "#6B54B8", "#174F91", "#D64545"];
export function Avatar({
  initials,
  name,
  size = 32,
  className,
}: {
  initials: string;
  name?: string;
  size?: number;
  className?: string;
}) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % avatarColors.length;
  return (
    <div
      title={name}
      className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold text-white", className)}
      style={{
        width: size,
        height: size,
        background: avatarColors[idx],
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}

/* ------------------------------- SectionLabel ---------------------------- */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.08em] text-faint",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ---------------------------------- Tabs --------------------------------- */
interface TabsCtx {
  active: string;
  setActive: (v: string) => void;
}
const TabsContext = createContext<TabsCtx | null>(null);

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className,
}: {
  tabs: { id: string; label: string; count?: number }[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0].id);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("flex items-center gap-1 border-b border-line", className)}>
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActive(t.id);
                onChange?.(t.id);
              }}
              className={cn(
                "relative px-3.5 py-2.5 text-[13px] font-medium outline-none transition-colors",
                isActive ? "text-brand" : "text-sub hover:text-ink"
              )}
            >
              <span className="flex items-center gap-1.5">
                {t.label}
                {t.count !== undefined && (
                  <span
                    className={cn(
                      "rounded px-1.5 py-px text-[10px] font-semibold",
                      isActive ? "bg-brand-soft text-brand-ink" : "bg-sand text-sub"
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </span>
              {isActive && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabs must be used within Tabs");
  return ctx;
}

/* ------------------------------ Segmented -------------------------------- */
export function Segmented({
  options,
  value,
  onChange,
  className,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-0.5 rounded-[10px] border border-line bg-cream p-0.5", className)}>
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "relative rounded-[8px] px-3 py-1.5 text-[13px] font-medium outline-none transition-colors",
              active ? "text-brand-ink" : "text-sub hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId="seg-active"
                className="absolute inset-0 rounded-[8px] bg-surface shadow-[0_1px_2px_rgba(20,32,51,0.08)] ring-1 ring-line"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- Switch -------------------------------- */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand/35",
        checked ? "bg-brand" : "bg-line-strong"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-sm"
        style={{ left: checked ? 18 : 2 }}
      />
    </button>
  );
}

/* -------------------------------- Tooltip -------------------------------- */
export function Tooltip({
  label,
  children,
  side = "top",
}: {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}) {
  const pos = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
  }[side];
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-pop transition-opacity duration-150 group-hover/tt:opacity-100",
          pos
        )}
      >
        {label}
      </span>
    </span>
  );
}

/* --------------------------------- Stat ---------------------------------- */
export function TrendArrow({ value, suffix = "min" }: { value: number; suffix?: string }) {
  const down = value < 0;
  const good = down; // less delay is good
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        good ? "text-success" : "text-critical"
      )}
    >
      {down ? "↓" : "↑"} {Math.abs(value)} {suffix}
    </span>
  );
}
