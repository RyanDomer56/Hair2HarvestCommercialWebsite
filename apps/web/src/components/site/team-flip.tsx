"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const toneGradient: Record<string, string> = {
  moss: "from-[var(--moss-deep)] to-[var(--moss)]",
  lime: "from-[#3f6212] to-[var(--lime)]",
  clay: "from-[#9a4a2b] to-[var(--clay)]",
};

export type Member = {
  name: string;
  role: string;
  initials: string;
  tone: string;
};

export type TeamGroup = {
  title: string;
  members: Member[];
};

export function TeamFlip({ groups }: { groups: TeamGroup[] }) {
  return (
    <div className="space-y-14">
      {groups.map((g, gi) => (
        <div key={g.title}>
          <div className="flex items-center gap-3">
            <span className="mono-tag text-clay">{String(gi + 1).padStart(2, "0")}</span>
            <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
            <span className="eyebrow">{g.title}</span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {g.members.map((m) => (
              <FlipCard key={m.name} member={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FlipCard({ member }: { member: Member }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      aria-label={`${member.name}, ${member.role}. ${
        flipped ? "Show the front of the card" : "Flip to see their role details"
      }`}
      className={cn(
        "team-flip group block h-[348px] w-full cursor-pointer appearance-none bg-transparent p-0 text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        flipped && "is-flipped",
      )}
    >
      <div className="team-flip-inner">
        {/* front */}
        <div className="team-flip-face flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div
            className={cn(
              "flex size-20 items-center justify-center rounded-full bg-gradient-to-br font-display text-[1.35rem] font-semibold text-paper shadow-[0_3px_18px_-5px_rgba(20,40,15,0.55)]",
              toneGradient[member.tone],
            )}
            aria-hidden
          >
            {member.initials}
          </div>
          <div>
            <h3 className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
              {member.name}
            </h3>
            <p className="mono-tag mt-1.5 uppercase text-moss">{member.role}</p>
          </div>
          <span className="mono-tag mt-auto flex items-center gap-1.5 text-ink-mute">
            <RotateCw size={11} aria-hidden />
            Click to flip
          </span>
        </div>

        {/* back */}
        <div className="team-flip-face team-flip-back flex flex-col gap-3 p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[0.95rem] font-medium tracking-[-0.02em] text-ink">
              {member.name}
            </h3>
            <span className="mono-tag shrink-0 uppercase text-moss">{member.role}</span>
          </div>

          <div
            className="flex h-[72px] items-center justify-center rounded-[3px] border border-dashed border-[var(--line)] bg-[var(--paper-sunk)]"
            aria-hidden
          >
            <span className="mono-tag text-ink-mute">PHOTO</span>
          </div>

          <div>
            <p className="mono-tag text-[0.6rem] uppercase text-clay">Helped with</p>
            <p className="mt-1 text-[0.75rem] leading-[1.55] text-ink-soft">
              Placeholder — what {member.name.split(" ")[0]} helped with on the project.
            </p>
          </div>

          <div>
            <p className="mono-tag text-[0.6rem] uppercase text-clay">What they did</p>
            <p className="mt-1 text-[0.75rem] leading-[1.55] text-ink-soft">
              Placeholder — their contribution and tasks.
            </p>
          </div>

          <span className="mono-tag mt-auto flex items-center gap-1.5 text-ink-mute">
            <RotateCw size={11} aria-hidden />
            Click to flip back
          </span>
        </div>
      </div>
    </button>
  );
}
