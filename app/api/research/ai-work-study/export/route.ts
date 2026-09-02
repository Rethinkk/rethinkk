import { NextRequest, NextResponse } from "next/server";
import {
  buildOpenTextExport,
  buildResearchSummary,
  getContactRecords,
  getSurveyRecords,
  isResearchStorageConfigured
} from "@/lib/ai-work-study-storage";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isResearchStorageConfigured()) {
    return NextResponse.json({ ok: false, message: "Research storage is not configured yet." }, { status: 503 });
  }

  if (!isAuthorised(request)) {
    return NextResponse.json({ ok: false, message: "Research desk token is required." }, { status: 401 });
  }

  const dataset = request.nextUrl.searchParams.get("dataset") || "summary";
  const format = request.nextUrl.searchParams.get("format") || "json";
  let surveys;

  try {
    surveys = await getSurveyRecords();
  } catch {
    return NextResponse.json({ ok: false, message: "Research storage could not be read." }, { status: 502 });
  }

  let data: unknown;
  let filename = "rthnk-ai-work-study-summary";

  if (dataset === "contacts") {
    try {
      data = await getContactRecords();
    } catch {
      return NextResponse.json({ ok: false, message: "Research contacts could not be read." }, { status: 502 });
    }
    filename = "rthnk-ai-work-study-interview-contacts";
  } else if (dataset === "open_text") {
    data = buildOpenTextExport(surveys);
    filename = "rthnk-ai-work-study-open-text";
  } else if (dataset === "full") {
    data = surveys;
    filename = "rthnk-ai-work-study-anonymous-responses";
  } else {
    data = buildResearchSummary(surveys);
  }

  if (format === "csv") {
    return new NextResponse(toCsv(Array.isArray(data) ? data : [data as Record<string, unknown>]), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}.csv"`
      }
    });
  }

  return NextResponse.json({ ok: true, dataset, data });
}

function isAuthorised(request: NextRequest) {
  const token = process.env.RESEARCH_ADMIN_TOKEN;
  if (!token) return false;

  const bearer = request.headers.get("authorization");
  if (bearer === `Bearer ${token}`) return true;

  return request.nextUrl.searchParams.get("token") === token;
}

function toCsv(records: Array<Record<string, unknown>>) {
  const headers = Array.from(new Set(records.flatMap((record) => Object.keys(record))));
  const rows = records.map((record) => headers.map((header) => csvCell(record[header])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function csvCell(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}
