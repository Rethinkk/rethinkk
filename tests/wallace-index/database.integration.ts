import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { db } from "../../lib/wallace-index/db";
import { execute, Actor, digest } from "../../lib/wallace-index/editorial";
import { proposedMethodology } from "../../lib/wallace-index/methodology";
import { blankScores } from "../../lib/wallace-index/model";
import { importSchema } from "../../lib/wallace-index/validation";

test(
  "Real PostgreSQL: review, immutable publication, revision, duplicate imports and snapshots",
  { skip: !process.env.WALLACE_TEST_DATABASE },
  async () => {
    if (!process.env.DATABASE_URL?.includes("wallace_test"))
      throw Error("Use an isolated database whose name contains wallace_test.");
    const run = randomUUID();
    const author: Actor = {
      id: `test-author-${run}`,
      name: "Fictional test researcher",
      roles: ["researcher"],
    };
    const reviewer: Actor = {
      id: `test-reviewer-${run}`,
      name: "Fictional test reviewer",
      roles: ["reviewer"],
    };
    const publisher: Actor = {
      id: `test-publisher-${run}`,
      name: "Fictional test publisher",
      roles: ["publisher"],
    };
    for (const u of [author, reviewer, publisher])
      await db.wallaceUser.create({ data: u });
    try {
      await assert.rejects(
        execute(reviewer, {
          action: "leader.save",
          data: {
            slug: `test-${run}`,
            name: "Fictional test leader",
            country: "Fictional",
            office: "Test office",
            officeStart: "2025-01-01",
            officeEnd: "2025-12-31",
            biography: "Test fixture only",
            archived: false,
          },
        }),
      );
      const leader = (await execute(author, {
        action: "leader.save",
        data: {
          slug: `test-${run}`,
          name: `Fictional test leader ${run}`,
          country: "Fictional",
          office: "Test office",
          officeStart: "2025-01-01",
          officeEnd: "2025-12-31",
          biography: "Test fixture only",
          archived: false,
        },
      })) as { id: string };
      const m = {
        ...proposedMethodology,
        id: `method-${run}`,
        version: `test-${run}`,
      };
      await execute(author, { action: "methodology.save", data: m });
      await execute(publisher, { action: "methodology.approve", id: m.id });
      const source = {
        title: "Fictional integration fixture",
        author: "Test suite",
        publisher: "Test suite",
        publishedDate: "2026-10-01",
        type: "government" as const,
        reference: `urn:test:${run}`,
        accessedDate: "2026-10-17",
        language: "en-GB",
        summary: "No real-world claim",
        provenance: "Synthetic fixture",
        reliability: "Test only",
        relevance: "Test only",
        archive: "",
      };
      const s = (await execute(author, {
        action: "source.create",
        data: source,
      })) as { id: string };
      const input = {
        leaderId: leader.id,
        methodologyId: m.id,
        periodStart: "2025-01-01",
        periodEnd: "2025-12-31",
        context: "Fictional test context",
        reviewerId: reviewer.id,
        reviewNotes: "",
        reassessOn: "2027-10-17",
        scores: blankScores().map((x) => ({
          ...x,
          score: 0 as const,
          rationale: "Documented synthetic test rationale",
          sufficiency: "sufficient" as const,
        })),
        evidence: blankScores().map((x) => ({
          dimension: x.dimension,
          sourceId: s.id,
          claim: "Synthetic test claim",
          context: "Test fixture only",
          relation: "supporting" as const,
        })),
      };
      const a = (await execute(author, {
        action: "assessment.save",
        data: input,
      })) as { id: string };
      await assert.rejects(
        db.wallaceDimensionScore.update({
          where: {
            assessmentId_dimension: { assessmentId: a.id, dimension: "people" },
          },
          data: { score: 4 },
        }),
      );
      await execute(author, {
        action: "assessment.submit",
        id: a.id,
        notes: "Ready for review",
      });
      await assert.rejects(
        execute(publisher, {
          action: "assessment.approve",
          id: a.id,
          notes: "Cannot skip review",
        }),
      );
      await execute(reviewer, {
        action: "assessment.reject",
        id: a.id,
        notes: "Clarify contradictory evidence",
      });
      await execute(author, {
        action: "assessment.save",
        data: { ...input, id: a.id },
      });
      await execute(author, {
        action: "assessment.submit",
        id: a.id,
        notes: "Revised evidence",
      });
      await execute(reviewer, {
        action: "assessment.accept",
        id: a.id,
        notes: "Evidence reviewed; no unresolved objections",
      });
      await execute(publisher, {
        action: "assessment.approve",
        id: a.id,
        notes: "Editorial approval",
      });
      const e = (await execute(publisher, {
        action: "edition.publish",
        data: {
          slug: `edition-${run}`,
          title: "Fictional test edition",
          methodologyId: m.id,
          releaseNotes: "Synthetic integration test only",
          assessmentIds: [a.id],
        },
      })) as { id: string; checksum: string };
      const snapshot = await db.wallaceEdition.findUniqueOrThrow({
        where: { id: e.id },
      });
      assert.equal(digest(snapshot.snapshot), snapshot.checksum);
      await assert.rejects(
        db.wallaceDimensionScore.update({
          where: {
            assessmentId_dimension: { assessmentId: a.id, dimension: "people" },
          },
          data: { score: 1 },
        }),
      );
      await assert.rejects(
        db.wallaceAssessment.update({
          where: { id: a.id },
          data: { context: "Silent rewrite" },
        }),
      );
      await assert.rejects(
        db.wallaceSource.update({
          where: { id: s.id },
          data: { data: { title: "Silent rewrite" } },
        }),
      );
      await assert.rejects(
        db.wallaceEdition.update({
          where: { id: e.id },
          data: { title: "Silent rewrite" },
        }),
      );
      await assert.rejects(
        db.wallaceMethodology.update({
          where: { id: m.id },
          data: { version: "Silent rewrite" },
        }),
      );
      const revision = (await execute(author, {
        action: "assessment.revise",
        id: a.id,
        reason: "New synthetic evidence",
      })) as { id: string; version: number };
      assert.notEqual(revision.id, a.id);
      assert.equal(revision.version, 2);
      await execute(author, {
        action: "leader.save",
        data: {
          id: leader.id,
          slug: `test-${run}`,
          name: `Updated fictional identity ${run}`,
          country: "Fictional",
          office: "Test office",
          officeStart: "2025-01-01",
          officeEnd: "2025-12-31",
          biography: "Updated draft metadata",
          archived: false,
        },
      });
      assert.deepEqual(
        (await db.wallaceEdition.findUniqueOrThrow({ where: { id: e.id } }))
          .snapshot,
        snapshot.snapshot,
      );
      const duplicate = (await execute(author, {
        action: "import.preview",
        data: importSchema.parse({
          schemaVersion: 1,
          leaders: [],
          sources: [{ ...source, id: s.id }],
          assessments: [],
        }),
      })) as { valid: boolean };
      assert.equal(duplicate.valid, false);
      await assert.rejects(
        execute(author, {
          action: "import.apply",
          data: importSchema.parse({
            schemaVersion: 1,
            leaders: [],
            sources: [{ ...source, id: s.id }],
            assessments: [],
          }),
        }),
      );
    } finally {
      await db.$disconnect();
    }
  },
);
