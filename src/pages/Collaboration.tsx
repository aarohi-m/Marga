import { AnimatePresence, motion } from "framer-motion";
import {
  AtSign,
  Bot,
  CheckCircle2,
  Circle,
  FileText,
  Flag,
  Paperclip,
  Radio,
  Search,
  Send,
  Shield,
  Siren,
  SlidersHorizontal,
  TrainTrack,
  Users,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useToast } from "@/components/ui/overlays";
import { Avatar, Badge, Button, Card, SectionLabel } from "@/components/ui/primitives";
import {
  attachments,
  channelMessages,
  channels,
  decisionHistory,
  opDetails,
  team,
  type ChatMessage,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

const ICONS = {
  users: Users,
  wrench: Wrench,
  radio: Radio,
  shield: Shield,
  track: TrainTrack,
  siren: Siren,
} as const;

export function Collaboration() {
  const toast = useToast();
  const [active, setActive] = useState("divisional");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [sent, setSent] = useState<Record<string, ChatMessage[]>>({});
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const channel = channels.find((c) => c.id === active)!;
  const details = opDetails[active];

  const messages = useMemo(() => {
    const base = [...(channelMessages[active] ?? []), ...(sent[active] ?? [])];
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter((m) => (m.body + m.author).toLowerCase().includes(q));
  }, [active, sent, query]);

  // Auto-scroll to newest message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, active]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const msg: ChatMessage = {
      id: `s${Date.now()}`,
      author: "Rajesh Sharma",
      initials: "RS",
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      body: draft.trim(),
      own: true,
    };
    setSent((p) => ({ ...p, [active]: [...(p[active] ?? []), msg] }));
    setDraft("");

    // Simulated AI reply
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setSent((p) => ({
        ...p,
        [active]: [
          ...(p[active] ?? []),
          {
            id: `a${Date.now()}`,
            author: "MARGA AI",
            initials: "AI",
            time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes() + 1).padStart(2, "0")}`,
            body: `Acknowledged. Cross-checked against ${details.blockId} on ${details.section} — no path conflicts introduced by this update.`,
            ai: true,
            tag: "Auto-verification",
            action: "Open operational context",
          },
        ],
      }));
    }, 1600);
  };

  return (
    <PageContainer
      title="Operations Collaboration"
      subtitle="Coordinate decisions, incidents and operational context across control teams."
      meta={
        <>
          <Badge tone="green" dot pulse>
            System Normal
          </Badge>
          <span className="text-[12px] text-sub">
            {team.filter((t) => t.online).length} controllers on shift
          </span>
        </>
      }
      actions={
        <Button
          variant="secondary"
          size="sm"
          icon={<Flag />}
          onClick={() => toast("Incident raised", { desc: "Escalated to Emergency Ops channel.", tone: "warning" })}
        >
          Raise incident
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[240px_minmax(0,1fr)_290px]">
        {/* ---------------- Channels ---------------- */}
        <Card className="h-fit overflow-hidden">
          <div className="border-b border-line px-4 py-3">
            <SectionLabel>Coordination channels</SectionLabel>
          </div>
          <div className="p-1.5">
            {channels
              .filter((c) => !c.danger)
              .map((c) => (
                <ChannelRow key={c.id} c={c} active={active === c.id} onClick={() => setActive(c.id)} />
              ))}
          </div>
          <div className="mx-3 h-px bg-line" />
          <div className="p-1.5">
            {channels
              .filter((c) => c.danger)
              .map((c) => (
                <ChannelRow key={c.id} c={c} active={active === c.id} onClick={() => setActive(c.id)} />
              ))}
          </div>

          {/* Online team */}
          <div className="border-t border-line p-3">
            <SectionLabel className="mb-2">On shift</SectionLabel>
            <div className="space-y-1">
              {team.slice(0, 4).map((m) => (
                <div key={m.name} className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar initials={m.initials} name={m.name} size={24} />
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-[1.5px] border-surface",
                        m.online ? "bg-success" : "bg-faint"
                      )}
                    />
                  </div>
                  <span className="truncate text-[11.5px] font-medium text-ink-soft">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ---------------- Thread ---------------- */}
        <Card className="flex h-[calc(100vh-230px)] min-h-[520px] flex-col overflow-hidden">
          {/* Thread header */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3">
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="truncate font-display text-[15px] font-bold text-ink">
                    {channel.topic}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[12px] text-sub">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span
                          className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60"
                          style={{ animation: "ring 2.6s ease-out infinite" }}
                        />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                      </span>
                      System Normal
                    </span>
                    <span className="text-line-strong">|</span>
                    <span>{channel.participants} active participants</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search thread"
                  className="h-8 w-[150px] rounded-lg border border-line bg-cream pl-8 pr-2 text-[12.5px] text-ink outline-none transition-colors placeholder:text-faint focus:border-brand/40 focus:ring-2 focus:ring-brand/15 sm:w-[190px]"
                />
              </div>
              <button
                aria-label="Thread options"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sub transition-colors hover:bg-sand hover:text-ink"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto p-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {messages.map((m, i) => (
                <MessageRow key={m.id} m={m} index={i} onAction={(a) => toast(a, { tone: "info" })} />
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2.5 px-1 py-2"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="flex items-center gap-1 rounded-xl border border-line bg-cream px-3 py-2.5">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-brand"
                      />
                    ))}
                    <span className="ml-1.5 text-[11.5px] text-sub">MARGA AI is analysing…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="mb-2 h-6 w-6 text-faint" />
                <div className="text-[13.5px] font-semibold text-ink">No matching messages</div>
                <p className="mt-1 text-[12.5px] text-sub">Try a different search term.</p>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-line p-3">
            <div className="mb-2 flex items-center gap-2">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => toast("Decision tagged", { desc: "Message marked as an operational decision.", tone: "success" })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] font-medium text-ink-soft transition-colors hover:border-brand/30 hover:text-brand"
              >
                <Flag className="h-3.5 w-3.5" /> Tag decision
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setDraft((d) => d + "@")}
                aria-label="Mention someone"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-line bg-surface text-sub transition-colors hover:border-brand/30 hover:text-brand"
              >
                <AtSign className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            <div className="flex items-end gap-2">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => toast("Attachment picker", { tone: "info" })}
                aria-label="Attach file"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line bg-surface text-sub transition-colors hover:border-brand/30 hover:text-brand"
              >
                <Paperclip className="h-4 w-4" />
              </motion.button>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Type message to operational team… Use @ to mention"
                className="max-h-28 min-h-[40px] flex-1 resize-none rounded-[10px] border border-line bg-cream px-3 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-faint focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
              />

              <Button
                variant="primary"
                icon={<Send className="h-4 w-4" />}
                onClick={send}
                disabled={!draft.trim()}
                className="h-10 shrink-0"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>

        {/* ---------------- Context rail ---------------- */}
        <div className="space-y-4">
          {/* Operation details */}
          <Card className="overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <SectionLabel>Current operation details</SectionLabel>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="divide-y divide-line-soft"
              >
                <Row label="Block ID" value={details.blockId} mono />
                <Row label="Section" value={details.section} mono />
                <Row
                  label="Status"
                  value={
                    <Badge tone={details.status === "Approved" ? "green" : details.status === "Pending" ? "amber" : "blue"}>
                      {details.status.toUpperCase()}
                    </Badge>
                  }
                />
                <Row label="Crew" value={details.crew} mono />
                <Row label="Supervisor" value={<Badge tone="green">{details.supervisor}</Badge>} />
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Decision history */}
          <Card className="overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <SectionLabel>Decision history &amp; approvals</SectionLabel>
            </div>
            <div className="relative p-4">
              <div className="absolute bottom-6 left-[22px] top-6 w-px bg-line" />
              <div className="space-y-4">
                {decisionHistory.map((d, i) => (
                  <motion.div
                    key={d.time + d.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="relative flex gap-3"
                  >
                    <span
                      className={cn(
                        "relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-surface",
                        d.tone === "green" ? "bg-success" : d.tone === "amber" ? "bg-warning" : "bg-brand"
                      )}
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium tabular-nums text-faint">
                        {d.time} · Today
                      </div>
                      <div className="mt-0.5 text-[13px] font-semibold text-ink">{d.title}</div>
                      <div className="text-[11.5px] text-sub">{d.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

          {/* Attachments */}
          <Card className="overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <SectionLabel>Shared attachments</SectionLabel>
            </div>
            <div className="space-y-1.5 p-3">
              {attachments.map((a, i) => (
                <motion.button
                  key={a.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 2 }}
                  onClick={() => toast("Downloading", { desc: a.name, tone: "info" })}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-cream p-2.5 text-left transition-colors hover:border-brand/30"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-critical-soft text-[9px] font-bold text-critical">
                    PDF
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-semibold text-ink">{a.name}</div>
                    <div className="text-[11px] tabular-nums text-sub">{a.size}</div>
                  </div>
                  <FileText className="h-3.5 w-3.5 shrink-0 text-faint" />
                </motion.button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

/* ---------------------------- Channel row ---------------------------- */
function ChannelRow({
  c,
  active,
  onClick,
}: {
  c: (typeof channels)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = ICONS[c.icon];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left text-[13px] font-medium transition-colors",
        active
          ? c.danger
            ? "bg-critical-soft text-critical"
            : "bg-brand-soft text-brand-ink"
          : c.danger
            ? "text-critical hover:bg-critical-soft/50"
            : "text-sub hover:bg-sand hover:text-ink"
      )}
    >
      {active && (
        <motion.span
          layoutId="chan-active"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className={cn(
            "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full",
            c.danger ? "bg-critical" : "bg-brand"
          )}
        />
      )}
      <Icon className={cn("h-4 w-4 shrink-0", active && !c.danger && "text-brand")} />
      <span className="flex-1 truncate">{c.name}</span>

      {c.unread ? (
        <span
          className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-critical px-1 text-[10.5px] font-bold text-white"
          style={{ animation: "soft-pulse 2.2s ease-in-out infinite" }}
        >
          {c.unread}
        </span>
      ) : c.live ? (
        <Circle className="h-2 w-2 shrink-0 fill-brand text-brand" />
      ) : null}
    </motion.button>
  );
}

/* ---------------------------- Message row ---------------------------- */
function MessageRow({
  m,
  index,
  onAction,
}: {
  m: ChatMessage;
  index: number;
  onAction: (a: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 320, damping: 28, delay: Math.min(index * 0.03, 0.2) }}
      className="flex items-start gap-2.5 rounded-xl px-1 py-2"
    >
      {/* Avatar */}
      {m.ai ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
          <Bot className="h-4 w-4" />
        </span>
      ) : (
        <Avatar initials={m.initials} name={m.author} size={32} className="rounded-lg" />
      )}

      <div className="min-w-0 flex-1">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[13px] font-bold text-ink">{m.author}</span>
          <span className="text-[11px] tabular-nums text-faint">[{m.time}]</span>
          {m.tag && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded bg-success-soft px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-success"
            >
              {m.tag}
            </motion.span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={cn(
            "mt-1.5 rounded-xl border px-3.5 py-2.5 text-[13px] leading-relaxed",
            m.ai
              ? "border-brand/20 bg-brand-tint text-ink-soft"
              : m.own
                ? "border-brand/15 bg-brand-soft/60 text-ink-soft"
                : "border-line bg-cream text-ink-soft"
          )}
        >
          {m.body}
        </div>

        {/* Inline action */}
        {m.action && (
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAction(m.action!)}
            className="mt-2 rounded-lg border border-line bg-surface px-3 py-2 text-[12.5px] font-semibold text-brand transition-colors hover:border-brand/35 hover:bg-brand-tint"
          >
            {m.action}
          </motion.button>
        )}
      </div>

      {m.own && <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-success" />}
    </motion.div>
  );
}

/* ---------------------------- Detail row ---------------------------- */
function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <span className="text-[10.5px] font-semibold uppercase tracking-wide text-faint">{label}</span>
      {typeof value === "string" ? (
        <span className={cn("text-[12.5px] font-bold text-ink", mono && "font-mono tracking-tight")}>
          {value}
        </span>
      ) : (
        value
      )}
    </div>
  );
}
