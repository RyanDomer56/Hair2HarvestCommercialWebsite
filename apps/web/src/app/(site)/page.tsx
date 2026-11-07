"use client";

import Link from "next/link";
import { ArrowUpRight, ClipboardList, Recycle, Store, Truck, Users } from "lucide-react";
import { HairWeave } from "@/components/site/hair-weave";
import { Ticker } from "@/components/site/ticker";
import { Reveal } from "@/components/site/reveal";
import { MachineFrame } from "@/components/site/machine-frame";
import { CompostingDrum } from "@/components/site/composting-drum";
import { SectionHead, Stat, Pill } from "@/components/site/ui-bits";
import { shops, overviewStats } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useLanguage();
  const enrolled = shops.filter((s) => s.status === "Enrolled");
  const preview = shops.filter((s) => s.status === "Enrolled" || s.status === "Candidate").slice(0, 5);

  /* The four questions a shop owner asks first — answered in plain words. */
  const faqs = [
    { qKey: "home.faq.q1", aKey: "home.faq.a1" },
    { qKey: "home.faq.q2", aKey: "home.faq.a2" },
    { qKey: "home.faq.q3", aKey: "home.faq.a3" },
    { qKey: "home.faq.q4", aKey: "home.faq.a4" },
  ];

  const navCards = [
    { href: "/system", labelKey: "home.navCards.howWork.label", descKey: "home.navCards.howWork.desc", icon: Recycle },
    { href: "/partner", labelKey: "home.navCards.whyPartner.label", descKey: "home.navCards.whyPartner.desc", icon: Users },
    { href: "/network", labelKey: "home.navCards.shopPartners.label", descKey: "home.navCards.shopPartners.desc", icon: Store },
    { href: "/system", labelKey: "home.navCards.collection.label", descKey: "home.navCards.collection.desc", icon: Truck },
    { href: "/partner", labelKey: "home.navCards.register.label", descKey: "home.navCards.register.desc", icon: ClipboardList },
  ];

  /* The machine, in five short steps. */
  const drumSteps = [
    { n: "01", titleKey: "home.drumSteps.collect.title", bodyKey: "home.drumSteps.collect.body" },
    { n: "02", titleKey: "home.drumSteps.check.title", bodyKey: "home.drumSteps.check.body" },
    { n: "03", titleKey: "home.drumSteps.mix.title", bodyKey: "home.drumSteps.mix.body" },
    { n: "04", titleKey: "home.drumSteps.cure.title", bodyKey: "home.drumSteps.cure.body" },
    { n: "05", titleKey: "home.drumSteps.lab.title", bodyKey: "home.drumSteps.lab.body" },
  ];

  /* What happens when you join? */
  const joinSteps = [
    { n: "01", titleKey: "home.join.step1.title", bodyKey: "home.join.step1.body" },
    { n: "02", titleKey: "home.join.step2.title", bodyKey: "home.join.step2.body" },
    { n: "03", titleKey: "home.join.step3.title", bodyKey: "home.join.step3.body" },
    { n: "04", titleKey: "home.join.step4.title", bodyKey: "home.join.step4.body" },
    { n: "05", titleKey: "home.join.step5.title", bodyKey: "home.join.step5.body" },
  ];

  return (
    <>
      {/* ------------------------------------------- introduction (always visible) */}
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
                    <span className="eyebrow text-moss">{t("home.hero.eyebrow")}</span>
                  </span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="display mt-7 text-[clamp(2.4rem,6.2vw,5.4rem)] text-ink">
                  {t("home.hero.title1")}
                  <br />
                  {t("home.hero.title2")} <em className="text-moss">{t("home.hero.title3")}</em>
                  <br />
                  {t("home.hero.title4")}
                </h1>
              </Reveal>
            </div>

            <Reveal delay={160} className="lg:pb-3">
              <p className="text-[0.9375rem] leading-[1.7] text-ink-soft">
                <strong className="font-medium text-ink">{t("home.hero.para1a")}</strong>{" "}
                {t("home.hero.para1b")}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Link href="/partner" className="btn btn-sm">
                  {t("cta.joinShops")}
                  <ArrowUpRight size={14} />
                </Link>
                <Link href="/system" className="btn btn-ghost btn-sm">
                  {t("nav.how")}
                </Link>
              </div>
              <p className="text-[0.8125rem] leading-[1.7] text-ink-soft">
                <strong className="font-medium text-ink">{t("home.hero.capstone1")}</strong>{" "}
                {t("home.hero.capstone2")}
              </p>
              <p className="mono-tag mt-5 text-ink-mute">
                {t("home.hero.free1")}
                <br />
                {t("home.hero.free2")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={220} className="mt-12 lg:mt-14">
            <div className="grid grid-cols-3 gap-x-6 gap-y-5 border-t border-[var(--line)] pt-6">
              <Stat value={String(shops.length)} label={t("home.stat.shops")} note={t("footer.barangayShort")} />
              <Stat
                value={overviewStats.totalKg.toFixed(1)}
                unit="kg"
                label={t("home.stat.hair")}
                note={t("home.stat.hairNote")}
              />
              <Stat value="0" label={t("home.stat.passwords")} note={t("home.stat.passwordsNote")} />
            </div>
          </Reveal>
        </div>
      </section>

      <Ticker />

      {/* ------------------------------- how it works (machine / drum, top) */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="00"
              label={t("home.section.how.label")}
              title={
                <>
                  {t("home.section.how.title1")} <em className="text-moss">{t("home.section.how.title3")}</em>
                  <br />
                  {t("home.section.how.title2")} {t("home.section.how.title3")}
                </>
              }
              lede={t("home.section.how.lede")}
            />
          </Reveal>

          <Reveal delay={100}>
            <MachineFrame>
              <CompostingDrum />
            </MachineFrame>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-10 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-5">
              {drumSteps.map((s) => (
                <div key={s.n} className="bg-paper p-5">
                  <span className="mono-tag text-clay">{s.n}</span>
                  <h3 className="mt-3 text-[0.9375rem] font-medium tracking-[-0.01em] text-ink">
                    {t(s.titleKey)}
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-ink-soft">{t(s.bodyKey)}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link href="/system" className="btn btn-sm">
                {t("cta.seeFullProcess")}
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- where to go */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="00"
              label={t("home.section.where.label")}
              title={<em className="text-moss">{t("home.section.where.title")}</em>}
              lede={t("home.section.where.lede")}
            />
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {navCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.labelKey} delay={i * 60}>
                  <Link
                    href={c.href}
                    className="group flex h-full flex-col rounded-[4px] border border-[var(--line)] bg-paper p-5 transition-colors hover:border-moss/40 hover:bg-[color-mix(in_oklab,var(--moss)_6%,transparent)]"
                  >
                    <Icon size={20} className="text-moss" aria-hidden />
                    <p className="mt-4 text-[0.9375rem] font-medium tracking-[-0.01em] text-ink">
                      {t(c.labelKey)}
                    </p>
                    <p className="mt-1.5 text-[0.75rem] leading-snug text-ink-soft">{t(c.descKey)}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[0.6875rem] font-medium text-moss">
                      {t("common.open")}
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

      {/* ---------------------------------- what happens when you join */}
      <section className="relative overflow-hidden border-y border-[var(--line)] bg-moss-deep text-paper">
        <div className="shell section">
          <Reveal>
            <p className="eyebrow text-lime">{t("home.join.label")}</p>
            <h2 className="display mt-5 max-w-[30ch] text-[clamp(1.9rem,4.2vw,3.4rem)] text-paper">
              {t("home.join.title")}
            </h2>
            <p className="mt-5 max-w-[58ch] text-[0.9375rem] leading-[1.7] text-paper/75">
              {t("home.join.lede")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px border border-paper/12 bg-paper/12 sm:grid-cols-2 lg:grid-cols-5">
            {joinSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70} className="bg-moss-deep">
                <div className="h-full bg-moss-deep p-5">
                  <span className="mono-tag text-lime">{s.n}</span>
                  <h3 className="mt-5 text-[0.9375rem] font-medium tracking-[-0.01em] text-paper">
                    {t(s.titleKey)}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-[1.65] text-paper/70">{t(s.bodyKey)}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-paper/12 pt-8">
              <p className="max-w-[52ch] text-[0.9375rem] leading-[1.7] text-paper/80">
                {t("home.join.note")}
              </p>
              <Link href="/partner" className="btn btn-lime">
                {t("cta.yesCountMeIn")}
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- four quick answers */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="01"
              label={t("home.faq.label")}
              title={<em className="text-moss">{t("home.faq.title")}</em>}
              lede={t("home.faq.lede")}
            />
          </Reveal>

          <div className="mt-10 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {faqs.map((f, i) => (
              <Reveal key={f.qKey} delay={i * 70} className="bg-paper">
                <div className="h-full bg-paper p-6">
                  <div className="flex items-start gap-4">
                    <span className="mono-tag pt-1 text-clay">0{i + 1}</span>
                    <div>
                      <h3 className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                        {t(f.qKey)}
                      </h3>
                      <p className="mt-2.5 max-w-[52ch] text-[0.875rem] leading-[1.7] text-ink-soft">
                        {t(f.aKey)}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- network */}
      <section className="border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="02"
                label={t("home.network.label")}
                title={
                  <>
                    {t("home.network.title")}
                  </>
                }
                lede={t("home.network.lede")}
              />
              <Link
                href="/network"
                className="group mt-7 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-moss"
              >
                {t("home.network.seeAll")}
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print overflow-hidden">
                <div className="hidden grid-cols-[1fr_1fr_96px] gap-4 border-b border-[var(--line)] px-5 py-3 sm:grid">
                  {[t("home.network.header.shop"), t("home.network.header.barangay"), t("home.network.header.status")].map((h, i) => (
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
                          {t(`status.${s.status}`)}
                        </Pill>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
                  <span className="mono-tag text-ink-mute">
                    {t("common.showing")} {preview.length} {t("common.of")} {shops.length}
                  </span>
                  <span className="mono-tag text-moss">
                    {enrolled.length} {t("home.network.enrolled")}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow">{t("home.cta.label")}</p>
              <h2 className="display mt-6 text-[clamp(2.2rem,5.6vw,4.6rem)] text-ink">
                {t("home.cta.title1")}
                <br />
                {t("home.cta.title2")} <em className="text-moss">{t("home.cta.title3")}</em>
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="max-w-[42ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                {t("home.cta.para")}
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/partner" className="btn">
                  {t("cta.joinShops")}
                  <ArrowUpRight size={15} />
                </Link>
                <Link href="/network" className="btn btn-ghost">
                  {t("cta.seeShops")}
                </Link>
              </div>
              <p className="mono-tag mt-6 text-ink-mute">{t("home.cta.questions")}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
