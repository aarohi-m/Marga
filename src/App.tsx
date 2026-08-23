import { MotionConfig } from "framer-motion";
import { AppProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/overlays";
import { ConfirmProvider } from "@/components/ui/overlays";
import { AppShell } from "@/components/layout/AppShell";

export default function App() {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ type: "spring", stiffness: 340, damping: 30, mass: 0.85 }}
    >
      <AppProvider>
        <ToastProvider>
          <ConfirmProvider>
            <AppShell />
          </ConfirmProvider>
        </ToastProvider>
      </AppProvider>
    </MotionConfig>
  );
}
