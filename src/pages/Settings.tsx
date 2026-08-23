import { Bell, BrainCircuit, Keyboard, Lock, Palette, ShieldCheck, Sparkles, UserCog } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useToast } from "@/components/ui/overlays";
import { Avatar, Badge, Button, Card, SectionLabel, Switch } from "@/components/ui/primitives";

const Select = ({ value, options }: { value: string; options: string[] }) => (
  <div className="relative">
    <select defaultValue={value} className="h-9 appearance-none rounded-lg border border-line bg-cream pl-3 pr-8 text-[13px] font-medium text-ink outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/20">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <svg className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sub" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
  </div>
);

function Row({ icon: Icon, title, desc, children }: { icon: any; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream text-sub"><Icon className="h-[18px] w-[18px]" /></span>
        <div className="min-w-0">
          <div className="text-[13.5px] font-semibold text-ink">{title}</div>
          <div className="text-[12px] text-sub">{desc}</div>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function Settings() {
  const toast = useToast();
  const [toggles, setToggles] = useState({ critical: true, ai: true, motion: true, twofa: true, highContrast: false, reduceMotion: false });
  const set = (k: string, v: boolean) => setToggles((p) => ({ ...p, [k]: v }));

  return (
    <PageContainer
      title="Settings"
      subtitle="Workspace, AI, security and accessibility preferences"
      meta={<Badge tone="green" dot>Workspace synced</Badge>}
      actions={<Button variant="primary" size="sm" onClick={() => toast("Settings saved", { tone: "success" })}>Save changes</Button>}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Workspace */}
        <Card className="p-4">
          <div className="mb-1 flex items-center gap-2"><UserCog className="h-4 w-4 text-brand" /><span className="text-[14px] font-semibold text-ink">Workspace Settings</span></div>
          <div className="divide-y divide-line">
            <Row icon={Palette} title="Operational Mode" desc="Current operating posture"><Select value="Normal" options={["Normal", "Degraded", "Emergency"]} /></Row>
            <Row icon={UserCog} title="Division" desc="Active operational division"><Select value="Northern Division (NDLS)" options={["Northern Division (NDLS)", "Western (BCT)", "West Central (JBP)"]} /></Row>
            <Row icon={Palette} title="Interface Density" desc="Information density preset"><Select value="Enterprise" options={["Compact", "Enterprise", "Comfortable"]} /></Row>
            <Row icon={Sparkles} title="Motion Preference" desc="Interface animation behaviour">
              <Switch checked={toggles.motion} onChange={(v) => set("motion", v)} label="Motion" />
            </Row>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-4">
          <div className="mb-1 flex items-center gap-2"><Bell className="h-4 w-4 text-brand" /><span className="text-[14px] font-semibold text-ink">Notifications</span></div>
          <div className="divide-y divide-line">
            <Row icon={Bell} title="Critical alerts" desc="Push for critical operational alerts"><Switch checked={toggles.critical} onChange={(v) => set("critical", v)} label="Critical alerts" /></Row>
            <Row icon={Sparkles} title="AI recommendations" desc="Notify on new recommendations"><Switch checked={toggles.ai} onChange={(v) => set("ai", v)} label="AI recommendations" /></Row>
            <Row icon={Bell} title="Email digest" desc="Daily operational summary"><Select value="Daily 06:00" options={["Off", "Daily 06:00", "Hourly"]} /></Row>
          </div>
        </Card>

        {/* AI preferences */}
        <Card className="p-4">
          <div className="mb-1 flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-brand" /><span className="text-[14px] font-semibold text-ink">AI Preferences</span></div>
          <div className="divide-y divide-line">
            <Row icon={BrainCircuit} title="Automation level" desc="How autonomously AI acts"><Select value="Recommend only" options={["Recommend only", "Assisted", "Semi-autonomous"]} /></Row>
            <Row icon={ShieldCheck} title="Confidence threshold" desc="Min confidence to surface"><Select value="≥ 80%" options={["≥ 70%", "≥ 80%", "≥ 90%"]} /></Row>
            <Row icon={Sparkles} title="Explainability depth" desc="Reasoning detail shown"><Select value="Detailed" options={["Summary", "Detailed", "Full trace"]} /></Row>
          </div>
        </Card>

        {/* Security & accessibility */}
        <Card className="p-4">
          <div className="mb-1 flex items-center gap-2"><Lock className="h-4 w-4 text-brand" /><span className="text-[14px] font-semibold text-ink">Security & Accessibility</span></div>
          <div className="divide-y divide-line">
            <Row icon={ShieldCheck} title="Two-factor authentication" desc="Required for critical actions"><Switch checked={toggles.twofa} onChange={(v) => set("twofa", v)} label="2FA" /></Row>
            <Row icon={Palette} title="High contrast" desc="Increase visual contrast"><Switch checked={toggles.highContrast} onChange={(v) => set("highContrast", v)} label="High contrast" /></Row>
            <Row icon={Sparkles} title="Reduce motion" desc="Minimise animations"><Switch checked={toggles.reduceMotion} onChange={(v) => set("reduceMotion", v)} label="Reduce motion" /></Row>
          </div>
        </Card>
      </div>

      {/* Keyboard shortcuts + profile */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2"><Keyboard className="h-4 w-4 text-brand" /><span className="text-[14px] font-semibold text-ink">Keyboard shortcuts</span></div>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {[["Open search", "⌘K"], ["Toggle sidebar", "⌘B"], ["New e-fill", "⌘N"], ["Notifications", "⌘J"], ["Emergency", "⌘E"], ["Help", "?"], ["Navigate", "↑ ↓"], ["Confirm", "↵"]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-lg bg-cream px-3 py-2 text-[12.5px]">
                <span className="text-ink-soft">{k}</span><kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-sub">{v}</kbd>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <SectionLabel className="mb-3">Profile</SectionLabel>
          <div className="flex items-center gap-3">
            <Avatar initials="RS" size={48} />
            <div>
              <div className="text-[14px] font-semibold text-ink">Rajesh Sharma</div>
              <div className="text-[12px] text-sub">Section Controller · Northern Division</div>
            </div>
            <Button variant="secondary" size="sm" className="ml-auto" onClick={() => toast("Profile editor", { tone: "info" })}>Edit</Button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-cream px-3 py-2"><div className="text-[11px] text-sub">Employee ID</div><div className="text-[13px] font-semibold text-ink">NDLS-SC-0412</div></div>
            <div className="rounded-lg bg-cream px-3 py-2"><div className="text-[11px] text-sub">Clearance</div><div className="text-[13px] font-semibold text-ink">Controller L3</div></div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
