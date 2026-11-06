/**
 * Grounded answer corpus for the system assistant.
 *
 * Every entry is a fact stated in docs/01-system-design.md,
 * docs/02-design-system.md or docs/03-data-model.md. Nothing here is
 * generated or guessed — the assistant is a retrieval UI over the
 * specification, not a generative model. Each answer carries its source.
 */

export type ChatSource = "System design" | "Data model" | "Design system";

export type KnowledgeEntry = {
  id: string;
  topic: string;
  question: string;
  aliases: string[];
  answer: string;
  source: string;
  doc: ChatSource;
  related?: string[];
};

/** Verified contact details — shown when the assistant has no checked answer. */
export const CONTACT = {
  phone: "+63 917 000 0000",
  phoneLink: "+639170000000",
  email: "hello@hair2harvest.ph",
  hours: "Mon–Sat, 9 AM–7 PM",
};

export const FALLBACK_ANSWER =
  "I don't have a checked answer for that, and I don't want to guess — especially about pickup times or joining. Please call or message us and a real person will help: " +
  `${CONTACT.phone} (${CONTACT.hours}), or ${CONTACT.email}. You can also tap one of the questions below.`;

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "what-is",
    topic: "Overview",
    question: "What is Hair2Harvest?",
    aliases: ["what is hair2harvest", "what does hair2harvest do", "about the project", "overview", "purpose", "idea", "concept", "explain the project", "elevator", "hair2harvest"],
    answer:
      "Hair2Harvest is a free service for barbershops in Balanga, Bataan. We pick up the hair you sweep up, mix it with dry leaves and other plant material, and turn it into compost for planting beds nearby. We come to your shop — there is no app, no login and no extra work for you.",
    source: "§1 What the system is",
    doc: "System design",
    related: ["no-accounts", "modules", "partner"],
  },
  {
    id: "no-accounts",
    topic: "Shops",
    question: "Do shops need an account or login?",
    aliases: ["login", "log in", "have to log", "need a login", "account", "password", "sign up", "signup", "supplier", "barbershop", "shop account", "user", "auth", "register themselves"],
    answer:
      "No. A barbershop never signs up and never needs a password. A staff member visits, fills in a short form and leaves a labelled sack. You just keep cutting hair.",
    source: "§1 · core decision",
    doc: "System design",
    related: ["register", "shop-code", "roles"],
  },
  {
    id: "register",
    topic: "Shops",
    question: "How is a shop registered?",
    aliases: ["register", "registration", "enrol", "enroll", "onboard", "join", "form", "sign up"],
    answer:
      "A staff member visits your shop, asks a few simple questions and fills in the form for you. It takes almost none of your time. We leave a labelled sack and agree the pickup days with you then. There is no account to create and nothing for you to fill in online. To ask for a visit, use the 'Join the shops' form on this website or call us.",
    source: "§1.2 · Module 2",
    doc: "System design",
    related: ["shop-code", "pickup-rules", "status-shop"],
  },
  {
    id: "shop-code",
    topic: "Shops",
    question: "What is a shop code?",
    aliases: ["code", "hb-", "sack", "identifier", "id", "label"],
    answer:
      "The code written on a shop's hair sack — HB-001, HB-002, … It is the shop's identity across the registry, pickup log, batch lots and reports. There is no account behind it.",
    source: "§1.2 · Shops model",
    doc: "System design",
    related: ["register", "weighing", "status-shop"],
  },
  {
    id: "pickup-rules",
    topic: "Collection",
    question: "How are pickup schedules decided?",
    aliases: ["schedule", "frequency", "days", "twice weekly", "pickup rule", "window", "peak", "timing", "when"],
    answer:
      "We agree the pickup days and time with each shop during our visit, so it fits the shop's own hours. We always come to you — you never need to travel. These details are private: only Hair2Harvest staff can see them. For the exact time for a particular shop, please call or message us.",
    source: "§1.2 · §2 · Module 3",
    doc: "System design",
    related: ["collector", "map", "notifications"],
  },
  {
    id: "collector",
    topic: "Collection",
    question: "Do shops drop the hair off?",
    aliases: ["drop off", "dropoff", "collect", "collector", "travel", "come to", "deliver", "who picks"],
    answer:
      "No drop-off flow. The collector goes to the shop — shops with shift work will not travel to a barangay office. The phone-first route list works offline for mall back rooms with no signal.",
    source: "§1.2 · §2",
    doc: "System design",
    related: ["pickup-rules", "offline", "notifications"],
  },
  {
    id: "weighing",
    topic: "Collection",
    question: "How is hair weighed?",
    aliases: ["weigh", "weight", "kilograms", "kg", "net", "gross", "sacks", "measure", "sack"],
    answer:
      "Each pickup records the number of sacks, gross kilograms and a standard sack tare. Net kg is derived in a pre-validate hook as gross − tare, so a client cannot post a net weight that disagrees. Net kg can never be negative.",
    source: "§5 · Pickups model",
    doc: "Data model",
    related: ["tare", "grades", "shop-code"],
  },
  {
    id: "tare",
    topic: "Collection",
    question: "What sack tare do you use?",
    aliases: ["tare", "0.18", "assumption", "sack weight", "configured"],
    answer:
      "We subtract a small standard weight for the empty sack (0.18 kg) from the total, so the number we record is the hair alone. This keeps our weights fair and consistent.",
    source: "§6 open items · Pickups model",
    doc: "System design",
    related: ["weighing", "grades"],
  },
  {
    id: "grades",
    topic: "Quality",
    question: "What are the contamination grades?",
    aliases: ["grade", "clean", "minor", "mixed", "contamination", "quality", "grading", "sort"],
    answer:
      "Three grades recorded at the door: Clean, Minor and Mixed. Mixed triggers a coaching note, never a rejection. Only Clean and Minor stock can enter a batch.",
    source: "§1.2 · §3.2",
    doc: "System design",
    related: ["treated", "mixed", "batch-stock"],
  },
  {
    id: "mixed",
    topic: "Quality",
    question: "Are mixed sacks rejected?",
    aliases: ["reject", "rejection", "mixed", "coaching", "contaminated", "waste", "plastic"],
    answer:
      "No. Mixed grade triggers a coaching note, not a rejection. The container is the intervention: hair arrives mixed with tissue and sachets only when no container exists for it, so the programme brings one.",
    source: "§1.2",
    doc: "System design",
    related: ["grades", "treated", "register"],
  },
  {
    id: "treated",
    topic: "Quality",
    question: "What happens to treated hair?",
    aliases: ["treated", "chemical", "coloured", "colored", "rebonded", "hold", "unsure", "separate"],
    answer:
      "If hair has been chemically treated, or we are not sure, we keep it aside. It does not go into compost until we are certain it is safe. We still collect it from the shop — nothing is refused. A staff member can explain more during the visit.",
    source: "§1.2 · §3.2 · §6",
    doc: "System design",
    related: ["batch-stock", "grades", "mixed"],
  },
  {
    id: "status-shop",
    topic: "Status",
    question: "What are the shop statuses?",
    aliases: ["status", "candidate", "enrolled", "paused", "withdrawn", "lifecycle", "state"],
    answer:
      "Enrolled means an active partner — we pick up hair regularly. Candidate means the shop is interested or has been visited, but pickups have not started yet. Paused means the shop is taking a break but is still part of the network. Withdrawn means the shop no longer takes part. Only Enrolled shops are being collected from.",
    source: "§3.2 · Shops route",
    doc: "System design",
    related: ["register", "status-pickup", "status-batch"],
  },
  {
    id: "status-pickup",
    topic: "Status",
    question: "What are the pickup statuses?",
    aliases: ["pickup status", "scheduled", "collected", "weighed", "skipped", "rescheduled", "stock lot"],
    answer:
      "Scheduled → Collected → Weighed → In Stock. A pickup can also be Skipped (shop closed or sack not full — explicitly not a shop failure) or Rescheduled, which requires a reason.",
    source: "§3.2",
    doc: "System design",
    related: ["status-batch", "weighing", "status-shop"],
  },
  {
    id: "status-batch",
    topic: "Status",
    question: "What are the batch stages?",
    aliases: ["batch status", "stage", "preparing", "composting", "curing", "sampling", "pending", "on hold", "approved"],
    answer:
      "Preparing → Composting → Curing → Sampling → Pending, then On Hold, Rejected, or Approved for Supervised Testing. Approval is blocked server-side until lab results are reviewed.",
    source: "§3.2 · §5",
    doc: "System design",
    related: ["approval", "curing", "lab"],
  },
  {
    id: "batch-stock",
    topic: "Batching",
    question: "Which hair can enter a batch?",
    aliases: ["batch", "eligible", "stock", "lots", "409", "insufficient", "available", "input"],
    answer:
      "Only Clean or Minor, untreated, Weighed stock. POST /batches sums eligible net kg and returns 409 with availableKg when the requested input exceeds it. A batch can never exceed available stock.",
    source: "§5 · Batches route",
    doc: "Data model",
    related: ["status-batch", "recipe", "approval"],
  },
  {
    id: "recipe",
    topic: "Batching",
    question: "What is the compost recipe?",
    aliases: ["recipe", "v3", "ratio", "hair 45", "carbon", "greens", "mix", "formula", "ingredients"],
    answer:
      "Recipes are versioned against each batch. The active BATCH-2603 uses v3.3 — hair 45 / carbon 30 / greens 25. Earlier batches used v3.2 (40 / 35 / 25) and v3.1 (35 / 40 / 25).",
    source: "Batches model · pilot data",
    doc: "Data model",
    related: ["curing", "batch-stock", "machine"],
  },
  {
    id: "curing",
    topic: "Batching",
    question: "How long does composting take?",
    aliases: ["how long", "how long does", "how many days", "curing stage", "45 days", "forty", "curing", "days", "duration", "maturity", "reheat"],
    answer:
      "35–45 days to cured compost, and the stage cannot be skipped. A pile that reheats is not mature. BATCH-2512 is the verified example: 22.0 kg in, 12.9 kg out after 45 days — a 41.4% mass reduction.",
    source: "§3.2 · pilot data",
    doc: "System design",
    related: ["recipe", "lab", "evidence"],
  },
  {
    id: "machine",
    topic: "Machine",
    question: "What does the MCH-01 machine do?",
    aliases: ["machine", "mch-01", "motor", "drum", "rpm", "composting drum", "3d", "telemetry", "probe", "belt"],
    answer:
      "A finned motor and gearbox drive a belt around the drum shaft at 8 rpm. Helical paddles turn the mix inside a cutaway barrel; hair enters through a hopper, cured compost leaves the chute, and a core probe logs temperature and moisture. It is the machine described by Modules 5 and 6.",
    source: "§3 Modules 5–6 · 3D diagram",
    doc: "System design",
    related: ["safety", "recipe", "3d"],
  },
  {
    id: "safety",
    topic: "Machine",
    question: "Can the web panel control the machine?",
    aliases: ["control", "e-stop", "estop", "safety", "hardware", "start", "stop", "interlock", "remote", "shutoff"],
    answer:
      "Only authorised start/stop on an approved cycle. Emergency stop, lid interlock and motor shutoff stay in local hardware — the web never replaces the safety circuit. That boundary is drawn in rust on the control cabinet.",
    source: "§1.1 · Module 6",
    doc: "System design",
    related: ["machine", "modules", "audit"],
  },
  {
    id: "lab",
    topic: "Evidence",
    question: "What does the laboratory test?",
    aliases: ["lab", "laboratory", "test", "n-p-k", "npk", "ph", "moisture", "pathogens", "maturity", "sample"],
    answer:
      "N-P-K, pH, moisture, maturity and pathogens, with the report attached. Re-tests append a new version — lab results are never overwritten. BATCH-2512 passed at N 1.42, P 0.86, K 1.19, pH 7.1, mature, pathogens absent.",
    source: "§3 Module 7 · LabResults model",
    doc: "System design",
    related: ["approval", "evidence", "status-batch"],
  },
  {
    id: "approval",
    topic: "Evidence",
    question: "When can a batch be approved?",
    aliases: ["who can approve", "who approves", "approve a batch", "approve", "approval", "sign off", "gate", "blocked", "review", "supervised"],
    answer:
      "Not until lab results are reviewed. The approval gate is enforced server-side, not in the UI: PATCH /batches/:code/stage returns 409 when stage is Approved and no passing, reviewed lab result exists.",
    source: "§1.1 · §5 · Batches route",
    doc: "System design",
    related: ["lab", "status-batch", "evidence"],
  },
  {
    id: "evidence",
    topic: "Evidence",
    question: "What evidence exists so far?",
    aliases: ["evidence", "impact", "results", "data", "kg collected", "planting", "trial", "n = 1", "preliminary"],
    answer:
      "A verified lab report for BATCH-2512, a batch mass-balance register, a collection trend, and planting trials. The trials are n = 1 per treatment and are marked preliminary — the interface says so rather than rounding the evidence up.",
    source: "§8 Copy · §6 open items",
    doc: "Design system",
    related: ["lab", "open", "curing"],
  },
  {
    id: "roles",
    topic: "Access",
    question: "What are the four roles?",
    aliases: ["role", "admin", "staff", "operator", "researcher", "permission", "rbac", "access", "who can"],
    answer:
      "Admin, Staff, Operator and Researcher. Admin approves quality rules and sees the full audit trail; Staff register shops and record pickups; Operator runs batches and the machine; Researcher enters lab results and manages planting experiments. The Supplier role was deleted.",
    source: "§4 Roles and permissions",
    doc: "System design",
    related: ["no-accounts", "modules", "audit"],
  },
  {
    id: "modules",
    topic: "Architecture",
    question: "How many modules are there?",
    aliases: ["module", "13", "thirteen", "list", "components", "functions", "features"],
    answer:
      "Thirteen: Auth & Access, Shop Registration, Collection & Inventory, Shop Map (optional), Batch & Composting, Machine Monitoring, Lab Results, Quality & Approval, Planting Experiments, Reports & Export, Notifications, Audit Trail and Dashboard.",
    source: "§3 Modules",
    doc: "System design",
    related: ["roles", "stack", "what-is"],
  },
  {
    id: "offline",
    topic: "Architecture",
    question: "How does offline collection work?",
    aliases: ["offline", "indexeddb", "signal", "sync", "idempotent", "clientid", "retry", "reconnect", "phone"],
    answer:
      "The pickup form writes to IndexedDB first and queues a mutation with a client-generated clientId. POST /pickups is idempotent on that key, so a retry after reconnection returns 200 with the original document instead of double-counting sacks or kilograms.",
    source: "§2 · Pickups route",
    doc: "System design",
    related: ["collector", "audit", "stack"],
  },
  {
    id: "audit",
    topic: "Architecture",
    question: "What is the audit trail?",
    aliases: ["audit", "audit log", "logs", "immutable", "history", "before", "after", "traceability", "correction"],
    answer:
      "Every status transition writes an immutable AuditLog entry with actor, action, entity, before, after, remark and IP. Entries are never updated or deleted — a correction is a new entry that references the previous one.",
    source: "§5 · AuditLogs model",
    doc: "Data model",
    related: ["roles", "offline", "api"],
  },
  {
    id: "map",
    topic: "Architecture",
    question: "Is there GPS tracking or routing?",
    aliases: ["map", "gps", "gis", "routing", "route", "pins", "tracking", "location"],
    answer:
      "No GIS, no routing, no live GPS. The shop list is the primary view; an optional static map is just a projection of the same records. The collector uses an ordered route list sorted by time window then barangay.",
    source: "§1.1 · Module 4",
    doc: "System design",
    related: ["pickup-rules", "collector", "offline"],
  },
  {
    id: "notifications",
    topic: "Communication",
    question: "How are shops contacted?",
    aliases: ["notification", "sms", "messenger", "message", "contact", "template", "reminder", "skip", "reply"],
    answer:
      "Outbound only: three templates — pickup reminder, pickup missed/rescheduled, and pickup recorded — sent by staff from their own phone as templated SMS or Messenger. Shops reply 'skip' or 'not full'; staff mark the pickup accordingly. No shop inbox exists.",
    source: "§4 · Module 11",
    doc: "System design",
    related: ["no-accounts", "pickup-rules", "status-pickup"],
  },
  {
    id: "stack",
    topic: "Technical",
    question: "What is the tech stack?",
    aliases: ["stack", "technology", "mern", "next", "express", "mongodb", "react", "node", "typescript", "build", "framework"],
    answer:
      "MongoDB (Mongoose 9) · Express 5 · React 19 on Next.js 16 App Router · Node.js · TypeScript · Tailwind v4 · three.js for the procedural machine. The web app and the API are separate npm workspaces.",
    source: "Architecture · README",
    doc: "System design",
    related: ["api", "offline", "design"],
  },
  {
    id: "api",
    topic: "Technical",
    question: "What does the API expose?",
    aliases: ["api", "endpoint", "rest", "route", "health", "overview", "json", "backend", "server", "database"],
    answer:
      "Express 5 under /api/v1: shops, pickups (plus /route), batches, lab, overview and health. Six collections back it. On the deployed site the read routes proxy to Express when API_URL is set, otherwise they serve typed fixtures — /api/v1/health reports which source is live.",
    source: "§2 · §2 Endpoints",
    doc: "Data model",
    related: ["stack", "offline", "audit"],
  },
  {
    id: "design",
    topic: "Design",
    question: "What is the design system?",
    aliases: ["design", "font", "poppins", "montserrat", "colour", "color", "palette", "cream", "lime", "type", "brand"],
    answer:
      "'Soil Ledger'. Two registers — editorial for the commercial site (cream #F6F2E6, olive ink #242A12, hairline rules, almost-square corners) and instrument for the workspace (pale lime sidebar, white cards, 14px radii). Exactly two typefaces: Montserrat for display, Poppins for everything else. One accent, #D9F26B, under 4% of any screen.",
    source: "§1–§3",
    doc: "Design system",
    related: ["3d", "stack", "what-is"],
  },
  {
    id: "3d",
    topic: "Design",
    question: "What is the 3D diagram?",
    aliases: ["3d", "three", "diagram", "model", "scene", "cutaway", "assembly", "camera", "webgl", "animation"],
    answer:
      "MCH-01, a procedural three.js cutaway of the rotary composter: motor, belt, drum with paddles, intake hopper, discharge chute, probe and control cabinet. Six clickable assemblies, four modes, five cameras. It inherits the site font, freezes under prefers-reduced-motion and shows a labelled fallback without WebGL.",
    source: "§9 The 3D machine diagram",
    doc: "Design system",
    related: ["machine", "design", "safety"],
  },
  /* Unresolved research questions are deliberately not published on the site
     or in the assistant. Point visitors to a real person instead. */
  {
    id: "partner",
    topic: "Shops",
    question: "How can a shop join?",
    aliases: ["partner", "join", "sign up", "apply", "interested", "contact", "shop owner", "get started"],
    answer:
      "Use the 'Join the shops' form on this website, or call or message us. A staff member will visit your shop, explain the programme, fill in a short form and leave a labelled sack. It is free, it takes almost none of your time, and there is no account to create.",
    source: "§1 · Web intake route",
    doc: "Data model",
    related: ["register", "no-accounts", "pickup-rules"],
  },
];

export const STARTER_QUESTIONS = [
  "What is Hair2Harvest?",
  "How can a shop join?",
  "Do shops need an account or login?",
  "How is a shop registered?",
  "How are pickup schedules decided?",
  "What does the laboratory test?",
];

export const TOPICS = Array.from(new Set(KNOWLEDGE.map((k) => k.topic)));

/** Deterministic retrieval: exact canonical question first, then keyword overlap. */
export function findAnswer(input: string): { entry: KnowledgeEntry | null; score: number } {
  const text = input.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
  const tokens = text.split(" ").filter((t) => t.length > 1);
  const tokenSet = new Set(tokens);

  const normalise = (s: string) =>
    s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

  // Suggestion chips send the canonical question, so those always resolve exactly.
  const exact = KNOWLEDGE.find((k) => normalise(k.question) === text);
  if (exact) return { entry: exact, score: 100 };

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE) {
    let score = 0;

    for (const alias of entry.aliases) {
      const a = alias.toLowerCase();
      if (a.length < 3) {
        if (tokenSet.has(a)) score += 2;
      } else if (text.includes(a)) {
        // Substring matching also catches plurals: "grades" ⊃ "grade",
        // "batches" ⊃ "batch", "approved" ⊃ "approve".
        score += a.includes(" ") ? 6 : 3;
        if (tokenSet.has(a)) score += 1;
      }
    }

    // Canonical question words add a little weight.
    for (const word of normalise(entry.question).split(" ")) {
      if (word.length > 4 && tokenSet.has(word)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return { entry: bestScore >= 3 ? best : null, score: bestScore };
}

export function getRelated(entry: KnowledgeEntry, count = 3): KnowledgeEntry[] {
  const ids = entry.related ?? [];
  const picked = ids
    .map((id) => KNOWLEDGE.find((k) => k.id === id))
    .filter((k): k is KnowledgeEntry => Boolean(k));
  if (picked.length >= count) return picked.slice(0, count);
  return [
    ...picked,
    ...STARTER_QUESTIONS.map((q) => KNOWLEDGE.find((k) => k.question === q)!).filter(
      (k) => k && k.id !== entry.id && !picked.includes(k),
    ),
  ].slice(0, count);
}
