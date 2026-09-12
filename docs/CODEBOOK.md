# Codebook — `data/processed/crosswalk.csv` and `crosswalk.json`

One row of the CSV = one link between a TSA outcome and one control in one
framework. `crosswalk.json` carries the same information organized two ways:
forward (`outcomes[].mapped_controls`) and reverse (`controls_index`, control →
every TSA outcome it helps satisfy).

| Column | Definition | Source / transformation |
|---|---|---|
| `tsa_outcome_id` | Short ID for the TSA outcome (`TSA-A` … `TSA-G`) | Assigned by the research team, one per SD Section III.A-G clause; see `data/manual/tsa_outcomes.json` |
| `sd_section` | The SD Pipeline-2021-02 section number the outcome is drawn from | Read directly from the directive text (`data/raw/SOURCE_EXTRACTS_2021-02C.md`) |
| `outcome_title` | Short human-readable name for the outcome | Authored by the research team |
| `sd_citation` | Full citation incl. which SD version/amendment introduced the clause | Authored by the research team, cross-referencing 02C/02D/02E |
| `framework` | Which control framework this row's control comes from: `NIST_SP_800-82r3`, `NIST_SP_800-53r5`, `IEC_62443-2-1`, `IEC_62443-2-3`, `IEC_62443-3-3`, or `CIS_v8` | Fixed vocabulary, `data/manual/control_mappings.json` |
| `control_id` | The control's identifier within its framework (section number, control ID, or SR/FR number) | Curated by the research team from public documentation of each framework |
| `control_title` | Short generic title/description of the control | For NIST: as published (public domain). For IEC 62443 and CIS v8: a short paraphrase, not verbatim standard text, since both are copyrighted — see `docs/LIMITATIONS.md` |
| `mapping_strength` | `Primary` (the control is a direct, load-bearing way to satisfy the outcome) or `Supporting` (it contributes but isn't sufficient alone) | Judgment call by the research team — **a VERIFY POINT**, spot-check before citing |
| `notes` | Implementation caveats, OT-specific exceptions, or rationale for the mapping | Authored by the research team |

## `controls_index` (reverse direction, in `crosswalk.json` only)

| Field | Definition |
|---|---|
| `framework` / `control_id` | Same vocabulary as above |
| `satisfies_tsa_outcomes` | Sorted list of every `tsa_outcome_id` this control was mapped to |

## `data/manual/tsa_outcomes.json` (the outcome catalog `crosswalk.csv` is built from)

| Field | Definition |
|---|---|
| `id` | `tsa_outcome_id` used throughout |
| `sd_section` | SD section number |
| `title` | Outcome name |
| `outcome_text` | Paraphrased summary of the requirement (quotes preserved where load-bearing) |
| `sd_citation` | Version(s)/section(s) this text is drawn from |
| `notes` | Cross-references to other outcomes, OT-specific carve-outs, ambiguities |

## `data/processed/stats.json`

Every number quoted in `README.md` or `report/TECHNICAL_REPORT.docx` is
interpolated from this file, never typed by hand — see `docs/BUILD_SPEC.md`
"the stats-file rule." Fields: `n_outcomes`, `n_mapping_rows`,
`n_unique_controls`, `n_frameworks`, `frameworks`, `mapping_strength_counts`,
`outcomes_with_coverage_gap`, `sd_version_used`, `n_controls_per_outcome`.
