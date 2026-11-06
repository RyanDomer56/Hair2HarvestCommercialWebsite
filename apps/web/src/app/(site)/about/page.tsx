import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Leaf, Recycle, ShieldCheck, Users } from "lucide-react";
import { PageHero, Prose } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "About · Hair2Harvest",
  description:
    "Hair2Harvest is a collection and composting service for barbershops in Balanga, Bataan — turning salon hair into tested, usable compost.",
};

const team = [
  {
    name: "Ryan Cepeda Domer",
    role: "Founder & Program Lead",
    initials: "RC",
    tone: "moss",
    bio: "Started Hair2Harvest to give barbershops a container that actually gets picked up. Sets the collection route, the grading call, and the rule that the shop is never the one to travel.",
  },
  {
    name: "Maria L. Santos",
    role: "Composting & Agronomy Lead",
    initials: "MS",
    tone: "lime",
    bio: "Runs the drum, the recipe and the curing schedule. Treats every batch as a product with a number behind it, not a pile in the corner.",
  },
  {
    name: "Paolo Mendoza",
    role: "Shop Network & Logistics",
    initials: "PM",
    tone: "clay",
    bio: "Keeps each shop's pickup rule — days, window and the access note that matters at 9 PM. Eight shops, one route, no two alike.",
  },
  {
    name: "Angela Reyes",
    role: "Lab & Quality Assurance",
    initials: "AR",
    tone: "moss",
    bio: "Owns the lab result. Nothing is called compost until N-P-K, pH, maturity and pathogens say so, and the report goes back to the shop.",
  },
  {
    name: "Jomar Cruz",
    role: "Field Collection",
    initials: "JC",
    tone: "lime",
    bio: "The person at the door with the scale. Grades in seconds, weighs net of sack tare, and hands back the receipt before leaving.",
  },
  {
    name: "Bea Torres",
    role: "Community & Barangay Relations",
    initials: "BT",
    tone: "clay",
    bio: "Connects the cured compost to the planting beds it came from. Makes sure the barangay sees the soil, not just the service.",
  },
];

const toneGradient: Record<string, string> = {
  moss: "from-[var(--moss-deep)] to-[var(--moss)]",
  lime: "from-[#3f6212] to-[var(--lime)]",
  clay: "from-[#9a4a2b] to-[var(--clay)]",
};

const values = [
  {
    icon: Recycle,
    k: "Nothing is wasted",
    v: "The same sack changes what it is at every station. Hair that can't be batched is graded mixed and held — never quietly thrown away.",
  },
  {
    icon: ShieldCheck,
    k: "Evidence over claims",
    v: "Every batch carries a lab result. We print the number on the report, not on a slogan.",
  },
  {
    icon: Users,
    k: "The shop comes first",
    v: "No app, no login, no new habit. We go to the shop on its schedule; the shop keeps cutting hair.",
  },
  {
    icon: Leaf,
    k: "Local by design",
    v: "Collection, composting and planting stay in Balanga, Bataan. The soil returns to the barangays it came from.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="00"
        label="About"
        title={
          <>
            We turn salon hair
            <br />
            into <em className="text-moss">soil</em>.
          </>
        }
        lede="Hair2Harvest is a collection and composting service for barbershops in Balanga, Bataan. We pick hair up on the shop's own schedule, grade it at the door, and return a lab result with every batch."
        meta={[
          { k: "Founded", v: "Balanga, Bataan" },
          { k: "Service", v: "Collection · Composting" },
          { k: "Shops", v: "8 enrolled" },
          { k: "Output", v: "Lab-tested compost" },
        ]}
      />

      {/* -------------------------------------------------------- story */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="mono-tag text-clay">01</span>
                <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
                <span className="eyebrow">Our story</span>
              </div>
              <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-ink">
                A container that
                <br />
                actually gets <em className="text-moss">picked up</em>.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <Prose>
                <p>
                  A barbershop in Bataan sweeps out four to six kilos of hair a week. Most of it goes
                  into the same sack as tissue and plastic, because no one has a container for it —
                  and no time to haul one to the barangay hall.
                </p>
                <p>
                  Hair2Harvest begins where the shop already is. We bring a labelled sack, collect on
                  the shop&rsquo;s own schedule, and grade the hair at the door in seconds. Clean and
                  minor stock is weighed into a batch; mixed material is held, never batched. The pile
                  cures for 35&ndash;45 days, then a laboratory signs off before we call it compost.
                </p>
                <p>
                  What comes back to the shop is a receipt and a lab result — and what comes back to
                  the barangay is soil for its planting beds. No app, no login, no extra task for the
                  people behind the chair.
                </p>
              </Prose>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- team */}
      <section id="team" className="relative scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="mono-tag text-clay">02</span>
                <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
                <span className="eyebrow">The team</span>
              </div>
              <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-ink">
                The people behind
                <br />
                the <em className="text-moss">line</em>.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="max-w-[40ch] text-[0.875rem] leading-[1.7] text-ink-soft sm:text-right">
                A small crew runs collection, composting, the lab and the barangay relationships —
                so the shop only ever meets one of us: the one at the door.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal
                key={m.name}
                delay={(i % 3) * 80}
                className="bg-[var(--paper-raised)]"
              >
                <article className="group flex h-full flex-col bg-[var(--paper-raised)] p-6 transition-colors hover:bg-paper">
                  <div
                    className={`flex size-16 items-center justify-center rounded-full bg-gradient-to-br ${
                      toneGradient[m.tone]
                    } font-display text-[1.25rem] font-semibold text-paper shadow-[0_2px_14px_-4px_rgba(20,40,15,0.5)]`}
                    aria-hidden
                  >
                    {m.initials}
                  </div>
                  <h3 className="mt-5 text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                    {m.name}
                  </h3>
                  <p className="mono-tag mt-1.5 uppercase text-moss">{m.role}</p>
                  <p className="mt-3 text-[0.8125rem] leading-[1.65] text-ink-soft">{m.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mono-tag mt-5 text-ink-mute">
            TEAM PHOTOS &amp; BIOS ARE PLACEHOLDERS — REPLACE WITH REAL PROFILES IN THE CMS OR PAGE SOURCE.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- values */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono-tag text-clay">03</span>
              <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
              <span className="eyebrow">What we hold to</span>
            </div>
            <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-ink">
              Four rules we
              <br />
              don&rsquo;t <em className="text-moss">bend</em>.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, i) => (
              <Reveal key={item.k} delay={i * 70} className="bg-paper">
                <div className="h-full bg-paper p-6">
                  <item.icon size={20} className="text-moss" aria-hidden />
                  <p className="mono-tag mt-5 uppercase text-clay">{item.k}</p>
                  <p className="mt-3 text-[0.8125rem] leading-[1.65] text-ink-soft">{item.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- cta */}
      <section className="relative overflow-hidden border-t border-[var(--line)] bg-moss-deep text-paper">
        <div className="shell relative z-10 section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow text-lime">Work with us</p>
              <h2 className="display mt-6 text-[clamp(2.2rem,5.6vw,4.4rem)] text-paper">
                Know a shop
                <br />
                with hair to <em className="text-lime">spare?</em>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-[42ch] text-[0.9375rem] leading-[1.7] text-paper/75">
                We register a shop on site in about two minutes — no password, no dashboard. You keep
                cutting hair; we collect it, compost it, and tell you what happened.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/partner" className="btn btn-lime">
                  Partner a shop
                  <ArrowUpRight size={15} />
                </Link>
                <Link href="/network" className="btn btn-ghost-paper">
                  See the shop network
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
