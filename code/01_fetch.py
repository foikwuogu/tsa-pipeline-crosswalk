#!/usr/bin/env python3
"""Fetch primary source PDFs into data/raw/ and log provenance.

Attempts a real HTTP download of every source with a normal browser-like
User-Agent (some of these TSA URLs returned HTTP 403 to the automated tool
used to build this repository -- run this from a normal network/browser
context and it may well succeed; if a URL 403s for you too, download it
manually in a browser and place it at the path shown, then re-run this
script, which will detect the existing file and just log its hash).

Usage:
    python code/01_fetch.py
"""
import hashlib
import os
import sys
import urllib.request

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
}

SOURCES = [
    {
        "url": "https://www.tsa.gov/sites/default/files/tsa_sd_pipeline-2021-02-july-21_2022.pdf",
        "out": "data/raw/pdf/sd_pipeline_2021-02C.pdf",
        "note": "SD Pipeline-2021-02C, effective 2022-07-27 (superseded); primary structural source for the crosswalk.",
    },
    {
        "url": "https://www.tsa.gov/sites/default/files/tsa-security-directive-pipeline-2021-02e-and-memo-508c.pdf",
        "out": "data/raw/pdf/sd_pipeline_2021-02E.pdf",
        "note": "SD Pipeline-2021-02E; returned HTTP 403 to this build's fetch tool on 2026-09-09. Retry manually.",
    },
    {
        "url": "https://www.tsa.gov/sites/default/files/tsa-security-directive-pipeline-2021-02f-and-memo-508c.pdf",
        "out": "data/raw/pdf/sd_pipeline_2021-02F.pdf",
        "note": "SD Pipeline-2021-02F, current per tsa.gov/sd-and-ea as of 2026-09-09; returned HTTP 403 to this build's fetch tool. VERIFY POINT -- fetch and diff against 02C/D before publishing.",
    },
    {
        "url": "https://www.tsa.gov/sites/default/files/pipeline_security_guidelines.pdf",
        "out": "data/raw/pdf/pipeline_security_guidelines_2018_ch1_2021.pdf",
        "note": "TSA Pipeline Security Guidelines, March 2018 (Change 1, April 2021); non-mandatory secondary context.",
    },
]

PROVENANCE_LOG = "data/raw/PROVENANCE.txt"


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    os.makedirs("data/raw/pdf", exist_ok=True)
    import datetime

    for src in SOURCES:
        out = src["out"]
        if not os.path.exists(out):
            try:
                req = urllib.request.Request(src["url"], headers=HEADERS)
                with urllib.request.urlopen(req, timeout=30) as resp, open(out, "wb") as f:
                    f.write(resp.read())
                print(f"downloaded: {out}")
            except Exception as e:  # noqa: BLE001
                print(f"COULD NOT DOWNLOAD {src['url']}: {e}", file=sys.stderr)
                print(f"  -> download it manually in a browser and save it to {out}, then re-run this script.")
                continue
        line = " | ".join([
            datetime.date.today().isoformat(),
            os.path.basename(out),
            f"{os.path.getsize(out)} bytes",
            f"sha256:{sha256(out)}",
            src["url"],
            src["note"],
        ])
        with open(PROVENANCE_LOG, "a", encoding="utf-8") as f:
            f.write(line + "\n")
        print(line)

    print(
        "\nNIST SP 800-82 Rev.3 and SP 800-53 Rev.5 are large public-domain "
        "catalogs (csrc.nist.gov) referenced by section/control-ID in "
        "data/manual/control_mappings.json rather than mirrored here in full; "
        "see BUILD_SPEC.md SOURCES for citations."
    )


if __name__ == "__main__":
    main()
