"use client";

import Link from "next/link";
import { ArrowUpRight, Leaf, Recycle, ShieldCheck, Users } from "lucide-react";
import { PageHero, Prose } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { useLanguage } from "@/lib/i18n";

/* The 13-member roster, spelled exactly as supplied. Name + main
   responsibility only — nothing else (QA #19). Each person appears once. */
const groups = [
  {
    title: "Project Management",
    titleKey: "about.team.projectManagement",
    members: [
      { name: "Mikylla Tulba", role: "Project manager", roleKey: "about.team.pm" },
      { name: "Sherwin G. Malenab", role: "Assistant project manager", roleKey: "about.team.apm" },
      { name: "Lairene B. Yulo", role: "Secretary", roleKey: "about.team.secretary" },
    ],
  },
  {
    title: "Developers",
    titleKey: "about.team.developers",
    members: [
      { name: "Jundill Mhar C. Reyes", role: "Lead developer", roleKey: "about.team.leadDev" },
      { name: "Ryan C. Domer", role: "Developer", roleKey: "about.team.developer" },
      { name: "Andrew Jeremiah C. Salangsang", role: "Developer", roleKey: "about.team.developer" },
      { name: "Kier Laurence L. Atienza", role: "Developer", roleKey: "about.team.developer" },
      { name: "Liezette C. Aparri", role: "Developer", roleKey: "about.team.developer" },
      { name: "Ermalyn R. Gadon", role: "Developer", roleKey: "about.team.developer" },
    ],
  },
  {
    title: "Documentation",
    titleKey: "about.team.documentation",
    members: [
      { name: "Emilou P. Quimiguing", role: "Documentation lead", roleKey: "about.team.docLead" },
      { name: "Rea Mary T. Mantal", role: "Documentation", roleKey: "about.team.documentationRole" },
      { name: "Rheyven D. Algeria", role: "Documentation", roleKey: "about.team.documentationRole" },
    ],
  },
  {
    title: "Quality Assurance",
    titleKey: "about.team.qualityAssurance",
    members: [{ name: "Ayan Haile C. Canale", role: "Quality assurance", roleKey: "about.team.qa" }],
  },
];

const values = [
  { icon: Recycle, kKey: "about.values.nothingWasted.k", vKey: "about.values.nothingWasted.v" },
  { icon: ShieldCheck, kKey: "about.values.checkWork.k", vKey: "about.values.checkWork.v" },
  { icon: Users, kKey: "about.values.shopFirst.k", vKey: "about.values.shopFirst.v" },
  { icon: Leaf, kKey: "about.values.local.k", vKey: "about.values.local.v" },
];

export default function AboutView() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        index="00"
        label={t("about.meta.label")}
        title={
          <>
            {t("about.hero.title1")}
            <br />
            {t("about.hero.title2")} <em className="text-moss">{t("about.hero.title3")}</em>
          </>
        }
        lede={t("about.hero.lede")}
        meta={[
          { k: t("about.meta.partner"), v: "Brgy. Novaliches Proper" },
          { k: t("about.meta.team"), v: "13 members" },
          { k: t("about.meta.started"), v: "2026" },
          { k: t("about.meta.cost"), v: t("common.free") },
        ]}
      />

      {/* -------------------------------------------------------- story */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="mono-tag text-clay">01</span>
                <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
                <span className="eyebrow">{t("about.story.label")}</span>
              </div>
              <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-ink">
                {t("about.story.title1")}
                <br />
                {t("about.story.title2")} <em className="text-moss">{t("about.story.title3")}</em>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <Prose>
                <p>{t("about.story.p1")}</p>
                <p>{t("about.story.p2")}</p>
                <p>{t("about.story.p3")}</p>
                <p>{t("about.story.p4")}</p>
              </Prose>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- team */}
      <section id="team" className="relative scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono-tag text-clay">02</span>
              <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
              <span className="eyebrow">{t("about.team.label")}</span>
            </div>
            <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-ink">
              {t("about.team.title1")}
              <br />
              <em className="text-moss">{t("about.team.title2")}</em>
            </h2>
            <p className="mt-5 max-w-[52ch] text-[0.875rem] leading-[1.7] text-ink-soft">
              {t("about.team.lede")}
            </p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {groups.map((g, i) => (
              <Reveal key={g.titleKey} delay={i * 60}>
                <div>
                  <p className="mono-tag uppercase text-clay">{t(g.titleKey)}</p>
                  <ul className="mt-4 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
                    {g.members.map((m) => (
                      <li key={`${g.titleKey}-${m.name}`} className="bg-[var(--paper-raised)] px-5 py-4">
                        <p className="text-[0.9375rem] font-medium text-ink">{m.name}</p>
                        <p className="mt-1 text-[0.8125rem] text-ink-soft">{t(m.roleKey)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- values */}
      <section id="values" className="scroll-mt-24 section">
        <div className="shell">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono-tag text-clay">03</span>
              <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
              <span className="eyebrow">{t("about.values.label")}</span>
            </div>
            <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-ink">
              {t("about.values.title1")}
              <br />
              <em className="text-moss">{t("about.values.title2")}</em>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, i) => (
              <Reveal key={item.kKey} delay={i * 70} className="bg-paper">
                <div className="h-full bg-paper p-6">
                  <item.icon size={20} className="text-moss" aria-hidden />
                  <p className="mono-tag mt-5 uppercase text-clay">{t(item.kKey)}</p>
                  <p className="mt-3 text-[0.8125rem] leading-[1.65] text-ink-soft">{t(item.vKey)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- cta */}
      <section className="relative overflow-hidden border-t border-[var(--line)] bg-moss-deep text-paper">
        <div className="shell relative z-10 section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow text-lime">{t("about.cta.label")}</p>
              <h2 className="display mt-6 text-[clamp(2.2rem,5.6vw,4.4rem)] text-paper">
                {t("about.cta.title1")}
                <br />
                {t("about.cta.title2")} <em className="text-lime">{t("about.cta.title3")}</em>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-[42ch] text-[0.9375rem] leading-[1.7] text-paper/75">
                {t("about.cta.para")}
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/partner" className="btn btn-lime">
                  {t("cta.joinShops")}
                  <ArrowUpRight size={15} />
                </Link>
                <Link href="/network" className="btn btn-ghost-paper">
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
