import register from "@/research/wallace-index/evidence-gaps-02/updated-register.json";
import { dimensions, type Dimension } from "./model";

// A research collection is deliberately not an Edition or PublicAssessment.
// It cannot enter the official score, publication or edition export pathways.
export const researchNotice =
  "Qualitative research drafts — internally reviewed, with independent review pending. Methodology 1.0 is proposed and awaits editorial approval. No editorial scores or totals have been assigned. These profiles are not a published assessment edition.";
export const scholzServiceCaveat =
  "Insufficient evidence for Service. The available records identify declared interests and duties of office, but do not establish how competing interests were managed in specific decisions during the assessment period. This is an evidence gap, not a finding of misconduct. No score has been assigned.";

const claims = new Map(register.claims.map((c) => [c.id, c]));
const sources = new Map(register.sources.map((s) => [s.id, s]));
function evidence(ids: string[]) {
  return ids.map((id) => {
    const claim = claims.get(id);
    if (!claim) throw new Error(`Missing research claim ${id}`);
    const source = sources.get(claim.source_id);
    if (!source) throw new Error(`Missing research source ${claim.source_id}`);
    if (!/^https?:\/\//.test(source.url)) throw new Error("Invalid source URL");
    return {
      id,
      text: claim.text,
      date:
        claim.event_date_or_period ||
        source.original_publication_date ||
        "Date not recorded",
      locator: claim.locator,
      limitations: "limitations" in claim ? String(claim.limitations) : "",
      sourceId: source.id,
      sourceTitle: source.title,
    };
  });
}
export const researchProfiles = register.profiles.map((p) => ({
  id: p.id,
  name: p.name,
  country: p.country,
  office: p.office,
  start: p.assessment_period.start,
  end: p.assessment_period.end,
  chronologySourceIds: p.assessment_period.source_ids,
  dimensions: dimensions.map((dimension) => {
    const d = p.dimensions.find((d) => d.dimension.toLowerCase() === dimension);
    if (!d || d.official_score !== null || d.proposed_score !== null)
      throw new Error("Research draft must contain six unscored dimensions");
    return {
      dimension: dimension as Dimension,
      judgement: d.draft_judgement,
      uncertainties: d.uncertainties,
      withholdingReason: d.score_withholding_reason,
      caveat:
        p.id === "olaf-scholz" && dimension === "service"
          ? scholzServiceCaveat
          : null,
      supporting: evidence(d.supporting_claim_ids),
      adverse: evidence(d.adverse_or_contradictory_claim_ids),
      qualifying: evidence(d.qualifying_claim_ids),
    };
  }),
}));
export type ResearchProfile = (typeof researchProfiles)[number];
export type ResearchEvidence =
  ResearchProfile["dimensions"][number]["supporting"][number];
const usedSources = new Set(
  researchProfiles.flatMap((p) => [
    ...p.chronologySourceIds,
    ...p.dimensions.flatMap((d) =>
      [...d.supporting, ...d.adverse, ...d.qualifying].map((c) => c.sourceId),
    ),
  ]),
);
export const researchSources = register.sources
  .filter((s) => usedSources.has(s.id))
  .map((s) => ({
    id: s.id,
    title: s.title,
    author: s.author_or_issuing_institution,
    publisher: s.publisher,
    publishedDate: s.original_publication_date || "Not recorded",
    url: s.url,
    accessed: s.accessed_on,
    type: s.source_type,
    language: s.language,
    summary:
      s.factual_summary || "See the linked claims and passage references.",
    notes: s.reliability_and_relevance_notes,
    archive: s.archival_reference || "Not available",
    locator: s.locator,
  }));
export const researchSnapshot = {
  schema: "wallace-qualitative-research-1",
  notice: researchNotice,
  origin: "research/wallace-index/evidence-gaps-02/updated-register.json",
  asOf: "2026-10-17",
  methodologyApproved: false,
  independentReviewCompleted: false,
  officialScoresAssigned: false,
  profiles: researchProfiles,
  sources: researchSources,
};
