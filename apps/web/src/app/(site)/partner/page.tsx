import type { Metadata } from "next";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { PartnerForm } from "@/components/site/partner-form";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, Stat } from "@/components/site/ui-bits";

export const metadata: Metadata = {
  title: "Partner a shop",
  description:
    "Register a barbershop with Hair2Harvest. A short visit, a labelled sack, and a pickup rule that fits your hours.",
};

export default function PartnerPage() {
  return (
    <>
      <PageHero
        index="03"
        label="Partner"
        title={
          <>
            A short visit,
            <br />
            then we <em>disappear</em>.
          </>
        }
        lede="A staff member registers the shop on a short visit. A labelled sack, a pickup rule that fits your hours, and you keep cutting hair. Nothing for you to run."
        meta={[
          { k: "Registration", v: "A short visit" },
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
                <p className="mt-8 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                  We ask for your shop name, a contact person, a mobile number, your barangay, and
                  the window that suits you best. That is the whole registration — everything else we
                  measure ourselves on the visit, and nothing we collect ever asks you to log in
                  again.
                </p>
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
                    icon: CalendarDays,
                    k: "Pickup window",
                    v: "Tue & Fri · 8–9 PM",
                    note: "Or whatever rule we agree on",
                  },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.k} className="h-full bg-[var(--paper-raised)] p-6 transition-colors hover:bg-paper">
                      <Icon size={16} className="text-clay" />
                      <p className="mono-tag mt-5 uppercase text-ink-mute">{c.k}</p>
                      <p className="mt-2 text-[0.9375rem] font-medium text-ink">{c.v}</p>
                      <p className="mt-1 text-[0.75rem] text-ink-mute">{c.note}</p>
                    </div>
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
