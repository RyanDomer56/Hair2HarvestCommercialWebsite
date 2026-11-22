# [Project Title] — System Design

**Version** [x.y] · **Date** [YYYY-MM-DD] · **Status** [Draft / Approved]

## 1. Design principles
1. [Principle, e.g. shops are records, not users.]
2. [Principle, e.g. one write path for all mutations.]
3. [Principle, e.g. never claim a certification that is not evidenced.]

## 2. Architecture
```text
[Client] → [Web / rendering] → [API / domain rules] → [Database]
                                      ↓
                              [Object storage]
```
One paragraph explaining **why** the boundary exists.

## 3. Module map
| ID | Module | Responsibility | Reads | Writes | Roles |
| --- | --- | --- | --- | --- | --- |
| M-01 | [Name] | [One sentence] | [Entities] | [Entities] | [Roles] |

## 4. Data flow — [primary journey]
1. [Actor] does [action].
2. [Component] validates [rule].
3. [Component] writes [entity] and emits [audit/notification].
4. [Actor] sees [outcome].

## 5. State machines
```text
[Entity]  StateA → StateB → StateC
                 ↘ Blocked (reason required)
```

## 6. Interfaces
Link to `api-spec.md`. Summarise only the contracts that cross a module boundary.

## 7. Non-functional design
| Concern | Decision | How checked |
| --- | --- | --- |
| Offline | [Queue with idempotency key] | [TC-xxx] |
| Security | [Role guard, session cookie] | [TC-xxx] |
| Accessibility | [Text alternative for 3D] | [TC-xxx] |

## 8. Current implementation vs target
| Capability | Current build | Target / paper | Action |
| --- | --- | --- | --- |
| [Capability] | Verified / Partial / Not implemented | [What paper says] | [Reconcile or label TO CONFIRM] |

## 9. Open items
- [Item] — TO CONFIRM — owner: [NAME].
