import { z } from "zod";
import { dimensions } from "./model";
const text = z.string().trim().max(20000);
const required = text.min(1);
const id = z
  .string()
  .min(1)
  .max(150)
  .regex(/^[a-zA-Z0-9:_-]+$/);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
    "Use a real calendar date.",
  );
const slug = z
  .string()
  .min(1)
  .max(150)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const leaderSchema = z
  .object({
    id: id.optional(),
    slug,
    name: required,
    country: required,
    office: required,
    officeStart: date.or(z.literal("")),
    officeEnd: date.or(z.literal("")),
    biography: required,
    archived: z.boolean(),
  })
  .strict()
  .refine(
    (v) => !v.officeStart || !v.officeEnd || v.officeStart <= v.officeEnd,
    "Office dates are out of order.",
  );
export const sourceSchema = z
  .object({
    id: id.optional(),
    title: required,
    author: required,
    publisher: required,
    publishedDate: required,
    type: z.enum([
      "government",
      "parliament",
      "court",
      "speech",
      "policy",
      "decision-record",
      "news",
      "academic",
      "biography",
      "institute",
      "international-institution",
      "verified-social-statement",
    ]),
    reference: required,
    accessedDate: date,
    language: required,
    summary: required,
    provenance: required,
    reliability: required,
    relevance: required,
    archive: text,
  })
  .strict();
const score = z
  .object({
    dimension: z.enum(dimensions),
    score: z.number().int().min(0).max(3).nullable(),
    rationale: text,
    sufficiency: z.enum(["sufficient", "insufficient", "not_assessed"]),
    reviewerNotes: text,
  })
  .strict()
  .refine(
    (v) =>
      v.score === null
        ? v.sufficiency !== "sufficient"
        : v.sufficiency === "sufficient",
    "Score and evidence sufficiency disagree.",
  );
export const assessmentInput = z
  .object({
    id: id.optional(),
    leaderId: id,
    methodologyId: id,
    periodStart: date,
    periodEnd: date,
    context: text,
    reviewerId: id.nullable(),
    reviewNotes: text,
    reassessOn: date,
    scores: z.array(score).length(6),
    evidence: z
      .array(
        z
          .object({
            sourceId: id,
            dimension: z.enum(dimensions),
            claim: required,
            context: text,
            relation: z.enum(["supporting", "contradicting", "qualifying"]),
          })
          .strict(),
      )
      .max(1000),
  })
  .strict()
  .refine(
    (v) => new Set(v.scores.map((s) => s.dimension)).size === 6,
    "Include all six dimensions once.",
  )
  .refine(
    (v) => v.periodStart <= v.periodEnd,
    "Assessment dates are out of order.",
  );
const rubric = z
  .object({
    definition: required,
    indicators: z.array(required).min(1).max(30),
    positive: required,
    negative: required,
    guidance: required,
  })
  .strict();
export const methodologySchema = z
  .object({
    id,
    version: required,
    approved: z.boolean(),
    descriptors: z.array(required).length(4),
    rubrics: z
      .object({
        people: rubric,
        process: rubric,
        policy: rubric,
        crisis: rubric,
        humility: rubric,
        service: rubric,
      })
      .strict(),
    evidence: required,
    ambiguity: required,
    periods: required,
    missing: required,
    reassessment: required,
    disagreements: required,
    changelog: required,
  })
  .strict();
export const editionSchema = z
  .object({
    slug,
    title: required,
    methodologyId: id,
    releaseNotes: required,
    assessmentIds: z.array(id).min(1).max(500),
  })
  .strict()
  .refine(
    (v) => new Set(v.assessmentIds).size === v.assessmentIds.length,
    "Duplicate assessments.",
  );
export const importSchema = z
  .object({
    schemaVersion: z.literal(1),
    leaders: z.array(leaderSchema).max(500),
    sources: z.array(sourceSchema).max(5000),
    assessments: z.array(assessmentInput).max(500),
  })
  .strict();
export const commandSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("leader.save"), data: leaderSchema }),
  z.object({
    action: z.literal("source.create"),
    data: sourceSchema,
    predecessorId: id.optional(),
  }),
  z.object({ action: z.literal("assessment.save"), data: assessmentInput }),
  z.object({ action: z.literal("assessment.revise"), id, reason: required }),
  z.object({
    action: z.enum([
      "assessment.submit",
      "assessment.accept",
      "assessment.reject",
      "assessment.approve",
    ]),
    id,
    notes: required,
  }),
  z.object({ action: z.literal("methodology.save"), data: methodologySchema }),
  z.object({ action: z.literal("methodology.approve"), id }),
  z.object({ action: z.literal("edition.publish"), data: editionSchema }),
  z.object({
    action: z.literal("user.save"),
    data: z
      .object({
        id: id.regex(/^github:\d+$/),
        name: required,
        roles: z
          .array(
            z.enum(["administrator", "researcher", "reviewer", "publisher"]),
          )
          .max(4),
        disabled: z.boolean(),
      })
      .strict(),
  }),
  z.object({
    action: z.literal("content.save"),
    data: z
      .object({
        id: id.optional(),
        slug,
        version: z.number().int().positive(),
        title: required,
        body: required,
        kind: z.enum(["article", "research-note", "explanation"]),
        status: z.enum(["draft", "published"]),
      })
      .strict(),
  }),
  z.object({
    action: z.literal("contribution.review"),
    id,
    status: z.enum(["reviewed", "action_required", "closed"]),
    notes: required,
  }),
  z.object({
    action: z.enum(["import.preview", "import.apply"]),
    data: importSchema,
  }),
]);
export type Command = z.infer<typeof commandSchema>;
export function canonicalReference(reference: string) {
  try {
    const u = new URL(reference);
    u.hash = "";
    u.hostname = u.hostname.toLowerCase();
    for (const key of [...u.searchParams.keys()])
      if (key.startsWith("utm_") || key === "fbclid")
        u.searchParams.delete(key);
    u.searchParams.sort();
    return u.toString().replace(/\/$/, "");
  } catch {
    return reference.trim().toLowerCase().replace(/\s+/g, " ");
  }
}
