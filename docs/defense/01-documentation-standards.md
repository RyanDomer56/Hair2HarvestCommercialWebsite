# Documentation Standards

**Applies to:** thesis chapters, system design, hardware systemization, API notes, test plans, defence slides, and Q&A sheets.  
**Rule of thumb:** if a claim is not evidenced, it is an assumption — label it as one.

---

## 1. Document hierarchy

Every artefact belongs to exactly one level. Do not mix levels in one section.

| Level | Document | Answers | Owner |
| --- | --- | --- | --- |
| L0 | Research paper / thesis | Why the study exists and what it proves | Research team |
| L1 | System requirements (SRS) | What the system must do | Systems lead |
| L2 | System design | How software functions are arranged | Systems lead |
| L3 | Hardware systemization | How the physical machine is arranged | Hardware lead |
| L4 | API / data contract | How components exchange data | Backend lead |
| L5 | Test plan and results | How correctness is shown | QA lead |
| L6 | Defence Q&A | How the team explains it under questioning | Presenter |

A defence answer should cite the lowest level that proves it: e.g. “That gate is enforced server-side” → L4 API contract, not a slide claim.

---

## 2. Mandatory section order

Use this order for every technical document unless the adviser gives a different template:

1. **Title block** — title, version, date, author, status.
2. **Scope** — what is included and explicitly excluded.
3. **Definitions** — only terms the panel may not know.
4. **Requirements or objectives** — numbered, testable statements.
5. **Design or architecture** — diagrams plus prose.
6. **Interfaces and data** — inputs, outputs, contracts, state changes.
7. **Verification** — how each requirement is checked.
8. **Assumptions and limitations** — honest, specific, no vague wording.
9. **Revision history** — date, change, author, reason.
10. **References** — only sources actually consulted.

---

## 3. Numbering and identifiers

- Requirements: `FR-01`, `FR-02`; non-functional: `NFR-01`.
- Hardware subsystems: `HW-01` … `HW-08`.
- Software modules: `M-01` … `M-13`.
- Test cases: `TC-001`.
- Defence questions: `Q-01`.
- Figures and tables are numbered separately: `Figure 3`, `Table 2`.
- Use the same identifier in the document, slide, traceability matrix, and demo script. Never rename midway.

---

## 4. Writing rules

### Sentence style
- Active voice: “The server rejects approval” not “Approval is rejected.”
- Present tense for current design; past tense for completed tests.
- One idea per sentence; maximum 25 words where practical.
- Define an acronym the first time: “Software Requirements Specification (SRS)”.

### Terminology lock

| Use | Avoid | Reason |
| --- | --- | --- |
| barbershop / barber | salon | Scope is barbershops only |
| human hair | animal hair | Wrong material claim |
| barrel / drum | barrel-and-belt machine | The v17 machine is chain-driven |
| Nova Proper (commercial UI) / Novaliches Proper (legal text) | mixing the two without explanation | Two source documents use different wording |
| shop code | account, login, user ID | Shops are records, not users |
| supervised testing | commercial fertiliser claim | No certification is claimed |
| TO CONFIRM | guessed numbers | Protects the defence |

### Numbers
- Always include units: `10 rpm`, `52.6 °C`, `5.33 m model-space length`.
- Distinguish **model units** from **physical millimetres**. If the blueprint gives mm, write mm and keep the Three.js value as “model-space”.
- Do not invent precision. If the paper says “about six weeks”, do not write “42 days”.

---

## 5. Evidence and claim rules

Every non-obvious claim needs one of these tags in the source document or speaker notes:

- `[CODE: path/to/file]` — verified in implementation.
- `[BLUEPRINT: sheet or note]` — verified from the drawing.
- `[LIVE: /route]` — verified on the deployed site.
- `[TEST: TC-xxx]` — verified by a recorded test.
- `[ASSUMPTION]` — not yet verified; must be said as an assumption.

**Never claim** in the defence: certification, regulatory compliance, health benefit, exact compost nutrient value, or full machine automation unless the final paper contains the evidence and the tag is present.

---

## 6. Figures, diagrams, and tables

- Every figure has a caption that states the takeaway, not just the label.  
  Good: `Figure 4 — Shop status transitions; only enrolled shops can be picked up.`  
  Bad: `Figure 4 — Status diagram.`
- Every table has a header row and units in the header where relevant.
- Diagrams must be readable at projector distance: minimum 14 pt equivalent.
- A diagram cannot be the only explanation. Add one plain-language paragraph after it.
- If a figure is generated from code, name the source file in the caption or note.

---

## 7. Revision control

- File naming: `03-system-design-functions.md`, `v1.1`, `2026-11-22`.
- Do not overwrite a submitted version. Create a new version or append a revision row.
- Every revision row needs **what changed** and **why**, not just a date.
- The defence deck and Q&A sheet must use the same version number as the documents.

---

## 8. Quality gate before the defence

A document is defence-ready only when all of these are true:

- [ ] Every requirement has an identifier and a verification method.
- [ ] Every number has a unit and an evidence tag.
- [ ] Every `TO CONFIRM` item is either resolved or assigned to a named person.
- [ ] Every diagram has a caption and a text alternative.
- [ ] Terminology matches the lock table in §4.
- [ ] Revision history matches the file version.
- [ ] The Q&A model answers agree with the current build and papers.
- [ ] A 5-minute demo succeeds from a clean browser tab.
- [ ] Fallback answers are ready for “I don’t know” and “that is not implemented yet”.

---

## 9. Defence answer pattern

Use this structure for every question:

> **Answer** (one sentence) → **Evidence** (document/route/test) → **Boundary** (what is assumption or not implemented) → **Next step** (if asked).

Example:

> “Approval is blocked until a reviewed lab result exists. The rule is enforced in the API, not only in the dashboard — see the batch stage endpoint in the data model. We are not claiming a certified fertiliser; supervised testing is the current end point. The next step is attaching the final lab sheets to the evidence pack.”
