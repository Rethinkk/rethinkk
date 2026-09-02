import { NextRequest, NextResponse } from "next/server";
import {
  isResearchStorageConfigured,
  normaliseContactPayload,
  normaliseSurveyPayload,
  storeResearchSubmission,
  type ResearchPayload,
  type StoredContactRecord
} from "@/lib/ai-work-study-storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isResearchStorageConfigured()) {
    return NextResponse.json({
      ok: false,
      message: "Research storage is not configured yet."
    }, { status: 503 });
  }

  let payload: ResearchPayload;
  try {
    payload = await request.json() as ResearchPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON payload." }, { status: 400 });
  }

  const survey = normaliseSurveyPayload(payload);
  if (!survey) {
    return NextResponse.json({
      ok: false,
      message: "A valid anonymous response ID and consent timestamp are required."
    }, { status: 400 });
  }

  const contact = normaliseContactPayload(payload, survey.anonymous_response_id);
  try {
    await storeResearchSubmission(survey, contact);
  } catch {
    return NextResponse.json({
      ok: false,
      message: "Research storage could not save this response."
    }, { status: 502 });
  }

  const email = await sendConfirmationEmail(contact);

  return NextResponse.json({
    ok: true,
    stored: true,
    anonymous_response_id: survey.anonymous_response_id,
    contact_stored: Boolean(contact),
    email
  });
}

async function sendConfirmationEmail(contact: StoredContactRecord | null) {
  if (!contact) return { sent: false, skipped: true, reason: "anonymous_response" };

  const email = typeof contact.email === "string" ? contact.email.trim() : "";
  if (!email) return { sent: false, skipped: true, reason: "missing_contact_email" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, skipped: true, reason: "missing_resend_api_key" };

  const from = process.env.RESEARCH_EMAIL_FROM || "RTHNK Research <research@rethinkk.org>";
  const name = typeof contact.first_name === "string" && contact.first_name.trim() ? contact.first_name.trim() : "there";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: email,
      reply_to: "research@rethinkk.org",
      subject: "RTHNK AI Work Study - response received",
      text: [
        `Hi ${name},`,
        "",
        "Thank you for contributing to The AI Work Study.",
        "Your survey response has been received by RTHNK Research.",
        "",
        "If you agreed to a follow-up conversation, RTHNK may contact you from research@rethinkk.org.",
        "",
        "RTHNK Research"
      ].join("\n")
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    return { sent: false, skipped: false, reason: `email_provider_${response.status}` };
  }

  return { sent: true, skipped: false };
}
