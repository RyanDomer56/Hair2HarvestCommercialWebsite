/**
 * Grounded answer corpus for the system assistant.
 *
 * Every entry is a fact stated in docs/01-system-design.md,
 * docs/02-design-system.md or docs/03-data-model.md. Nothing here is
 * generated or guessed — the assistant is a retrieval UI over the
 * specification, not a generative model. Each answer carries its source.
 *
 * `question` stays in English (it is the canonical lookup key and the text the
 * suggestion chips actually send), while `promptTL` is the Tagalog label shown
 * to visitors on the Tagalog-default site. `answer` is translated to Tagalog so
 * the local fallback — and the grounding sent to any AI — is also Tagalog.
 */

export type ChatSource = "System design" | "Data model" | "Design system";

export type KnowledgeEntry = {
  id: string;
  topic: string;
  question: string;
  aliases: string[];
  promptTL?: string;
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
  "Wala akong na-check na sagot diyan, at ayaw kong hulaan — lalo na ang oras ng pagkolekta o kung paano sumali. Pakitawag o mag-text sa amin at may totoong taong sasagot: " +
  `${CONTACT.phone} (${CONTACT.hours}), o ${CONTACT.email}. Pwede rin kayong pumindot sa mga tanong sa ibaba.`;

/** When we cannot verify an answer but we do know where the topic lives. */
export const POINTER_ANSWER =
  "Wala akong na-check na sagot diyan, pero pwede kong ipakita kung saan ito mahanap sa site na ito — gamitin ang link sa ibaba. Kung kailangan ninyo pa rin ng tulong, may totoong taong sasagot: " +
  `${CONTACT.phone} (${CONTACT.hours}), o ${CONTACT.email}.`;

/** Asked when someone requests private, per-shop operational details. */
export const PRIVATE_INFO_ANSWER =
  "Hindi ko pwedeng ibigay iyan dito. Ang oras ng pagkolekta, pangalan ng contact, numero ng mobile, at nota kung saan nakalagay ang sako ay pribado — tanging ang Hair2Harvest collection team lang ang nakakakita nito. Para sa detalye ng inyong sariling tindahan, pakitawag o mag-text sa amin: " +
  `${CONTACT.phone} (${CONTACT.hours}), o ${CONTACT.email}.`;

/**
 * True only for requests for a SPECIFIC private detail (an exact time, a named
 * contact, a mobile number, where a sack is kept). General questions such as
 * "How are pickup schedules decided?" must still get their normal answer.
 */
export function isPrivateInfoRequest(input: string): boolean {
  const t = input.toLowerCase();
  return /what time|ano(ng)? oras|exact (time|day)|specific (time|day)|tomorrow|bukas|contact person|who (is|do i|should i) (the )?(contact|call|ask)|mobile number|phone number|numero ng|side door|access (note|instruction)|where (is|are) .{0,24}(sack|kept|stored)|saan (nakatago|nakalagay)/i.test(
    t,
  );
}

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "what-is",
    topic: "Overview",
    question: "What is Hair2Harvest?",
    aliases: ["what is hair2harvest", "what does hair2harvest do", "about the project", "overview", "purpose", "idea", "concept", "explain the project", "elevator", "hair2harvest", "ano ito", "ano ang hair2harvest", "tungkol saan", "ano ang ginagawa"],
    promptTL: "Ano ang Hair2Harvest?",
    answer:
      "Ang Hair2Harvest ay isang libreng serbisyo ng pagkolekta para sa mga barbero sa aming partner na barangay. Kinokolekta namin ang mga gupit na buhok na inyong itabi, hinalo sa tuyong dahon at iba pang halaman, at ginagawang kompost para sa mga taniman malapit dito. Kami ang pupunta sa inyong tindahan — walang app, walang login, at walang dagdag na trabaho para sa inyo.",
    source: "§1 What the system is",
    doc: "System design",
    related: ["no-accounts", "modules", "partner"],
  },
  {
    id: "no-accounts",
    topic: "Shops",
    question: "Do shops need an account or login?",
    aliases: ["login", "log in", "have to log", "need a login", "account", "password", "sign up", "signup", "supplier", "barbershop", "shop account", "user", "auth", "register themselves"],
    promptTL: "Kailangan ba ng account o login ang tindahan?",
    answer:
      "Hindi. Ang isang barbero ay hindi kailanman nagre-register at hindi kailanman kailangan ng password. Ang miyembro ng collection team ang bibisita, pipuno ng maikling form, at iiwan ang may tatak na sako. Tuloy lang kayong paggupit.",
    source: "§1 · core decision",
    doc: "System design",
    related: ["register", "shop-code", "roles"],
  },
  {
    id: "register",
    topic: "Shops",
    question: "How is a shop registered?",
    aliases: ["register", "registration", "enrol", "enroll", "onboard", "join", "form", "sign up", "magparehistro", "sumali", "paano sumali", "rehistro", "pormularyo", "magpatala", "paano magparehistro"],
    promptTL: "Paano nagpaparehistro ang tindahan?",
    answer:
      "Ang miyembro ng collection team ang bibisita sa inyong tindahan, magtatanong ng ilang simpleng bagay, at pipuno ng form para sa inyo. Halos wala itong ginugugol na oras ninyo. Iiwan namin ang may tatak na sako at aagree ang araw ng pagkolekta kasama ninyo. Walang account na gagawin at walang kailangang punan ninyo online. Para humiling ng bisita, gamitin ang form na 'Sumali sa mga tindahan' sa website na ito o tawagan kami.",
    source: "§1.2 · Module 2",
    doc: "System design",
    related: ["shop-code", "pickup-rules", "status-shop"],
  },
  {
    id: "shop-code",
    topic: "Shops",
    question: "What is a shop code?",
    aliases: ["code", "hb-", "sack", "identifier", "id", "label"],
    promptTL: "Ano ang shop code?",
    answer:
      "Ang code na nakasulat sa sako ng buhok ng tindahan — HB-001, HB-002, … Ito ang pagkakakilanlan ng tindahan sa buong rehistro, log ng pagkolekta, batch lots, at mga ulat. Walang account na nasa likod nito.",
    source: "§1.2 · Shops model",
    doc: "System design",
    related: ["register", "weighing", "status-shop"],
  },
  {
    id: "pickup-rules",
    topic: "Collection",
    question: "How are pickup schedules decided?",
    aliases: ["schedule", "frequency", "days", "twice weekly", "pickup rule", "window", "peak", "timing", "when", "kailan kukunin", "oras ng kolekta", "iskedyul ng kuha", "kailan ang pickup"],
    promptTL: "Paano napagdedesisyunan ang oras ng pagkolekta?",
    answer:
      "Ina-agree namin ang araw at oras ng pagkolekta sa bawat tindahan sa aming pagbisita, para bagay sa sariling oras ng tindahan. Kami ay laging pupunta sa inyo — hindi ninyo kailangang magpunta kahit saan. Ang mga detalyeng ito ay pribado: tanging ang Hair2Harvest collection team lang ang nakakakita. Para sa eksaktong oras ng isang partikular na tindahan, pakitawag o mag-text sa amin.",
    source: "§1.2 · §2 · Module 3",
    doc: "System design",
    related: ["collector", "map", "notifications"],
  },
  {
    id: "collector",
    topic: "Collection",
    question: "Do shops drop the hair off?",
    aliases: ["drop off", "dropoff", "collect", "collector", "travel", "come to", "deliver", "who picks"],
    promptTL: "Baon ba ng tindahan ang buhok?",
    answer:
      "Walang drop-off. Ang collector ang pupunta sa tindahan — ang mga tindahang may shift work ay hindi magbibiyahe papunta sa hall ng barangay. Ang phone-first na route list ay gumagana offline para sa mga back room ng mall na walang signal.",
    source: "§1.2 · §2",
    doc: "System design",
    related: ["pickup-rules", "offline", "notifications"],
  },
  {
    id: "weighing",
    topic: "Collection",
    question: "How is hair weighed?",
    aliases: ["weigh", "weight", "kilograms", "kg", "net", "gross", "sacks", "measure", "sack"],
    promptTL: "Paano tinimbang ang buhok?",
    answer:
      "Ang bawat pagkolekta ay itinatala ang bilang ng sako, gross na kilograms, at isang standard na sack tare. Ang net kg ay kuwenta sa isang pre-validate hook bilang gross − tare, kaya hindi pwedeng mag-post ang client ng net weight na hindi tugma. Ang net kg ay hindi pwedeng maging negatibo.",
    source: "§5 · Pickups model",
    doc: "Data model",
    related: ["tare", "grades", "shop-code"],
  },
  {
    id: "tare",
    topic: "Collection",
    question: "What sack tare do you use?",
    aliases: ["tare", "0.18", "assumption", "sack weight", "configured"],
    promptTL: "Anong sack tare ang ginagamit ninyo?",
    answer:
      "Binabawasan namin ng maliit na standard na bigat para sa walang laman na sako (0.18 kg) ang kabuuan, kaya ang itinatalang numero ay ang buhok lang. Ipinanatili nito na ang aming timbang ay patas at pare-pareho.",
    source: "§6 open items · Pickups model",
    doc: "System design",
    related: ["weighing", "grades"],
  },
  {
    id: "grades",
    topic: "Quality",
    question: "What are the contamination grades?",
    aliases: ["grade", "clean", "minor", "mixed", "contamination", "quality", "grading", "sort"],
    promptTL: "Ano ang mga grado ng contamination?",
    answer:
      "Tatlong grado na itinala sa pintuan: Clean, Minor, at Mixed. Ang Mixed ay nagdudulot ng coaching note, hindi pagtanggi. Tanging Clean at Minor na stock lang ang pwedeng mapasok sa isang batch.",
    source: "§1.2 · §3.2",
    doc: "System design",
    related: ["treated", "mixed", "batch-stock"],
  },
  {
    id: "mixed",
    topic: "Quality",
    question: "Are mixed sacks rejected?",
    aliases: ["reject", "rejection", "mixed", "coaching", "contaminated", "waste", "plastic"],
    promptTL: "Ba't tinatanggihan ang halo na sako?",
    answer:
      "Hindi. Ang Mixed grade ay nagdudulot ng coaching note, hindi pagtanggi. Ang lalagyan ang interbensyon: ang buhok ay dumadating na halo ang tisyu at sachet lang kapag walang lalagyan para dito, kaya ang programa ang nagdadala nito.",
    source: "§1.2",
    doc: "System design",
    related: ["grades", "treated", "register"],
  },
  {
    id: "treated",
    topic: "Quality",
    question: "What happens to treated hair?",
    aliases: ["treated", "chemical", "coloured", "colored", "rebonded", "hold", "unsure", "separate"],
    promptTL: "Ano ang nangyayari sa treated na buhok?",
    answer:
      "Kung ang buhok ay chemically treated, o hindi kami sigurado, inilalayo muna namin ito. Hindi ito mapapasok sa kompost hangga't hindi kami sigurado na ligtas ito. Kinokolekta pa rin namin ito sa tindahan — walang tinatanggihan. Maaaring ipaliwanag ng miyembro ng collection team ang higit pa sa pagbisita.",
    source: "§1.2 · §3.2 · §6",
    doc: "System design",
    related: ["batch-stock", "grades", "mixed"],
  },
  {
    id: "status-shop",
    topic: "Status",
    question: "What are the shop statuses?",
    aliases: ["status", "candidate", "enrolled", "paused", "withdrawn", "lifecycle", "state", "katayuan", "ano ang enrolled", "ibig sabihin ng enrolled", "kahulugan ng status"],
    promptTL: "Ano ang mga katayuan ng tindahan?",
    answer:
      "Ang Enrolled ay aktibong partner — regular kaming kumokolekta ng buhok. Ang Candidate ay ang tindahan ay interesado o nabisita na, pero hindi pa nagsisimula ang pagkolekta. Ang Paused ay ang tindahan ay nagpapahinga sandali pero parte pa rin ng network. Ang Withdrawn ay ang tindahan ay hindi na lalahok. Tanging ang mga Enrolled na tindahan ang kinokolektahan.",
    source: "§3.2 · Shops route",
    doc: "System design",
    related: ["register", "status-pickup", "status-batch"],
  },
  {
    id: "status-pickup",
    topic: "Status",
    question: "What are the pickup statuses?",
    aliases: ["pickup status", "scheduled", "collected", "weighed", "skipped", "rescheduled", "stock lot"],
    promptTL: "Ano ang mga katayuan ng pagkolekta?",
    answer:
      "Scheduled → Collected → Weighed → In Stock. Ang isang pickup ay pwedeng Skipped (sarado ang tindahan o hindi puno ang sako — hindi ito pagkabigong ng tindahan) o Rescheduled, na nangangailangan ng dahilan.",
    source: "§3.2",
    doc: "System design",
    related: ["status-batch", "weighing", "status-shop"],
  },
  {
    id: "status-batch",
    topic: "Status",
    question: "What are the batch stages?",
    aliases: ["batch status", "stage", "preparing", "composting", "curing", "sampling", "pending", "on hold", "approved"],
    promptTL: "Ano ang mga yugto ng batch?",
    answer:
      "Preparing → Composting → Curing → Sampling → Pending, pagkatapos ay On Hold, Rejected, o Approved for Supervised Testing. Ang approval ay naka-block sa server side hangga't hindi pa na-re-review ang lab results.",
    source: "§3.2 · §5",
    doc: "System design",
    related: ["approval", "curing", "lab"],
  },
  {
    id: "batch-stock",
    topic: "Batching",
    question: "Which hair can enter a batch?",
    aliases: ["batch", "eligible", "stock", "lots", "409", "insufficient", "available", "input"],
    promptTL: "Anong buhok ang pwedeng mapasok sa batch?",
    answer:
      "Tanging Clean o Minor, untreated, at Weighed na stock lang. Ang POST /batches ay nagti-tally ng eligible net kg at nagbabalik ng 409 kasama ang availableKg kapag ang hiniling na input ay lalampas dito. Ang isang batch ay hindi pwedeng lampasin ang available na stock.",
    source: "§5 · Batches route",
    doc: "Data model",
    related: ["status-batch", "recipe", "approval"],
  },
  {
    id: "recipe",
    topic: "Batching",
    question: "What is the compost recipe?",
    aliases: ["recipe", "v3", "ratio", "hair 45", "carbon", "greens", "mix", "formula", "ingredients"],
    promptTL: "Ano ang recipe ng kompost?",
    answer:
      "Ang mga recipe ay may version bawat batch. Ang aktibong BATCH-2603 ay gumagamit ng v3.3 — hair 45 / carbon 30 / greens 25. Ang mga naunang batch ay gumamit ng v3.2 (40 / 35 / 25) at v3.1 (35 / 40 / 25).",
    source: "Batches model · pilot data",
    doc: "Data model",
    related: ["curing", "batch-stock", "machine"],
  },
  {
    id: "curing",
    topic: "Batching",
    question: "How long does composting take?",
    aliases: ["how long", "how long does", "how many days", "curing stage", "45 days", "forty", "curing", "days", "duration", "maturity", "reheat"],
    promptTL: "Gaano katagal ang pagkobposto?",
    answer:
      "35–45 araw hanggang maging cured na kompost, at hindi pwedeng laktawin ang yugto. Ang bunton na umiinit muli ay hindi pa matured. Ang BATCH-2512 ang verified na halimbawa: 22.0 kg pasok, 12.9 kg labas pagkatapos ng 45 araw — isang 41.4% na pagbawas ng masa.",
    source: "§3.2 · pilot data",
    doc: "System design",
    related: ["recipe", "lab", "evidence"],
  },
  {
    id: "machine",
    topic: "Machine",
    question: "What does the MCH-01 machine do?",
    aliases: ["machine", "mch-01", "motor", "drum", "rpm", "composting drum", "3d", "telemetry", "probe", "belt"],
    promptTL: "Ano ang ginagawa ng makinang MCH-01?",
    answer:
      "Ang finned motor at gearbox ay nagpapaikot ng belt sa shaft ng drum sa 8 rpm. Ang helical paddles ay naghahalo ng mix sa loob ng cutaway barrel; pumapasok ang buhok sa hopper, lumalabas ang cured na kompost sa chute, at isang core probe ang naglo-log ng temperatura at halumigmig. Ito ang makinang inilalarawan ng Modules 5 at 6.",
    source: "§3 Modules 5–6 · 3D diagram",
    doc: "System design",
    related: ["safety", "recipe", "3d"],
  },
  {
    id: "safety",
    topic: "Machine",
    question: "Can the web panel control the machine?",
    aliases: ["control", "e-stop", "estop", "safety", "hardware", "start", "stop", "interlock", "remote", "shutoff"],
    promptTL: "Kaya bang kontrolin ng web panel ang makina?",
    answer:
      "Tanging awtorisadong start/stop sa isang aprubadong cycle. Ang emergency stop, lid interlock, at motor shutoff ay nananatili sa local na hardware — ang web ay hindi pumapalit sa safety circuit. Ang boundary na ito ay nakadrowing sa rust sa control cabinet.",
    source: "§1.1 · Module 6",
    doc: "System design",
    related: ["machine", "modules", "audit"],
  },
  {
    id: "lab",
    topic: "Our impact",
    question: "What does the laboratory test?",
    aliases: ["lab", "laboratory", "test", "n-p-k", "npk", "ph", "moisture", "pathogens", "maturity", "sample"],
    promptTL: "Ano ang sine-scheck ng laboratoryo?",
    answer:
      "N-P-K, pH, moisture, maturity, at pathogens, kasama ang ulat na nakalakip. Ang mga re-test ay nagdaragdag ng bagong version — ang mga lab result ay hindi kailanman na-o-overwrite. Ang BATCH-2512 ay pumasa sa N 1.42, P 0.86, K 1.19, pH 7.1, mature, walang pathogens.",
    source: "§3 Module 7 · LabResults model",
    doc: "System design",
    related: ["approval", "evidence", "status-batch"],
  },
  {
    id: "approval",
    topic: "Our impact",
    question: "When can a batch be approved?",
    aliases: ["who can approve", "who approves", "approve a batch", "approve", "approval", "sign off", "gate", "blocked", "review", "supervised"],
    promptTL: "Kailan pwedeng aprubahan ang batch?",
    answer:
      "Hindi hangga't hindi pa na-re-review ang lab results. Ang approval gate ay ipinapatupad sa server side, hindi sa UI: ang PATCH /batches/:code/stage ay nagbabalik ng 409 kapag ang stage ay Approved at walang passing, na-review na lab result.",
    source: "§1.1 · §5 · Batches route",
    doc: "System design",
    related: ["lab", "status-batch", "evidence"],
  },
  {
    id: "evidence",
    topic: "Our impact",
    question: "What evidence exists so far?",
    aliases: ["evidence", "impact", "results", "data", "kg collected", "planting", "trial", "n = 1", "preliminary"],
    promptTL: "Anong ebidensya ang mayroon hanggang ngayon?",
    answer:
      "Isang verified na lab report para sa BATCH-2512, isang batch mass-balance register, isang collection trend, at mga planting trial. Ang mga trial ay n = 1 bawat treatment at minarkahan bilang preliminary — sinasabi iyon ng interface sa halip na bilugan pataas ang ebidensya.",
    source: "§8 Copy · §6 open items",
    doc: "Design system",
    related: ["lab", "open", "curing"],
  },
  {
    id: "roles",
    topic: "Access",
    question: "What are the four roles?",
    aliases: ["role", "admin", "staff", "operator", "researcher", "permission", "rbac", "access", "who can"],
    promptTL: "Ano ang apat na roles?",
    answer:
      "Admin, Staff, Operator, at Researcher. Ang Admin ay nag-aapruba ng quality rules at nakakakita ng buong audit trail; ang Staff ay nagre-rehistro ng mga tindahan at nagre-record ng pagkolekta; ang Operator ay nagpapatakbo ng mga batch at ng makina; ang Researcher ay naglalagay ng lab results at namamahala ng planting experiments. Ang Supplier role ay tinanggal.",
    source: "§4 Roles and permissions",
    doc: "System design",
    related: ["no-accounts", "modules", "audit"],
  },
  {
    id: "modules",
    topic: "Architecture",
    question: "How many modules are there?",
    aliases: ["module", "13", "thirteen", "list", "components", "functions", "features"],
    promptTL: "Ilang modules ang mayroon?",
    answer:
      "Labintatlo: Auth & Access, Shop Registration, Collection & Inventory, Shop Map (optional), Batch & Composting, Machine Monitoring, Lab Results, Quality & Approval, Planting Experiments, Reports & Export, Notifications, Audit Trail, at Dashboard.",
    source: "§3 Modules",
    doc: "System design",
    related: ["roles", "stack", "what-is"],
  },
  {
    id: "offline",
    topic: "Architecture",
    question: "How does offline collection work?",
    aliases: ["offline", "indexeddb", "signal", "sync", "idempotent", "clientid", "retry", "reconnect", "phone"],
    promptTL: "Paano gumagana ang offline na pagkolekta?",
    answer:
      "Ang pickup form ay nagsusulat muna sa IndexedDB at nag-queue ng mutation na may client-generated na clientId. Ang POST /pickups ay idempotent sa key na iyon, kaya ang retry pagkatapos ng reconnection ay nagbabalik ng 200 kasama ang original na document sa halip na dobleng bilang ng mga sako o kilograms.",
    source: "§2 · Pickups route",
    doc: "System design",
    related: ["collector", "audit", "stack"],
  },
  {
    id: "audit",
    topic: "Architecture",
    question: "What is the audit trail?",
    aliases: ["audit", "audit log", "logs", "immutable", "history", "before", "after", "traceability", "correction"],
    promptTL: "Ano ang audit trail?",
    answer:
      "Ang bawat status transition ay nagsusulat ng immutable na AuditLog entry na may actor, action, entity, before, after, remark, at IP. Ang mga entry ay hindi kailanman ina-update o dinidelete — ang isang correction ay isang bagong entry na tinutukoy ang nauna.",
    source: "§5 · AuditLogs model",
    doc: "Data model",
    related: ["roles", "offline", "api"],
  },
  {
    id: "map",
    topic: "Architecture",
    question: "Is there GPS tracking or routing?",
    aliases: ["map", "gps", "gis", "routing", "route", "pins", "tracking", "location"],
    promptTL: "May GPS tracking o routing ba?",
    answer:
      "Walang GIS, walang routing, walang live GPS. Ang listahan ng tindahan ang pangunahing view; ang isang optional na static map ay simpleng projection lamang ng parehong records. Ang collector ay gumagamit ng ordered route list na naka-sort ayon sa time window pagkatapos ay barangay.",
    source: "§1.1 · Module 4",
    doc: "System design",
    related: ["pickup-rules", "collector", "offline"],
  },
  {
    id: "notifications",
    topic: "Communication",
    question: "How are shops contacted?",
    aliases: ["notification", "sms", "messenger", "message", "paalala", "text message", "reminder"],
    promptTL: "Paano nakakontak ang mga tindahan?",
    answer:
      "Nagpapadala kami ng mga maikling mensahe tungkol sa pagkolekta — halimbawa isang paalala, isang namiss na pickup, o isang kumpirmasyong na-record na ang pickup. Isang miyembro ng collection team ang nagpapadala nito. Ang inyong numero ay hindi ipinapakita sa website na ito.",
    source: "§4 · Module 11",
    doc: "System design",
    related: ["no-accounts", "pickup-rules", "status-pickup"],
  },
  {
    id: "stack",
    topic: "Technical",
    question: "What is the tech stack?",
    aliases: ["stack", "technology", "mern", "next", "express", "mongodb", "react", "node", "typescript", "build", "framework"],
    promptTL: "Ano ang tech stack?",
    answer:
      "MongoDB (Mongoose 9) · Express 5 · React 19 sa Next.js 16 App Router · Node.js · TypeScript · Tailwind v4 · three.js para sa procedural na makina. Ang web app at ang API ay magkahiwalay na npm workspaces.",
    source: "Architecture · README",
    doc: "System design",
    related: ["api", "offline", "design"],
  },
  {
    id: "api",
    topic: "Technical",
    question: "What does the API expose?",
    aliases: ["api", "endpoint", "rest", "route", "health", "overview", "json", "backend", "server", "database"],
    promptTL: "Ano ang inilalabas ng API?",
    answer:
      "Ang Express 5 sa ilalim ng /api/v1: shops, pickups (kasama ang /route), batches, lab, overview, at health. Anim na collections ang nasa likod nito. Sa deployed na site, ang read routes ay nag-proxy sa Express kapag naka-set ang API_URL, kung hindi ay nagse-serve ng typed fixtures — ang /api/v1/health ay nagre-report kung aling source ang live.",
    source: "§2 · §2 Endpoints",
    doc: "Data model",
    related: ["stack", "offline", "audit"],
  },
  {
    id: "design",
    topic: "Design",
    question: "What is the design system?",
    aliases: ["design", "font", "poppins", "montserrat", "colour", "color", "palette", "cream", "lime", "type", "brand"],
    promptTL: "Ano ang design system?",
    answer:
      "'Soil Ledger'. Dalawang register — ang editorial para sa commercial site (cream #F6F2E6, olive ink #242A12, hairline rules, halos-square na sulok) at ang instrument para sa workspace (pale lime na sidebar, white na cards, 14px na radii). Eksaktong dalawang typeface: Montserrat para sa display, Poppins para sa lahat ng iba. Isang accent lang, #D9F26B, sa ilalim ng 4% ng anumang screen.",
    source: "§1–§3",
    doc: "Design system",
    related: ["3d", "stack", "what-is"],
  },
  {
    id: "3d",
    topic: "Design",
    question: "What is the 3D diagram?",
    aliases: ["3d", "three", "diagram", "model", "scene", "cutaway", "assembly", "camera", "webgl", "animation"],
    promptTL: "Ano ang 3D diagram?",
    answer:
      "Ang MCH-01, isang procedural na three.js cutaway ng rotary composter: motor, belt, drum na may paddles, intake hopper, discharge chute, probe, at control cabinet. Anim na clickable na assembly, apat na mode, limang camera. Ito ay humahawak sa font ng site, humahinto sa ilalim ng prefers-reduced-motion, at nagpapakita ng labelled na fallback nang walang WebGL.",
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
    aliases: ["partner", "join", "sign up", "apply", "interested", "shop owner", "get started", "saan magpaparehistro", "saan sumali", "paano makilahok", "gusto sumali"],
    promptTL: "Paano makilahok ang isang tindahan?",
    answer:
      "Gamitin ang form na 'Sumali sa mga tindahan' sa website na ito, o tawagan o mag-text kami. Ang miyembro ng collection team ang bibisita sa inyong tindahan, ipapaliwanag ang programa, pipuno ng maikling form, at iiwan ang may tatak na sako. Libre ito, halos wala itong ginugugol na oras ninyo, at walang account na gagawin.",
    source: "§1 · Web intake route",
    doc: "Data model",
    related: ["register", "no-accounts", "pickup-rules"],
  },
];

/* The starter prompts shown to a first-time visitor. These are entry IDs so the
   chip can display the Tagalog `promptTL` while sending the English canonical
   `question` (which resolves exactly). */
export const STARTER_QUESTIONS: string[] = [
  "what-is",
  "partner",
  "no-accounts",
  "register",
  "pickup-rules",
  "lab",
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
    ...STARTER_QUESTIONS.map((id) => KNOWLEDGE.find((k) => k.id === id)!).filter(
      (k) => k && k.id !== entry.id && !picked.includes(k),
    ),
  ].slice(0, count);
}
