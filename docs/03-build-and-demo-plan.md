# Build and demo plan

## Delivery order

Stages are ordered by dependency, not estimates of guaranteed completion time.

| Stage | Deliverable | Exit criterion |
| --- | --- | --- |
| 1 | Schema, migrations, synthetic fixtures, identities and roles | Two institutions are isolated; officer scope is enforced |
| 2 | Submission, documents, scrutiny and audit | Submit a record, request correction, resubmit and inspect immutable history |
| 3 | Evidence adapter and discrepancy queue | Simulated match/mismatch/unavailable responses remain visibly distinct |
| 4 | Deadline worker, reminders, renewal | Fixed demo date reproduces threshold alerts; rerun does not duplicate them |
| 5 | Release request, clearances, decisions | Missing requirements block approval; authorized completion is recorded separately |
| 6 | Dashboard, filters, exports and evaluation | Counts reconcile with filtered records; metrics come from recorded test runs |

Add OCR, live integrations, localization and bulk import only after the end-to-end lifecycle works.

## Interface inventory

1. **Officer overview:** pending verification, deadlines, unresolved issues, blocked release requests; each tile opens a filtered work queue.
2. **Institution workspace:** deposits, next actions, submission form and requests.
3. **Instrument detail:** claimed versus confirmed fields, document versions, linked renewals and chronological audit timeline.
4. **Scrutiny queue:** assignment, evidence, observations, correction requests and decisions.
5. **Renewal view:** previous and replacement instrument side by side, coverage dates and acceptance state.
6. **Release case:** document checklist, clearances, decision record and completion evidence.
7. **Reports and policy administration:** scoped exports; versioned configuration with recorded changes.

## Six-minute demonstration

Use a fixed demo clock of 28 October 2026 and clearly synthetic institution names. Demo controls must be unavailable in production.

| Time | Action | Proof on screen |
| --- | --- | --- |
| 0:00–0:40 | Open officer work queue | Real saved records explain pending actions and dates |
| 0:40–1:40 | Institution submits an FDR and document | Submission version, validation and audit event |
| 1:40–2:40 | Run simulated verification with amount mismatch | Submitted amount and simulated confirmed amount remain visible; discrepancy opens |
| 2:40–3:30 | Correct/resubmit and obtain a simulated match | Prior version remains; fresh evidence is tied to the new version |
| 3:30–4:20 | Show an instrument maturing on 4 November; run worker twice | Seven-day reminder appears once; renewal submission links both records |
| 4:20–5:30 | Process a separate eligible release case | Missing clearance blocks approval; completed checklist enables a separate authority decision |
| 5:30–6:00 | Open timeline and report | Decisions, evidence, owners and case counts reconcile |

Release demonstration should use a separate fixture with its own eligible policy context. Do not make a newly submitted deposit immediately eligible merely to shorten the demo.

## Acceptance scenarios

| Case | Expected result |
| --- | --- |
| New valid submission | Submitted version is saved; scrutiny task and audit entry are created |
| Missing or unreadable required document | Case cannot be accepted; missing requirement is shown |
| Maturity before issue date / nonpositive amount | Submission rejected with field-specific errors |
| Reused bank reference / same file checksum | Review signal shows related authorized records; no automatic fraud finding |
| Bank adapter unavailable | Retry/follow-up state, never a confirmed badge |
| Changed amount after confirmation | New version requires fresh confirmation |
| Seven-day threshold, due today, yesterday | Correct date classification under fixed reference date |
| Repeated/concurrent worker execution | Unique reminder event per recipient, due date and threshold |
| Renewal pending/rejected | Original instrument retains its actual lifecycle; history is preserved |
| Release missing clearance / self-approval | Server rejects transition and explains unmet condition |
| Release approved but no completion evidence | Request remains approved; instrument is not marked released |
| Cross-institution URL/export access | Server denies data and document access |
| Concurrent decisions | One valid transition; stale request receives a conflict |
| Unauthorized audit modification | Application permission denies mutation |

## Evaluation without invented results

Create a synthetic ground-truth dataset covering at least 30 instruments, two institutions, several bank labels, all date boundaries, missing documents, discrepancies, replacements and release cases. Use deterministic fixtures for automated checks and a separate held-out set for user tasks.

| Outcome | Measurement | Proposed target, not a result |
| --- | --- | --- |
| Record accuracy | Exact agreement with known fixture values after submission/review | All mandatory fixture fields correctly retained |
| Verification handling | Time from submission to recorded review; separate active handling time from external waiting | Compare against the same task performed with files and a spreadsheet |
| Renewal monitoring | Required threshold events generated / expected events | 100% in deterministic deadline scenarios; no duplicate events |
| Manual tracking effort | Task completion time and manual steps on matched tasks | Reduction demonstrated by measured runs; no percentage claim in advance |
| Case visibility | Time and accuracy when finding unresolved cases | Correct results that reconcile with seeded ground truth |
| Access protection | Cross-scope and unauthorized-transition checks | All planned negative scenarios denied |

Human evaluation: have participants perform equivalent tasks in a spreadsheet baseline and the portal, alternate task order, record errors and median completion time, and disclose participant count and synthetic-data limitations. Simulated bank response speed must never be presented as real bank verification turnaround.

## Next implementation task

Confirm the team's existing stack and submission deadline, then scaffold stage 1 and stage 2. The first reviewable software deliverable should contain persisted submissions, versioned documents, actual authorization checks and an audit timeline. Keep deployment and integration claims tied to implemented evidence.
