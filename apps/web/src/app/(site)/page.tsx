import Link from "next/link";
import { ArrowRight, ArrowUpRight, MoveDown } from "lucide-react";
import { HairWeave } from "@/components/site/hair-weave";
import { CompostingDrum } from "@/components/site/composting-drum";
import { MachineFrame } from "@/components/site/machine-frame";
import { Ticker } from "@/components/site/ticker";
import { Reveal } from "@/components/site/reveal";
import { AreaChart } from "@/components/site/area-chart";
import { SectionHead, SpecRow, Stat, Pill } from "@/components/site/ui-bits";
import { collectionSeries, overviewStats, shops } from "@/lib/data";

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
    meta: "2 min · on site",
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

export default function HomePage() {
  const enrolled = shops.filter((s) => s.status === "Enrolled");

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="grain relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <HairWeave className="opacity-55" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
        </div>

        <div className="shell relative z-10 pb-10 pt-12 sm:pt-16 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
            <div>
              <Reveal>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="flex items-center gap-2">
                    <span className="live-dot size-1.5 rounded-full bg-moss" aria-hidden />
                    <span className="eyebrow text-moss">Now collecting · Balanga, Bataan</span>
                  </span>
                  <span className="h-3 w-px bg-[var(--line)]" aria-hidden />
                  <span className="eyebrow">Line 001 · Nov 2026</span>
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
                A barbershop in Bataan sweeps out four to six kilos of hair a week. We collect it on
                the shop&rsquo;s own schedule, grade it at the door, and turn it into compost with a
                lab result behind every batch.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Link href="/system" className="btn btn-sm">
                  See the system
                  <ArrowRight size={14} />
                </Link>
                <Link href="/partner" className="btn btn-ghost btn-sm">
                  Partner a shop
                </Link>
              </div>
              <p className="mono-tag mt-5 text-ink-mute">
                NO APP · NO LOGIN
                <br />
                NO EXTRA TASK FOR THE SHOP
              </p>
            </Reveal>
          </div>

          {/* specimen window */}
          <Reveal delay={220} className="mt-12 lg:mt-14">
            <div className="flex items-end justify-between gap-4 pb-3">
              <div className="flex items-center gap-3">
                <span className="mono-tag text-clay">MACHINE 01</span>
                <span className="h-px w-8 bg-[var(--line)]" aria-hidden />
                <span className="mono-tag uppercase text-ink-mute">The rotary drum</span>
              </div>
              <span className="mono-tag hidden text-ink-mute sm:inline">
                DRAG TO ROTATE · CLICK AN ASSEMBLY
              </span>
            </div>

            <MachineFrame>
              <CompostingDrum />
            </MachineFrame>

            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--line)] pt-5 sm:grid-cols-4">
              <Stat
                value={overviewStats.totalKg.toFixed(1)}
                unit="kg"
                label="Collected to date"
                note="Weighed, net of sack tare"
              />
              <Stat
                value={String(enrolled.length)}
                label="Shops enrolled"
                note="2 more in candidate stage"
              />
              <Stat value="62" unit="%" label="Clean grade" note="Across the last 40 pickups" />
              <Stat value="45" unit="days" label="Hair to cured compost" note="Batch 2512, verified" />
            </div>
          </Reveal>
        </div>
      </section>

      <Ticker />

      {/* --------------------------------------------------------- problem */}
      <section className="section relative">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <Reveal>
              <SectionHead
                index="01"
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
      <section className="relative border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <SectionHead
                index="02"
                label="The line"
                title={
                  <>
                    Five stations,
                    <br />
                    one <em>sack</em>.
                  </>
                }
              />
            </Reveal>
            <Reveal delay={80}>
              <p className="max-w-[38ch] text-[0.875rem] leading-[1.7] text-ink-soft sm:text-right">
                The same sack changes what it is at every station. Nothing is thrown away, and
                nothing is called compost until the lab says so.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-px border-t border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-5">
            {stations.map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 70}
                className="bg-[var(--paper-raised)]"
              >
                <div className="group flex h-full flex-col bg-[var(--paper-raised)] p-5 transition-colors hover:bg-paper">
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
                Read the full specification
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------- machine */}
      <section className="section border-t border-[var(--line)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="03"
                label="The machine"
                title={
                  <>
                    A motor, a drum,
                    <br />
                    and <em>forty-five days</em>.
                  </>
                }
                lede="Modules 5 and 6 of the specification, built as one machine. The drum turns the mix; the panel only ever sends an authorised start or stop."
              />

              <div className="mt-8 border-t border-[var(--line)]">
                <SpecRow label="Machine" value="MCH-01 · rotary drum" hint="Balanga, Bataan" />
                <SpecRow label="Drive" value="Finned motor · belt · reducer" hint="8 rpm, logged per session" />
                <SpecRow label="Core temperature" value="58.6 °C" hint="Probe 02, in pile" />
                <SpecRow label="Moisture" value="54 %" hint="Target 40–60% while composting" />
                <SpecRow label="Batch" value="BATCH-2603" hint="Recipe v3.3 · 45 / 30 / 25" />
                <SpecRow label="Curing" value="35–45 days" hint="Stage cannot be skipped" />
                <SpecRow label="Web commands" value="Start / stop only" hint="No hardware safety over the wire" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
                  <p className="mono-tag uppercase text-ink-mute">Six assemblies · click one above</p>
                  <span className="mono-tag text-clay">MCH-01</span>
                </div>
                <ul>
                  {[
                    ["01", "Motor & gearbox", "Module 6", "Finned 3-phase motor, fan and reducer drive the belt at 8 rpm."],
                    ["02", "Rotary drum", "Module 5", "Helical paddles lift and turn the mix against a versioned recipe."],
                    ["03", "Hair intake", "Graded", "Only clean and minor, untreated stock is weighed into a batch."],
                    ["04", "Compost discharge", "Cured", "After 45 days the pile stops reheating and the compost is weighed out."],
                    ["05", "Core probe", "Telemetry", "Temperature and moisture logged on every turning day."],
                    ["06", "Control cabinet", "Module 6", "Session log, operator, batch ID, and the local E-stop."],
                  ].map(([n, name, tag, desc]) => (
                    <li
                      key={n}
                      className="grid grid-cols-[auto_1fr] gap-x-4 border-b border-[var(--line)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--paper-sunk)]"
                    >
                      <span className="mono-tag pt-0.5 text-clay">{n}</span>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-3">
                          <p className="text-[0.9375rem] font-medium text-ink">{name}</p>
                          <span className="mono-tag uppercase text-ink-mute">{tag}</span>
                        </div>
                        <p className="mt-1 text-[0.8125rem] leading-[1.65] text-ink-soft">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-l-2 border-lime pl-5">
                <p className="mono-tag uppercase text-clay">Hardware boundary</p>
                <p className="mt-2 max-w-[58ch] text-[0.875rem] leading-[1.7] text-ink-soft">
                  Emergency stop, lid interlock and motor shutoff are wired locally. The web panel
                  can request a start or stop on an approved cycle — it never replaces the safety
                  circuit. That is drawn in rust on the cabinet, not hidden in the interface.
                </p>
              </div>
            </Reveal>
          </div>
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
                    Eight shops.
                    <br />
                    One <em>route</em>.
                  </>
                }
                lede="Each shop keeps its own pickup rule — days, a time window, and the access note that actually matters at 9 PM."
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
                <div className="hidden grid-cols-[70px_1fr_130px_96px_74px] gap-4 border-b border-[var(--line)] px-5 py-3 sm:grid">
                  {["Code", "Shop", "Pickup rule", "Status", "Net kg"].map((h, i) => (
                    <span
                      key={h}
                      className={`mono-tag uppercase text-ink-mute ${i === 4 ? "text-right" : ""}`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <ul>
                  {shops.slice(0, 5).map((s) => (
                    <li
                      key={s.code}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-[var(--line)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--paper-sunk)] sm:grid-cols-[70px_1fr_130px_96px_74px] sm:gap-y-0"
                    >
                      <span className="mono-tag order-2 text-clay sm:order-none">{s.code}</span>
                      <span className="order-1 text-[0.875rem] font-medium text-ink sm:order-none">
                        {s.name}
                        <span className="mt-0.5 block text-[0.75rem] font-normal text-ink-mute sm:hidden">
                          {s.days.join(" & ")} · {s.window}
                        </span>
                      </span>
                      <span className="order-3 hidden text-[0.75rem] text-ink-soft sm:block">
                        {s.days.join(" & ")}
                      </span>
                      <span className="order-4 sm:order-none">
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
                      <span className="num order-5 hidden text-right text-[0.8125rem] text-ink sm:block">
                        {s.totalKg.toFixed(1)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
                  <span className="mono-tag text-ink-mute">SHOWING 5 OF 8 RECORDS</span>
                  <span className="mono-tag text-moss">8 SHOPS · BALANGA</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- materials */}
      <section className="relative overflow-hidden bg-moss-deep text-paper">
        <div className="shell section">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <Reveal>
              <SectionHead
                index="05"
                label="What comes out"
                tone="paper"
                title={
                  <>
                    Not &ldquo;organic
                    <br />
                    waste&rdquo;. <em className="text-lime">A product.</em>
                  </>
                }
                lede="Batch 2512, cured 45 days, tested at Central Luzon Soil Laboratory. The numbers below are the ones printed on the report — not targets."
              />
              <div className="mt-8 flex flex-wrap gap-2">
                <Pill tone="lime">Approved for supervised testing</Pill>
                <Pill tone="mute">Batch 2512</Pill>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="border-t border-paper/12">
                <SpecRow tone="paper" label="Nitrogen (N)" value="1.42 %" hint="Kjeldahl, dry basis" />
                <SpecRow tone="paper" label="Phosphorus (P₂O₅)" value="0.86 %" />
                <SpecRow tone="paper" label="Potassium (K₂O)" value="1.19 %" />
                <SpecRow tone="paper" label="pH" value="7.1" hint="1:5 water suspension" />
                <SpecRow tone="paper" label="Moisture" value="24 %" />
                <SpecRow tone="paper" label="Maturity" value="Mature" hint="Stable, no reheating" />
                <SpecRow tone="paper" label="Pathogens" value="Absent" hint="Salmonella, E. coli" />
              </div>
              <p className="mono-tag mt-5 text-paper/55">
                LABORATORY REPORT LR-0412 · 30 OCT 2026 · CENTRAL LUZON SOIL LABORATORY
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-8 border-t border-paper/12 pt-8 sm:grid-cols-3">
            {[
              {
                k: "We take",
                v: "Cut human hair, untreated or flagged treated, in the shop's own labelled sack.",
              },
              {
                k: "We leave",
                v: "Sweepings, tissue, plastic, chemical waste. Graded mixed and held, never batched.",
              },
              {
                k: "We return",
                v: "A signed lab result, a pickup receipt, and compost for the barangay's planting beds.",
              },
            ].map((item, i) => (
              <Reveal key={item.k} delay={i * 80}>
                <p className="mono-tag uppercase text-lime">{item.k}</p>
                <p className="mt-3 text-[0.875rem] leading-[1.7] text-paper/75">{item.v}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- evidence */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
            <Reveal>
              <SectionHead
                index="06"
                label="Evidence"
                title={
                  <>
                    Measured,
                    <br />
                    not <em>claimed</em>.
                  </>
                }
                lede="Ten weeks of weighed pickups. The line is not a projection — it is the sum of every sack that came through the door."
              />
              <div className="mt-8 flex items-center gap-6">
                <div>
                  <p className="num font-display font-semibold text-[2rem] leading-none text-ink">+142%</p>
                  <p className="mono-tag mt-2 text-ink-mute">WEEK 36 → WEEK 45</p>
                </div>
                <div className="h-10 w-px bg-[var(--line)]" />
                <div>
                  <p className="num font-display font-semibold text-[2rem] leading-none text-ink">41</p>
                  <p className="mono-tag mt-2 text-ink-mute">WEIGHED PICKUPS</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card-print p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="mono-tag uppercase text-ink-mute">Kilograms collected</p>
                  <span className="mono-tag text-ink-mute">WK 36 — WK 45</span>
                </div>
                <AreaChart
                  data={collectionSeries.map((d) => ({ label: d.label, value: d.kg }))}
                  height={200}
                  className="mt-4"
                />
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-px border-t border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
            {[
              {
                k: "Collection",
                v: "284.7 kg",
                d: "Net of sack tare, across 41 weighed pickups in ten weeks.",
              },
              {
                k: "Quality",
                v: "62% clean",
                d: "27% minor, 11% mixed. Mixed never enters a batch.",
              },
              {
                k: "Output",
                v: "12.9 kg",
                d: "Cured compost from batch 2512 — 58.6% mass reduction.",
              },
            ].map((item, i) => (
              <Reveal key={item.k} delay={i * 80} className="bg-paper">
                <div className="h-full bg-paper px-5 py-7">
                  <p className="mono-tag uppercase text-clay">{item.k}</p>
                  <p className="num mt-6 font-display font-semibold text-[2.25rem] leading-none text-ink">
                    {item.v}
                  </p>
                  <p className="mt-3 text-[0.8125rem] leading-[1.65] text-ink-soft">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <Link
              href="/impact"
              className="group mt-8 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-moss"
            >
              Read the evidence trail
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--paper-sunk)]">
        <div className="shell relative z-10 section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow">Next pickup window · Tue &amp; Fri, 8–9 PM</p>
              <h2 className="display mt-6 text-[clamp(2.4rem,6vw,5rem)] text-ink">
                Give us your hair.
                <br />
                We&rsquo;ll give you
                <br />
                the <em className="text-moss">receipt</em>.
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="max-w-[42ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                We register the shop on site in about two minutes. No password, no dashboard, no
                new habit. You keep cutting hair; we do the rest and tell you what happened.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/partner" className="btn">
                  Partner a shop
                  <ArrowUpRight size={15} />
                </Link>
                <Link href="/network" className="btn btn-ghost">
                  See the shop network
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2 text-ink-mute">
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
