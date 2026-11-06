import Link from "next/link";
import { BrandMark } from "./brand";

const columns = [
  {
    title: "System",
    items: [
      { label: "The harvest line", href: "/system" },
      { label: "Grading standard", href: "/system#grading" },
      { label: "Batch & curing", href: "/system#batch" },
      { label: "Evidence", href: "/impact" },
    ],
  },
  {
    title: "Network",
    items: [
      { label: "Shop directory", href: "/network" },
      { label: "Pickup rules", href: "/network#rules" },
      { label: "Become a shop", href: "/partner" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About us", href: "/about" },
      { label: "Our team", href: "/about#team" },
      { label: "Get in touch", href: "/partner#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--paper-sunk)]">
      <div className="shell pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark size={44} />
              <div>
                <p className="text-[1.05rem] font-semibold tracking-[-0.03em] text-ink">
                  hair2harvest
                </p>
                <p className="mono-tag mt-1 text-ink-mute">SOIL FROM SALONS</p>
              </div>
            </div>
            <p className="mt-5 max-w-[30ch] text-[0.875rem] leading-relaxed text-ink-soft">
              A collection and composting service for barbershops. We come to the shop, grade the
              hair at the door, and hand back the evidence.
            </p>
            <p className="mono-tag mt-6 text-ink-mute">
              BALANGA · BATAAN · PHILIPPINES
              <br />
              14.6760° N, 120.5360° E
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[0.875rem] text-ink-soft transition-colors hover:text-moss"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-tag text-ink-mute">
            © 2026 HAIR2HARVEST · A COLLECTION &amp; COMPOSTING SERVICE FOR BARBERSHOPS
          </p>
          <div className="flex items-center gap-5">
            <span className="mono-tag text-ink-mute">BALANGA · BATAAN · PHILIPPINES</span>
            <span className="flex items-center gap-1.5">
              <span className="live-dot size-1.5 rounded-full bg-moss" aria-hidden />
              <span className="mono-tag text-moss">NOW COLLECTING</span>
            </span>
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] translate-y-[0.06em] whitespace-nowrap text-center font-display text-[clamp(4rem,15vw,13rem)] leading-none tracking-[-0.04em] text-[color-mix(in_oklab,var(--ink)_9%,transparent)]">
          hair2harvest
        </p>
      </div>
    </footer>
  );
}
