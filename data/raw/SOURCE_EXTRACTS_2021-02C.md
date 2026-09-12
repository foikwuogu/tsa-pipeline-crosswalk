# Extracted text used to build data/manual/tsa_outcomes.json

**How this file was produced:** the underlying PDF could not be downloaded to
this repository's `data/raw/pdf/` (see `PROVENANCE.txt` and `LIMITATIONS.md`
-- the build environment's network egress returned HTTP 403/tunnel-forbidden
on tsa.gov PDF paths). The structured extract below was produced by an AI
web-fetch/summarization tool reading the live page at the URL cited, on the
date shown, and is a **paraphrase with quoted fragments**, not a byte-for-byte
copy. Treat it as a working note, not a citable primary source -- cite the
PDF itself (URL below) and verify the quoted fragments against it.

- **Source URL:** https://www.tsa.gov/sites/default/files/tsa_sd_pipeline-2021-02-july-21_2022.pdf
- **Document:** SD Pipeline-2021-02C
- **Retrieved:** 2026-09-09, via AI web-fetch tool (see PROVENANCE.txt)
- **Effective:** 2022-07-27; **Expired:** 2023-07-27 (superseded by 02D)

## Structure found (Sections III.A-G, IV, V, VI, VII)

- III.A Critical Cyber Systems identification
- III.B Network segmentation (IT/OT), incl. inventory (III.B.1) and zone
  security controls (III.B.2)
- III.C Access control: password reset schedule (III.C.1), MFA/compensating
  controls (III.C.2), least privilege/separation of duties (III.C.3), shared
  accounts (III.C.4), domain trust review (III.C.5)
- III.D Continuous monitoring & threat detection: preventive capabilities
  (III.D.1), audit procedures (III.D.2), logging policies (III.D.3),
  isolation controls (III.D.4)
- III.E Patch & vulnerability management: patch strategy (III.E.1-2), OT
  exceptions (III.E.3)
- III.F Cybersecurity Incident Response Plan requirements (III.F.1.a-e)
- III.G Cybersecurity Assessment Program: CIP effectiveness assessment,
  architectural design review (>=1/2yr), penetration testing, annual CAP
  report (III.G.2-3)
- IV Documentation & records (compliance records TSA may request)
- V Compliance procedures (confirmation of receipt, dissemination)
- VI Amendment procedures
- VII Definitions (Critical Cyber System, Operational Disruption, Necessary
  Capacity, DMZ, etc.)

See `docs/BUILD_SPEC.md` SOURCES for the SD-02D, 02E, and 02F citations used
to identify amendments layered onto this 02C structure.
