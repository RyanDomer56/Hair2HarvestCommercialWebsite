"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  KNOWLEDGE,
  STARTER_QUESTIONS,
  TOPICS,
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
  text: "Ask me anything about how Hair2Harvest works. I answer only from the three system-design documents — if it isn't in there, I'll say so rather than guess.",
};

export function SystemAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [browseTopic, setBrowseTopic] = useState<string | null>(null);
  const [showBrowse, setShowBrowse] = useState(false);
  const [unread, setUnread] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

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
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || thinking) return;

      setInput("");
      setShowBrowse(false);
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
              text: "That isn't covered in the documents I have. I'd rather say so than invent an answer — here are the things I can speak to:",
            };
        setMessages((prev) => [...prev, reply]);
        setThinking(false);
        scrollToBottom();
        if (!open) setUnread(true);
      }, 520);
    },
    [thinking, open, scrollToBottom],
  );

  const lastMessage = messages[messages.length - 1];
  const suggestions: KnowledgeEntry[] = lastMessage?.entry
    ? getRelated(lastMessage.entry)
    : lastMessage?.fallback || lastMessage?.id === "welcome"
      ? STARTER_QUESTIONS.map((q) => KNOWLEDGE.find((k) => k.question === q)!).filter(Boolean).slice(0, 4)
      : [];

  const topicQuestions = browseTopic
    ? KNOWLEDGE.filter((k) => k.topic === browseTopic)
    : [];

  return (
    <>
      {/* launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="system-assistant-panel"
        aria-label={open ? "Close the system assistant" : "Ask the system design"}
        className={cn(
          "assistant-scope group fixed bottom-5 right-5 z-[70] flex h-[52px] items-center gap-2.5 rounded-full border border-lime/30 bg-moss-deep px-4 text-paper shadow-[0_10px_36px_rgba(20,26,8,.34)] transition-all duration-300 hover:-translate-y-0.5 hover:border-lime/60 sm:bottom-6 sm:right-6 sm:px-5",
          open && "opacity-0 pointer-events-none translate-y-3",
        )}
      >
        <span className="relative flex size-6 items-center justify-center">
          <MessageCircle size={19} className="text-lime" strokeWidth={1.9} />
          {unread && (
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-lime ring-2 ring-moss-deep" />
          )}
        </span>
        <span className="hidden text-[0.8125rem] font-medium tracking-[-0.01em] sm:inline">
          Ask the system
        </span>
        <span className="mono-tag hidden text-lime/70 lg:inline">· 35 ANSWERS</span>
      </button>

      {/* panel */}
      <div
        id="system-assistant-panel"
        role="dialog"
        aria-label="System design assistant"
        aria-modal="false"
        className={cn(
          "assistant-scope fixed bottom-5 right-3 z-[71] flex w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[14px] border border-lime/20 bg-[#11150c] text-paper shadow-[0_24px_80px_rgba(8,12,4,.55)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] sm:bottom-6 sm:right-6 sm:w-[390px]",
          "h-[min(72vh,570px)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        {/* header */}
        <div className="flex items-center gap-3 border-b border-paper/10 bg-moss-deep px-4 py-3.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-lime/30 bg-[#151b0d]">
            <Sparkles size={15} className="text-lime" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.8125rem] font-semibold leading-tight">System assistant</p>
            <p className="mono-tag mt-1 text-paper/50">GROUNDED IN 3 DOCUMENTS</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-full text-paper/60 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            <X size={16} />
          </button>
        </div>

        {/* scope bar */}
        <div className="flex items-center justify-between gap-2 border-b border-paper/10 px-4 py-2">
          <span className="mono-tag text-paper/40">
            <span className="hidden sm:inline">NO GUESSWORK · </span>SOURCED ANSWERS
          </span>
          <button
            type="button"
            onClick={() => setShowBrowse((v) => !v)}
            aria-expanded={showBrowse}
            className="flex items-center gap-1 rounded-full border border-paper/15 px-2.5 py-1 text-[0.6875rem] text-paper/70 transition-colors hover:border-lime/40 hover:text-lime"
          >
            <BookOpen size={11} />
            Browse
            <ChevronDown size={11} className={cn("transition-transform", showBrowse && "rotate-180")} />
          </button>
        </div>

        {/* topic browser */}
        {showBrowse && (
          <div className="border-b border-paper/10 bg-[#0c1007] px-3 py-3">
            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBrowseTopic((v) => (v === t ? null : t))}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[0.6875rem] transition-colors",
                    browseTopic === t
                      ? "border-lime bg-lime text-[#242a12]"
                      : "border-paper/15 text-paper/70 hover:border-lime/40",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            {browseTopic && (
              <div className="mt-3 max-h-[120px] space-y-1 overflow-y-auto pr-1">
                {topicQuestions.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => send(k.question)}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-[0.75rem] text-paper/75 transition-colors hover:bg-paper/8 hover:text-paper"
                  >
                    {k.question}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* messages */}
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          className="thin-scroll flex-1 space-y-4 overflow-y-auto px-4 py-4"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex flex-col gap-1.5", m.role === "user" ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "max-w-[86%] rounded-[12px] px-3.5 py-2.5 text-[0.8125rem] leading-[1.65]",
                  m.role === "user"
                    ? "rounded-br-[4px] bg-lime text-[#242a12] font-medium"
                    : "rounded-bl-[4px] border border-paper/10 bg-[#1c2114] text-paper/90",
                )}
              >
                {m.text}
              </div>
              {m.entry && (
                <div className="flex max-w-[86%] flex-wrap items-center gap-1.5 pl-1">
                  <span className="mono-tag rounded border border-lime/25 px-1.5 py-0.5 text-lime/80">
                    {m.entry.doc}
                  </span>
                  <span className="mono-tag text-paper/35">{m.entry.source}</span>
                </div>
              )}
            </div>
          ))}

          {thinking && (
            <div className="flex items-start">
              <div className="flex items-center gap-1 rounded-[12px] rounded-bl-[4px] border border-paper/10 bg-[#1c2114] px-3.5 py-3">
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
              <p className="mono-tag mb-2 text-paper/35">
                {lastMessage?.entry ? "RELATED QUESTIONS" : "TRY ASKING"}
              </p>
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
              placeholder="Ask about the system…"
              aria-label="Your question"
              className="min-w-0 flex-1 bg-transparent text-[0.8125rem] text-paper outline-none placeholder:text-paper/35"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              aria-label="Send question"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lime text-[#242a12] transition-opacity disabled:opacity-30"
            >
              <Send size={14} />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between px-1">
            <span className="mono-tag text-paper/30">DOCS 01–03 · v1.0</span>
            <Link
              href="/system"
              className="mono-tag text-lime/70 transition-colors hover:text-lime"
            >
              READ THE SPEC ↗
            </Link>
          </div>
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
