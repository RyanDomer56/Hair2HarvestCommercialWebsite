import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { PartnerForm } from "@/components/site/partner-form";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, SpecRow, Stat } from "@/components/site/ui-bits";

export const metadata: Metadata = {
  title: "Partner a shop",
  description:
    "Register a barbershop with Hair2Harvest. Two minutes on site, a labelled sack, and a pickup rule that fits your hours.",
};

export default function PartnerPage() {
  return (
    <>
      <PageHero
        index="03"
        label="Partner"
        title={
          <>
            Two minutes,
            <br />
            then we <em>disappear</em>.
          </>
        }
        lede="A staff member registers the shop on site. Six fields, one checkbox, one labelled sack. After that the pickup rule does the work and the shop keeps cutting hair."
        meta={[
          { k: "Registration", v: "~2 minutes" },
          { k: "Cost to shop", v: "None" },
          { k: "Login required", v: "No" },
          { k: "First pickup", v: "Same week" },
        ]}
      />

      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <Reveal>
                <SectionHead
                  index="03.1"
                  label="Registration"
                  title={
                    <>
                      What we <em>ask</em>.
                    </>
                  }
                  lede="Only what changes the pickup. Nothing that requires the shop to log in later, and nothing we can measure ourselves."
                />
              </Reveal>

              <Reveal delay={80}>
                <div className="mt-8 border-t border-[var(--line)]">
                  <SpecRow label="Shop name" value="Required" />
                  <SpecRow label="Contact person" value="Required" />
                  <SpecRow label="Mobile number" value="Required" hint="One number, one channel" />
                  <SpecRow label="Barangay" value="Required" hint="Also flags pilot eligibility" />
                  <SpecRow label="Opening hours" value="Required" />
                  <SpecRow label="Pickup rule" value="Days · window · access" />
                  <SpecRow label="Consent + photo permission" value="Checkbox" />
                </div>
              </Reveal>

              <Reveal delay={140}>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <Stat value="0" label="Passwords created" />
                  <Stat value="1" label="Sack, labelled with your code" />
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-10 border-t border-[var(--line)] pt-6">
                  <p className="mono-tag uppercase text-ink-mute">What you receive</p>
                  <ul className="mt-4 space-y-3">
                    {[
                      "A pickup receipt with sack count and net kilograms.",
                      "A short message when the batch your hair went into is tested.",
                      "First refusal on cured compost for your barangay's planting beds.",
                    ].map((x) => (
                      <li key={x} className="flex gap-3 text-[0.875rem] leading-[1.65] text-ink-soft">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-moss" aria-hidden />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <PartnerForm />
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-24 border-t border-[var(--line)] bg-[var(--paper-raised)]"
      >
        <div className="shell section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="03.2"
                label="Contact"
                title={
                  <>
                    Talk to a
                    <br />
                    <em>person</em>.
                  </>
                }
                lede="There is no support portal. There is a phone number and two people who answer it."
              />
            </Reveal>

            <Reveal delay={80}>
              <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
                {[
                  { icon: Phone, k: "Mobile", v: "+63 917 000 0000", note: "Mon–Sat, 9 AM–7 PM" },
                  { icon: Mail, k: "Email", v: "hello@hair2harvest.ph", note: "Replies within a day" },
                  {
                    icon: MapPin,
                    k: "Site",
                    v: "Balanga, Bataan",
                    note: "Pilot barangay · by appointment",
                  },
                  {
                    icon: ArrowUpRight,
                    k: "Workspace",
                    v: "Open the dashboard",
                    note: "For staff and partners",
                    href: "/dashboard",
                  },
                ].map((c) => {
                  const Icon = c.icon;
                  const inner = (
                    <div className="h-full bg-[var(--paper-raised)] p-6 transition-colors hover:bg-paper">
                      <Icon size={16} className="text-clay" />
                      <p className="mono-tag mt-5 uppercase text-ink-mute">{c.k}</p>
                      <p className="mt-2 text-[0.9375rem] font-medium text-ink">{c.v}</p>
                      <p className="mt-1 text-[0.75rem] text-ink-mute">{c.note}</p>
                    </div>
                  );
                  return c.href ? (
                    <Link key={c.k} href={c.href} className="block">
                      {inner}
                    </Link>
                  ) : (
                    <div key={c.k}>{inner}</div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
