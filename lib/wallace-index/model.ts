export const dimensions = [
  "people",
  "process",
  "policy",
  "crisis",
  "humility",
  "service",
] as const;
export type Dimension = (typeof dimensions)[number];
export type Score = 0 | 1 | 2 | 3 | null;
export type Status =
  "draft" | "in_review" | "approved" | "published" | "superseded" | "archived";
export type Role = "administrator" | "researcher" | "reviewer" | "publisher";
export type Rubric = {
  definition: string;
  indicators: string[];
  positive: string;
  negative: string;
  guidance: string;
};
export type Methodology = {
  id: string;
  version: string;
  approved: boolean;
  descriptors: string[];
  rubrics: Record<Dimension, Rubric>;
  evidence: string;
  ambiguity: string;
  periods: string;
  missing: string;
  reassessment: string;
  disagreements: string;
  changelog: string;
};
export type Leader = {
  id: string;
  slug: string;
  name: string;
  country: string;
  office: string;
  officeStart: string;
  officeEnd: string;
  biography: string;
  archived: boolean;
};
export type Source = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  type: string;
  reference: string;
  accessedDate: string;
  language: string;
  summary: string;
  provenance: string;
  reliability: string;
  relevance: string;
  archive: string;
};
export type Evidence = {
  sourceId: string;
  dimension: Dimension;
  claim: string;
  context: string;
  relation: "supporting" | "contradicting" | "qualifying";
};
export type DimensionScore = {
  dimension: Dimension;
  score: Score;
  rationale: string;
  sufficiency: "sufficient" | "insufficient" | "not_assessed";
  reviewerNotes: string;
};
export type Assessment = {
  id: string;
  leaderId: string;
  methodologyId: string;
  version: number;
  predecessorId: string | null;
  correctionReason: string;
  periodStart: string;
  periodEnd: string;
  context: string;
  status: Status;
  authorId: string;
  reviewerId: string | null;
  reviewDecision: "pending" | "accepted" | "changes_requested";
  reviewNotes: string;
  reassessOn: string;
  scores: DimensionScore[];
  evidence: Evidence[];
};
export type PublicAssessment = Omit<
  Assessment,
  "reviewNotes" | "reviewerId" | "authorId"
> & {
  leader: Leader;
  sources: Source[];
  assessor: string;
  reviewer: string;
  publisher: string;
  publishedAt: string;
};
export type Edition = {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  methodology: Methodology;
  releaseNotes: string;
  assessments: PublicAssessment[];
  checksum: string;
  demonstration?: boolean;
};
export type Catalogue = { editions: Edition[]; unavailable: boolean };

export function total(
  scores: Pick<DimensionScore, "dimension" | "score">[],
): number | null {
  if (
    scores.length !== 6 ||
    new Set(scores.map((s) => s.dimension)).size !== 6 ||
    dimensions.some((d) => !scores.some((s) => s.dimension === d))
  )
    return null;
  if (
    scores.some(
      (s) =>
        s.score === null ||
        !Number.isInteger(s.score) ||
        s.score! < 0 ||
        s.score! > 3,
    )
  )
    return null;
  return scores.reduce((sum, s) => sum + s.score!, 0);
}
export function blankScores(): DimensionScore[] {
  return dimensions.map((dimension) => ({
    dimension,
    score: null,
    rationale: "",
    sufficiency: "not_assessed",
    reviewerNotes: "",
  }));
}
export function label(d: string) {
  return d.charAt(0).toUpperCase() + d.slice(1);
}
export function publicAssessment(
  a: Assessment,
  leader: Leader,
  sources: Source[],
  attribution: { assessor: string; reviewer: string; publisher: string },
  publishedAt: string,
): PublicAssessment {
  const {
    authorId: _author,
    reviewerId: _reviewer,
    reviewNotes: _notes,
    ...publicData
  } = a;
  return {
    ...publicData,
    status: "published",
    scores: a.scores.map((s) => ({ ...s, reviewerNotes: "" })),
    leader: structuredClone(leader),
    sources: structuredClone(sources),
    ...attribution,
    publishedAt,
  };
}
export function validateAssessment(
  a: Assessment,
  methodology: Methodology,
  sources: Source[],
): string[] {
  const errors: string[] = [];
  if (!methodology.approved)
    errors.push("The methodology requires editorial approval.");
  if (a.methodologyId !== methodology.id)
    errors.push("Methodology does not match.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(a.periodStart) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(a.periodEnd) ||
    a.periodStart > a.periodEnd
  )
    errors.push("A valid assessment period is required.");
  if (!a.context.trim()) errors.push("Historical context is required.");
  if (
    a.scores.length !== 6 ||
    new Set(a.scores.map((s) => s.dimension)).size !== 6 ||
    dimensions.some((d) => !a.scores.some((s) => s.dimension === d))
  )
    errors.push("Include each of the six dimensions exactly once.");
  for (const s of a.scores) {
    if (
      s.score !== null &&
      (!Number.isInteger(s.score) || s.score < 0 || s.score > 3)
    )
      errors.push(`${s.dimension}: use an integer from 0 to 3.`);
    if (s.score === null || s.sufficiency !== "sufficient")
      errors.push(
        `${s.dimension}: complete evidence and assessment before publication.`,
      );
    if (!s.rationale.trim())
      errors.push(`${s.dimension}: a rationale is required.`);
    if (
      !a.evidence.some(
        (e) => e.dimension === s.dimension && e.relation === "supporting",
      )
    )
      errors.push(`${s.dimension}: link supporting evidence.`);
  }
  for (const e of a.evidence) {
    if (
      !dimensions.includes(e.dimension) ||
      !e.claim.trim() ||
      !sources.some((s) => s.id === e.sourceId)
    )
      errors.push(
        "Evidence must identify a source, dimension and supported claim.",
      );
  }
  if (a.predecessorId && !a.correctionReason.trim())
    errors.push("A revision needs a documented correction reason.");
  if (!a.reassessOn) errors.push("Set a reassessment date.");
  return [...new Set(errors)];
}
export function may(
  role: Role[],
  action: "write" | "review" | "publish" | "admin",
) {
  return action === "write"
    ? role.includes("researcher")
    : action === "review"
      ? role.includes("reviewer")
      : action === "publish"
        ? role.includes("publisher")
        : role.includes("administrator");
}
export function transition(
  a: Assessment,
  action: "submit" | "accept" | "reject" | "approve",
  actor: { id: string; roles: Role[] },
): Assessment {
  const next = structuredClone(a);
  if (["published", "superseded", "archived"].includes(a.status))
    throw new Error("Published records are immutable. Create a revision.");
  if (action === "submit") {
    if (!may(actor.roles, "write") || a.status !== "draft")
      throw new Error("Only a researcher may submit a draft.");
    if (!a.reviewerId || a.reviewerId === a.authorId)
      throw new Error("Assign an independent reviewer.");
    next.status = "in_review";
    next.reviewDecision = "pending";
  } else if (action === "accept" || action === "reject") {
    if (
      !may(actor.roles, "review") ||
      a.status !== "in_review" ||
      a.reviewerId !== actor.id ||
      actor.id === a.authorId
    )
      throw new Error("Only the assigned independent reviewer may review.");
    next.reviewDecision =
      action === "accept" ? "accepted" : "changes_requested";
    if (action === "reject") next.status = "draft";
  } else {
    if (
      !may(actor.roles, "publish") ||
      a.status !== "in_review" ||
      a.reviewDecision !== "accepted" ||
      actor.id === a.authorId ||
      actor.id === a.reviewerId
    )
      throw new Error("A separate publisher must approve an accepted review.");
    next.status = "approved";
  }
  return next;
}
