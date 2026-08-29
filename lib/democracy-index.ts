export type DemocracyStatus = "resilient" | "erosion" | "autocratic" | "not_assessed";
export type Direction = "improving" | "stable" | "deteriorating";
export type Velocity = "rapid" | "normal" | "limited";
export type Confidence = "high" | "medium" | "low";
export type AssessmentStatus = "draft" | "review" | "approved" | "published";
export type Region =
  | "Europe"
  | "North America"
  | "Latin America & Caribbean"
  | "Africa"
  | "Middle East"
  | "Asia"
  | "Oceania";

export type SourceReference = {
  id: string;
  organisation: string;
  title: string;
  url: string;
  publicationDate?: string;
  accessedAt: string;
  sourceType: "primary" | "official" | "academic" | "ngo" | "research" | "legal" | "media";
  note?: string;
};

export type CountryAssessment = {
  id: string;
  indexEditionId: string;
  countryName: string;
  slug: string;
  iso2: string;
  iso3: string;
  region: Region;
  year: number;
  status: DemocracyStatus;
  direction: Direction;
  velocity: Velocity;
  overallInstitutionalScore: number | null;
  judicialIndependence: number | null;
  mediaFreedom: number | null;
  electoralIntegrity: number | null;
  civicSpace: number | null;
  checksAndBalances: number | null;
  previousYearStatus: DemocracyStatus | null;
  previousYearScore: number | null;
  scoreChange: number | null;
  confidence: Confidence;
  assessmentStatus: AssessmentStatus;
  reviewedBy?: string;
  reviewedAt: string;
  latitude: number;
  longitude: number;
  shortRationale: string;
  whatChanged: string;
  assessment: string;
  sources: SourceReference[];
  relatedContent?: string[];
  revisionDate?: string;
  revisionNote?: string;
};

export type DemocracyDirectionEdition = {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  publicationDate: string;
  status: "draft" | "review" | "published";
  methodologyVersion: string;
  reviewPeriod: string;
  introduction: string;
  developmentLabel: string;
  assessments: CountryAssessment[];
};

const sourceLibrary: Record<string, SourceReference> = {
  vdem: {
    id: "vdem",
    organisation: "V-Dem Institute",
    title: "Democracy indicators and institutional datasets",
    url: "https://www.v-dem.net/",
    accessedAt: "2026-08-29",
    sourceType: "research",
    note: "Evidence input only; RETHINKK classification remains editorial research assessment."
  },
  freedomHouse: {
    id: "freedom-house",
    organisation: "Freedom House",
    title: "Freedom in the World research",
    url: "https://freedomhouse.org/",
    accessedAt: "2026-08-29",
    sourceType: "ngo"
  },
  idea: {
    id: "idea",
    organisation: "International IDEA",
    title: "Global State of Democracy indices",
    url: "https://www.idea.int/",
    accessedAt: "2026-08-29",
    sourceType: "research"
  },
  rsf: {
    id: "rsf",
    organisation: "Reporters Without Borders",
    title: "World Press Freedom Index",
    url: "https://rsf.org/",
    accessedAt: "2026-08-29",
    sourceType: "ngo"
  },
  electionAuthorities: {
    id: "election-authorities",
    organisation: "Official election authorities",
    title: "Election administration and legal source material",
    url: "https://aceproject.org/",
    accessedAt: "2026-08-29",
    sourceType: "official"
  }
};

function assessment(partial: Omit<CountryAssessment, "indexEditionId" | "year" | "sources" | "reviewedAt"> & { sourceIds: string[] }): CountryAssessment {
  return {
    ...partial,
    indexEditionId: "ddi-2026",
    year: 2026,
    reviewedAt: "2026-08-29",
    sources: partial.sourceIds.map((id) => sourceLibrary[id])
  };
}

export const democracyDirectionEditions: DemocracyDirectionEdition[] = [
  {
    id: "ddi-2026",
    year: 2026,
    title: "Democracy Direction Index 2026",
    subtitle: "Democracy is not a status. It is a direction.",
    publicationDate: "2026-08-29",
    status: "published",
    methodologyVersion: "1.0-dev",
    reviewPeriod: "Development edition based on illustrative records for product design.",
    developmentLabel: "Development data - not published research",
    introduction:
      "The Democracy Direction Index separates institutional status, institutional direction and velocity of change. A strong democracy can deteriorate; a weaker democracy can improve. The product is designed to track movement, not to flatten politics into a league table.",
    assessments: [
      assessment({
        id: "ddi-2026-nld",
        countryName: "Netherlands",
        slug: "netherlands",
        iso2: "NL",
        iso3: "NLD",
        region: "Europe",
        status: "resilient",
        direction: "stable",
        velocity: "limited",
        overallInstitutionalScore: 21,
        judicialIndependence: 5,
        mediaFreedom: 4,
        electoralIntegrity: 4,
        civicSpace: 4,
        checksAndBalances: 4,
        previousYearStatus: null,
        previousYearScore: null,
        scoreChange: null,
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        latitude: 52.1,
        longitude: 5.3,
        shortRationale: "Institutions remain broadly resilient, with visible pressure around trust, formation politics and administrative capacity.",
        whatChanged: "Development record: used to test how stable institutional systems are displayed without presenting stasis as absence of pressure.",
        assessment: "RETHINKK classifies this seed record as resilient and stable. The score supports the assessment but does not automatically determine it.",
        relatedContent: ["think-accountability"],
        sourceIds: ["vdem", "idea", "rsf"]
      }),
      assessment({
        id: "ddi-2026-deu",
        countryName: "Germany",
        slug: "germany",
        iso2: "DE",
        iso3: "DEU",
        region: "Europe",
        status: "resilient",
        direction: "stable",
        velocity: "limited",
        overallInstitutionalScore: 22,
        judicialIndependence: 5,
        mediaFreedom: 4,
        electoralIntegrity: 5,
        civicSpace: 4,
        checksAndBalances: 4,
        previousYearStatus: null,
        previousYearScore: null,
        scoreChange: null,
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        latitude: 51.2,
        longitude: 10.4,
        shortRationale: "Resilient institutions with pressure points that require monitoring rather than alarm.",
        whatChanged: "Development record: included to test a resilient democracy with limited movement and high institutional capacity.",
        assessment: "The direction is stable because the illustrative record does not assign a material institutional shift during the review period.",
        relatedContent: ["think-europe-small", "think-confidence"],
        sourceIds: ["vdem", "freedomHouse", "idea"]
      }),
      assessment({
        id: "ddi-2026-usa",
        countryName: "United States",
        slug: "united-states",
        iso2: "US",
        iso3: "USA",
        region: "North America",
        status: "erosion",
        direction: "deteriorating",
        velocity: "rapid",
        overallInstitutionalScore: 18,
        judicialIndependence: 4,
        mediaFreedom: 4,
        electoralIntegrity: 3,
        civicSpace: 4,
        checksAndBalances: 3,
        previousYearStatus: null,
        previousYearScore: null,
        scoreChange: null,
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        latitude: 39.8,
        longitude: -98.6,
        shortRationale: "Included as the primary demonstration case for the distinction between institutional strength and deteriorating direction.",
        whatChanged: "Development record: models a country where strong remaining institutions can still move in a negative direction.",
        assessment: "This seed assessment is labelled institutional erosion with rapid deterioration to demonstrate the core thesis. It is not a final RETHINKK research judgement.",
        sourceIds: ["vdem", "freedomHouse", "electionAuthorities"]
      }),
      assessment({
        id: "ddi-2026-hun",
        countryName: "Hungary",
        slug: "hungary",
        iso2: "HU",
        iso3: "HUN",
        region: "Europe",
        status: "erosion",
        direction: "deteriorating",
        velocity: "normal",
        overallInstitutionalScore: 12,
        judicialIndependence: 2,
        mediaFreedom: 2,
        electoralIntegrity: 3,
        civicSpace: 2,
        checksAndBalances: 3,
        previousYearStatus: null,
        previousYearScore: null,
        scoreChange: null,
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        latitude: 47.2,
        longitude: 19.5,
        shortRationale: "Development record for sustained institutional pressure across multiple dimensions.",
        whatChanged: "Development record: used to test how the interface handles an erosion classification with normal deterioration velocity.",
        assessment: "Direction and status remain independent: the low score supports the status, while velocity describes the current rate of movement.",
        sourceIds: ["vdem", "freedomHouse", "rsf"]
      }),
      assessment({
        id: "ddi-2026-pol",
        countryName: "Poland",
        slug: "poland",
        iso2: "PL",
        iso3: "POL",
        region: "Europe",
        status: "erosion",
        direction: "improving",
        velocity: "normal",
        overallInstitutionalScore: 16,
        judicialIndependence: 3,
        mediaFreedom: 3,
        electoralIntegrity: 4,
        civicSpace: 3,
        checksAndBalances: 3,
        previousYearStatus: null,
        previousYearScore: null,
        scoreChange: null,
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        latitude: 52,
        longitude: 19.1,
        shortRationale: "Development record for a pressured institutional status that may be improving.",
        whatChanged: "Development record: included to show that institutional erosion and improvement can coexist in the same annual assessment.",
        assessment: "The status remains erosion while the trajectory is improving. This is the conceptual separation the index is built to preserve.",
        relatedContent: ["think-accountability"],
        sourceIds: ["vdem", "idea", "rsf"]
      }),
      assessment({
        id: "ddi-2026-geo",
        countryName: "Georgia",
        slug: "georgia",
        iso2: "GE",
        iso3: "GEO",
        region: "Asia",
        status: "erosion",
        direction: "deteriorating",
        velocity: "rapid",
        overallInstitutionalScore: 14,
        judicialIndependence: 3,
        mediaFreedom: 3,
        electoralIntegrity: 3,
        civicSpace: 2,
        checksAndBalances: 3,
        previousYearStatus: null,
        previousYearScore: null,
        scoreChange: null,
        confidence: "low",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        latitude: 42.3,
        longitude: 43.4,
        shortRationale: "Development record for rapid movement in a contested institutional environment.",
        whatChanged: "Development record: used to test confidence labelling and rapid deterioration outside Western Europe and North America.",
        assessment: "The low confidence label concerns evidence certainty in this seed record. It does not describe democratic quality.",
        sourceIds: ["vdem", "freedomHouse", "rsf"]
      })
    ]
  }
];

export function getLatestPublishedEdition() {
  return democracyDirectionEditions
    .filter((edition) => edition.status === "published")
    .sort((a, b) => b.year - a.year)[0];
}

export function getEdition(year: number) {
  return democracyDirectionEditions.find((edition) => edition.year === year && edition.status === "published");
}

export function getCountryAssessment(year: number, slug: string) {
  return getEdition(year)?.assessments.find((country) => country.slug === slug && country.assessmentStatus === "published");
}

export function getDirectionSymbol(direction: Direction, velocity: Velocity) {
  if (direction === "stable") return "→";
  if (direction === "improving") return velocity === "rapid" ? "↑↑" : "↑";
  return velocity === "rapid" ? "↓↓" : "↓";
}

export function getMovementLabel(direction: Direction, velocity: Velocity) {
  if (direction === "stable") return "Stable";
  const pace = velocity === "rapid" ? "Rapid " : velocity === "limited" ? "Limited " : "";
  return `${pace}${direction === "improving" ? "improvement" : "deterioration"}`;
}

export function getStatusLabel(status: DemocracyStatus) {
  return {
    resilient: "Resilient democracy",
    erosion: "Institutional erosion",
    autocratic: "Autocratic",
    not_assessed: "Not assessed"
  }[status];
}

export function getStatusDesignToken(status: DemocracyStatus) {
  return {
    resilient: "status-resilient",
    erosion: "status-erosion",
    autocratic: "status-autocratic",
    not_assessed: "status-not-assessed"
  }[status];
}

export function groupCountriesByDirection(assessments: CountryAssessment[]) {
  return {
    improving: sortCountriesByMovement(assessments.filter((country) => country.direction === "improving")),
    stable: sortCountriesByMovement(assessments.filter((country) => country.direction === "stable")),
    deteriorating: sortCountriesByMovement(assessments.filter((country) => country.direction === "deteriorating"))
  };
}

export function sortCountriesByMovement(assessments: CountryAssessment[]) {
  const velocityWeight: Record<Velocity, number> = { rapid: 0, normal: 1, limited: 2 };
  return [...assessments].sort((a, b) => {
    const velocity = velocityWeight[a.velocity] - velocityWeight[b.velocity];
    if (velocity !== 0) return velocity;
    return (b.overallInstitutionalScore || 0) - (a.overallInstitutionalScore || 0);
  });
}

export function getPreviousCountryAssessment(country: CountryAssessment) {
  const previousEdition = getEdition(country.year - 1);
  return previousEdition?.assessments.find((assessment) => assessment.iso3 === country.iso3) || null;
}

export function calculateScoreChange(country: CountryAssessment) {
  if (country.scoreChange !== null) return country.scoreChange;
  if (country.previousYearScore === null || country.overallInstitutionalScore === null) return null;
  return country.overallInstitutionalScore - country.previousYearScore;
}

export function serializeEdition(edition: DemocracyDirectionEdition) {
  return {
    id: edition.id,
    year: edition.year,
    title: edition.title,
    subtitle: edition.subtitle,
    publicationDate: edition.publicationDate,
    methodologyVersion: edition.methodologyVersion,
    developmentLabel: edition.developmentLabel,
    assessments: edition.assessments
      .filter((country) => country.assessmentStatus === "published")
      .map((country) => ({
        country: country.countryName,
        iso2: country.iso2,
        iso3: country.iso3,
        region: country.region,
        status: country.status,
        direction: country.direction,
        velocity: country.velocity,
        overallInstitutionalScore: country.overallInstitutionalScore,
        confidence: country.confidence,
        shortRationale: country.shortRationale
      }))
  };
}

export function validateAssessment(country: CountryAssessment) {
  const errors: string[] = [];
  const dimensions = [
    country.judicialIndependence,
    country.mediaFreedom,
    country.electoralIntegrity,
    country.civicSpace,
    country.checksAndBalances
  ];
  dimensions.forEach((score, index) => {
    if (score !== null && (score < 1 || score > 5)) errors.push(`dimension ${index + 1} must be 1-5`);
  });
  if (country.overallInstitutionalScore !== null && (country.overallInstitutionalScore < 5 || country.overallInstitutionalScore > 25)) {
    errors.push("overallInstitutionalScore must be 5-25");
  }
  if (country.year !== Number(country.indexEditionId.replace("ddi-", ""))) errors.push("assessment year must match edition year");
  if (country.assessmentStatus === "published" && !country.shortRationale) errors.push("published assessment requires rationale");
  if (country.assessmentStatus === "published" && country.sources.length === 0) errors.push("published assessment requires evidence");
  return errors;
}
