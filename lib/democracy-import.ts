import type {
  AssessmentStatus,
  Confidence,
  CountryAssessment,
  DemocracyStatus,
  Direction,
  InstitutionDimensionKey,
  Region,
  SourceReference,
  Velocity
} from "./democracy-index.ts";
import { deriveHistoricalComparison, getCountryMetadata, validateAssessment } from "./democracy-index.ts";

export type ImportFormat = "csv" | "json";

export type ImportPreview = {
  format: ImportFormat;
  accepted: CountryAssessment[];
  rejected: Array<{ row: number; country?: string; errors: string[] }>;
  normalizedJson: string;
  normalizedCsv: string;
};

type RawRecord = Record<string, unknown>;

const statuses: DemocracyStatus[] = ["resilient", "erosion", "autocratic", "not_assessed"];
const directions: Direction[] = ["improving", "stable", "deteriorating"];
const velocities: Velocity[] = ["rapid", "normal", "limited"];
const confidences: Confidence[] = ["high", "medium", "low"];
const assessmentStatuses: AssessmentStatus[] = ["draft", "review", "approved", "published"];
const regions: Region[] = ["Europe", "North America", "Latin America & Caribbean", "Africa", "Middle East", "Asia", "Oceania"];
const sourceTypes: SourceReference["sourceType"][] = ["primary", "official", "academic", "ngo", "research", "legal", "media"];
const dimensions: InstitutionDimensionKey[] = ["judicialIndependence", "mediaFreedom", "electoralIntegrity", "civicSpace", "checksAndBalances"];

export const sampleDemocracyCsv = `country,iso2,iso3,region,year,status,direction,velocity,overall_score,judicial_independence,judicial_independence_rationale,media_freedom,media_freedom_rationale,electoral_integrity,electoral_integrity_rationale,civic_space,civic_space_rationale,checks_balances,checks_balances_rationale,confidence,assessment_status,short_rationale,trajectory_analysis,what_changed,assessment,sources_json
Netherlands,NL,NLD,Europe,2026,resilient,stable,limited,21,5,"Courts are institutionally independent.",4,"Pluralism remains strong while pressure points are monitored.",4,"Election administration remains reliable.",4,"Civic space remains open.",4,"Checks remain functional.",medium,review,"Institutions remain resilient.","Movement is stable, but institutional capacity and trust require monitoring.","Development review note.","RETHINKK assessment note.","[]"`;

export function parseDemocracyImport(input: string, format?: ImportFormat, editionYear = 2026): ImportPreview {
  const trimmed = input.trim();
  const detectedFormat = format || (trimmed.startsWith("[") || trimmed.startsWith("{") ? "json" : "csv");
  const rawRecords = detectedFormat === "json" ? parseJson(trimmed) : parseCsv(trimmed);
  const accepted: CountryAssessment[] = [];
  const rejected: ImportPreview["rejected"] = [];

  rawRecords.forEach((raw, index) => {
    const row = index + 2;
    const normalized = normalizeRecord(raw, editionYear);
    const errors = normalized.errors;
    if (normalized.assessment) errors.push(...validateAssessment(normalized.assessment));
    if (errors.length || !normalized.assessment) {
      rejected.push({ row, country: readString(raw, "country", "countryName"), errors });
      return;
    }
    accepted.push(normalized.assessment);
  });

  return {
    format: detectedFormat,
    accepted,
    rejected,
    normalizedJson: JSON.stringify(accepted, null, 2),
    normalizedCsv: toCsv(accepted)
  };
}

function parseJson(input: string): RawRecord[] {
  const parsed = JSON.parse(input);
  if (Array.isArray(parsed)) return parsed as RawRecord[];
  if (Array.isArray(parsed.assessments)) return parsed.assessments as RawRecord[];
  return [parsed as RawRecord];
}

function parseCsv(input: string): RawRecord[] {
  const rows = input.split(/\r?\n/).filter((line) => line.trim());
  if (rows.length < 2) return [];
  const headers = splitCsvLine(rows[0]).map((header) => header.trim());
  return rows.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === "\"" && quoted && next === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function normalizeRecord(raw: RawRecord, editionYear: number) {
  const errors: string[] = [];
  const iso3 = requiredString(raw, errors, "iso3").toUpperCase();
  const metadata = getCountryMetadata(iso3);
  const countryName = metadata?.countryName || requiredString(raw, errors, "country", "countryName");
  const iso2 = metadata?.iso2 || requiredString(raw, errors, "iso2").toUpperCase();
  const year = readNumber(raw, "year") ?? editionYear;
  const status = enumValue(raw, errors, statuses, "status");
  const direction = enumValue(raw, errors, directions, "direction");
  const velocity = enumValue(raw, errors, velocities, "velocity");
  const confidence = enumValue(raw, errors, confidences, "confidence");
  const assessmentStatus = optionalEnumValue(raw, errors, assessmentStatuses, "assessment_status", "assessmentStatus") || "review";
  const region = metadata?.region || optionalEnumValue(raw, errors, regions, "region") || "Europe";
  const overallInstitutionalScore = readNumber(raw, "overall_score", "overallInstitutionalScore");
  const shortRationale = requiredString(raw, errors, "short_rationale", "shortRationale");
  const trajectoryAnalysis = readString(raw, "trajectory_analysis", "trajectoryAnalysis") || "Imported trajectory observation pending editorial review.";
  const whatChanged = readString(raw, "what_changed", "whatChanged") || "Imported working note pending editorial review.";
  const assessmentText = readString(raw, "assessment") || "Imported assessment pending RETHINKK review.";
  const sources = normalizeSources(raw, errors);

  if (!countryName || !iso2 || !iso3 || !status || !direction || !velocity || !confidence || errors.length) {
    return { errors, assessment: null };
  }

  const assessmentBase: CountryAssessment = {
    id: `ddi-${year}-${iso3.toLowerCase()}`,
    indexEditionId: `ddi-${year}`,
    countryName: metadata?.countryName || countryName,
    slug: metadata?.slug || slugify(countryName),
    iso2,
    iso3,
    region,
    year,
    status,
    direction,
    velocity,
    overallInstitutionalScore,
    judicialIndependence: readNumber(raw, "judicial_independence", "judicialIndependence"),
    mediaFreedom: readNumber(raw, "media_freedom", "mediaFreedom"),
    electoralIntegrity: readNumber(raw, "electoral_integrity", "electoralIntegrity"),
    civicSpace: readNumber(raw, "civic_space", "civicSpace"),
    checksAndBalances: readNumber(raw, "checks_balances", "checksAndBalances"),
    judicialIndependenceRationale: readString(raw, "judicial_independence_rationale", "judicialIndependenceRationale"),
    mediaFreedomRationale: readString(raw, "media_freedom_rationale", "mediaFreedomRationale"),
    electoralIntegrityRationale: readString(raw, "electoral_integrity_rationale", "electoralIntegrityRationale"),
    civicSpaceRationale: readString(raw, "civic_space_rationale", "civicSpaceRationale"),
    checksAndBalancesRationale: readString(raw, "checks_balances_rationale", "checksAndBalancesRationale"),
    previousYearStatus: null,
    previousYearScore: null,
    scoreChange: null,
    confidence,
    assessmentStatus,
    reviewedBy: readString(raw, "reviewed_by", "reviewedBy") || "RETHINKK Desk",
    reviewedAt: readString(raw, "reviewed_at", "reviewedAt") || new Date().toISOString().slice(0, 10),
    latitude: metadata?.latitude ?? readNumber(raw, "latitude") ?? 0,
    longitude: metadata?.longitude ?? readNumber(raw, "longitude") ?? 0,
    shortRationale,
    trajectoryAnalysis,
    whatChanged,
    assessment: assessmentText,
    sources
  };

  const assessment: CountryAssessment = {
    ...assessmentBase,
    ...deriveHistoricalComparison(assessmentBase)
  };

  return { errors, assessment };
}

function normalizeSources(raw: RawRecord, errors: string[]) {
  const sourceValue = raw.sources ?? raw.sources_json ?? raw.sourcesJson;
  if (!sourceValue) return [];
  let sources: unknown;
  try {
    sources = typeof sourceValue === "string" ? JSON.parse(sourceValue) : sourceValue;
  } catch {
    errors.push("sources must be valid JSON");
    return [];
  }
  if (!Array.isArray(sources)) {
    errors.push("sources must be an array");
    return [];
  }
  return sources.map((source, index) => normalizeSource(source as RawRecord, index, errors)).filter(Boolean) as SourceReference[];
}

function normalizeSource(source: RawRecord, index: number, errors: string[]) {
  const sourceType = enumValue(source, errors, sourceTypes, "sourceType", "source_type");
  const supports = normalizeSupports(source.supports, index, errors);
  const organisation = requiredString(source, errors, "organisation");
  const title = requiredString(source, errors, "title");
  const url = requiredString(source, errors, "url", "URL");
  const publicationDate = requiredString(source, errors, "publicationDate", "publication_date");
  if (!sourceType || !organisation || !title || !url || !publicationDate) return null;
  return {
    id: readString(source, "id") || slugify(`${organisation}-${title}`),
    organisation,
    title,
    url,
    publicationDate,
    accessedAt: readString(source, "accessedAt", "accessed_at") || new Date().toISOString().slice(0, 10),
    sourceType,
    note: readString(source, "note") || undefined,
    supports
  };
}

function normalizeSupports(value: unknown, index: number, errors: string[]) {
  if (!value) return undefined;
  const rawSupports = Array.isArray(value) ? value : String(value).split(/[;|]/);
  const result: InstitutionDimensionKey[] = [];
  rawSupports.forEach((item) => {
    const match = dimensions.find((dimension) => normalizeEnum(dimension) === normalizeEnum(String(item)));
    if (match) result.push(match);
    else errors.push(`source ${index + 1} supports contains invalid dimension: ${item}`);
  });
  return result.length ? result : undefined;
}

function readString(raw: RawRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function requiredString(raw: RawRecord, errors: string[], ...keys: string[]) {
  const value = readString(raw, ...keys);
  if (!value) errors.push(`${keys[0]} is required`);
  return value;
}

function readNumber(raw: RawRecord, ...keys: string[]) {
  const value = readString(raw, ...keys);
  if (!value) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function enumValue<T extends string>(raw: RawRecord, errors: string[], allowed: readonly T[], ...keys: string[]) {
  const value = normalizeEnum(readString(raw, ...keys));
  if (!value) {
    errors.push(`${keys[0]} is required`);
    return null;
  }
  const match = allowed.find((item) => normalizeEnum(item) === value);
  if (!match) {
    errors.push(`${keys[0]} must be one of: ${allowed.join(", ")}`);
    return null;
  }
  return match;
}

function optionalEnumValue<T extends string>(raw: RawRecord, errors: string[], allowed: readonly T[], ...keys: string[]) {
  const value = normalizeEnum(readString(raw, ...keys));
  if (!value) return null;
  const match = allowed.find((item) => normalizeEnum(item) === value);
  if (!match) {
    errors.push(`${keys[0]} must be one of: ${allowed.join(", ")}`);
    return null;
  }
  return match;
}

function normalizeEnum(value: string) {
  return value.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function toCsv(assessments: CountryAssessment[]) {
  const headers = [
    "country",
    "iso2",
    "iso3",
    "region",
    "year",
    "status",
    "direction",
    "velocity",
    "overall_score",
    "judicial_independence",
    "judicial_independence_rationale",
    "media_freedom",
    "media_freedom_rationale",
    "electoral_integrity",
    "electoral_integrity_rationale",
    "civic_space",
    "civic_space_rationale",
    "checks_balances",
    "checks_balances_rationale",
    "confidence",
    "assessment_status",
    "short_rationale",
    "trajectory_analysis",
    "what_changed",
    "assessment",
    "sources_json",
    "previous_year_status",
    "previous_year_score",
    "score_change"
  ];
  const rows = assessments.map((country) => [
    country.countryName,
    country.iso2,
    country.iso3,
    country.region,
    country.year,
    country.status,
    country.direction,
    country.velocity,
    country.overallInstitutionalScore,
    country.judicialIndependence,
    country.judicialIndependenceRationale,
    country.mediaFreedom,
    country.mediaFreedomRationale,
    country.electoralIntegrity,
    country.electoralIntegrityRationale,
    country.civicSpace,
    country.civicSpaceRationale,
    country.checksAndBalances,
    country.checksAndBalancesRationale,
    country.confidence,
    country.assessmentStatus,
    country.shortRationale,
    country.trajectoryAnalysis,
    country.whatChanged,
    country.assessment,
    JSON.stringify(country.sources),
    country.previousYearStatus,
    country.previousYearScore,
    country.scoreChange
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
