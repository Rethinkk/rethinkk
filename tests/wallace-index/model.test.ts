import test from "node:test";
import assert from "node:assert/strict";
import {
  blankScores,
  total,
  transition,
  publicAssessment,
  Assessment,
  validateAssessment,
} from "../../lib/wallace-index/model";
import { demoEdition } from "../../lib/wallace-index/demo";
import { proposedMethodology } from "../../lib/wallace-index/methodology";
import {
  assessmentInput,
  canonicalReference,
  importSchema,
} from "../../lib/wallace-index/validation";
import { csvCell } from "../../lib/wallace-index/export";
import { digest } from "../../lib/wallace-index/editorial";
import { checkOrigin, limitedJson } from "../../lib/wallace-index/http";
test("Missing evidence is distinct from a zero and cannot produce a complete total", () => {
  assert.equal(total(blankScores()), null);
  const scores = blankScores().map((s) => ({ ...s, score: 0 as const }));
  assert.equal(total(scores), 0);
  assert.equal(total(scores.slice(1)), null);
  assert.equal(total([...scores.slice(1), scores[1]]), null);
  assert.equal(total(scores.map((s) => ({ ...s, score: 3 }))), 18);
  assert.equal(
    total(
      scores.map((s) => ({ ...s, score: 4 })) as unknown as Parameters<
        typeof total
      >[0],
    ),
    null,
  );
});
const fixture = () =>
  ({
    ...demoEdition.assessments[0],
    status: "draft",
    authorId: "author",
    reviewerId: "reviewer",
    reviewNotes: "internal",
  }) as Assessment;
test("Workflow requires an assigned independent reviewer and a separate publisher", () => {
  let a = fixture();
  assert.throws(() =>
    transition(a, "submit", { id: "author", roles: ["reviewer"] }),
  );
  a = transition(a, "submit", { id: "author", roles: ["researcher"] });
  assert.equal(a.status, "in_review");
  assert.throws(() =>
    transition(a, "approve", { id: "publisher", roles: ["publisher"] }),
  );
  assert.throws(() =>
    transition(a, "accept", { id: "other", roles: ["reviewer"] }),
  );
  a = transition(a, "accept", { id: "reviewer", roles: ["reviewer"] });
  assert.throws(() =>
    transition(a, "approve", { id: "author", roles: ["publisher"] }),
  );
  a = transition(a, "approve", { id: "publisher", roles: ["publisher"] });
  assert.equal(a.status, "approved");
  assert.throws(() =>
    transition({ ...a, status: "published" }, "reject", {
      id: "reviewer",
      roles: ["reviewer"],
    }),
  );
});
test("Publication validation requires approved methodology and claim-linked evidence", () => {
  const a = fixture();
  assert.ok(
    validateAssessment(
      a,
      proposedMethodology,
      demoEdition.assessments[0].sources,
    ).some((e) => e.includes("approval")),
  );
  const m = { ...proposedMethodology, approved: true };
  assert.deepEqual(
    validateAssessment(a, m, demoEdition.assessments[0].sources),
    [],
  );
  assert.ok(validateAssessment({ ...a, evidence: [] }, m, []).length >= 6);
  assert.ok(
    validateAssessment({ ...a, scores: blankScores() }, m, []).length > 0,
  );
});
test("Public snapshots exclude internal reviewer notes and identity IDs", () => {
  const a = fixture();
  a.scores[0] = { ...a.scores[0], reviewerNotes: "private disagreement" };
  const p = publicAssessment(
    a,
    demoEdition.assessments[0].leader,
    demoEdition.assessments[0].sources,
    { assessor: "Researcher", reviewer: "Reviewer", publisher: "Publisher" },
    "2026-10-17",
  );
  assert.ok(!JSON.stringify(p).includes("private disagreement"));
  assert.ok(!("authorId" in p));
  assert.ok(!("reviewNotes" in p));
});
test("Import schema rejects out-of-range scores, duplicates and publication fields", () => {
  assert.equal(
    importSchema.safeParse({
      schemaVersion: 1,
      leaders: [],
      sources: [],
      assessments: [],
      publish: true,
    }).success,
    false,
  );
  const a = fixture();
  const input = {
    leaderId: a.leaderId,
    methodologyId: a.methodologyId,
    periodStart: a.periodStart,
    periodEnd: a.periodEnd,
    context: a.context,
    reviewerId: a.reviewerId,
    reviewNotes: "",
    reassessOn: a.reassessOn,
    scores: blankScores(),
    evidence: [],
  };
  assert.equal(assessmentInput.safeParse(input).success, true);
  assert.equal(
    assessmentInput.safeParse({
      ...input,
      scores: input.scores.map((s) => ({ ...s, score: 4 })),
    }).success,
    false,
  );
  assert.equal(
    assessmentInput.safeParse({ ...input, periodStart: "2026-02-30" }).success,
    false,
  );
});
test("References normalise tracking links and CSV exports neutralise formulas", () => {
  assert.equal(
    canonicalReference("https://example.org/source?utm_source=mail#page"),
    "https://example.org/source",
  );
  assert.equal(csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
});
test("Snapshot hashes survive PostgreSQL JSON key reordering", () => {
  assert.equal(
    digest({ b: 2, a: { z: 3, k: 4 } }),
    digest({ a: { k: 4, z: 3 }, b: 2 }),
  );
  assert.notEqual(digest({ scores: [0, 1] }), digest({ scores: [1, 0] }));
});
test("Write endpoints reject foreign origins and oversized bodies", async () => {
  assert.throws(() =>
    checkOrigin(
      new Request("https://rethinkk.org/api/wallace-index/desk", {
        headers: {
          origin: "https://unrelated.example",
          "content-type": "application/json",
        },
      }),
    ),
  );
  await assert.rejects(
    limitedJson(
      new Request("https://rethinkk.org/api/wallace-index/desk", {
        method: "POST",
        body: JSON.stringify({ notes: "too long" }),
      }),
      4,
    ),
  );
});
