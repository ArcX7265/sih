# Consensus and source log

Research performed 28 October 2026. This is an evidence trail for the report, not a systematic literature review. Publication dates below are stated where verified; undated product pages were accessed on the research date.

## Consensus usage

- Requested connector/app: Consensus. No callable Consensus tools were exposed in this session; plugin discovery returned an empty match list.
- Fallback: visited Consensus's public web interface in the in-app browser and successfully ran the literature query below.
- Query: “What evidence supports human-in-the-loop document information extraction and provenance tracking for reliable financial document verification? Compare rule-based OCR with layout-aware transformers, and distinguish field extraction from authenticity verification.”
- [Resulting research thread](https://consensus.app/search/new-thread/6aF177SMSTGxjxREgihxsw/). It was generated without account creation; durable public access is not guaranteed.
- Useful discovered leads: Beyond Logprobs, LAVA, and Financial Document Authentication and Verification Using Hierarchical Tokenization on Permissioned Blockchains.
- Follow-up verification: original arXiv record, ACL proceedings/PDF, and publisher article, respectively.
- Correction: Consensus displayed LAVA as 2026; original ACL proceedings identify November 2025. The report uses the proceedings date.
- Excluded from report claims: synthesis-wide performance percentages, assertions that every compliance deployment needs human review, and unverified benchmark comparisons across unrelated tasks. Such statements were not necessary to choose the architecture and cannot be transferred to AICTE FDRs.
- No Consensus score or published benchmark has been represented as our prototype's measured performance.

## Source register

| ID | Primary source / author or organization | Date / status | Used for |
| --- | --- | --- | --- |
| S01 | [Supplied problem description](source/problem-statement.txt), AICTE statement supplied by user | Screenshot labeled SIH 2026; independently authenticated listing not obtained | Requirements and metadata baseline |
| S02 | [Approval Process Handbook](https://www.aicte.gov.in/sites/default/files/APH%20Final.pdf), AICTE | 2024–2027 edition; academic years 2024–25 to 2026–27 | Existing process and initial release-policy reference; not consolidated amendments |
| S03 | [FAQs](https://www.nesl.co.in/faqs/), NeSL | Live undated documentation | Adjacent e-BG evidence/lifecycle pattern |
| S04 | [e-BG resources](https://www.nesl.co.in/e-bg-resources/), NeSL | Live resource index | Service documentation availability |
| S05 | [eOffice](https://www.nic.gov.in/project/eoffice/), NIC | Live undated project description | Existing government workflow/document product |
| S06 | [PFMS](https://training.pfms.gov.in/Home.aspx), Government PFMS | Training-domain product description; main homepage fetch timed out | Financial-management context |
| S07 | [Payment/beneficiary tracking guide](https://dbtdge.ncs.gov.in/uploads/download_pdf/Know_payment_status_DBTMIS.pdf), government DBT-MIS guide | Publication date not verified | Separate account-validation/payment tracking concepts |
| S08 | [Camunda licensing](https://docs.camunda.io/docs/reference/licenses/), Camunda | Applies to 8.6+ per page | Production licensing constraint |
| S09 | [Camunda plans](https://camunda.com/pricing/), Camunda | Live undated | General human-task/process-orchestration product scope; no price quoted |
| S10 | [Tesseract repository](https://github.com/tesseract-ocr/tesseract), maintainers | Live repository | Local OCR baseline and Apache-2.0 code |
| S11 | [LayoutLMv3](https://arxiv.org/abs/2204.08387), Yupan Huang, Tengchao Lv, Lei Cui, Yutong Lu, Furu Wei | First submitted 18 April 2022; ACM Multimedia 2022 | Multimodal extraction candidate |
| S12 | [LayoutLMv3 upstream README](https://github.com/microsoft/unilm/blob/master/layoutlmv3/README.md), Microsoft | Live repository | CC BY-NC-SA project-content restriction |
| S13 | [LAVA proceedings](https://aclanthology.org/2025.finnlp-2.7/), Ruoqi Shu, Xuhui Wang, Isaac Wang, Yanming Mai, Bo Wan | November 2025, FinNLP, ACL | Authoritative publication metadata |
| S14 | [LAVA paper](https://aclanthology.org/2025.finnlp-2.7.pdf), same authors | 2025 proceedings | Extraction/validation separation and pipeline design |
| S15 | [Beyond Logprobs](https://arxiv.org/abs/2606.24420), Nitesh Kumar | 23 June 2026 arXiv record; comments report workshop acceptance | Confidence/abstention research lead; no local reproduction |
| S16 | [Financial Document Authentication and Verification…](https://www.mdpi.com/1911-8074/19/4/239), Chialuka Ilechukwu, Sung-Chul Hong, Barin Nag | JRFM 19(4), 2026 | Issuer-linked permissioned-chain PoC and its limits |
| S17 | [VC Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/), W3C | Recommendation, 15 May 2025 | Issuer/holder/verifier model, future signed-attestation option |
| S18 | [FUNSD](https://guillaumejaume.github.io/FUNSD/), Guillaume Jaume, Hazim Kemal Ekenel, Jean-Philippe Thiran | 2019 | Form dataset contents and size |
| S19 | [FUNSD terms](https://guillaumejaume.github.io/FUNSD/work/), EPFL/LTS5 | Live terms; publication date not verified | Dataset-use restrictions |
| S20 | [CORD](https://github.com/clovaai/cord), Seunghyun Park and collaborators / Clova AI | 2019 work, v2 release listed 20 July 2022 | Receipt dataset and splits |
| S21 | [CORD data license](https://github.com/clovaai/cord/blob/master/LICENSE-CC-BY), dataset publishers | Live license file | CC BY 4.0 data terms |
| S22 | [DocILE](https://docile.rossum.ai/), Štěpán Šimsa and collaborators | ICDAR/CLEF 2023 | Business-document benchmark and research access |
| S23 | [DocILE repository](https://github.com/rossumai/docile), Rossum AI | Live repository | MIT code distinguished from dataset permission |
| S24 | [File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html), OWASP | Live guidance | Upload controls |
| S25 | [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), OWASP | Live guidance | Scope/action enforcement |
| S26 | [DPDP Rules Gazette](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf), MeitY | Notification dated 13 November 2025 | Staggered commencement; not a full legal applicability assessment |
| S27 | [Cybersecurity directions](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf), CERT-In | 28 April 2022 | Incident/logging deployment considerations |
| S28 | [GIGW scope/objective](https://guidelines.india.gov.in/scope-and-objective/), NIC/government guidelines | GIGW 3.0, live page | Accessibility and government-web planning reference |

## Search coverage and unresolved evidence

Searched official AICTE/SIH material, NeSL service documentation, government financial/workflow systems, original document-AI publications, dataset publishers, licenses, security guidance and current privacy-rule notification. Search results can be incomplete; lack of an exact result is not proof of nonexistence.

Not established: live availability of PS 26265, current AICTE authenticated portal feature set, consolidated applicable handbook amendments, real FDR volumes, bureau handling-time baseline, universal bank verification API, public representative FDR dataset, current commercial bank-integration pricing, patent novelty, or production certification.

External search surfaced possible handbook addenda on secondary hosts. These were not used to set policy rules because a consolidated authoritative version was not authenticated. A prototype must use explicitly labeled demonstration policy until the competent stakeholder validates the applicable set.

All cost envelopes and implementation effort are planning assumptions, not market quotations. All proposed targets are future acceptance criteria, not experimental results.
