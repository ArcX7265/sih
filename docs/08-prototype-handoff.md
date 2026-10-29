# NidhiSetu prototype handoff

Implemented 29 October 2026 (India time). Source: `../prototype/`. Walkthrough: `../prototype/DEMO.md`.

Published successfully: https://nidhisetu-sih-demo.ochreowl22.chatgpt.site (owner-private).

## Verified

- 15 domain tests pass, covering scope, immutable revisions, instrument identity changes, stale/delayed evidence, release prerequisites and reminder deduplication.
- TypeScript check passes after final frontend type fixes.
- Production build passes.
- Local API smoke test passes: authentication, institution scope, wrong-role rejection, cross-origin rejection, revision conflicts, private document authorization, reminder deduplication, creation, receipt requirement, upload/download and saved verification.
- Browser checks: sign-in, dashboard, persona switching, synthetic submission, authority release approval and separate officer completion.

The hosted workspace starts with seven synthetic records; the local test workspace additionally contains explicitly named smoke/browser test records. Local tests do not modify the hosted database.

## Boundaries

Bank responses, institutional personas and release completion are simulations. No money moves. Sample release checks do not certify regulatory eligibility. The review summary is deterministic, with no OCR or LLM integrated. Maturity jobs run manually against 28 October 2026; notification delivery is not connected. Audit history is application-enforced rather than cryptographically immutable. No production institutional identity provider, bank API or AICTE integration is configured.

The private hosted URL requires owner access and is not yet a public judge-accessible link. Sharing policy must be changed deliberately before using it as an externally accessible submission link.

Screenshot: `../prototype/outputs/dashboard.jpg`.
