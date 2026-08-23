import { motion } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { AlertOctagon, type LucideIcon } from "lucide-react";
import { Button } from "./primitives";
import { cn } from "@/lib/utils";

/* ----------------------------- Animated number --------------------------- */
export function useCountUp(target: number, duration = 1000, decimals = 0) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return decimals ? Number(val.toFixed(decimals)) : Math.round(val);
}

export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1100,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const v = useCountUp(value, duration, decimals);
  return (
    <span>
      {prefix}
      {v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* -------------------------------- Skeleton ------------------------------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-md", className)} />;
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-card border border-line bg-surface p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <Skeleton className="mb-2 h-8 w-20" />
      <Skeleton className="h-3 w-28" />
      {rows > 3 && <div className="mt-3 space-y-1.5"><Skeleton className="h-2 w-full" /><Skeleton className="h-2 w-2/3" /></div>}
    </div>
  );
}

/* ------------------------------- Empty state ----------------------------- */
export function EmptyState({
  icon: Icon,
  title,
  desc,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sand text-faint">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="text-[15px] font-semibold text-ink">{title}</div>
      {desc && <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-sub">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ------------------------------- Error state ----------------------------- */
export function ErrorState({
  title = "Unable to load data",
  desc = "The operational data feed is temporarily unavailable.",
  onRetry,
}: {
  title?: string;
  desc?: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-card border border-critical/20 bg-critical-soft/40 px-6 py-12 text-center"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-critical-soft text-critical">
        <AlertOctagon className="h-6 w-6" />
      </div>
      <div className="text-[15px] font-semibold text-ink">{title}</div>
      <p className="mt-1 max-w-sm text-[13px] text-sub">{desc}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </motion.div>
  );
}

/* ------------------------------ Page stagger ----------------------------- */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
export const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};
