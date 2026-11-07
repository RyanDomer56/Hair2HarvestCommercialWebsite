"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { MachineFrame } from "@/components/site/machine-frame";
import { CompostingDrum } from "@/components/site/composting-drum";
import { SectionHead, Pill } from "@/components/site/ui-bits";
import { shops, overviewStats } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

/* Each step has a plain explanation for shop owners and a small technical
   note for researchers or project evaluators. */
const steps = [
  { n: "01", nameKey: "sys.step1.name", simpleKey: "sys.step1.simple" },
  { n: "02", nameKey: "sys.step2.name", simpleKey: "sys.step2.simple" },
  { n: "03", nameKey: "sys.step3.name", simpleKey: "sys.step3.simple" },
  { n: "04", nameKey: "sys.step4.name", simpleKey: "sys.step4.simple" },
  { n: "05", nameKey: "sys.step5.name", simpleKey: "sys.step5.simple" },
];

const grades = [
  { nameKey: "sys.grade.clean.name", tone: "moss" as const, defKey: "sys.grade.clean.def", actionKey: "sys.grade.clean.action" },
  { nameKey: "sys.grade.minor.name", tone: "clay" as const, defKey: "sys.grade.minor.def", actionKey: "sys.grade.minor.action" },
  { nameKey: "sys.grade.notusable.name", tone: "rust" as const, defKey: "sys.grade.notusable.def", actionKey: "sys.grade.notusable.action" },
];

export default function SystemView() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        index="01"
        label={t("sys.meta.label")}
        title={
          <>
            {t("sys.hero.title1")}
            <br />
            {t("sys.hero.title2")} <em className="text-moss">{t("sys.hero.title3")}</em>
          </>
        }
        lede={t("sys.hero.lede")}
        cta={{ label: t("cta.joinShops"), href: "/partner" }}
        meta={[
          { k: t("sys.meta.steps"), v: "5" },
          { k: t("sys.meta.shops"), v: String(shops.length) },
          { k: t("sys.meta.hair"), v: `${overviewStats.totalKg.toFixed(1)} kg` },
          { k: t("sys.meta.cost"), v: t("common.free") },
        ]}
      />

      {/* -------------------------------------------------- the five steps */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="01.1"
              label={t("sys.steps.label")}
              title={
                <>
                  {t("sys.steps.title1")}
                  <br />
                  {t("sys.steps.title2")} <em className="text-moss">{t("sys.steps.title3")}</em>
                </>
              }
              lede={t("sys.steps.lede")}
            />
          </Reveal>

          <div className="mt-12 space-y-px bg-[var(--line)]">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 60} className="bg-paper">
                <article className="grid gap-6 bg-paper p-6 lg:grid-cols-[76px_minmax(0,1fr)] lg:gap-10 lg:p-8">
                  <div>
                    <p className="font-display font-semibold text-[2rem] leading-none text-clay">{s.n}</p>
                  </div>
                  <div>
                    <h3 className="text-[1.125rem] font-medium tracking-[-0.02em] text-ink">
                      {t(s.nameKey)}
                    </h3>
                    <p className="mt-2.5 max-w-[62ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                      {t(s.simpleKey)}
                    </p>
                    <div className="mt-5 rounded-[3px] border border-[var(--line)] bg-[var(--paper-sunk)] px-4 py-3">
                      <p className="mono-tag uppercase text-ink-mute">{t("sys.forResearchers")}</p>
                      <p className="mt-1.5 max-w-[68ch] text-[0.8125rem] leading-[1.65] text-ink-soft">
                        {t(`research.${s.n}`)}
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
                label={t("sys.grading.label")}
                title={
                  <>
                    {t("sys.grading.title1")}
                    <br />
                    {t("sys.grading.title2")} <em className="text-moss">{t("sys.grading.title3")}</em>
                  </>
                }
                lede={t("sys.grading.lede")}
              />
            </Reveal>
            <div className="space-y-px bg-[var(--line)]">
              {grades.map((g, i) => (
                <Reveal key={g.nameKey} delay={i * 70} className="bg-[var(--paper-raised)]">
                  <div className="bg-[var(--paper-raised)] p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Pill tone={g.tone}>{t(g.nameKey)}</Pill>
                    </div>
                    <p className="mt-4 text-[0.9375rem] text-ink">{t(g.defKey)}</p>
                    <p className="mt-1.5 text-[0.8125rem] leading-[1.65] text-ink-soft">{t(g.actionKey)}</p>
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
                label={t("sys.privacy.label")}
                title={
                  <>
                    {t("sys.privacy.title1")}
                    <br />
                    {t("sys.privacy.title2")} <em className="text-moss">{t("sys.privacy.title3")}</em>
                  </>
                }
                lede={t("sys.privacy.lede")}
              />
              <p className="mt-6 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                {t("sys.privacy.note")}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <SectionHead
                index="01.4"
                label={t("sys.batch.label")}
                title={
                  <>
                    {t("sys.batch.title1")}
                    <br />
                    {t("sys.batch.title2")} <em className="text-moss">{t("sys.batch.title3")}</em>
                  </>
                }
                lede={t("sys.batch.lede")}
              />
              <div className="mt-6 rounded-[3px] border border-[var(--line)] bg-[var(--paper-sunk)] px-4 py-3">
                <p className="mono-tag uppercase text-ink-mute">{t("sys.forResearchers")}</p>
                <p className="mt-1.5 text-[0.8125rem] leading-[1.65] text-ink-soft">
                  {t("sys.batch.note")}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Pill tone="moss">{t("sys.batch.labChecked")}</Pill>
                <Pill tone="mute">{t("sys.batch.aboutSixWeeks")}</Pill>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- 3D prototype */}
      <section id="machine" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-sunk)]">
        <div className="shell section">
          <Reveal>
            <SectionHead
              index="01.5"
              label={t("sys.machine.label")}
              title={
                <>
                  {t("sys.machine.title1")}
                  <br />
                  {t("sys.machine.title2")} <em className="text-moss">{t("sys.machine.title3")}</em>
                </>
              }
              lede={t("sys.machine.lede")}
            />
          </Reveal>
          <Reveal delay={100}>
            <MachineFrame>
              <CompostingDrum />
            </MachineFrame>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-5 rounded-[3px] border border-[var(--line)] bg-paper px-4 py-3">
              <p className="mono-tag uppercase text-ink-mute">{t("sys.forResearchers")}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-[1.65] text-ink-soft">
                {t("sys.machine.note")}
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
                label={t("sys.cta.label")}
                title={
                  <>
                    {t("sys.cta.title1")}
                    <br />
                    {t("sys.cta.title2")} <em className="text-moss">{t("sys.cta.title3")}</em>
                  </>
                }
                lede={t("sys.cta.lede")}
              />
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/partner" className="btn">
                  {t("cta.joinShops")}
                  <ArrowUpRight size={15} />
                </Link>
                <Link href="/network" className="btn btn-ghost">
                  {t("cta.seeShops")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
