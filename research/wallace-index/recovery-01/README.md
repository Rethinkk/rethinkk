# The Wallace Index — legacy research archive

**Recovered legacy prototype — not an approved RETHINKK assessment.**

This folder preserves research-bearing artefacts and their context from all accessible Git history of `Rethinkk/wallace-index`. It is research material in the repository, not an official public edition or a restored standalone site. No database import or score publication is authorised by its presence.

## Deliverables

| File | Purpose |
| --- | --- |
| `wallace-legacy-recovered.json` | Leaders, seven distinct score/display variants, original observations, methodology families, conflicts and missing information |
| `wallace-legacy-recovered.csv` | One row per assessment variant and recorded dimension; 36 rows |
| `wallace-legacy-recovery-report.md` | Findings, historical differences, limitations and editorial recommendations |
| `wallace-legacy-import-comparison.csv` | Explicitly pending comparisons: both provisional import files are missing |
| `wallace-legacy-source-manifest.json` | All 34 commit records, 13 deletion events and 25 unique file versions, with hashes and occurrences |
| `evidence/<git-blob-sha>/<original-path>` | Byte-for-byte originals, including deleted SVG and embedded chart versions; source material only |
| `validation-summary.json` | Integrity and JSON/CSV reconciliation results |

## Data interpretation

`original_stated_total`, `original_stated_maximum`, `current_model_total`, missing assessment dates, original rationales and political offices are null. Empty CSV fields represent the corresponding nulls. `calculated_arithmetic_sum` is explicitly a new recovery-time calculation, never an original stated total. For partial three-dimension displays it is only a partial sum.

The two `methodology_variants` are recovery identifiers for observed dimension-label families. No historically named/versioned rubric was found. Observed numeric ranges and the SVG display axis are recorded separately from the unknown intended scale. No historical scores or labels have been normalised or mapped into the current model.

Names remain exactly as originally recorded in each observation. Surname/code-key aliases are linked to the full display names using the paired source profiles. `UK` comes from the shared original page heading; it is not an independently documented per-leader country field. No office, legal name, historical assessment period or biographical enrichment was inferred.

Identical leader/dimension/value sets are grouped into one assessment record. All distinct source occurrences remain in `observations`, with file, blob, commit, line span and original excerpt. The manifest records every inspected commit in which a file version appears. Copies are not independent research. Literal HTML/JavaScript/SVG text and SVG-geometry inference have separate extraction-method labels. The full original visual material is retained for inspection.

Every factual observation about the recovery should be traceable to the manifest or an original excerpt. Later editorial interpretation is labelled separately. Technical library/format links are not supporting research citations.

## Reproduce and validate

From the root of the main RETHINKK project, using Python 3.9+ and Git:

```sh
git clone --mirror https://github.com/Rethinkk/wallace-index.git /tmp/wallace-legacy-history.git
git -C /tmp/wallace-legacy-history.git show-ref
git -C /tmp/wallace-legacy-history.git fsck --full --no-reflogs
python scripts/recover-wallace-legacy.py /tmp/wallace-legacy-history.git /tmp/wallace-recovery-reproduction
python scripts/validate-wallace-legacy.py /tmp/wallace-recovery-reproduction
```

For exact reproduction, the source reference must be the inspected commit `575c05c2d3fe8ffb337685e2f368ee1a49359270` and the same reachable reference set. Future source commits change the scope and require review of the validation expectations. Generation timestamps will differ; compare underlying observations and preserved file hashes rather than whole-file checksums of regenerated JSON.

Validate this committed archive with:

```sh
python scripts/validate-wallace-legacy.py research/wallace-index/recovery-01
```

The scripts use only Python's standard library and Git. They read the source repository and write the selected output directory; they do not execute legacy JavaScript, contact the editorial database or alter the website. Use a new output directory when preserving an existing recovery edition.

## Open work

Provide `wallace_index_poc_legacy_import.json` and `wallace_index_poc_legacy_import.csv` for reconciliation. Any original reasoning or sources held outside Git also remain to be located. Missing material is not reconstructed from contemporary commentary. Review and any later CMS migration require separate editorial authorisation; keep the legacy repository and its history intact.
