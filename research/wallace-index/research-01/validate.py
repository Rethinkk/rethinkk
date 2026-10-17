"""Check the unscored research packet and its portable exports, not claim truth."""

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
data = json.loads((ROOT / "research-register.json").read_text())
dimensions = ["People", "Process", "Policy", "Crisis", "Humility", "Service"]
expected = {"boris-johnson", "keir-starmer", "andy-burnham", "barack-obama", "olaf-scholz"}
leaders = {item["id"]: item for item in data["leaders"]}
sources = {item["id"]: item for item in data["sources"]}
claims = {item["id"]: item for item in data["claims"]}

assert set(leaders) == expected and len(leaders) == len(data["leaders"])
assert len(sources) == len(data["sources"])
assert len(claims) == len(data["claims"])
assert len({source["url"] for source in sources.values()}) == len(sources)
assert data["official_publication"] is False and data["legacy_scores_used"] is False
assert data["status"] == "unreviewed_research_only"

for source in sources.values():
    assert source["title"] and source["author_or_issuing_institution"] and source["publisher"]
    assert source["url"].startswith("https://") and source["language"] in {"en", "de"}
    assert set(source["leader_ids"]) <= expected
    assert set(source["linked_dimensions"]) <= set(dimensions)
    assert source["reliability_and_relevance_notes"] and source["locator"]
    assert source["independent_editorial_verification"] is False
    if source["review_extent"] == "discovery_only":
        assert not source["supported_claim_ids"]
        assert source["access_status"].startswith("retrieval_failed")
    else:
        assert source["access_status"] == "retrieved"
        assert source["supported_claim_ids"]
    for claim_id in source["supported_claim_ids"]:
        assert claims[claim_id]["source_id"] == source["id"]

for claim in claims.values():
    source = sources[claim["source_id"]]
    assert claim["id"] in source["supported_claim_ids"]
    assert claim["leader_id"] in source["leader_ids"]
    assert claim["editorial_review_status"] == "unreviewed"

for leader in leaders.values():
    assert leader["status"] == "evidence_collection"
    assert leader["methodology_approved"] is False
    assert leader["publisher_approval"] is None and leader["total"] is None
    assert [item["dimension"] for item in leader["dimension_scores"]] == dimensions
    for source_id in leader["assessment_period"]["source_ids"]:
        assert leader["id"] in sources[source_id]["leader_ids"]
    for item in leader["dimension_scores"]:
        assert item["score"] is None and item["proposed_rationale"] is None
        assert item["evidence_sufficiency"] == "insufficient_for_assessment"
        assert item["outstanding_research"] and item["research_synthesis"]
        for source_id in item["source_ids"]:
            assert leader["id"] in sources[source_id]["leader_ids"]
            assert item["dimension"] in sources[source_id]["linked_dimensions"]
    assert (ROOT / "dossiers" / (leader["id"] + ".md")).is_file()

with (ROOT / "sources.csv").open(newline="") as handle:
    rows = list(csv.DictReader(handle))
assert len(rows) == len(sources)
for row in rows:
    source = sources[row["id"]]
    for key, value in source.items():
        expected_value = "; ".join(value) if isinstance(value, list) else "" if value is None else str(value)
        assert row[key] == expected_value, (source["id"], key)

with (ROOT / "evidence-matrix.csv").open(newline="") as handle:
    rows = list(csv.DictReader(handle))
assert len(rows) == 30
lookup = {(leader["name"], item["dimension"]): (leader, item)
          for leader in leaders.values() for item in leader["dimension_scores"]}
assert {(row["leader"], row["dimension"]) for row in rows} == set(lookup)
for row in rows:
    leader, item = lookup[row["leader"], row["dimension"]]
    assert row["score"] == "" and row["office"] == leader["office"]
    for key in ["evidence_sufficiency", "research_synthesis", "outstanding_research"]:
        assert row[key] == item[key]
    assert row["source_ids"] == "; ".join(item["source_ids"])

print(f"PASS: {len(leaders)} dossiers, 30 unassessed dimensions, {len(sources)} sources, "
      f"{len(claims)} unreviewed bounded claims; JSON/CSV references agree. "
      "No factual verification or editorial approval is implied.")
