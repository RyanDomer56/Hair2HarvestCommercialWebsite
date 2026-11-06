import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { MachineFrame } from "@/components/site/machine-frame";
import { CompostingDrum } from "@/components/site/composting-drum";
import { SectionHead, Pill } from "@/components/site/ui-bits";
import { shops, overviewStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From the barber's chair to compost: five simple steps, explained in plain words. We come to the shop, collect the hair and turn it into soil.",
};

/* Each step has a plain explanation for shop owners and a small technical
   note for researchers or project evaluators (QA #16). */
const steps = [
  {
    n: "01",
    name: "We pick up the sack",
    time: "At your shop",
    simple:
      "We come to your shop, open the sack in front of you and count the sacks. We take a photo and you tap once on our phone to confirm. There is nothing to sign in to.",
    detail:
      "Intake: sack count, photo log and acknowledgement recorded against the shop code. No account or login is needed.",
  },
  {
    n: "02",
    name: "We check the hair",
    time: "A few seconds",
    simple:
      "We look at what is in the sack. Hair only is best. A little tissue is fine. If there is plastic or wet waste, we still take it — we simply keep it aside and never mix it into compost.",
    detail:
      "Grading: Clean / Minor / Mixed, decided at the door. A mixed sack gets a coaching note and is held; the shop is never penalised.",
  },
  {
    n: "03",
    name: "We mix a batch",
    time: "Same day",
    simple:
      "After collection, the hair is weighed and combined with other organic materials following the approved composting mixture. Each batch is recorded so the team can monitor its progress.",
    detail:
      "Batching: weighed input against a versioned recipe (hair / carbon / greens), given a batch ID and logged as a stock movement.",
  },
  {
    n: "04",
    name: "We let it rest",
    time: "About six weeks",
    simple:
      "The pile warms up, then slowly cools down. We turn it and check heat and moisture until it is stable. We cannot rush this wait — good compost needs time.",
    detail:
      "Curing: 35–45 days. Temperature and moisture are logged on each turning day; a pile that reheats is not mature yet.",
  },
  {
    n: "05",
    name: "A laboratory checks it",
    time: "After resting",
    simple:
      "We send a sample to a laboratory. It checks the nutrients, the acidity and that the compost is safe. Only when the result is good do we call it compost and use it.",
    detail:
      "Lab: N-P-K, pH, moisture, maturity and pathogens. A batch is approved only after a passing, reviewed report.",
  },
];

const grades = [
  {
    name: "Clean",
    tone: "moss" as const,
    def: "Hair only. No tissue, no plastic, no packaging.",
    action: "Goes straight into compost.",
  },
  {
    name: "A little mixed",
    tone: "clay" as const,
    def: "Mostly hair, with a little tissue or a wrapper.",
    action: "Still fine — we just add a note.",
  },
  {
    name: "Not usable",
    tone: "rust" as const,
    def: "Plastic sachets, wet waste or a chemical smell.",
    action: "We still collect it, but keep it out of compost.",
  },
];

export default function SystemPage() {
  return (
    <>
      <PageHero
        index="01"
        label="How it works"
        title={
          <>
            From the chair
            <br />
            to the <em>soil</em>.
          </>
        }
        lede="Five easy steps. We come to your shop, pick up the hair and turn it into compost for your barangay. Nothing here needs an app, an account or any extra work from you."
        cta={{ label: "Join the shops", href: "/partner" }}
        meta={[
          { k: "Steps", v: "5" },
          { k: "Shops with us", v: String(shops.length) },
          { k: "Hair collected", v: `${overviewStats.totalKg.toFixed(1)} kg` },
          { k: "Cost to join", v: "Free" },
        ]}
      />

      {/* -------------------------------------------------- the five steps */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="01.1"
              label="The five steps"
              title={
                <>
                  One sack,
                  <br />
                  five <em>stops</em>.
                </>
              }
              lede="First, the easy explanation. If you work in research or you are reviewing the project, the small note under each step gives the technical version."
            />
          </Reveal>

          <div className="mt-12 space-y-px bg-[var(--line)]">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 60} className="bg-paper">
                <article className="grid gap-6 bg-paper p-6 lg:grid-cols-[76px_minmax(0,1fr)] lg:gap-10 lg:p-8">
                  <div>
                    <p className="font-display font-semibold text-[2rem] leading-none text-clay">{s.n}</p>
                    <p className="mono-tag mt-3 text-ink-mute">{s.time}</p>
                  </div>
                  <div>
                    <h3 className="text-[1.125rem] font-medium tracking-[-0.02em] text-ink">
                      {s.name}
                    </h3>
                    <p className="mt-2.5 max-w-[62ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                      {s.simple}
                    </p>
                    <div className="mt-5 rounded-[3px] border border-[var(--line)] bg-[var(--paper-sunk)] px-4 py-3">
                      <p className="mono-tag uppercase text-ink-mute">For researchers</p>
                      <p className="mt-1.5 max-w-[68ch] text-[0.8125rem] leading-[1.65] text-ink-soft">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- grading */}
      <section id="grading" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="01.2"
                label="Checking the hair"
                title={
                  <>
                    No one gets
                    <br />
                    in <em>trouble</em>.
                  </>
                }
                lede="We look at every sack at the door. A sack with a little tissue is still collected. We only keep material out of the compost — we never refuse a shop or charge a penalty."
              />
            </Reveal>
            <div className="space-y-px bg-[var(--line)]">
              {grades.map((g, i) => (
                <Reveal key={g.name} delay={i * 70} className="bg-[var(--paper-raised)]">
                  <div className="bg-[var(--paper-raised)] p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Pill tone={g.tone}>{g.name}</Pill>
                    </div>
                    <p className="mt-4 text-[0.9375rem] text-ink">{g.def}</p>
                    <p className="mt-1.5 text-[0.8125rem] leading-[1.65] text-ink-soft">{g.action}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- privacy + batches */}
      <section id="batch" className="section scroll-mt-24">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="01.3"
                label="Your details"
                title={
                  <>
                    Some things
                    <br />
                    stay <em>private</em>.
                  </>
                }
                lede="We agree the pickup days and time with each shop when we visit. Those details, the contact person and how we reach the sack are for our staff only. This website never shows them."
              />
              <p className="mt-6 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                The public shop list shows just three things: the shop name, its barangay and its
                partnership status. Nothing that could tell an outsider where hair is kept.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <SectionHead
                index="01.4"
                label="Every batch"
                title={
                  <>
                    Why we write
                    <br />
                    it <em>down</em>.
                  </>
                }
                lede="We give every batch a number and write down what went into it and what came out. That way, if a laboratory result is ever questioned, we can trace it back to the sacks it came from."
              />
              <div className="mt-6 rounded-[3px] border border-[var(--line)] bg-[var(--paper-sunk)] px-4 py-3">
                <p className="mono-tag uppercase text-ink-mute">For researchers</p>
                <p className="mt-1.5 text-[0.8125rem] leading-[1.65] text-ink-soft">
                  A batch is a chain of custody: weighed input from identified shops, a versioned
                  recipe, daily temperature logs and a signed laboratory report.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Pill tone="moss">Lab checked</Pill>
                <Pill tone="mute">About six weeks</Pill>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- 3D prototype */}
      <section className="border-y border-[var(--line)] bg-[var(--paper-sunk)]">
        <div className="shell section">
          <Reveal>
            <SectionHead
              index="01.5"
              label="The machine"
              title={
                <>
                  The drum that
                  <br />
                  turns the <em>mix</em>.
                </>
              }
              lede="This is the only machine we use. Drag to turn it around, or tap a part to see its name. It mixes the hair with plant material while the compost rests."
            />
          </Reveal>
          <Reveal delay={100}>
            <MachineFrame>
              <CompostingDrum />
            </MachineFrame>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-5 rounded-[3px] border border-[var(--line)] bg-paper px-4 py-3">
              <p className="mono-tag uppercase text-ink-mute">For researchers</p>
              <p className="mt-1.5 text-[0.8125rem] leading-[1.65] text-ink-soft">
                MCH-01 rotary drum, 8 rpm belt drive. Emergency stop, lid interlock and motor
                shutoff are wired locally; the web panel can only request start or stop on an
                approved cycle.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <Reveal>
              <SectionHead
                index="01.6"
                label="Join us"
                title={
                  <>
                    Want your shop
                    <br />
                    on the <em>list</em>?
                  </>
                }
                lede="It is free, it takes almost none of your time, and we do the paperwork. You keep cutting hair; we do the rest."
              />
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/partner" className="btn">
                  Join the shops
                  <ArrowUpRight size={15} />
                </Link>
                <Link href="/network" className="btn btn-ghost">
                  See the shops
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
