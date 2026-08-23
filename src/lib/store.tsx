import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

export type PageId =
  | "overview"
  | "operations"
  | "network"
  | "planner"
  | "schedule"
  | "conflicts"
  | "assets"
  | "maintenance"
  | "explainability"
  | "analytics"
  | "alerts"
  | "collaboration"
  | "forms"
  | "reports"
  | "datafeeds"
  | "status"
  | "settings"
  | "tickets"
  | "intervention";

interface AppState {
  page: PageId;
  navigate: (p: PageId) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useCallback((p: PageId) => {
    setPage(p);
    setPaletteOpen(false);
    setNotifOpen(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <Ctx.Provider
      value={{
        page,
        navigate,
        collapsed,
        setCollapsed,
        toggleCollapsed,
        paletteOpen,
        setPaletteOpen,
        notifOpen,
        setNotifOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

/* Page metadata map for titles & subtitles */
export const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
  overview: { title: "Executive Overview", subtitle: "Railway operations dashboard · Sunday, 23 August 2026" },
  operations: { title: "Operations Command Center", subtitle: "Real-time railway operations monitoring and decision support" },
  network: { title: "Live Network", subtitle: "Real-time railway network monitoring and topology" },
  planner: { title: "AI Block Planner", subtitle: "AI-assisted railway block scheduling and decision support" },
  schedule: { title: "Block Schedule", subtitle: "AI-powered automatic block planning · maximising asset availability" },
  conflicts: { title: "Conflict Manager", subtitle: "Detect, analyze and resolve operational conflicts" },
  assets: { title: "Asset Availability", subtitle: "Track, signal, platform and equipment status" },
  maintenance: { title: "Maintenance Planning", subtitle: "Planned, active and completed maintenance operations" },
  explainability: { title: "AI Decision Explainability", subtitle: "Understand why the AI made each recommendation" },
  analytics: { title: "Operations Analytics", subtitle: "Performance trends and operational insights" },
  alerts: { title: "Alerts & Notifications", subtitle: "Operational alerts, warnings and acknowledgements" },
  collaboration: { title: "Collaboration Hub", subtitle: "Operations team workspace and incident coordination" },
  forms: { title: "e-Fill Forms", subtitle: "Digital requisitions, caution orders and override justifications" },
  reports: { title: "Reports", subtitle: "Operational reports and compliance records" },
  datafeeds: { title: "Data Feeds", subtitle: "Integration health, data lineage and reconciliation" },
  status: { title: "System Status", subtitle: "Platform health, diagnostics and controlled demonstration" },
  settings: { title: "Settings", subtitle: "Workspace, AI, security and accessibility preferences" },
  tickets: { title: "Operations Tickets", subtitle: "Track and prioritise operational work items" },
  intervention: { title: "Manual Intervention", subtitle: "Controlled manual override and emergency operations" },
};
