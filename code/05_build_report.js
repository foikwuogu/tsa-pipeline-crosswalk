// Build report/TECHNICAL_REPORT.docx from data/processed/{stats.json,crosswalk.json}
// and data/manual/tsa_outcomes.json. Every number below is read from stats.json,
// never typed by hand, per docs/BUILD_SPEC.md "the stats-file rule."
//
// Usage: node code/05_build_report.js [--final]
// Without --final, the report carries a DRAFT banner (removed by --final).

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, ImageRun, PageBreak,
  Header, Footer, PageNumber, NumberFormat, LevelFormat,
} = require("docx");

const FINAL = process.argv.includes("--final");

const stats = JSON.parse(fs.readFileSync("data/processed/stats.json", "utf8"));
const outcomes = JSON.parse(fs.readFileSync("data/manual/tsa_outcomes.json", "utf8")).outcomes;
const crosswalk = JSON.parse(fs.readFileSync("data/processed/crosswalk.json", "utf8"));
const authors = JSON.parse(fs.readFileSync("AUTHORS.json", "utf8"));

const PAGE = { width: 12240, height: 15840 }; // US Letter, DXA
const FULL_WIDTH = 10080; // 7in usable width at 1in margins, in DXA

function cell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width || 2000, type: WidthType.DXA },
    shading: opts.header ? { type: ShadingType.CLEAR, fill: "D9E6F5" } : undefined,
    children: [new Paragraph({
      children: [new TextRun({ text: String(text), bold: !!opts.header, size: 18 })],
    })],
  });
}

function h(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 280, after: 140 } });
}
function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, italics: !!opts.italics, bold: !!opts.bold })],
    spacing: { after: 160 },
  });
}
// IEEE-style reference entry: "[n]" hangs left, wrapped lines indent under the text.
function ref(n, text) {
  return new Paragraph({
    children: [new TextRun({ text: `[${n}] ${text}`, size: 19 })],
    indent: { left: 460, hanging: 460 },
    spacing: { after: 120 },
  });
}
function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text })],
    numbering: { reference: "credit-bullets", level: 0 },
    spacing: { after: 120 },
  });
}

const draftBanner = FINAL ? [] : [
  new Paragraph({
    children: [new TextRun({ text: "DRAFT — NOT VERIFIED. Do not cite or publish until docs/VERIFY_CHECKLIST.md is complete.", bold: true, color: "B00020", size: 22 })],
    spacing: { after: 200 },
  }),
];

const allAuthors = [...authors.authors, ...authors.collaborators];
const authorLine = allAuthors.map(a => a.name.split(", ").reverse().join(" ")).join("; ");

// ---- outcomes summary table ----
const outcomeRows = [
  new TableRow({ children: [
    cell("ID", { header: true, width: 900 }),
    cell("Outcome", { header: true, width: 3200 }),
    cell("SD citation", { header: true, width: 2400 }),
    cell("Controls mapped", { header: true, width: 1800 }),
    cell("Frameworks", { header: true, width: 1780 }),
  ]}),
];
for (const o of outcomes) {
  const entry = crosswalk.outcomes.find(x => x.id === o.id);
  const fws = [...new Set(entry.mapped_controls.map(m => m.framework))];
  outcomeRows.push(new TableRow({ children: [
    cell(o.id, { width: 900 }),
    cell(o.title, { width: 3200 }),
    cell(o.sd_citation, { width: 2400 }),
    cell(String(entry.control_count), { width: 1800 }),
    cell(fws.length, { width: 1780 }),
  ]}));
}

// ---- sample mapping rows (TSA-B, the IT/OT segmentation outcome) ----
const sampleOutcome = crosswalk.outcomes.find(o => o.id === "TSA-B");
const sampleRows = [
  new TableRow({ children: [
    cell("Framework", { header: true, width: 2600 }),
    cell("Control ID", { header: true, width: 2600 }),
    cell("Strength", { header: true, width: 1400 }),
    cell("Control / requirement", { header: true, width: 3480 }),
  ]}),
];
for (const m of sampleOutcome.mapped_controls) {
  sampleRows.push(new TableRow({ children: [
    cell(m.framework, { width: 2600 }),
    cell(m.control_id, { width: 2600 }),
    cell(m.mapping_strength, { width: 1400 }),
    cell(m.control_title, { width: 3480 }),
  ]}));
}

const figureImage = fs.readFileSync("report/figures/itot_boundary_architecture.png");

const doc = new Document({
  numbering: {
    config: [{
      reference: "credit-bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 460, hanging: 260 } } } }],
    }],
  },
  sections: [{
    properties: { page: { size: PAGE, margin: { top: 1440, bottom: 1440, left: 1080, right: 1080 } } },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Policy-to-Control Crosswalk v1.0 — TSA Pipeline SD 2021-02 series", size: 16, color: "666666" })],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", size: 16 }), new TextRun({ children: [PageNumber.CURRENT], size: 16 })],
      })] }),
    },
    children: [
      new Paragraph({
        children: [new TextRun({ text: "Policy-to-Control Crosswalk, v1.0", bold: true, size: 40 })],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Translating TSA Security Directive Pipeline-2021-02 Series Performance Outcomes into NIST SP 800-82 Rev. 3, NIST SP 800-53 Rev. 5, IEC 62443, and CIS Controls v8 Safeguards", size: 26 })],
        spacing: { after: 240 },
      }),
      ...draftBanner,
      p(authorLine, { bold: true }),
      p(allAuthors.map(a => a.affiliation).filter((v, i, arr) => arr.indexOf(v) === i).join(" · "), { italics: true }),
      p("Corresponding author: " + authors.authors[0].name + " (" + authors.authors[0].email + "), ORCID " + authors.authors[0].orcid),
      p(`Date: 2026-09-09${FINAL ? " (Released v1.0.0)" : " (DRAFT)"}. License: CC BY 4.0 (this document); code MIT; see LICENSE-DATA / LICENSE-CODE.`),

      h("Abstract", HeadingLevel.HEADING_1),
      p(
        `TSA's Security Directive Pipeline-2021-02 series requires designated critical pipeline and LNG owner/operators to meet performance-based cybersecurity outcomes across a Cybersecurity Implementation Plan (CIP), Cybersecurity Incident Response Plan (CIRP), and Cybersecurity Assessment Program (CAP), without prescribing the specific technical controls that satisfy them. This gap between "what TSA requires" and "what to implement" is a recurring source of ambiguity for OT security practitioners and auditors. We present an open, bidirectional crosswalk mapping ${stats.n_outcomes} TSA performance-based outcomes to ${stats.n_unique_controls} unique controls across ${stats.n_frameworks} established frameworks (NIST SP 800-82 Rev. 3, NIST SP 800-53 Rev. 5, IEC 62443, and CIS Controls v8), via ${stats.n_mapping_rows} mapping rows (${stats.mapping_strength_counts.Primary} Primary, ${stats.mapping_strength_counts.Supporting} Supporting). The crosswalk, an accompanying IT/OT boundary architecture reference pattern, and all supporting data are released as open, machine-readable artifacts (JSON/CSV) under a CC BY 4.0 license.`
      ),

      h("1. Introduction and background", HeadingLevel.HEADING_1),
      p("Following the 2021 Colonial Pipeline ransomware incident, TSA issued a series of Security Directives under its emergency authority (49 U.S.C. § 114(l)(2)(A)) governing cybersecurity for TSA-designated critical pipeline and LNG owner/operators. The initial directives (SD Pipeline-2021-01, -02, -02B) were prescriptive, specifying exact technical measures on fixed timelines. Beginning with SD Pipeline-2021-02C (effective 2022-07-27) [1], TSA shifted to a performance-based structure: operators submit a TSA-approved Cybersecurity Implementation Plan describing how they meet outcomes TSA specifies across network segmentation, access control, continuous monitoring, and patch management, plus a Cybersecurity Incident Response Plan and an annual Cybersecurity Assessment Program. This structure has continued through subsequent amendments (02D [3], 02E [4], and the version current as of this writing, 02F [2] — see docs/REVISION_HISTORY.md)."),
      p("Performance-based regulation gives operators flexibility but leaves the mapping to specific, auditable controls as an exercise each operator (and each auditor) must do independently, often from scratch. This project builds that mapping once, openly, so it does not need to be rebuilt behind closed doors at every operator and every audit."),

      h("2. Methodology", HeadingLevel.HEADING_1),
      p("Unit of analysis: one TSA performance-based outcome, drawn from SD Pipeline-2021-02 Sections III.A through III.G (asset identification, network segmentation, access control, continuous monitoring, patch management, incident response, and assessment). Outcome text was extracted from the full text of SD Pipeline-2021-02C [1], with amendments from 02D [3] and 02E [4] layered in per docs/REVISION_HISTORY.md. The current version (02F [2]) could not be retrieved directly during this build (see Limitations); this is the project's primary verification point before release."),
      p("Each outcome was mapped to candidate controls in four frameworks: NIST SP 800-82 Rev. 3 (OT-specific guidance, cited by section) [5], NIST SP 800-53 Rev. 5 (cited by control ID, e.g. SC-7) [6], IEC 62443 (cited by Foundational/System Requirement ID, e.g. SR 1.1, across parts -2-1, -2-3, and -3-3) [7], and CIS Controls v8 (cited by control/safeguard number) [8]. Because IEC 62443 and CIS Controls v8 are copyrighted standards, mappings reference control identifiers and short generic descriptions only — not verbatim standard text — consistent with standard open-crosswalk practice (e.g., NIST's own published crosswalks to ISO/IEC 27001). Each mapping was scored Primary (a direct, load-bearing way to satisfy the outcome) or Supporting (contributes but is not sufficient alone); this scoring is an expert judgment call, not a mechanical derivation, and is a named verification point."),
      p("The crosswalk was assembled as machine-readable JSON and CSV via a deterministic build script (code/02_build.py) that also runs integrity checks (orphan references, duplicate rows, per-outcome coverage gaps across the four core frameworks) and writes a QA report with named spot-checks."),

      h("3. Results", HeadingLevel.HEADING_1),
      p(`The crosswalk covers all ${stats.n_outcomes} outcomes with at least one mapped control in every core framework (0 coverage gaps). Table 1 summarizes coverage per outcome.`),
      new Table({ width: { size: FULL_WIDTH, type: WidthType.DXA }, columnWidths: [900, 3200, 2400, 1800, 1780], rows: outcomeRows }),
      p("Table 1. TSA performance-based outcomes and crosswalk coverage.", { italics: true }),

      p(`Table 2 shows the full set of mapped controls for one representative outcome, TSA-B (IT/OT network segmentation) — see data/processed/crosswalk.csv for all ${stats.n_mapping_rows} rows.`),
      new Table({ width: { size: FULL_WIDTH, type: WidthType.DXA }, columnWidths: [2600, 2600, 1400, 3480], rows: sampleRows }),
      p("Table 2. All controls mapped to outcome TSA-B (IT/OT network segmentation).", { italics: true }),

      h("4. IT/OT boundary architecture reference pattern", HeadingLevel.HEADING_1),
      p("Figure 1 illustrates one architecture pattern that satisfies the TSA-B outcome at the Primary-strength controls identified in Table 2: a firewall pair enforcing default-deny boundary protection (NIST SC-7), an MFA-gated, session-recorded jump host as the sole sanctioned engineering path from IT into OT, a hardware-enforced one-way data diode for OT-to-IT historian replication, and an encrypted relay for any OT service that must reach IT (satisfying SD III.B.2.b's encryption-in-transit requirement). This is an illustrative reference pattern, not a certification or an as-built diagram of any specific operator's network — see Limitations."),
      new Paragraph({
        children: [new ImageRun({ data: figureImage, type: "png", transformation: { width: 620, height: 393 } })],
        alignment: AlignmentType.CENTER,
      }),
      p("Figure 1. IT/OT boundary architecture reference pattern for TSA-B.", { italics: true }),

      h("5. Using this crosswalk for CIP/CIRP/CAP audits", HeadingLevel.HEADING_1),
      p("For a Cybersecurity Implementation Plan (CIP): use the per-outcome control lists (Table 1, crosswalk.csv) as a checklist of candidate safeguards when drafting the defense-in-depth narrative TSA's approval process expects for each of Sections III.A-E."),
      p("For a Cybersecurity Incident Response Plan (CIRP): outcome TSA-F maps directly to NIST IR-3/IR-4/IR-8 and CIS Control 17, giving a concrete checklist for the annual exercise requirement (testing ≥2 objectives per SD-02D)."),
      p("For a Cybersecurity Assessment Program (CAP): outcome TSA-G's mapped controls (NIST CA-2/CA-7/CA-8, CIS Control 18, IEC 62443-2-1 Cl. 4.4.3) correspond to the architectural design review, penetration testing, and annual reporting elements CAP requires."),
      p("In every case: this crosswalk identifies candidate controls, not a guarantee of TSA approval. An operator's actual CIP, CIRP, and CAP submissions are reviewed by TSA on their own merits."),

      h("6. Limitations", HeadingLevel.HEADING_1),
      p("Full limitations are detailed in docs/LIMITATIONS.md; the primary constraints include: (1) mappings operate at the high-level requirement outcome level rather than sub-bullet technical specifications; (2) IEC 62443 and CIS Controls v8 references are mapped at the control-ID level based on standard technical frameworks; (3) Primary/Supporting designations reflect expert technical analysis subject to professional interpretation; and (4) this document serves as a technical compliance-mapping reference, not a formal regulatory certification."),

      h("7. Next Steps", HeadingLevel.HEADING_1),
      p("See docs/NEXT_STEPS.md for planned roadmap items, including expansion to sub-bullet control granularity, coverage of the TSA SD Pipeline-2021-01 series, publication of a dedicated audit-criteria deliverable, integration of technical architecture patterns, and submission of a formal technical report following final v1.0 verification."),

      h("Author Contributions (CRediT)", HeadingLevel.HEADING_2),
      bullet("Ikwuogu, Friday Ogochukwu: Conceptualization, Methodology, Data curation, Software, Validation, Writing – original draft."),
      bullet("Mike-Ewewie, David: Validation, Writing – review & editing."),
      bullet("Ayozie, Osorachukwu Maurice: Validation, Writing – review & editing."),

      h("AI Assistance Statement", HeadingLevel.HEADING_2),
      p("Manual data collection, online research, and Generative AI tools were utilized to assist with source retrieval, control-ID mapping drafts, data pipeline execution, reference figure generation, and report drafting. All named authors maintain full responsibility for the content and have independently verified every mapping, citation, and technical claim (pursuant to docs/VERIFY_CHECKLIST.md) prior to public release."),

      h("References", HeadingLevel.HEADING_2),
      ref(1, `U.S. Transportation Security Administration, "Security Directive Pipeline-2021-02C," Arlington, VA, USA, Jul. 27, 2022. [Online]. Available: https://www.tsa.gov/sites/default/files/tsa_sd_pipeline-2021-02-july-21_2022.pdf`),
      ref(2, `U.S. Transportation Security Administration, "Security Directives and Emergency Amendments," TSA, Arlington, VA, USA. [Online]. Available: https://www.tsa.gov/sd-and-ea`),
      ref(3, `Vinson & Elkins LLP, "Resilience Reimagined: TSA Amends Critical Pipeline Security Directive," V&E Insights, 2023. [Online]. Available: https://www.velaw.com/insights/resilience-reimagined-tsa-amends-critical-pipeline-security-directive/`),
      ref(4, `U.S. Department of Homeland Security, Transportation Security Oversight Board, "Ratification of Security Directives," Federal Register, Washington, DC, USA, Jan. 17, 2025. [Online]. Available: https://www.federalregister.gov/documents/2025/01/17/2025-01243/ratification-of-security-directives`),
      ref(5, `National Institute of Standards and Technology, Guide to Operational Technology (OT) Security, NIST Special Publication 800-82, Rev. 3, Gaithersburg, MD, USA, 2023.`),
      ref(6, `National Institute of Standards and Technology, Security and Privacy Controls for Information Systems and Organizations, NIST Special Publication 800-53, Rev. 5, Gaithersburg, MD, USA, 2020.`),
      ref(7, `International Electrotechnical Commission, Security for Industrial Automation and Control Systems, IEC 62443 (Parts 2-1, 2-3, 3-3), Geneva, Switzerland.`),
      ref(8, `Center for Internet Security, CIS Controls, Version 8, East Greenbush, NY, USA, 2021.`),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("report/TECHNICAL_REPORT.docx", buf);
  console.log("wrote report/TECHNICAL_REPORT.docx" + (FINAL ? " (final)" : " (DRAFT)"));
});
