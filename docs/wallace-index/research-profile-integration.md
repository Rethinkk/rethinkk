# Qualitative research profiles in The Wallace Index

Five research profiles are now available in the existing native chapter. This
implements the owner's request to make incomplete research readable, including
an explicit Service limitation for Olaf Scholz. It does not approve a rubric,
assign scores, certify independent review or release an assessment edition.

## Reading and reviewing

- `/wallace-index/explore?research=1`: five searchable, filterable profiles.
- `/wallace-index/leaders/olaf-scholz?research=1`: Scholz's six dimensions,
  supporting, adverse and qualifying evidence, with the Service caveat.
- `/wallace-index/compare?research=1&leaders=olaf-scholz,barack-obama`:
  shareable qualitative comparison; select two to four from the explorer.
- `/wallace-index/sources?research=1`: only the references actually cited in
  these profiles and their verified chronology records.
- `/api/wallace-index/research`: downloadable public research JSON.
- `/wallace-index/assess`: the five leaders can be selected for an independent
  browser assessment. No official score comparison is implied.

The chapter landing page and existing search/archive discovery feed link to
these profiles. Discovery entries explicitly say “Research draft”; their public
content status does not represent approval of an official Assessment.

## Provenance and publication boundaries

`lib/wallace-index/research.ts` projects the existing immutable research packet
`research/wallace-index/evidence-gaps-02/updated-register.json` into public
fields. No second editable dataset or duplicate CMS is introduced. It checks
that all six dimensions remain unscored and each linked claim has a source.
Original judgements, counterevidence, uncertainties and withholding reasons are
preserved. Only cited sources are exposed, excluding quarantined leads such as
NKS07. Original source links, dates, passage references and source limitations
remain available. The recoverable prototype scores are not used.

These are explicitly ResearchProfiles, not PublicAssessments or Editions. The
existing database workflow, server-side roles, independent reviewer requirements,
approved rubric checks, complete-score requirements and edition snapshots are
unchanged. Research drafts work without a database connection; official editions
retain their existing database-backed workflow. A selected historical edition or
demonstration never receives research drafts mixed into its snapshot.

When an official profile exists, its canonical route takes precedence; the
`research=1` link continues to identify the research draft. New official scores
must be prepared and approved through the existing desk. Updates to this archival
research presentation require a documented successor research packet and reviewed
code change until its content is migrated through that desk. This is not a new
routine editorial publishing system.

Scholz's Service caveat explicitly says that missing evidence about management of
competing interests is not a finding of misconduct. Missing scores are never
rendered as zero, bars or a complete total. Other profiles also retain their
whole-period evidence limitations. Internal checking is attributed to the same
research assistant; independent review remains pending.

## Validation

Run TypeScript, lint, the existing model tests, `research.test.ts`, the production
build and browser tests. Browser coverage includes the real research explorer,
comparison, Scholz profile, source record and visitor tool, with axe checks and
overflow checks at 320, 768 and 1280 pixels. No production deployment is authorised
by this integration.

Integration checks completed on 17 October 2026: production build and TypeScript,
scoped ESLint, existing eight model checks plus two research-projection checks,
all eight browser tests (including axe/responsive checks at three widths), DDI
validation, the research-packet validator and `git diff --check` passed. Browser
tests used the installed system Chromium via a temporary local configuration;
that configuration is not shipped. No database schema or publishing logic changed.

## Current-results view (17 October 2026)

Following the owner's request to see the index using current results, the four
conditional numerical candidates in `score-proposals-01/score-proposals.json`
are displayed in the native landing-page table, filtered explorer, leader
profiles and comparisons. Each is explicitly labelled “conditional proposal”,
not an official or approved whole-period rating. The other 26 dimensions remain
unassessed. All totals remain absent; numeric ranking remains unavailable.
Profiles and comparisons show the rationale and unresolved acceptance conditions;
profiles also explain adjacent scores and retain prior evidence limitations.
Scholz's Service caveat is unchanged.

The public research export is now `wallace-qualitative-research-2` with a nullable
`proposal` object for each dimension and an explicit proposal-packet origin. The
object contains the suggested number, descriptor, reasoning, alternatives and
conditions. `officialScoresAssigned`, `methodologyApproved` and
`independentReviewCompleted` remain false. Official edition exports, CMS scoring,
reviewer roles and publication validation are unchanged. The immutable original
research and proposal packets are not rewritten to claim approval.
