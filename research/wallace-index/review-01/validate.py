"""Validate the research-review packet and, optionally, retained publication bytes."""

import argparse
import csv
import hashlib
import json
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--baseline-evidence", type=Path)
parser.add_argument("--new-evidence", type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parent
data = json.loads((root / "review-register.json").read_text())
baseline = json.loads((root.parent / "research-01/research-register.json").read_text())
verified = json.loads((root.parent / "verification-01/verification-register.json").read_text())
manifest = json.loads((root / "retrieval-manifest.json").read_text())
sources = {item["id"]: item for item in data["sources"]}
claims = {item["id"]: item for item in data["claims"]}
profiles = {item["id"]: item for item in data["profiles"]}
dimensions = ["People", "Process", "Policy", "Crisis", "Humility", "Service"]
assert len(sources) == len(data["sources"]) == 72
assert len(claims) == len(data["claims"]) == 64
assert len(profiles) == len(data["profiles"]) == 5
assert len(manifest) == 38 and len({item["id"] for item in manifest}) == 38
assert sum(item.get("http_status") == 200 for item in manifest) == 35
assert not data["official_publication"] and not data["independent_review_completed"]
assert not data["methodology_approved"]
assert {source["id"] for source in baseline["sources"]} <= set(sources)
assert {source["id"] for source in verified["supplementary_sources"]} <= set(sources)

for old in verified["claims"]:
    for key, value in old.items():
        assert claims[old["id"]][key] == value, (old["id"], key)

for source in sources.values():
    assert source["title"] and source["author_or_issuing_institution"]
    assert source["url"].startswith("https://")
    assert not source["editorial_approval"]
    assert set(source["linked_dimensions"]) <= set(dimensions)
    assert source["supported_claim_ids"] == [item["id"] for item in data["claims"] if item["source_id"] == source["id"]]
    if source.get("evidence_status") in {"quarantined_version_conflict", "discovery_or_navigation_only"}:
        assert not source["supported_claim_ids"]
    for claim_id in source["supported_claim_ids"]:
        claim = claims[claim_id]
        assert claim["leader_id"] in source["leader_ids"]
        assert claim["locator"] and claim["text"]
        assert claim["editorial_review_status"] == "unreviewed"
        assert set(claim["dimensions"]) <= set(source["linked_dimensions"])

assert sources["NKS07"]["evidence_status"] == "quarantined_version_conflict"
assert not any(item["source_id"] in {"NKS07", "NAB03", "NOS06", "NBJ10"} for item in claims.values())
for item in manifest:
    source = sources[item["id"]]
    assert source["url"] == item["requested_url"]
    if item.get("http_status") == 200:
        assert source["snapshot_file"] == item["snapshot_file"]
        assert source["snapshot_sha256"] == item["sha256"]
    else:
        assert not source["supported_claim_ids"] and item["error"]

for profile in profiles.values():
    period = next(item for item in verified["assessment_period_checks"] if item["leader_id"] == profile["id"])
    assert profile["assessment_period"] == period
    assert not profile["methodology_approved"] and not profile["independent_review_completed"]
    assert profile["proposed_total"] is None and profile["official_total"] is None
    assert [item["dimension"] for item in profile["dimensions"]] == dimensions
    text = (root / "profiles" / (profile["id"] + ".md")).read_text()
    for item in profile["dimensions"]:
        assert item["proposed_score"] is None and item["official_score"] is None
        assert item["draft_judgement"] and item["uncertainties"] and item["score_withholding_reason"]
        assert item["reviewer_decision"] is None
        assert item["draft_judgement"] in text and item["uncertainties"] in text
        for field in ["supporting_claim_ids", "adverse_or_contradictory_claim_ids", "qualifying_claim_ids"]:
            for claim_id in item[field]:
                assert claims[claim_id]["leader_id"] == profile["id"]
                assert claim_id in text

for filename, objects in [("sources.csv", sources), ("claims.csv", claims)]:
    with (root / filename).open(newline="") as handle:
        rows = list(csv.DictReader(handle))
    assert len(rows) == len(objects) and {row["id"] for row in rows} == set(objects)
    for row in rows:
        item = objects[row["id"]]
        for key, value in row.items():
            assert value == ("" if item.get(key) is None else str(item[key])), (filename, row["id"], key)

with (root / "evidence-matrix.csv").open(newline="") as handle:
    rows = list(csv.DictReader(handle))
expected = {(profile["name"], item["dimension"]): (profile, item)
            for profile in profiles.values() for item in profile["dimensions"]}
assert len(rows) == 30 and {(row["leader"], row["dimension"]) for row in rows} == set(expected)
for row in rows:
    profile, item = expected[row["leader"], row["dimension"]]
    assert row["office"] == profile["office"]
    assert row["proposed_score"] == row["official_score"] == ""
    for key in ["supporting_claim_ids", "adverse_or_contradictory_claim_ids", "qualifying_claim_ids"]:
        assert row[key] == "; ".join(item[key])
    for key in ["draft_judgement", "uncertainties", "evidence_sufficiency"]:
        assert row[key] == item[key]

checked_files = 0
for source in sources.values():
    evidence = args.new_evidence if source["snapshot_collection"] == "new" else args.baseline_evidence
    if evidence is None or not source.get("snapshot_file"):
        continue
    for filename_key, hash_key in [("snapshot_file", "snapshot_sha256"), ("text_file", "text_sha256")]:
        path = evidence / source[filename_key]
        assert hashlib.sha256(path.read_bytes()).hexdigest() == source[hash_key], source["id"]
    checked_files += 1

print(f"PASS: 5 profiles, 30 substantive dimension drafts, 72 source records, 64 bounded claims; "
      f"exports and references agree; {checked_files} retained source/text pairs checked. "
      "No numerical scores or independent editorial approval implied.")
