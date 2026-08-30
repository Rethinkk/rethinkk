import worldCountries from "world-countries";
import type { Country as WorldCountry } from "world-countries";
import reviewData from "../data/democracy-direction-2026-review.json" with { type: "json" };

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

const supplementalCountryMetadata: CountryMetadata[] = [
  { countryName: "Kosovo", slug: "kosovo", iso2: "XK", iso3: "XKX", region: "Europe", latitude: 42.6, longitude: 20.9 }
];

const numericCountryCodes = new Map(worldCountries.map((country) => [country.cca3, country.ccn3]));

export const countryMetadata: CountryMetadata[] = [
  ...worldCountries.map(toCountryMetadata),
  ...supplementalCountryMetadata
];

function toCountryMetadata(country: WorldCountry): CountryMetadata {
  return {
    countryName: country.name.common,
    slug: slugify(country.name.common),
    iso2: country.cca2,
    iso3: country.cca3,
    region: mapCountryRegion(country),
    latitude: country.latlng[0],
    longitude: country.latlng[1]
  };
}

function mapCountryRegion(country: WorldCountry): Region {
  if (country.region === "Europe") return "Europe";
  if (country.region === "Africa") return "Africa";
  if (country.region === "Oceania") return "Oceania";
  if (country.region === "Americas") {
    return country.subregion === "North America" ? "North America" : "Latin America & Caribbean";
  }
  if (country.subregion === "Western Asia") return "Middle East";
  return "Asia";
}

export function getCountryMetadata(iso3: string) {
  return countryMetadata.find((country) => country.iso3 === iso3.toUpperCase()) || null;
}

export function getCountryNumericCode(iso3: string) {
  return numericCountryCodes.get(iso3.toUpperCase()) || null;
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
