# Problem brief

## What we are solving

AICTE needs to know which institution holds which deposit, whether the evidence is complete, what has been independently verified, when action is due, and who can authorize the next step. Fragmented records make those questions slow to answer.

This is an administrative lifecycle and evidence-management problem. The portal tracks financial instruments and authorized actions; it is not a bank, fixed-deposit marketplace, or autonomous refund service.

## Users and outcomes

| User | Main need | Successful outcome |
| --- | --- | --- |
| Institution representative | Submit and maintain deposits | Understand missing items, deadlines, and request status |
| Scrutiny officer | Review evidence and follow up | Work a prioritized queue with recorded observations |
| Competent authority | Decide eligible requests | Review evidence and clearances before recording a decision |
| Auditor | Reconstruct case history | Read a complete, attributable sequence of changes |
| System administrator | Manage access and policy configuration | Operate the system without implicit approval power |

## Requirement traceability

The ten rows below map directly to the supplied expected solution. Acceptance criteria describe our proposed implementation.

| ID | Requirement | MVP acceptance criterion |
| --- | --- | --- |
| R1 | Central repository | Search by institution, instrument reference, bank, status and date; institution sees only its own records |
| R2 | Digital documents | Upload and retrieve authorized documents; replacement creates a new version |
| R3 | Verification and discrepancies | Display source and timestamp of each confirmation; missing/mismatched fields create reviewable issues |
| R4 | Validity and maturity | Classify dates using an explicit reference date and configured thresholds |
| R5 | Renewal/replacement | Link a new instrument to its predecessor while retaining both histories |
| R6 | Release/refund requests | Route requests through scrutiny, required clearances, decision and recorded completion evidence |
| R7 | Alerts/escalation | Generate a reminder once per threshold and escalate overdue unresolved actions |
| R8 | Dashboard/reports | Every count has a defined filter and opens the corresponding records; export authorized results |
| R9 | Audit/access | Enforce roles and institution scope on the server; record all consequential actions |
| R10 | Integration/security | Keep integration adapters explicit; protect documents; clearly label simulated bank results |

## Proposed differentiators

1. **Field-level evidence:** compare institution claims, extraction suggestions and bank-confirmed facts side by side. Conflicts remain visible until resolved.
2. **Action-oriented work queue:** prioritize approaching deadlines, unresolved mismatches and blocked requests, with owner and reason visible.
3. **Continuous renewal history:** replacement is a new linked instrument; submitting it does not silently erase or close the previous one.
4. **Explainable readiness checks:** show exactly which documents, clearances or decisions are still missing from a release request.
5. **Reproducible demonstration:** use synthetic cases and a controlled demo clock to show dates, reminders and state transitions reliably.

These are proposed product choices, not claims that comparable portals lack them.

## Scope boundaries

MVP includes manual structured submission, secure document versions, scrutiny, evidence records, maturity jobs, renewal links, release routing, in-app alerts, audit and CSV reports.

OCR-assisted prefilling is an enhancement after the core flow works. Extracted text is a suggestion requiring human confirmation. It does not establish instrument authenticity. A duplicate reference is a review signal rather than proof of fraud.

Live bank confirmation, AICTE SSO, outbound email/SMS, document signatures, legacy import and payment execution depend on authorized services and validated requirements. Provide adapter interfaces and simulated fixtures first. A prototype release approval does not move money.

## Questions to resolve during discovery

These do not block synthetic prototyping:

- What instrument types and existing records must be supported beyond FDRs?
- Which institution identifiers, bank identifiers and reference formats are authoritative?
- Who scrutinizes, provides clearances, approves, and records completion for each request type?
- Which policies determine required amount, duration, renewal and release eligibility for each institution?
- Which official bank channels are available, and what evidence may be retained?
- What reminder thresholds, escalation recipients, retention periods and hosting constraints apply?
- What stack does the team know, and how much time is available before submission?
