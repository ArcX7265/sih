# NidhiSetu — reviewer and demo guide

This is a SIH 2026 prototype for problem statement 26265. It demonstrates security-deposit administration with **synthetic institutions, synthetic instruments and simulated bank responses**. The demonstration clock is fixed at **28 October 2026**.

## Before presenting

- Sign in to the private site. Each signed-in visitor has an isolated, persisted demonstration workspace.
- The persona selector changes the role being simulated: **Institution → Officer → Authority**. These are test personas under one signed-in account, not independently authenticated officials.
- Keep a synthetic PDF, PNG or JPEG ready for the upload step. The upload limit is 5 MB. Do not use real financial documents in this demo.
- Rehearse the sequence once. Saved changes remain after refresh; a record already released cannot be reused for the same journey.

## Four-minute demonstration

| Time | Persona and action | What to explain |
| --- | --- | --- |
| 0:00–0:30 | **Officer:** open Overview, then a deposit detail. | One queue connects submitted facts, evidence, pending actions and document history. Amounts are documentary records, not a view into bank balances. |
| 0:30–1:15 | **Officer:** open **FDR-2026-002**, Sahyadri Institute of Technology. Inspect the existing amount discrepancy: ₹15,00,000 submitted versus ₹14,50,000 in the simulated response. Review the correction request. | The institution's claim and the simulated issuer response are distinct. A mismatch cannot be silently approved. |
| 1:15–2:00 | **Institution:** open the same record, correct the amount to **₹14,50,000** and save a new version with a reason. Upload the corrected synthetic supporting document. | The previous version, response and review reason remain in history. Evidence must support the current facts. |
| 2:00–2:35 | **Officer:** inspect the old evidence, run a **simulated matching** response for the current version, then verify. | This is a deterministic simulator, not a live bank integration or AI authenticity decision. |
| 2:35–3:30 | **Institution:** request release with a reason. **Officer:** record the three sample prerequisite checks. **Authority:** review and approve. **Officer:** record completion. | Readiness, approval and completion are separate decisions. The portal does not transfer funds. |
| 3:30–4:00 | **Officer:** open Maturity watch, run reminders twice, then inspect Audit trail. Refresh the page. | Reminders are deduplicated; saved records survive refresh. Maturity is an action trigger, not automatic proof that security has lapsed. |

If the selected record has already completed the journey, start with a new institution submission, then use the Officer's **simulated mismatch** action and request correction. Use a different reference for each rehearsal. The Institution persona can access only its own institution's records. For a shorter release demonstration, **FDR-2026-004** starts with all sample prerequisites checked and authority approval pending.

## Useful challenge demonstrations

1. **Contact-only edit:** bank evidence for unchanged material facts remains usable.
2. **Amount edit:** previous confirmation remains historical but cannot support the changed amount. A new document and matching evidence are required before verification.
3. **Late response:** a response linked to an old version cannot verify a subsequently changed fact.
4. **Withdrawn clearance:** remove a prerequisite and attempt approval/completion. The server must reject the transition; the checklist is evaluated again at decision time.
5. **Concurrent edit:** leave the same record open in two tabs, save one, then try to save the other. A revision conflict should require reloading instead of overwriting the first change.
6. **Institution scope:** switch to Institution and confirm that another institution's details and documents are unavailable.

These are review scenarios, not a claim that every scenario has passed. See the delivered test results for verified coverage.

## Implemented scope and production gaps

The prototype uses Cloudflare D1 for saved workflow state and R2 for uploaded supporting files. It models document versions, scoped evidence, review actions, maturity reminders and a sample release workflow. The server enforces the selected test persona's permitted actions and institution scope.

The following are **not implemented production capabilities**:

- Live bank/FDR verification, AICTE integration or an official endorsement.
- Real institution onboarding, independent officer accounts, organizational authorization or real separation of duties.
- Financial settlement, refund execution or proof that a release payment occurred.
- Legally validated release rules. The three prerequisite switches are sample decision controls, not verified AICTE clearance evidence or a complete policy engine.
- An approved evidence-expiry policy. The prototype's 30-day freshness window is a demonstration rule and must not be presented as an AICTE requirement.
- Automatic background delivery of email/SMS reminders. The demonstration runs a persisted reminder job manually.
- A tamper-proof or externally signed audit ledger. The timeline is application history within the prototype's storage model.
- Definitive renewal continuity or regulatory compliance conclusions from maturity dates alone.
- OCR, LLM-generated summaries, forgery detection or any validated AI model. Any review summary is derived from recorded fields and rules. Document AI remains a separately evaluated future feature.

The strongest claim to make is: **NidhiSetu shows which evidence supports which facts, preserves the review history, and makes the next permitted action clear.**
