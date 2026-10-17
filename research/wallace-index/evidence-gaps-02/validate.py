"""Check the targeted follow-up without certifying facts or whole-period sufficiency."""
import argparse,csv,hashlib,json
from pathlib import Path
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--evidence',type=Path);args=parser.parse_args()
root=Path(__file__).resolve().parent;basepath=root.parent/'internal-review-01/revised-register.json'
base=json.loads(basepath.read_text());follow=json.loads((root/'followup-register.json').read_text());updated=json.loads((root/'updated-register.json').read_text());manifest=json.loads((root/'retrieval-manifest.json').read_text())
assert hashlib.sha256(basepath.read_bytes()).hexdigest()==follow['baseline_register_sha256']
assert len(follow['new_sources'])==len(follow['new_claims'])==len(manifest)==17
assert len({r['id'] for r in manifest})==17 and all(r['http_status']==200 and not r.get('error') for r in manifest)
assert follow['specific_gaps_closed']==7 and follow['specific_gaps_remaining']==1
assert not follow['full_period_threshold_changed'] and not follow['independent_review']
assert not follow['official_publication'] and not follow['methodology_approved']
assert updated['sources'][:len(base['sources'])]==base['sources']
assert updated['claims'][:len(base['claims'])]==base['claims']
sources={s['id']:s for s in updated['sources']};claims={c['id']:c for c in updated['claims']}
assert len(sources)==len(updated['sources'])==89 and len(claims)==len(updated['claims'])==82
for s,r in zip(follow['new_sources'],manifest):
 assert s['id']==r['id'] and s['url']==r['requested_url']
 assert s['snapshot_sha256']==r['sha256'] and s['text_sha256']==r['text_sha256']
 assert s['title'] and s['author_or_issuing_institution'] and s['publisher'] and s['locator']
 assert not s['independent_editorial_review']
 for cid in s['supported_claim_ids']:assert claims[cid]['source_id']==s['id']
decisions={(r['leader_id'],r['dimension']):r for r in follow['followup_decisions']}
assert len(decisions)==8
assert sum(r['followup_status']=='specific_gap_closed' for r in decisions.values())==7
assert decisions['olaf-scholz','Service']['followup_status']=='specific_gap_remains'
for p,original in zip(updated['profiles'],base['profiles']):
 assert p['assessment_period']==original['assessment_period']
 assert p['proposed_total'] is None and p['official_total'] is None
 for item,old in zip(p['dimensions'],original['dimensions']):
  assert item['proposed_score'] is None and item['official_score'] is None
  key=p['id'],item['dimension']
  if key not in decisions:assert item==old;continue
  d=decisions[key]
  assert old['internal_review_decision']=='insufficient'
  assert item['draft_judgement']==d['new_judgement']
  assert not item['followup_review']['whole_period_numeric_sufficiency']
  assert item['internal_review_history'][0]['judgement']==old['draft_judgement']
  assert d['whole_period_sufficiency']=='not_established'
  for id in d['new_source_ids']:assert id in sources and id+'-C1' in item['supporting_claim_ids']
  assert (root/'profiles'/(p['id']+'.md')).is_file()
with (root/'followup-matrix.csv').open(newline='') as f:rows=list(csv.DictReader(f))
assert len(rows)==8 and {(r['leader_id'],r['dimension']) for r in rows}==set(decisions)
for row in rows:
 d=decisions[row['leader_id'],row['dimension']]
 for k,value in row.items():assert value==('; '.join(d[k]) if isinstance(d[k],list) else '' if d[k] is None else d[k])
if args.evidence:
 for r in manifest:
  raw=(args.evidence/r['snapshot_file']).read_bytes();text=(args.evidence/r['text_file']).read_bytes()
  assert len(raw)==r['bytes'] and hashlib.sha256(raw).hexdigest()==r['sha256']
  assert hashlib.sha256(text).hexdigest()==r['text_sha256']
 for name in ['GS_BO01-page1.png','nobel-1.png','nobel-2.png','nobel-3.png','nobel-4.png']:assert (args.evidence/name).is_file()
print('PASS: 8 follow-ups, 17 retained sources, 17 new claims; 7 named-case gaps closed and 1 remains. Earlier records and full-period threshold preserved; scores and totals unassessed.')
