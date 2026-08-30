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

export type InstitutionDimensionKey =
  | "judicialIndependence"
  | "mediaFreedom"
  | "electoralIntegrity"
  | "civicSpace"
  | "checksAndBalances";

export type CountryMetadata = {
  countryName: string;
  slug: string;
  iso2: string;
  iso3: string;
  region: Region;
  latitude: number;
  longitude: number;
};

export type SourceReference = {
  id: string;
  organisation: string;
  title: string;
  url: string;
  publicationDate?: string;
  accessedAt: string;
  sourceType: "primary" | "official" | "academic" | "ngo" | "research" | "legal" | "media";
  note?: string;
  supports?: InstitutionDimensionKey[];
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
  judicialIndependenceRationale: string;
  mediaFreedomRationale: string;
  electoralIntegrityRationale: string;
  civicSpaceRationale: string;
  checksAndBalancesRationale: string;
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
  trajectoryAnalysis: string;
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

export const countryMetadata: CountryMetadata[] = [
  { countryName: "Netherlands", slug: "netherlands", iso2: "NL", iso3: "NLD", region: "Europe", latitude: 52.1, longitude: 5.3 },
  { countryName: "Germany", slug: "germany", iso2: "DE", iso3: "DEU", region: "Europe", latitude: 51.2, longitude: 10.4 },
  { countryName: "United States", slug: "united-states", iso2: "US", iso3: "USA", region: "North America", latitude: 39.8, longitude: -98.6 },
  { countryName: "Hungary", slug: "hungary", iso2: "HU", iso3: "HUN", region: "Europe", latitude: 47.2, longitude: 19.5 },
  { countryName: "Poland", slug: "poland", iso2: "PL", iso3: "POL", region: "Europe", latitude: 52, longitude: 19.1 },
  { countryName: "Georgia", slug: "georgia", iso2: "GE", iso3: "GEO", region: "Asia", latitude: 42.3, longitude: 43.4 }
];

export function getCountryMetadata(iso3: string) {
  return countryMetadata.find((country) => country.iso3 === iso3.toUpperCase()) || null;
}

const sourceLibrary: Record<string, SourceReference> = {
  vdem: {
    id: "vdem",
    organisation: "V-Dem Institute",
    title: "Democracy indicators and institutional datasets",
    url: "https://www.v-dem.net/",
    publicationDate: "2026-03-17",
    accessedAt: "2026-08-29",
    sourceType: "research",
    note: "Evidence input only; RETHINKK classification remains editorial research assessment.",
    supports: ["judicialIndependence", "electoralIntegrity", "checksAndBalances"]
  },
  freedomHouse: {
    id: "freedom-house",
    organisation: "Freedom House",
    title: "Freedom in the World research",
    url: "https://freedomhouse.org/",
    publicationDate: "2026-03-01",
    accessedAt: "2026-08-29",
    sourceType: "ngo",
    supports: ["civicSpace", "checksAndBalances"]
  },
  idea: {
    id: "idea",
    organisation: "International IDEA",
    title: "Global State of Democracy indices",
    url: "https://www.idea.int/",
    publicationDate: "2026-02-15",
    accessedAt: "2026-08-29",
    sourceType: "research",
    supports: ["electoralIntegrity", "civicSpace"]
  },
  rsf: {
    id: "rsf",
    organisation: "Reporters Without Borders",
    title: "World Press Freedom Index",
    url: "https://rsf.org/",
    publicationDate: "2026-05-03",
    accessedAt: "2026-08-29",
    sourceType: "ngo",
    supports: ["mediaFreedom"]
  },
  electionAuthorities: {
    id: "election-authorities",
    organisation: "Official election authorities",
    title: "Election administration and legal source material",
    url: "https://aceproject.org/",
    publicationDate: "2026-01-15",
    accessedAt: "2026-08-29",
    sourceType: "official",
    supports: ["electoralIntegrity"]
  }
};

type AnnualAssessmentInput = Omit<
  CountryAssessment,
  "countryName" | "slug" | "iso2" | "region" | "latitude" | "longitude" | "indexEditionId" | "year" | "sources" | "reviewedAt" | "previousYearStatus" | "previousYearScore" | "scoreChange"
> & { sourceIds: string[] };

function assessment(partial: AnnualAssessmentInput): CountryAssessment {
  const metadata = getCountryMetadata(partial.iso3);
  if (!metadata) throw new Error(`Missing country metadata for ${partial.iso3}`);
  return {
    ...partial,
    countryName: metadata.countryName,
    slug: metadata.slug,
    iso2: metadata.iso2,
    region: metadata.region,
    latitude: metadata.latitude,
    longitude: metadata.longitude,
    indexEditionId: "ddi-2026",
    year: 2026,
    previousYearStatus: null,
    previousYearScore: null,
    scoreChange: null,
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
        iso3: "NLD",
        status: "resilient",
        direction: "stable",
        velocity: "limited",
        overallInstitutionalScore: 21,
        judicialIndependence: 5,
        mediaFreedom: 4,
        electoralIntegrity: 4,
        civicSpace: 4,
        checksAndBalances: 4,
        judicialIndependenceRationale: "Courts are treated as institutionally independent in this development record.",
        mediaFreedomRationale: "Pluralism remains strong, while pressure on public debate and media economics warrants monitoring.",
        electoralIntegrityRationale: "Election administration remains reliable in this development record.",
        civicSpaceRationale: "Civic space remains open, with trust and administrative responsiveness as relevant watchpoints.",
        checksAndBalancesRationale: "Checks remain functional, though coalition fragmentation can slow institutional accountability.",
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        shortRationale: "Institutions remain broadly resilient, with visible pressure around trust, formation politics and administrative capacity.",
        trajectoryAnalysis: "The Dutch democratic system is not moving through a dramatic institutional rupture. The more relevant observation is slower: high baseline resilience is being tested by administrative fragmentation, low-trust political cycles and pressure on the state's capacity to execute decisions cleanly. Direction is therefore stable, but not inert.",
        whatChanged: "Development record: used to test how stable institutional systems are displayed without presenting stasis as absence of pressure.",
        assessment: "RETHINKK classifies this seed record as resilient and stable. The score supports the assessment but does not automatically determine it.",
        relatedContent: ["think-accountability"],
        sourceIds: ["vdem", "idea", "rsf"]
      }),
      assessment({
        id: "ddi-2026-deu",
        iso3: "DEU",
        status: "resilient",
        direction: "stable",
        velocity: "limited",
        overallInstitutionalScore: 22,
        judicialIndependence: 5,
        mediaFreedom: 4,
        electoralIntegrity: 5,
        civicSpace: 4,
        checksAndBalances: 4,
        judicialIndependenceRationale: "Judicial independence is modelled as highly resilient in this development record.",
        mediaFreedomRationale: "Media pluralism remains strong, with structural pressure points tracked separately from status.",
        electoralIntegrityRationale: "Electoral administration is represented as highly resilient.",
        civicSpaceRationale: "Civic space remains open while political strain is monitored.",
        checksAndBalancesRationale: "Federal structure and institutional review mechanisms continue to provide checks.",
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        shortRationale: "Resilient institutions with pressure points that require monitoring rather than alarm.",
        trajectoryAnalysis: "Germany remains institutionally strong, but the direction question is about strain rather than collapse. The system still absorbs political pressure through courts, federal structure and administrative norms. The current movement is limited: pressure is visible, but institutional correction mechanisms remain active.",
        whatChanged: "Development record: included to test a resilient democracy with limited movement and high institutional capacity.",
        assessment: "The direction is stable because the illustrative record does not assign a material institutional shift during the review period.",
        relatedContent: ["think-europe-small", "think-confidence"],
        sourceIds: ["vdem", "freedomHouse", "idea"]
      }),
      assessment({
        id: "ddi-2026-usa",
        iso3: "USA",
        status: "erosion",
        direction: "deteriorating",
        velocity: "rapid",
        overallInstitutionalScore: 18,
        judicialIndependence: 4,
        mediaFreedom: 4,
        electoralIntegrity: 3,
        civicSpace: 4,
        checksAndBalances: 3,
        judicialIndependenceRationale: "Judicial institutions retain significant capacity, while politicisation risks are part of the trajectory analysis.",
        mediaFreedomRationale: "Media freedom remains structurally strong, but trust and fragmentation are relevant contextual pressures.",
        electoralIntegrityRationale: "Electoral integrity is assessed under pressure because electoral trust and administration are contested.",
        civicSpaceRationale: "Civic space remains broad, though polarisation affects institutional operating conditions.",
        checksAndBalancesRationale: "Checks remain meaningful but are increasingly contested as norms and procedures.",
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        shortRationale: "Included as the primary demonstration case for the distinction between institutional strength and deteriorating direction.",
        trajectoryAnalysis: "The United States illustrates the central RETHINKK distinction: a country can retain deep institutional capacity while moving in a concerning direction. The observation is not that democratic institutions have disappeared, but that electoral trust, checks and institutional restraint are increasingly contested as operating norms rather than merely policy disagreements.",
        whatChanged: "Development record: models a country where strong remaining institutions can still move in a negative direction.",
        assessment: "This seed assessment is labelled institutional erosion with rapid deterioration to demonstrate the core thesis. It is not a final RETHINKK research judgement.",
        sourceIds: ["vdem", "freedomHouse", "electionAuthorities"]
      }),
      assessment({
        id: "ddi-2026-hun",
        iso3: "HUN",
        status: "erosion",
        direction: "deteriorating",
        velocity: "normal",
        overallInstitutionalScore: 12,
        judicialIndependence: 2,
        mediaFreedom: 2,
        electoralIntegrity: 3,
        civicSpace: 2,
        checksAndBalances: 3,
        judicialIndependenceRationale: "Judicial independence is modelled as weak under sustained institutional pressure.",
        mediaFreedomRationale: "Media freedom is scored low to represent limited pluralism in the development dataset.",
        electoralIntegrityRationale: "Electoral integrity remains assessed as under pressure rather than absent.",
        civicSpaceRationale: "Civic space is represented as weak due to cumulative constraints.",
        checksAndBalancesRationale: "Checks and balances are present but materially strained.",
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        shortRationale: "Development record for sustained institutional pressure across multiple dimensions.",
        trajectoryAnalysis: "Hungary is used here as a development case for prolonged institutional narrowing. The direction is deteriorating because pressure is represented as cumulative: media pluralism, checks on executive authority and independent institutional space are not treated as isolated incidents, but as mutually reinforcing movement.",
        whatChanged: "Development record: used to test how the interface handles an erosion classification with normal deterioration velocity.",
        assessment: "Direction and status remain independent: the low score supports the status, while velocity describes the current rate of movement.",
        sourceIds: ["vdem", "freedomHouse", "rsf"]
      }),
      assessment({
        id: "ddi-2026-pol",
        iso3: "POL",
        status: "erosion",
        direction: "improving",
        velocity: "normal",
        overallInstitutionalScore: 16,
        judicialIndependence: 3,
        mediaFreedom: 3,
        electoralIntegrity: 4,
        civicSpace: 3,
        checksAndBalances: 3,
        judicialIndependenceRationale: "Judicial independence remains under pressure but is the key area for potential recovery.",
        mediaFreedomRationale: "Media freedom is assessed as under pressure while direction may improve.",
        electoralIntegrityRationale: "Electoral integrity remains comparatively stronger in this seed record.",
        civicSpaceRationale: "Civic space is under pressure but not closed.",
        checksAndBalancesRationale: "Checks and balances are strained, with recovery potential reflected in direction.",
        confidence: "medium",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        shortRationale: "Development record for a pressured institutional status that may be improving.",
        trajectoryAnalysis: "Poland demonstrates why status and direction must remain separate. The record can still sit under institutional erosion while the direction turns positive if judicial, media or accountability institutions begin recovering autonomy. Improvement does not erase the status; it marks movement within it.",
        whatChanged: "Development record: included to show that institutional erosion and improvement can coexist in the same annual assessment.",
        assessment: "The status remains erosion while the trajectory is improving. This is the conceptual separation the index is built to preserve.",
        relatedContent: ["think-accountability"],
        sourceIds: ["vdem", "idea", "rsf"]
      }),
      assessment({
        id: "ddi-2026-geo",
        iso3: "GEO",
        status: "erosion",
        direction: "deteriorating",
        velocity: "rapid",
        overallInstitutionalScore: 14,
        judicialIndependence: 3,
        mediaFreedom: 3,
        electoralIntegrity: 3,
        civicSpace: 2,
        checksAndBalances: 3,
        judicialIndependenceRationale: "Judicial independence is represented as under pressure in a contested institutional environment.",
        mediaFreedomRationale: "Media freedom is scored as under pressure, with trajectory more important than the absolute number.",
        electoralIntegrityRationale: "Electoral integrity remains under pressure in this development record.",
        civicSpaceRationale: "Civic space is weak in the seed data because rapid deterioration is being modelled.",
        checksAndBalancesRationale: "Checks and balances are assessed as present but strained.",
        confidence: "low",
        assessmentStatus: "published",
        reviewedBy: "RETHINKK Research",
        shortRationale: "Development record for rapid movement in a contested institutional environment.",
        trajectoryAnalysis: "Georgia is included as a rapid-movement case: the signal is not only institutional condition, but acceleration. When civic space, institutional independence and political contestation shift quickly, the index should make speed visible instead of hiding it behind a single annual score.",
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

export function deriveHistoricalComparison(country: CountryAssessment, editions = democracyDirectionEditions) {
  const previous = editions
    .find((edition) => edition.status === "published" && edition.year === country.year - 1)
    ?.assessments.find((assessment) => assessment.iso3 === country.iso3 && assessment.assessmentStatus === "published");
  return {
    previousYearStatus: previous?.status || null,
    previousYearScore: previous?.overallInstitutionalScore ?? null,
    scoreChange: previous?.overallInstitutionalScore !== null && previous?.overallInstitutionalScore !== undefined && country.overallInstitutionalScore !== null
      ? country.overallInstitutionalScore - previous.overallInstitutionalScore
      : null
  };
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
      .map((country) => {
        const comparison = deriveHistoricalComparison(country);
        return {
          country: country.countryName,
          iso2: country.iso2,
          iso3: country.iso3,
          region: country.region,
          status: country.status,
          direction: country.direction,
          velocity: country.velocity,
          overallInstitutionalScore: country.overallInstitutionalScore,
          judicialIndependence: country.judicialIndependence,
          judicialIndependenceRationale: country.judicialIndependenceRationale,
          mediaFreedom: country.mediaFreedom,
          mediaFreedomRationale: country.mediaFreedomRationale,
          electoralIntegrity: country.electoralIntegrity,
          electoralIntegrityRationale: country.electoralIntegrityRationale,
          civicSpace: country.civicSpace,
          civicSpaceRationale: country.civicSpaceRationale,
          checksAndBalances: country.checksAndBalances,
          checksAndBalancesRationale: country.checksAndBalancesRationale,
          confidence: country.confidence,
          shortRationale: country.shortRationale,
          trajectoryAnalysis: country.trajectoryAnalysis,
          whatChanged: country.whatChanged,
          assessment: country.assessment,
          sources: country.sources,
          previousYearStatus: comparison.previousYearStatus,
          previousYearScore: comparison.previousYearScore,
          scoreChange: comparison.scoreChange
        };
      })
  };
}

export function validateAssessment(country: CountryAssessment) {
  const errors: string[] = [];
  const dimensions: Array<[InstitutionDimensionKey, number | null, string]> = [
    ["judicialIndependence", country.judicialIndependence, country.judicialIndependenceRationale],
    ["mediaFreedom", country.mediaFreedom, country.mediaFreedomRationale],
    ["electoralIntegrity", country.electoralIntegrity, country.electoralIntegrityRationale],
    ["civicSpace", country.civicSpace, country.civicSpaceRationale],
    ["checksAndBalances", country.checksAndBalances, country.checksAndBalancesRationale]
  ];
  dimensions.forEach(([dimension, score, rationale]) => {
    if (score !== null && (score < 1 || score > 5)) errors.push(`${dimension} must be 1-5`);
    if (country.assessmentStatus === "published" && score !== null && !rationale) errors.push(`published assessment requires ${dimension} rationale`);
  });
  if (country.overallInstitutionalScore !== null && (country.overallInstitutionalScore < 5 || country.overallInstitutionalScore > 25)) {
    errors.push("overallInstitutionalScore must be 5-25");
  }
  if (country.year !== Number(country.indexEditionId.replace("ddi-", ""))) errors.push("assessment year must match edition year");
  if (country.assessmentStatus === "published" && !country.shortRationale) errors.push("published assessment requires rationale");
  if (country.assessmentStatus === "published" && !country.trajectoryAnalysis) errors.push("published assessment requires trajectory analysis");
  if (country.assessmentStatus === "published" && country.sources.length === 0) errors.push("published assessment requires evidence");
  country.sources.forEach((source, index) => {
    if (!source.organisation) errors.push(`source ${index + 1} requires organisation`);
    if (!source.title) errors.push(`source ${index + 1} requires title`);
    if (!source.url) errors.push(`source ${index + 1} requires url`);
    if (!source.publicationDate) errors.push(`source ${index + 1} requires publicationDate`);
    if (!source.accessedAt) errors.push(`source ${index + 1} requires accessedAt`);
    source.supports?.forEach((dimension) => {
      if (!["judicialIndependence", "mediaFreedom", "electoralIntegrity", "civicSpace", "checksAndBalances"].includes(dimension)) {
        errors.push(`source ${index + 1} has invalid supports dimension`);
      }
    });
  });
  return errors;
}
