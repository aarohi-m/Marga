import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CommandPalette } from "./CommandPalette";
import { NotificationDrawer } from "./NotificationDrawer";
import { useApp, type PageId } from "@/lib/store";

import { Overview } from "@/pages/Overview";
import { Operations } from "@/pages/Operations";
import { LiveNetwork } from "@/pages/LiveNetwork";
import { BlockPlanner } from "@/pages/BlockPlanner";
import { BlockSchedule } from "@/pages/BlockSchedule";
import { Conflicts } from "@/pages/Conflicts";
import { Assets } from "@/pages/Assets";
import { Maintenance } from "@/pages/Maintenance";
import { Explainability } from "@/pages/Explainability";
import { Analytics } from "@/pages/Analytics";
import { Alerts } from "@/pages/Alerts";
import { Collaboration } from "@/pages/Collaboration";
import { Forms } from "@/pages/Forms";
import { Reports } from "@/pages/Reports";
import { DataFeeds } from "@/pages/DataFeeds";
import { Status } from "@/pages/Status";
import { Settings } from "@/pages/Settings";
import { Tickets } from "@/pages/Tickets";
import { Intervention } from "@/pages/Intervention";

const routes: Record<PageId, () => React.ReactElement> = {
  overview: Overview,
  operations: Operations,
  network: LiveNetwork,
  planner: BlockPlanner,
  schedule: BlockSchedule,
  conflicts: Conflicts,
  assets: Assets,
  maintenance: Maintenance,
  explainability: Explainability,
  analytics: Analytics,
  alerts: Alerts,
  collaboration: Collaboration,
  forms: Forms,
  reports: Reports,
  datafeeds: DataFeeds,
  status: Status,
  settings: Settings,
  tickets: Tickets,
  intervention: Intervention,
};

export function AppShell() {
  const { page, toggleCollapsed } = useApp();
  const Page = routes[page];

  // Global keyboard shortcut: Cmd/Ctrl + B toggles the sidebar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleCollapsed]);

  return (
    <div className="relative flex h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-brand/5 blur-3xl"
          animate={{ x: [0, -18, 0], y: [0, 14, 0], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-[28%] h-52 w-52 rounded-full bg-warning/5 blur-3xl"
          animate={{ x: [0, 16, 0], y: [0, -10, 0], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="app-page relative z-10"
            >
              <Page />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <CommandPalette />
      <NotificationDrawer />
    </div>
  );
}
