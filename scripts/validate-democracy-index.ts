import assert from "node:assert/strict";
import {
  democracyDirectionEditions,
  getDirectionSymbol,
  getEdition,
  getLatestPublishedEdition,
  groupCountriesByDirection,
  serializeEdition,
  deriveHistoricalComparison,
  isVisibleAssessment,
  validateAssessment
} from "../lib/democracy-index.ts";
import { parseDemocracyImport, sampleDemocracyCsv } from "../lib/democracy-import.ts";

const latest = getLatestPublishedEdition();
assert.equal(latest?.year, 2026, "latest published edition should be 2026");

const edition = getEdition(2026);
assert.ok(edition, "2026 edition must exist");
assert.equal(edition.status, "published");

for (const country of edition.assessments) {
  assert.deepEqual(validateAssessment(country), [], `${country.countryName} should validate`);
}

assert.equal(getDirectionSymbol("deteriorating", "rapid"), "↓↓");
assert.equal(getDirectionSymbol("deteriorating", "normal"), "↓");
assert.equal(getDirectionSymbol("improving", "rapid"), "↑↑");
assert.equal(getDirectionSymbol("stable", "limited"), "→");

const grouped = groupCountriesByDirection(edition.assessments);
assert.equal(grouped.deteriorating[0].velocity, "rapid", "rapid movement should sort first");
assert.ok(grouped.improving.some((country) => country.slug === "poland"), "improving countries should be grouped");

const serialized = serializeEdition(edition);
assert.equal(edition.assessments.length, 197, "global review import should contain 197 country assessments");
assert.equal(serialized.assessments.length, edition.assessments.filter(isVisibleAssessment).length);
assert.ok(serialized.assessments.every((country) => "sources" in country), "serialized output should include evidence sources");
assert.ok(serialized.assessments.every((country) => "mediaFreedomRationale" in country), "serialized output should include dimension rationales");

const immutableSnapshot = JSON.stringify(democracyDirectionEditions.find((item) => item.year === 2026));
const duplicatedBaseline = structuredClone(edition);
duplicatedBaseline.id = "ddi-2027";
duplicatedBaseline.year = 2027;
duplicatedBaseline.assessments = duplicatedBaseline.assessments.map((country) => ({
  ...country,
  id: country.id.replace("2026", "2027"),
  indexEditionId: "ddi-2027",
  year: 2027,
  assessmentStatus: "draft"
}));
assert.equal(JSON.stringify(democracyDirectionEditions.find((item) => item.year === 2026)), immutableSnapshot, "duplicating a future baseline must not mutate 2026");

const importPreview = parseDemocracyImport(sampleDemocracyCsv, "csv", 2026);
assert.equal(importPreview.accepted.length, 1, "sample CSV should produce one accepted record");
assert.equal(importPreview.rejected.length, 0, "sample CSV should not produce rejected records");
assert.ok(importPreview.normalizedJson.includes("\"countryName\": \"Netherlands\""), "normalized JSON should preserve country name");

const invalidImport = parseDemocracyImport("country,iso2,iso3,year,status,direction,velocity,confidence,short_rationale\nTest,TT,TST,2026,wrong,sideways,fast,maybe,", "csv", 2026);
assert.equal(invalidImport.accepted.length, 0, "invalid import should not be accepted");
assert.ok(invalidImport.rejected[0].errors.length >= 4, "invalid import should explain validation failures");
assert.ok(edition.assessments.every((country) => country.trajectoryAnalysis.length > 40), "published records require descriptive trajectory analysis");
assert.ok(importPreview.normalizedJson.includes("trajectoryAnalysis"), "normalized JSON should include trajectory analysis");
assert.ok(edition.assessments.every((country) => country.sources.every((source) => source.supports && source.supports.length > 0)), "seed sources should declare supported dimensions");

const publishedWithoutSources = parseDemocracyImport(JSON.stringify({
  iso3: "NLD",
  year: 2026,
  status: "resilient",
  direction: "stable",
  velocity: "limited",
  overallInstitutionalScore: 21,
  judicialIndependence: 5,
  judicialIndependenceRationale: "Courts remain independent.",
  mediaFreedom: 4,
  mediaFreedomRationale: "Media pluralism remains strong.",
  electoralIntegrity: 4,
  electoralIntegrityRationale: "Election administration remains reliable.",
  civicSpace: 4,
  civicSpaceRationale: "Civic space remains open.",
  checksAndBalances: 4,
  checksAndBalancesRationale: "Checks remain functional.",
  confidence: "medium",
  assessmentStatus: "published",
  shortRationale: "Institutions remain resilient.",
  trajectoryAnalysis: "Movement is stable, while administrative capacity and political trust require monitoring.",
  whatChanged: "No material rupture identified.",
  assessment: "RETHINKK assessment text."
}), "json", 2026);
assert.equal(publishedWithoutSources.accepted.length, 0, "published imports without genuine sources should fail");

const publishedWithSources = parseDemocracyImport(JSON.stringify({
  iso3: "NLD",
  year: 2026,
  status: "resilient",
  direction: "stable",
  velocity: "limited",
  overallInstitutionalScore: 21,
  judicialIndependence: 5,
  judicialIndependenceRationale: "Courts remain independent.",
  mediaFreedom: 4,
  mediaFreedomRationale: "Media pluralism remains strong.",
  electoralIntegrity: 4,
  electoralIntegrityRationale: "Election administration remains reliable.",
  civicSpace: 4,
  civicSpaceRationale: "Civic space remains open.",
  checksAndBalances: 4,
  checksAndBalancesRationale: "Checks remain functional.",
  confidence: "medium",
  assessmentStatus: "published",
  shortRationale: "Institutions remain resilient.",
  trajectoryAnalysis: "Movement is stable, while administrative capacity and political trust require monitoring.",
  whatChanged: "No material rupture identified.",
  assessment: "RETHINKK assessment text.",
  previousYearScore: 99,
  sources: [{
    organisation: "V-Dem Institute",
    title: "Democracy Report 2026",
    URL: "https://www.v-dem.net/",
    publicationDate: "2026-03-17",
    sourceType: "research",
    supports: ["mediaFreedom", "checksAndBalances"]
  }]
}), "json", 2026);
assert.equal(publishedWithSources.accepted.length, 1, "published imports with genuine sources should pass");
assert.equal(publishedWithSources.accepted[0].countryName, "Netherlands", "country metadata should be derived from ISO3");
assert.equal(publishedWithSources.accepted[0].latitude, 52.5, "geography should be derived from permanent metadata");
assert.equal(publishedWithSources.accepted[0].previousYearScore, null, "supplied previousYearScore should be ignored");
assert.deepEqual(deriveHistoricalComparison(publishedWithSources.accepted[0]), { previousYearStatus: null, previousYearScore: null, scoreChange: null });

console.log("Democracy Direction Index validation passed.");
