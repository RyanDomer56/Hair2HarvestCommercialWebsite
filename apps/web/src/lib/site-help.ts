/**
 * "Where can I find it?" — a small, hand-checked map of the site.
 *
 * The assistant uses this to point a visitor to the exact page (and section)
 * instead of only describing it in words. Every href below is a real route in
 * this app, so a suggestion is always a working link.
 *
 * Keywords include plain English and common Tagalog/Taglish words because the
 * shop owners who use the site mix both.
 */

export type HelpPlace = {
  id: string;
  title: string;
  href: string;
  blurb: string;
  group: "Learn" | "Join" | "For staff";
  keywords: string[];
};

export const HELP_PLACES: HelpPlace[] = [
  {
    id: "intro",
    title: "Introduction",
    href: "/",
    blurb: "What Hair2Harvest is, the four quick answers, and what happens when you join.",
    group: "Learn",
    keywords: [
      "introduction", "intro", "home", "homepage", "start", "what is", "about the service",
      "overview", "simula", "ano ito", "ano ang", "panimula", "paano magsimula",
    ],
  },
  {
    id: "faq",
    title: "Four quick answers",
    href: "/",
    blurb: "What is it, what do I do, what happens to the hair, what do I get.",
    group: "Learn",
    keywords: [
      "faq", "questions", "what do i get", "benefit", "what do i need to do",
      "participate", "mga tanong", "anong makukuha", "ano ang makukuha", "benepisyo",
    ],
  },
  {
    id: "join-story",
    title: "What happens when you join",
    href: "/",
    blurb: "The five easy steps from our first visit to compost for your barangay.",
    group: "Join",
    keywords: [
      "what happens when i join", "what happens when you join", "steps", "process of joining",
      "contributor", "ano mangyayari", "kapag sumali", "mga hakbang", "proseso",
    ],
  },
  {
    id: "system",
    title: "How it works",
    href: "/system",
    blurb: "The five steps, explained in plain words, plus notes for researchers.",
    group: "Learn",
    keywords: [
      "how it works", "how does it work", "system", "the system", "process", "collection process",
      "five steps", "paano", "paano gumagana", "sistema", "proseso ng koleksyon",
    ],
  },
  {
    id: "grading",
    title: "Checking the hair",
    href: "/system#grading",
    blurb: "Clean, a little mixed, or not usable — and why no shop gets in trouble.",
    group: "Learn",
    keywords: [
      "grading", "grade", "clean", "minor", "mixed", "contamination", "quality", "sort",
      "plastic", "tissue", "pagtsek", "klase ng buhok", "marumi", "halo",
    ],
  },
  {
    id: "batch",
    title: "Every batch & your privacy",
    href: "/system#batch",
    blurb: "Why we write batches down, and which shop details stay private.",
    group: "Learn",
    keywords: [
      "batch", "curing", "composting", "privacy", "private", "data", "chain of custody",
      "recipe", "mixture", "paghahalo", "privado", "kompost", "pagbuburo",
    ],
  },
  {
    id: "machine",
    title: "The drum / 3D machine",
    href: "/system",
    blurb: "The only machine we use. Drag to turn it, tap a part to see its name.",
    group: "Learn",
    keywords: [
      "machine", "drum", "rotary", "3d", "model", "prototype", "mch-01", "motor", "equipment",
      "makina", "tambol", "3d model", "prototype",
    ],
  },
  {
    id: "network",
    title: "Shop network",
    href: "/network",
    blurb: "The public list of shops — name, barangay and status only.",
    group: "Learn",
    keywords: [
      "shop network", "shop list", "directory", "shops", "barbershops", "list of shops",
      "enrolled", "candidate", "paused", "withdrawn", "status", "filter", "search",
      "listahan", "tindahan", "barbero", "barbershop", "hanapin", "katayuan",
    ],
  },
  {
    id: "pickups",
    title: "Pickups & what stays private",
    href: "/network#rules",
    blurb: "How we agree pickup days, and the details we never publish.",
    group: "Learn",
    keywords: [
      "pickup", "schedule", "collection", "days", "time", "window", "frequency", "access notes",
      "contact person", "mobile number", "kolekta", "kuha", "iskedyul", "oras", "araw",
      "pribado", "detalye",
    ],
  },
  {
    id: "partner",
    title: "Join / register a shop",
    href: "/partner",
    blurb: "The short form and the four easy steps to joining.",
    group: "Join",
    keywords: [
      "register", "registration", "join", "sign up", "enroll", "enrol", "partner", "form",
      "apply", "get started", "request a visit", "magparehistro", "sumali", "rehistro",
      "pormularyo", "form", "magpatala", "paano sumali",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    href: "/partner#contact",
    blurb: "Phone number, email and where we are — a real person answers.",
    group: "Join",
    keywords: [
      "contact", "phone", "mobile", "email", "call", "message", "talk to a person", "support",
      "help", "address", "location", "makipag-ugnayan", "tawag", "numero", "kontak",
      "tulong", "sagot",
    ],
  },
  {
    id: "about",
    title: "About us",
    href: "/about",
    blurb: "Who we are, our story and what we believe.",
    group: "Learn",
    keywords: [
      "about", "about us", "who we are", "story", "team", "students", "group", "capstone",
      "tungkol", "tungkol sa amin", "kwento", "koponan", "miyembro", "grupo",
    ],
  },
  {
    id: "team",
    title: "Our team",
    href: "/about#team",
    blurb: "The 13 members and what each one looks after.",
    group: "Learn",
    keywords: [
      "team", "members", "names", "developers", "documentation", "quality assurance",
      "project manager", "domer", "tulba", "quimiguing", "koponan", "miyembro", "pangalan",
    ],
  },
  {
    id: "impact",
    title: "Evidence / what we measured",
    href: "/impact",
    blurb: "Weighed pickups, laboratory results and planting trials.",
    group: "Learn",
    keywords: [
      "evidence", "impact", "results", "data", "lab", "laboratory", "n-p-k", "planting",
      "trials", "kilograms", "measured", "ebidensya", "resulta", "sinukat", "datos",
    ],
  },
  {
    id: "staff-shops",
    title: "Staff: shop registry",
    href: "/dashboard/shops",
    blurb: "Full shop details, contact info and access notes — staff only.",
    group: "For staff",
    keywords: [
      "staff", "admin", "dashboard", "shop registry", "full details", "internal", "records",
      "export csv", "staff directory", "empleyado", "rehistro ng tindahan",
    ],
  },
  {
    id: "staff-pickups",
    title: "Staff: pickups",
    href: "/dashboard/pickups",
    blurb: "Pickup log, sack counts and the collector route.",
    group: "For staff",
    keywords: [
      "pickup log", "collector route", "route", "sacks", "weighed", "staff pickups",
      "ruta", "log ng kolekta",
    ],
  },
  {
    id: "staff-batches",
    title: "Staff: batches",
    href: "/dashboard/batches",
    blurb: "Batch stages, recipes and curing progress.",
    group: "For staff",
    keywords: ["batch stage", "batch list", "curing progress", "staff batches", "lista ng batch"],
  },
  {
    id: "staff-lab",
    title: "Staff: laboratory",
    href: "/dashboard/lab",
    blurb: "Lab reports and approval decisions.",
    group: "For staff",
    keywords: ["lab report", "approval", "verdict", "staff lab", "ulat ng laboratoryo"],
  },
  {
    id: "staff-machine",
    title: "Staff: machine",
    href: "/dashboard/machine",
    blurb: "Machine status and session logs.",
    group: "For staff",
    keywords: ["machine status", "session log", "telemetry", "staff machine", "katayuan ng makina"],
  },
];

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();

/** Staff-only pages should never be the first thing shown to a public visitor. */
const STAFF_WORDS = [
  "staff", "admin", "dashboard", "internal", "workspace", "operator", "registry view",
  "empleyado", "loob ng sistema",
];

/** Rank the places that best match a free-text question. */
export function findInSystem(input: string, limit = 3): HelpPlace[] {
  const text = norm(input);
  if (!text) return [];
  const tokens = new Set(text.split(" ").filter((t) => t.length > 1));
  const asksForStaff = STAFF_WORDS.some((w) => text.includes(norm(w)));

  const scored = HELP_PLACES.filter(
    (place) => asksForStaff || place.group !== "For staff",
  ).map((place) => {
    let score = 0;
    for (const kw of place.keywords) {
      const k = norm(kw);
      if (!k) continue;
      if (k.includes(" ")) {
        if (text.includes(k)) score += 6;
      } else if (tokens.has(k)) {
        score += 4;
      } else if (text.includes(k)) {
        score += 2;
      }
    }
    for (const word of norm(place.title).split(" ")) {
      if (word.length > 3 && tokens.has(word)) score += 2;
    }
    return { place, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((x) => x.place);
}

export const HELP_GROUPS: Array<HelpPlace["group"]> = ["Learn", "Join", "For staff"];
