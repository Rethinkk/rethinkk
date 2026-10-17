import { Methodology } from "./model";
export const proposedMethodology: Methodology = {
  id: "wallace-methodology-1-draft",
  version: "1.0 — proposed",
  approved: false,
  descriptors: [
    "Absent or demonstrably negative",
    "Limited or inconsistent evidence",
    "Substantial but not consistently demonstrated",
    "Strongly and consistently demonstrated",
  ],
  rubrics: {
    people: {
      definition: "Capacity for empathy, listening and citizen focus",
      indicators: [
        "Documented consultation and responses to affected citizens",
        "Attention to groups bearing policy costs",
        "Evidence that listening informs decisions",
      ],
      positive:
        "A documented decision changes after listening to affected communities, with reasons published.",
      negative:
        "Verified repeated dismissal of affected citizens without considering their circumstances.",
      guidance:
        "Distinguish visible empathy from ceremonial appearances. Examine decisions as well as language.",
    },
    process: {
      definition:
        "Institutional discipline, transparency and respect for rules",
      indicators: [
        "Compliance with legal and parliamentary oversight",
        "Transparent reasons and records",
        "Respect for independent institutions and scrutiny",
      ],
      positive:
        "A leader supplies records to lawful scrutiny and acts on formal findings.",
      negative:
        "A formal finding establishes deliberate obstruction of lawful oversight.",
      guidance:
        "Distinguish allegations from institutional findings. Consider the rules and powers in force at the time.",
    },
    policy: {
      definition: "Clarity of vision, consistency and strategic direction",
      indicators: [
        "Clearly stated objectives and implementation plans",
        "Alignment between commitments, resources and decisions",
        "Explained adaptation to new evidence",
      ],
      positive:
        "A published strategy connects objectives, resources and implementation, with explained revisions.",
      negative:
        "Repeated incompatible commitments with no explanation or coherent implementation.",
      guidance:
        "Do not score ideological agreement. A justified change of policy is not automatically inconsistency.",
    },
    crisis: {
      definition: "Composure under pressure and calm communication",
      indicators: [
        "Timely and proportionate decisions under pressure",
        "Clear communication of uncertainty",
        "Use of relevant expertise and institutional capacity",
      ],
      positive:
        "Contemporaneous records show calm communication, acknowledged uncertainty and coordinated action.",
      negative:
        "Verified decisions or statements repeatedly inflame a crisis or conceal material uncertainty.",
      guidance:
        "Account for information available at the time, institutional constraints and different types of crisis.",
    },
    humility: {
      definition: "Absence of ego, personal cult and power-seeking behaviour",
      indicators: [
        "Willingness to acknowledge mistakes and credit others",
        "Acceptance of criticism and lawful limits",
        "Behaviour concerning personal promotion and succession",
      ],
      positive:
        "A leader publicly corrects an error and accepts an independent decision limiting personal authority.",
      negative:
        "Verified patterns subordinate institutions to personal loyalty or a personality cult.",
      guidance:
        "Assess observable conduct, not inferred personality or medical traits. Visibility alone does not demonstrate ego.",
    },
    service: {
      definition: "Commitment to the public good over personal ambition",
      indicators: [
        "Management of conflicts of interest",
        "Choices concerning personal benefit and public responsibility",
        "Respect for the duties of office and transfer of power",
      ],
      positive:
        "Documented recusal or sacrifice of personal advantage protects a public responsibility.",
      negative:
        "A formal finding establishes misuse of public office for personal benefit.",
      guidance:
        "Separate claimed motives from documented conduct. Do not assume that holding or leaving office proves service.",
    },
  },
  evidence:
    "Assess provenance, independence, relevance and context. Use primary records where available and corroborating independent reporting or research. A reputable publisher does not prove every claim. Verified social statements establish what the speaker said; wider claims need corroboration. No fixed source count determines a score.",
  ambiguity:
    "Record supporting, contradictory and qualifying evidence explicitly. Explain its relative relevance, quality and completeness. Do not average incompatible accounts mechanically; leave a dimension unassessed when a defensible judgement cannot be made.",
  periods:
    "Define the office, country, exact assessment period and historical context before scoring. Consider the authority and information available during that period. Comparing different offices or eras requires an explicit contextual qualification.",
  missing:
    "Zero is an assessed judgement, never a substitute for missing information. Use Not assessed or Insufficient evidence when evidence is incomplete. Do not calculate a complete total until all six dimensions are assessed.",
  reassessment:
    "Reassess at the scheduled date, on substantive new evidence, after a material correction or when methodology changes. Create a new reviewed version; preserve all published editions and explain the change.",
  disagreements:
    "An independent assigned reviewer evaluates the evidence and rationale. Record disagreement and reasons; request changes where necessary. A separate publisher approves the reviewed version. Unresolved material objections prevent approval and are escalated to the editorial lead.",
  changelog:
    "Initial proposed operational rubric. Requires explicit editorial approval before any official assessment is published. Additional democratic safeguards are separate governance proposals and do not change the six scores.",
};
