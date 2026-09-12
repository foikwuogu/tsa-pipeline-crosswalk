#!/usr/bin/env python3
"""Build the bidirectional crosswalk from the curated manual inputs, run QA,
and write the stats file every downstream document reads from.

Inputs (curated by the research team -- this is expert judgment, not a
mechanical scrape; see docs/BUILD_SPEC.md VERIFY POINTS):
    data/manual/tsa_outcomes.json
    data/manual/control_mappings.json

Outputs:
    data/processed/crosswalk.json   (bidirectional: outcomes[] and controls_index{})
    data/processed/crosswalk.csv    (flat, one row per outcome x control link)
    data/processed/qa_report.txt
    data/processed/stats.json

Usage:
    python code/02_build.py [--final]

Without --final, outputs are labeled v1.0-DRAFT (pre-verification). Pass
--final once the author has completed docs/VERIFY_CHECKLIST.md to label
outputs as the released v1.0.
"""
import csv
import json
import os
import sys
from collections import defaultdict

FINAL = "--final" in sys.argv
VERSION_LABEL = "v1.0" if FINAL else "v1.0-DRAFT"

MANUAL_OUTCOMES = "data/manual/tsa_outcomes.json"
MANUAL_MAPPINGS = "data/manual/control_mappings.json"
OUT_DIR = "data/processed"

EXPECTED_FRAMEWORKS = {
    "NIST_SP_800-82r3",
    "NIST_SP_800-53r5",
    "IEC_62443-2-1",
    "IEC_62443-2-3",
    "IEC_62443-3-3",
    "CIS_v8",
}


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    outcomes = load(MANUAL_OUTCOMES)["outcomes"]
    mappings = load(MANUAL_MAPPINGS)["mappings"]

    outcome_ids = {o["id"] for o in outcomes}
    by_outcome = defaultdict(list)
    by_control = defaultdict(list)  # (framework, control_id) -> [outcome_id, ...]
    unknown_framework = []
    orphan_outcome_refs = []

    for m in mappings:
        oid = m["tsa_outcome_id"]
        if oid not in outcome_ids:
            orphan_outcome_refs.append(m)
            continue
        if m["framework"] not in EXPECTED_FRAMEWORKS:
            unknown_framework.append(m)
        by_outcome[oid].append(m)
        by_control[(m["framework"], m["control_id"])].append(oid)

    # ---- assemble bidirectional crosswalk.json ----
    crosswalk = {
        "_comment": (
            "Bidirectional Policy-to-Control Crosswalk, " + VERSION_LABEL + ". "
            "Forward: outcomes[].mapped_controls. Reverse: controls_index."
        ),
        "outcomes": [],
        "controls_index": [],
    }
    for o in outcomes:
        entry = dict(o)
        entry["mapped_controls"] = [
            {k: v for k, v in m.items() if k != "tsa_outcome_id"}
            for m in by_outcome[o["id"]]
        ]
        entry["control_count"] = len(entry["mapped_controls"])
        crosswalk["outcomes"].append(entry)

    for (framework, control_id), oids in sorted(by_control.items()):
        crosswalk["controls_index"].append({
            "framework": framework,
            "control_id": control_id,
            "satisfies_tsa_outcomes": sorted(set(oids)),
        })

    with open(f"{OUT_DIR}/crosswalk.json", "w", encoding="utf-8") as f:
        json.dump(crosswalk, f, indent=2)

    # ---- flat CSV ----
    csv_path = f"{OUT_DIR}/crosswalk.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "tsa_outcome_id", "sd_section", "outcome_title", "sd_citation",
            "framework", "control_id", "control_title", "mapping_strength", "notes",
        ])
        for o in outcomes:
            for m in by_outcome[o["id"]]:
                w.writerow([
                    o["id"], o["sd_section"], o["title"], o["sd_citation"],
                    m["framework"], m["control_id"], m["control_title"],
                    m["mapping_strength"], m.get("notes") or "",
                ])

    # ---- QA ----
    qa_lines = []
    qa_lines.append("QA REPORT -- Policy-to-Control Crosswalk " + VERSION_LABEL)
    qa_lines.append(f"outcomes: {len(outcomes)}")
    qa_lines.append(f"mapping rows: {len(mappings)}")
    qa_lines.append(f"unique controls referenced: {len(by_control)}")
    qa_lines.append("")

    qa_lines.append("-- coverage per outcome (flag any outcome missing a framework) --")
    frameworks_seen = sorted({m["framework"] for m in mappings})
    coverage_gaps = 0
    for o in outcomes:
        fw_here = sorted({m["framework"] for m in by_outcome[o["id"]]})
        missing_core = [fw for fw in ("NIST_SP_800-82r3", "NIST_SP_800-53r5", "CIS_v8") if fw not in fw_here]
        # IEC family: any of the three parts counts as covered
        iec_present = any(fw.startswith("IEC_62443") for fw in fw_here)
        if not iec_present:
            missing_core.append("IEC_62443-*")
        flag = f"  MISSING: {missing_core}" if missing_core else ""
        if missing_core:
            coverage_gaps += 1
        qa_lines.append(f"  {o['id']} ({o['title']}): {len(by_outcome[o['id']])} controls across {fw_here}{flag}")
    qa_lines.append(f"outcomes with a coverage gap in at least one core framework: {coverage_gaps}")
    qa_lines.append("")

    qa_lines.append("-- mapping_strength distribution --")
    strength_counts = defaultdict(int)
    for m in mappings:
        strength_counts[m["mapping_strength"]] += 1
    for k, v in sorted(strength_counts.items()):
        qa_lines.append(f"  {k}: {v}")
    qa_lines.append("")

    qa_lines.append("-- integrity checks --")
    qa_lines.append(f"  mapping rows referencing an unknown tsa_outcome_id: {len(orphan_outcome_refs)}")
    qa_lines.append(f"  mapping rows with an unrecognized framework label: {len(unknown_framework)}")
    dupe_check = defaultdict(int)
    for m in mappings:
        dupe_check[(m["tsa_outcome_id"], m["framework"], m["control_id"])] += 1
    dupes = {k: v for k, v in dupe_check.items() if v > 1}
    qa_lines.append(f"  exact duplicate (outcome, framework, control_id) rows: {len(dupes)}")
    qa_lines.append("")

    qa_lines.append("-- named spot checks (author: verify these five by hand against the sources) --")
    spot_checks = [
        ("TSA-B -> NIST_SP_800-53r5 SC-7(21)", "Confirm SC-7(21) 'Isolation of System Components' exists in SP 800-53 Rev.5 and reads as claimed."),
        ("TSA-C -> IEC_62443-3-3 FR1/SR1.1", "Confirm SR 1.1 is 'Human user identification and authentication' in IEC 62443-3-3."),
        ("TSA-E -> IEC_62443-2-3", "Confirm IEC 62443-2-3 is titled 'Patch management in the IACS environment' and is the correct part (not -3-3) for this outcome."),
        ("TSA-F -> NIST_SP_800-53r5 IR-3", "Confirm IR-3 is 'Incident Response Testing' and fits the 02D 'test >=2 objectives annually' clause."),
        ("TSA-G -> CIS_v8 CIS 18", "Confirm CIS Control 18 in CIS Controls v8 is 'Penetration Testing'."),
    ]
    for label, instruction in spot_checks:
        qa_lines.append(f"  [ ] {label}: {instruction}")
    qa_lines.append("")
    qa_lines.append(
        "-- threshold counts appearing in the technical report / README (must match stats.json) --"
    )
    qa_lines.append(f"  n_outcomes = {len(outcomes)}")
    qa_lines.append(f"  n_mapping_rows = {len(mappings)}")
    qa_lines.append(f"  n_unique_controls = {len(by_control)}")
    qa_lines.append(f"  n_frameworks = {len(frameworks_seen)}")

    with open(f"{OUT_DIR}/qa_report.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(qa_lines) + "\n")

    # ---- stats.json (every number quoted anywhere must come from here) ----
    stats = {
        "n_outcomes": len(outcomes),
        "n_mapping_rows": len(mappings),
        "n_unique_controls": len(by_control),
        "n_frameworks": len(frameworks_seen),
        "frameworks": frameworks_seen,
        "mapping_strength_counts": dict(strength_counts),
        "outcomes_with_coverage_gap": coverage_gaps,
        "sd_version_used": load(MANUAL_OUTCOMES)["source_version_used"],
        "n_controls_per_outcome": {o["id"]: len(by_outcome[o["id"]]) for o in outcomes},
    }
    with open(f"{OUT_DIR}/stats.json", "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2)

    print(f"wrote {OUT_DIR}/crosswalk.json, crosswalk.csv, qa_report.txt, stats.json")
    print(f"outcomes={len(outcomes)} mapping_rows={len(mappings)} unique_controls={len(by_control)} coverage_gaps={coverage_gaps}")
    if orphan_outcome_refs or unknown_framework or dupes:
        print("WARNING: integrity issues found -- see qa_report.txt")


if __name__ == "__main__":
    main()
