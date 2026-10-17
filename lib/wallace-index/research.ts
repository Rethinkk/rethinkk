import register from "@/research/wallace-index/evidence-gaps-02/updated-register.json";
import proposals from "@/research/wallace-index/score-proposals-01/score-proposals.json";
import { dimensions, type Dimension } from "./model";

// A research collection is deliberately not an Edition or PublicAssessment.
// It cannot enter the official score, publication or edition export pathways.
export const researchNotice =
  "Qualitative research drafts — internally reviewed, with independent review pending. Methodology 1.0 is proposed and awaits editorial approval. Four conditional score proposals are shown for editorial discussion. They are not approved whole-period ratings. The other 26 dimensions remain unassessed; no official scores or totals have been assigned. These profiles are not a published assessment edition.";
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
    const proposal = proposals.profiles
      .find((x) => x.id === p.id)
      ?.dimensions.find((x) => x.dimension.toLowerCase() === dimension);
    if (
      !proposal ||
      proposal.official_score !== null ||
      proposal.whole_period_evidence_sufficiency_approved !== false
    )
      throw new Error("Invalid conditional research proposal");
    if (
      proposal.proposed_score !== null &&
      (!Number.isInteger(proposal.proposed_score) ||
        proposal.proposed_score < 0 ||
        proposal.proposed_score > 3 ||
        proposal.proposal_status !== "conditional_editorial_proposal")
    )
      throw new Error("Invalid proposed score");
    return {
      proposal:
        proposal.proposed_score === null
          ? null
          : {
              score: proposal.proposed_score,
              descriptor: proposal.descriptor,
              rationale: proposal.rationale,
              adjacentDescriptors: proposal.adjacent_descriptor_analysis,
              conditions: proposal.condition_or_research_needed,
              changeFromPrior: proposal.change_from_prior,
            },
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
  schema: "wallace-qualitative-research-2",
  notice: researchNotice,
  origin: "research/wallace-index/evidence-gaps-02/updated-register.json",
  proposalOrigin:
    "research/wallace-index/score-proposals-01/score-proposals.json",
  asOf: "2026-10-17",
  methodologyApproved: false,
  independentReviewCompleted: false,
  officialScoresAssigned: false,
  profiles: researchProfiles,
  sources: researchSources,
};
