# Hair2Harvest — System Design

**Version** 1.0 · **Date** 2 November 2026 · **Stack** MongoDB · Express.js · React · Node.js
**Scope** Commercial web presence + operations workspace for a barbershop hair-to-compost network in Bataan, Philippines.

---

## 1. What the system is

Hair2Harvest collects human hair from barbershops, grades it at the door, composts it in batches, and proves the output with lab results and planting experiments. The commercial website sells the service to shops and to institutional partners. The operations workspace runs the collection, the batch, and the evidence trail.

The design follows the **Revised System Design (2 Nov 2026)** and the earlier module breakdown. The single most important decision carries through everything below:

> **Suppliers are records, not users.** A barbershop never signs up, never logs in, never resets a password. Staff register the shop on site in under two minutes and write a shop code on its hair sack. Every other design choice follows from that.

That decision removes an entire auth surface, an entire supplier dashboard, and the largest known source of drop-off in the original design (shops with shift work will not go to a barangay office, and do not want another login).

### 1.1 Design decisions carried from the source documents

| Topic | Decision | Consequence in this build |
| --- | --- | --- |
| Suppliers | Barbershops only, no accounts | Four roles, staff-filled registration, shop code as identity |
| Waste type | Human hair only | One inventory stream, two quality flags |
| GIS | No GIS, no routing, no live GPS | Ordered route list sorted by time window, then barangay |
| Machine control | Web sends authorised start/stop only | E-stop, lid interlock, motor shutoff stay in local hardware |
| Approval | No batch approved without reviewed lab results | Approval gate enforced server-side, not in the UI |
| Roles | Admin, Staff, Operator, Researcher | Permission matrix in §4 |

### 1.2 Changes adopted from the revised design

1. **Supplier accounts removed.** Staff registration, shop code (`HB-001`), status lifecycle `Candidate → Enrolled → Paused → Withdrawn`.
2. **Per-shop pickup rules.** Frequency, days, time window, access notes, peak-day flag. Default twice weekly.
3. **Collector goes to the shop.** No drop-off flow. Phone-first route list with offline capture.
4. **Pickups record sacks and kilograms.** Gross weight, standard sack tare, net kg derived.
5. **Contamination graded at pickup.** `Clean · Minor · Mixed`. Mixed triggers a coaching note, never a rejection.
6. **Treated hair flagged.** `Yes · No · Unsure`. Treated and unsure stock sits in a separate line and is excluded from batches by default.
7. **Shop contact without logins.** Templated SMS / Messenger, sent by staff, three message types only.
8. **Consent recorded at registration.** Date, who explained it, photo permission for the thesis.
9. **Shop list before map.** Status list is the primary view; the map is an optional projection of the same records.
10. **Four roles.** Supplier role deleted; the optional per-shop read-only link is a link, not a role.

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  Client                                                              │
│                                                                      │
│  apps/web — Next.js 16 (App Router, RSC)                             │
│   ├─ (site)   commercial surface   · static, SEO, 3D system diagram  │
│   └─ (app)    operations workspace · client components, live data    │
└───────────────┬──────────────────────────────────────────────────────┘
                │  fetch /api/v1/*        (JSON, cookie session)
┌───────────────▼──────────────────────────────────────────────────────┐
│  apps/api — Express 5                                                │
│   routes → controllers → services → Mongoose models                  │
│   zod validation · role guard · audit middleware · rate limit        │
└───────────────┬──────────────────────────────────────────────────────┘
                │
        ┌───────▼────────┐        ┌────────────────────┐
        │  MongoDB       │        │  Object storage    │
        │  (Mongoose 9)  │        │  pickup photos,    │
        │  replica set   │        │  lab PDFs          │
        └────────────────┘        └────────────────────┘
```

**Why a separate API and not Next route handlers.** The collector client is a phone that loses signal in mall back rooms. Keeping the domain in one Express service means the offline sync endpoint, the machine telemetry ingest, and the reporting exports share one write path and one audit trail. Next stays a rendering layer.

**Offline strategy.** The pickup form writes to IndexedDB first and queues a mutation with a client-generated `clientId`. `POST /pickups` is idempotent on `clientId`, so a retry after reconnection cannot double-count sacks or kilograms.

---

## 3. Modules

Thirteen modules, as in the source design, with the revisions applied.

| # | Module | Responsibility | Owns | Roles |
| --- | --- | --- | --- | --- |
| 1 | Auth & Access | Sessions, password reset, optional 2FA for admins, RBAC | Users, Sessions | All |
| 2 | Shop Registration | Staff-filled one-screen form, shop code, consent, pickup rule | Shops | Admin, Staff |
| 3 | Collection & Inventory | Recurring pickups from rules, route list, weighing, grading, stock | PickupRules, Pickups, StockLots | Staff, Admin |
| 4 | Shop Map (optional) | Static pins, status colours, pilot-barangay eligibility | — reads Shops | Admin, Staff |
| 5 | Batch & Composting | Batch creation, recipe version, quantities, curing, logs | Batches, Recipes, BatchLogs | Operator, Admin |
| 6 | Machine Monitoring | Authorised start/stop, live temperature and motor state, faults | Machines, Sessions, Telemetry | Operator |
| 7 | Lab Results | N-P-K, pH, moisture, maturity, pathogens; attachments; re-tests | LabResults, Attachments | Researcher |
| 8 | Quality & Approval | Thresholds, recommendation, admin sign-off, status history | Guidelines, StatusDecisions | Admin |
| 9 | Planting Experiments | Treatments, growth logs, photos, traceability | Experiments, GrowthLogs | Researcher |
| 10 | Reports & Export | CSV / PDF / Excel, full traceability report | — | Admin, Researcher |
| 11 | Notifications | In-app for staff; templated SMS/Messenger for shops | Notifications | All |
| 12 | Audit Trail | Immutable who/what/when, remarks | AuditLogs | Admin |
| 13 | Dashboard | Role-scoped summary cards and trends | — aggregates | All |

### 3.1 Module interactions

| Module | Reads | Writes / calls |
| --- | --- | --- |
| Collection | Shops (enrolled only) | StockLots, Notifications, Audit |
| Batch | StockLots | StockLots (deduct), Audit |
| Machine | Batch (must be active) | Telemetry, Notifications, Audit |
| Lab | Batch | Notifications, Audit |
| Quality | LabResults, Guidelines | Batch.status, Audit, Notifications |
| Experiments | Batch (approved only) | Audit |
| Reports | everything, read-only | — |
| Dashboard | everything, read-only | — |

### 3.2 The status machine

```
Shop        Candidate ──▶ Enrolled ──▶ Paused ⇄ Enrolled
                             └──────▶ Withdrawn

Pickup      Scheduled ──▶ Collected ──▶ Weighed ──▶ In Stock
                ├──────▶ Skipped   (shop closed / not full — not a shop failure)
                └──────▶ Rescheduled (reason required)

StockLot    Raw ──▶ In Batch ──▶ Consumed
              └──▶ Held (treated / unsure) ──▶ Released | Discarded

Batch       Preparing ──▶ Composting ──▶ Curing ──▶ Sampling
                                                      │
                          Pending ◀───────────────────┘
                             ├──▶ On Hold
                             ├──▶ Rejected
                             └──▶ Approved for Supervised Testing
                                  (blocked until lab results reviewed)
```

---

## 4. Roles and permissions

| Capability | Admin | Staff | Operator | Researcher |
| --- | --- | --- | --- | --- |
| Shop registration | Approve, manage | Register, edit | View | View |
| Collection & inventory | Full | Record pickups | View | View |
| Batch management | Full | View | Create, update | View |
| Machine control | View | None | Operate | View |
| Lab results | View | None | None | Enter, upload |
| Quality approval | Edit rules, approve | View status | View status | View |
| Experiments | View | None | None | Manage |
| Reports & audit | Full | Limited | Limited | Reports |

Shop-facing communication is **outbound only**: three templates (pickup reminder, pickup missed or rescheduled, pickup recorded) sent by staff from their own phone. Shops reply "skip" or "not full"; staff mark the pickup accordingly.

---

## 5. Non-functional requirements

| Concern | Requirement |
| --- | --- |
| Performance | Marketing LCP < 2.0 s on 4G; workspace interaction < 100 ms; 3D scene degrades to a static poster under `prefers-reduced-motion` or no WebGL |
| Offline | Pickup capture works with no signal; idempotent sync on reconnect |
| Security | Session cookies `HttpOnly · Secure · SameSite=Lax`; bcrypt cost 12; role guard on every mutating route; rate limit 60 req/min/IP |
| Auditability | Every status transition writes an immutable AuditLog entry with actor, before, after, remark |
| Accessibility | WCAG 2.2 AA. The 3D diagram is decorative-plus; every station's content exists in text below it |
| Data integrity | Net kg never negative; batch cannot exceed available stock; approval blocked without a reviewed lab result |
| Localisation | `en-PH`, metric units, `Asia/Manila`, PHP currency |

---

## 6. Open items carried forward

These are unresolved in the source research and are surfaced in the UI as "assumptions", not as facts:

1. Which of the 9 candidate shops sit inside the pilot barangay, and which six were interviewed.
2. Whether treated hair is acceptable in compost, and at what share.
3. How to serve the mall shop that wants nightly pickup.
4. The real sack tare weight used to compute net kg (currently 0.18 kg, configurable).
5. The barangay's written answer on whether a separate hair programme exists.
6. Verification of the P.D. 856 and DSQC claims against official sources.

The interface never states an unverified regulatory claim as settled. Where the research is thin, the copy says so.
