import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { AreaChart } from "@/components/site/area-chart";
import { SectionHead, SpecRow, Stat, Pill } from "@/components/site/ui-bits";
import { collectionSeries, gradeMix, labResults, batches } from "@/lib/data";

export const metadata: Metadata = {
  title: "Evidence",
  description:
    "Ten weeks of weighed pickups, four laboratory reports and two curing batches — the measurement trail behind Hair2Harvest compost.",
};

const experiments = [
  { crop: "Pechay", treatment: "Hair compost 30%", control: "Commercial organic", height: "+18%", stage: "Week 6 of 8" },
  { crop: "Tomato", treatment: "Hair compost 20%", control: "No amendment", height: "+11%", stage: "Week 4 of 8" },
  { crop: "Kangkong", treatment: "Hair compost 40%", control: "Commercial organic", height: "+7%", stage: "Week 7 of 8" },
  { crop: "Pechay", treatment: "Hair compost 10%", control: "No amendment", height: "+3%", stage: "Week 2 of 8" },
];

export default function ImpactPage() {
  const total = collectionSeries.reduce((a, d) => a + d.kg, 0);

  return (
    <>
      <PageHero
        index="04"
        label="Evidence"
        title={
          <>
            Measured,
            <br />
            not <em>claimed</em>.
          </>
        }
        lede="Every number on this page comes from a scale, a thermometer or a laboratory report. Where the evidence is thin, the page says so instead of rounding up."
        meta={[
          { k: "Weighed pickups", v: "41" },
          { k: "Net collected", v: `${total.toFixed(1)} kg` },
          { k: "Lab reports", v: String(labResults.length) },
          { k: "Batches cured", v: "2" },
        ]}
      />

      {/* collection */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="04.1"
                label="Collection"
                title={
                  <>
                    Ten weeks
                    <br />
                    on the <em>scale</em>.
                  </>
                }
                lede="Net kilograms, gross minus a standard 0.18 kg sack tare. Week 36 is the first full week with four enrolled shops; week 45 is the last complete week before this page was written."
              />
              <div className="mt-8 border-t border-[var(--line)]">
                <SpecRow label="First week" value="18.4 kg" hint="Wk 36 · 4 shops" />
                <SpecRow label="Last week" value="44.6 kg" hint="Wk 45 · 4 shops, 2 candidates" />
                <SpecRow label="Growth" value="+142 %" />
                <SpecRow label="Average per pickup" value="6.94 kg" hint="n = 41" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="mono-tag uppercase text-ink-mute">Net kilograms per week</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="h-0.5 w-4 bg-moss" aria-hidden />
                      <span className="mono-tag text-ink-mute">COLLECTED</span>
                    </span>
                  </div>
                </div>
                <AreaChart
                  data={collectionSeries.map((d) => ({ label: d.label, value: d.kg }))}
                  height={260}
                  className="mt-6"
                />
                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--line)] pt-5">
                  <Stat value="62" unit="%" label="Clean" note="of 41 pickups" />
                  <Stat value="27" unit="%" label="Minor" note="batched with a note" />
                  <Stat value="11" unit="%" label="Mixed" note="held, never batched" />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="mt-10 flex h-2.5 w-full overflow-hidden rounded-full" aria-hidden>
              {gradeMix.map((g) => (
                <span
                  key={g.label}
                  style={{
                    width: `${g.value}%`,
                    background:
                      g.tone === "moss" ? "var(--moss)" : g.tone === "clay" ? "var(--clay)" : "var(--rust)",
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {gradeMix.map((g) => (
                <span key={g.label} className="mono-tag text-ink-mute">
                  {g.label.toUpperCase()} · {g.value}%
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* lab */}
      <section className="border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHead
                index="04.2"
                label="Laboratory"
                title={
                  <>
                    What the lab
                    <br />
                    <em>returned</em>.
                  </>
                }
              />
              <p className="max-w-[38ch] text-[0.8125rem] leading-[1.65] text-ink-soft sm:text-right">
                External laboratory, dry basis unless noted. Re-tests are stored as new versions —
                nothing is overwritten.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-9 overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    {["Report", "Batch", "N %", "P %", "K %", "pH", "Moisture", "Maturity", "Pathogens", "Verdict"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`mono-tag py-3 pr-5 font-normal uppercase text-ink-mute ${
                            i > 1 ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {labResults.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[var(--line)] transition-colors last:border-b-0 hover:bg-paper"
                    >
                      <td className="py-4 pr-5">
                        <p className="mono-tag text-clay">{r.id}</p>
                        <p className="mt-1 text-[0.6875rem] text-ink-mute">{r.date}</p>
                      </td>
                      <td className="py-4 pr-5 text-[0.8125rem] text-ink">{r.batch}</td>
                      <td className="num py-4 pr-5 text-right text-[0.8125rem] text-ink">{r.n.toFixed(2)}</td>
                      <td className="num py-4 pr-5 text-right text-[0.8125rem] text-ink">{r.p.toFixed(2)}</td>
                      <td className="num py-4 pr-5 text-right text-[0.8125rem] text-ink">{r.k.toFixed(2)}</td>
                      <td className="num py-4 pr-5 text-right text-[0.8125rem] text-ink">{r.ph.toFixed(1)}</td>
                      <td className="num py-4 pr-5 text-right text-[0.8125rem] text-ink">{r.moisture}%</td>
                      <td className="py-4 pr-5 text-right text-[0.8125rem] text-ink-soft">{r.maturity}</td>
                      <td className="py-4 pr-5 text-right text-[0.8125rem] text-ink-soft">{r.pathogens}</td>
                      <td className="py-4 text-right">
                        <Pill
                          tone={r.verdict === "Pass" ? "moss" : r.verdict === "Review" ? "clay" : "rust"}
                        >
                          {r.verdict}
                        </Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p className="mono-tag mt-5 text-ink-mute">
              SOURCE: CENTRAL LUZON SOIL LABORATORY · BUREAU OF SOILS (RE-TEST) · METHOD: KJELDAHL,
              BRAY-2, AMMONIUM ACETATE
            </p>
          </Reveal>
        </div>
      </section>

      {/* batches */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="04.3"
                label="Batches"
                title={
                  <>
                    Mass in,
                    <br />
                    mass <em>out</em>.
                  </>
                }
                lede="Composting is a mass-reduction process. The ratio between input hair and cured output is the honest efficiency number — not a percentage of waste diverted."
              />
              <div className="mt-8 border-t border-[var(--line)]">
                <SpecRow label="Batch 2512 in" value="22.0 kg" hint="HB-001 · recipe v3.1" />
                <SpecRow label="Batch 2512 out" value="12.9 kg" hint="45 days curing" />
                <SpecRow label="Reduction" value="41.4 %" />
                <SpecRow label="Batch 2601 out" value="15.2 kg" hint="still curing, day 19" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-px bg-[var(--line)]">
                {batches.map((b) => {
                  const reduction = ((b.inputKg - b.currentKg) / b.inputKg) * 100;
                  return (
                    <div key={b.id} className="bg-paper p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="mono-tag text-clay">{b.id}</span>
                          <Pill
                            tone={
                              b.stage === "Approved"
                                ? "moss"
                                : b.stage === "Curing"
                                  ? "lime"
                                  : "mute"
                            }
                          >
                            {b.stage}
                          </Pill>
                        </div>
                        <span className="mono-tag text-ink-mute">DAY {b.days}</span>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="num text-[1.25rem] font-medium text-ink">
                            {b.inputKg.toFixed(1)}
                            <span className="ml-1 text-[0.75rem] font-normal text-ink-mute">kg in</span>
                          </p>
                          <p className="mt-1 text-[0.75rem] text-ink-mute">
                            {b.shopCodes.join(" · ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="num text-[1.25rem] font-medium text-ink">
                            {b.currentKg.toFixed(1)}
                            <span className="ml-1 text-[0.75rem] font-normal text-ink-mute">kg now</span>
                          </p>
                          <p className="mono-tag mt-1 text-moss">
                            −{reduction.toFixed(0)}% MASS
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[var(--paper-sunk)]">
                        <div
                          className="h-full rounded-full bg-moss"
                          style={{ width: `${Math.min(100, reduction)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* experiments */}
      <section className="border-y border-[var(--line)] bg-[var(--paper-sunk)]">
        <div className="shell section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="04.4"
                label="Planting trials"
                title={
                  <>
                    Does it
                    <br />
                    actually <em>grow</em>?
                  </>
                }
                lede="Four supervised trials, each with a hair-compost treatment and a paired control. Height is measured weekly; nothing here is a yield claim yet."
              />
              <p className="mono-tag mt-6 text-clay">
                PRELIMINARY · NOT PEER REVIEWED · n = 1 PER TREATMENT
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print overflow-hidden">
                <div className="hidden grid-cols-[1fr_1fr_1fr_70px] gap-4 border-b border-[var(--line)] px-5 py-3 sm:grid">
                  {["Crop", "Treatment", "Control", "Δ height"].map((h, i) => (
                    <span
                      key={h}
                      className={`mono-tag uppercase text-ink-mute ${i === 3 ? "text-right" : ""}`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {experiments.map((e) => (
                  <div
                    key={`${e.crop}-${e.treatment}`}
                    className="grid grid-cols-2 gap-x-4 gap-y-1 border-b border-[var(--line)] px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_1fr_1fr_70px] sm:items-center"
                  >
                    <p className="text-[0.875rem] font-medium text-ink">
                      {e.crop}
                      <span className="mt-0.5 block text-[0.6875rem] font-normal text-ink-mute sm:hidden">
                        {e.stage}
                      </span>
                    </p>
                    <p className="text-[0.8125rem] text-ink-soft">{e.treatment}</p>
                    <p className="text-[0.8125rem] text-ink-soft">{e.control}</p>
                    <p className="num text-right text-[0.875rem] font-medium text-moss">{e.height}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
                  <span className="mono-tag text-ink-mute">4 ACTIVE TRIALS · 2 COMPLETED</span>
                  <span className="mono-tag text-moss">68% COMPLETE</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* method */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="04.5"
                label="Method"
                title={
                  <>
                    How these
                    <br />
                    numbers were <em>made</em>.
                  </>
                }
              />
            </Reveal>
            <Reveal delay={80}>
              <div className="space-y-5">
                {[
                  [
                    "Weight",
                    "Every pickup is weighed on a calibrated hanging scale. We subtract the weight of the empty sack (0.18 kg), so the number we record is the hair alone.",
                  ],
                  [
                    "Grade",
                    "Assigned at the door by the collector against a three-level rubric. Grades are not re-scored later, so the record reflects what was actually seen.",
                  ],
                  [
                    "Curing",
                    "Temperature and moisture logged on turning days. A batch is mature when it stops reheating and moisture stabilises below 30%.",
                  ],
                  [
                    "Limits",
                    "One pilot barangay, four enrolled shops, ten weeks. The sample is small and the trials are unreplicated. This page reports what happened, not what will happen.",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-[var(--line)] pt-4">
                    <p className="mono-tag uppercase text-clay">{k}</p>
                    <p className="mt-2 text-[0.875rem] leading-[1.7] text-ink-soft">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <Link href="/system" className="btn btn-ghost btn-sm">
                  Read the specification
                  <ArrowRight size={14} />
                </Link>
                <Link href="/network" className="btn btn-sm">
                  See the shop network
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
