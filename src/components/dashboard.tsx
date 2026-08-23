import { motion } from "framer-motion";
import { type LucideIcon, Sparkles, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AnimatedNumber, fadeUp } from "./ui/feedback";
import { Badge, Button } from "./ui/primitives";
import { cn } from "@/lib/utils";

/* -------------------------------- AI glyph ------------------------------- */
export function AIGlyph({ className }: { className?: string }) {
  return <Sparkles className={cn("h-4 w-4", className)} />;
}

export function AIBadge({ children = "AI" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-brand/20 bg-brand-soft px-1.5 py-0.5 text-[11px] font-semibold text-brand-ink">
      <Sparkles className="h-3 w-3" /> {children}
    </span>
  );
}

/* --------------------------------- KPI Card ------------------------------ */
export function KpiCard({
  icon: Icon,
  label,
  value,
  suffix,
  decimals,
  sub,
  trend,
  trendGood,
  tone = "blue",
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  sub?: React.ReactNode;
  trend?: string;
  trendGood?: boolean;
  tone?: "blue" | "green" | "amber" | "red" | "violet";
  delay?: number;
}) {
  const toneMap = {
    blue: "bg-brand-soft text-brand",
    green: "bg-success-soft text-success",
    amber: "bg-warning-soft text-warning",
    red: "bg-critical-soft text-critical",
    violet: "bg-violet-soft text-violet",
  }[tone];

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      whileHover={{ y: -2 }}
      className="group rounded-card border border-line bg-surface p-4 shadow-card transition-shadow hover:shadow-lift hover:border-line-strong"
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-[9px]", toneMap)}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[12px] font-semibold",
              trendGood ? "text-success" : "text-critical"
            )}
          >
            {trendGood ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-sub">{label}</div>
      <div className="mt-1 font-display text-[28px] font-extrabold leading-none tracking-tight text-ink">
        <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
      </div>
      {sub && <div className="mt-1.5 text-[12px] text-sub">{sub}</div>}
    </motion.div>
  );
}

/* --------------------------- Recommendation card ------------------------- */
export function RecommendationCard({
  scope,
  title,
  body,
  confidence,
  delay,
  affected,
  status = "Pending",
  compact,
}: {
  scope: string;
  title: string;
  body: string;
  confidence: number;
  delay: number;
  affected: number;
  status?: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-card border border-brand/20 bg-gradient-to-b from-brand-tint to-surface p-4 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-soft text-brand">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-[13px] font-semibold text-brand-ink">{scope}</span>
        </div>
        <Badge tone="amber" dot pulse>
          {status}
        </Badge>
      </div>
      <div className="text-[14px] font-semibold leading-snug text-ink">{title}</div>
      {!compact && <p className="mt-1 text-[13px] leading-relaxed text-sub">{body}</p>}

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-line bg-cream/70 p-2.5">
        <Metric label="Confidence" value={`${confidence}%`} tone="text-brand" />
        <Metric label="Expected delay" value={`${delay} min`} />
        <Metric label="Affected" value={`${affected} train${affected > 1 ? "s" : ""}`} />
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-faint">{label}</div>
      <div className={cn("mt-0.5 text-[14px] font-bold", tone ?? "text-ink")}>{value}</div>
    </div>
  );
}

/* --------------------------- Recommendation actions ---------------------- */
export function RecActions({ onReview, onAccept, onReject }: { onReview?: () => void; onAccept?: () => void; onReject?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" size="sm" onClick={onReview}>
        Review
      </Button>
      <Button variant="ai" size="sm" onClick={onReview}>
        Explain
      </Button>
      <div className="ml-auto flex gap-2">
        <Button variant="ghost" size="sm" onClick={onReject}>
          Reject
        </Button>
        <Button variant="primary" size="sm" onClick={onAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
}
