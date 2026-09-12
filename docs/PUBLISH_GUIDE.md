# Publish guide — Policy-to-Control Crosswalk v1.0

No GitHub or Zenodo token was provided during this build (your choice — see
`docs/BUILD_SPEC.md`), so this guide covers your part directly. Nothing here
was pushed anywhere; the repository lives locally until you do this.

**Do not start this until `docs/VERIFY_CHECKLIST.md` is fully checked off.**
The technical report and crosswalk.json still carry DRAFT markers on purpose —
`scripts/publish_gate.py` will refuse to call this clear to publish until you
remove them, which only happens after you've actually verified the content.

## 0. Before anything else

```
python code/02_build.py --final     # (add a --final flag to 02_build.py yourself,
                                     #  or manually delete "-DRAFT" from the
                                     #  crosswalk.json _comment and qa_report.txt title)
node code/05_build_report.js --final   # regenerates the report without the DRAFT
                                        # banner and without the watermark on Figure 1
                                        # (also re-export report/figures/*.svg without
                                        #  the DRAFT <text> element, then re-render the PNG)
python scripts/publish_gate.py .    # should report "gate: clear" once the above
                                     # is done and every [VERIFY]/placeholder is
                                     # resolved. Note: the gate also flags its own
                                     # docstring in scripts/publish_gate.py — that's
                                     # a known false-positive from scanning itself;
                                     # run with --allow-draft-in scripts to ignore it.
```

## 1. GitHub

1. Create the repository at github.com/new. Suggested name: `tsa-pipeline-crosswalk`.
   Leave it empty — this project already has a README.
2. From this project's folder:
   ```
   git init -b main
   git add -A
   git commit -m "v0.1.0: Policy-to-Control Crosswalk, TSA SD Pipeline-2021-02 series"
   git remote add origin https://github.com/foikwuogu/tsa-pipeline-crosswalk.git
   git push -u origin main
   ```
3. Releases tab → "Draft a new release" → tag `v0.1.0` → title "v0.1.0" → paste
   release notes (suggested text below) → Publish.
4. Update `CITATION.cff`'s `repository-code` field with the real URL, commit
   again.

**Suggested release notes:**
> First public release of the Policy-to-Control Crosswalk mapping TSA Security
> Directive Pipeline-2021-02 series performance-based outcomes to NIST SP
> 800-82 Rev. 3, NIST SP 800-53 Rev. 5, IEC 62443, and CIS Controls v8. See
> README.md for scope and docs/LIMITATIONS.md for what this release does and
> does not cover.

## 2. Zenodo (DOI)

Simplest path: log in at zenodo.org with ORCID, go to Account → GitHub, flip
the switch for `tsa-pipeline-crosswalk`, then create the GitHub release above
— Zenodo archives it and mints a DOI automatically within minutes.

Manual path if you prefer: New Upload at zenodo.org, upload a zip of the
repository, and set:
- **Upload type:** Dataset
- **Title:** Policy-to-Control Crosswalk, v1.0: TSA Pipeline SD 2021-02 Series
  to NIST SP 800-82r3, NIST SP 800-53r5, IEC 62443, and CIS Controls v8
- **Creators:** copy names, affiliations, and ORCIDs directly from `AUTHORS.json`
- **License:** CC BY 4.0 (data/docs) — note in the description that code is MIT
- **Keywords:** TSA Security Directive; pipeline cybersecurity; OT security;
  NIST SP 800-82; NIST SP 800-53; IEC 62443; CIS Controls; critical infrastructure
- **Related identifiers:** the GitHub repository URL

Copy the minted DOI into `CITATION.cff`, the README status line, and the
evidence log **the same day**.

## 3. Technical-report kit (per your request, in addition to GitHub + Zenodo)

`report/TECHNICAL_REPORT.docx` (once rebuilt with `--final`) is ready to submit
as-is to:
- **An institutional or Zenodo-hosted technical report series** — same Zenodo
  steps as above, with `Upload type: Publication → Technical report`, and
  `related_identifiers` pointing at the dataset DOI (and vice versa, once both
  exist — use Zenodo's "Cites"/"Is supplement to" relation).
- **A practitioner venue** (e.g., an ICS/OT security conference's
  practitioner track, or a trade publication that accepts technical
  contributions) — check that venue's specific formatting requirements before
  submitting; this document is US Letter, has a title page, abstract, and
  numbered sections, which fits most such venues without reformatting.

No specific venue or docket was named for this v1.0 (your choice — see
`docs/BUILD_SPEC.md`), so there is no submission deadline to track here.
`docs/NEXT_STEPS.md` suggests revisiting a public-comment venue if TSA opens
a real rulemaking comment period on this program.

## After every publication step

Log it the same day: date, artifact, venue, URL/DOI, status, files saved.
Then update this project's README status line and `CITATION.cff` with the
real DOI and repository URL.
