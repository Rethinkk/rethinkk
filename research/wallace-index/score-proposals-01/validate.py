#!/usr/bin/env python3
"""Validate a conditional review packet against its unchanged evidence predecessor."""
import csv
import hashlib
import json
from pathlib import Path

base = Path(__file__).resolve().parent
root = base.parents[2]
p = json.loads((base / 'score-proposals.json').read_text())
prior_path = root / p['prior_packet']
prior = json.loads(prior_path.read_text())
assert hashlib.sha256(prior_path.read_bytes()).hexdigest() == p['prior_packet_sha256']
assert p['methodology_approved'] is False
assert p['official_publication'] is False
assert p['independent_review_completed'] is False
assert len(p['profiles']) == 5
sources = {s['id']: s for s in p['sources']}
claims = {c['id']: c for c in p['claims']}
assert len(sources) == len(p['sources'])
assert len(claims) == len(p['claims'])
old_sources = {s['id']: s for s in prior['sources']}
old_claims = {c['id']: c for c in prior['claims']}
for id, source in sources.items():
    assert source == old_sources[id], id
for id, claim in claims.items():
    assert claim == old_claims[id], id
    assert claim['source_id'] in sources
expected = {('boris-johnson', 'Process'): 1, ('boris-johnson', 'Humility'): 1,
            ('barack-obama', 'Humility'): 2, ('olaf-scholz', 'Process'): 1}
found = {}
rows = list(csv.DictReader((base / 'score-proposals.csv').open(newline='')))
assert len(rows) == 30
csv_lookup = {(row['leader_id'], row['dimension']): row for row in rows}
assert len(csv_lookup) == 30
for profile in p['profiles']:
    old = next(x for x in prior['profiles'] if x['id'] == profile['id'])
    assert profile['assessment_period'] == old['assessment_period']
    assert profile['proposed_total'] is None and profile['official_total'] is None
    for id in profile['assessment_period']['source_ids']:
        assert id in sources
    assert [d['dimension'] for d in profile['dimensions']] == [d['dimension'] for d in old['dimensions']]
    for d in profile['dimensions']:
        before = next(x for x in old['dimensions'] if x['dimension'] == d['dimension'])
        key = (profile['id'], d['dimension'])
        score = d['proposed_score']
        assert d['official_score'] is None
        assert d['whole_period_evidence_sufficiency_approved'] is False
        assert d['human_reviewer_decision'] is None and d['independent_review_completed'] is False
        assert d['retained_uncertainties'] == before['uncertainties']
        assert d['prior_evidence_sufficiency'] == before['evidence_sufficiency']
        assert d['prior_withholding_reason'] == before['score_withholding_reason']
        assert d['existing_qualitative_judgement'] == before['draft_judgement']
        linked = set()
        for field in ['supporting_claim_ids', 'adverse_or_contradictory_claim_ids', 'qualifying_claim_ids']:
            assert d[field] == before[field]
            for id in d[field]:
                assert id in claims
                assert claims[id]['leader_id'] == profile['id']
                linked.add(id)
        if score is not None:
            assert type(score) is int and 0 <= score <= 3
            assert d['proposal_status'] == 'conditional_editorial_proposal'
            assert d['descriptor'] == p['rubric_descriptors'][score]
            assert d['decisive_claim_ids'] and set(d['decisive_claim_ids']) <= linked
            assert d['adjacent_descriptor_analysis'] and d['condition_or_research_needed'] and d['change_from_prior']
            found[key] = score
        else:
            assert d['proposal_status'] == 'withheld_insufficient_evidence'
        row = csv_lookup[key]
        assert row['proposed_score'] == ('' if score is None else str(score))
        assert row['status'] == d['proposal_status'] and row['whole_period_approved'] == 'false'
        assert row['rationale'] == d['rationale']
        assert (base / 'profiles' / f'{profile["id"]}.md').exists()
assert found == expected
assert not any(c['source_id'] == 'NKS07' for c in claims.values())
checks = json.loads((base / 'passage-checks.json').read_text())
assert len(checks) == 12
for check in checks:
    assert check['source_id'] in sources
    assert check['anchor'] in check['extract']
    path = root.parent / check['retained_text_collection'] / check['retained_text_file']
    if path.exists():
        assert hashlib.sha256(path.read_bytes()).hexdigest() == check['sha256']
        assert check['extract'] in path.read_text()
print('PASS: five profiles, 30 dimensions, four conditional candidates, 26 withheld; '
      'claims/sources and prior limitations preserved; CSV reconciled; '
      '12 retained-text passage checks; no approvals or totals.')
