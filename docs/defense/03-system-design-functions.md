# Hair2Harvest — Full System Design and Functions

**Version** 1.0 · **Date** 22 November 2026 · **Status** Working baseline, code-grounded  
**Supersedes:** `docs/01-system-design.md` where that document still describes the old belt-driven machine or a fully separated API deployment.

---

## 1. Scope and design thesis

Hair2Harvest is a commercial website plus an operations workspace for a barbershop hair-to-compost network in Barangay Novaliches Proper / Nova Proper, Philippines. It covers:

- public recruitment and explanation for barbershop owners;
- staff-filled shop registration and consent capture;
- pickup, grading, inventory, batch, lab, and evidence workflows;
- a procedural 3D explanation of the v17 chain-drive composter;
- role-gated dashboard views, reporting, and a help chatbot.

The central design decision remains:

> **Shops are records, not users.** A barbershop does not sign in. Staff register the shop, write its code on the sack, and all later events attach to that code.

This removes shop passwords, shop dashboards, and reset flows — the largest sources of friction for shift-based barbershops. `[VERIFIED — CODE: apps/web/src/lib/supplier-model.ts, apps/api/src/routes/suppliers.ts]`

---

## 2. Architecture

```text
Visitor / staff browser
        │
        ▼
apps/web — Next.js 16 App Router + React 19
  ├─ (site)  public commercial surface, static where possible
  ├─ (app)   dashboard, guarded by signed-cookie middleware
  ├─ /api/v1 web route handlers (reads + partner intake)
  └─ /api/auth/login, /api/auth/logout
        │  JSON fetch
        ▼
apps/api — Express 5 (optional via API_URL)
  routes → Mongoose models → MongoDB Atlas / local MongoDB
        │
        ▼
MongoDB collections: suppliers/shops, pickups, batches, labresults, users, auditlogs
```

### 2.1 Why this boundary

- **Web renders and degrades gracefully.** Every read helper accepts a typed fixture fallback; a network failure never blanks the page. `[VERIFIED — CODE: apps/web/src/lib/api-client.ts]`
- **API owns domain rules when configured.** Pickup idempotency, batch stock rules, and approval gates live in Express routes. `[VERIFIED — CODE: apps/api/src/routes/*]`
- **Current production reality.** `API_URL` is not configured on Vercel, so the public partner form writes through the Next route handler directly to MongoDB using the supplier model. Present this as a **deployment simplification**, not as a different domain model. `[VERIFIED — CODE: apps/web/src/app/api/v1/shops/route.ts, apps/web/src/lib/supplier-model.ts]`
- **Dashboard access.** `/dashboard/:path*` redirects to `/login` unless an HMAC-SHA256 signed, http-only `h2h_session` cookie is valid for 30 days. Public routes are intentionally not matched. `[VERIFIED — CODE: apps/web/src/middleware.ts, apps/web/src/lib/auth.ts]`

### 2.2 Degradation rules

| Failure | Behaviour |
| --- | --- |
| API unreachable | UI uses cached or fixture data with `source: "fixtures-fallback"` |
| WebGL unavailable | 3D component shows labelled error card and retry button |
| Reduced motion | CSS durations collapse; 3D animation loop stops |
| Invalid mobile | Client blocks submit; server returns 422 |
| Missing lab result | Batch approval returns 409 |

---

## 3. Functional module map

| ID | Module | Function | Current status | Roles |
| --- | --- | --- | --- | --- |
| M-01 | Public Site | Explain the programme, show impact, recruit shops | VERIFIED — LIVE | Public |
| M-02 | Partner Intake | Collect shop, owner name, mobile, barangay, street, unit, pickup rules, consent | VERIFIED — LIVE | Public → Staff review |
| M-03 | Language & Theme | Tagalog/English toggle; light/dark sky toggle; no-flash theme script | VERIFIED — CODE | Public |
| M-04 | 3D System Explanation | v17 chain-drive composter, 4 modes, 5 cameras, 6 callout parts | VERIFIED — LIVE | Public |
| M-05 | Shop Directory | Status-based list with no public lab/batch internals | VERIFIED — LIVE | Public |
| M-06 | Dashboard Gate | Signed session cookie, login/logout, redirect with `next` | VERIFIED — CODE | Admin |
| M-07 | Shop Records | Staff registration, supplier codes, status lifecycle, pickup rules | VERIFIED — CODE | Admin, Staff |
| M-08 | Collection & Inventory | Pickup capture, clientId idempotency, grade, treated flag, net kg | VERIFIED — CODE in API | Staff, Admin |
| M-09 | Batch & Composting | Batch creation from stock, stages, machine link | VERIFIED — CODE in API | Operator, Admin |
| M-10 | Lab & Approval | Lab versions, verdict, server-side approval gate | VERIFIED — CODE in API | Researcher, Admin |
| M-11 | Machine Telemetry | Overview readouts: SHAFT, TEMP, MOISTURE, SESSION | VERIFIED — LIVE | Operator, Public view |
| M-12 | Reports & Audit | Dashboard views for shops, pickups, batches, lab, inventory, experiments, reports | PARTIAL — views present; exports TO CONFIRM | Admin, Researcher |
| M-13 | Help Assistant | Snip chatbot, local knowledge, help locator, optional AI route, representative contact | VERIFIED — CODE | Public |

### 3.1 Public surface functions

| Route | Function | Evidence |
| --- | --- | --- |
| `/` | Hero, five-step journey, nav cards, 3D machine, impact CTA | VERIFIED — LIVE |
| `/system` | Five plain-language steps, grading, privacy, batch, v17 machine | VERIFIED — LIVE |
| `/partner` | Registration form with first/last name split and consent | VERIFIED — LIVE |
| `/network` | Shop network/status explanation | VERIFIED — LIVE |
| `/impact` | Plain-language collection results; technical lab detail removed from public view | VERIFIED — LIVE |
| `/about` | Team and programme background | VERIFIED — LIVE |
| `/terms`, `/privacy` | Bilingual legal pages using `Novaliches Proper` | VERIFIED — LIVE |
| `/login`, `/dashboard/*` | Guarded workspace entry | VERIFIED — CODE |
| `/api/v1/chat` | Server-side chat fallback | VERIFIED — CODE |

### 3.2 Registration function — exact flow

1. Visitor opens `/partner`.
2. Form collects `shopName`, `firstName`, `lastName`, `mobile`, `barangay`, `street`, `unit`, pickup rules, and consent.
3. Client normalises mobile: strip non-digits → remove `63` if length > 10 → strip leading `0` → keep first 10 digits → validate `/^9\d{9}$/`. `[VERIFIED — CODE: apps/web/src/lib/phone.ts]`
4. First and last names are joined into `contact` before submit; database schema still stores one `owner` field. `[VERIFIED — CODE: apps/web/src/components/site/partner-form.tsx]`
5. Next route handler validates required fields, normalises again, and either forwards to `API_URL` or writes via `supplier-model.ts`.
6. Stored supplier fields include `code`, `shopCode`, `shopName`, `owner`, `phone` (`+63` + 10 digits), `barangay`, `street`, `unit`, `operatingHours`, `pickupFrequency`, `consent`, `status`, and `registrationSource`. `[VERIFIED — CODE: apps/web/src/lib/supplier-model.ts]`
7. The UI shows a reference/receipt state; it does not create a shop login.

### 3.3 Collection and batch functions

- Pickup records carry `clientId` for idempotent offline sync, `shopCode`, gross kg, tare kg, derived net kg, `grade` (`Clean | Minor | Mixed`), and `treated` (`Yes | No | Unsure`). `[VERIFIED — CODE: apps/api/src/models/Pickup.ts]`
- Batch creation draws only from clean/minor, untreated, weighed stock. `[VERIFIED — CODE: apps/api/src/routes/batches.ts]`
- Batch approval is blocked server-side unless a passing lab result exists. `[VERIFIED — CODE: apps/api/src/routes/batches.ts]`
- Public impact page shows a plain four-step journey instead of raw lab/batch identifiers. `[VERIFIED — LIVE: /impact]`

### 3.4 3D explanation functions

The 3D scene is a **diagram you can turn**, not a simulation claiming process accuracy.

| Capability | Value |
| --- | --- |
| Modes | `Assembled`, `Cutaway`, `Assemblies`, `One batch` |
| Cameras | `Overview`, `Drum`, `Drive`, `Top`, `Flight` |
| Callout parts | `drum`, `shaft`, `drive`, `door`, `discharge`, `cabinet` |
| Animation | Shaft paddles and motor spin; drum shell stays still |
| API | `window.__drum.setMode`, `focusPart`, `setCamera`, `play`, `pause` |
| Safety note | “E-stop is local hardware” appears in the scene |

`[VERIFIED — CODE: apps/web/src/components/site/composting-drum-3d.tsx]`

---

## 4. State machines

```text
Shop / Supplier
  Candidate → Enrolled ⇄ Paused → Withdrawn

Pickup
  Scheduled → Collected → Weighed → In Stock
       ├→ Skipped (reason)
       └→ Rescheduled (reason)

StockLot
  Raw → In Batch → Consumed
    └→ Held (treated / unsure) → Released | Discarded

Batch
  Preparing → Composting → Curing → Sampling → Pending
       Pending → On Hold | Rejected | Approved for Supervised Testing
       Approval blocked until lab reviewed
```

Only `Approved for Supervised Testing` is claimed. No commercial fertiliser certification is claimed. `[VERIFIED — CODE + existing design doc]`

---

## 5. API surface

### 5.1 Next web routes

| Method | Path | Function |
| --- | --- | --- |
| GET / POST | `/api/v1/shops` | Partner intake; normalises mobile; direct Mongo fallback |
| GET | `/api/v1/overview`, `pickups`, `batches`, `lab`, `health` | Typed reads with fixture fallback |
| POST | `/api/v1/chat` | Chat answer/fallback |
| POST | `/api/auth/login` | Creates signed session cookie |
| POST | `/api/auth/logout` | Clears session cookie |

### 5.2 Express API routes (when `API_URL` is set)

| Method | Path | Function |
| --- | --- | --- |
| GET/POST/PATCH | `/shops` | Shop records and status changes |
| GET/POST | `/suppliers` | Supplier-compatible intake and listing |
| GET/POST/PATCH | `/pickups` | Pickup log, route list, idempotent capture |
| GET/POST/PATCH | `/batches` | Batch list, creation, stage transitions |
| GET/POST | `/lab` | Lab versions and verdicts |
| GET | `/overview` | Aggregates for dashboard and machine frame |

### 5.3 Error contract

| Code | Meaning |
| --- | --- |
| 400 | Malformed body |
| 404 | Unknown code |
| 409 | Business-rule violation: non-enrolled shop, insufficient stock, approval gate |
| 422 | Validation failure, including invalid PH mobile |
| 503 | Upstream unavailable |

---

## 6. Non-functional design

| ID | Concern | Requirement | How shown |
| --- | --- | --- | --- |
| NFR-01 | Availability | Public pages render without API | `getResource` fallback |
| NFR-02 | Performance | 32 static/dynamic pages build successfully | Production build log |
| NFR-03 | Security | Dashboard signed cookie; role guards on API | Middleware + route review |
| NFR-04 | Data integrity | Net kg derived; approval gated; mobile normalised | Model/route tests |
| NFR-05 | Accessibility | Text alternative for 3D; reduced motion | Component markup + CSS |
| NFR-06 | Localisation | Tagalog default, English toggle, PH mobile, metric units | `i18n.tsx`, `phone.ts` |
| NFR-07 | Auditability | Status transitions audited | Audit model in Express API |
| NFR-08 | Safety boundary | Web never owns E-stop/interlock/shutoff | Blueprint note + scene footer |

---

## 7. Current implementation vs target design

| Capability | Current build | Target / paper | Action before defence |
| --- | --- | --- | --- |
| Direct Express writes from web | Only when `API_URL` set | Intended single write path | Explain deployment simplification |
| Separate first/last DB fields | Joined into `owner` | May be separate in paper | Keep UI split; mark DB split TO CONFIRM |
| Offline IndexedDB pickup queue | Designed in docs; NOT VERIFIED in current web UI | Required in original design | Do not demo as implemented; show API idempotency instead |
| Exports CSV/PDF/Excel | Dashboard report view present | Export in design doc | TO CONFIRM before claiming |
| Sensor hardware | 3D/telemetry only | Physical sensors in blueprint/paper | TO CONFIRM against final blueprint |
| Lab values | Fixtures/seed in current build | Actual lab sheets | Attach final sheets before defence |

---

## 8. Defence framing

If asked “Is the system complete?”, answer:

> “The public system and the core domain rules are implemented and live. The workspace has the role-gated views and the API enforces the business gates. Three items remain evidence-bound rather than code-bound: physical sensor values, final lab sheets, and the paper’s exact hardware specifications. Those are marked TO CONFIRM in the documentation pack.”

Do **not** say “fully automated”. The correct phrase is **“authorised software requests with local hardware safety control.”**
