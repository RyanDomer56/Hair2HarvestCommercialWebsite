import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHero({
  index,
  label,
  title,
  lede,
  meta,
  cta,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  lede: string;
  meta?: { k: string; v: string }[];
  cta?: { label: string; href: string };
}) {
  return (
    <section className="grain relative overflow-hidden border-b border-[var(--line)]">
      <div className="shell relative z-10 pb-14 pt-12 sm:pb-16 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="mono-tag text-clay">{index}</span>
              <span className="h-px w-6 bg-[var(--line)]" />
              <span className="eyebrow">{label}</span>
            </div>
            <h1 className="display mt-6 text-[clamp(2.5rem,5.6vw,4.6rem)] text-ink">{title}</h1>
          </div>

          <div className="lg:pb-2">
            <p className="text-[0.9375rem] leading-[1.7] text-ink-soft">{lede}</p>
            {cta && (
              <Link
                href={cta.href}
                className="group mt-5 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-moss"
              >
                {cta.label}
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            )}
          </div>
        </div>

        {meta && (
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[var(--line)] pt-6 sm:grid-cols-4">
            {meta.map((m) => (
              <div key={m.k}>
                <dt className="mono-tag uppercase text-ink-mute">{m.k}</dt>
                <dd className="num mt-2 text-[1.0625rem] font-medium text-ink">{m.v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[62ch] text-[0.9375rem] leading-[1.75] text-ink-soft",
        "[&>p+p]:mt-4 [&_strong]:font-medium [&_strong]:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
