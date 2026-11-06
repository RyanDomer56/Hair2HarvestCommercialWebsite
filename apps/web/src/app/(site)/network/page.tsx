import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ShopDirectory } from "@/components/site/shop-directory";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, Stat, Pill } from "@/components/site/ui-bits";
import { shops } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop network",
  description:
    "The Hair2Harvest shop directory: eight barbershops in Bataan, each with its own pickup rule, access note and status.",
};

export default function NetworkPage() {
  const enrolled = shops.filter((s) => s.status === "Enrolled");
  const totalKg = shops.reduce((a, s) => a + s.totalKg, 0);

  return (
    <>
      <PageHero
        index="02"
        label="Shop network"
        title={
          <>
            Eight shops.
            <br />
            One <em>route</em>.
          </>
        }
        lede="A shop is a record, not an account. Staff register it on site, write a code on its sack, and from then on the pickup rule does the work."
        cta={{ label: "Register a shop", href: "/partner" }}
        meta={[
          { k: "Enrolled", v: String(enrolled.length) },
          { k: "Candidates", v: String(shops.filter((s) => s.status === "Candidate").length) },
          { k: "In pilot area", v: String(shops.filter((s) => s.inPilotArea).length) },
          { k: "Collected", v: `${totalKg.toFixed(1)} kg` },
        ]}
      />

      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHead
                index="02.1"
                label="Directory"
                title={
                  <>
                    The <em>ledger</em>.
                  </>
                }
              />
              <p className="max-w-[40ch] text-[0.8125rem] leading-[1.65] text-ink-soft sm:text-right">
                Status is a lifecycle, not a label: candidate → enrolled → paused or withdrawn. A
                paused shop keeps its history and its sack.
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
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="02.2"
                label="Pickup rules"
                title={
                  <>
                    Why no two shops
                    <br />
                    share a <em>schedule</em>.
                  </>
                }
                lede="Interviewed shops ranged from nightly to weekly. One mall shop asked for nightly pickup because the mall clears waste every day. A single global rota cannot serve both ends of that range."
              />
              <div className="mt-8 space-y-4">
                {[
                  [
                    "Nightly",
                    "Mall-based shop. Mall clears waste daily. Two sacks and a Mon/Thu rule as the cost-controlled fallback — confirmed with the shop, not assumed.",
                  ],
                  [
                    "Twice weekly",
                    "The default. Keeps a sack from sitting longer than a week and matches the middle of the observed range.",
                  ],
                  [
                    "Weekly",
                    "Low-volume shop with cool, dry storage. Longer gaps are fine if the sack is out of the waste stream.",
                  ],
                ].map(([k, v], i) => (
                  <Reveal key={k} delay={i * 70}>
                    <div className="border-t border-[var(--line)] pt-4">
                      <p className="mono-tag uppercase text-clay">{k}</p>
                      <p className="mt-2 text-[0.875rem] leading-[1.7] text-ink-soft">{v}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
                {enrolled.slice(0, 4).map((s) => (
                  <div key={s.code} className="bg-paper p-5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="mono-tag text-clay">{s.code}</p>
                      <Pill tone={s.peakDay ? "clay" : "mute"}>
                        {s.peakDay ? "Peak heavy" : "Steady"}
                      </Pill>
                    </div>
                    <p className="mt-4 text-[0.9375rem] font-medium text-ink">{s.name}</p>
                    <p className="mt-1 text-[0.75rem] text-ink-mute">{s.barangay}</p>
                    <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-3">
                      <div className="flex justify-between gap-3">
                        <span className="mono-tag text-ink-mute">DAYS</span>
                        <span className="text-[0.8125rem] text-ink">{s.days.join(" & ")}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="mono-tag text-ink-mute">WINDOW</span>
                        <span className="text-right text-[0.8125rem] text-ink">{s.window}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={160}>
              <div className="mt-14 grid gap-8 border-t border-[var(--line)] pt-8 sm:grid-cols-3">
              <Stat value="0" label="Trips to barangay hall" note="We come to you" />
              <Stat value="0" label="Shop logins" note="Code on a sack is the identity" />
              <Stat value="3" label="Message templates" note="Reminder, missed, recorded" />
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
                label="Contact"
                title={
                  <>
                    We come to
                    <br />
                    the <em>shop</em>.
                  </>
                }
                lede="No trip to the barangay hall. No form to fill at a counter. A staff member visits, registers the shop on a short visit, and leaves a labelled sack."
              />
            </Reveal>
            <Reveal delay={100}>
              <div className="card-print p-6">
                <ol className="space-y-5">
                  {[
                    ["Visit", "We arrive inside your slowest hour, not your peak."],
                    ["Register", "Name, contact, hours, pickup rule, consent. Six fields."],
                    ["Sack", "We hand over a labelled sack and write your shop code on it."],
                    ["Collect", "We return on your rule. You tap to confirm. That's it."],
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
                  Request a visit
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
