import type { Metadata } from "next";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { PartnerForm } from "@/components/site/partner-form";
import { Reveal } from "@/components/site/reveal";
import { SectionHead, Stat } from "@/components/site/ui-bits";

export const metadata: Metadata = {
  title: "Join Hair2Harvest",
  description:
    "Join Hair2Harvest for free. We visit your shop, fill in a short form and leave a labelled sack. No account, no app, almost none of your time.",
};

export default function PartnerPage() {
  return (
    <>
      <PageHero
        index="03"
        label="Join us"
        title={
          <>
            We do the work.
            <br />
            You keep <em>cutting hair</em>.
          </>
        }
        lede="A collection team member visits your shop and fills in a short form for you. We leave a labelled sack and agree on a good time to collect. It takes almost none of your time."
        meta={[
          { k: "Your time", v: "Almost none" },
          { k: "Cost", v: "Free" },
          { k: "Account needed", v: "No" },
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
                  label="Joining"
                  title={
                    <>
                      What we <em>ask</em>.
                    </>
                  }
                  lede="Only a few simple details. We fill in the form ourselves when we visit."
                />
              </Reveal>

              <Reveal delay={80}>
                <p className="mt-8 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                  Your shop name, a contact person, a mobile number and your barangay. That is all we
                  need to start. We agree the pickup days together during the visit — you do not need
                  to decide anything now.
                </p>
              </Reveal>

              <Reveal delay={140}>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <Stat value="0" label="Passwords to remember" />
                  <Stat value="1" label="Sack, labelled for your shop" />
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-10 border-t border-[var(--line)] pt-6">
                  <p className="mono-tag uppercase text-ink-mute">What you get</p>
                  <ul className="mt-4 space-y-3">
                    {[
                      "A receipt every time we collect your hair.",
                      "A short message when your hair's compost has been checked.",
                      "Compost for planting beds in your barangay.",
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
                lede="No ticket system, no support portal. Call or message us and a real person answers."
              />
            </Reveal>

            <Reveal delay={80}>
              <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
                {[
                  { icon: Phone, k: "Mobile", v: "+63 917 000 0000", note: "Mon–Sat, 9 AM–7 PM" },
                  { icon: Mail, k: "Email", v: "hello@hair2harvest.ph", note: "We reply within a day" },
                  {
                    icon: MapPin,
                    k: "We are in",
                    v: "Brgy. Nova Proper",
                    note: "We come to your shop",
                  },
                  {
                    icon: CalendarDays,
                    k: "Pickup",
                    v: "We agree it together",
                    note: "A time that suits your shop",
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
