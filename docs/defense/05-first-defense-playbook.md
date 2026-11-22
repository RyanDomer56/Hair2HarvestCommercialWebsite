# Hair2Harvest — First Defence Playbook

**Version** 1.0 · **Date** 22 November 2026  
**Use:** rehearse with this file open. Answers are written in first person so they can be spoken directly.

---

## 1. Answer pattern

For every question:

> **Direct answer** → **Evidence** → **Boundary** → **Next step**

Example:

> “Approval is blocked until a reviewed lab result exists. That is enforced in the API, not just in the dashboard — see the batch stage route. We are not claiming a certified fertiliser; the current end point is supervised testing. The next step is attaching the final lab sheets to the evidence pack.”

Never bluff. Say **“VERIFIED,” “ASSUMPTION,”** or **“NOT IMPLEMENTED”** explicitly.

---

## 2. Suggested defence run-of-show

| Time | Segment | What to say / show |
| --- | --- | --- |
| 1 min | Problem | Barbers generate hair waste; the system turns it into a traceable compost input without giving shops a login. |
| 2 min | Objectives | Recruit shops, collect and grade hair, compost in the v17 machine, record lab evidence, explain the process publicly. |
| 3 min | Architecture | Show public site → Next routes → optional Express API → MongoDB. Emphasise fixture fallback and local hardware safety. |
| 5 min | Live demo | `/partner` → valid/invalid mobile → `/system` 3D modes → `/impact` → dashboard gate. |
| 2 min | Hardware | Drum stationary, shaft rotating, 40T/10T chain, 5×3 paddles, local E-stop. |
| 2 min | Evidence | Build passed, live routes 200, production CSS/animation markers verified, commits recorded. |
| 1 min | Limitations | Lab sheets, physical sensors, final blueprint values still TO CONFIRM. |

---

## 3. Five-minute demo script

1. **Open** `https://hair2harvest-commercial-website.vercel.app/`. Say: “This is the public commercial surface; Tagalog is default, English is one click.”
2. **Toggle language/theme.** Say: “Localisation and theme are client-side, with a no-flash script for dark mode.”
3. **Open `/partner`.** Point to the split **First name / Last name**, fixed `+63`, and Terms/Privacy links.
4. **Invalid mobile test.** Type `0917...` with a leading zero after `+63`; show it normalises instead of storing `+630`. If the browser blocks it, say the rule is also enforced server-side with 422.
5. **Open `/system`.** Switch 3D modes: Assembled → Cutaway → Drive camera. Say: “The shell stays still; the shaft and paddles turn. The chain guard is not shown in the current viewer.”
6. **Open `/impact`.** Say: “Technical lab/batch internals are kept out of the public view; the public sees the plain journey.”
7. **Try `/dashboard`.** Show redirect to `/login`. Say: “The workspace is gated by a signed http-only cookie.”

**Backup if internet fails:** use the local production build screenshots and the committed source paths; do not improvise new claims.

---

## 4. High-probability questions and model answers

### A. Problem, research, and relevance

**Q-01 — What problem are you solving?**  
**Answer:** “Barbershops produce hair waste every day, but there is no simple, traceable way to move that hair into composting. Our system gives shops a no-login handover and gives the team a record from pickup to lab result.”  
**Evidence:** SRS scope; `/partner` and `/impact`. **Boundary:** We are solving the pilot network workflow, not national waste logistics.

**Q-02 — Why barbershops only?**  
**Answer:** “The study scope is barbershops because their hair is generated predictably at a fixed location and can be bagged with a shop code. We removed salon content from the documents and site to keep the scope honest.”  
**Evidence:** terminology lock in standards doc. **Boundary:** Other salons are out of scope.

**Q-03 — Why no shop accounts?**  
**Answer:** “Shop owners are often busy and shift-based; asking them to register and log in creates drop-off. Staff register the shop once, and the shop code on the sack becomes the identity.”  
**Evidence:** system design §1. **Boundary:** Shop-facing messages stay outbound-only templates.

**Q-04 — What is your main research contribution?**  
**Answer:** “The contribution is a traceability workflow that connects a staff-registered shop, a weighed pickup, a composting batch, and a lab-reviewed decision, plus a public explanation of the physical machine.”  
**Evidence:** module map M-02, M-08, M-09, M-10, M-04. **Boundary:** The study does not claim a new composting chemistry.

**Q-05 — Is this just a website?**  
**Answer:** “No. The website is the public and intake layer; the core is the workflow and the domain rules — idempotent pickups, stock-based batches, and the lab approval gate. The 3D scene explains the hardware rather than replacing it.”  
**Evidence:** system design §3. **Boundary:** Physical build validation is separate.

**Q-06 — Where is the pilot located?**  
**Answer:** “The commercial site uses Nova Proper; the legal pages use the source-document wording Novaliches Proper. I can explain both and point to where each appears.”  
**Evidence:** `/terms`, `/privacy`, hardware header copy. **Boundary:** Final paper wording must be reconciled.

**Q-07 — What did you change after earlier feedback?**  
**Answer:** “We removed confusing technical content, fixed the `+630` phone bug, replaced the guard in the 3D viewer, split first and last name, and changed the drum to the v17 chain-drive blueprint.”  
**Evidence:** commits `050913d`, `ea28892`, `8f2239b`, `f27517a`. **Boundary:** These are implementation changes, not research findings.

**Q-08 — What is still unfinished?**  
**Answer:** “Final lab values, physical sensor details, and exact fabrication dimensions are still TO CONFIRM. The software workflow is live, but I will not present unverified hardware numbers as measurements.”  
**Evidence:** evidence status legend. **Boundary:** State this confidently; it shows control.

---

### B. Scope and requirements

**Q-09 — What are your functional requirements?**  
**Answer:** “They group into thirteen modules: public information, partner intake, shop records, collection, inventory, batching, lab, approval, machine view, reporting, notifications, audit, and dashboard.”  
**Evidence:** system design module map. **Boundary:** Notifications are templated and staff-sent, not automated campaigns.

**Q-10 — Which requirement is most critical?**  
**Answer:** “Traceability. If we cannot link a sack to a shop, a pickup, a batch, and a lab result, the rest of the system is only a website.”  
**Evidence:** shop code + clientId + batch/lab graph. **Boundary:** We do not claim GIS routing.

**Q-11 — Why is the approval gate important?**  
**Answer:** “It prevents an untested batch being presented as safe for supervised testing. The server rejects approval unless a reviewed passing lab result exists.”  
**Evidence:** `409` approval rule. **Boundary:** It is a process gate, not a certification.

**Q-12 — Why grade hair at pickup?**  
**Answer:** “Grading at the door keeps contamination visible and lets the team coach a shop instead of rejecting it later. Clean, Minor, and Mixed have defined follow-up actions.”  
**Evidence:** system view grading section. **Boundary:** Mixed is a coaching case, not a permanent ban.

**Q-13 — What does ‘treated hair’ mean here?**  
**Answer:** “It is a flag — Yes, No, or Unsure — for hair that may have chemical treatment. Treated or unsure stock is held separately and excluded from batches by default.”  
**Evidence:** data model stock rule. **Boundary:** Whether treated hair is acceptable is still an open research item.

**Q-14 — What is explicitly out of scope?**  
**Answer:** “No supplier logins, no live GPS routing, no automated fertiliser certification, and no software-owned safety control.”  
**Evidence:** design decisions table. **Boundary:** Say this before the panel asks.

---

### C. System design and architecture

**Q-15 — Draw the architecture.**  
**Answer:** “Browser → Next.js web → Next route handlers or Express API → MongoDB. Reads have fixture fallback; writes follow one domain model. The dashboard is separately gated.”  
**Evidence:** system design §2. **Boundary:** `API_URL` is not set in production, so partner writes currently go through the Next route.

**Q-16 — Why Next.js and Express together?**  
**Answer:** “Next handles public rendering, SEO, localisation, and the 3D explanation. Express holds the domain rules so future collectors, exports, and telemetry ingest share one write path.”  
**Evidence:** module structure. **Boundary:** Current deployment uses the Next route as a pragmatic fallback.

**Q-17 — Why MongoDB?**  
**Answer:** “The records are document-shaped and change by stage — shops with pickup rules, pickups with grades, batches with history — so a document model fits better than a rigid table set.”  
**Evidence:** data model. **Boundary:** We still enforce invariants in hooks and routes.

**Q-18 — How do you prevent duplicate pickups?**  
**Answer:** “Each pickup carries a client-generated `clientId`; a repeated POST returns the original record with `idempotent: true` and does not increment stock twice.”  
**Evidence:** pickup route contract. **Boundary:** The offline queue UI itself is not yet verified in this build.

**Q-19 — How does a read fail gracefully?**  
**Answer:** “Every read helper takes a typed fixture fallback. If the API fails or times out, the page uses cached or fixture data and reports `fixtures-fallback`.”  
**Evidence:** `api-client.ts`. **Boundary:** Writes are never silently faked.

**Q-20 — What happens if the API is down during registration?**  
**Answer:** “The public form does not show an infrastructure failure to the shop owner. In the current production setup it writes through the Next route directly to MongoDB; the Express path is used when `API_URL` is configured.”  
**Evidence:** partner route + supplier model. **Boundary:** We should still add operational alerting later.

**Q-21 — How is the dashboard protected?**  
**Answer:** “Middleware matches `/dashboard/:path*`, verifies an HMAC-SHA256 signed http-only cookie, and redirects unauthenticated requests to `/login` with a `next` return parameter.”  
**Evidence:** `middleware.ts`, `auth.ts`. **Boundary:** This is a simple signed session, not a full multi-user RBAC implementation.

**Q-22 — How do you localise the site?**  
**Answer:** “A dictionary maps each key to English and Tagalog; Tagalog is default, the choice persists in local storage, and PH mobile formatting is centralised.”  
**Evidence:** `i18n.tsx`, `phone.ts`. **Boundary:** Legal text is bilingual but uses the PDF wording.

**Q-23 — Why the 3D scene instead of a photo?**  
**Answer:** “The machine is still a prototype, so a procedural diagram can show modes, cutaway, cameras, and part callouts that a photo cannot. It is also fully textual below for accessibility.”  
**Evidence:** 3D component + system page. **Boundary:** It is an explanatory model, not a calibrated simulation.

---

### D. Software implementation

**Q-24 — How is the partner form validated?**  
**Answer:** “Required fields are checked, first and last name must both be present, mobile is normalised to ten digits starting with 9, and consent is required before submit.”  
**Evidence:** `partner-form.tsx`. **Boundary:** Server validates again; client validation is not trusted.

**Q-25 — Why did you split first and last name?**  
**Answer:** “It is clearer for a barbershop owner and still maps to the existing `owner` database field by joining the two values on submit.”  
**Evidence:** form submit handler. **Boundary:** If the paper requires two DB columns, that is a schema migration, not a UI change.

**Q-26 — What was the `+630` bug and how did you fix it?**  
**Answer:** “A user typing a leading zero after the fixed `+63` produced `+6309...`. We now strip non-digits, remove the country prefix when length exceeds ten, remove trunk zero, and validate `9xxxxxxxxx`.”  
**Evidence:** `phone.ts`. **Boundary:** This is PH-specific by design.

**Q-27 — How do you make the site feel calm rather than flashy?**  
**Answer:** “The Compost Ledger system uses cream paper, olive ink, one lime accent, hairline borders, and one easing curve. Motion only uses transform, opacity, and clip-path, and reduced motion collapses it.”
**Evidence:** design system + globals CSS. **Boundary:** The ticker and live dot are the only loops.

**Q-28 — What animations did you add most recently?**  
**Answer:** “A header scroll-progress line, hero line reveal, menu entry, telemetry tick, nav-card hover lift, and a drawn success check.”  
**Evidence:** commit `f27517a`. **Boundary:** All respect reduced motion.

**Q-29 — What does the chatbot do?**  
**Answer:** “Snip answers from a local knowledge base, can locate help pages, falls back to a server route when configured, and offers a representative contact path.”  
**Evidence:** `system-assistant.tsx`, `chat-knowledge.ts`, `/api/v1/chat`. **Boundary:** It does not expose private supplier data.

**Q-30 — How do you handle privacy in the form?**  
**Answer:** “Consent is captured at registration, Terms and Privacy are linked in the form, and the legal pages explain collection and use in plain language.”  
**Evidence:** `/terms`, `/privacy`, form consent block. **Boundary:** Final Data Privacy Act wording must be checked against your papers.

**Q-31 — What is the riskiest technical assumption?**  
**Answer:** “That production writes can remain on the Next route without losing auditability. The Express model is the intended long-term write path, so I would document the difference clearly.”  
**Evidence:** deployment note. **Boundary:** Say this as a risk with a mitigation, not as a failure.

**Q-32 — How do you deploy?**  
**Answer:** “The repo is a two-workspace npm project; web builds with Next on Vercel. Git push alone did not reliably trigger deployment, so we explicitly ran a production Vercel deploy and verified the alias.”  
**Evidence:** deployment log. **Boundary:** Package config has Node ≥20.

---

### E. Data, evidence, and ethics

**Q-33 — What data do you store for a shop?**  
**Answer:** “Shop name, combined owner name, normalised mobile with `+63`, barangay, street, unit, operating hours, pickup frequency, consent, status, and registration source.”  
**Evidence:** supplier model. **Boundary:** We do not store shop passwords.

**Q-34 — How do you protect mobile numbers?**  
**Answer:** “They are normalised, validated, and stored with a consistent country code. The public UI never displays a full shop number in the network view.”  
**Evidence:** phone normalisation + public views. **Boundary:** Access control on the dashboard should be reviewed before wider rollout.

**Q-35 — Can a lab result be edited?**  
**Answer:** “No — re-tests append as a new version rather than overwriting the original. That preserves the evidence trail.”  
**Evidence:** lab model `(code, version)` unique. **Boundary:** Final lab sheets still need attaching.

**Q-36 — How do you avoid overclaiming compost quality?**  
**Answer:** “Approval is named ‘Approved for Supervised Testing’, not certified fertiliser. The public impact page shows the journey, not unsupported nutrient claims.”  
**Evidence:** state machine + `/impact`. **Boundary:** N-P-K values remain TO CONFIRM until lab sheets are supplied.

**Q-37 — What about photo consent?**  
**Answer:** “The registration flow records consent and photo permission separately, and the legal page explains how visitor/shop information is handled.”  
**Evidence:** supplier fields + legal doc. **Boundary:** Final consent wording must match the approved form.

**Q-38 — What would you do if a shop withdraws?**  
**Answer:** “The record moves to Withdrawn rather than being deleted, so past pickups remain traceable while future pickups stop.”  
**Evidence:** shop status machine. **Boundary:** Data retention period is TO CONFIRM.

---

### F. Hardware and safety

**Q-39 — Describe the machine in one minute.**  
**Answer:** “It is the v17 chain-drive composter: a stationary bulged drum, a rotating shaft with five rings of three paddles, a 12 V worm motor driving a 40-to-10 tooth chain, a sliding top door with lock pin, and a discharge box. The 3D scene explains those parts.”  
**Evidence:** hardware doc §10. **Boundary:** Fabrication dimensions are still being reconciled.

**Q-40 — Does the drum rotate?**  
**Answer:** “No. The drum shell stays still; the shaft and paddles rotate. That is the key change from the earlier belt-driven concept.”  
**Evidence:** 3D animation code. **Boundary:** Do not call it a rotary drum if asked precisely.

**Q-41 — How is motion transmitted?**  
**Answer:** “A 10T motor sprocket drives a roller chain to a 40T sprocket keyed to the shaft. The model shows 58 chain links.”  
**Evidence:** drive assembly code. **Boundary:** Ratio effect is visual; final rpm TO CONFIRM.

**Q-42 — Why a worm-gear motor?**  
**Answer:** “It gives slow, high-torque rotation and a self-locking tendency that suits an intermittent mixer.”  
**Evidence:** blueprint note in model comment. **Boundary:** Self-locking behaviour must be confirmed in the final spec.

**Q-43 — Where does the E-stop live?**  
**Answer:** “In local hardware. The web panel can request authorised start/stop and display telemetry, but emergency stop, lid interlock, and motor shutoff are not software functions.”  
**Evidence:** scene footer + system design NFR-08. **Boundary:** This is a safety boundary, not a limitation to apologise for.

**Q-44 — Why did you remove the green part on the chain?**  
**Answer:** “That was a chain guard derived from the blueprint note. It made the chain hard to see in the public viewer, so we removed it from the 3D model. The safety boundary is explained in text instead.”  
**Evidence:** commit `ea28892`. **Boundary:** Physical machine guarding is a separate engineering decision.

**Q-45 — Are the temperature and moisture values measured?**  
**Answer:** “In the current build they are telemetry-style readouts with fallback values; the physical sensor interface is still TO CONFIRM.”  
**Evidence:** `MachineFrame`. **Boundary:** Do not call them calibrated measurements yet.

**Q-46 — How do you prevent access while mixing?**  
**Answer:** “The design intent is a lid/door interlock in local hardware. The lock pin is modelled, and the software does not rely on the dashboard for safety.”  
**Evidence:** hardware register HW-06/HW-08. **Boundary:** Interlock implementation TO CONFIRM.

**Q-47 — What is the discharge process?**  
**Answer:** “Stop and isolate the machine, open the lock, then slide out the discharge box. The process is shown as a callout in the 3D viewer.”  
**Evidence:** discharge part callout. **Boundary:** SOP wording TO CONFIRM.

**Q-48 — What maintenance would you perform?**  
**Answer:** “Before each run: chain tension, door lock, and shaft smoothness. Periodically: bearings, sprocket alignment, and cabinet/tank checks.”  
**Evidence:** hardware maintenance table. **Boundary:** Intervals are TO CONFIRM.

---

### G. Testing and proof

**Q-49 — How do you know it works?**  
**Answer:** “Typecheck and production build passed, all 32 pages were generated, Vercel production aliased successfully, and live smoke tests returned 200 for the homepage, terms, privacy, and health endpoints.”  
**Evidence:** build/deploy log. **Boundary:** This proves web delivery, not physical machine performance.

**Q-50 — What did you verify in the live CSS?**  
**Answer:** “The deployed stylesheet contains all five new animation hooks: `h2h-menu-in`, `h2h-line-rise`, `h2h-value-tick`, `h2h-check-draw`, and `scroll-progress`.”  
**Evidence:** production CSS check. **Boundary:** Visual feel still needs human review.

**Q-51 — Did you test invalid input?**  
**Answer:** “Yes: invalid mobile is blocked client-side and rejected server-side with 422; duplicate pickup IDs are idempotent; approval without a lab result is rejected with 409.”  
**Evidence:** API contracts and test plan template. **Boundary:** Record actual screenshots in the final test plan.

**Q-52 — Is the site accessible?**  
**Answer:** “The 3D scene has an aria label and text alternatives on the page, reduced motion is respected, and the layout uses semantic headings and links.”  
**Evidence:** component markup + CSS. **Boundary:** A formal WCAG audit is TO CONFIRM.

**Q-53 — What fails if MongoDB is unavailable?**  
**Answer:** “Public reads fall back to fixtures, so pages still render. Registration needs a working write path and should show a recoverable state rather than pretending success.”  
**Evidence:** `api-client.ts`. **Boundary:** Alerting is future work.

**Q-54 — What is your evidence pack?**  
**Answer:** “Build log, deployment URL, commit hashes, live route checks, screenshots, test cases, blueprint extract, and the final lab sheets once supplied.”  
**Evidence:** evidence checklist. **Boundary:** Missing items are listed, not hidden.

---

### H. Difficult questions and recovery

**Q-55 — Are you claiming this machine produces fertiliser?**  
**Answer:** “No. The end point is supervised testing after lab review. We do not claim certification or a nutrient guarantee.”  
**Boundary:** If pushed: “That distinction is deliberate and appears in the state name.”

**Q-56 — Why is the website still using fixtures?**  
**Answer:** “Fixtures are a resilience strategy for public reads and for development when the API is unavailable. Writes are real; the fallback only applies to display data.”  
**Boundary:** If asked for live numbers: “I will show the route source and explain which values are demo fallbacks.”

**Q-57 — Why did the deployed site not auto-update on git push?**  
**Answer:** “The Vercel project was not connected for automatic Git deployment at that time, so we deployed explicitly with the production CLI and verified the alias.”  
**Boundary:** Mitigation: connect Git or keep using explicit deploy in the release checklist.

**Q-58 — Why are there two barangay names?**  
**Answer:** “Nova Proper is the commercial-site wording; Novaliches Proper is the wording in the supplied legal PDF. The legal pages intentionally use the PDF wording, and the final paper will set the canonical term.”  
**Boundary:** Do not improvise a third name.

**Q-59 — How much of the hardware is actually built?**  
**Answer:** “The verified artefact is the blueprint-derived procedural model plus the documented safety boundary. Physical fabrication status and sensor calibration are TO CONFIRM from the hardware paper.”  
**Boundary:** This answer is stronger than overclaiming a finished machine.

**Q-60 — What will you do next?**  
**Answer:** “Reconcile the final papers and blueprint, fill every TO CONFIRM value, attach lab sheets, run the full test plan, and connect automatic deployment.”  
**Boundary:** End with a confident, specific next step — not “finish everything”.

---

## 5. Recovery lines to memorise

- “I want to be precise: the implemented behaviour is X; the paper proposes Y, and that difference is documented.”
- “That value is marked TO CONFIRM, so I will not present it as measured.”
- “The safety function stays in hardware. The web interface only requests an action.”
- “I do not have that number here; the evidence source is [document/test], and I will attach it.”
- “That is not implemented in this build; it is a documented next step.”

## 6. Do not say these

- “Fully automated” — say “authorised requests with local hardware safety.”
- “Certified fertiliser” — say “approved for supervised testing.”
- “Animal hair” — say “human hair from barbershops.”
- “Salon owners” — say “barbershop owners.”
- “Everything is verified” — say what is verified and what is TO CONFIRM.

---

## 7. Final rehearsal checklist

- [ ] I can explain the problem in 30 seconds.
- [ ] I can draw the architecture without notes.
- [ ] I can do the 5-minute demo from a clean browser tab.
- [ ] I know which answers are VERIFIED, ASSUMPTION, or NOT IMPLEMENTED.
- [ ] I have a screenshot/log for every test claim.
- [ ] I can explain drum-stationary/shaft-rotating without hesitation.
- [ ] I can state the local-hardware safety boundary twice.
- [ ] I have a polite recovery line for unknown values.
