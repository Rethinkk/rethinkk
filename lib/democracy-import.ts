import type {
  AssessmentStatus,
  Confidence,
  CountryAssessment,
  DemocracyStatus,
  Direction,
  Region,
  SourceReference,
  Velocity
} from "./democracy-index.ts";
import { validateAssessment } from "./democracy-index.ts";

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

const sampleSource: SourceReference = {
  id: "import-review",
  organisation: "RETHINKK Desk",
  title: "Imported assessment pending evidence review",
  url: "https://rethinkk.org",
  accessedAt: "2026-08-30",
  sourceType: "primary",
  note: "Replace with structured source references before publication."
};

export const sampleDemocracyCsv = `country,iso2,iso3,region,year,status,direction,velocity,overall_score,judicial_independence,media_freedom,electoral_integrity,civic_space,checks_balances,confidence,assessment_status,short_rationale,trajectory_analysis,what_changed,assessment
Netherlands,NL,NLD,Europe,2026,resilient,stable,limited,21,5,4,4,4,4,medium,review,"Institutions remain resilient.","Movement is stable, but institutional capacity and trust require monitoring.","Development review note.","RETHINKK assessment note."
United States,US,USA,North America,2026,erosion,deteriorating,rapid,18,4,4,3,4,3,medium,review,"Strong institutions can still deteriorate.","The direction signal concerns contested norms around electoral trust and institutional restraint.","Development review note.","RETHINKK assessment note."`;

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
  const countryName = requiredString(raw, errors, "country", "countryName");
  const iso2 = requiredString(raw, errors, "iso2").toUpperCase();
  const iso3 = requiredString(raw, errors, "iso3").toUpperCase();
  const year = readNumber(raw, "year") ?? editionYear;
  const status = enumValue(raw, errors, statuses, "status");
  const direction = enumValue(raw, errors, directions, "direction");
  const velocity = enumValue(raw, errors, velocities, "velocity");
  const confidence = enumValue(raw, errors, confidences, "confidence");
  const assessmentStatus = enumValue(raw, errors, assessmentStatuses, "assessment_status", "assessmentStatus") || "review";
  const region = enumValue(raw, errors, regions, "region") || "Europe";
  const overallInstitutionalScore = readNumber(raw, "overall_score", "overallInstitutionalScore");
  const shortRationale = requiredString(raw, errors, "short_rationale", "shortRationale");
  const trajectoryAnalysis = readString(raw, "trajectory_analysis", "trajectoryAnalysis") || "Imported trajectory observation pending editorial review.";
  const whatChanged = readString(raw, "what_changed", "whatChanged") || "Imported working note pending editorial review.";
  const assessmentText = readString(raw, "assessment") || "Imported assessment pending RETHINKK review.";

  if (!countryName || !iso2 || !iso3 || !status || !direction || !velocity || !confidence || errors.length) {
    return { errors, assessment: null };
  }

  const assessment: CountryAssessment = {
    id: `ddi-${year}-${iso3.toLowerCase()}`,
    indexEditionId: `ddi-${year}`,
    countryName,
    slug: slugify(countryName),
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
    previousYearStatus: null,
    previousYearScore: readNumber(raw, "previous_year_score", "previousYearScore"),
    scoreChange: readNumber(raw, "score_change", "scoreChange"),
    confidence,
    assessmentStatus,
    reviewedBy: readString(raw, "reviewed_by", "reviewedBy") || "RETHINKK Desk",
    reviewedAt: readString(raw, "reviewed_at", "reviewedAt") || new Date().toISOString().slice(0, 10),
    latitude: readNumber(raw, "latitude") ?? 0,
    longitude: readNumber(raw, "longitude") ?? 0,
    shortRationale,
    trajectoryAnalysis,
    whatChanged,
    assessment: assessmentText,
    sources: assessmentStatus === "published" ? [sampleSource] : []
  };

  return { errors, assessment };
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
    "media_freedom",
    "electoral_integrity",
    "civic_space",
    "checks_balances",
    "confidence",
    "assessment_status",
    "short_rationale",
    "trajectory_analysis",
    "what_changed",
    "assessment"
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
    country.mediaFreedom,
    country.electoralIntegrity,
    country.civicSpace,
    country.checksAndBalances,
    country.confidence,
    country.assessmentStatus,
    country.shortRationale,
    country.trajectoryAnalysis,
    country.whatChanged,
    country.assessment
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
