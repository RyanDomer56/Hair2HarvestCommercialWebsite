# [Project Title] — API and Data Contract

**Base path** [`/api/v1`] · **Auth** [cookie session / none] · **Version** [x.y]

## 1. Resource inventory
| Entity | Key | Invariants |
| --- | --- | --- |
| [shops] | [code] | [No user reference; unique code] |
| [pickups] | [clientId] | [Idempotent; net = gross − tare] |

## 2. Endpoint contract
### `[METHOD] /path`
**Purpose:** [one sentence]  
**Auth:** [role]  
**Request:**
```json
{ "field": "value" }
```
**Success:** `[200/201]` with `{ "field": "value" }`  
**Failure:** `[400/404/409/422/503]` with `{ "error": "..." }`  
**Side effects:** [writes, audit, notification]  
**Test:** `TC-xxx`

## 3. Validation rules
| Field | Rule | Error |
| --- | --- | --- |
| [mobile] | [10 digits starting 9] | 422 |
| [stage] | [Allowed transitions only] | 409 |

## 4. Error contract
```json
{ "error": "Human-readable reason" }
```

## 5. Idempotency
[Describe key, retry behaviour, and how duplicates are prevented.]

## 6. Approval / safety gates
- Gate: [condition]
- Enforced at: [server / hardware]
- Cannot be bypassed by: [UI / client payload]

## 7. Change log
See `revision-history.md`.
