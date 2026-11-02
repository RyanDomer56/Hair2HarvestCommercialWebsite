import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, SpecRow, Pill } from "@/components/site/ui-bits";
import { shops, pickups } from "@/lib/data";

export const metadata: Metadata = {
  title: "The system",
  description:
    "How Hair2Harvest collects, grades, batches and proves human hair compost: five stations, four roles, one rule — the collector goes to the shop.",
};

const decisions = [
  {
    k: "Shops have no accounts",
    v: "Staff register the shop on site in about two minutes and write a code on the sack. No password, no dashboard, no drop-off.",
  },
  {
    k: "The pickup rule is per shop",
    v: "Frequency, days, time window, access note. Default twice weekly; a mall shop can hold a second sack and a shorter rule.",
  },
  {
    k: "The collector travels",
    v: "There is no drop-off flow. If a pickup is missed, the collector returns — never the shop.",
  },
  {
    k: "Sacks and kilograms, both",
    v: "Sack count matches how shops describe volume. Gross minus a standard tare gives the real mass.",
  },
  {
    k: "Nothing is approved by a rule",
    v: "The rule engine only recommends. An admin authorises every status change, and only after lab review.",
  },
];

const stationDetail = [
  {
    n: "01",
    name: "Intake",
    time: "2 minutes, on site",
    body: "The shop's labelled sack is opened in front of staff. Sack count is recorded, the container is photographed against the shop code, and the shop taps or initials on the collector's phone. That tap is the acknowledgment — no login required.",
    inputs: ["Labelled sack", "Shop code", "Collector phone"],
    outputs: ["Pickup record", "Photo log", "Acknowledgment"],
  },
  {
    n: "02",
    name: "Grading",
    time: "Seconds",
    body: "Contamination is graded at the door: clean, minor or mixed. A mixed sack is not refused — it is recorded with a reason and a coaching note, then held out of batches. The shop is never penalised for a bad week.",
    inputs: ["Opened sack", "Grade rubric"],
    outputs: ["Grade", "Rejection reason", "Coaching note"],
  },
  {
    n: "03",
    name: "Batch",
    time: "Day 0",
    body: "Only clean and minor, untreated stock enters a batch. Hair is weighed against a versioned recipe, mixed with carbon and greens, and deducted from raw inventory. The batch gets an ID before anything is turned.",
    inputs: ["Graded stock", "Recipe version", "Machine"],
    outputs: ["Batch ID", "Input mass", "Stock movement"],
  },
  {
    n: "04",
    name: "Curing",
    time: "35–45 days",
    body: "Temperature, moisture and turning events are logged over time. A pile that reheats is not mature. The stage indicator moves preparation → composting → curing → sampling, and the operator cannot skip a stage.",
    inputs: ["Batch", "Daily readings"],
    outputs: ["Temperature log", "Moisture log", "Stage history"],
  },
  {
    n: "05",
    name: "Lab",
    time: "7–10 days after sampling",
    body: "A sample goes to an external laboratory for N-P-K, pH, moisture, maturity and pathogens. Re-tests are stored as new versions, never overwritten. The batch stays Pending until an admin signs off.",
    inputs: ["Sample", "Laboratory"],
    outputs: ["Lab result", "Verdict", "Approval decision"],
  },
];

const grades = [
  {
    name: "Clean",
    tone: "moss" as const,
    share: "62%",
    def: "Hair only. No tissue, no plastic, no packaging.",
    action: "Enters raw inventory immediately.",
  },
  {
    name: "Minor",
    tone: "clay" as const,
    share: "27%",
    def: "Trace tissue or a few wrappers. Still mostly hair.",
    action: "Enters inventory with a note attached.",
  },
  {
    name: "Mixed",
    tone: "rust" as const,
    share: "11%",
    def: "Plastic sachets, wet waste, or a chemical smell.",
    action: "Held. Never batched. Coaching note left with the shop.",
  },
];

const roles = [
  { role: "Admin", shop: "Approve, manage", col: "Full", batch: "Full", machine: "View", lab: "View" },
  { role: "Staff", shop: "Register, edit", col: "Record pickups", batch: "View", machine: "None", lab: "None" },
  { role: "Operator", shop: "View", col: "View", batch: "Create, update", machine: "Operate", lab: "None" },
  { role: "Researcher", shop: "View", col: "View", batch: "View", machine: "View", lab: "Enter, upload" },
];

const openItems = [
  "Which of the nine candidate shops sit inside the pilot barangay, and which six were interviewed.",
  "Whether treated hair — about 15% of clients — is acceptable in compost, and at what share.",
  "How to serve the mall shop that wants nightly pickup without doubling collection cost.",
  "The real sack tare weight. Currently configured at 0.18 kg and flagged as an assumption.",
  "The barangay's written answer on whether a separate hair programme already exists.",
];

export default function SystemPage() {
  const route = pickups.filter((p) => p.status === "Scheduled");

  return (
    <>
      <PageHero
        index="01"
        label="The system"
        title={
          <>
            Specified,
            <br />
            not <em>improvised</em>.
          </>
        }
        lede="Thirteen modules, four roles, one hard rule: the collector goes to the shop. Everything below is the operating specification the software enforces — not a plan for one."
        cta={{ label: "Read the design document", href: "/impact" }}
        meta={[
          { k: "Modules", v: "13" },
          { k: "Roles", v: "4" },
          { k: "Stack", v: "MERN" },
          { k: "Shops in pilot", v: String(shops.length) },
        ]}
      />

      {/* decisions */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="01.1"
                label="Design basis"
                title={
                  <>
                    Five decisions
                    <br />
                    shaped the <em>rest</em>.
                  </>
                }
                lede="Each one came from an interview, not a preference. When a decision is expensive to reverse, it is written down here first."
              />
            </Reveal>
            <div>
              {decisions.map((d, i) => (
                <Reveal key={d.k} delay={i * 70}>
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-[var(--line)] py-5 last:border-b">
                    <span className="mono-tag pt-0.5 text-clay">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-[0.9375rem] font-medium tracking-[-0.015em] text-ink">
                        {d.k}
                      </h3>
                      <p className="mt-1.5 text-[0.8125rem] leading-[1.7] text-ink-soft">{d.v}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* stations */}
      <section className="border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <Reveal>
            <SectionHead
              index="01.2"
              label="Station detail"
              title={
                <>
                  What happens at
                  <br />
                  each <em>stop</em>.
                </>
              }
              lede="A pickup is a sequence of small, cheap, verifiable actions. If any one of them needs a keyboard, it will not happen at 9 PM in a mall basement."
            />
          </Reveal>

          <div className="mt-12 space-y-px bg-[var(--line)]">
            {stationDetail.map((s, i) => (
              <Reveal key={s.n} delay={i * 60} className="bg-[var(--paper-raised)]">
                <article className="grid gap-6 bg-[var(--paper-raised)] p-6 lg:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 lg:p-8">
                  <div>
                    <p className="font-display text-[2rem] leading-none text-clay">{s.n}</p>
                    <p className="mono-tag mt-3 text-ink-mute">{s.time}</p>
                  </div>
                  <div>
                    <h3 className="text-[1.125rem] font-medium tracking-[-0.02em] text-ink">
                      {s.name}
                    </h3>
                    <p className="mt-2.5 max-w-[46ch] text-[0.875rem] leading-[1.7] text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="mono-tag uppercase text-ink-mute">In</p>
                      <ul className="mt-2 space-y-1.5">
                        {s.inputs.map((x) => (
                          <li key={x} className="text-[0.8125rem] text-ink">
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mono-tag uppercase text-ink-mute">Out</p>
                      <ul className="mt-2 space-y-1.5">
                        {s.outputs.map((x) => (
                          <li key={x} className="text-[0.8125rem] text-ink">
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* grading */}
      <section id="grading" className="section scroll-mt-24">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="01.3"
                label="Grading standard"
                title={
                  <>
                    Three grades.
                    <br />
                    No <em>penalties</em>.
                  </>
                }
                lede="Shops separate hair when a container exists for it. Grading is a coaching tool, not a punishment — a mixed sack still gets collected and still gets recorded."
              />
            </Reveal>
            <div className="space-y-px bg-[var(--line)]">
              {grades.map((g, i) => (
                <Reveal key={g.name} delay={i * 70} className="bg-paper">
                  <div className="bg-paper p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Pill tone={g.tone}>{g.name}</Pill>
                        <span className="mono-tag text-ink-mute">{g.share} of pickups</span>
                      </div>
                      <span
                        className="h-2 w-10 rounded-full"
                        style={{
                          background:
                            g.tone === "moss"
                              ? "var(--moss)"
                              : g.tone === "clay"
                                ? "var(--clay)"
                                : "var(--rust)",
                        }}
                        aria-hidden
                      />
                    </div>
                    <p className="mt-4 text-[0.9375rem] text-ink">{g.def}</p>
                    <p className="mt-1.5 text-[0.8125rem] leading-[1.65] text-ink-soft">
                      {g.action}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* pickup rules + route */}
      <section
        id="rules"
        className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-sunk)]"
      >
        <div className="shell section">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHead
                index="01.4"
                label="Pickup rule"
                title={
                  <>
                    One rule per
                    <br />
                    shop, not one <em>policy</em>.
                  </>
                }
                lede="Frequency ranges from nightly to weekly across the interviewed shops. A single schedule would either over-collect or let a sack sit for ten days."
              />
              <div className="mt-8 border-t border-[var(--line)]">
                <SpecRow label="Frequency" value="Twice weekly (default)" hint="Nightly, weekly or custom per shop" />
                <SpecRow label="Days" value="Tue & Fri" hint="Shop's own choice, not a global rota" />
                <SpecRow label="Time window" value="8–9 PM" hint="After closing, or a midday window" />
                <SpecRow label="Access notes" value="Side door · ask for Ruel" hint="Guard, loading dock, who to ask" />
                <SpecRow label="Peak-day flag" value="Weekend heavy" hint="Weekends and Sundays are busiest" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3.5">
                  <p className="mono-tag uppercase text-ink-mute">Collector route · tonight</p>
                  <span className="mono-tag text-moss">SORTED BY WINDOW</span>
                </div>
                <ol>
                  {route.length === 0 && (
                    <li className="px-5 py-6 text-[0.875rem] text-ink-soft">
                      No pickups scheduled. The next window opens Tuesday.
                    </li>
                  )}
                  {route.map((p, i) => (
                    <li
                      key={p.id}
                      className="flex items-start gap-4 border-b border-[var(--line)] px-5 py-4 last:border-b-0"
                    >
                      <span className="mono-tag mt-1 text-clay">{String(i + 1).padStart(2, "0")}</span>
                      <div className="flex-1">
                        <p className="text-[0.875rem] font-medium text-ink">{p.shop}</p>
                        <p className="mt-0.5 text-[0.75rem] text-ink-mute">
                          {p.shopCode} · {p.window} · {p.sacks || "—"} sacks expected
                        </p>
                      </div>
                      <Pill tone="lime">{p.status}</Pill>
                    </li>
                  ))}
                  <li className="flex items-start gap-4 px-5 py-4">
                    <span className="mono-tag mt-1 text-clay">04</span>
                    <div className="flex-1">
                      <p className="text-[0.875rem] font-medium text-ink">
                        The Cutting Room
                      </p>
                      <p className="mt-0.5 text-[0.75rem] text-ink-mute">
                        HB-003 · 11 AM–12 NN · 2 sacks expected
                      </p>
                    </div>
                    <Pill tone="lime">Scheduled</Pill>
                  </li>
                </ol>
                <div className="border-t border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
                  <p className="mono-tag text-ink-mute">
                    NO GIS ROUTING · ORDERED BY TIME WINDOW, THEN BARANGAY
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* batch */}
      <section id="batch" className="section scroll-mt-24">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="01.5"
                label="Batch & curing"
                title={
                  <>
                    Forty-five days
                    <br />
                    of <em>evidence</em>.
                  </>
                }
                lede="A batch is a chain of custody. Hair from two shops, a versioned recipe, a daily log, and a lab result that either passes or does not."
              />
              <div className="mt-8 flex flex-wrap gap-2">
                <Pill tone="moss">Recipe v3.2</Pill>
                <Pill tone="clay">Hair 40 / carbon 35 / greens 25</Pill>
                <Pill tone="mute">Batch 2512</Pill>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <ol className="relative border-l border-[var(--line)] pl-6">
                {[
                  ["Day 0", "Preparing", "24.5 kg hair weighed in, deducted from stock."],
                  ["Day 1–14", "Composting", "Pile reaches 58–62 °C. Turned on days 3, 7 and 11."],
                  ["Day 15–42", "Curing", "Temperature falls below 42 °C. Moisture tracked to 24%."],
                  ["Day 43", "Sampling", "Sample drawn and sent to Central Luzon Soil Laboratory."],
                  ["Day 45", "Approval", "Admin signs off after lab review. Batch 2512 released."],
                ].map(([day, stage, note], i) => (
                  <li key={day} className="relative pb-7 last:pb-0">
                    <span
                      className="absolute -left-[27px] top-1.5 size-2.5 rounded-full border-2 border-paper"
                      style={{ background: i === 4 ? "var(--lime)" : "var(--moss)" }}
                      aria-hidden
                    />
                    <p className="mono-tag text-ink-mute">{day}</p>
                    <p className="mt-1 text-[0.9375rem] font-medium text-ink">{stage}</p>
                    <p className="mt-1 max-w-[46ch] text-[0.8125rem] leading-[1.65] text-ink-soft">
                      {note}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* roles */}
      <section className="border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <Reveal>
            <SectionHead
              index="01.6"
              label="Access"
              title={
                <>
                  Four roles,
                  <br />
                  no <em>supplier</em> login.
                </>
              }
              lede="The supplier role was deleted in the revised design. Shops get a code on a sack and, optionally, a read-only link — not an account."
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    {["Role", "Shop registration", "Collection", "Batches", "Machine", "Lab"].map(
                      (h) => (
                        <th key={h} className="mono-tag py-3 pr-6 font-normal uppercase text-ink-mute">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r) => (
                    <tr
                      key={r.role}
                      className="border-b border-[var(--line)] transition-colors last:border-b-0 hover:bg-[var(--paper-sunk)]"
                    >
                      <td className="py-4 pr-6 text-[0.875rem] font-medium text-ink">{r.role}</td>
                      <td className="py-4 pr-6 text-[0.8125rem] text-ink-soft">{r.shop}</td>
                      <td className="py-4 pr-6 text-[0.8125rem] text-ink-soft">{r.col}</td>
                      <td className="py-4 pr-6 text-[0.8125rem] text-ink-soft">{r.batch}</td>
                      <td className="py-4 pr-6 text-[0.8125rem] text-ink-soft">{r.machine}</td>
                      <td className="py-4 pr-6 text-[0.8125rem] text-ink-soft">{r.lab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* open items */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="01.7"
                label="Still open"
                title={
                  <>
                    What we have
                    <br />
                    not <em>settled</em>.
                  </>
                }
                lede="These are unresolved in the research. They are listed in the product, not hidden behind a confident sentence."
              />
            </Reveal>
            <div>
              {openItems.map((item, i) => (
                <Reveal key={item} delay={i * 60}>
                  <div className="flex gap-4 border-t border-[var(--line)] py-4 last:border-b">
                    <span className="mono-tag pt-0.5 text-clay">Q{i + 1}</span>
                    <p className="text-[0.875rem] leading-[1.7] text-ink-soft">{item}</p>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={320}>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  <Link href="/impact" className="btn btn-sm">
                    See what is measured
                    <ArrowRight size={14} />
                  </Link>
                  <Link href="/partner" className="btn btn-ghost btn-sm">
                    Partner a shop
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
