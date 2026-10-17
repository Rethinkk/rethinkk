import test from "node:test";
import assert from "node:assert/strict";
import {
  researchProfiles,
  researchSources,
  researchSnapshot,
  scholzServiceCaveat,
} from "../../lib/wallace-index/research";
import { dimensions } from "../../lib/wallace-index/model";

test("All five unscored research profiles retain complete claim-to-source links", () => {
  assert.equal(researchProfiles.length, 5);
  assert.equal(new Set(researchProfiles.map((p) => p.id)).size, 5);
  const sources = new Set(researchSources.map((s) => s.id));
  for (const p of researchProfiles) {
    assert.deepEqual(
      p.dimensions.map((d) => d.dimension),
      [...dimensions],
    );
    for (const id of p.chronologySourceIds) assert.ok(sources.has(id));
    for (const d of p.dimensions) {
      assert.ok(d.judgement && d.uncertainties && d.withholdingReason);
      for (const claim of [...d.supporting, ...d.adverse, ...d.qualifying]) {
        assert.ok(sources.has(claim.sourceId), claim.id);
        assert.ok(claim.locator && claim.text && claim.date);
      }
    }
  }
  assert.equal(researchSnapshot.officialScoresAssigned, false);
  assert.equal(researchSnapshot.methodologyApproved, false);
  assert.equal(researchSnapshot.independentReviewCompleted, false);
  assert.ok(!("editions" in researchSnapshot));
  assert.ok(!("assessments" in researchSnapshot));
});
test("Scholz Service limitation remains visible without assigning zero or implying misconduct", () => {
  const scholz = researchProfiles.find((p) => p.id === "olaf-scholz")!;
  assert.equal(
    scholz.dimensions.find((d) => d.dimension === "service")!.caveat,
    scholzServiceCaveat,
  );
  assert.match(scholzServiceCaveat, /not a finding of misconduct/);
  assert.match(scholzServiceCaveat, /No score has been assigned/);
  assert.ok(!researchSources.some((s) => s.id === "NKS07"));
});

test("Only the four documented conditional proposals are exposed; other dimensions stay unassessed", () => {
  const found = researchProfiles.flatMap((p) =>
    p.dimensions
      .filter((d) => d.proposal)
      .map((d) => [p.id, d.dimension, d.proposal!.score]),
  );
  assert.deepEqual(found, [
    ["boris-johnson", "process", 1],
    ["boris-johnson", "humility", 1],
    ["barack-obama", "humility", 2],
    ["olaf-scholz", "process", 1],
  ]);
  assert.equal(
    researchProfiles
      .flatMap((p) => p.dimensions)
      .filter((d) => d.proposal === null).length,
    26,
  );
  for (const p of researchProfiles)
    for (const d of p.dimensions)
      if (d.proposal) {
        assert.ok(
          d.proposal.rationale &&
            d.proposal.adjacentDescriptors &&
            d.proposal.conditions &&
            d.proposal.changeFromPrior,
        );
      }
  assert.equal(researchSnapshot.officialScoresAssigned, false);
});
