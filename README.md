# SIH 2026 — PS 26265

**Statement:** Streamline of security deposit/ FDR portal.  
**Organization:** AICTE · Regulation Bureau  
**Category:** Software · Smart Automation

## Proposed solution: NidhiSetu

Working name, subject to team choice. A centralized portal that gives AICTE and institutions a traceable view of every security deposit: submission, scrutiny, bank confirmation, maturity monitoring, renewal/replacement, and authorized release processing.

**Pitch:** Every deposit has an owner, an evidence trail, and a next action—so officials can see what needs attention and institutions can see what is pending.

Our main differentiator is evidence-backed verification: submitted details, document-extracted details, and independently confirmed details remain distinguishable. A clean-looking PDF must never automatically become a bank-verified FDR.

## Project status

The working prototype is in [prototype](prototype/README.md), with a [demo walkthrough](prototype/DEMO.md). It implements saved deposits, scoped demo personas, simulated bank evidence, corrections, documents, maturity tracking, renewal links, release controls and audit history. Domain tests and the local API smoke test pass. Research documents retain the original proposed architecture; the prototype uses React/TypeScript, Vinext, D1 and R2. AI/OCR and real bank integrations remain future work.

| Document | Purpose |
| --- | --- |
| [Problem brief](docs/01-problem-brief.md) | Problem interpretation, requirements, boundaries, questions |
| [System design](docs/02-system-design.md) | Roles, state model, data model, architecture, controls |
| [Build and demo plan](docs/03-build-and-demo-plan.md) | Implementation order, acceptance criteria, demo and metrics |
| [Deep research report](docs/04-deep-research-report.md) | Landscape, evidence-backed gaps, three approaches, architecture, data, risks and judge Q&A |
| [Consensus and source log](docs/05-consensus-and-source-log.md) | Consensus usage, checked publications, source register and evidence limitations |
| [Two-day submission pack](docs/06-two-day-submission-pack.md) | Ready-to-adapt abstract, slide content, reduced prototype scope and 48-hour schedule |
| [USP challenge review and AI decisions](docs/07-usp-challenge-and-ai-decisions.md) | Ten challenged features, corrected behavior, acceptance tests and model candidates |
| [Source statement](docs/source/problem-statement.txt) | Unmodified description supplied by the user |

## Vercel frontend

A standalone Next.js frontend is available in [frontend](frontend/README.md).
Set Vercel's Root Directory to `frontend`, select Next.js, and use `npm run build`
with the default output settings. This version is an explicitly labelled browser
demo: synthetic records and uploads persist locally in IndexedDB. No sign-in,
backend services, or environment variables are required. The original Cloudflare
prototype remains separate.

## First implementation milestone

Build one complete flow: an institution submits a synthetic FDR; a scrutiny officer flags or resolves a discrepancy; an explicitly simulated bank adapter returns evidence; a maturity job creates an action; the case timeline shows who did what. Add renewal and release processing next.

Avoid spending the first milestone on a large dashboard with nonfunctional controls. Every displayed count should come from saved records and every state-changing action should create an audit event.

## Evidence and assumptions

The supplied screenshot establishes the statement ID, title, organization, department, category and theme. The supplied text establishes the functional requirements. The user's note about only five remaining statements is context; live availability has not been independently verified.

AICTE's [Approval Process Handbook 2024–2027](https://www.aicte.gov.in/sites/default/files/APH%20Final.pdf), especially clause 6.46, is an initial reference for release processing. It describes supporting documents, bureau clearances and different release outputs for different deposit types. These inform a configurable checklist; applicability, amendments and delegated authority still require confirmation before operational use. Research accessed 28 October 2026.

No bank API access, AICTE system access, official datasets, approval authority, or payment integration has been provided. Prototype institutions and financial instruments must be synthetic. No measured efficiency gains exist yet.
