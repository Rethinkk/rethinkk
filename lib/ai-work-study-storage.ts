export type ResearchPayload = {
  survey_responses?: Record<string, unknown>;
  interview_contacts?: Record<string, unknown>;
};

export type StoredSurveyRecord = Record<string, unknown> & {
  anonymous_response_id: string;
  submitted_at: string;
};

export type StoredContactRecord = Record<string, unknown> & {
  anonymous_response_id: string;
  stored_at: string;
};

const surveyIdsKey = "rthnk:ai-work-study:survey_ids";
const contactIdsKey = "rthnk:ai-work-study:contact_ids";
const surveyRecordPrefix = "rthnk:ai-work-study:survey:";
const contactRecordPrefix = "rthnk:ai-work-study:contact:";

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token };
}

export function isResearchStorageConfigured() {
  const { url, token } = redisConfig();
  return Boolean(url && token);
}

async function redisCommand<T>(command: Array<string | number>) {
  const { url, token } = redisConfig();
  if (!url || !token) throw new Error("Research storage is not configured.");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`Research storage returned ${response.status}.`);

  const data = await response.json() as { result?: T; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result as T;
}

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function normaliseSurveyPayload(payload: ResearchPayload) {
  const survey = asRecord(payload.survey_responses);
  if (!survey) return null;

  const anonymousId = typeof survey.anonymous_response_id === "string" ? survey.anonymous_response_id : "";
  const consentAt = typeof survey.consent_at === "string" ? survey.consent_at : "";
  if (!anonymousId || !consentAt) return null;

  return {
    ...survey,
    anonymous_response_id: anonymousId,
    submitted_at: typeof survey.submitted_at === "string" ? survey.submitted_at : new Date().toISOString()
  } satisfies StoredSurveyRecord;
}

export function normaliseContactPayload(payload: ResearchPayload, anonymousId: string) {
  const contact = asRecord(payload.interview_contacts);
  if (!contact) return null;

  const permission = typeof contact.interview_permission === "string" ? contact.interview_permission : "No";
  const hasContactData = ["first_name", "email", "phone_optional", "country", "preferred_language"].some((field) => {
    const value = contact[field];
    return typeof value === "string" && value.trim().length > 0;
  });

  if (permission === "No" && !hasContactData) return null;

  return {
    ...contact,
    anonymous_response_id: anonymousId,
    interview_permission: permission,
    stored_at: new Date().toISOString()
  } satisfies StoredContactRecord;
}

export async function storeResearchSubmission(survey: StoredSurveyRecord, contact: StoredContactRecord | null) {
  await redisCommand<"OK">(["SET", `${surveyRecordPrefix}${survey.anonymous_response_id}`, JSON.stringify(survey)]);
  await redisCommand<number>(["SADD", surveyIdsKey, survey.anonymous_response_id]);

  if (contact) {
    await redisCommand<"OK">(["SET", `${contactRecordPrefix}${contact.anonymous_response_id}`, JSON.stringify(contact)]);
    await redisCommand<number>(["SADD", contactIdsKey, contact.anonymous_response_id]);
  }
}

async function getJsonRecords<T>(idsKey: string, recordPrefix: string) {
  const ids = await redisCommand<string[]>(["SMEMBERS", idsKey]);
  const records = await Promise.all(
    (ids || []).map(async (id) => {
      const raw = await redisCommand<string | null>(["GET", `${recordPrefix}${id}`]);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    })
  );

  const compactRecords: T[] = [];
  records.forEach((record) => {
    if (record) compactRecords.push(record);
  });
  return compactRecords;
}

export async function getSurveyRecords() {
  return getJsonRecords<StoredSurveyRecord>(surveyIdsKey, surveyRecordPrefix);
}

export async function getContactRecords() {
  return getJsonRecords<StoredContactRecord>(contactIdsKey, contactRecordPrefix);
}

export function buildResearchSummary(records: StoredSurveyRecord[]) {
  const dependencyGroups = records.reduce<Record<string, number>>((acc, record) => {
    const score = Number(record.economic_dependency_score || 0);
    const group = score === 1 ? "Group A" : score >= 2 && score <= 3 ? "Group B" : score >= 4 ? "Group C" : "Uncoded";
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, { "Group A": 0, "Group B": 0, "Group C": 0, Uncoded: 0 });

  return {
    response_count: records.length,
    dependency_groups: dependencyGroups,
    latest_submission_at: records
      .map((record) => String(record.submitted_at || ""))
      .filter(Boolean)
      .sort()
      .at(-1) || null
  };
}

export function buildOpenTextExport(records: StoredSurveyRecord[]) {
  return records.map((record) => ({
    anonymous_response_id: record.anonymous_response_id,
    submitted_at: record.submitted_at,
    country: record.country,
    advantages_text: record.advantages_text,
    disadvantages_text: record.disadvantages_text,
    living_description: record.living_description,
    postponed_what: record.postponed_what,
    conventional_job_reason: record.conventional_job_reason,
    potentially_identifiable_text: record.potentially_identifiable_text
  }));
}
