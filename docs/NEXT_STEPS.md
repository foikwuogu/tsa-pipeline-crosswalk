# Next steps (what v1.1+ adds)

v1.0 is a first, tractable release — outcome-level crosswalk (7 outcomes),
control-ID-level IEC 62443/CIS references, one illustrative architecture
figure, and a practitioner technical report. It is understood as a first
step, not a finished compliance program. Candidates for the next version:

1. **Confirm and incorporate the current SD Pipeline-2021-02F/G text**
   directly (see `docs/LIMITATIONS.md` item 1 and `VERIFY_CHECKLIST.md`).
2. **Sub-bullet granularity.** Expand each of the 7 outcomes to its
   individual lettered/numbered sub-clauses (e.g., III.C.1 through III.C.5
   separately) for a more audit-ready crosswalk.
3. **Add the SD Pipeline-2021-01 series** (the original "Enhancing Pipeline
   Cybersecurity" directive covering coordinator designation and incident
   reporting) as its own crosswalk, since it is procedurally distinct from
   the 02-series CIP/CIRP/CAP outcomes.
4. **Audit & validation criteria deliverable.** The project description's
   second deliverable — standardized metrics/evaluation artifacts for
   bi-annual architectural reviews, penetration testing, and continuous
   monitoring verification (tied to TSA-G/CAP) — is scoped but not yet built
   out beyond the crosswalk rows; a dedicated audit-criteria document is a
   natural v1.1 companion piece.
5. **Additional architecture patterns.** The v1.0 figure shows one
   firewall+jump-host+diode pattern; add zero-trust-conduit and cloud-hosted
   historian variants.
6. **Machine-validated IEC/CIS references**, if the author obtains licensed
   copies of the full standards, to move mapping-strength judgment calls
   from "assembled from secondary literature" to "verified against the
   primary standard text" (still without redistributing that text).
7. **A short data-descriptor or technical-report submission** to a
   fee-free venue, once v1.0 is verified and released (see
   `docs/PUBLISH_GUIDE.md`).
