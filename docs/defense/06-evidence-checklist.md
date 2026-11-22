# First Defence — Evidence Checklist

**Rule:** if it is not in this list, do not claim it in the defence.

---

## 1. Documents to prepare

| # | Item | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| 1 | Final thesis / paper draft | TO CONFIRM | Adviser/team | Needed for problem, scope, contribution |
| 2 | Final v17 blueprint / drawing set | TO CONFIRM | Hardware lead | Needed for dimensions, motor, sensors |
| 3 | SRS filled from template | TO CONFIRM | Systems lead | Must use FR/NFR IDs |
| 4 | System design baseline | READY | Systems lead | `03-system-design-functions.md` |
| 5 | Hardware systemization baseline | READY | Hardware lead | `04-hardware-systemization.md` |
| 6 | Test plan with actual results | TO CONFIRM | QA lead | Screenshots/logs required |
| 7 | Final lab result sheets | TO CONFIRM | Researcher | Attach N-P-K, pH, moisture, maturity |
| 8 | Barbershop interview/survey summary | TO CONFIRM | Researcher | Sample size and instrument |
| 9 | Defence Q&A sheet | READY | Presenter | `05-first-defense-playbook.md` |
| 10 | Traceability matrix | TO CONFIRM | Systems lead | Requirement → test → question |
| 11 | Figure/table register | TO CONFIRM | Document lead | Captions and source files |
| 12 | Revision history | TO CONFIRM | Document lead | Must match deck version |

---

## 2. Live demo evidence

| Check | How to capture | Why it matters |
| --- | --- | --- |
| Home, system, terms, privacy return 200 | HTTP status log | Proves production availability |
| Partner form first/last name visible | Screenshot `/partner` | Proves UI change |
| Invalid mobile behaviour | Screen recording or response body | Proves validation |
| 3D Assembled / Cutaway / Drive | Three screenshots | Proves v17 model interaction |
| No green chain guard | Screenshot of drive view | Proves user-requested removal |
| `/dashboard` redirects to `/login` | Screenshot | Proves access gate |
| Live CSS animation markers | Deployment CSS grep output | Proves motion shipped |
| Build output: 32 pages | Build log | Proves full render surface |

---

## 3. Commit and deployment evidence

| Item | Value |
| --- | --- |
| Legal + placeholders | `992affc` |
| PDF wording | `ff376cb`, `a68a071` |
| v17 composter | `8f2239b` |
| Guard removal + name split | `ea28892` |
| Motion polish | `f27517a` |
| Production URL | `https://hair2harvest-commercial-website.vercel.app` |
| Latest deployment alias | Vercel production alias confirmed |
| Repository status | `main...origin/main`, clean |

---

## 4. TO CONFIRM register

| Item | Ask / source | If unavailable, say |
| --- | --- | --- |
| Drum physical diameters | Final blueprint sheet | “The model uses blueprint-derived proportions; fabrication dimensions are pending.” |
| Motor wattage and reduction ratio | Blueprint/BOM | “The 12 V worm motor and 40T/10T chain are confirmed; ratings are pending.” |
| Sensor models and calibration | Hardware paper | “Telemetry is represented in the UI; physical sensor calibration is pending.” |
| Lab N-P-K / pH / maturity values | Lab sheets | “The approval gate is implemented; final values will be attached.” |
| Treated-hair policy | Final research | “Currently held and excluded from batches by default.” |
| Export formats | Final SRS | “Report views exist; export is a documented next step.” |
| Canonical barangay name | Final paper | “Both source wordings are shown and reconciled.” |
| Data retention period | Legal paper | “Withdrawn records remain traceable; retention is pending.” |

---

## 5. Day-before dry run

- [ ] Open every demo URL in a private/incognito tab.
- [ ] Hard-refresh to avoid stale cached viewer.
- [ ] Confirm language toggle starts in Tagalog.
- [ ] Confirm the 3D scene loads; prepare screenshot fallback if WebGL fails.
- [ ] Print or pin this checklist and the answer pattern.
- [ ] Assign one person to own each TO CONFIRM item.
- [ ] Rehearse Q-39, Q-43, Q-55, and Q-59 aloud — these are the highest-risk answers.
