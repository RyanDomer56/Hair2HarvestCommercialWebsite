/**
 * "Where can I find it?" — a small, hand-checked map of the site.
 *
 * The assistant uses this to point a visitor to the exact page (and section)
 * instead of only describing it in words. Every href below is a real route in
 * this app, so a suggestion is always a working link.
 *
 * Keywords include plain English and common Tagalog/Taglish words because the
 * shop owners who use the site mix both. The titles and blurbs are shown in the
 * chatbot help panel and are written in Tagalog (the site default language).
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
    title: "Panimula",
    href: "/",
    blurb: "Kung ano ang Hair2Harvest, ang apat na mabilis na sagot, at kung ano ang mangyayari kapag sumali ka.",
    group: "Learn",
    keywords: [
      "introduction", "intro", "home", "homepage", "start", "what is", "about the service",
      "overview", "simula", "ano ito", "ano ang", "panimula", "paano magsimula",
    ],
  },
  {
    id: "faq",
    title: "Apat na mabilis na sagot",
    href: "/",
    blurb: "Ano ito, ano ang gagawin ko, ano ang mangyayari sa buhok, ano ang makukuha ko.",
    group: "Learn",
    keywords: [
      "faq", "questions", "what do i get", "benefit", "what do i need to do",
      "participate", "mga tanong", "anong makukuha", "ano ang makukuha", "benepisyo",
    ],
  },
  {
    id: "join-story",
    title: "Ano ang mangyayari kapag sumali",
    href: "/",
    blurb: "Ang limang madaling hakbang mula sa unang bisita hanggang sa kompost para sa inyong barangay.",
    group: "Join",
    keywords: [
      "what happens when i join", "what happens when you join", "steps", "process of joining",
      "contributor", "ano mangyayari", "kapag sumali", "mga hakbang", "proseso",
    ],
  },
  {
    id: "system",
    title: "Paano ito gumagana",
    href: "/system",
    blurb: "Ang limang hakbang, ipinaliwanag sa simpleng salita, pati na rin ang mga nota para sa mga researcher.",
    group: "Learn",
    keywords: [
      "how it works", "how does it work", "system", "the system", "process", "collection process",
      "five steps", "paano", "paano gumagana", "sistema", "proseso ng koleksyon",
    ],
  },
  {
    id: "grading",
    title: "Pagsusuri sa buhok",
    href: "/system#grading",
    blurb: "Malinis, bahagyang halo, o hindi magamit — at kung bakit walang tindahang mapapahamak.",
    group: "Learn",
    keywords: [
      "grading", "grade", "clean", "minor", "mixed", "contamination", "quality", "sort",
      "plastic", "tissue", "pagtsek", "klase ng buhok", "marumi", "halo",
    ],
  },
  {
    id: "batch",
    title: "Bawat batch at ang inyong privasiya",
    href: "/system#batch",
    blurb: "Kung bakit isinusulat namin ang mga batch, at kung aling detalye ng tindahan ang nananatiling pribado.",
    group: "Learn",
    keywords: [
      "batch", "curing", "composting", "privacy", "private", "data", "chain of custody",
      "recipe", "mixture", "paghahalo", "privado", "kompost", "pagbuburo",
    ],
  },
  {
    id: "machine",
    title: "Ang tambol / 3D na makina",
    href: "/system",
    blurb: "Ang tanging makinang ginagamit namin. Ihila para paikutin, pindutin ang bahagi para makita ang pangalan.",
    group: "Learn",
    keywords: [
      "machine", "drum", "rotary", "3d", "model", "prototype", "mch-01", "motor", "equipment",
      "makina", "tambol", "3d model", "prototype",
    ],
  },
  {
    id: "network",
    title: "Mga Tindahang Partner",
    href: "/network",
    blurb: "Ang pampublikong listahan ng mga tindahan — pangalan, barangay, at katayuan lang.",
    group: "Learn",
    keywords: [
      "shop network", "shop partners", "shop list", "directory", "shops", "barbershops", "list of shops",
      "enrolled", "candidate", "paused", "withdrawn", "status", "filter", "search",
      "listahan", "tindahan", "barbero", "barbershop", "hanapin", "katayuan",
    ],
  },
  {
    id: "pickups",
    title: "Pagkolekta at kung ano ang pribado",
    href: "/network#rules",
    blurb: "Paano namin ina-agree ang araw ng pagkolekta, at ang mga detalyeng hindi namin inilalathala.",
    group: "Learn",
    keywords: [
      "pickup", "schedule", "collection", "days", "time", "window", "frequency", "access notes",
      "contact person", "mobile number", "kolekta", "kuha", "iskedyul", "oras", "araw",
      "pribado", "detalye",
    ],
  },
  {
    id: "partner",
    title: "Sumali / rehistro ng tindahan",
    href: "/partner",
    blurb: "Ang maikling form at ang apat na madaling hakbang sa pagpasok.",
    group: "Join",
    keywords: [
      "register", "registration", "join", "sign up", "enrol", "enroll", "partner", "form",
      "apply", "get started", "request a visit", "magparehistro", "sumali", "rehistro",
      "pormularyo", "form", "magpatala", "paano sumali",
    ],
  },
  {
    id: "contact",
    title: "Makipag-ugnayan",
    href: "/partner#contact",
    blurb: "Numero ng telepono, email, at kung nasaan kami — may totoong taong sasagot.",
    group: "Join",
    keywords: [
      "contact", "phone", "mobile", "email", "call", "message", "talk to a person", "support",
      "help", "address", "location", "makipag-ugnayan", "tawag", "numero", "kontak",
      "tulong", "sagot",
    ],
  },
  {
    id: "about",
    title: "Tungkol sa amin",
    href: "/about",
    blurb: "Kung sino kami, ang aming kwento, at ang aming paniniwala.",
    group: "Learn",
    keywords: [
      "about", "about us", "who we are", "story", "team", "students", "group", "capstone",
      "tungkol", "tungkol sa amin", "kwento", "koponan", "miyembro", "grupo",
    ],
  },
  {
    id: "team",
    title: "Ang aming koponan",
    href: "/about#team",
    blurb: "Ang 13 miyembro at kung ano ang ginagawa ng bawat isa.",
    group: "Learn",
    keywords: [
      "team", "members", "names", "developers", "documentation", "quality assurance",
      "project manager", "domer", "tulba", "quimiguing", "koponan", "miyembro", "pangalan",
    ],
  },
  {
    id: "impact",
    title: "Mga Resulta ng Pagkolekta",
    href: "/impact",
    blurb: "Tinimbang na pagkolekta, resulta ng laboratoryo, at mga planting trial.",
    group: "Learn",
    keywords: [
      "evidence", "impact", "our impact", "results", "data", "lab", "laboratory", "n-p-k", "planting",
      "trials", "kilograms", "measured", "ebidensya", "resulta", "sinukat", "datos",
    ],
  },
];

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();

/** Rank the places that best match a free-text question. */
export function findInSystem(input: string, limit = 3): HelpPlace[] {
  const text = norm(input);
  if (!text) return [];
  const tokens = new Set(text.split(" ").filter((t) => t.length > 1));
  const scored = HELP_PLACES.map((place) => {
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

export const HELP_GROUPS: Array<HelpPlace["group"]> = ["Learn", "Join"];
