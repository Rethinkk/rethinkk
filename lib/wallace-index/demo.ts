import { Assessment, Edition, Leader, publicAssessment } from "./model";
import { proposedMethodology } from "./methodology";
// Entirely fictional fixtures. Never persisted or eligible for editorial publication.
export const demoEdition: Edition = {
  id: "demonstration",
  slug: "demonstration",
  title: "Interface demonstration",
  publishedAt: "2026-10-01",
  checksum: "demonstration-only",
  demonstration: true,
  methodology: proposedMethodology,
  releaseNotes:
    "Fictional profiles illustrate the interface. These are not factual leadership assessments.",
  assessments: ["A", "B"].map((letter, i) => {
    const leader: Leader = {
      id: `demo-${letter}`,
      slug: `demonstration-profile-${letter.toLowerCase()}`,
      name: `Demonstration profile ${letter}`,
      country: "Fictional jurisdiction",
      office: "Illustrative public office",
      officeStart: "2025-01-01",
      officeEnd: "2025-12-31",
      biography:
        "An entirely fictional profile created to demonstrate the research interface. It does not represent a real person.",
      archived: false,
    };
    const values = i ? [1, 2, 2, 1, 3, 2] : [2, 3, 2, 2, 1, 3];
    const dims = [
      "people",
      "process",
      "policy",
      "crisis",
      "humility",
      "service",
    ] as const;
    const source = {
      id: `fixture-${letter}`,
      title: "Fictional interface evidence fixture",
      author: "RETHINKK interface demonstration",
      publisher: "Demonstration only",
      publishedDate: "2026-10-01",
      type: "fictional-fixture",
      reference: "Demonstration fixture — no external factual source",
      accessedDate: "2026-10-01",
      language: "en-GB",
      summary:
        "Synthetic text demonstrates where verified evidence would appear. It supports no real-world claim.",
      provenance: "Created solely for interface testing",
      reliability: "Not research evidence",
      relevance: "Interface illustration only",
      archive: "",
    };
    const a: Assessment = {
      id: `demo-assessment-${letter}`,
      leaderId: leader.id,
      methodologyId: proposedMethodology.id,
      version: 1,
      predecessorId: null,
      correctionReason: "",
      periodStart: "2025-01-01",
      periodEnd: "2025-12-31",
      context: "Fictional assessment period for interface demonstration.",
      status: "draft",
      authorId: "demo",
      reviewerId: null,
      reviewDecision: "pending",
      reviewNotes: "",
      reassessOn: "2027-10-01",
      scores: dims.map((dimension, n) => ({
        dimension,
        score: values[n] as 1 | 2 | 3,
        rationale:
          "Illustrative rationale only. A published assessment would explain the observed conduct, historical context and contradictory evidence here.",
        sufficiency: "sufficient",
        reviewerNotes: "",
      })),
      evidence: dims.map((dimension) => ({
        dimension,
        sourceId: source.id,
        claim:
          "Synthetic example of a claim-to-evidence link; no factual assertion.",
        context: "Interface demonstration only",
        relation: "supporting",
      })),
    };
    return publicAssessment(
      a,
      leader,
      [source],
      {
        assessor: "Demonstration",
        reviewer: "Demonstration",
        publisher: "Demonstration",
      },
      "2026-10-01",
    );
  }),
};
