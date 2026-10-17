# The Wallace Index — human research review packet 01

Prepared 17 October 2026. Status: draft for human research review. No independent review has taken place. Nothing in this packet is an official RETHINKK assessment, public edition or approved scoring model.

## Read the profiles

- [Boris Johnson](profiles/boris-johnson.md)
- [Keir Starmer](profiles/keir-starmer.md)
- [Andy Burnham](profiles/andy-burnham.md)
- [Barack Obama](profiles/barack-obama.md)
- [Olaf Scholz](profiles/olaf-scholz.md)

Each profile contains six substantive draft judgements, separately identified supporting, adverse/contradictory and qualifying evidence, uncertainties and an evidence-sufficiency decision. A vacant adverse-evidence category means that no directly attributable item has been admitted in that category; it does not establish an absence of adverse conduct.

## Registers and review controls

- [Coverage audit](coverage-audit.md): period coverage, limits and priority research.
- [Methodological decisions](methodological-decisions.md): decisions for the editorial team before numerical scoring and publication.
- [Research log and source exceptions](research-log.md): searches, exclusions, failed retrievals and version/date conflicts.
- `review-register.json`: consolidated source, claim and profile data.
- `sources.csv`, `claims.csv`, `evidence-matrix.csv`: portable exports of the same records.
- `retrieval-manifest.json`: all 38 new retrieval attempts, including failures.
- `reviewer-checklist.md`: practical review sequence and sign-off fields.
- `validate.py`: reference, export and optional retained-file integrity checks.

The catalogue contains 72 records: the earlier 34 and 38 new attempts. Thirty-five new original pages/documents were retrieved. Three attempts failed; one retrieved document is quarantined for the proposed historical use because of a version mismatch. Navigation-only records do not support substantive claims. There are 64 bounded claim records, including 34 additions: 32 from newly retrieved sources and two separately attributed PCLOB disagreements from an already archived report. Counts are an inventory, not a measure of assessment quality or sufficiency.

## Scores and scope

All thirty proposed and official scores remain null, and all totals remain null. The user authorised optional editorial score proposals, but also required insufficiently supported dimensions to remain unassessed. These drafts still have material attribution, temporal-coverage or interpretation gaps, set out individually. Withholding a score does not mean zero and is not based merely on the rubric awaiting approval.

The original six dimensions and integer 0–3 model remain unchanged. Approval of the proposed operational rubric is still required before publication. No additional safeguards, eligibility rules or disqualifications have been inserted into the model. The index remains a non-validated qualitative framework; numerical completeness would not turn it into an objective or scientifically validated measurement.

The earlier `research-01`, `verification-01` and `recovery-01` directories are preserved. This consolidated working packet applies the documented verification overlay and adds evidence without altering their records. The former operational prototype scores are not inputs.

Run from the repository root:

```sh
python3 research/wallace-index/review-01/validate.py
python3 research/wallace-index/review-01/validate.py --baseline-evidence /workspace/wallace-verification-evidence-01 --new-evidence /workspace/wallace-editorial-review-evidence-01
```

The raw retained publications remain outside the repository and public assets, in the two workspace evidence directories above. They are included in the separate review download. Retrieval hashes identify captured bytes, not factual truth, permanent hosting or independent editorial approval. No application build is needed for this research-only addition; no application code, CMS records or public routes were changed.
