import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { Button } from "./primitives";
import { cn } from "@/lib/utils";

/* --------------------------------- Modal --------------------------------- */
export function Modal({
  open,
  onClose,
  children,
  className,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={cn(
              "relative w-full overflow-hidden rounded-card border border-line bg-surface shadow-pop",
              widths[size],
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------- Drawer -------------------------------- */
export function Drawer({
  open,
  onClose,
  children,
  width = 460,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/30"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="absolute right-0 top-0 h-full w-full border-l border-line bg-surface shadow-pop"
            style={{ maxWidth: width }}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Drawer header ---------------------------- */
export function DrawerHeader({
  title,
  subtitle,
  onClose,
  right,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <div className="text-base font-semibold text-ink">{title}</div>
        {subtitle && <div className="mt-0.5 text-[13px] text-sub">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-1">
        {right}
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sub transition-colors hover:bg-sand hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- Confirm modal ----------------------------- */
interface ConfirmOptions {
  title: string;
  action: string;
  impact: string;
  affected?: string;
  section?: string;
  reason?: boolean;
  danger?: boolean;
  twoStep?: boolean;
}
interface ConfirmCtx {
  confirm: (o: ConfirmOptions) => Promise<boolean>;
}
const ConfirmContext = createContext<ConfirmCtx | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("");
  const resolver = useRef<(v: boolean) => void>(() => {});

  const confirm = useCallback((o: ConfirmOptions) => {
    setOpts(o);
    setStep(1);
    setReason("");
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (val: boolean) => {
    resolver.current(val);
    setOpts(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Modal open={!!opts} onClose={() => close(false)} size="md">
        {opts && (
          <div>
            <div className="flex items-start gap-3 px-5 pt-5">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  opts.danger ? "bg-critical-soft text-critical" : "bg-brand-soft text-brand"
                )}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold text-ink">{opts.title}</div>
                <div className="mt-0.5 text-[13px] text-sub">
                  This is an operationally significant action and will be recorded to the audit log.
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden border-y border-line bg-line text-[13px]">
              <Field label="Action" value={opts.action} />
              <Field label="Impact" value={opts.impact} tone={opts.danger ? "critical" : undefined} />
              {opts.affected && <Field label="Affected trains" value={opts.affected} />}
              {opts.section && <Field label="Section" value={opts.section} />}
              <Field label="Operator" value="R. Sharma" />
            </div>

            {opts.reason && (
              <div className="px-5 py-3">
                <label className="mb-1 block text-[12px] font-semibold text-sub">
                  Reason for intervention <span className="text-critical">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="Provide operational justification…"
                  className="w-full resize-none rounded-lg border border-line bg-cream px-3 py-2 text-[13px] text-ink outline-none placeholder:text-faint focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
                />
              </div>
            )}

            {opts.twoStep && (
              <div className="px-5 pb-1 text-[12px] font-medium text-sub">
                Step {step} of 2 · {step === 1 ? "Review impact" : "Final confirmation"}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 px-5 py-4">
              <div className="text-[11px] text-faint">Audit ID · {Math.random().toString(36).slice(2, 10).toUpperCase()}</div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => close(false)}>
                  Cancel
                </Button>
                {opts.twoStep && step === 1 ? (
                  <Button variant={opts.danger ? "danger" : "primary"} onClick={() => setStep(2)}>
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant={opts.danger ? "danger" : "primary"}
                    disabled={opts.reason && reason.trim().length < 4}
                    onClick={() => close(true)}
                  >
                    Confirm {opts.action}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}

function Field({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "critical";
}) {
  return (
    <div className="bg-surface px-4 py-2.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-faint">{label}</div>
      <div className={cn("mt-0.5 font-medium", tone === "critical" ? "text-critical" : "text-ink")}>{value}</div>
    </div>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx.confirm;
}

/* ------------------------------ Toast system ----------------------------- */
type ToastTone = "success" | "info" | "warning" | "danger";
interface ToastItem {
  id: number;
  title: string;
  desc?: string;
  tone: ToastTone;
}
interface ToastCtx {
  toast: (title: string, opts?: { desc?: string; tone?: ToastTone }) => void;
}
const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback(
    (title: string, opts?: { desc?: string; tone?: ToastTone }) => {
      const id = ++idRef.current;
      setItems((p) => [...p, { id, title, desc: opts?.desc, tone: opts?.tone ?? "success" }]);
      setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 4200);
    },
    []
  );

  const icons = {
    success: <CheckCircle2 className="h-[18px] w-[18px] text-success" />,
    info: <Info className="h-[18px] w-[18px] text-brand" />,
    warning: <AlertTriangle className="h-[18px] w-[18px] text-warning" />,
    danger: <AlertTriangle className="h-[18px] w-[18px] text-critical" />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[340px] flex-col gap-2">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="pointer-events-auto flex items-start gap-2.5 rounded-card border border-line bg-surface p-3 shadow-pop"
            >
              <div className="mt-0.5">{icons[t.tone]}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-ink">{t.title}</div>
                {t.desc && <div className="mt-0.5 text-[12px] text-sub">{t.desc}</div>}
              </div>
              <button
                onClick={() => setItems((p) => p.filter((x) => x.id !== t.id))}
                className="text-faint transition-colors hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}
