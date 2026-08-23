import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BellOff, CheckCheck, Info, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerHeader } from "@/components/ui/overlays";
import { useApp } from "@/lib/store";
import { alerts, type Alert } from "@/lib/mockData";
import { cn, timeAgo } from "@/lib/utils";

const meta = {
  critical: { icon: ShieldAlert, color: "text-critical", bg: "bg-critical-soft" },
  high: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning-soft" },
  medium: { icon: AlertTriangle, color: "text-brand", bg: "bg-brand-soft" },
  low: { icon: Info, color: "text-sub", bg: "bg-sand" },
} as const;

function bucket(a: Alert) {
  if (a.severity === "critical") return "Critical";
  if (a.severity === "high") return "Warnings";
  return "Information";
}

export function NotificationDrawer() {
  const { notifOpen, setNotifOpen, navigate } = useApp();
  const [read, setRead] = useState<Record<string, boolean>>({});

  const unread = alerts.filter((a) => a.status === "Unread" && !read[a.id]);
  const ordered = [...alerts].sort((a, b) => b.ts - a.ts);
  const grouped = {
    Critical: ordered.filter((a) => bucket(a) === "Critical"),
    Warnings: ordered.filter((a) => bucket(a) === "Warnings"),
    Information: ordered.filter((a) => bucket(a) === "Information"),
  };

  return (
    <Drawer open={notifOpen} onClose={() => setNotifOpen(false)} width={420}>
      <DrawerHeader
        title={
          <span className="flex items-center gap-2">
            Notifications
            {unread.length > 0 && (
              <span className="rounded-full bg-critical px-1.5 py-0.5 text-[10px] font-bold text-white">{unread.length} new</span>
            )}
          </span>
        }
        subtitle="Operational alerts across all monitored sections"
        onClose={() => setNotifOpen(false)}
        right={
          <button
            onClick={() => setRead(Object.fromEntries(alerts.map((a) => [a.id, true])))}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-sub transition-colors hover:bg-sand hover:text-ink"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-3">
        {(["Critical", "Warnings", "Information"] as const).map((section) =>
          grouped[section].length ? (
            <div key={section} className="mb-4">
              <div className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-faint">{section}</div>
              <div className="space-y-1.5">
                {grouped[section].map((a) => {
                  const m = meta[a.severity];
                  const isUnread = a.status === "Unread" && !read[a.id];
                  return (
                    <motion.button
                      key={a.id}
                      layout
                      onClick={() => {
                        setRead((r) => ({ ...r, [a.id]: true }));
                        navigate("alerts");
                      }}
                      whileHover={{ x: 2 }}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-card border p-3 text-left transition-colors",
                        isUnread ? "border-brand/20 bg-brand-tint" : "border-line bg-surface hover:bg-cream"
                      )}
                    >
                      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", m.bg, m.color)}>
                        <m.icon className="h-4 w-4" style={a.severity === "critical" ? { animation: "soft-pulse 2.4s ease-in-out infinite" } : undefined} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[13px] font-semibold text-ink">{a.title}</span>
                          {isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[12px] text-sub">{a.desc}</p>
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-faint">
                          <span>{a.location}</span>
                          <span>·</span>
                          <span>{timeAgo(a.ts)}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : null
        )}

        <AnimatePresence>
          {Object.values(read).every(Boolean) && unread.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2 py-8 text-center text-sub"
            >
              <BellOff className="h-6 w-6 text-faint" />
              <div className="text-[13px] font-medium">You're all caught up</div>
              <span className="rounded-md border border-line bg-sand px-2 py-0.5 text-[11px] font-semibold text-sub">No unread notifications</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Drawer>
  );
}
