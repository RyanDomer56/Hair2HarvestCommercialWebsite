"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ShopDirectory } from "@/components/site/shop-directory";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, Stat } from "@/components/site/ui-bits";
import { shops, overviewStats } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

export default function NetworkView() {
  const { t } = useLanguage();
  const enrolled = shops.filter((s) => s.status === "Enrolled");
  const totalKg = overviewStats.totalKg;

  return (
    <>
      <PageHero
        index="02"
        label={t("network.meta.label")}
        title={
          <>
            {t("network.hero.title1")}
            <br />
            <em>{t("network.hero.title2")}</em>
          </>
        }
        lede={t("network.hero.lede")}
        cta={{ label: t("cta.joinShops"), href: "/partner" }}
        meta={[
          { k: t("network.meta.joined"), v: String(enrolled.length) },
          { k: t("network.meta.comingSoon"), v: String(shops.filter((s) => s.status === "Candidate").length) },
          { k: t("network.meta.hair"), v: `${totalKg.toFixed(1)} kg` },
          { k: t("network.meta.cost"), v: t("common.free") },
        ]}
      />

      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHead
                index="02.1"
                label={t("network.directory.label")}
                title={
                  <>
                    {t("network.directory.title")}
                  </>
                }
              />
              <p className="max-w-[40ch] text-[0.8125rem] leading-[1.65] text-ink-soft sm:text-right">
                {t("network.directory.note")}
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-8">
            <ShopDirectory />
          </Reveal>
        </div>
      </section>

      <section
        id="rules"
        className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-raised)]"
      >
        <div className="shell section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="02.2"
                label={t("network.pickups.label")}
                title={
                  <>
                    {t("network.pickups.title1")}
                    <br />
                    <em>{t("network.pickups.title2")}</em>
                  </>
                }
                lede={t("network.pickups.lede")}
              />
              <p className="mt-6 max-w-[46ch] text-[0.875rem] leading-[1.7] text-ink-soft">
                {t("network.pickups.private")}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print p-6 sm:p-8">
                <p className="mono-tag uppercase text-ink-mute">{t("network.pickups.whatPrivate")}</p>
                <ul className="mt-5 space-y-4">
                  {[
                    [t("network.pickups.contactPerson"), t("network.pickups.contactPersonDef")],
                    [t("network.pickups.mobile"), t("network.pickups.mobileDef")],
                    [t("network.pickups.days"), t("network.pickups.daysDef")],
                    [t("network.pickups.access"), t("network.pickups.accessDef")],
                  ].map(([k, v], i) => (
                    <li key={k} className="flex gap-4 border-b border-[var(--line)] pb-4 last:border-b-0 last:pb-0">
                      <span className="mono-tag mt-1 text-clay">0{i + 1}</span>
                      <div>
                        <p className="text-[0.875rem] font-medium text-ink">{k}</p>
                        <p className="mt-1 text-[0.8125rem] leading-[1.65] text-ink-soft">{v}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <div className="mt-14 grid gap-8 border-t border-[var(--line)] pt-8 sm:grid-cols-3">
              <Stat value="0" label={t("network.pickups.trips")} note={t("network.pickups.tripsNote")} />
              <Stat value="0" label={t("network.pickups.accounts")} note={t("network.pickups.accountsNote")} />
              <Stat value={t("common.free")} label={t("network.pickups.cost")} note={t("network.pickups.costNote")} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <Reveal>
              <SectionHead
                index="02.3"
                label={t("network.joining.label")}
                title={
                  <>
                    {t("network.joining.title1")}
                    <br />
                    <em>{t("network.joining.title2")}</em>
                  </>
                }
                lede={t("network.joining.lede")}
              />
            </Reveal>
            <Reveal delay={100}>
              <div className="card-print p-6">
                <ol className="space-y-5">
                  {[
                    [t("network.joining.visit"), t("network.joining.visitDef")],
                    [t("network.joining.form"), t("network.joining.formDef")],
                    [t("network.joining.sack"), t("network.joining.sackDef")],
                    [t("network.joining.collect"), t("network.joining.collectDef")],
                  ].map(([k, v], i) => (
                    <li key={k} className="flex gap-4">
                      <span className="mono-tag mt-1 text-clay">0{i + 1}</span>
                      <div>
                        <p className="text-[0.875rem] font-medium text-ink">{k}</p>
                        <p className="mt-1 text-[0.8125rem] leading-[1.65] text-ink-soft">{v}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link href="/partner" className="btn btn-sm mt-6 w-full">
                  {t("form.submit")}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
