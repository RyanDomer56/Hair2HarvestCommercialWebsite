"use client";

import Link from "next/link";
import { BrandMark } from "./brand";
import { useLanguage } from "@/lib/i18n";

const columns = [
  {
    titleKey: "footer.learn",
    items: [
      { labelKey: "nav.how", href: "/system" },
      { labelKey: "nav.how.grading", href: "/system#grading" },
      { labelKey: "nav.impact", href: "/impact" },
    ],
  },
  {
    titleKey: "footer.shops",
    items: [
      { labelKey: "footer.shopList", href: "/network" },
      { labelKey: "nav.network.rules", href: "/network#rules" },
      { labelKey: "footer.joinUs", href: "/partner" },
    ],
  },
  {
    titleKey: "footer.company",
    items: [
      { labelKey: "nav.about", href: "/about" },
      { labelKey: "nav.about.team", href: "/about#team" },
      { labelKey: "footer.contactUs", href: "/partner#contact" },
    ],
  },
];

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--paper-sunk)]">
      <div className="shell pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark size={44} />
              <div>
                <p className="text-[1.05rem] font-semibold tracking-[-0.03em] text-ink">
                  Hair2Harvest
                </p>
                <p className="mono-tag mt-1 text-ink-mute">{t("footer.soilFromBarbers")}</p>
              </div>
            </div>
            <p className="mt-5 max-w-[30ch] text-[0.875rem] leading-relaxed text-ink-soft">
              {t("footer.tagline")}
            </p>
            <p className="mono-tag mt-6 text-ink-mute">
              {t("footer.barangay")}
              <br />
              QUEZON CITY
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.titleKey}>
              <p className="eyebrow">{t(col.titleKey)}</p>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.875rem] text-ink-soft transition-colors hover:text-moss"
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-tag text-ink-mute">
            {t("footer.copyright")}
            <br />
            {t("footer.capstone")}
          </p>
          <p className="mono-tag text-ink-mute/70">{t("footer.mascot")}</p>
          <div className="flex items-center gap-5">
            <span className="mono-tag text-ink-mute">{t("footer.barangay")}</span>
            <span className="flex items-center gap-1.5">
              <span className="live-dot size-1.5 rounded-full bg-moss" aria-hidden />
              <span className="mono-tag text-moss">{t("footer.nowCollecting")}</span>
            </span>
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] translate-y-[0.06em] whitespace-nowrap text-center font-display text-[clamp(4rem,15vw,13rem)] leading-none tracking-[-0.04em] text-[color-mix(in_oklab,var(--ink)_9%,transparent)]">
          Hair2Harvest
        </p>
      </div>
    </footer>
  );
}
