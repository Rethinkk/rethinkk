# The Wallace Index — targeted evidence-gap follow-up 02

Completed 17 October 2026. Internal follow-up commissioned by the user and performed by the original drafting assistant. No independent review, approved rubric, official score or publication is implied.

This pass addresses the eight entries marked insufficient in `internal-review-01`. Seventeen additional sources were retrieved and seventeen bounded claims were extracted. Seven specific gaps in directly attributable case evidence are now filled; Scholz's Service gap remains. **This does not mean that seven complete-period assessments have passed.** The criterion for a complete-period numerical judgement has not changed; all proposed scores, official scores and totals remain null.

## Read the additions

- [Results and limits](results.md)
- [Boris Johnson — Crisis](profiles/boris-johnson.md)
- [Andy Burnham — Crisis and Service](profiles/andy-burnham.md)
- [Barack Obama — Crisis and Service](profiles/barack-obama.md)
- [Olaf Scholz — People, Crisis and Service](profiles/olaf-scholz.md)
- [Scanned-document inspection notes](visual-inspection.md)

Starmer had no entry in the eight-item insufficient category and is unchanged in this targeted pass. The other twenty-two dimension entries are also unchanged.

`followup-register.json` records all eight decisions, seventeen sources and seventeen bounded claims. `followup-matrix.csv` is the corresponding portable decision table. `updated-register.json` is a consolidated working version containing the preserved earlier claims and source records, the additions, and explicit review history for each changed entry. Earlier directories remain intact. These records must be read with the previous counterevidence and source limitations.

The retrieval manifest records requested/final URLs, timestamps and hashes. Raw publications and extracted text are retained separately at `/workspace/wallace-evidence-gaps-02/`; that workspace path is not a permanent public archive URL. The source download includes those retained files. `retrieval-sources.json` and `retrieve.py` allow fresh retrievals to a new directory; a later retrieval may differ and must not overwrite the retained version.

Run from the repository root:

```sh
python3 research/wallace-index/evidence-gaps-02/validate.py
python3 research/wallace-index/evidence-gaps-02/validate.py --evidence /workspace/wallace-evidence-gaps-02
```

The validator checks integrity and consistency, not political claim truth. No CMS record, public route, production branch or deployment has changed.
