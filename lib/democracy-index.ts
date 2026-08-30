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

import reviewData from "../data/democracy-direction-2026-review.json" with { type: "json" };

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
  { countryName: "Austria", slug: "austria", iso2: "AT", iso3: "AUT", region: "Europe", latitude: 47.5, longitude: 14.5 },
  { countryName: "Italy", slug: "italy", iso2: "IT", iso3: "ITA", region: "Europe", latitude: 41.9, longitude: 12.6 },
  { countryName: "France", slug: "france", iso2: "FR", iso3: "FRA", region: "Europe", latitude: 46.2, longitude: 2.2 },
  { countryName: "United States", slug: "united-states", iso2: "US", iso3: "USA", region: "North America", latitude: 39.8, longitude: -98.6 },
  { countryName: "India", slug: "india", iso2: "IN", iso3: "IND", region: "Asia", latitude: 20.6, longitude: 78.9 },
  { countryName: "Israel", slug: "israel", iso2: "IL", iso3: "ISR", region: "Middle East", latitude: 31, longitude: 35 },
  { countryName: "Brazil", slug: "brazil", iso2: "BR", iso3: "BRA", region: "Latin America & Caribbean", latitude: -14.2, longitude: -51.9 },
  { countryName: "Serbia", slug: "serbia", iso2: "RS", iso3: "SRB", region: "Europe", latitude: 44, longitude: 20.9 },
  { countryName: "Tunisia", slug: "tunisia", iso2: "TN", iso3: "TUN", region: "Africa", latitude: 34, longitude: 9.5 },
  { countryName: "Hungary", slug: "hungary", iso2: "HU", iso3: "HUN", region: "Europe", latitude: 47.2, longitude: 19.5 },
  { countryName: "Poland", slug: "poland", iso2: "PL", iso3: "POL", region: "Europe", latitude: 52, longitude: 19.1 },
  { countryName: "Georgia", slug: "georgia", iso2: "GE", iso3: "GEO", region: "Asia", latitude: 42.3, longitude: 43.4 },
  { countryName: "Sweden", slug: "sweden", iso2: "SE", iso3: "SWE", region: "Europe", latitude: 60.1, longitude: 18.6 },
  { countryName: "Slovenia", slug: "slovenia", iso2: "SI", iso3: "SVN", region: "Europe", latitude: 46.2, longitude: 14.9 },
  { countryName: "Turkey", slug: "turkey", iso2: "TR", iso3: "TUR", region: "Middle East", latitude: 39, longitude: 35.2 },
  { countryName: "Russia", slug: "russia", iso2: "RU", iso3: "RUS", region: "Europe", latitude: 61.5, longitude: 105.3 },
  { countryName: "Venezuela", slug: "venezuela", iso2: "VE", iso3: "VEN", region: "Latin America & Caribbean", latitude: 6.4, longitude: -66.6 },
  { countryName: "Iran", slug: "iran", iso2: "IR", iso3: "IRN", region: "Middle East", latitude: 32.4, longitude: 53.7 },
  { countryName: "Nicaragua", slug: "nicaragua", iso2: "NI", iso3: "NIC", region: "Latin America & Caribbean", latitude: 12.9, longitude: -85.2 }
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

type ImportedSource = Omit<SourceReference, "id" | "accessedAt"> & Partial<Pick<SourceReference, "id" | "accessedAt">>;

type AnnualAssessmentInput = Omit<
  CountryAssessment,
  "id" | "countryName" | "slug" | "iso2" | "region" | "latitude" | "longitude" | "indexEditionId" | "year" | "sources" | "reviewedAt" | "previousYearStatus" | "previousYearScore" | "scoreChange"
> & {
  id?: string;
  year?: number;
  reviewedAt?: string;
  sourceIds?: string[];
  sources?: ImportedSource[];
};

function assessment(partial: AnnualAssessmentInput): CountryAssessment {
  const metadata = getCountryMetadata(partial.iso3);
  if (!metadata) throw new Error(`Missing country metadata for ${partial.iso3}`);
  const year = partial.year || 2026;
  return {
    ...partial,
    id: partial.id || `${metadata.iso3.toLowerCase()}-${year}`,
    countryName: metadata.countryName,
    slug: metadata.slug,
    iso2: metadata.iso2,
    region: metadata.region,
    latitude: metadata.latitude,
    longitude: metadata.longitude,
    indexEditionId: `ddi-${year}`,
    year,
    previousYearStatus: null,
    previousYearScore: null,
    scoreChange: null,
    reviewedAt: partial.reviewedAt || "2026-08-29",
    sources: partial.sources ? partial.sources.map(normalizeSource) : (partial.sourceIds || []).map((id) => sourceLibrary[id])
  };
}

function normalizeSource(source: ImportedSource): SourceReference {
  return {
    ...source,
    id: source.id || slugify(`${source.organisation}-${source.title}`),
    accessedAt: source.accessedAt || "2026-08-30"
  };
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
    assessments: (reviewData.assessments as AnnualAssessmentInput[]).map((item) => assessment(item))
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
  return getEdition(year)?.assessments.find((country) => country.slug === slug && isVisibleAssessment(country));
}

export function isVisibleAssessment(country: CountryAssessment) {
  return country.assessmentStatus === "published" || country.assessmentStatus === "review";
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
    ?.assessments.find((assessment) => assessment.iso3 === country.iso3 && isVisibleAssessment(assessment));
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
      .filter(isVisibleAssessment)
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
