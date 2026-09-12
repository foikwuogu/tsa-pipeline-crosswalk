# Policy-to-Control Crosswalk, v1.0 — TSA Pipeline SD 2021-02 series

**Status:** Released v1.0.0, verified by the author on 2026-09-09 | **Maintainer:** Friday Ogochukwu Ikwuogu, [ORCID 0009-0009-2222-1318](https://orcid.org/0009-0009-2222-1318) | **License:** code [MIT](LICENSE-CODE), data/docs [CC BY 4.0](LICENSE-DATA)

An open, bidirectional crosswalk that translates the performance-based cybersecurity
outcomes TSA requires of designated critical pipeline and LNG owner/operators under
the **Security Directive Pipeline-2021-02 series** (Cybersecurity Implementation Plan,
Cybersecurity Incident Response Plan, Cybersecurity Assessment Program) into specific,
verifiable safeguards in **NIST SP 800-82 Rev. 3**, **NIST SP 800-53 Rev. 5**,
**IEC 62443**, and **CIS Controls v8** — and back again, so a control can be traced to
every TSA outcome it helps satisfy. Built for pipeline OT security practitioners,
compliance teams, and auditors who need a working map between "what TSA requires" and
"what to actually implement," without relying on proprietary vendor tooling.

## What is here

```
docs/BUILD_SPEC.md        the one-page spec this build followed
data/manual/              curated source inputs (TSA outcomes, control mappings)
data/raw/                 fetched source material + PROVENANCE.txt
data/processed/           crosswalk.json, crosswalk.csv, qa_report.txt, stats.json
code/                     01_fetch.py, 02_build.py (build + QA + stats)
report/figures/           IT/OT boundary architecture reference diagram
report/                   TECHNICAL_REPORT.docx — practitioner-facing white paper
docs/                     CODEBOOK, LIMITATIONS, VERIFY_CHECKLIST, NEXT_STEPS,
                           REVISION_HISTORY, PUBLISH_GUIDE
AUTHORS.json              single source of truth for author/co-author identity
```

## Run it

```
python code/01_fetch.py    # best-effort re-download of primary sources + provenance log
python code/02_build.py    # (re)builds crosswalk.json / crosswalk.csv / qa_report.txt / stats.json
```

A stranger should be able to run these two scripts from this README alone and
reproduce everything in `data/processed/` exactly, since `data/manual/*.json`
(the curated outcome list and control mappings) is committed and versioned —
`02_build.py` is a deterministic aggregation/validation step over that curated
input, not a scrape.

## Sources

| Source | Vintage | License | Accessed |
|---|---|---|---|
| [TSA SD Pipeline-2021-02C](https://www.tsa.gov/sites/default/files/tsa_sd_pipeline-2021-02-july-21_2022.pdf) | eff. 2022-07-27 | US Gov work, public | 2026-09-09 |
| [TSA SD Pipeline-2021-02D amendments (secondary analysis)](https://www.velaw.com/insights/resilience-reimagined-tsa-amends-critical-pipeline-security-directive/) | eff. 2023-07-27 | — | 2026-09-09 |
| [TSA SD Pipeline-2021-02E ratification notice](https://www.federalregister.gov/documents/2025/01/17/2025-01243/ratification-of-security-directives) | ratified 2024-08-23 | US Gov work, public | 2026-09-09 |
| [TSA SD Pipeline-2021-02F (current, text not directly verified — see Limitations)](https://www.tsa.gov/sd-and-ea) | eff. 2025-05-03 | US Gov work, public | 2026-09-09 |
| [TSA Pipeline Security Guidelines](https://www.tsa.gov/sites/default/files/pipeline_security_guidelines.pdf) | Mar 2018, Ch.1 Apr 2021 | US Gov work, public | 2026-09-09 |
| NIST SP 800-82 Rev. 3 | 2023 | Public domain (US Gov work) | referenced by section |
| NIST SP 800-53 Rev. 5 | 2020, updates through 2025 | Public domain (US Gov work) | referenced by control ID |
| IEC 62443 series (-2-1, -2-3, -3-3) | various | Copyrighted (IEC/ISA) — **referenced at control-ID level only, no verbatim text reproduced** | referenced by FR/SR ID |
| CIS Controls v8 | 2021 | CIS terms of use — **referenced at control/safeguard number + title only** | referenced by control # |

## Headline numbers (from `data/processed/qa_report.txt` and `stats.json`)

7 TSA performance-based outcomes (SD Pipeline-2021-02 Sections III.A–III.G) are
crosswalked to 54 unique controls across 6 frameworks, via 56 mapping rows
(42 Primary, 14 Supporting). Zero outcomes have a coverage gap in any core
framework. See `data/processed/qa_report.txt` for the full breakdown.

## Limitations

See `docs/LIMITATIONS.md` before relying on anything here — in particular,
the SD Pipeline-2021-02F/G full text could not be fetched directly during
this build (repeated HTTP 403s) and this crosswalk is anchored on the 02C/D
structure with 02E's confirmed-unchanged scope. The author has reviewed and
confirmed this crosswalk per `docs/VERIFY_CHECKLIST.md` as of 2026-09-09.

## Citation

See `CITATION.cff`. DOI: 10.5281/zenodo.22730446.

## AI Assistance Statement

Manual data collection, online research, and Generative AI tools were
utilized to assist with source retrieval, control-ID mapping drafts, data
pipeline execution, reference figure generation, and report drafting. All
named authors maintain full responsibility for the content and have
independently verified every mapping, citation, and technical claim
(pursuant to `docs/VERIFY_CHECKLIST.md`) prior to this public release.
