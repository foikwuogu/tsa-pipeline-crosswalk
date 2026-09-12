# Build spec — Policy-to-Control Crosswalk v1.0: TSA Pipeline SD 2021-02 series

Status: Released v1.0.0 — verified by the author on 2026-09-09. See `docs/VERIFY_CHECKLIST.md`.

```
PROJECT:        Policy-to-Control Crosswalk, v1.0 (TSA Pipeline SD 2021-02 series)
                Archetypes: (1) Open dataset  +  (9) Technical report / white paper

QUESTION:       For each performance-based cybersecurity outcome TSA requires of
                designated critical pipeline/LNG owner-operators under the SD
                Pipeline-2021-02 series, which specific NIST SP 800-82 Rev. 3,
                NIST SP 800-53 Rev. 5, IEC 62443, and CIS Controls v8 safeguards
                would a practitioner implement to satisfy it — and, read the other
                direction, which TSA outcome does each control help satisfy?

SOURCES:
  - TSA SD Pipeline-2021-02C, full text (effective 2022-07-27, superseded).
    https://www.tsa.gov/sites/default/files/tsa_sd_pipeline-2021-02-july-21_2022.pdf
    Retrieved 2026-09-09. Public, unrestricted PDF on tsa.gov.
  - TSA SD Pipeline-2021-02D amendments, via secondary legal analysis (CAP
    30%/yr-100%/3yr testing, removal of alternative-measures safe harbor,
    60-day Critical Cyber System reassessment, >=2 CIRP objectives tested/yr).
    https://www.velaw.com/insights/resilience-reimagined-tsa-amends-critical-pipeline-security-directive/
    Retrieved 2026-09-09.
  - TSA SD Pipeline-2021-02E ratification notice (definitional harmonization
    only; no new substantive outcomes reported).
    https://www.federalregister.gov/documents/2025/01/17/2025-01243/ratification-of-security-directives
    Retrieved 2026-09-09.
  - TSA SD Pipeline-2021-02F, listed as the current version effective
    2025-05-03 on TSA's own index. Full text NOT retrievable during this
    build (tool returned HTTP 403 on tsa.gov's newest PDF uploads three
    times on 2026-09-09; not retried by other means per this project's
    tooling policy). Title/date only confirmed via:
    https://www.tsa.gov/sd-and-ea
    THIS IS A VERIFY POINT — see below and LIMITATIONS.md.
  - TSA Pipeline Security Guidelines, March 2018 (Change 1, April 2021) —
    non-mandatory baseline/enhanced guidance, used as secondary context only.
    https://www.tsa.gov/sites/default/files/pipeline_security_guidelines.pdf
    Retrieved 2026-09-09.
  - NIST SP 800-82 Rev. 3, "Guide to Operational Technology (OT) Security"
    (public domain, US government work). csrc.nist.gov/pubs/sp/800/82/r3/final
  - NIST SP 800-53 Rev. 5, "Security and Privacy Controls for Information
    Systems and Organizations" (public domain, US government work).
  - IEC 62443 series (62443-2-1, 62443-3-3, 62443-4-2) — COPYRIGHTED, sold by
    IEC/ISA. Referenced here at control-ID level only (Foundational
    Requirement and System/Component Requirement numbers, e.g. "SR 1.1"),
    with short generic descriptions drawn from public secondary literature
    (CISA/ISA mapping guidance, OpenSecurityArchitecture). No verbatim
    standard text is reproduced. Per user decision, 2026-09-09.
  - CIS Controls v8 — usage-restricted (CIS's own terms of use: free to use/
    cite with attribution, not for resale, not modified). Referenced here at
    Control/Safeguard number and title level only. Per user decision,
    2026-09-09.

UNIT OF ANALYSIS:  One TSA performance-based outcome (a lettered/numbered
                requirement clause drawn from SD Pipeline-2021-02, Sections
                III.A-III.G) is one row's anchor. Each row also carries the
                reverse index: which TSA outcome(s) a given control maps to.

MEASURES:
  - tsa_outcome_id / text / SD section citation
  - nist_800_82r3_refs   (section-level; OT architecture/control guidance)
  - nist_800_53r5_refs   (control IDs, e.g. SC-7, AC-4, SI-2)
  - iec_62443_refs       (FR/SR IDs, e.g. FR 1 / SR 1.1; control-ID level only)
  - cis_v8_refs          (Control # and Safeguard #, title only)
  - mapping_strength     (Primary | Supporting) — author-adjustable judgment call
  - notes                (implementation caveats, OT-specific exceptions)

OUTPUTS:
  - data/processed/crosswalk.json   (machine-readable, bidirectional index)
  - data/processed/crosswalk.csv    (flat, one row per TSA-outcome x control link)
  - data/processed/qa_report.txt
  - data/processed/stats.json       (counts interpolated into docs/report)
  - report/figures/itot_boundary_architecture.svg (DRAFT until verified)
  - report/TECHNICAL_REPORT.docx    (practitioner-facing white paper)
  - docs/README.md, CODEBOOK.md, LIMITATIONS.md, VERIFY_CHECKLIST.md,
    NEXT_STEPS.md, REVISION_HISTORY.md, CITATION.cff, PUBLISH_GUIDE.md
  - AUTHORS.json, LICENSE-CODE (MIT), LICENSE-DATA (CC-BY-4.0)

VENUES:         GitHub (repository, publish guide only — no tokens provided
                this session) -> Zenodo (DOI, publish guide only) -> a
                stand-alone technical-report submission kit for an
                institutional repository / practitioner venue (per user
                decision). No conference or docket target specified.

VERIFY POINTS (author must personally rule on these before publication):
  1. Confirm SD Pipeline-2021-02F (and any later letter, e.g. 02G) text
     against the live tsa.gov PDF — this build could not fetch it directly.
     Diff any substantive changes against the 02C/D baseline used here.
  2. Every "Primary vs Supporting" mapping strength call is a judgment call,
     not a mechanical derivation — spot-check at least 5 per the QA report.
  3. IEC 62443 and CIS v8 control-ID references were assembled from public
     secondary literature, not the author's own licensed copies of the
     standards — confirm ID accuracy against a licensed copy if available.
  4. NIST SP 800-82r3 / 800-53r5 section and control-ID citations were
     assembled from established public-domain knowledge of these documents
     rather than a fresh line-by-line re-fetch of the full catalogs — spot
     check the QA report's named checks against the source PDFs.

LICENSE:        Code: MIT. Data and documents: CC BY 4.0 (attribution to TSA,
                NIST, and cited secondary sources; IEC 62443 and CIS v8 are
                referenced, not reproduced, so no redistribution license
                issue arises for those two).

ASSUMPTIONS:
  - "TSA Pipeline SD 2021-02 series" = the CIP/CIRP/CAP performance-based
    structure introduced in 02C and refined through 02D/02E/02F, not the
    original prescriptive 2021-02/02B text (which is superseded and is
    covered only in the revision-history appendix).
  - Crosswalk targets the outcome level (Section III.A-G clauses), not every
    sub-bullet, to keep v1.0 tractable; NEXT_STEPS.md scopes a v1.1 that goes
    to sub-bullet granularity.
  - IEC 62443 and CIS mappings are "primary candidate controls," not an
    exhaustive or vendor-audited certification-grade mapping.
```
