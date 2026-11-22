# [Project Title] — Test Plan and Results

**Version** [x.y] · **Date** [YYYY-MM-DD]

## 1. Scope
Tested: [list]. Not tested: [list, honestly].

## 2. Environment
| Item | Value |
| --- | --- |
| URL / build | [production URL or local commit] |
| Browser / device | [e.g. Chrome 131, desktop; Safari iOS] |
| Database state | [seed / staging / production copy] |
| Date | [YYYY-MM-DD] |

## 3. Test matrix
| TC | Requirement | Steps | Expected | Actual | Pass / Fail | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| TC-001 | FR-01 | 1. Open `/partner` 2. Submit valid data | 202 + reference | [result] | [Pass] | [screenshot / log] |
| TC-002 | FR-02 | Submit mobile with leading 0 | Normalised, not +630 | [result] | [Pass] | [response body] |

## 4. Negative and boundary tests
- Invalid phone — expected 422.
- Duplicate pickup `clientId` — expected one stock increment.
- Approval without lab result — expected 409.
- Offline submit then reconnect — expected no duplicate.

## 5. Accessibility and reduced motion
- [ ] Keyboard can reach primary CTA.
- [ ] `prefers-reduced-motion` collapses animation.
- [ ] 3D scene has text alternative.

## 6. Known issues
| Issue | Severity | Workaround | Disclosure in defence |
| --- | --- | --- | --- |
| [Issue] | Low/High | [Workaround] | [Say / do not overclaim] |

## 7. Summary
[Passed X/Y. Critical paths passed. Remaining risks: ...]
