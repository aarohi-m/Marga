import { type ReactNode } from "react";
import { Card } from "./ui/primitives";
import { cn } from "@/lib/utils";

/* A consistent card wrapper for charts */
export function ChartCard({
  title,
  sub,
  action,
  children,
  className,
  bodyClass,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <div className="text-[13.5px] font-semibold text-ink">{title}</div>
          {sub && <div className="mt-0.5 text-[12px] text-sub">{sub}</div>}
        </div>
        {action}
      </div>
      <div className={cn("p-4", bodyClass)}>{children}</div>
    </Card>
  );
}

/* Elegant shared tooltip */
export function ChartTooltip({ active, payload, label, unit = "", suffix }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-pop">
      {label && <div className="mb-1 text-[11px] font-semibold text-sub">{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[12px]">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="capitalize text-sub">{p.name}:</span>
          <span className="font-semibold text-ink">
            {p.value}
            {suffix ?? unit}
          </span>
        </div>
      ))}
    </div>
  );
}

export const axisProps = {
  tick: { fontSize: 11, fill: "#98A2B3" },
  axisLine: false,
  tickLine: false,
} as const;

export const gridProps = {
  stroke: "#E7E2D6",
  strokeDasharray: "3 3",
  vertical: false,
} as const;
