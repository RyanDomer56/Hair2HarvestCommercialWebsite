"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Home, Menu, X } from "lucide-react";
import { Wordmark } from "./brand";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "About" },
  { href: "/system", label: "How it works" },
  { href: "/network", label: "Shop network" },
  { href: "/impact", label: "Evidence" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHome = pathname === "/";

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
              Introduction
            </Link>
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors",
                    active ? "text-ink" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {l.label}
                  {active && (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-moss" aria-hidden />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/partner" className="btn btn-sm">
              Partner a shop
              <ArrowUpRight size={14} strokeWidth={2} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--line)] text-ink md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 top-[72px] z-40 flex flex-col bg-paper md:hidden">
          <nav className="shell flex flex-col pt-6" aria-label="Mobile">
            <Link
              href="/"
              aria-current={onHome ? "page" : undefined}
              className="mb-2 flex items-center gap-2.5 rounded-full border border-moss bg-moss px-4 py-3 text-paper"
            >
              <Home size={16} aria-hidden />
              <span className="display text-[1.5rem]">Introduction</span>
              <span className="mono-tag ml-auto text-paper/60">HOME</span>
            </Link>
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-baseline justify-between border-b border-[var(--line)] py-5"
              >
                <span className="display text-[2rem] text-ink">{l.label}</span>
                <span className="mono-tag text-ink-mute">0{i + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="shell mt-8 flex flex-col gap-3">
            <Link href="/partner" className="btn w-full">
              Partner a shop
            </Link>
          </div>
          <div className="shell mt-auto pb-8">
            <p className="eyebrow">Balanga, Bataan · Philippines</p>
          </div>
        </div>
      )}
    </>
  );
}
