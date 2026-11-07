import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ShopDirectory } from "@/components/site/shop-directory";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, Stat } from "@/components/site/ui-bits";
import { shops } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop Partners",
  description:
    "See the barbershops that have partnered with Hair2Harvest. We show shop name, barangay and partnership status only — contact and pickup details stay private.",
};

export default function NetworkPage() {
  const enrolled = shops.filter((s) => s.status === "Enrolled");
  const totalKg = shops.reduce((a, s) => a + s.totalKg, 0);

  return (
    <>
      <PageHero
        index="02"
        label="Shop Partners"
        title={
          <>
            Shops already
            <br />
            <em>with us</em>.
          </>
        }
        lede="Real barbershops in Barangay Novaliches Proper taking part in Hair2Harvest. To protect every owner, we show only the shop name, barangay and partnership status here."
        cta={{ label: "Join the shops", href: "/partner" }}
        meta={[
          { k: "Shops joined", v: String(enrolled.length) },
          { k: "Coming soon", v: String(shops.filter((s) => s.status === "Candidate").length) },
          { k: "Hair collected", v: `${totalKg.toFixed(1)} kg` },
          { k: "Cost to join", v: "Free" },
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
                    The shop <em>list</em>.
                  </>
                }
              />
              <p className="max-w-[40ch] text-[0.8125rem] leading-[1.65] text-ink-soft sm:text-right">
                You can filter by status or search a shop by name or barangay. The words under the
                list explain what each status means.
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
                label="Pickups"
                title={
                  <>
                    We fit your
                    <br />
                    <em>hours</em>.
                  </>
                }
                lede="Every shop is different, so we agree the pickup days and time together during the visit. Some shops want us twice a week, others once. We always come to you."
              />
              <p className="mt-6 max-w-[46ch] text-[0.875rem] leading-[1.7] text-ink-soft">
                These details are private. Only the Hair2Harvest collection team can see them, so no one else
                knows when hair is collected or who to ask for.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print p-6 sm:p-8">
                <p className="mono-tag uppercase text-ink-mute">What stays private</p>
                <ul className="mt-5 space-y-4">
                  {[
                    ["Contact person", "Who we call or message at the shop."],
                    ["Mobile number", "Used only for pickup messages."],
                    ["Pickup days and time", "Agreed with the shop, never published."],
                    ["Access notes", "How we reach the sack on a visit."],
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
              <Stat value="0" label="Trips to the barangay hall" note="We come to you" />
              <Stat value="0" label="Accounts for shops" note="A code on a sack is enough" />
              <Stat value="Free" label="Cost to join" note="No fees, no equipment to buy" />
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
                label="Joining"
                title={
                  <>
                    Four easy
                    <br />
                    <em>steps</em>.
                  </>
                }
                lede="No counter to visit, no paperwork to fill in by yourself. A collection team member comes to your shop and does it with you."
              />
            </Reveal>
            <Reveal delay={100}>
              <div className="card-print p-6">
                <ol className="space-y-5">
                  {[
                    ["Visit", "We come at a quiet hour that suits you."],
                    ["Short form", "We ask a few simple questions and write them down for you."],
                    ["Sack", "We leave a labelled sack for your hair clippings."],
                    ["Collect", "We come back when we agreed. That is all."],
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
                  Ask for a visit
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
