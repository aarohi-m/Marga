import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Cpu,
  Gauge,
  Layers3,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Wand2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge, Button, Card, SectionLabel } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/overlays";
import { cn } from "@/lib/utils";

const planSteps = [
  "Analyzing network…",
  "Checking train paths…",
  "Analyzing maintenance windows…",
  "Checking asset availability…",
  "Resolving conflicts…",
  "Running optimization model…",
  "Generating recommendation…",
];

export function BlockPlanner() {
  const toast = useToast();
  const [route, setRoute] = useState("Western Main Line");
  const [block, setBlock] = useState("Kota Junction → Agra Cantt");
  const [horizon, setHorizon] = useState("24h");
  const [duration, setDuration] = useState(180);
  const [buffer, setBuffer] = useState(25);
  const [priority, setPriority] = useState("balanced");
  const [traffic, setTraffic] = useState(75);
  const [crew, setCrew] = useState(90);

  const [phase, setPhase] = useState<"idle" | "planning" | "done">("idle");
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const generate = () => {
    setPhase("planning");
    setStep(0);
    timers.current.forEach(clearTimeout);
    planSteps.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i + 1), 280 * (i + 1)));
    });
    timers.current.push(
      window.setTimeout(() => {
        setPhase("done");
        toast("AI plan generated successfully", { desc: "Recommendation ready for review.", tone: "success" });
      }, 280 * (planSteps.length + 1) + 250)
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setPhase("idle");
    setStep(0);
  };

  return (
    <PageContainer
      title="AI Block Planner"
      subtitle="AI-assisted railway block scheduling and decision support"
      meta={
        <>
          <Badge tone="blue" dot pulse><Sparkles className="mr-0.5 h-3 w-3" /> Planning Engine v4.2</Badge>
          <span className="text-[12px] text-sub">Optimization model online</span>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[360px_1fr]">
        {/* Left: config */}
        <div className="space-y-4">
          <Card className="p-4">
            <SectionLabel className="mb-3">Selection</SectionLabel>
            <div className="space-y-3">
              <Field label="Route">
                <Select value={route} onChange={setRoute} options={["Western Main Line", "Northern Corridor", "Central Trunk", "Southern Main"]} />
              </Field>
              <Field label="Block Section">
                <Select value={block} onChange={setBlock} options={["Kota Junction → Agra Cantt", "Mumbai Central → Surat", "Ratlam → Kota", "Mathura → New Delhi"]} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date">
                  <div className="flex h-9 items-center gap-2 rounded-lg border border-line bg-cream px-3 text-[13px] text-ink">
                    <Calendar className="h-3.5 w-3.5 text-sub" /> 23 Aug 2026
                  </div>
                </Field>
                <Field label="Horizon">
                  <Select value={horizon} onChange={setHorizon} options={["8h", "12h", "24h", "48h"]} />
                </Field>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
              <Detail label="Distance" value="430 km" icon={<MapPin className="h-3.5 w-3.5" />} />
              <Detail label="Blocks" value="68" icon={<Layers3 className="h-3.5 w-3.5" />} />
              <Detail label="Status" value="Blocked" icon={<AlertTriangle className="h-3.5 w-3.5" />} tone="text-critical" />
              <Detail label="Speed limit" value="80 km/h" icon={<Gauge className="h-3.5 w-3.5" />} />
            </div>
          </Card>

          <Card className="p-4">
            <SectionLabel className="mb-3">Planning parameters</SectionLabel>
            <div className="space-y-4">
              <Slider label="Maintenance duration" value={duration} min={60} max={480} step={15} onChange={setDuration} suffix=" min" />
              <Slider label="Safety buffer" value={buffer} min={5} max={60} step={5} onChange={setBuffer} suffix=" min" />
              <Slider label="Expected traffic" value={traffic} min={0} max={100} step={5} onChange={setTraffic} suffix="%" />
              <Slider label="Asset availability" value={crew} min={0} max={100} step={5} onChange={setCrew} suffix="%" />
              <Field label="Traffic priority">
                <Select value={priority === "balanced" ? "Balanced" : priority === "passenger" ? "Passenger-first" : "Freight-first"} onChange={(v) => setPriority(v.toLowerCase().split("-")[0])} options={["Balanced", "Passenger-first", "Freight-first"]} />
              </Field>
            </div>

            <div className="mt-5 flex gap-2">
              <Button variant="primary" className="flex-1" icon={<Wand2 />} onClick={generate} disabled={phase === "planning"}>
                {phase === "planning" ? "Generating…" : "Generate AI Plan"}
              </Button>
              <Button variant="secondary" icon={<RotateCcw />} onClick={reset}>Reset</Button>
            </div>
          </Card>
        </div>

        {/* Right: workspace */}
        <div>
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div key="idle" {...fade} className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-card border border-dashed border-line bg-cream/50 p-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Cpu className="h-7 w-7" />
                </div>
                <div className="text-[16px] font-semibold text-ink">Planning workspace ready</div>
                <p className="mt-1 max-w-sm text-[13px] text-sub">Configure the route, block section and planning parameters, then generate an AI-optimized block schedule.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge tone="blue"><Sparkles className="mr-1 h-3 w-3" /> Constraint solver</Badge>
                  <Badge tone="green"><ShieldCheck className="mr-1 h-3 w-3" /> Safety-aware</Badge>
                  <Badge tone="violet"><TrainFront className="mr-1 h-3 w-3" /> Multi-train</Badge>
                </div>
              </motion.div>
            )}

            {phase === "planning" && (
              <motion.div key="planning" {...fade} className="rounded-card border border-brand/20 bg-gradient-to-b from-brand-tint to-surface p-5">
                <div className="mb-4 flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <Sparkles className="h-4 w-4" />
                  </motion.span>
                  <span className="text-[15px] font-semibold text-brand-ink">Generating optimized plan…</span>
                </div>
                <div className="space-y-1">
                  {planSteps.map((s, i) => {
                    const done = i < step;
                    const active = i === step;
                    return (
                      <motion.div key={s} initial={{ opacity: 0.4 }} animate={{ opacity: done || active ? 1 : 0.5 }} className="flex items-center gap-3 rounded-lg px-2 py-2">
                        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full", done ? "bg-success text-white" : active ? "bg-brand text-white" : "bg-sand text-faint")}>
                          {done ? <CheckCircle2 className="h-4 w-4" /> : active ? <motion.span animate={{ scale: [1, 0.6, 1] }} transition={{ duration: 0.9, repeat: Infinity }} className="h-2 w-2 rounded-full bg-white" /> : <span className="text-[11px]">{i + 1}</span>}
                        </span>
                        <span className={cn("text-[13.5px]", done ? "text-sub line-through" : active ? "font-semibold text-ink" : "text-sub")}>{s.replace("…", "")}</span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand-soft">
                  <motion.div className="h-full rounded-full bg-brand" animate={{ width: `${(step / planSteps.length) * 100}%` }} transition={{ duration: 0.3 }} />
                </div>
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div key="done" {...fade} className="space-y-4">
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between border-b border-line bg-brand-tint px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white"><Sparkles className="h-4 w-4" /></span>
                      <span className="text-[14px] font-semibold text-brand-ink">AI Generated Plan</span>
                    </div>
                    <Badge tone="green" dot>Ready for review</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
                    <Result label="Recommended window" value="01:30 – 04:30" sub="3h 00m · tonight" />
                    <Result label="Affected trains" value="5" sub="rerouted or held" />
                    <Result label="Expected delay" value="20 min" sub="vs 38 min projected" tone="text-success" />
                    <Result label="Asset utilization" value="88%" />
                    <Result label="Safety confidence" value="94%" tone="text-success" />
                    <Result label="Optimization score" value="87%" tone="text-brand" />
                  </div>
                </Card>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_200px]">
                  <Card className="p-4">
                    <SectionLabel className="mb-2">Plan summary</SectionLabel>
                    <p className="text-[13.5px] leading-relaxed text-ink-soft">
                      The optimizer recommends executing the Kota–Agra block between <span className="font-semibold text-ink">01:30 and 04:30 IST</span>, holding <span className="font-semibold text-ink">12951 Rajdhani</span> at Kota Junction for 20 minutes and dispatching <span className="font-semibold text-ink">12009 Shatabdi</span> on a shifted block path. This minimizes cascading delay while preserving crew availability and a 25-minute safety buffer.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge tone="green"><CheckCircle2 className="mr-1 h-3 w-3" /> No hard conflicts</Badge>
                      <Badge tone="blue"><ShieldCheck className="mr-1 h-3 w-3" /> Within safety envelope</Badge>
                      <Badge tone="amber"><AlertTriangle className="mr-1 h-3 w-3" /> 1 soft caution</Badge>
                    </div>
                  </Card>
                  <Card className="flex flex-col items-center justify-center p-4">
                    <ConfidenceRing value={87} />
                    <div className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-faint">Confidence</div>
                  </Card>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" icon={<CheckCircle2 />} onClick={() => toast("Plan committed to schedule", { desc: "Block window 01:30–04:30 reserved.", tone: "success" })}>Commit to schedule</Button>
                  <Button variant="secondary" onClick={() => toast("Plan saved as draft", { tone: "info" })}>Save draft</Button>
                  <Button variant="ghost" icon={<RotateCcw />} onClick={reset}>Discard</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-sub">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full appearance-none rounded-lg border border-line bg-cream px-3 pr-8 text-[13px] font-medium text-ink outline-none transition-colors hover:border-brand/30 focus:border-brand/40 focus:ring-2 focus:ring-brand/20">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sub" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, suffix }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] font-medium text-sub">{label}</span>
        <span className="text-[12.5px] font-semibold text-ink">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-card [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand"
        style={{ background: `linear-gradient(90deg, #1557A6 ${pct}%, #E7E2D6 ${pct}%)` }}
      />
    </div>
  );
}

function Detail({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone?: string }) {
  return (
    <div className="bg-surface px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-faint"><span className="text-sub">{icon}</span>{label}</div>
      <div className={cn("mt-0.5 text-[14px] font-bold", tone ?? "text-ink")}>{value}</div>
    </div>
  );
}

function Result({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-faint">{label}</div>
      <div className={cn("mt-0.5 font-display text-[19px] font-extrabold", tone ?? "text-ink")}>{value}</div>
      {sub && <div className="text-[11.5px] text-sub">{sub}</div>}
    </div>
  );
}

function ConfidenceRing({ value }: { value: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-[110px] w-[110px]">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E7E2D6" strokeWidth="8" />
        <motion.circle cx="50" cy="50" r={r} fill="none" stroke="#1557A6" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (c * value) / 100 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[24px] font-extrabold text-ink">{value}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-faint">score</span>
      </div>
    </div>
  );
}
