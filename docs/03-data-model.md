# Hair2Harvest — Data Model & API

**Database** MongoDB 7 · **ODM** Mongoose 9 · **Base path** `/api/v1`

---

## 1. Collections

| Collection | Purpose | Key invariants |
| --- | --- | --- |
| `shops` | Barbershop records | Unique `code`; **no user reference, no password** |
| `pickups` | One collection event | Unique `clientId` (idempotent offline sync); `netKg = grossKg − tareKg` |
| `batches` | One composting run | `currentKg ≤ inputKg`; approval blocked without a passing lab result |
| `labresults` | Laboratory reports | `(code, version)` unique; re-tests append, never overwrite |
| `users` | Staff accounts | Four roles only |
| `auditlogs` | Immutable action log | Updates and deletes rejected by a pre-hook |

### 1.1 `shops`

```ts
{
  code: "HB-001",              // identity. Written on the sack.
  name, contact, mobile, channel,
  barangay, address, openingHours, inPilotArea,
  status: "Candidate" | "Enrolled" | "Paused" | "Withdrawn",
  pickupRule: {
    frequency: "Nightly" | "Twice weekly" | "Weekly" | "Custom",
    days: ["Tue", "Fri"],
    window: "After closing · 8–9 PM",
    access: "Side door on Mabini. Ask for Ruel.",
    peakDay: true
  },
  consent: { given, on, explainedBy, photoPermission },
  registeredBy: "R. Cepeda",
  totalNetKg, pickupCount
}
```

Indexes: `code` (unique), `status`, text index on `name · barangay · code`.

### 1.2 `pickups`

```ts
{
  code: "PK-2418",
  clientId: "uuid-v4",         // idempotency key from the phone
  shop: ObjectId, shopCode: "HB-001",
  scheduledFor, window, collectedAt,
  sacks: 3, grossKg: 6.42, tareKg: 0.18, netKg: 5.88,
  grade: "Clean" | "Minor" | "Mixed",
  treated: "No" | "Yes" | "Unsure",
  rejectionReason: "" | "Mixed waste" | "Wet" | "Treated" | "Too small",
  status: "Scheduled" | "Collected" | "Weighed" | "Skipped" | "Rescheduled",
  collector, acknowledged, acknowledgedAt, photoUrl, note
}
```

`netKg` is derived in a `pre("validate")` hook so a client cannot post a net weight that disagrees with gross minus tare.

### 1.3 `batches` and `labresults`

```ts
// batches
{ code: "BATCH-2601",
  recipe: { version, hairPct, carbonPct, greensPct },
  operator, machine, shopCodes, lots[],
  inputKg, currentKg, moisture, temperature,
  stage: "Preparing" | "Composting" | "Curing" | "Sampling"
       | "Pending" | "On Hold" | "Rejected" | "Approved",
  startedOn, stageHistory[{ stage, at, by, remark }] }

// labresults
{ code: "LR-0412", version: 1, batch, batchCode, laboratory,
  n, p, k, ph, moisture, maturity, pathogens,
  verdict: "Pass" | "Review" | "Fail",
  enteredBy, reviewedBy, reviewedAt }
```

---

## 2. Endpoints

### Shops

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/shops?status=&q=&pilot=` | Filterable list |
| `GET` | `/shops/:code` | Shop plus last 24 pickups |
| `POST` | `/shops` | Staff registration. Generates `HB-00n`, status `Candidate`, writes an audit entry |
| `PATCH` | `/shops/:code` | Status or pickup-rule change, audited with before/after |

`POST /shops` body:

```json
{
  "name": "Barako Brothers Grooming",
  "contact": "Ruel Santos",
  "mobile": "0917 402 1188",
  "barangay": "Balanga · Poblacion",
  "frequency": "Twice weekly",
  "window": "After closing · 8–9 PM",
  "access": "Side door on Mabini",
  "consent": true,
  "photoPermission": true
}
```

### Pickups

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/pickups?status=&shop=&grade=&limit=` | Log |
| `GET` | `/pickups/route?date=` | Ordered collector list for one day |
| `POST` | `/pickups` | **Idempotent on `clientId`.** Rejects non-enrolled shops with 409 |
| `PATCH` | `/pickups/:code` | Grade correction or status change, audited |

Idempotency contract: a repeated `POST` with the same `clientId` returns `200` with `{ idempotent: true }` and the original document. It never increments stock twice.

### Batches and lab

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/batches?stage=` | List |
| `GET` | `/batches/:code` | Batch plus lab versions |
| `POST` | `/batches` | Draws only from `Clean`/`Minor`, `treated: "No"`, `Weighed` stock. Returns `409` with `availableKg` when short |
| `PATCH` | `/batches/:code/stage` | `Approved` returns `409` unless a `Pass` lab result exists |
| `GET` | `/lab?verdict=` | Results |
| `POST` | `/lab` | Appends a new version; verdict computed from thresholds |

### Aggregates

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/overview` | Shops by status, pickups by status, grade mix %, active batches, lab count, weekly net kg |
| `GET` | `/health` | `{ ok, db, uptime }` |

---

## 3. Error contract

```json
{ "error": "A batch cannot be approved until lab results are reviewed." }
```

| Code | Meaning |
| --- | --- |
| 400 | Malformed body |
| 404 | Unknown code |
| 409 | Business rule violated (non-enrolled shop, insufficient stock, approval gate) |
| 422 | Schema validation failed — includes `issues[]` |
| 503 | Upstream unavailable |

---

## 4. Web intake route

`POST /api/v1/shops` on the Next app is the public partner form. It validates the four required fields, forwards to the API when `API_URL` is set, and otherwise returns `202 { reference }` so a shop owner is never shown a failure for an infrastructure reason.
