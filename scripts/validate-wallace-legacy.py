#!/usr/bin/env python3
"""Validate archive integrity and reconciliation without running legacy scripts."""
import csv
import hashlib
import json
import sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv) > 1 else "research/wallace-index/recovery-01").resolve()
archive = json.loads((root / "wallace-legacy-recovered.json").read_text())
manifest = json.loads((root / "wallace-legacy-source-manifest.json").read_text())
source_by_id = {s["id"]: s for s in manifest["file_versions"]}
observations = {o["id"]: o for o in archive["observations"]}
commits = {c["sha"] for c in manifest["commits"]}
assert len(commits) == archive["coverage"]["reachable_commit_count"] == 34
assert len(source_by_id) == archive["coverage"]["unique_file_version_count"] == 25
assert len(archive["leaders"]) == 2
assert len(archive["assessments"]) == 7
assert len(observations) == 26
assert len(manifest["deletions"]) == 13
for source in source_by_id.values():
    file = (root / source["archive_path"]).resolve()
    assert file.is_relative_to(root)
    raw = file.read_bytes()
    assert len(raw) == source["byte_length"]
    assert hashlib.sha256(raw).hexdigest() == source["sha256"]
    assert hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest() == source["git_blob_sha"]
    assert set(source["present_in_commits"]).issubset(commits)
for observation in observations.values():
    p = observation["provenance"]
    source = source_by_id[p["source_id"]]
    raw = (root / source["archive_path"]).read_text()
    assert p["commit_sha"] in source["present_in_commits"]
    assert p["original_path"] == source["original_path"]
    assert p["git_blob_sha"] == source["git_blob_sha"]
    assert p["original_excerpt"] in raw
    assert 1 <= p["lines"][0] <= p["lines"][1] <= len(raw.splitlines()) + 1
    assert observation["original_stated_total"] is None
    assert observation["original_stated_maximum"] is None
    assert observation["assessment_date_or_period"] is None
    assert observation["original_rationale"] is None
    assert observation["original_research_sources"] == []
records = {r["id"]: r for r in archive["assessments"]}
expected_vectors = {
    ("keir-starmer", "legacy-six-names", (2, 3, 2, 2, 2, 3)),
    ("boris-johnson", "legacy-six-names", (1, 0, 2, 1, 0, 1)),
    ("keir-starmer", "legacy-alternative-names", (9, 8, 7)),
    ("boris-johnson", "legacy-alternative-names", (5, 3, 2)),
    ("keir-starmer", "legacy-alternative-names", (9, 8, 7, 6, 6, 8)),
    ("boris-johnson", "legacy-alternative-names", (5, 3, 2, 2, 1, 2)),
    ("boris-johnson", "legacy-alternative-names", (5, 3, 2, 3, 2, 2)),
}
assert {(r["leader_id"], r["methodology_id"], tuple(d["original_numeric_value"] for d in r["dimensions"])) for r in records.values()} == expected_vectors
for record in records.values():
    assert record["label"] == "Recovered legacy prototype — not an approved RETHINKK assessment."
    assert record["current_model_total"] is None
    assert record["original_stated_total"] is None
    assert record["original_stated_maximum"] is None
    assert record["calculated_arithmetic_sum"] == sum(d["original_numeric_value"] for d in record["dimensions"])
    for observation_id in record["observation_ids"]:
        observation = observations[observation_id]
        assert observation["assessment_record_id"] == record["id"]
        assert observation["leader_id"] == record["leader_id"]
        assert observation["dimensions"] == record["dimensions"]
    assert any(observations[o]["extraction_method"] != "inferred_from_svg_geometry" for o in record["observation_ids"])
with (root / "wallace-legacy-recovered.csv").open(newline="") as file:
    rows = list(csv.DictReader(file))
assert len(rows) == sum(len(r["dimensions"]) for r in records.values()) == 36
for record_id, record in records.items():
    csv_rows = [r for r in rows if r["assessment_id"] == record_id]
    assert [(r["original_dimension_label"], int(r["original_dimension_score"])) for r in csv_rows] == [(d["original_label"], d["original_numeric_value"]) for d in record["dimensions"]]
    assert all(int(r["calculated_arithmetic_sum"]) == record["calculated_arithmetic_sum"] for r in csv_rows)
    assert all(r["original_stated_total"] == r["current_model_total"] == r["original_stated_maximum"] == "" for r in csv_rows)
with (root / "wallace-legacy-import-comparison.csv").open(newline="") as file:
    comparisons = list(csv.DictReader(file))
assert len(comparisons) == 2 and all(r["status"] == "pending_missing_import_file" for r in comparisons)
assert all(m["explicit_scale_maximum"] is None for m in archive["methodology_variants"])
assert archive["publication_eligible"] is False
report = {"status": "passed", "verified_file_versions": 25, "verified_commit_records": 34, "verified_score_observations": 26, "distinct_assessment_records": 7, "reconciled_csv_dimension_rows": 36, "all_evidence_byte_checksums_match": True, "all_git_blob_hashes_match": True, "all_original_excerpts_found_in_preserved_files": True, "json_csv_reconciliation": "passed", "original_totals_and_current_model_totals_remain_unset": True, "provisional_import_comparison": "pending: both files unavailable", "scope": "Archive fidelity and consistency only; not verification of political claims or endorsement of scores."}
(root / "validation-summary.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
