"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, CircleHelp, Send, Volume2, VolumeX, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { TalkingAvatar, type TalkingAvatarHandle } from "./talking-avatar";
import type { AvatarDance } from "./avatar-3d";
import {
  CONTACT,
  FALLBACK_ANSWER,
  POINTER_ANSWER,
  PRIVATE_INFO_ANSWER,
  KNOWLEDGE,
  STARTER_QUESTIONS,
  findAnswer,
  getRelated,
  isPrivateInfoRequest,
  type KnowledgeEntry,
} from "@/lib/chat-knowledge";
import { HELP_GROUPS, HELP_PLACES, findInSystem } from "@/lib/site-help";

type ChatLink = { title: string; href: string; blurb: string };

type ChatApiReply = {
  answer: string;
  source: "local" | "ai";
  question?: string;
  fallback?: boolean;
  links: ChatLink[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  entry?: KnowledgeEntry;
  fallback?: boolean;
  links?: ChatLink[];
  source?: "local" | "ai";
};

let seq = 0;
const nextId = () => `m${++seq}`;

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I'm Snip, the Hair2Harvest helper. Ask me in English or Tagalog — what we do, what happens when you join, and how hair becomes compost. I can also show you where to find things on the site. Tap the ? button for help.",
};

// Short spoken greeting when the chat opens (separate from the on-screen WELCOME).
const GREETING =
  "Hi! I'm Snip, your Hair2Harvest guide. Ask me anything, or tap me to see my dances!";

// --- playful sound effects (Web Audio, no assets) ----------------------
function playScream() {
  try {
    const Ctx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
    osc.onended = () => ctx.close();
  } catch {
    /* audio not available */
  }
}

function playSad() {
  try {
    const Ctx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(330, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.7);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.85);
    osc.onended = () => ctx.close();
  } catch {
    /* audio not available */
  }
}

export function SystemAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [unread, setUnread] = useState(false);
  const [view, setView] = useState<"chat" | "help">("chat");
  const [mode, setMode] = useState<"local" | "ai" | null>(null);

  // --- talking avatar state (mute, persisted) -----------------
  const [avatarMuted, setAvatarMuted] = useState(false);
  const headerAvatarRef = useRef<TalkingAvatarHandle>(null);

  // --- playful avatar dance state ---------------------------------------
  // manualDance: a dance the visitor picked by tapping Snip (null = use default).
  const [manualDance, setManualDance] = useState<AvatarDance | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const avatarClickTimer = useRef<number | null>(null);
  const avatarClickCount = useRef(0);

  // The dance Snip performs: a picked one if set, otherwise "cute" while the
  // chat is open (so he's always dancing when you're talking to him), idle shut.
  const avatarDance: AvatarDance = manualDance ?? (open ? "cute" : "idle");

  // A tiny floating emoji that mirrors Snip's mood.
  const emotion = speaking
    ? "💬"
    : manualDance === "scream"
      ? "😱"
      : manualDance === "sad"
        ? "😢"
        : null;

  // Tap Snip to cycle: 1 = bounce, 2 = groove, 3 = scream, 4+ = sad.
  const onAvatarTap = () => {
    avatarClickCount.current += 1;
    if (avatarClickTimer.current) window.clearTimeout(avatarClickTimer.current);
    avatarClickTimer.current = window.setTimeout(() => {
      const n = avatarClickCount.current;
      avatarClickCount.current = 0;
      if (n === 1) setManualDance("bounce");
      else if (n === 2) setManualDance("groove");
      else if (n === 3) {
        setManualDance("scream");
        playScream();
      } else {
        setManualDance("sad");
        playSad();
      }
    }, 320);
  };

  useEffect(() => {
    try {
      setAvatarMuted(localStorage.getItem("h2h-avatar-muted") === "1");
    } catch {
      /* noop */
    }
  }, []);

  const toggleMute = () => {
    setAvatarMuted((m) => {
      const nm = !m;
      try {
        localStorage.setItem("h2h-avatar-muted", nm ? "1" : "0");
        if (nm && typeof window !== "undefined") window.speechSynthesis?.cancel();
      } catch {
        /* noop */
      }
      return nm;
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useReducedMotion();

  // --- draggable launcher state -------------------------------------------
  const btnRef = useRef<HTMLButtonElement>(null);
  const tiltRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number; moved: boolean } | null>(
    null,
  );
  const movedRef = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Place the launcher (restored from the client's last position, else bottom-right).
  useEffect(() => {
    const place = () => {
      const el = btnRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const saved =
        typeof window !== "undefined" ? localStorage.getItem("h2h-assistant-pos") : null;
      let x: number;
      let y: number;
      if (saved) {
        const [fx, fy] = saved.split(",").map(Number);
        x = Math.round(fx * (window.innerWidth - w));
        y = Math.round(fy * (window.innerHeight - h));
      } else {
        x = window.innerWidth - w - 20;
        y = window.innerHeight - h - 20;
      }
      x = Math.max(8, Math.min(x, window.innerWidth - w - 8));
      y = Math.max(8, Math.min(y, window.innerHeight - h - 8));
      setPos({ x, y });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  // 3D tilt toward the cursor for a living, dimensional feel.
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (openRef.current || dragRef.current) return;
      const el = tiltRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const ry = Math.max(-14, Math.min(14, ((e.clientX - cx) / 260) * 18));
      const rx = Math.max(-14, Math.min(14, (-(e.clientY - cy) / 260) * 18));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (tiltRef.current) {
          tiltRef.current.style.transform = `perspective(720px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  const onLauncherPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (open || !pos) return;
    try {
      btnRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    dragRef.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y, moved: false };
  };
  const onLauncherPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || !pos) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    if (!d.moved && Math.hypot(dx, dy) > 6) {
      d.moved = true;
      movedRef.current = true;
    }
    if (d.moved) {
      const el = btnRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const x = Math.max(8, Math.min(d.ox + dx, window.innerWidth - w - 8));
      const y = Math.max(8, Math.min(d.oy + dy, window.innerHeight - h - 8));
      setPos({ x, y });
    }
  };
  const onLauncherPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d) return;
    try {
      btnRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    if (d.moved && pos) {
      const el = btnRef.current;
      if (el) {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const fx = pos.x / (window.innerWidth - w);
        const fy = pos.y / (window.innerHeight - h);
        try {
          localStorage.setItem("h2h-assistant-pos", `${fx},${fy}`);
        } catch {
          /* noop */
        }
      }
    }
    dragRef.current = null;
  };
  const onLauncherClick = () => {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) {
      // Opening the chat: Snip greets out loud and dances.
      setManualDance(null);
      if (!avatarMuted) {
        setSpeaking(true);
        window.setTimeout(
          () => headerAvatarRef.current?.speak(GREETING, () => setSpeaking(false)),
          260,
        );
      }
    } else {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
      setSpeaking(false);
      setManualDance(null);
    }
  };

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = logRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    setUnread(false);
    const id = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => window.clearTimeout(id);
  }, [open]);

  // Scroll after React has committed, not in the same tick as setState.
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking, scrollToBottom]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  // Ask the server which mode is active. Never exposes the key.
  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/v1/chat", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { mode?: "local" | "ai" } | null) => {
        if (d?.mode) setMode(d.mode);
      })
      .catch(() => {
        /* offline: local fallback still works */
      });
    return () => ctrl.abort();
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || thinking) return;

      setInput("");
      setView("chat");
      setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
      setThinking(true);
      scrollToBottom();

      let reply: Message;
      try {
        const res = await fetch("/api/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
          signal: AbortSignal.timeout(14000),
        });
        if (!res.ok) throw new Error("chat unavailable");
        const data = (await res.json()) as ChatApiReply;
        const entry = data.question
          ? KNOWLEDGE.find((k) => k.question === data.question)
          : undefined;
        reply = {
          id: nextId(),
          role: "assistant",
          text: data.answer,
          entry,
          fallback: data.fallback,
          links: data.links,
          source: data.source,
        };
      } catch {
        // Network/timeout: still answer from the verified local corpus.
        const links = findInSystem(text).map((p) => ({
          title: p.title,
          href: p.href,
          blurb: p.blurb,
        }));
        const { entry } = findAnswer(text);
        const answer = isPrivateInfoRequest(text)
          ? PRIVATE_INFO_ANSWER
          : entry
            ? entry.answer
            : links.length > 0
              ? POINTER_ANSWER
              : FALLBACK_ANSWER;
        reply = {
          id: nextId(),
          role: "assistant",
          text: answer,
          entry: entry ?? undefined,
          fallback: !entry,
          links,
          source: "local",
        };
      }

      setMessages((prev) => [...prev, reply]);
      setThinking(false);
      scrollToBottom();
      if (!open) setUnread(true);
      // The avatar reads the reply aloud (Web Speech API) and bobs while speaking.
      if (!avatarMuted) {
        setSpeaking(true);
        headerAvatarRef.current?.speak(reply.text, () => setSpeaking(false));
      } else {
        setSpeaking(false);
      }
    },
    [thinking, open, scrollToBottom, avatarMuted],
  );

  const lastMessage = messages[messages.length - 1];
  const suggestions: KnowledgeEntry[] = lastMessage?.entry
    ? getRelated(lastMessage.entry)
    : lastMessage?.fallback || lastMessage?.id === "welcome"
      ? STARTER_QUESTIONS.map((q) => KNOWLEDGE.find((k) => k.question === q)!)
          .filter(Boolean)
          .slice(0, 4)
      : [];

  return (
    <>
      {/* launcher — the avatar itself is the button, and it is draggable */}
      <button
        ref={btnRef}
        type="button"
        onClick={onLauncherClick}
        onPointerDown={onLauncherPointerDown}
        onPointerMove={onLauncherPointerMove}
        onPointerUp={onLauncherPointerUp}
        aria-expanded={open}
        aria-controls="system-assistant-panel"
        aria-label={open ? "Close the chat" : "Chat with us — drag me anywhere"}
        className={cn(
          "assistant-scope group fixed z-[70] flex items-center gap-3 transition-[opacity,transform] duration-300",
          pos ? "" : "bottom-5 right-5 sm:bottom-6 sm:right-6",
          open && "pointer-events-none translate-y-3 opacity-0",
        )}
        style={pos ? { left: pos.x, top: pos.y } : undefined}
      >
        <span className="hidden rounded-full bg-moss-deep px-3.5 py-2 text-[0.75rem] font-medium text-paper opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block sm:translate-x-2">
          Chat with us
        </span>
        <span className="relative inline-flex">
          <span
            ref={tiltRef}
            className="relative inline-flex rounded-[40%] shadow-[0_14px_34px_rgba(20,26,8,.32)] ring-2 ring-paper/70 transition-transform duration-150 ease-out"
          >
            <TalkingAvatar
              size={64}
                           muted={avatarMuted}
              talking={speaking}
              dance={avatarDance}
              modelSrc="/models/ScissorAvatarH2H.obj"
              modelFallbackSrc="/models/ScissorAvatarH2H.obj"
              faceMode
            />
            {unread && (
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-lime ring-2 ring-paper" />
            )}
          </span>
          {/* contact shadow grounds the floating orb */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-16px] left-1/2 h-[10px] w-[58%] -translate-x-1/2 rounded-full bg-black/35 blur-md"
          />
        </span>
      </button>

      {/* panel */}
      <div
        id="system-assistant-panel"
        role="dialog"
        aria-label="Hair2Harvest chat"
        aria-modal="false"
        className={cn(
          "assistant-scope fixed bottom-5 right-3 z-[71] flex w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[16px] border border-paper/10 bg-[#11150c] text-paper shadow-[0_24px_80px_rgba(8,12,4,.55)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] sm:bottom-6 sm:right-6 sm:w-[390px]",
          "h-[min(72vh,570px)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        {/* header */}
        <div className="flex items-center gap-3 border-b border-paper/10 bg-moss-deep px-4 py-3.5">
          <span className="relative shrink-0">
            {emotion && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 text-[1rem] drop-shadow"
              >
                {emotion}
              </span>
            )}
            <button
              type="button"
              onClick={onAvatarTap}
              title="Tap Snip: bounce · groove · scream · sad"
              aria-label="Tap Snip to change his dance"
              className="block cursor-pointer rounded-full transition-transform active:scale-90"
            >
              <TalkingAvatar
                ref={headerAvatarRef}
                size={42}
                muted={avatarMuted}
                talking={speaking}
                dance={avatarDance}
                modelSrc="/models/ScissorAvatarH2H.obj"
                modelFallbackSrc="/models/ScissorAvatarH2H.obj"
                faceMode
              />
            </button>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.8125rem] font-semibold leading-tight">Snip</p>
            <p className="mt-0.5 text-[0.625rem] text-paper/45">Your Hair2Harvest guide</p>
            <p className="mt-1 flex items-center gap-1.5 text-[0.6875rem] text-paper/55">
              <span className="size-1.5 rounded-full bg-lime" aria-hidden />
              {thinking ? "Replying…" : mode === "ai" ? "AI assisted · checked answers" : "Online"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setView((v) => (v === "help" ? "chat" : "help"))}
              aria-label={view === "help" ? "Back to chat" : "Help — find where things are"}
              aria-pressed={view === "help"}
              title="Help — find where things are"
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-colors",
                view === "help"
                  ? "bg-lime/15 text-lime"
                  : "text-paper/60 hover:bg-paper/10 hover:text-paper",
              )}
            >
              <CircleHelp size={15} />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={avatarMuted ? "Unmute voice" : "Mute voice"}
              aria-pressed={avatarMuted}
              className="flex size-8 items-center justify-center rounded-full text-paper/60 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              {avatarMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.speechSynthesis?.cancel();
                setOpen(false);
              }}
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-full text-paper/60 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* messages */}
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          className="thin-scroll flex-1 space-y-4 overflow-y-auto px-4 py-5"
        >
          {view === "help" ? (
            <div className="space-y-5">
              <div>
                <p className="text-[0.875rem] font-medium text-paper">Where can I find it?</p>
                <p className="mt-1.5 text-[0.75rem] leading-[1.6] text-paper/60">
                  Tap any place below and we will take you straight there. You can also just ask me
                  in English or Tagalog.
                </p>
              </div>

              {HELP_GROUPS.map((group) => (
                <div key={group}>
                  <p className="mono-tag uppercase text-lime/80">{group}</p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {HELP_PLACES.filter((p) => p.group === group).map((p) => (
                      <Link
                        key={p.id}
                        href={p.href}
                        onClick={() => setView("chat")}
                        className="group flex items-start justify-between gap-2 rounded-[10px] border border-paper/12 bg-[#1c2114] px-3 py-2.5 transition-colors hover:border-lime/35 hover:bg-lime/5"
                      >
                        <span className="min-w-0">
                          <span className="block text-[0.8125rem] font-medium text-paper/90">
                            {p.title}
                          </span>
                          <span className="mt-0.5 block text-[0.6875rem] leading-snug text-paper/50">
                            {p.blurb}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={13}
                          className="mt-0.5 shrink-0 text-paper/40 transition-colors group-hover:text-lime"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="rounded-[10px] border border-paper/12 px-3 py-2.5">
                <p className="mono-tag uppercase text-paper/40">Need a person instead?</p>
                <p className="mt-1.5 text-[0.75rem] leading-[1.6] text-paper/70">
                  {CONTACT.phone} ({CONTACT.hours})
                  <br />
                  {CONTACT.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setView("chat")}
                className="w-full rounded-full border border-paper/20 py-2 text-[0.75rem] font-medium text-paper/75 transition-colors hover:border-lime/40 hover:text-lime"
              >
                Back to chat
              </button>
            </div>
          ) : (
            <>
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "max-w-[86%] rounded-[14px] px-3.5 py-2.5 text-[0.8125rem] leading-[1.65]",
                  m.role === "user"
                    ? "rounded-br-[4px] bg-lime font-medium text-[#242a12]"
                    : "rounded-bl-[4px] border border-paper/10 bg-[#1c2114] text-paper/90",
                )}
              >
                {m.text}
              </div>

              {m.links && m.links.length > 0 && (
                <div className="mt-2 w-full max-w-[86%]">
                  <p className="mono-tag mb-1.5 uppercase text-paper/40">Find it here</p>
                  <div className="flex flex-col gap-1.5">
                    {m.links.map((l) => (
                      <Link
                        key={`${l.href}-${l.title}`}
                        href={l.href}
                        className="group flex items-start justify-between gap-2 rounded-[10px] border border-lime/25 bg-lime/5 px-3 py-2 transition-colors hover:bg-lime/15"
                      >
                        <span className="min-w-0">
                          <span className="block text-[0.75rem] font-medium text-lime">
                            {l.title}
                          </span>
                          <span className="mt-0.5 block text-[0.6875rem] leading-snug text-paper/55">
                            {l.blurb}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={13}
                          className="mt-0.5 shrink-0 text-lime transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {m.fallback && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href={`tel:${CONTACT.phoneLink}`}
                    className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1.5 text-[0.6875rem] font-medium text-lime transition-colors hover:bg-lime/20"
                  >
                    Call us
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="rounded-full border border-paper/20 px-3 py-1.5 text-[0.6875rem] font-medium text-paper/75 transition-colors hover:border-paper/40"
                  >
                    Email us
                  </a>
                </div>
              )}
            </div>
          ))}

          {thinking && (
            <div className="flex items-start gap-2">
              <span className="mt-1 shrink-0">
                <TalkingAvatar size={28} muted talking={thinking} dance={avatarDance} modelSrc="/models/ScissorAvatarH2H.obj" modelFallbackSrc="/models/ScissorAvatarH2H.obj" faceMode />
              </span>
              <div className="flex items-center gap-1 rounded-[14px] rounded-bl-[4px] border border-paper/10 bg-[#1c2114] px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full bg-lime/70"
                    style={{ animation: `assistant-dot 1s ${i * 0.15}s infinite ease-in-out` }}
                  />
                ))}
              </div>
            </div>
          )}

          {!thinking && suggestions.length > 0 && (
            <div className="pt-1">
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => send(k.question)}
                    className="rounded-full border border-paper/15 px-2.5 py-1.5 text-left text-[0.6875rem] leading-snug text-paper/75 transition-colors hover:border-lime/45 hover:bg-lime/10 hover:text-lime"
                  >
                    {k.question}
                  </button>
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </div>

        {/* composer */}
        <div className="border-t border-paper/10 bg-[#0c1007] px-3 py-3">
          <button
            type="button"
            onClick={() => setView("help")}
            className="mb-2.5 flex w-full items-center justify-center gap-1.5 rounded-full border border-paper/12 py-1.5 text-[0.6875rem] font-medium text-paper/60 transition-colors hover:border-lime/40 hover:text-lime"
          >
            <CircleHelp size={12} />
            Where can I find it? Browse the site
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-full border border-paper/15 bg-[#171c10] py-1 pl-3.5 pr-1 focus-within:border-lime/50"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message…"
              aria-label="Your message"
              className="min-w-0 flex-1 bg-transparent text-[0.8125rem] text-paper outline-none placeholder:text-paper/35"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              aria-label="Send message"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lime text-[#242a12] transition-opacity disabled:opacity-30"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes assistant-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: .4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes assistant-dot { 0%, 100% { transform: none; opacity: .7; } }
        }
      `}</style>
    </>
  );
}
