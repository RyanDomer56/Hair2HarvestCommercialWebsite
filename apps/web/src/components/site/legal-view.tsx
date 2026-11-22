"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { useLanguage } from "@/lib/i18n";
import type { LegalDocument } from "@/lib/legal";

export function LegalView({ doc, index, other }: {
  doc: LegalDocument;
  index: string;
  other: { href: string; label: { en: string; tl: string } };
}) {
  const { lang, t } = useLanguage();

  return (
    <>
      <PageHero
        index={index}
        label={doc.eyebrow[lang]}
        title={
          <>
            {doc.title[lang].split(" ").slice(0, -1).join(" ")}
            <br />
            <em>{doc.title[lang].split(" ").slice(-1)[0]}</em>
          </>
        }
        lede={doc.lede[lang]}
        meta={[{ k: t("legal.effective"), v: doc.effective[lang] }]}
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          {/* sticky contents rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="eyebrow">{t("legal.contents")}</p>
              <nav className="mt-4 flex flex-col border-l border-[var(--line)]" aria-label={t("legal.contents")}>
                {doc.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group -ml-px flex items-center gap-2 border-l border-transparent py-2 pl-3 text-[0.8125rem] text-ink-soft transition-colors hover:border-moss hover:text-moss"
                  >
                    <span className="mono-tag text-clay">{s.number}</span>
                    {s.title[lang]}
                  </a>
                ))}
              </nav>
              <Link
                href={other.href}
                className="mt-7 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-moss"
              >
                {other.label[lang]}
                <ArrowUpRight size={14} aria-hidden />
              </Link>
            </div>
          </aside>

          <div className="min-w-0">
            {doc.sections.map((section, i) => (
              <Reveal key={section.id} delay={Math.min(i, 4) * 50}>
                <section id={section.id} className="scroll-mt-24 border-t border-[var(--line)] py-8 first:border-t-0 first:pt-0">
                  <div className="flex items-baseline gap-3">
                    <span className="mono-tag text-clay">{section.number}</span>
                    <h2 className="text-[1.25rem] font-medium tracking-[-0.025em] text-ink">
                      {section.title[lang]}
                    </h2>
                  </div>
                  <div className="mt-4 max-w-[68ch] space-y-4">
                    {section.blocks.map((block, bi) =>
                      block.kind === "p" ? (
                        <p key={bi} className="text-[0.9375rem] leading-[1.8] text-ink-soft">
                          {block.text[lang]}
                        </p>
                      ) : (
                        <ul key={bi} className="space-y-3">
                          {block.items.map((item, ii) => (
                            <li key={ii} className="flex gap-3 text-[0.9375rem] leading-[1.8] text-ink-soft">
                              <span
                                className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-moss"
                                aria-hidden
                              />
                              <span>{item[lang]}</span>
                            </li>
                          ))}
                        </ul>
                      ),
                    )}
                  </div>
                </section>
              </Reveal>
            ))}

            {doc.closing && (
              <Reveal delay={100}>
                <div className="mt-4 rounded-[3px] border border-moss/30 bg-moss/5 p-6">
                  <div className="flex items-center gap-2 text-moss">
                    <ShieldCheck size={16} strokeWidth={2} aria-hidden />
                    <span className="mono-tag uppercase">{t("legal.confirm")}</span>
                  </div>
                  <p className="mt-3 text-[0.9375rem] leading-[1.8] text-ink-soft">
                    {doc.closing.text[lang]}
                  </p>
                </div>
              </Reveal>
            )}

            <Reveal delay={120}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/partner" className="btn btn-sm">
                  {t("legal.join")}
                  <ArrowUpRight size={14} aria-hidden />
                </Link>
                <Link href={other.href} className="btn btn-ghost btn-sm">
                  <FileText size={14} aria-hidden />
                  {other.label[lang]}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
