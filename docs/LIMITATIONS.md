# Limitations

Numbered, specific, written before any manuscript discussion section so the
discussion cannot outrun what is actually true of this build.

1. **Current SD text not directly verified.** SD Pipeline-2021-02F (effective
   2025-05-03) is the version TSA's own index (tsa.gov/sd-and-ea) currently
   lists as in force, and a later letter (02G or beyond) may exist by the time
   anyone reads this. This build's automated fetch tooling received HTTP 403 /
   tunnel-forbidden responses on every attempt to retrieve 02E, 02F, and 02G's
   PDF text directly (both via an AI web-fetch tool and via a plain HTTP
   download script, `code/01_fetch.py`, run from this build's own network).
   The crosswalk is therefore anchored on the full text of **02C** (fully
   retrieved) and the documented amendments introduced by **02D** (via
   secondary legal-industry analysis) and **02E** (via the Transportation
   Security Oversight Board's ratification notice, which states 02E's changes
   were "new and modified definitions clarifying certain terms and
   harmonizing terminology" — i.e., not new substantive outcomes). **This is
   the single most important item on `VERIFY_CHECKLIST.md`**: before citing
   this crosswalk, fetch the current SD Pipeline-2021-02 PDF yourself (a
   normal browser download typically succeeds where this build's tooling did
   not) and diff it against `data/raw/SOURCE_EXTRACTS_2021-02C.md` plus the
   02D/02E amendment notes in `docs/REVISION_HISTORY.md`.

2. **Outcome-level, not sub-bullet-level, granularity.** The crosswalk maps at
   the level of SD Section III.A-G (7 outcomes), not every lettered/numbered
   sub-bullet within them (e.g., III.C.1 through III.C.5 are all folded into
   `TSA-C`). This keeps v1.0 tractable and defensible; `docs/NEXT_STEPS.md`
   scopes a v1.1 that goes to sub-bullet granularity.

3. **IEC 62443 and CIS Controls v8 are referenced, not reproduced.** Both are
   copyrighted standards. Every `IEC_62443-*` and `CIS_v8` row in the
   crosswalk cites a control/requirement ID and a short generic paraphrase of
   its scope, assembled from public secondary literature (CISA/ISA mapping
   guidance, vendor and standards-body summaries), not from the authors'
   personal licensed copies of the full standards. If you hold licensed
   copies, cross-check the paraphrases against them before treating this as
   authoritative; do not redistribute the standards' own text under this
   project's CC BY 4.0 license, since that license covers only this project's
   original content.

4. **NIST citations were not re-derived from a fresh line-by-line fetch of the
   full 800-82r3/800-53r5 catalogs during this build.** Both are large,
   well-established public-domain documents; control IDs and section
   references here were assembled from established public documentation of
   these catalogs. Spot-check the five named checks in
   `data/processed/qa_report.txt` against the actual NIST PDFs
   (csrc.nist.gov) before publication.

5. **"Primary" vs. "Supporting" mapping strength is an expert judgment call,
   not a mechanical derivation.** Two qualified reviewers could reasonably
   disagree on a handful of these. The QA report's spot-check list and the
   verification checklist ask the author to personally rule on at least five.

6. **This is a compliance-mapping reference, not a certification.** Meeting
   every control referenced here for a given TSA outcome is not, by itself, a
   guarantee of TSA approval of an operator's Cybersecurity Implementation
   Plan; TSA's own review of a specific operator's submission is the
   authoritative determination.

7. **The IT/OT boundary architecture figure is illustrative, not an as-built
   diagram of any real operator's network.** It shows one common, defensible
   pattern (firewall pair, jump host, one-way diode, encrypted relay) that
   satisfies the TSA-B outcome at the "Primary" controls cited — it is not
   the only compliant architecture, and a specific operator's actual topology
   should be reviewed on its own merits.

8. **No cost, timeline, or vendor-product guidance is offered.** This project
   deliberately stays vendor-neutral and does not recommend or evaluate any
   specific commercial product.
