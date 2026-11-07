import Link from "next/link";
import { ArrowUpRight, ClipboardList, Recycle, Store, Truck, Users } from "lucide-react";
import { HairWeave } from "@/components/site/hair-weave";
import { Ticker } from "@/components/site/ticker";
import { Reveal } from "@/components/site/reveal";
import { MachineFrame } from "@/components/site/machine-frame";
import { CompostingDrum } from "@/components/site/composting-drum";
import { SectionHead, Stat, Pill } from "@/components/site/ui-bits";
import { shops, overviewStats } from "@/lib/data";

/* The four questions a shop owner asks first — answered in plain words. */
const faqs = [
  {
    q: "What is Hair2Harvest?",
    a: "A free collection service for barbershops in Barangay Novaliches Proper. We pick up the hair clippings you set aside and turn them into compost for planting beds in your own barangay.",
  },
  {
    q: "What do I need to do?",
    a: "Almost nothing. Put the hair clippings in the sack we give you. We visit, we collect, we do the paperwork. There is no app and no account.",
  },
  {
    q: "What will happen to my hair clippings?",
    a: "We weigh them, mix them with dry leaves and other plant material, and let them rest for about six weeks. A laboratory checks the compost before it is used.",
  },
  {
    q: "What do I get from participating?",
    a: "A receipt for every pickup, the lab result, and compost for your barangay's planting beds. Your shop is also named in our network as a contributor.",
  },
];

const navCards = [
  { href: "/system", label: "How does it work?", desc: "See the five simple steps.", icon: Recycle },
  { href: "/partner", label: "Why become a partner?", desc: "What your shop gets back.", icon: Users },
  { href: "/network", label: "Shop Partners", desc: "See the shops already with us.", icon: Store },
  { href: "/system", label: "Collection process", desc: "From the chair to the soil.", icon: Truck },
  { href: "/partner", label: "Register your shop", desc: "Ask for a free visit.", icon: ClipboardList },
];

/* The machine, in five short steps — shown at the top so visitors see how it
   works the moment they scroll. Taps through to the full process page. */
const drumSteps = [
  { n: "01", title: "We collect", body: "A labelled sack at your shop. We come to you." },
  { n: "02", title: "We check", body: "Hair only is best; a little tissue is still fine." },
  { n: "03", title: "We mix", body: "Hair + dry leaves, weighed and logged as one batch." },
  { n: "04", title: "We cure", body: "About six weeks of resting, turning and checking." },
  { n: "05", title: "Lab checks", body: "A laboratory approves it before we call it compost." },
];

/* The answer to "what happens when I join?" — written to make joining feel welcoming. */
const joinSteps = [
  {
    n: "01",
    title: "We visit your shop",
    body: "A collection team member comes at a quiet hour, asks a few questions and leaves you a labelled sack. It takes almost none of your time.",
  },
  {
    n: "02",
    title: "You keep cutting hair",
    body: "Put the hair clippings into the sack. Nothing else in your day changes. No app, no login, no new habit.",
  },
  {
    n: "03",
    title: "We pick it up",
    body: "We come back on the days that suit you. You never need to travel anywhere or wait at a counter.",
  },
  {
    n: "04",
    title: "We make compost",
    body: "We weigh the hair, mix it with dry leaves and other plant material, and let it rest. A laboratory checks every batch.",
  },
  {
    n: "05",
    title: "Your town gets the soil",
    body: "You get a receipt and the lab result. The compost goes to planting beds in your barangay.",
  },
];

export default function HomePage() {
  const enrolled = shops.filter((s) => s.status === "Enrolled");
  const preview = shops.filter((s) => s.status === "Enrolled" || s.status === "Candidate").slice(0, 5);

  return (
    <>
      {/* ------------------------------------------- introduction (always visible) */}
      <section className="grain relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <HairWeave className="opacity-55" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
        </div>

        <div className="shell relative z-10 pb-10 pt-12 sm:pt-16 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-16">
            <div>
              <Reveal>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="flex items-center gap-2">
                    <span className="live-dot size-1.5 rounded-full bg-moss" aria-hidden />
                    <span className="eyebrow text-moss">Now collecting · Barangay Novaliches Proper</span>
                  </span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="display mt-7 text-[clamp(2.4rem,6.2vw,5.4rem)] text-ink">
                  Hair clippings
                  <br />
                  become <em className="text-moss">soil</em>
                  <br />
                  for your barangay.
                </h1>
              </Reveal>
            </div>

            <Reveal delay={160} className="lg:pb-3">
              <p className="text-[0.9375rem] leading-[1.7] text-ink-soft">
                <strong className="font-medium text-ink">Hair2Harvest is a free collection service
                for barbershops.</strong> We pick up the hair you sweep up and turn it into compost
                for planting beds nearby. We come to you — there is no app, no login and no extra
                work for your shop.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Link href="/partner" className="btn btn-sm">
                  Join the shops
                  <ArrowUpRight size={14} />
                </Link>
                <Link href="/system" className="btn btn-ghost btn-sm">
                  How it works
                </Link>
              </div>
              <p className="text-[0.8125rem] leading-[1.7] text-ink-soft">
                <strong className="font-medium text-ink">
                  A capstone project with Barangay Novaliches Proper.
                </strong>{" "}
                We turn salon and barbershop hair waste into compost for local planting beds.
              </p>
              <p className="mono-tag mt-5 text-ink-mute">
                FREE TO JOIN · NO APP · NO LOGIN
                <br />
                WE COME TO YOUR SHOP
              </p>
            </Reveal>
          </div>

          <Reveal delay={220} className="mt-12 lg:mt-14">
            <div className="grid grid-cols-3 gap-x-6 gap-y-5 border-t border-[var(--line)] pt-6">
              <Stat value={String(shops.length)} label="Shops with us" note="Barangay Novaliches Proper" />
              <Stat
                value={overviewStats.totalKg.toFixed(1)}
                unit="kg"
                label="Hair collected"
                note="Weighed, not guessed"
              />
              <Stat value="0" label="Passwords to remember" note="No account needed" />
            </div>
          </Reveal>
        </div>
      </section>

      <Ticker />

      {/* ------------------------------- how it works (machine / drum, top) */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="00"
              label="How it works"
              title={
                <>
                  The drum that turns
                  <br />
                  hair into <em>soil</em>.
                </>
              }
              lede="One machine, five simple steps. We bring a sack to your shop, collect the hair, and let it rest into compost. Drag the drum to look around — then tap through for the full process."
            />
          </Reveal>

          <Reveal delay={100}>
            <MachineFrame>
              <CompostingDrum />
            </MachineFrame>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-10 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-5">
              {drumSteps.map((s, i) => (
                <div key={s.n} className="bg-paper p-5">
                  <span className="mono-tag text-clay">{s.n}</span>
                  <h3 className="mt-3 text-[0.9375rem] font-medium tracking-[-0.01em] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-ink-soft">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link href="/system" className="btn btn-sm">
                See the full process
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- where to go */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="00"
              label="Where to next"
              title={
                <>
                  Find what you <em>need</em>.
                </>
              }
              lede="Everything is one tap away. You do not have to read the whole page."
            />
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {navCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.label} delay={i * 60}>
                  <Link
                    href={c.href}
                    className="group flex h-full flex-col rounded-[4px] border border-[var(--line)] bg-paper p-5 transition-colors hover:border-moss/40 hover:bg-[color-mix(in_oklab,var(--moss)_6%,transparent)]"
                  >
                    <Icon size={20} className="text-moss" aria-hidden />
                    <p className="mt-4 text-[0.9375rem] font-medium tracking-[-0.01em] text-ink">
                      {c.label}
                    </p>
                    <p className="mt-1.5 text-[0.75rem] leading-snug text-ink-soft">{c.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[0.6875rem] font-medium text-moss">
                      Open
                      <ArrowUpRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------- what happens when you join */}
      <section className="relative overflow-hidden border-y border-[var(--line)] bg-moss-deep text-paper">
        <div className="shell section">
          <Reveal>
            <p className="eyebrow text-lime">What happens when you join?</p>
            <h2 className="display mt-5 max-w-[30ch] text-[clamp(1.9rem,4.2vw,3.4rem)] text-paper">
              You become one of the shops <em className="text-lime">making soil</em> for your own
              town.
            </h2>
            <p className="mt-5 max-w-[58ch] text-[0.9375rem] leading-[1.7] text-paper/75">
              Joining is simple. There is no long form to fill in, no app and no account. Here is
              everything that happens, in five easy steps.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px border border-paper/12 bg-paper/12 sm:grid-cols-2 lg:grid-cols-5">
            {joinSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70} className="bg-moss-deep">
                <div className="h-full bg-moss-deep p-5">
                  <span className="mono-tag text-lime">{s.n}</span>
                  <h3 className="mt-5 text-[0.9375rem] font-medium tracking-[-0.01em] text-paper">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-[1.65] text-paper/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-paper/12 pt-8">
              <p className="max-w-[52ch] text-[0.9375rem] leading-[1.7] text-paper/80">
                Your shop&rsquo;s name is listed in our network as a <strong className="font-medium text-paper">contributor</strong>.
                You keep cutting hair — we do the rest.
              </p>
              <Link href="/partner" className="btn btn-lime">
                Yes, count me in
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- four quick answers */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              index="01"
              label="Four quick answers"
              title={
                <>
                  Before you <em>decide</em>.
                </>
              }
              lede="Short, plain answers. No technical words."
            />
          </Reveal>

          <div className="mt-10 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 70} className="bg-paper">
                <div className="h-full bg-paper p-6">
                  <div className="flex items-start gap-4">
                    <span className="mono-tag pt-1 text-clay">0{i + 1}</span>
                    <div>
                      <h3 className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                        {f.q}
                      </h3>
                      <p className="mt-2.5 max-w-[52ch] text-[0.875rem] leading-[1.7] text-ink-soft">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- network */}
      <section className="border-y border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="shell section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <SectionHead
                index="02"
                label="Shop Partners"
                title={
                  <>
                    Shops already
                    <br />
                    <em>with us</em>.
                  </>
                }
                lede="These are real barbershops in Bataan. We show only the shop name, barangay and partnership status — contact and pickup details stay private."
              />
              <Link
                href="/network"
                className="group mt-7 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-moss"
              >
                See all shops
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>

            <Reveal delay={100}>
              <div className="card-print overflow-hidden">
                <div className="hidden grid-cols-[1fr_1fr_96px] gap-4 border-b border-[var(--line)] px-5 py-3 sm:grid">
                  {["Shop", "Barangay", "Status"].map((h, i) => (
                    <span
                      key={h}
                      className={`mono-tag uppercase text-ink-mute ${i === 2 ? "text-right" : ""}`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <ul>
                  {preview.map((s) => (
                    <li
                      key={s.code}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-[var(--line)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--paper-sunk)] sm:grid-cols-[1fr_1fr_96px] sm:gap-y-0"
                    >
                      <span className="order-1 text-[0.875rem] font-medium text-ink sm:order-none">
                        {s.name}
                      </span>
                      <span className="order-3 text-[0.75rem] text-ink-soft sm:order-none">
                        {s.barangay}
                      </span>
                      <span className="order-2 sm:order-none sm:text-right">
                        <Pill
                          tone={
                            s.status === "Enrolled"
                              ? "moss"
                              : s.status === "Candidate"
                                ? "lime"
                                : s.status === "Paused"
                                  ? "clay"
                                  : "mute"
                          }
                        >
                          {s.status}
                        </Pill>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
                  <span className="mono-tag text-ink-mute">SHOWING {preview.length} OF {shops.length}</span>
                  <span className="mono-tag text-moss">{enrolled.length} ENROLLED</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow">Ready when you are</p>
              <h2 className="display mt-6 text-[clamp(2.2rem,5.6vw,4.6rem)] text-ink">
                Give us your hair.
                <br />
                We&rsquo;ll give you
                <br />
                the <em className="text-moss">receipt</em>.
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="max-w-[42ch] text-[0.9375rem] leading-[1.7] text-ink-soft">
                A collection team member visits your shop, asks a few questions and leaves a labelled sack.
                It takes almost none of your time. No password, no dashboard, no new habit.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/partner" className="btn">
                  Join the shops
                  <ArrowUpRight size={15} />
                </Link>
                <Link href="/network" className="btn btn-ghost">
                  See the shops
                </Link>
              </div>
              <p className="mono-tag mt-6 text-ink-mute">
                QUESTIONS? CALL OR MESSAGE US — A REAL PERSON ANSWERS.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
