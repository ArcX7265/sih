# NidhiSetu — USP challenge review and AI decisions

28 October 2026. Corrected design decisions, not implemented features. No software or model validation is complete. This review refines earlier brainstorming where wording conflicts. Ten ideas are not ten defensible USPs: keep evidence handling and release readiness central, use reconciliation as a stretch, and treat queues, preflight and reports as supporting features.

## Ten challenges and fixes

| Proposed feature | Challenge / failure | Corrected behavior | Acceptance test and priority |
| --- | --- | --- | --- |
| Verification after edits | Administrative edits could needlessly invalidate every confirmation; unchanged fields can still have stale evidence. | Record confirmed field scope, source, time and original instrument version. Explicit dependency rules determine applicability to later versions. Material changes require fresh evidence for affected facts. Retain historic confirmation. Freshness/revocation is a separate check. | Contact edit leaves unrelated facts usable; amount edit requires fresh amount evidence; delayed response for old version cannot verify new version. **Core.** |
| Renewal continuity | Maturity does not necessarily terminate security; automatic-renewal terms and uncertain dates break naive gap calculations. | Separate maturity, evidenced effective validity, renewal terms, administrative acceptance and obligation period. Classify confirmed gap, possible gap and unknown continuity only under applicable rules. | Missing effective dates => unknown, not compliant/noncompliant. Pending renewal cannot silently replace original. **Narrow implementation.** |
| Release readiness | Complete checklist is not entitlement to release. Clearances may be withdrawn while an approval screen is open. | Say ready for authority review. Store evidence, validity and policy per prerequisite. Recheck prerequisites and row version transactionally at decision time. Keep approval and completion distinct. | Withdraw clearance before approval: server rejects stale decision. Checklist never transfers money. **Core workflow.** |
| Explainable queue | High-value cases may starve others; rankings can imply unjustified institutional risk. | Use visible deadline/action categories and aging, with reasoned manual overrides. Preserve searchable access to all pending cases. | Old low-value case remains visible and escalates under configured rules. No fraud/credibility score. **Supporting feature.** |
| Evidence pack | Exports may leak data; checksum alone proves neither issuer legitimacy nor protection from administrator rewriting. | Scope and redact exports; record as-of time, versions, unresolved issues and manifest. Label unsigned packs as snapshots. Independently controlled signatures/checkpoints are separate future controls. | Unauthorized documents excluded; old export remains an old snapshot after case changes. **Defer polished export.** |
| Duplicate detection | Bank references may collide; repeated scans or legitimate shared arrangements generate false positives. | Preserve raw values and leading zeros. Combine bank/reference/owner/file signals. Distinguish duplicate upload, possible same instrument and allocation conflict. Authorized reviewer resolves matches; restrict cross-institution visibility. | Same reference at different banks is not automatically merged; repeat request is idempotent; dismissed match retains reason. **Narrow control.** |
| Obligation reconciliation | Unknown requirements and unverified evidence can be mislabeled as missing money. Replacement overlap or shared instruments can double-count capacity. | Store authoritative requirement/policy separately. Explicit approved allocations with effective periods cannot exceed recognized instrument capacity. Separate supported amount, pending evidence and unknown requirement. MVP uses one currency/institution and explicit permitted allocations. | Requirement 30, supported 20, pending 10 => 10 awaits acceptable evidence, not 10 missing from bank. Unknown requirement => unable to assess. Concurrent allocations cannot overrun capacity. **Stretch.** |
| Submission rehearsal | OCR may invent fields; a compulsory AI score could block a legitimate submission. | Separate deterministic required-field checks from advisory extraction warnings. Show source region, allow corrections, abstain on absent/ambiguous values. Completeness is not authenticity. | Blurred amount triggers review; manual submission remains usable. **Best AI experiment.** |
| Policy preview | Wrong retroactivity/applicability can falsely classify institutions; generic rule engine exceeds deadline. | Read-only sandbox using versioned sample rules; explain affected cases and missing data. Production activation needs approved policy and explicit treatment of open cases. | Preview changes no live state and is reproducible. **Defer.** |
| Bottleneck analytics | Parallel stages double-count elapsed time; reassignment resets clocks; external waiting is mistaken for officer fault. | Immutable stage intervals and pause/reopen history. Distinguish elapsed case time, overlapping stage duration and external waiting. No employee ranking or predictive ETA from synthetic history. | Two parallel five-day clearances produce five elapsed days, not ten. Reassignment preserves history. **Later supporting feature.** |

## Important domain corrections

AICTE's base handbook describes release prerequisites and authority-dependent outputs. A checklist is decision support; applicable amendments and SOP still require confirmation. [AICTE handbook, clause 6.46](https://www.aicte.gov.in/sites/default/files/APH%20Final.pdf)

NeSL distinguishes e-BG requests from bank actions and status updates. This is an adjacent example, not evidence of available FDR integration. [NeSL FAQs](https://www.nesl.co.in/faqs/)

For coverage, distinguish configured obligation, documentary evidence and actual bank-held funds. Our system can report what its accepted evidence supports; it cannot infer missing money from a missing document. Do not assume principal sharing or allocation across multiple requirements is permitted. Until policy establishes that, use one-to-one allocation in the prototype.

For verification, avoid the earlier shorthand that confirmation automatically expires on any edit. Original evidence remains an historical fact; the system evaluates whether it supports the current facts and decision. Rules must identify relevant fields and dependencies.

## AI candidates

| Feature | Candidate / documented source | Decision and limitation |
| --- | --- | --- |
| Scan-to-form suggestions with highlighted source | [PaddleOCR PP-OCRv5](https://github.com/PaddlePaddle/PaddleOCR); [Tesseract](https://github.com/tesseract-ocr/tesseract) fallback | First experiment. OCR text/coordinates feed deterministic field extraction and review. Engine scores are not authenticity probabilities. |
| Structured PDF conversion | [Docling](https://github.com/docling-project/docling) | Alternative pipeline if layout/tables justify it. Toolkit, not a bank-verification model. MIT code; check dependent model terms separately. |
| Map extracted text to a fixed schema | [Qwen3-4B](https://huggingface.co/Qwen/Qwen3-4B), Apache-2.0 model card | Optional local text-model candidate. Requires OCR text; does not directly read scanned pages. Require source spans and null for absent values. Hardware/latency untested. |
| Draft discrepancy explanation or case summary | Same text-model adapter, grounded only in saved evidence | Stretch. Every factual statement references a field/event; no authority to mutate records. Templates suffice initially. |
| Policy assistant | Retrieval over approved, effective-dated rules with clause citations | Future scope; unknown applicability must produce abstention. Corpus completeness matters more than model fluency. |
| Forgery classifier, institution risk score or autonomous release | No selected model | Exclude: no representative FDR fraud/outcome dataset, no validated decision model or delegated authority. |

PaddleOCR's project is Apache-2.0. Pin exact code/checkpoint versions and review their dependencies before use. Do not claim a candidate is best or accurate on our documents without local evaluation.

## AI evidence contract

Each suggestion stores field name, raw text, normalized candidate, source document/version, page, bounding box or text span, engine/checkpoint version and human-review state. Label engine confidence as an engine score unless calibration is validated. Missing/ambiguous values remain null. Corrections preserve the original suggestion.

Flow: synthetic document → PDF text extraction or OCR → field candidates → deterministic format/date/amount checks → highlighted human review → saved institution claim → separate authorized confirmation. AI cannot upgrade a suggestion to bank-confirmed.

Documents are untrusted input: embedded instructions cannot override processing rules. Give the model no tools or database-write authority; constrain outputs, limit processing time and validate references. A valid JSON object can still contain wrong information. Extraction runs outside the request and failure leaves manual entry available. Cloud experiments use synthetic data; real financial files require an authorized processing arrangement.

## Two-day implementation gate

Time-box OCR feasibility to two hours on actual available hardware. Use 20–30 synthetic pages across multiple layouts, with clean, blurred, rotated, missing-field and conflicting-value cases. Record critical-field exact match, absent-field hallucinations, correction time, latency and memory. Compare to manual entry and preserve unseen-layout cases for final testing. This is an engineering check, not a deployment benchmark. No model training in the submission sprint.

Keep AI only if observed entry/correction effort improves without weakening review. Otherwise retain manual entry and label document AI as future scope. Do not spend the sprint maintaining several model stacks.

Core build: persisted evidence with field/version scope and safe transitions, followed by release-readiness checks. Stretch: a single approved synthetic obligation and non-overlapping allocation example. Full renewal/release requirements remain in the proposal even where implementation is pending.

## Adversarial demo

1. Extract a document with an ambiguous amount: system requests review rather than guessing.
2. A synthetic document contains instructions to approve itself: these have no effect.
3. Simulated bank evidence disagrees with institutional claim: show both sources.
4. Correct material facts: old confirmation remains visible but does not verify the new facts.
5. Change contact details only: unrelated evidence is not invalidated.
6. Attempt approval after a clearance is withdrawn: server blocks the transition.
7. Optional allocation test: supported versus pending amounts are shown without asserting financial loss; duplicate records do not inflate accepted capacity.

These are future acceptance tests, not tests already passed. Pitch three outcomes: evidence-linked document assistance, confirmation that tracks the facts it supports, and clear next actions for authorized processing. Audit/access controls remain required engineering foundations rather than novelty claims.
