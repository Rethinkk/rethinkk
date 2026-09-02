# RTHNK AI Work Study Production Setup

The AI Work Study survey uses server-side storage and optional confirmation email.

## Required Vercel environment variables

- `KV_REST_API_URL` or `UPSTASH_REDIS_REST_URL`
  - Purpose: central survey storage endpoint.
- `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_TOKEN`
  - Purpose: private token for central survey storage.
- `RESEARCH_ADMIN_TOKEN`
  - Purpose: protects `/desk` research exports.

## Optional email variables

- `RESEND_API_KEY`
  - Purpose: sends confirmation emails to respondents who share contact details.
- `RESEARCH_EMAIL_FROM`
  - Purpose: sender identity. Default is `RTHNK Research <research@rethinkk.org>`.

## Data separation

- Anonymous survey responses are stored under `rthnk:ai-work-study:survey:*`.
- Interview contact records are stored separately under `rthnk:ai-work-study:contact:*`.
- The research desk reads exports only when `RESEARCH_ADMIN_TOKEN` is supplied.

## Desk exports

- `summary`: response count and dependency segmentation.
- `full`: anonymous survey responses.
- `contacts`: interview contact list.
- `open_text`: qualitative answers and potential identifier flag.
