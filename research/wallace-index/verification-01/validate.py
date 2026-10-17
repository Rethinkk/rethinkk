"""Validate the verification overlay; optional retained-source integrity checks."""

import argparse
import csv
import hashlib
import json
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--evidence", type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parent
baseline_path = root.parent / "research-01" / "research-register.json"
baseline = json.loads(baseline_path.read_text())
data = json.loads((root / "verification-register.json").read_text())
manifest = json.loads((root / "retrieval-manifest.json").read_text())
sources = {source["id"]: source for source in baseline["sources"]}
checks = {check["source_id"]: check for check in data["source_verifications"]}
supplement = {source["id"]: source for source in data["supplementary_sources"]}
retrievals = {row["id"]: row for row in manifest}
all_source_ids = set(sources) | set(supplement)
claims = {claim["id"]: claim for claim in data["claims"]}
leaders = {leader["id"] for leader in baseline["leaders"]}

assert hashlib.sha256(baseline_path.read_bytes()).hexdigest() == data["baseline_register_sha256"]
assert len(checks) == 28 and set(checks) == set(sources)
assert len(supplement) == 6 and not set(supplement) & set(sources)
assert len(manifest) == len(retrievals) == 34 and set(retrievals) == all_source_ids
assert len(claims) == len(data["claims"]) == 30
assert data["official_publication"] is False and data["methodology_approved"] is False
assert data["unassessed_dimensions"] == 30
assert {row["leader_id"] for row in data["totals"]} == leaders
assert all(row["total"] is None for row in data["totals"])

for row in manifest:
    assert row["http_status"] == 200 and not row.get("error")
    assert row["requested_url"].startswith("https://")
    assert row["final_url"].startswith("https://")
    assert row["bytes"] > 0 and len(row["sha256"]) == 64
    assert Path(row["snapshot_file"]).name == row["snapshot_file"]

for claim in baseline["claims"]:
    checked = claims[claim["id"]]
    for key, value in claim.items():
        assert checked[key] == value, (claim["id"], key)
    assert checked["verification_status"] == "source_support_confirmed"

for claim in claims.values():
    assert claim["source_id"] in sources and claim["leader_id"] in leaders
    assert claim["leader_id"] in sources[claim["source_id"]]["leader_ids"]
    assert claim["editorial_review_status"] == "unreviewed"
    assert claim["verification_status"] == "source_support_confirmed"
    assert claim["verification_note"] and claim["locator"]

for check in checks.values():
    assert check["independent_editorial_review"] is False
    row = retrievals[check["source_id"]]
    assert check["snapshot_file"] == row["snapshot_file"]
    assert check["snapshot_sha256"] == row["sha256"]

assert {row["leader_id"] for row in data["assessment_period_checks"]} == leaders
for period in data["assessment_period_checks"]:
    assert period["start"] <= period["end"]
    assert set(period["source_ids"]) <= all_source_ids
    assert (root / "dossiers" / (period["leader_id"] + ".md")).is_file()
for source_id in data["source_metadata_updates"]:
    assert source_id in sources
for update in data["dimension_link_updates"]:
    assert update["leader_id"] in leaders
    assert set(update["add_source_ids"]) <= all_source_ids

with (root / "claim-checks.csv").open(newline="") as handle:
    rows = list(csv.DictReader(handle))
assert len(rows) == 30 and {row["claim_id"] for row in rows} == set(claims)
for row in rows:
    claim = claims[row["claim_id"]]
    for field in ["source_id", "leader_id", "locator", "verification_status"]:
        assert row[field] == claim[field]
    assert row["statement"] == claim["text"] and row["limits"] == claim["verification_note"]

with (root / "source-checks.csv").open(newline="") as handle:
    rows = list(csv.DictReader(handle))
assert len(rows) == 28 and {row["source_id"] for row in rows} == set(checks)
for row in rows:
    assert all(value == checks[row["source_id"]][key] for key, value in row.items())

if args.evidence:
    for row in manifest:
        raw = (args.evidence / row["snapshot_file"]).read_bytes()
        assert len(raw) == row["bytes"]
        assert hashlib.sha256(raw).hexdigest() == row["sha256"], row["id"]
    for item in list(checks.values()) + list(supplement.values()):
        text = (args.evidence / item["text_file"]).read_bytes()
        assert hashlib.sha256(text).hexdigest() == item["text_sha256"]
        normalised = " ".join(text.decode().split())
        assert all(" ".join(anchor.split()) in normalised for anchor in item["anchors"])

print("PASS: 28 source checks, 6 supplementary records, 30 bounded claim checks; "
      "baseline preserved and exports consistent. "
      + ("34 retained-source checksums and text anchors match. " if args.evidence else "")
      + "This checks integrity, not claim truth or independent editorial approval.")
