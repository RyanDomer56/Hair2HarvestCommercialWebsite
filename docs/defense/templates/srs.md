# [Project Title] — Software Requirements Specification

**Version** [x.y] · **Date** [YYYY-MM-DD] · **Author** [NAME] · **Status** [Draft / Approved]

## 1. Scope
The system covers [include]. It explicitly excludes [exclude: e.g. supplier logins, GIS routing, automated hardware control].

## 2. Stakeholders
| Role | Need | Authority |
| --- | --- | --- |
| [Barbershop owner] | [Simple handover, no login] | None |
| [Staff collector] | [Record pickup offline] | [Write pickup] |
| [Operator] | [Manage batch and machine request] | [Write batch] |
| [Researcher] | [Enter lab and growth data] | [Write lab] |
| [Admin] | [Approve, audit, export] | [Full] |

## 3. Functional requirements
| ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-01 | The system shall [verb] [object] so that [observable outcome]. | Must | TC-001 |
| FR-02 | The system shall reject [invalid case] with [code]. | Must | TC-002 |

## 4. Non-functional requirements
| ID | Category | Requirement | Verification |
| --- | --- | --- | --- |
| NFR-01 | Performance | [Metric under load] | [Tool / test] |
| NFR-02 | Security | [Control] | [Review / test] |
| NFR-03 | Accessibility | [Standard] | [Audit / checklist] |

## 5. Business rules
- BR-01: [e.g. only enrolled shops can be picked up].
- BR-02: [e.g. a batch cannot be approved without a reviewed result].
- BR-03: [e.g. net kg = gross kg − tare kg].

## 6. Assumptions
- A-01: [ASSUMPTION — owner: NAME].
- A-02: [TO CONFIRM from final paper].

## 7. Out of scope / future work
- [Item] — reason: [reason].

## 8. Revision history
See `revision-history.md`.
