# Democracy Direction Index Import Schema

This document describes the current production import schema for the RETHINKK Democracy Direction Index desk flow.

JSON is the primary research import format. CSV remains supported for quick review, score bulk editing and export.

## Format Detection

AUTO mode detects the import format from the first non-whitespace character.

- `[` or `{`: JSON
- anything else: CSV

JSON imports may be either an array of assessment records or an object with an `assessments` array.

## Core Rule

Annual assessment records should reference a country by `iso3`.

Country name, ISO2, region, latitude and longitude are permanent country metadata. They are derived from ISO3 when the country exists in the metadata table. The legacy fields remain accepted for backward compatibility when metadata does not yet exist.

Historical comparison fields are derived by matching the same ISO3 country in the previous published edition. They should not be supplied by annual research imports.

## Assessment Fields

| Field | Type | Required | Accepted values / validation | Purpose |
| --- | --- | --- | --- | --- |
| `iso3` | string | yes | non-empty; uppercased | Permanent country identifier and metadata lookup key. |
| `country` / `countryName` | string | fallback only | required only when ISO3 is not yet present in metadata | Backward-compatible display name input. |
| `iso2` | string | fallback only | required only when ISO3 is not yet present in metadata | Backward-compatible compact country code. |
| `region` | enum | fallback only | `Europe`, `North America`, `Latin America & Caribbean`, `Africa`, `Middle East`, `Asia`, `Oceania` | Backward-compatible regional metadata. |
| `latitude` | number | fallback only | numeric; derived from metadata when available | Backward-compatible map position. |
| `longitude` | number | fallback only | numeric; derived from metadata when available | Backward-compatible map position. |
| `year` | number | optional | numeric; defaults to import edition year | Annual edition year. |
| `status` | enum | yes | `resilient`, `erosion`, `autocratic`, `not_assessed` | Institutional condition today. |
| `direction` | enum | yes | `improving`, `stable`, `deteriorating` | Direction of institutional movement. |
| `velocity` | enum | yes | `rapid`, `normal`, `limited` | Speed of institutional movement. |
| `overallInstitutionalScore` / `overall_score` | number/null | optional | if present: `5-25` | Overall institutional score. Supports, but does not determine, status. |
| `judicialIndependence` / `judicial_independence` | number/null | optional | if present: `1-5` | Judicial independence dimension. |
| `judicialIndependenceRationale` / `judicial_independence_rationale` | string | required if published and score is present | non-empty for published scored records | Historical rationale for the judicial score. |
| `mediaFreedom` / `media_freedom` | number/null | optional | if present: `1-5` | Media freedom dimension. |
| `mediaFreedomRationale` / `media_freedom_rationale` | string | required if published and score is present | non-empty for published scored records | Historical rationale for the media score. |
| `electoralIntegrity` / `electoral_integrity` | number/null | optional | if present: `1-5` | Electoral integrity dimension. |
| `electoralIntegrityRationale` / `electoral_integrity_rationale` | string | required if published and score is present | non-empty for published scored records | Historical rationale for the electoral score. |
| `civicSpace` / `civic_space` | number/null | optional | if present: `1-5` | Civic space and human rights dimension. |
| `civicSpaceRationale` / `civic_space_rationale` | string | required if published and score is present | non-empty for published scored records | Historical rationale for the civic space score. |
| `checksAndBalances` / `checks_balances` | number/null | optional | if present: `1-5` | Checks and balances dimension. |
| `checksAndBalancesRationale` / `checks_balances_rationale` | string | required if published and score is present | non-empty for published scored records | Historical rationale for the checks score. |
| `confidence` | enum | yes | `high`, `medium`, `low` | Evidence quality and assessment certainty. Not democratic quality. |
| `assessmentStatus` / `assessment_status` | enum | optional | `draft`, `review`, `approved`, `published`; defaults to `review` | Editorial workflow state. |
| `shortRationale` / `short_rationale` | string | yes | non-empty | Compact summary used in map/list/API contexts. |
| `trajectoryAnalysis` / `trajectory_analysis` | string | optional; required if published | defaults to working placeholder for non-published imports | Descriptive analysis of where the country is moving. |
| `whatChanged` / `what_changed` | string | optional | defaults to working placeholder | Factual account of material developments. |
| `assessment` | string | optional | defaults to working placeholder | RETHINKK interpretation and conclusion. |
| `sources` | array | required if published | JSON only, or CSV via `sources_json` | Structured evidence sources. |
| `sources_json` | JSON string | CSV only | must parse to a source array | CSV bridge for structured sources. |
| `reviewedBy` / `reviewed_by` | string | optional | defaults to `RETHINKK Desk` | Reviewer attribution. |
| `reviewedAt` / `reviewed_at` | string | optional | defaults to import date | Review date. |

## Derived Fields

The following fields are calculated output fields and should not be supplied by annual imports:

| Field | Derivation |
| --- | --- |
| `id` | `ddi-{year}-{iso3 lowercase}` |
| `indexEditionId` | `ddi-{year}` |
| `countryName` | derived from country metadata when ISO3 is known |
| `slug` | derived from country metadata or fallback country name |
| `iso2` | derived from country metadata when ISO3 is known |
| `region` | derived from country metadata when ISO3 is known |
| `latitude` | derived from country metadata when ISO3 is known |
| `longitude` | derived from country metadata when ISO3 is known |
| `previousYearStatus` | same ISO3 in previous published edition |
| `previousYearScore` | same ISO3 in previous published edition |
| `scoreChange` | current score minus previous published score |

## Source Fields

Each source must include:

| Field | Type | Required | Accepted values / validation | Purpose |
| --- | --- | --- | --- | --- |
| `organisation` | string | yes | non-empty | Source organisation. |
| `title` | string | yes | non-empty | Source publication/title. |
| `url` / `URL` | string | yes | non-empty | Source link. |
| `publicationDate` / `publication_date` | string | yes | non-empty date-like string | Source publication date. |
| `sourceType` / `source_type` | enum | yes | `primary`, `official`, `academic`, `ngo`, `research`, `legal`, `media` | Evidence category. |
| `note` | string | optional | any text | Source note. |
| `supports` | array/string | optional | `judicialIndependence`, `mediaFreedom`, `electoralIntegrity`, `civicSpace`, `checksAndBalances` | Dimensions supported by this source. CSV strings may use `;` or `|` separators. |

Published assessments must contain at least one genuine imported or manually entered source. Placeholder sources are no longer generated.

## Complete Valid JSON Example

```json
{
  "iso3": "NLD",
  "year": 2026,
  "status": "resilient",
  "direction": "stable",
  "velocity": "limited",
  "overallInstitutionalScore": 21,
  "judicialIndependence": 5,
  "judicialIndependenceRationale": "Courts remain institutionally independent in the reviewed period.",
  "mediaFreedom": 4,
  "mediaFreedomRationale": "Media pluralism remains strong, while media economics and public trust remain pressure points.",
  "electoralIntegrity": 4,
  "electoralIntegrityRationale": "Election administration remains reliable and broadly trusted.",
  "civicSpace": 4,
  "civicSpaceRationale": "Civic space remains open, with administrative responsiveness as a relevant watchpoint.",
  "checksAndBalances": 4,
  "checksAndBalancesRationale": "Checks remain functional, although coalition fragmentation can slow accountability.",
  "confidence": "medium",
  "assessmentStatus": "published",
  "shortRationale": "Institutions remain broadly resilient, with visible pressure around trust, formation politics and administrative capacity.",
  "trajectoryAnalysis": "The Dutch democratic system is not moving through a dramatic institutional rupture. The more relevant observation is slower: high baseline resilience is being tested by administrative fragmentation, low-trust political cycles and pressure on the state's capacity to execute decisions cleanly.",
  "whatChanged": "No single rupture is identified during the review period. The relevant signal is cumulative institutional strain rather than collapse.",
  "assessment": "RETHINKK assesses the Netherlands as resilient and stable. The score supports this view but does not automatically determine it.",
  "reviewedBy": "RETHINKK Research",
  "reviewedAt": "2026-08-30",
  "sources": [
    {
      "organisation": "V-Dem Institute",
      "title": "Democracy Report 2026",
      "url": "https://www.v-dem.net/",
      "publicationDate": "2026-03-17",
      "sourceType": "research",
      "note": "Evidence input; final status remains a RETHINKK assessment.",
      "supports": ["judicialIndependence", "electoralIntegrity", "checksAndBalances"]
    },
    {
      "organisation": "Freedom House",
      "title": "Freedom in the World 2026 - Netherlands",
      "url": "https://freedomhouse.org/",
      "publicationDate": "2026-03-01",
      "sourceType": "research",
      "supports": ["mediaFreedom", "civicSpace"]
    }
  ]
}
```

## Complete Valid CSV Example

```csv
iso3,year,status,direction,velocity,overall_score,judicial_independence,judicial_independence_rationale,media_freedom,media_freedom_rationale,electoral_integrity,electoral_integrity_rationale,civic_space,civic_space_rationale,checks_balances,checks_balances_rationale,confidence,assessment_status,short_rationale,trajectory_analysis,what_changed,assessment,sources_json
NLD,2026,resilient,stable,limited,21,5,"Courts remain institutionally independent in the reviewed period.",4,"Media pluralism remains strong, while media economics and public trust remain pressure points.",4,"Election administration remains reliable and broadly trusted.",4,"Civic space remains open, with administrative responsiveness as a relevant watchpoint.",4,"Checks remain functional, although coalition fragmentation can slow accountability.",medium,published,"Institutions remain broadly resilient.","The Dutch democratic system is not moving through a dramatic institutional rupture.","No single rupture is identified during the review period.","RETHINKK assesses the Netherlands as resilient and stable.","[{""organisation"":""V-Dem Institute"",""title"":""Democracy Report 2026"",""url"":""https://www.v-dem.net/"",""publicationDate"":""2026-03-17"",""sourceType"":""research"",""supports"":[""judicialIndependence"",""electoralIntegrity"",""checksAndBalances""]}]"
```
