# The Wallace Index

A native research chapter in the existing RETHINKK Next.js application. Public routes are `/wallace-index/*`; the secure editorial desk is `/desk/wallace-index`. No legacy repository is fetched, embedded or required at build or runtime.

## Local development

Use Node.js 24 and pnpm with the committed lockfile. Run `pnpm install`, `pnpm db:generate`, then `pnpm dev`. Public pages and the independent visitor tool work without credentials. Official assessments remain empty without a connected database. Add `?demo=1` to the explore/compare routes for explicitly fictional interface fixtures.

`pnpm build` generates the Prisma client before the existing Next.js build. The database is not migrated or seeded by a build. Existing DDI data, validators, APIs and rewrites remain independent.

## Database and editorial access

The PostgreSQL hosting provider is deliberately undecided. `.env.example` documents the connection and OAuth variable names; copy it into an ignored local environment file. Never put credentials into the repository or browser bundle. Use an isolated database for previews, a pooled application connection if required by the selected provider and a separately controlled migration identity. Migrations create Wallace-prefixed tables only.

1. Configure `DATABASE_URL`, then run `pnpm db:migrate` against the intended empty preview/development database.
2. Register a GitHub OAuth application. Configure `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, a securely generated `AUTH_SECRET` and the approved `AUTH_URL`. Register the exact callback URL `/api/auth/callback/github` for the environment. Use separate preview/production OAuth configuration; do not whitelist arbitrary hosts.
3. Obtain the initial administrator's immutable numeric GitHub account ID. Run `pnpm wallace:bootstrap ID "Public editorial name"`. This runs only against an empty user table and creates an administrator plus a proposed, unapproved methodology. It does not create leaders, scores or published research.
4. Sign in at `/desk/wallace-index`. Under Users, add authorised researchers, reviewers and publishers by `github:NUMERIC_ID`. Roles are rechecked against the database on every write. Bootstrap administrators have no automatic editorial bypass.
5. Agree the staffing and public attribution policy. An assessment requires an independent reviewer and a publisher distinct from its author and reviewer. A single account cannot approve its own assessment, even if it has several roles.

GitHub OAuth establishes identity, not editorial permission. Unknown or disabled accounts are refused. The existing client-side `/desk` prototype is not used to secure the Wallace module. Its unrelated legacy controls have not been migrated.

## Adding a leader and publishing an edition without code

1. **Methodology:** a researcher saves proposed definitions, four score descriptors, all six rubrics and governance guidance. A publisher explicitly approves the saved version. Approved versions cannot be edited; fork a new version for changes.
2. **Leaders:** create name, unique slug, country, office, dates and biography. Check the duplicate warning. Archiving hides a leader from new editions while historical snapshots remain intact.
3. **Sources:** add the complete citation, dates, language, provenance, summary and reliability/relevance notes. A source version is immutable. Choose an existing source to prepare a corrected version; do not overwrite it.
4. **Assessments:** create a draft linked to the leader and methodology. Set its assessment period, context, reassessment date and independent reviewer. For each dimension record a score or leave it unassessed, explain the rationale, and link specific claims to source versions. Record contradictory/qualifying evidence and internal notes. A zero is an assessed score; missing evidence remains null.
5. Save the draft, then submit it for review with a note. The server requires six complete, evidenced dimensions and approved methodology before submission/publication. Incomplete research can remain a draft indefinitely; no total or official score is invented.
6. The assigned reviewer accepts the evidence or requests changes, recording disagreement and reasons. Requested changes return the assessment to Draft. Editing a returned draft resets acceptance; it must be submitted again.
7. A separate publisher grants editorial approval. The same publisher then selects the approved assessment in Editions, sets a unique edition slug/title and release notes, and publishes. Publication freezes the full methodology, public leader metadata, scores, evidence and source versions atomically. Published assessments may be carried into later editions using the same methodology.
8. Review the public edition, profile, comparison and JSON/CSV export. Old edition URLs continue to read their immutable snapshots.

For corrections, select a published assessment, record the reason and choose Create documented revision. Edit and review the new draft. Publish a new edition; the previous edition and its assessment remain unchanged. The successor/predecessor link and correction reason document the lineage. Historical statuses are not silently rewritten to hide the old record.

## Editorial content and public discovery

The Articles desk publishes versioned plain-text research notes and explanations. Published notes appear on the chapter overview and in the main archive search. Create a new content version for corrections. The main navigation, Indices, homepage chapter feature and publication catalogue point to the canonical chapter. Leader profiles from the latest edition are indexed in the archive; previous editions remain independently browsable. The existing archive is the search surface; no separate search service is assumed.

The initial framework/rubric remains publicly labelled proposed until editorial approval and edition publication. Static chapter introductions use the existing site's content style; CMS-managed explanatory notes can be published without source edits. A later whole-site CMS migration is outside this module.

## Visitor tool

Visitors can select a published profile or create a temporary name, read each dimension's guidance, assign nullable 0–3 scores and record notes/references. Data stays in browser local storage. JSON export/import and print-to-PDF are available. Opt-in share links carry the visitor data in the URL fragment, with a size limit and explicit warning that recipients can read it. Visitor results never enter the database, official assessments or public rankings. Export before clearing local storage.

## Checks

Run `pnpm test` (existing DDI validator), `pnpm test:wallace`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build` and `pnpm test:wallace:browser` after installing Playwright Chromium. Browser tests cover public navigation, fictional comparisons and evidence, zero/null visitor totals, local persistence/export, keyboard-independent accessibility rules and responsive overflow at 320/768/1280px. Automated checks do not certify complete screen-reader accessibility; include manual assistive-technology review before production.

For database integration, migrate a disposable PostgreSQL database with `wallace_test` in its name and run `WALLACE_TEST_DATABASE=1 pnpm test:wallace:db`. The test adds synthetic research and tests role checks, change requests, approval, publication, immutability, revisions and duplicate imports. Never run it against a real editorial database. The optional `embedded-postgres` development dependency and `scripts/wallace-local-db.ts` support an isolated local test cluster. Its platform package's documented postinstall symlink hydration must be permitted before starting it. It is not a hosting choice or production dependency.

## Approval boundaries still open

Select the managed PostgreSQL provider/region, enable its backup policy, configure OAuth and real editorial users, approve the methodology and provide researched records. Configure the reviewed contribution privacy notice and queue owner before enabling submissions. Confirm Vercel/DNS settings and legacy deployment associations. Production deployment and legacy deletion still require explicit approval.
