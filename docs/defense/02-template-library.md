# Template Library

These are copy-ready skeletons. Duplicate a template, rename it, fill every `[BRACKETED]` field, then run the quality gate in `01-documentation-standards.md`.

| Template | Use when | Output |
| --- | --- | --- |
| `templates/srs.md` | The panel asks what the system must do | Requirements list with IDs |
| `templates/system-design.md` | The panel asks how functions are arranged | Architecture + module map |
| `templates/api-spec.md` | The panel asks about interfaces or data flow | Endpoint contracts |
| `templates/hardware-systemization.md` | The panel asks about the machine | Subsystems, BOM, safety, sequence |
| `templates/test-plan.md` | The panel asks how you proved it works | Test matrix and results |
| `templates/defense-qa.md` | Rehearsing answers | Q-ID, answer, evidence, boundary |
| `templates/revision-history.md` | Any versioned document | Change log |
| `templates/traceability-matrix.md` | Linking requirement → design → test → question | Audit-ready mapping |
| `templates/figure-table.md` | Adding a diagram or data table | Caption + source + alternative text |

## Filling rules

1. Keep IDs stable. If `FR-07` becomes a test, the matrix must still point to `FR-07`.
2. Replace `[BRACKETED]` text; never leave it in a submitted copy.
3. Mark unknowns as `TO CONFIRM — owner: [NAME]` rather than deleting them.
4. One template = one document type. Do not paste API tables into the SRS.
5. After filling, paste the finished document's identifiers into the traceability matrix.

## Recommended build order

`SRS → system design → hardware systemization → API spec → test plan → traceability matrix → defence Q&A → slides`

This order matters: the Q&A and slides should be the **last** artefacts, because they summarise evidence that already exists.
