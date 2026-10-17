# The Wallace Index — historical research recovery

**Research Recovery Assignment 01 · 17 October 2026 · Recovered for editorial review only**

## Finding

The accessible legacy repository contains numerical prototype comparisons for **Keir Starmer and Boris Johnson**, but no substantive written assessment rationales, research citations, assessment periods, explicit scoring rubric or stated overall totals. The recovery preserves these artefacts as historical material; it does not establish their political accuracy, original research quality or suitability for publication.

Every recovered assessment carries the label: **“Recovered legacy prototype — not an approved RETHINKK assessment.”** None has been imported into the CMS, approved or published on the website.

## Coverage

The audit used a full Git mirror of [Rethinkk/wallace-index](https://github.com/Rethinkk/wallace-index), inspecting all locally reachable commits and every unique file/blob combination. The remote advertised one branch, `main`, at `575c05c2d3fe8ffb337685e2f368ee1a49359270`, and no tags or other references. A GitHub branch listing corroborated the branch inventory. The connector's tags endpoint was unsupported; the complete remote Git reference listing was used instead.

| Item | Recovered coverage |
| --- | --- |
| Reachable commits | 34 |
| Earliest authored timestamp | 26 June 2025, 10:47:20 +02:00 |
| Latest authored timestamp | 1 August 2025, 14:51:30 +02:00 |
| Unique historical paths | 5 |
| Unique file versions, preserved byte for byte | 25 |
| Deletion events | 13 |
| Leaders | 2 |
| Distinct complete six-dimension value variants | 5 |
| Distinct partial three-dimension displays | 2 |
| Historical dimension-label families | 2 |
| Score observations across file versions and representations | 26 |
| Original substantive rationales or supporting research references | 0 found |

The five historical paths are `README.md`, `index.html`, `charts.js`, `style.css` and `wallace_starmer_vs_boris.svg`. There are no JSON, CSV, separate research notes or methodology documents in the inspected history. Commit messages describe uploads, edits and deletions; none explains the leadership scores. A local `git fsck --full --no-reflogs` on the legacy mirror reported no additional unreachable material or integrity errors.

This coverage excludes inaccessible deleted branches, server-side reflogs, objects no longer offered by GitHub, external drafts, private conversations and files never committed. Their absence cannot be established by a fresh clone. The full commit inventory and file-version occurrences are in the source manifest.

## Leader identity and missing context

The full display names “Keir Starmer” and “Boris Johnson” appear in the original HTML and radar-chart dataset. Later chart objects use surname aliases. They are linked through the paired profiles and matching chart references, without adding external biographical claims.

The shared original heading says “Wallace Index – UK Leadership Profiles”, supporting **UK as the recorded geographic context**. Neither leader has an individual country field, an explicit political-office field, a full legal-name field or a dated assessment period. Those missing fields remain null rather than being reconstructed from general knowledge.

Git author/committer timestamps establish when an artefact entered the accessible history, not when an assessment was conducted. The SVG's generation timestamp, `2025-08-01T10:47:52.519788`, has no timezone and is not treated as an assessment date.

## Recovered numerical material

The following sums are **new arithmetic calculations made during recovery**, not original stated totals. No historical denominator is established. They must not be presented as scores out of 18, 60 or any other maximum.

### Family A: six names matching the current dimensions

Original order: **People, Process, Policy, Crisis, Humility, Service**.

| Leader | Original values in that order | Calculated sum | Recovery record |
| --- | --- | --- | --- |
| Keir Starmer | 2, 3, 2, 2, 2, 3 | 14 | legacy-assessment-001 |
| Boris Johnson | 1, 0, 2, 1, 0, 1 | 5 | legacy-assessment-002 |

The first literal HTML scores are in [commit 872cd21](https://github.com/Rethinkk/wallace-index/blob/872cd21c0120b9f9b07c17093c07193ca971a1fc/index.html). The same values recur in [the original radar-chart arrays](https://github.com/Rethinkk/wallace-index/blob/6954aa5b9a79be162a408a209e99a72d402157ac/charts.js) and several later HTML versions. Repeated copies are retained as provenance, not counted as independent research.

Although the labels match today's model and the observed numbers lie between 0 and 3, **the historical scale is not explicitly documented**. The original minimum, maximum, descriptors, evidence requirements and methodology version therefore remain null.

### Family B: alternative labels and larger values

Original full order: **Service to People, Integrity, Policy over Popularity, Crisis Management, Humility, Process Orientation**.

| Leader / variant | Original values in that order | Calculated sum | Recovery record |
| --- | --- | --- | --- |
| Keir Starmer | 9, 8, 7, 6, 6, 8 | 44 | legacy-assessment-005 |
| Boris Johnson, earlier full dataset | 5, 3, 2, 2, 1, 2 | 15 | legacy-assessment-006 |
| Boris Johnson, later full dataset | 5, 3, 2, 3, 2, 2 | 17 | legacy-assessment-007 |

The earlier full alternative dataset is preserved in [commit c01cb3c](https://github.com/Rethinkk/wallace-index/blob/c01cb3c3c3b6ce386b169c44dd4961317339b100/charts.js). In [commit f2ae24f](https://github.com/Rethinkk/wallace-index/blob/f2ae24fbedf6f94328c88ec1d7aa097bed06f2b6/charts.js), Johnson's **Crisis Management changes from 2 to 3** and **Humility from 1 to 2**. The commit message supplies no reason. Later JavaScript retains those changed values.

A [partial inline SVG display](https://github.com/Rethinkk/wallace-index/blob/719d8ccadd602d56298d8318ca4aa48080636662/index.html) explicitly labels only the first three categories:

| Leader | Recorded labels | Original values | Partial arithmetic sum | Recovery record |
| --- | --- | --- | --- | --- |
| Starmer | Service to People; Integrity; Policy over Popularity | 9, 8, 7 | 24 | legacy-assessment-003 |
| Johnson | Service to People; Integrity; Policy over Popularity | 5, 3, 2 | 10 | legacy-assessment-004 |

The missing three dimensions are not filled from another file. These are partial display variants within Family B, not proof of a separate three-dimension methodology. Their sums are not complete assessment totals.

The alternative terminology appears **later** than the first canonical-label scores in accessible Git history. It is not established as an earlier methodological predecessor. Its maximum and intended scale remain unknown; observing a 9 does not establish a 0–10 scale. No label mapping or score normalisation has been made.

## Deleted visual evidence

The deleted `wallace_starmer_vs_boris.svg` survives in Git history at blob `4c4549574b5204440fb5890083d3eaf344da218f`. It was first added in [commit 96aa910](https://github.com/Rethinkk/wallace-index/blob/96aa910eb8dee39f5b003dca9c1a696e92beeff2/wallace_starmer_vs_boris.svg), deleted, re-added with the same blob and deleted again. An HTML version also embeds the SVG directly. Both representations are preserved.

Its original text comments identify the six canonical labels, both leaders and a **0–4 display axis**. The bar values are not literal numerical annotations. Recovery infers them from the y-axis geometry and legend: zero at y=389.94, with 90.225 SVG coordinate units per score unit. Values agree with the separately preserved literal canonical arrays, including Johnson's two zero-height bars. Numerical residuals before integer recovery are below 0.000001.

The extraction method and uncertainty are explicit in the JSON. These geometric observations are supporting representations of the same recovered vectors, not new independent assessments. The display axis does not establish a scoring maximum or override the unknown historical rubric.

## Reasoning, references and conflicts

No substantive original written reasoning was found. The generic sentence “This is a comparison between Keir Starmer and Boris Johnson based on Wallace principles.” is retained as interface text, not promoted to a rationale. No retrospective justification has been generated.

All external links found refer to Chart.js, Matplotlib or XML/SVG/RDF format namespaces. They are classified as technical references, not evidence supporting leadership judgements.

Three issues require editorial review:

1. Johnson's two numerical changes within the alternative dataset have no documented explanation.
2. At the inspected head, `index.html` still contains Family A scores while its linked `charts.js` contains Family B labels and numbers. Both coexist; neither is selected as an authoritative approved assessment.
3. The recovered graphic's 0–4 display axis and undocumented scoring scale must not be conflated with the current 0–3 methodology.

One intermediate JavaScript version also contains malformed rendering code. Its literal dataset is recoverable, but no claim is made that it successfully rendered. The recovery script reads literals and XML; it does not execute the legacy JavaScript.

## Provisional import comparison: pending

Neither `wallace_index_poc_legacy_import.json` nor `wallace_index_poc_legacy_import.csv` was supplied or located. Searches covered the accessible legacy history, the fetched main-project references/history and workspace filenames, including attachments. The pasted assignment refers to these names but does not contain the data files.

`wallace-legacy-import-comparison.csv` contains two explicit pending-file records. No import values, matches, discrepancies or additional leaders have been invented. Actual reconciliation requires the two files. Clear repository provenance should guide that comparison, while preserving any conflicting import values for review.

## Validation and next editorial step

`validation-summary.json` records successful checks of all 25 preserved file byte lengths, SHA-256 checksums and original Git blob hashes; commit/source references; all 26 original excerpts; arithmetic sums; seven distinct vectors; and reconciliation of all 36 CSV dimension rows with JSON. Historical stated totals, maximums, rationales and current-model totals remain unset. Validation establishes archive fidelity, not factual validity of the prototype judgements.

Retain this archive as a provenance reference. Obtain the missing provisional imports and any original research notes held outside Git. Editors should determine the intended historical scale, period and reasons for changed values. Any eventual official assessment requires fresh source collection, written dimension rationales, approved methodology, independent review and publisher approval.

The archive is deliberately outside public website assets and is not referenced by public pages or the database seed/import workflow. If separately authorised, it could inform clearly labelled CMS research drafts with historical attachments. Alternative scales must remain historical metadata rather than being forced into current 0–3 score fields. No CMS migration, legacy-repository retirement or production deployment was performed.
