import Link from "next/link";
import { ArrowRight, ArrowUpRight, ClipboardList, MoveDown, Recycle, Store, Truck, Users } from "lucide-react";
import { HairWeave } from "@/components/site/hair-weave";
import { Ticker } from "@/components/site/ticker";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, Stat, Pill } from "@/components/site/ui-bits";
import { shops, overviewStats } from "@/lib/data";

const problems = [
  {
    n: "01",
    title: "It goes into the same sack",
    body: "Hair arrives mixed with tissue, plastic sachets and packaging. Shops separate it only when a container exists for it — so we bring the container.",
  },
  {
    n: "02",
    title: "Nobody has the time",
    body: "Mall shifts, back-to-back chairs, one person on the floor. A trip to the barangay hall costs a day the shop does not have. So the collector goes to the shop.",
  },
  {
    n: "03",
    title: "Volume is a guess",
    body: "Shops describe output in sacks per week, not kilograms. Without a scale there is no number, and without a number there is no evidence.",
  },
];

const stations = [
  {
    n: "01",
    name: "Intake",
    line: "The labelled sack is opened, counted and photographed.",
    meta: "On site",
  },
  {
    n: "02",
    name: "Grading",
    line: "Clean, minor or mixed — decided at the door, in seconds.",
    meta: "3 grades",
  },
  {
    n: "03",
    name: "Batch",
    line: "Weighed into a recipe, turned and logged against a batch ID.",
    meta: "40 / 35 / 25",
  },
  {
    n: "04",
    name: "Curing",
    line: "Temperature and moisture tracked until the pile is stable.",
    meta: "35–45 days",
  },
  {
    n: "05",
    name: "Lab",
    line: "N-P-K, pH, maturity. Approved only after review.",
    meta: "signed off",
  },
];

const faqs = [
  {
    q: "What is Hair2Harvest?",
    a: "A collection service that picks up hair clippings from barbershops in Balanga, Bataan, turns them into compost, and brings the results back to the community. Nothing leaves the barangay except the waste.",
  },
  {
    q: "What do I need to do?",
    a: "Almost nothing. A staff member visits your shop, registers it in a few minutes, and leaves a labelled sack. You keep cutting hair — there is no app and no login to remember.",
  },
  {
    q: "What happens to my hair clippings?",
    a: "We collect them on a schedule that fits your hours, grade them at the door, and compost them over about 45 days. Every batch is sent to a laboratory and signed off before we call it compost.",
  },
  {
    q: "What do I get from participating?",
    a: "A pickup receipt with sack count and net kilograms, a message when your hair's batch is tested, and first refusal on cured compost for your barangay's planting beds.",
  },
];

const navCards = [
  {
    href: "/system",
    label: "How does it work?",
    desc: "Follow a sack through five simple stops.",
    icon: Recycle,
  },
  {
    href: "/partner",
    label: "Why become a partner?",
    desc: "What your shop gets, and what we ask.",
    icon: Users,
  },
  {
    href: "/network",
    label: "Shop network",
    desc: "See the barbershops already collecting.",
    icon: Store,
  },
  {
    href: "/system",
    label: "Collection process",
    desc: "From the chair to cured compost.",
    icon: Truck,
  },
  {
    href: "/partner",
    label: "Register your shop",
    desc: "Request a free visit in one click.",
    icon: ClipboardList,
  },
];

export default function HomePage() {
  const enrolled = shops.filter((s) => s.status === "Enrolled");
  const preview = shops.filter((s) => s.status === "Enrolled" || s.status === "Candidate").slice(0, 5);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="grain relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <HairWeave className="opacity-55" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
        </div>

        <div className="shell relative z-10 pb-10 pt-12 sm:pt-16 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-16">
            <div>
              <Reveal>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="flex items-center gap-2">
                    <span className="live-dot size-1.5 rounded-full bg-moss" aria-hidden />
                    <span className="eyebrow text-moss">Now collecting · Balanga, Bataan</span>
                  </span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="display mt-7 text-[clamp(2.55rem,6.6vw,5.9rem)] text-ink">
                  Every haircut
                  <br />
                  leaves <em className="text-moss">something</em>
                  <br />
                  behind.
                </h1>
              </Reveal>
            </div>

            <Reveal delay={160} className="lg:pb-3">
              <p className="text-[0.9375rem] leading-[1.7] text-ink-soft">
                Hair2Harvest collects the hair your shop sweeps up, turns it into compost, and brings
                the results back to your barangay. No app, no login, no extra work for you.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Link href="/partner" className="btn btn-sm">
                  Partner a shop
                  <ArrowRight size={14} />
                </Link>
                <Link href="/system" className="btn btn-ghost btn-sm">
                  See how it works
                </Link>
              </div>
              <p className="mono-tag mt-5 text-ink-mute">
                NO APP · NO LOGIN
                <br />
                NO EXTRA TASK FOR THE SHOP
              </p>
            </Reveal>
          </div>

          {/* quick facts */}
          <Reveal delay={220} className="mt-12 lg:mt-14">
            <div className="grid grid-cols-3 gap-x-6 gap-y-5 border-t border-[var(--line)] pt-6">
              <Stat
                value={String(shops.length)}
                label="Shops in the network"
                note="Balanga, Bataan"
              />
              <Stat
                value={overviewStats.totalKg.toFixed(1)}
                unit="kg"
                label="Collected to date"
                note="Weighed, net of sack tare"
              />
              <Stat value="0" label="Passwords for the shop" note="Code on a sack is the ID" />
            </div>
          </Reveal>
        </div>
      </section>

      <Ticker />

      {/* --------------------------------------------------- where to go */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="00"
              label="Where to next"
              title={
                <>
                  Find your <em>way</em> in.
                </>
              }
              lede="Four things a shop owner usually wants to know. Tap any card — you should not have to scroll to find them."
            />
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {navCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.label} delay={i * 60}>
                  <Link
                    href={c.href}
                    className="group flex h-full flex-col rounded-[4px] border border-[var(--line)] bg-paper p-5 transition-colors hover:border-moss/40 hover:bg-[color-mix(in_oklab,var(--moss)_6%,transparent)]"
                  >
                    <Icon size={20} className="text-moss" aria-hidden />
                    <p className="mt-4 text-[0.9375rem] font-medium tracking-[-0.01em] text-ink">
                      {c.label}
                    </p>
                    <p className="mt-1.5 text-[0.75rem] leading-snug text-ink-soft">{c.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[0.6875rem] font-medium text-moss">
                      Open
                      <ArrowUpRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- faqs */}
      <section className="relative border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <Reveal>
            <SectionHead
              index="01"
              label="Before you decide"
              title={
                <>
                  What happens
                  <br />
                  when you <em>join?</em>
                </>
              }
              lede="The four questions every shop owner asks first. Plain answers, no jargon."
            />
          </Reveal>

          <div className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 70} className="bg-[var(--paper-raised)]">
                <div className="h-full bg-[var(--paper-raised)] p-6 transition-colors hover:bg-paper">
                  <div className="flex items-start gap-4">
                    <span className="mono-tag pt-1 text-clay">0{i + 1}</span>
                    <div>
                      <h3 className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                        {f.q}
                      </h3>
                      <p className="mt-2.5 max-w-[52ch] text-[0.875rem] leading-[1.7] text-ink-soft">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- problem */}
      <section className="section relative">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <Reveal>
              <SectionHead
                index="02"
                label="The problem"
                title={
                  <>
                    The hair was never
                    <br />
                    the <em>hard</em> part.
                  </>
                }
                lede="Every shop already gives it away or throws it out. What stops it from becoming soil is not willingness — it is the three frictions below."
              />
            </Reveal>

            <div className="flex flex-col">
              {problems.map((p, i) => (
                <Reveal key={p.n} delay={i * 80}>
                  <div className="group grid grid-cols-[auto_1fr] gap-x-5 border-t border-[var(--line)] py-6 transition-colors last:border-b hover:bg-[color-mix(in_oklab,var(--ink)_3%,transparent)] sm:gap-x-8">
                    <span className="mono-tag pt-1 text-clay">{p.n}</span>
                    <div>
                      <h3 className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                        {p.title}
                      </h3>
                      <p className="mt-2 max-w-[52ch] text-[0.875rem] leading-[1.7] text-ink-soft">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={280}>
                <blockquote className="mt-8 border-l-2 border-lime pl-5">
                  <p className="display text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.25] text-ink">
                    &ldquo;They don&rsquo;t want to be bothered. So we don&rsquo;t bother them.&rdquo;
                  </p>
                  <footer className="mono-tag mt-3 text-ink-mute">
                    FIELD INTERVIEW · MALL-BASED SHOP, BALANGA
                  </footer>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- process */}
      <section id="process" className="relative border-y border-[var(--line)] bg-[var(--paper-sunk)]">
        <div className="shell section">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <SectionHead
                index="03"
                label="How it works"
                title={
                  <>
                    Five stops,
                    <br />
                    one <em>sack</em>.
                  </>
                }
              />
            </Reveal>
            <Reveal delay={80}>
              <p className="max-w-[38ch] text-[0.875rem] leading-[1.7] text-ink-soft sm:text-right">
                The same sack changes what it is at every stop. Nothing is thrown away, and nothing
                is called compost until the lab says so.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-px border-t border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-5">
            {stations.map((s, i) => (
              <Reveal key={s.n} delay={i * 70} className="bg-[var(--paper-sunk)]">
                <div className="group flex h-full flex-col bg-[var(--paper-sunk)] p-5 transition-colors hover:bg-paper">
                  <div className="flex items-center justify-between">
                    <span className="mono-tag text-clay">{s.n}</span>
                    <span className="mono-tag text-ink-mute/70">{s.meta}</span>
                  </div>
                  <h3 className="mt-10 text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-[1.65] text-ink-soft">{s.line}</p>
                  <div className="mt-auto pt-6">
                    <div className="h-px w-full bg-[var(--line)]">
                      <div className="h-px w-0 bg-moss transition-all duration-500 group-hover:w-full" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="mono-tag text-ink-mute">
                RULE 01 — HAIR2HARVEST NEVER ASKS A SHOP TO TRAVEL.
              </p>
              <Link
                href="/system"
                className="group inline-flex items-center gap-2 text-[0.8125rem] font-medium text-moss"
              >
                See the full process
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------- network */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="04"
                label="The network"
                title={
                  <>
                    Shops already
                    <br />
                    on the <em>route</em>.
                  </>
                }
                lede="Real barbershops in Balanga collecting with us. Tap through to see the public directory — name, barangay and partnership status only."
              />
              <Link
                href="/network"
                className="group mt-7 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-moss"
              >
                Open the shop directory
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print overflow-hidden">
                <div className="hidden grid-cols-[1fr_1fr_96px] gap-4 border-b border-[var(--line)] px-5 py-3 sm:grid">
                  {["Shop", "Barangay", "Status"].map((h, i) => (
                    <span
                      key={h}
                      className={`mono-tag uppercase text-ink-mute ${i === 2 ? "text-right" : ""}`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <ul>
                  {preview.map((s) => (
                    <li
                      key={s.code}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-[var(--line)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--paper-sunk)] sm:grid-cols-[1fr_1fr_96px] sm:gap-y-0"
                    >
                      <span className="order-1 text-[0.875rem] font-medium text-ink sm:order-none">
                        {s.name}
                      </span>
                      <span className="order-3 text-[0.75rem] text-ink-soft sm:order-none">
                        {s.barangay}
                      </span>
                      <span className="order-2 sm:order-none sm:text-right">
                        <Pill
                          tone={
                            s.status === "Enrolled"
                              ? "moss"
                              : s.status === "Candidate"
                                ? "lime"
                                : s.status === "Paused"
                                  ? "clay"
                                  : "mute"
                          }
                        >
                          {s.status}
                        </Pill>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
                  <span className="mono-tag text-ink-mute">SHOWING {preview.length} OF {shops.length}</span>
                  <span className="mono-tag text-moss">{enrolled.length} ENROLLED</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="relative overflow-hidden border-t border-[var(--line)] bg-moss-deep text-paper">
        <div className="shell relative z-10 section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow text-lime">Next pickup window · Tue &amp; Fri, 8–9 PM</p>
              <h2 className="display mt-6 text-[clamp(2.4rem,6vw,5rem)] text-paper">
                Give us your hair.
                <br />
                We&rsquo;ll give you
                <br />
                the <em className="text-lime">receipt</em>.
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="max-w-[42ch] text-[0.9375rem] leading-[1.7] text-paper/75">
                A staff member visits your shop, registers it in a few minutes, and leaves a labelled
                sack. No password, no dashboard, no new habit. You keep cutting hair; we do the rest
                and tell you what happened.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/partner" className="btn btn-lime">
                  Partner a shop
                  <ArrowUpRight size={15} />
                </Link>
                <Link href="/network" className="btn btn-ghost-paper">
                  See the shop network
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2 text-paper/55">
                <MoveDown size={13} />
                <span className="mono-tag">OR SCROLL THE LINE ABOVE AGAIN</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
