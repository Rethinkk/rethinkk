"""Check internal-review provenance, applied revisions and portable exports."""

import collections
import csv
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent
baseline_path = root.parent / "review-01/review-register.json"
baseline = json.loads(baseline_path.read_text())
review = json.loads((root / "review-decisions.json").read_text())
revised = json.loads((root / "revised-register.json").read_text())
old_profiles = {item["id"]: item for item in baseline["profiles"]}
profiles = {item["id"]: item for item in revised["profiles"]}
claims = {item["id"]: item for item in revised["claims"]}
sources = {item["id"]: item for item in revised["sources"]}
decisions = {(item["leader_id"], item["dimension"]): item for item in review["decisions"]}

assert hashlib.sha256(baseline_path.read_bytes()).hexdigest() == review["baseline_register_sha256"]
assert len(decisions) == len(review["decisions"]) == 30
assert collections.Counter(item["decision"] for item in decisions.values()) == {"accept": 13, "amend": 9, "insufficient": 8}
assert review["decision_counts"] == dict(collections.Counter(item["decision"] for item in decisions.values()))
assert not review["independent_review"] and not revised["independent_review_completed"]
assert not revised["official_publication"] and not revised["methodology_approved"]
assert all(review[key] is None for key in ["human_reviewer_signoff", "publisher_approval", "methodology_approval"])
assert review["new_external_retrievals"] == 0
assert set(profiles) == set(old_profiles)
assert len(claims) == 65 and len(sources) == 72
for claim in baseline["claims"]:
    assert claims[claim["id"]] == claim
assert set(claims) - {item["id"] for item in baseline["claims"]} == {"IR-BJ01"}
assert claims["IR-BJ01"]["source_id"] == "NBJ02"

for profile_id, profile in profiles.items():
    old = old_profiles[profile_id]
    assert profile["assessment_period"] == old["assessment_period"]
    assert profile["official_total"] is None and profile["proposed_total"] is None
    assert not profile["independent_review_completed"] and not profile["methodology_approved"]
    assert [item["dimension"] for item in profile["dimensions"]] == [item["dimension"] for item in old["dimensions"]]
    text = (root / "profiles" / (profile_id + ".md")).read_text()
    for original, item in zip(old["dimensions"], profile["dimensions"]):
        decision = decisions[profile_id, item["dimension"]]
        assert decision["original_judgement"] == original["draft_judgement"]
        assert decision["revised_judgement"] == item["draft_judgement"]
        assert item["draft_judgement"] in text and decision["reason"] in text
        assert item["internal_review_decision"] == decision["decision"]
        assert item["official_score"] is None and item["proposed_score"] is None
        assert item["reviewer_decision"] is None
        if decision["decision"] == "accept":
            assert decision["original_judgement"] == decision["revised_judgement"]
        else:
            assert decision["original_judgement"] != decision["revised_judgement"]
        for field in ["supporting_claim_ids", "adverse_or_contradictory_claim_ids", "qualifying_claim_ids"]:
            for claim_id in item[field]:
                assert claims[claim_id]["leader_id"] == profile_id
                assert claims[claim_id]["source_id"] in sources
                assert claim_id in text

for source in sources.values():
    expected = [item["id"] for item in revised["claims"] if item["source_id"] == source["id"]]
    assert source["supported_claim_ids"] == expected

with (root / "review-decisions.csv").open(newline="") as handle:
    rows = list(csv.DictReader(handle))
assert len(rows) == 30
for row in rows:
    item = decisions[row["leader_id"], row["dimension"]]
    for key, value in row.items():
        assert value == ("; ".join(item[key]) if key == "claim_ids" else item[key])

with (root / "revised-evidence-matrix.csv").open(newline="") as handle:
    rows = list(csv.DictReader(handle))
assert len(rows) == 30
assert len({(row["leader_id"], row["dimension"]) for row in rows}) == 30
for row in rows:
    item = next(item for item in profiles[row["leader_id"]]["dimensions"] if item["dimension"] == row["dimension"])
    for key, value in row.items():
        if key == "leader_id":
            continue
        expected = "; ".join(item[key]) if isinstance(item[key], list) else "" if item[key] is None else item[key]
        assert value == expected

print("PASS: 30 internal decisions, 17 revised paragraphs, 13 retained paragraphs, "
      "65 bounded claims; original packet preserved and exports consistent. "
      "No numerical, independent-review or publication approval implied.")
