"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowDownRight, Leaf, PackageCheck, Scale, Recycle, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, SpecRow } from "@/components/site/ui-bits";
import { gradeMix, overviewStats } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

const journeySteps = [
  { key: "impact.journey.step1", Icon: PackageCheck },
  { key: "impact.journey.step2", Icon: Scale },
  { key: "impact.journey.step3", Icon: Recycle },
  { key: "impact.journey.step4", Icon: Sprout },
] as const;

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
            {/* The heavy week-by-week graph and raw lab figures live in the
                staff workspace; here we link to the plain-language process. */}
            <Link
              href="#journey"
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

      {/* journey — plain-language process, replaces the old lab table + batch codes */}
      <section id="journey" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <Reveal>
            <SectionHead
              index="04.2"
              label={t("impact.journey.label")}
              title={
                <>
                  {t("impact.journey.title1")}
                  <br />
                  <em>{t("impact.journey.title2")}</em>
                </>
              }
              lede={t("impact.journey.lede")}
            />
          </Reveal>

          <Reveal delay={80}>
            <div className="h2h-rail mt-10" aria-hidden>
              <span className="h2h-rail-dot" />
            </div>
            <div className="mt-1 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
              {journeySteps.map((step, i) => {
                const Icon = step.Icon;
                return (
                  <div key={step.key} className="h-full bg-paper p-6">
                    <span className="flex size-9 items-center justify-center rounded-full border border-moss/40 bg-moss/10 text-moss">
                      <Icon size={16} strokeWidth={2} aria-hidden />
                    </span>
                    <p className="mono-tag mt-5 text-clay">0{i + 1}</p>
                    <h3 className="mt-1 text-[1rem] font-medium tracking-[-0.02em] text-ink">
                      {t(`${step.key}.title`)}
                    </h3>
                    <p className="mt-2 text-[0.8125rem] leading-[1.65] text-ink-soft">
                      {t(`${step.key}.body`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-7 flex items-center gap-2.5 text-[0.8125rem] leading-[1.6] text-ink-soft">
              <Leaf size={15} strokeWidth={2} className="shrink-0 text-moss" aria-hidden />
              {t("impact.journey.note")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* experiments */}
      <section id="trials" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-sunk)]">
        <div className="shell section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="04.3"
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
                index="04.4"
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
