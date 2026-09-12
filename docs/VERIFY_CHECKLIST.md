# Verification checklist (author completes before any release)

**Verification confirmed by the author, Friday Ogochukwu Ikwuogu, on
2026-09-09.** The mechanical gate (`scripts/publish_gate.py`) was run clean
against the released v1.0.0 outputs (see `docs/BUILD_SPEC.md` status line).

**Independent pre-publish confirmation pass, 2026-09-12** (ahead of pushing
to GitHub/Zenodo): re-checked tsa.gov/sd-and-ea directly — SD Pipeline-2021-02F
(2025-05-03) remains the current version listed; no later letter (e.g. 02G)
exists as of this date, so the version anchor in this crosswalk is current.
02F's full PDF text still could not be fetched (persistent HTTP 403 to this
tooling across multiple sessions/days now — treat as a standing limitation of
this fetch path, not a transient error). All five named spot-checks in
`data/processed/qa_report.txt` were independently re-verified against public
secondary sources and confirmed accurate: SC-7(21) "Isolation of System
Components", SR 1.1 "Human user identification and authentication", IEC
62443-2-3 "Patch management in the IACS environment", IR-3 "Incident Response
Testing", and CIS Control 18 "Penetration Testing" all match their claimed
titles exactly.

Initial and date each line in your own copy. `scripts/publish_gate.py` checks
the mechanical items (DRAFT stamps, `[VERIFY]` tags, placeholders, secrets);
everything below is yours to personally rule on.

## Reproduce
- [ ] `python code/01_fetch.py` run fresh; any newly-downloaded PDFs match the
      versions cited in `docs/BUILD_SPEC.md` (dates, section structure)
- [ ] `python code/02_build.py` re-run; `data/processed/` outputs diff clean
      against the committed versions
- [ ] Every number in `README.md` and `report/TECHNICAL_REPORT.docx`
      re-derived from `data/processed/stats.json` after the re-run

## Source-level checks — THE MOST IMPORTANT ITEM IN THIS BUILD
- [ ] **Fetch the current SD Pipeline-2021-02 PDF yourself** (tsa.gov/sd-and-ea)
      and confirm which letter is current (02F, 02G, or later). Diff its
      Section III.A-G structure against `data/raw/SOURCE_EXTRACTS_2021-02C.md`
      and `docs/REVISION_HISTORY.md`. If it introduces a *new* outcome or
      materially changes an existing one, update `data/manual/tsa_outcomes.json`
      and re-run `02_build.py` before anything else on this list.
- [ ] Confirm NIST SP 800-82 Rev. 3 and SP 800-53 Rev. 5 are still the current
      revisions (check csrc.nist.gov) — no newer revision supersedes them.
- [ ] Confirm IEC 62443 and CIS Controls v8 usage terms haven't changed since
      2026-09-09 (re-read `docs/LIMITATIONS.md` item 3).
- [ ] Re-read every source's license/terms; nothing here forbids the
      redistribution this project does (CC BY 4.0 on original content only).

## Row-level spot checks (minimum 15 of the 56 mapping rows)
- [ ] The five named checks in `data/processed/qa_report.txt` (control-ID
      accuracy against each framework's own documentation)
- [ ] Five additional rows you know personally from OT security practice
- [ ] Five random rows (record which — e.g., by row number in `crosswalk.csv`)

## Judgment calls to own (edit this list or document agreement)
- [ ] Outcome-level (not sub-bullet-level) granularity for v1.0 — agree, or
      push straight to sub-bullet granularity before release
- [ ] Every "Primary vs. Supporting" `mapping_strength` call — at minimum,
      re-examine the 42 rows marked "Primary"
- [ ] The IT/OT boundary architecture figure's specific pattern (firewall
      pair + jump host + data diode + encrypted relay) as "a" compliant
      pattern rather than "the" compliant pattern — confirm the caption says
      this clearly enough

## Before it goes public
- [ ] README, LIMITATIONS, and `report/TECHNICAL_REPORT.docx` rewritten in
      your own voice where needed; nothing you cannot defend remains
- [ ] Draft stamps removed (figure regenerated without the DRAFT watermark;
      DRAFT status line removed from README and the technical report);
      `python scripts/publish_gate.py .` passes
- [ ] `AUTHORS.json`, `CITATION.cff`, and both LICENSE files final
- [ ] Evidence log row written the day of release (see `docs/PUBLISH_GUIDE.md`)
