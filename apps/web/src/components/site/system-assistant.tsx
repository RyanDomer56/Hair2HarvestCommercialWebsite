"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { RefreshCw, Send, Volume2, VolumeX, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { TalkingAvatar, type TalkingAvatarHandle } from "./talking-avatar";
import type { AvatarVariant } from "./avatar-character";
import {
  KNOWLEDGE,
  STARTER_QUESTIONS,
  findAnswer,
  getRelated,
  type KnowledgeEntry,
} from "@/lib/chat-knowledge";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  entry?: KnowledgeEntry;
  fallback?: boolean;
};

let seq = 0;
const nextId = () => `m${++seq}`;

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I'm here to help with questions about Hair2Harvest — how collection works, what happens to the hair, and how we turn it into compost. What would you like to know?",
};

export function SystemAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [unread, setUnread] = useState(false);

  // --- talking avatar state (variant + mute, persisted) -----------------
  const [avatarVariant, setAvatarVariant] = useState<AvatarVariant>("sprout");
  const [avatarMuted, setAvatarMuted] = useState(false);
  const headerAvatarRef = useRef<TalkingAvatarHandle>(null);

  useEffect(() => {
    try {
      const sv = localStorage.getItem("h2h-avatar-variant");
      if (sv) setAvatarVariant(sv as AvatarVariant);
      setAvatarMuted(localStorage.getItem("h2h-avatar-muted") === "1");
    } catch {
      /* noop */
    }
  }, []);

  const cycleVariant = () => {
    setAvatarVariant((prev) => {
      const order: AvatarVariant[] = ["sprout", "ember", "bloom"];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      try {
        localStorage.setItem("h2h-avatar-variant", next);
      } catch {
        /* noop */
      }
      return next;
    });
  };

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
  const timerRef = useRef<number | null>(null);

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
    setOpen((v) => {
      const nv = !v;
      if (!nv && typeof window !== "undefined") window.speechSynthesis?.cancel();
      return nv;
    });
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
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || thinking) return;

      setInput("");
      setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
      setThinking(true);
      scrollToBottom();

      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        const { entry } = findAnswer(text);
        const reply: Message = entry
          ? { id: nextId(), role: "assistant", text: entry.answer, entry }
          : {
              id: nextId(),
              role: "assistant",
              fallback: true,
              text: "I don't have a verified answer for that yet. Here are a few things I can help with:",
            };
        setMessages((prev) => [...prev, reply]);
        setThinking(false);
        scrollToBottom();
        if (!open) setUnread(true);
        // The avatar reads the reply aloud (Web Speech API) when not muted.
        headerAvatarRef.current?.speak(reply.text);
      }, 620);
    },
    [thinking, open, scrollToBottom],
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
              variant={avatarVariant}
              muted={avatarMuted}
              talking={thinking}
              modelSrc="/models/mint-melody-avatar.glb"
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
          <span className="shrink-0">
            <TalkingAvatar
              ref={headerAvatarRef}
              size={38}
              variant={avatarVariant}
              muted={avatarMuted}
              talking={thinking}
              modelSrc="/models/mint-melody-avatar.glb"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.8125rem] font-semibold leading-tight">Hair2Harvest</p>
            <p className="mt-1 flex items-center gap-1.5 text-[0.6875rem] text-paper/55">
              <span className="size-1.5 rounded-full bg-lime" aria-hidden />
              {thinking ? "Replying…" : "Online"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={cycleVariant}
              aria-label="Change avatar"
              className="flex size-8 items-center justify-center rounded-full text-paper/60 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              <RefreshCw size={15} />
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
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
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
            </div>
          ))}

          {thinking && (
            <div className="flex items-start gap-2">
              <span className="mt-1 shrink-0">
                <TalkingAvatar size={28} variant={avatarVariant} muted talking modelSrc="/models/mint-melody-avatar.glb" />
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
        </div>

        {/* composer */}
        <div className="border-t border-paper/10 bg-[#0c1007] px-3 py-3">
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
