import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle2, GitBranch, Radar, ShieldQuestion, Sparkles, TrendingUp } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge, Button, Card, Progress, SectionLabel } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/overlays";
import { confidenceBreakdown, explainInputs, recommendations, reasoning } from "@/lib/mockData";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const inputIcons = [Radar, GitBranch, ShieldQuestion, TrendingUp, Brain, CheckCircle2, Sparkles, ArrowRight];

export function Explainability() {
  const toast = useToast();
  const { navigate } = useApp();
  const rec = recommendations[0];

  return (
    <PageContainer
      title="AI Decision Explainability"
      subtitle="Understand why the AI made each recommendation"
      meta={<Badge tone="blue" dot pulse><Sparkles className="mr-0.5 h-3 w-3" /> Model v4.2 · explainable</Badge>}
    >
      {/* Top recommendation */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><Sparkles className="h-5 w-5" /></span>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge tone="amber" dot pulse>Pending</Badge>
                <span className="text-[12px] font-medium text-sub">{rec.scope} · Block RS005 (Kota–Agra)</span>
              </div>
              <p className="mt-2 text-[18px] font-semibold leading-snug text-ink">{rec.title}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line md:w-[300px]">
            <Stat label="Confidence" value={`${rec.confidence}%`} tone="text-brand" />
            <Stat label="Expected delay" value={`${rec.delay} min`} />
            <Stat label="Affected" value={`${rec.affected}`} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line bg-cream px-5 py-3">
          <Button variant="primary" size="sm" icon={<CheckCircle2 />} onClick={() => toast("Recommendation accepted", { desc: `${rec.id} queued for execution.`, tone: "info" })}>Accept recommendation</Button>
          <Button variant="secondary" size="sm" onClick={() => navigate("operations")}>View in operations</Button>
          <Button variant="ghost" size="sm" onClick={() => toast("Recommendation flagged for review", { tone: "warning" })}>Flag for review</Button>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Inputs considered */}
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>Inputs considered</SectionLabel>
            <span className="text-[11.5px] text-sub">{explainInputs.length} factors</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {explainInputs.map((inp, i) => {
              const Icon = inputIcons[i % inputIcons.length];
              return (
                <motion.div key={inp.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-xl border border-line bg-cream p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-brand"><Icon className="h-3.5 w-3.5" /></span>
                      <span className="text-[12.5px] font-medium text-ink">{inp.label}</span>
                    </div>
                    <span className="text-[12px] font-bold text-brand">{inp.weight}%</span>
                  </div>
                  <div className="mt-2"><Progress value={inp.weight * 4} tone="blue" /></div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Confidence analysis */}
        <Card className="p-4">
          <SectionLabel className="mb-3">Confidence analysis</SectionLabel>
          <div className="mb-4 rounded-xl border border-line bg-gradient-to-b from-brand-tint to-surface p-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[12px] font-medium text-sub">Overall confidence</div>
                <div className="font-display text-[34px] font-extrabold leading-none text-brand">{rec.confidence}%</div>
              </div>
              <Badge tone="green" dot>High reliability</Badge>
            </div>
            <div className="mt-3"><Progress value={rec.confidence} tone="blue" /></div>
          </div>
          <div className="space-y-3">
            {confidenceBreakdown.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                <div className="mb-1 flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-soft">{c.label}</span>
                  <span className="font-semibold text-ink">{c.value}%</span>
                </div>
                <Progress value={c.value} tone={c.value > 88 ? "green" : c.value > 80 ? "blue" : "amber"} />
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reasoning timeline */}
      <Card className="mt-4 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-4 w-4 text-brand" />
          <span className="text-[14px] font-semibold text-ink">Why this decision?</span>
        </div>
        <div className="relative">
          <div className="absolute bottom-3 left-[18px] top-3 w-px bg-line-strong sm:left-[22px]" />
          <div className="space-y-3">
            {reasoning.map((r, i) => (
              <motion.div key={r.step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="relative flex items-start gap-3">
                <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-brand/20 bg-brand-soft font-display text-[13px] font-bold text-brand">{r.step}</span>
                <div className="flex-1 rounded-xl border border-line bg-cream px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-ink">{r.text}</span>
                    {i === reasoning.length - 1 && <Badge tone="green" dot>Optimal</Badge>}
                  </div>
                </div>
                {i < reasoning.length - 1 && <ArrowRight className="absolute -bottom-1 left-3.5 h-3 w-3 rotate-90 text-line-strong sm:left-[20px]" />}
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-surface px-3 py-2.5 text-center">
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-faint">{label}</div>
      <div className={cn("mt-0.5 font-display text-[17px] font-extrabold", tone ?? "text-ink")}>{value}</div>
    </div>
  );
}
