# The Wallace Index — score proposals for editorial review

17 October 2026 | Proposed rubric 1.0 | **Not for official publication**

This packet answers the owner's request to prepare reasoned score proposals.
It contains **four conditional numerical candidates and 26 withheld dimensions**.
It does **not** say that four complete-period evidence gaps have been resolved.
All earlier insufficiency findings remain visible. Each candidate exposes the
interpretation and coverage decision a human reviewer must resolve before the
number can become an accepted assessment.

| Leader | People | Process | Policy | Crisis | Humility | Service |
| --- | --- | --- | --- | --- | --- | --- |
| [Boris Johnson](profiles/boris-johnson.md) | — | **1*** | — | — | **1*** | — |
| [Keir Starmer](profiles/keir-starmer.md) | — | — | — | — | — | — |
| [Andy Burnham](profiles/andy-burnham.md) | — | — | — | — | — | — |
| [Barack Obama](profiles/barack-obama.md) | — | — | — | — | **2*** | — |
| [Olaf Scholz](profiles/olaf-scholz.md) | — | **1*** | — | — | — | **—†** |

**\*** Conditional editorial proposal, not an approved score. **—** Unassessed;
never a zero. **†** Scholz Service: insufficient decision-level evidence; no
finding of misconduct. No leader has a complete total.

## Why only four numbers?

A score of 1 must describe documented limited or inconsistent conduct, not simply
a poorly researched leader. A score of 2 needs substantive evidence of relevant
behaviour; a few favourable quotations do not establish it. A score of 3 cannot
be inferred from an absence of contrary cases. A score of 0 is an adverse
assessment, not a missing-data value.

The four candidates allow specific descriptor questions to be reviewed using
attributable observations: Johnson's adverse institutional findings and qualified
acknowledgements, Obama's cross-domain acceptance of responsibility, and Scholz's
mixed constitutional record. They still require the explicit conditions in the
profiles, including period coverage and responsibility allocation. The evidence
does not yet support treating them as accepted whole-period ratings.

The other 26 dimensions are individually explained, with supporting evidence,
counterevidence, source limitations and the research needed. In particular,
documented donations for Burnham and the Nobel transfer for Obama do not prove
consistent interests management throughout office. Filling the earlier seven
case-evidence gaps did not establish seven period-wide scores.

## Read and decide

1. Read [the proposed rubric](../../../lib/wallace-index/methodology.ts),
   [the editorial decisions](editorial-decisions.md), then each linked profile.
2. Compare the candidate with the adjacent descriptors and its contrary evidence.
3. Record **accept, amend or withhold**, with reasons, in the review template.
   A number stays conditional while its material coverage or attribution issue
   remains unresolved. Approving the rubric alone does not resolve those issues.
4. Keep independent review and publisher approval separate. This packet is the
   same assistant's internal work, not a second independent assessment.

The live index is unchanged. No CMS import, official score, approved methodology,
edition release or production deployment is part of this packet.

## Files and provenance

- [Five profiles](profiles/): dimension-by-dimension rationale, adjacent-score
  analysis, evidence, counterevidence and human decisions still pending.
- [Machine-readable proposal packet](score-proposals.json): all 30 dispositions,
  four conditional candidates, 75 linked claims and 78 referenced sources.
- [Review table / CSV](score-proposals.csv).
- [Editorial decisions and review template](editorial-decisions.md).
- [Local passage-check ledger](passage-checks.json): passages reread for the
  candidates, with exact extract and checksum of the previously retrieved text.
- [Validator](validate.py): checks provenance, references, scores, CSV parity,
  retained prior limitations and absence of totals or approvals.

The base is `../evidence-gaps-02/updated-register.json`, retained unchanged and
identified by SHA-256 in the packet. Source and claim objects are copied without
alteration; no new factual claim, fresh internet verification or additional
independent research source is asserted. The local passage checks verify the
retained extracts, not a fresh copy of the live source. Earlier corrections,
including Geidt's maintained narrow no-conflict finding, PCLOB separate statements
and the quarantined code PDF, remain in force.

Run `python3 research/wallace-index/score-proposals-01/validate.py` from the
repository root. This is a research-document change; no app build is required.
