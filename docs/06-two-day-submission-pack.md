# Two-day submission pack — PS 26265

User confirmed on 28 October 2026 that the deadline is within two days. Plan against the actual submission cutoff once known; do not assume midnight or that SIH requires a particular slide count. Team skills, official template and prototype requirements are still unknown.

## Decision now

Scope refinement: follow the [USP challenge review and AI decisions](07-usp-challenge-and-ai-decisions.md). Prioritize field-scoped evidence and controlled release readiness; obligation reconciliation is a stretch. Time-box an OCR-assisted preflight experiment to two hours and retain it only if measured entry/correction effort improves. Policy simulation and model training are deferred. All these capabilities remain proposed until implemented and checked.

Submit a focused proposal for **NidhiSetu: an evidence-aware AICTE Security Deposit/FDR Management Portal**. Use the complete research report for evidence and this pack for delivery. A prototype is supporting evidence if feasible; do not miss submission because optional features are unfinished.

The minimum convincing story is: an institution submits a deposit; an officer sees a mismatch against explicitly simulated bank evidence; a correction creates a fresh version; the history shows exactly what changed and what still needs action.

## Ready-to-adapt abstract

NidhiSetu is a proposed centralized portal for managing security deposits and Fixed Deposit Receipts associated with AICTE approval processes. It connects institution-wise records, supporting documents, scrutiny observations, maturity alerts, renewal history and authorized release requests in one traceable workflow. Its core design distinguishes institution-submitted details from independently confirmed financial evidence and ties confirmation to the exact instrument version. Officials receive an action queue showing unresolved discrepancies, deadlines and pending prerequisites; institutions receive clear correction requests and request status. The prototype scope prioritizes saved submissions, evidence comparison, version history and audit records using synthetic data and visibly simulated bank responses. Rule-based monitoring and controlled approvals provide the foundation, while OCR-assisted prefilling and authorized AICTE/bank integrations remain extensions. Evaluation will compare task accuracy, handling time, deadline coverage and pending-case visibility against a spreadsheet-and-files baseline. No real bank integration or measured improvement is claimed before implementation and testing.

## Slide-ready storyline

These six blocks are content modules, not an asserted SIH slide template. Reflow into the official format once available. Source links belong in speaker notes or a compact references area.

| Block | Suggested title | Content to use | Visual |
| --- | --- | --- | --- |
| 1 | Every deposit needs a clear next action | PS 26265; AICTE Regulation Bureau; fragmented evidence, dates and follow-up from supplied statement | One institution → scattered records → pending action |
| 2 | One traceable deposit lifecycle | Submit → scrutinize → confirm → monitor → renew → process authorized release | Lifecycle with actors and decisions |
| 3 | Evidence stays attached to the version it confirms | Claimed value, document suggestion, authorized confirmation; correction triggers fresh review | Three-column amount/reference comparison |
| 4 | A practical, secure architecture | Web UI, API/rules, relational database, private files, deadline worker, explicit bank adapter | Mermaid architecture from research report |
| 5 | Build the required core; measure outcomes | Essential flows; synthetic demo; no duplicate reminder; scope checks; spreadsheet baseline | Requirements-to-test matrix |
| 6 | Feasibility and honest future scope | Existing web skills preferred; rules first; optional OCR; integrations require authorization | Now / next / partner-dependent roadmap |

Research anchors: [AICTE base handbook](https://www.aicte.gov.in/sites/default/files/APH%20Final.pdf) for initial policy context; [NIC eOffice](https://www.nic.gov.in/project/eoffice/) and [NeSL e-BG](https://www.nesl.co.in/faqs/) for adjacent deployed patterns; [LAVA](https://aclanthology.org/2025.finnlp-2.7/) for extraction versus validation. Do not imply NeSL verifies our FDRs or that these organizations endorse the project.

## 48-hour plan

Time windows start when the team begins; reserve the last window before the real cutoff. These are coordination windows, not a recommendation to work continuously without sleep.

| Window | Priority and deliverables | Exit decision |
| --- | --- | --- |
| Hours 0–3 | Confirm official submission fields/template, team eligibility and exact cutoff; freeze problem, proposal and scope | Required fields are known; task owner assigned |
| Hours 3–8 | Adapt abstract and content blocks, draw workflow/architecture, assign claim/source owners | Proposal understandable without a live app |
| Hours 8–22 | If feasible, build one saved submission → scrutiny → simulated mismatch → correction/version → audit flow | If persistence or access checks fail, reduce feature scope; label wireframes honestly |
| Hours 22–30 | Validate core flow and role boundaries; add one deadline case only if core is stable | Stable core takes precedence over extra screens |
| Hours 30–36 | Run synthetic tests and baseline tasks; record results and limitations | Every number in materials traceable to a run |
| Hours 36–42 | Freeze content, rehearse five-minute demo, prepare local/video fallback and final export | No dependency on a new external service |
| Hours 42–48 | Check official format and file limits, proofread claims, upload before cutoff and verify submission receipt | Submission evidence retained; no last-minute feature work |

Submitting to the official portal is not performed by this research task. Any final submission must use the verified official form and actual team details.

## Scope cuts in order

Cut custom model training, blockchain, live bank connectivity, email/SMS, fancy analytics, bulk migration and multilingual content first. Use structured entry and in-app actions. Keep synthetic data and explicit simulation labels.

For the two-day software slice, preserve persisted records, server-side role/scope checks, version-bound evidence and audit. If secure file handling cannot be completed, use bundled synthetic documents and describe upload/storage as pending; do not expose an unsafe upload service to make a checkbox appear complete.

Renewal and release must remain in the solution proposal because the statement requires them. Mark them planned unless implemented and verified. A small working slice demonstrates feasibility but does not establish completion of all ten requirements.

## Team work packages

Assuming six contributors; combine packages for a smaller available team.

| Package | Output |
| --- | --- |
| Domain/submission owner | Official-field checklist, source-backed requirements, final submission coordination |
| UI owner | Institution submission and officer evidence/detail views |
| Backend owner | Saved records, transitions, scoped queries and version checks |
| Evidence/documents owner | Synthetic fixtures, comparison rules and clearly simulated adapter |
| QA/operations owner | Negative tests, repeatable seed/reset, local fallback and recorded results |
| Story/design owner | Submission visuals, concise pitch, rehearsal and honest claim review |

## Five-minute demo for the reduced slice

0:00–0:40: explain PS and pending-case problem. 0:40–1:30: submit a synthetic instrument. 1:30–2:30: officer views simulated mismatching evidence and requests a correction. 2:30–3:25: resubmit and show old versus new version and confirmation scope. 3:25–4:15: show audit timeline and scoped queue; if implemented, show one date reminder. 4:15–5:00: report actual checks and explain the proposed renewal/release flow and partner-dependent integrations.

Use the broader demo in the research report only if those features work. Static proposed flows should be visibly labeled as design, not demonstrated as live software.

## Claims allowed in the submission today

| Allowed | Not established |
| --- | --- |
| Proposed workflow maps to all ten supplied capabilities | All ten capabilities implemented |
| Consensus-assisted literature discovery, verified primary references | Consensus benchmark scores are our accuracy |
| Version-bound evidence is our core design choice | Globally unique or patentable invention |
| Rules-first prototype is feasible under stated assumptions | Guaranteed complete production system within two days |
| Synthetic bank adapter planned / implemented only when true | Live bank or AICTE integration |
| Evaluation metrics and baseline defined | Any claimed percentage improvement before measurement |

## Final submission check

Confirm exact ID/title and official template. Make team details accurate. Check links, file sizes and readability. Label planned versus implemented capabilities, synthetic data and simulated services. Keep claims matched to evidence. Verify successful portal submission with its actual receipt/status before treating the deadline task as complete.
