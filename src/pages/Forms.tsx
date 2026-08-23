import { AnimatePresence, motion } from "framer-motion";
import { Check, FileCheck2, FileText, Plus, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Drawer, DrawerHeader, useToast } from "@/components/ui/overlays";
import { Badge, Button, Card, SectionLabel, Switch } from "@/components/ui/primitives";
import { eForms } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const statusTone: Record<string, "green" | "amber" | "blue" | "red"> = {
  Approved: "green",
  "Pending DEN": "amber",
  "Under Review": "blue",
  Rejected: "red",
};

const templates = [
  { icon: FileText, name: "Block Requisition", sub: "Form E-1", tone: "bg-brand-soft text-brand", desc: "Request a traffic/power block for maintenance" },
  { icon: ShieldQuestion, name: "Caution Order Advice", sub: "Advisory", tone: "bg-warning-soft text-warning", desc: "Issue temporary speed restriction advisory" },
  { icon: FileCheck2, name: "Override Justification", sub: "Audit", tone: "bg-violet-soft text-violet", desc: "Justify manual override of AI recommendation" },
];

const steps = ["Details", "Safety checks", "Approval", "Submitted"];

export function Forms() {
  const toast = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState(0);
  const [checks, setChecks] = useState({ block: false, isolation: false, crew: false });

  const open = (tpl: number) => {
    setTemplate(tpl);
    setStep(0);
    setSelected("new");
  };

  const submit = () => {
    setStep(3);
    toast("e-Fill form submitted", { desc: "Routed to DEN for approval.", tone: "success" });
  };

  return (
    <PageContainer
      title="e-Fill Forms"
      subtitle="Digital requisitions, caution orders and override justifications"
      meta={<Badge tone="amber" dot>{eForms.filter((f) => f.status === "Pending DEN").length} pending DEN</Badge>}
      actions={<Button variant="primary" size="sm" icon={<Plus />} onClick={() => open(0)}>New e-Fill</Button>}
    >
      {/* Templates */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {templates.map((t, i) => (
          <motion.button
            key={t.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            onClick={() => open(i)}
            className="rounded-card border border-line bg-surface p-4 text-left shadow-card transition-shadow hover:shadow-lift"
          >
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-[10px]", t.tone)}><t.icon className="h-5 w-5" /></div>
            <div className="mt-3 text-[14px] font-semibold text-ink">{t.name}</div>
            <div className="text-[11.5px] font-medium text-sub">{t.sub}</div>
            <p className="mt-1.5 text-[12.5px] text-sub">{t.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Table */}
      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-line px-4 py-3 text-[13.5px] font-semibold text-ink">Recent filings</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                <th className="px-4 py-2.5 font-semibold">Ref</th>
                <th className="px-3 py-2.5 font-semibold">Form</th>
                <th className="px-3 py-2.5 font-semibold">Zone</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">Filed</th>
              </tr>
            </thead>
            <tbody>
              {eForms.map((f) => (
                <tr key={f.ref} onClick={() => { setTemplate(0); setSelected(f.ref); setStep(2); }} className="cursor-pointer border-b border-line-soft transition-colors last:border-0 hover:bg-cream">
                  <td className="px-4 py-3 font-semibold text-ink">{f.ref}</td>
                  <td className="px-3 py-3 text-ink-soft">{f.form}</td>
                  <td className="px-3 py-3"><span className="rounded-md bg-sand px-1.5 py-0.5 text-[11.5px] font-medium text-ink-soft">{f.zone}</span></td>
                  <td className="px-3 py-3"><Badge tone={statusTone[f.status]} dot>{f.status}</Badge></td>
                  <td className="px-3 py-3 text-[12px] text-sub">{f.filed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Wizard drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} width={480}>
        {selected && (
          <>
            <DrawerHeader title={templates[template].name} subtitle={`${templates[template].sub} · ${selected === "new" ? "New draft" : selected}`} onClose={() => setSelected(null)} />
            {/* Stepper */}
            <div className="flex items-center gap-1 border-b border-line px-4 py-3">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-1">
                  <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold", i < step ? "bg-success text-white" : i === step ? "bg-brand text-white" : "bg-sand text-faint")}>
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={cn("text-[11.5px] font-medium", i <= step ? "text-ink" : "text-faint")}>{s}</span>
                  {i < steps.length - 1 && <div className="mx-1 h-px flex-1 bg-line" />}
                </div>
              ))}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                    <SectionLabel className="mb-1">Auto-filled operational data</SectionLabel>
                    <Input label="Section" value="RS005 · Kota–Agra" />
                    <Input label="Requested window" value="23 Aug · 01:30 – 04:30" />
                    <Input label="Duration" value="3h 00m" />
                    <Input label="Justification" value="Emergency fishplate repair at km 12.5" />
                    <Input label="Requesting officer" value="R. Sharma · Section Controller" />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-2">
                    <SectionLabel className="mb-1">Safety checks</SectionLabel>
                    {([["block", "Block section confirmed clear of traffic"], ["isolation", "OHE isolation & earthing verified"], ["crew", "Maintenance crew & lookouts deployed"]] as const).map(([k, label]) => (
                      <label key={k} className="flex items-center justify-between rounded-xl border border-line bg-cream px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[13px] text-ink-soft"><ShieldCheck className="h-4 w-4 text-sub" />{label}</span>
                        <Switch checked={checks[k]} onChange={(v) => setChecks((p) => ({ ...p, [k]: v }))} />
                      </label>
                    ))}
                    {!checks.block || !checks.isolation || !checks.crew ? <p className="text-[11.5px] text-warning">All safety checks must be confirmed before approval.</p> : null}
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                    <SectionLabel className="mb-1">Approval workflow</SectionLabel>
                    <div className="space-y-2">
                      {["Section Controller → filed", "Station Master → verified", "DEN → approval", "Control Office → published"].map((n, i) => (
                        <div key={n} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[12.5px]">
                          <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold", i < 2 ? "bg-success text-white" : "bg-sand text-faint")}>{i < 2 ? <Check className="h-3 w-3" /> : i + 1}</span>
                          <span className="text-ink-soft">{n}</span>
                          {i < 2 && <Badge tone="green" className="ml-auto">Done</Badge>}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-soft text-success"><Check className="h-7 w-7" /></div>
                    <div className="mt-3 text-[15px] font-semibold text-ink">Form submitted</div>
                    <p className="mt-1 max-w-xs text-[13px] text-sub">Routed to the Divisional Engineer for approval. You'll be notified on status change.</p>
                    <Badge tone="amber" dot className="mt-3">Pending DEN</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3">
              <Button variant="ghost" size="sm" onClick={() => toast("Draft saved", { tone: "info" })}>Save draft</Button>
              <div className="flex gap-2">
                {step > 0 && step < 3 && <Button variant="secondary" size="sm" onClick={() => setStep((s) => s - 1)}>Back</Button>}
                {step === 0 && <Button variant="primary" size="sm" onClick={() => setStep(1)}>Continue</Button>}
                {step === 1 && <Button variant="primary" size="sm" disabled={!checks.block || !checks.isolation || !checks.crew} onClick={() => setStep(2)}>Continue</Button>}
                {step === 2 && <Button variant="primary" size="sm" icon={<FileCheck2 className="h-4 w-4" />} onClick={submit}>Submit</Button>}
                {step === 3 && <Button variant="primary" size="sm" onClick={() => setSelected(null)}>Close</Button>}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </PageContainer>
  );
}

function Input({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-sub">{label}</span>
      <input defaultValue={value} className="h-9 w-full rounded-lg border border-line bg-cream px-3 text-[13px] text-ink outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20" />
    </label>
  );
}
