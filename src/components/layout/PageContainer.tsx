import { type ReactNode } from "react";

export function PageContainer({
  title,
  subtitle,
  actions,
  meta,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="px-4 pb-12 pt-5 md:px-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-[22px] font-bold tracking-tight text-ink md:text-[26px]">{title}</h2>
          {subtitle && <p className="mt-1 text-[13.5px] text-sub">{subtitle}</p>}
          {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </main>
  );
}
