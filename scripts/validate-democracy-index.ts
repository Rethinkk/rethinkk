import assert from "node:assert/strict";
import {
  democracyDirectionEditions,
  getDirectionSymbol,
  getEdition,
  getLatestPublishedEdition,
  groupCountriesByDirection,
  serializeEdition,
  validateAssessment
} from "../lib/democracy-index.ts";

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
assert.equal(serialized.assessments.length, edition.assessments.filter((country) => country.assessmentStatus === "published").length);
assert.ok(serialized.assessments.every((country) => !("assessment" in country)), "API summary should not ship long assessment text");

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

console.log("Democracy Direction Index validation passed.");
