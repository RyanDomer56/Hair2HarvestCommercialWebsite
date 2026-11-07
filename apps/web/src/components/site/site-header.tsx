"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Home, Menu, X } from "lucide-react";
import { Wordmark } from "./brand";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  labelKey: string;
  menu: { href: string; labelKey: string }[];
};

const links: NavItem[] = [
  {
    href: "/about",
    labelKey: "nav.about",
    menu: [
      { href: "/about", labelKey: "nav.about.story" },
      { href: "/about#team", labelKey: "nav.about.team" },
      { href: "/about#values", labelKey: "nav.about.values" },
    ],
  },
  {
    href: "/system",
    labelKey: "nav.how",
    menu: [
      { href: "/system", labelKey: "nav.how.steps" },
      { href: "/system#grading", labelKey: "nav.how.grading" },
      { href: "/system#machine", labelKey: "nav.how.machine" },
    ],
  },
  {
    href: "/network",
    labelKey: "nav.network",
    menu: [
      { href: "/network", labelKey: "nav.network.directory" },
      { href: "/network#rules", labelKey: "nav.network.rules" },
      { href: "/partner", labelKey: "nav.network.join" },
    ],
  },
  {
    href: "/impact",
    labelKey: "nav.impact",
    menu: [
      { href: "/impact#collection", labelKey: "nav.impact.collection" },
      { href: "/impact#lab", labelKey: "nav.impact.lab" },
      { href: "/impact#trials", labelKey: "nav.impact.trials" },
    ],
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const onHome = pathname === "/";
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "grain sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--paper)_92%,transparent)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="shell relative z-10 flex h-[72px] items-center justify-between gap-6">
          {/* The wordmark is intentionally NOT a link. Older visitors do not
              think to click a logo; the labelled Introduction button is the
              clear way back to the homepage. */}
          <Wordmark />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <Link
              href="/"
              aria-current={onHome ? "page" : undefined}
              className={cn(
                "mr-1 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors",
                onHome
                  ? "border-moss bg-moss text-paper"
                  : "border-[var(--line)] bg-paper text-ink hover:border-moss hover:text-moss",
              )}
            >
              <Home size={13} strokeWidth={2} aria-hidden />
              {t("nav.introduction")}
            </Link>
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              const isOpen = menuOpen === l.href;
              return (
                <div
                  key={l.href}
                  className="relative"
                  onMouseEnter={() => setMenuOpen(l.href)}
                  onMouseLeave={() => setMenuOpen(null)}
                >
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={isOpen}
                    onFocus={() => setMenuOpen(l.href)}
                    onBlur={() => setMenuOpen(null)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors",
                      active ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {t(l.labelKey)}
                    {l.menu && (
                      <ChevronDown
                        size={13}
                        className={cn("transition-transform", isOpen && "rotate-180")}
                        aria-hidden
                      />
                    )}
                    {active && (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-moss" aria-hidden />
                    )}
                  </Link>

                  {l.menu && isOpen && (
                    <div className="absolute left-0 top-full pt-2">
                      <div className="card-print w-56 overflow-hidden rounded-[6px] border border-[var(--line)] bg-paper p-1.5 shadow-[0_18px_40px_rgba(8,12,4,.18)]">
                        {l.menu.map((m) => (
                          <Link
                            key={m.href}
                            href={m.href}
                            className="group flex items-center justify-between gap-2 rounded-[4px] px-3 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:bg-[var(--paper-sunk)] hover:text-ink"
                          >
                            {t(m.labelKey)}
                            <ArrowUpRight
                              size={13}
                              className="text-ink-mute opacity-0 transition-opacity group-hover:opacity-100"
                              aria-hidden
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageToggle />
            <Link href="/partner" className="btn btn-sm">
              {t("cta.partner")}
              <ArrowUpRight size={14} strokeWidth={2} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("aria.closeMenu") : t("aria.openMenu")}
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--line)] text-ink md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 top-[72px] z-40 flex flex-col overflow-y-auto bg-paper md:hidden">
          <nav className="shell flex flex-col pt-6" aria-label="Mobile">
            <Link
              href="/"
              aria-current={onHome ? "page" : undefined}
              className="mb-2 flex items-center gap-2.5 rounded-full border border-moss bg-moss px-4 py-3 text-paper"
            >
              <Home size={16} aria-hidden />
              <span className="display text-[1.5rem]">{t("nav.introduction")}</span>
              <span className="mono-tag ml-auto text-paper/60">{t("common.home")}</span>
            </Link>
            {links.map((l, i) => (
              <div key={l.href} className="border-b border-[var(--line)]">
                <Link
                  href={l.href}
                  className="flex items-baseline justify-between py-5"
                >
                  <span className="display text-[2rem] text-ink">{t(l.labelKey)}</span>
                  <span className="mono-tag text-ink-mute">0{i + 1}</span>
                </Link>
                {l.menu && (
                  <div className="flex flex-col gap-1 pb-4">
                    {l.menu.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        className="flex items-center gap-2 rounded-[6px] bg-[var(--paper-sunk)] px-3 py-2 text-[0.875rem] text-ink-soft"
                      >
                        <ArrowUpRight size={13} className="text-ink-mute" aria-hidden />
                        {t(m.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="shell mt-8 flex flex-col gap-3">
            <Link href="/partner" className="btn w-full">
              {t("cta.partner")}
            </Link>
            <LanguageToggle className="self-start" />
          </div>
          <div className="shell mt-auto pb-8">
            <p className="eyebrow">{t("footer.barangayShort")}</p>
          </div>
        </div>
      )}
    </>
  );
}
