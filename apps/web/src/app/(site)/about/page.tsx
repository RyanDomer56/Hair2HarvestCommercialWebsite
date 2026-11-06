import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Leaf, Recycle, ShieldCheck, Users } from "lucide-react";
import { PageHero, Prose } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "About us · Hair2Harvest",
  description:
    "Hair2Harvest is a student project in Balanga, Bataan. We collect hair clippings from barbershops and turn them into compost for local planting beds.",
};

/* The 13-member roster, spelled exactly as supplied. Name + main
   responsibility only — nothing else (QA #19). Each person appears once. */
const groups = [
  {
    title: "Project Management",
    members: [
      { name: "Mikylla Tulba", role: "Project manager" },
      { name: "Sherwin G. Malenab", role: "Assistant project manager" },
      { name: "Lairene B. Yulo", role: "Secretary" },
    ],
  },
  {
    title: "Developers",
    members: [
      { name: "Jundill Mhar C. Reyes", role: "Lead developer" },
      { name: "Ryan C. Domer", role: "Developer" },
      { name: "Andrew Jeremiah C. Salangsang", role: "Developer" },
      { name: "Kier Laurence L. Atienza", role: "Developer" },
      { name: "Liezette C. Aparri", role: "Developer" },
      { name: "Ermalyn R. Gadon", role: "Developer" },
    ],
  },
  {
    title: "Documentation",
    members: [
      { name: "Emilou P. Quimiguing", role: "Documentation lead" },
      { name: "Rea Mary T. Mantal", role: "Documentation" },
      { name: "Rheyven D. Algeria", role: "Documentation" },
    ],
  },
  {
    title: "Quality Assurance",
    members: [
      { name: "Ayan Haile C. Canale", role: "Quality assurance" },
    ],
  },
];

const values = [
  {
    icon: Recycle,
    k: "Nothing is wasted",
    v: "Hair that cannot be used is kept aside, never quietly thrown away.",
  },
  {
    icon: ShieldCheck,
    k: "We check our work",
    v: "Every batch is checked by a laboratory before we call it compost.",
  },
  {
    icon: Users,
    k: "The shop comes first",
    v: "No app, no login, no new habit. We go to the shop on its own schedule.",
  },
  {
    icon: Leaf,
    k: "Local by design",
    v: "The hair is collected here, composted here, and the soil stays here.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="00"
        label="About us"
        title={
          <>
            We turn hair
            <br />
            into <em className="text-moss">soil</em>.
          </>
        }
        lede="Hair2Harvest is a student project in Balanga, Bataan. We pick up hair clippings from barbershops and turn them into compost for planting beds nearby. We come to the shop, and we share the results with you."
        meta={[
          { k: "Based in", v: "Balanga" },
          { k: "Team", v: "13 members" },
          { k: "Started", v: "2026" },
          { k: "Cost to join", v: "Free" },
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
                We bring
                <br />
                the <em className="text-moss">sack</em> to you.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <Prose>
                <p>
                  A barbershop sweeps out a few kilos of hair every week. Most of it goes into the
                  bin with the tissue and plastic, because there is no separate container for it —
                  and no time to take it anywhere.
                </p>
                <p>
                  So we start at the shop. We bring a labelled sack, collect the hair on a day that
                  suits the owner, and check what is in the sack at the door. Clean hair is weighed
                  and mixed with dry leaves and other plant material. After about six weeks, a
                  laboratory checks the compost before we use it.
                </p>
                <p>
                  The shop gets a receipt and the lab result. The compost goes to planting beds in
                  the same barangay. No app, no login and no extra work for the people behind the
                  chair.
                </p>
              </Prose>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- team */}
      <section id="team" className="relative scroll-mt-24 border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono-tag text-clay">02</span>
              <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
              <span className="eyebrow">Our team</span>
            </div>
            <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-ink">
              The people
              <br />
              <em className="text-moss">behind it</em>.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[0.875rem] leading-[1.7] text-ink-soft">
              Thirteen students, grouped by what each one looks after.
            </p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {groups.map((g, i) => (
              <Reveal key={g.title} delay={i * 60}>
                <div>
                  <p className="mono-tag uppercase text-clay">{g.title}</p>
                  <ul className="mt-4 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
                    {g.members.map((m) => (
                      <li key={`${g.title}-${m.name}`} className="bg-[var(--paper-raised)] px-5 py-4">
                        <p className="text-[0.9375rem] font-medium text-ink">{m.name}</p>
                        <p className="mt-1 text-[0.8125rem] text-ink-soft">{m.role}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- values */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono-tag text-clay">03</span>
              <span className="h-px w-6 bg-[var(--line)]" aria-hidden />
              <span className="eyebrow">What we believe</span>
            </div>
            <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.4rem)] text-ink">
              Four simple
              <br />
              <em className="text-moss">rules</em>.
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
                that could <em className="text-lime">join?</em>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-[42ch] text-[0.9375rem] leading-[1.7] text-paper/75">
                Joining is free and takes almost none of your time. We do the paperwork, you keep
                cutting hair, and we tell you what happened to it.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/partner" className="btn btn-lime">
                  Join the shops
                  <ArrowUpRight size={15} />
                </Link>
                <Link href="/network" className="btn btn-ghost-paper">
                  See the shops
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
