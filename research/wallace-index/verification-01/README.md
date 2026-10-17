# The Wallace Index — verification 01

Verification date: 17 October 2026. Baseline: research batch 01 at commit `1430904`.

All 28 original source URLs were retrieved directly. Six additional institutional records were retrieved for chronology, publication metadata and corroboration. The 24 existing bounded statements are supported by the inspected source passages. Six new, narrowly attributed statements were recorded from the four former discovery leads, including both positive and qualifying family evidence in the Kerslake report.

This is a source-support check by the same research assistant. It is not independent editorial review, a comprehensive assessment of the five leaders, approval of the rubric or authorisation to publish scores. All thirty dimensions remain unassessed and all totals remain null.

## Files

- [Verification report](verification-report.md): results, corrections and limits.
- [Verification register](verification-register.json): machine-readable checks and changes.
- [Claim checks](claim-checks.csv): all thirty bounded statements and limitations.
- [Source checks](source-checks.csv): all 28 original sources and snapshot checksums.
- [Retrieval manifest](retrieval-manifest.json): 34 successful retrievals, exact URLs, timestamps, file sizes and SHA-256 hashes.
- `dossiers/`: five addenda with the evidence and outstanding work for each leader.
- `validate.py`: checks references and exports; optional snapshot integrity checks.

The original `../research-01/` packet is preserved. Read its dossiers together with these addenda: earlier access failures and specified period uncertainties have been resolved here. The legacy recovery archive is unchanged.

The external publications and extracted text are retained in the workspace at `/workspace/wallace-verification-evidence-01/` and supplied in a separate download archive. They are not public website assets and are not committed to GitHub. A checksum identifies the retrieved bytes; it does not certify their truth, confer redistribution rights or establish a provider's permanent backup. The retrieval manifest is portable; the workspace path is not a permanent archive URL.

From the repository root:

```sh
python3 research/wallace-index/research-01/validate.py
python3 research/wallace-index/verification-01/validate.py
python3 research/wallace-index/verification-01/validate.py --evidence /workspace/wallace-verification-evidence-01
```
