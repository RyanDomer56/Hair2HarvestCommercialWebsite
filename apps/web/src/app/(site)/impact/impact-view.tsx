"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, SpecRow, Pill } from "@/components/site/ui-bits";
import { collectionSeries, gradeMix, labResults, batches, overviewStats } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

const experiments = [
  { crop: "Pechay", treatment: "Hair compost 30%", control: "Commercial organic", height: "+18%", stage: "Week 6 of 8" },
  { crop: "Tomato", treatment: "Hair compost 20%", control: "No amendment", height: "+11%", stage: "Week 4 of 8" },
  { crop: "Kangkong", treatment: "Hair compost 40%", control: "Commercial organic", height: "+7%", stage: "Week 7 of 8" },
  { crop: "Pechay", treatment: "Hair compost 10%", control: "No amendment", height: "+3%", stage: "Week 2 of 8" },
];

// Directional badge: green up / red down, reflecting the sign of the delta.
function Delta({ value, tone }: { value: string; tone?: "moss" | "rust" }) {
  const num = parseFloat(value.replace(/[+−%]/g, ""));
  const up = num >= 0;
  const color = tone ?? (up ? "text-moss" : "text-rust");
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-1", color)}>
      <Icon size={14} strokeWidth={2.5} aria-hidden />
      {value}
    </span>
  );
}

export default function ImpactView() {
  const { t } = useLanguage();
  // QA #33: the hair-collected figure must match the homepage and network pages.
  const totalKg = overviewStats.totalKg;

  return (
    <>
      <PageHero
        index="04"
        label={t("impact.meta.label")}
        title={
          <>
            {t("impact.hero.title1")}
            <br />
            {t("impact.hero.title2")} <em>{t("impact.hero.title3")}</em>
          </>
        }
        lede={t("impact.hero.lede")}
        meta={[
          { k: t("impact.meta.weighed"), v: "41" },
          { k: t("impact.meta.net"), v: `${totalKg.toFixed(1)} kg` },
          { k: t("impact.meta.lab"), v: String(labResults.length) },
          { k: t("impact.meta.batches"), v: "2" },
        ]}
      />

      {/* collection */}
      <section id="collection" className="scroll-mt-24 section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="04.1"
              label={t("impact.collection.label")}
              title={
                <>
                  {t("impact.collection.title1")}
                  <br />
                  {t("impact.collection.title2")} <em>{t("impact.collection.title3")}</em>
                </>
              }
              lede={t("impact.collection.lede")}
            />
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 border-t border-[var(--line)]">
              <SpecRow label={t("impact.collection.firstWeek")} value="18.4 kg" hint="Wk 36 · 4 shops" />
              <SpecRow label={t("impact.collection.lastWeek")} value="44.6 kg" hint="Wk 45 · 4 shops, 2 candidates" />
              <SpecRow label={t("impact.collection.growth")} value={<Delta value="+142 %" />} />
              <SpecRow label={t("impact.collection.avg")} value="6.94 kg" hint="n = 41" />
            </div>
          </Reveal>

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
                  {t(`grade.${g.label}`).toUpperCase()} · {g.value}%
                </span>
              ))}
            </div>
            {/* QA #30: the heavy week-by-week graph moved to the staff workspace;
                here we keep a simple link to the recorded lab results instead. */}
            <Link
              href="#lab"
              className="mt-7 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-moss"
            >
              {t("impact.collection.viewLab")}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* lab */}
      <section id="lab" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHead
                index="04.2"
                label={t("impact.lab.label")}
                title={
                  <>
                    {t("impact.lab.title1")}
                    <br />
                    <em>{t("impact.lab.title2")}</em>
                  </>
                }
              />
              <p className="max-w-[38ch] text-[0.8125rem] leading-[1.65] text-ink-soft sm:text-right">
                {t("impact.lab.note")}
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-9 overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    {[
                      t("impact.lab.header.report"),
                      t("impact.lab.header.batch"),
                      t("impact.lab.header.n"),
                      t("impact.lab.header.p"),
                      t("impact.lab.header.k"),
                      t("impact.lab.header.ph"),
                      t("impact.lab.header.moisture"),
                      t("impact.lab.header.maturity"),
                      t("impact.lab.header.pathogens"),
                      t("impact.lab.header.verdict"),
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`mono-tag py-3 pr-5 font-normal uppercase text-ink-mute ${
                          i > 1 ? "text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
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
                          {t(`status.${r.verdict}`)}
                        </Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p className="mono-tag mt-5 text-ink-mute">{t("impact.lab.source")}</p>
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
                label={t("impact.batches.label")}
                title={
                  <>
                    {t("impact.batches.title1")}
                    <br />
                    {t("impact.batches.title2")} <em>{t("impact.batches.title3")}</em>
                  </>
                }
                lede={t("impact.batches.lede")}
              />
              <div className="mt-8 border-t border-[var(--line)]">
                <SpecRow label={t("impact.batches.b2512in")} value="22.0 kg" hint="HB-001 · recipe v3.1" />
                <SpecRow label={t("impact.batches.b2512out")} value="12.9 kg" hint="45 days curing" />
                <SpecRow label={t("impact.batches.reduction")} value="41.4 %" />
                <SpecRow label={t("impact.batches.b2601out")} value="15.2 kg" hint="still curing, day 19" />
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
                            {t(`batch.${b.stage}`)}
                          </Pill>
                        </div>
                        <span className="mono-tag text-ink-mute">DAY {b.days}</span>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="num text-[1.25rem] font-medium text-ink">
                            {b.inputKg.toFixed(1)}
                            <span className="ml-1 text-[0.75rem] font-normal text-ink-mute">
                              {t("impact.batches.in")}
                            </span>
                          </p>
                          <p className="mt-1 text-[0.75rem] text-ink-mute">
                            {b.shopCodes.join(" · ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="num text-[1.25rem] font-medium text-ink">
                            {b.currentKg.toFixed(1)}
                            <span className="ml-1 text-[0.75rem] font-normal text-ink-mute">
                              {t("impact.batches.now")}
                            </span>
                          </p>
                          <p className="mono-tag mt-1 inline-flex items-center gap-1 text-moss">
                            <ArrowDownRight size={12} strokeWidth={2.5} aria-hidden />
                            −{reduction.toFixed(0)}% {t("impact.batches.mass")}
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
      <section id="trials" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-sunk)]">
        <div className="shell section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="04.4"
                label={t("impact.trials.label")}
                title={
                  <>
                    {t("impact.trials.title1")}
                    <br />
                    {t("impact.trials.title2")} <em>{t("impact.trials.title3")}</em>
                  </>
                }
                lede={t("impact.trials.lede")}
              />
              <p className="mono-tag mt-6 text-clay">{t("impact.trials.note")}</p>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print overflow-hidden">
                <div className="hidden grid-cols-[1fr_1fr_1fr_70px] gap-4 border-b border-[var(--line)] px-5 py-3 sm:grid">
                  {[t("impact.trials.header.crop"), t("impact.trials.header.treatment"), t("impact.trials.header.control"), t("impact.trials.header.dh")].map((h, i) => (
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
                    <p className="num text-right text-[0.875rem] font-medium">
                      <Delta value={e.height} />
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
                  <span className="mono-tag text-ink-mute">{t("impact.trials.footer1")}</span>
                  <span className="mono-tag text-moss">{t("impact.trials.footer2")}</span>
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
                label={t("impact.method.label")}
                title={
                  <>
                    {t("impact.method.title1")}
                    <br />
                    {t("impact.method.title2")} <em>{t("impact.method.title3")}</em>
                  </>
                }
              />
            </Reveal>
            <Reveal delay={80}>
              <div className="space-y-5">
                {[
                  [t("impact.method.weight"), t("impact.method.weightText")],
                  [t("impact.method.grade"), t("impact.method.gradeText")],
                  [t("impact.method.curing"), t("impact.method.curingText")],
                  [t("impact.method.limits"), t("impact.method.limitsText")],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-[var(--line)] pt-4">
                    <p className="mono-tag uppercase text-clay">{k}</p>
                    <p className="mt-2 text-[0.875rem] leading-[1.7] text-ink-soft">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <Link href="/system" className="btn btn-ghost btn-sm">
                  {t("impact.method.spec")}
                  <ArrowRight size={14} />
                </Link>
                <Link href="/network" className="btn btn-sm">
                  {t("impact.method.seeNetwork")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
