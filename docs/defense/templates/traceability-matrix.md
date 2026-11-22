# Traceability Matrix

| Requirement | Design section | Hardware ID | API / data | Test | Defence Q | Evidence status |
| --- | --- | --- | --- | --- | --- | --- |
| FR-01 | SD §3 M-02 | — | `POST /shops` | TC-001 | Q-12 | VERIFIED — LIVE |
| FR-02 | SD §5 | — | mobile normalisation | TC-002 | Q-18 | VERIFIED — CODE |
| FR-03 | SD §3 M-05 | HW-03 | `POST /batches` | TC-007 | Q-26 | VERIFIED — CODE |
| NFR-01 | SD §7 | HW-08 | E-stop boundary | TC-011 | Q-31 | VERIFIED — BLUEPRINT |

## Coverage check
- [ ] Every FR has at least one test.
- [ ] Every test maps back to an FR or NFR.
- [ ] Every hardware safety claim maps to HW-08 and a defence question.
- [ ] Every `TO CONFIRM` item has an owner and due date.
- [ ] No orphan requirement (no design, no test, no answer).
