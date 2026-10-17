# Research operations and recovery

## Import/export

The Operations desk accepts JSON with `schemaVersion: 1`, `leaders`, `sources` and `assessments`. Field definitions are enforced by `lib/wallace-index/validation.ts`. Include stable IDs on imported leaders/sources and reference those IDs from assessments and evidence. Methodology versions must already exist; the server does not trust imported approval flags.

Validate and preview before Import as drafts. The server repeats validation in the write transaction, rejects existing IDs/duplicate references and creates research drafts only. It never bulk-overwrites published records or infers scores. Source reference fingerprints remove common tracking parameters; same-name leaders are flagged for manual identity review rather than merged. The entire import rolls back if any reference or constraint fails. Batch checksums and counts are audited.

Public editions provide JSON and research CSV downloads. CSV rows join dimension rationales to source metadata and claims; spreadsheet-formula prefixes are escaped. JSON includes schema version and a frozen edition. Public exports omit reviewer-only notes, private identity keys and visitor data.

The authenticated desk also offers a private research backup containing users/role grants, leaders, methodologies, source versions, assessments, editions, review records, content, source checks and audits. Treat it as sensitive. Downloading it does not approve any imported assessment.

## Backups and recovery

No managed provider is selected or provisioned. Before production, enable provider-managed backups and point-in-time recovery where available; provisionally target daily backups, 30-day retention, RPO ≤24 hours and RTO ≤one working day, subject to owner agreement. Store encrypted recovery artefacts separately from the application, restrict access and test restoration quarterly and before material migrations. Provider backups are needed for complete recovery, including contributions and contact details.

For a portable research-only backup, run `pnpm wallace:export /secure/path/backup.json`. The command refuses to overwrite a file, uses owner-only permissions, reads a consistent transaction and hashes the result. The export excludes contribution contact details and local visitor data. Protect exported role grants and internal reviewer notes as confidential editorial material.

Recovery procedure:

1. Stop editorial writes and diagnose the failure. Preserve the failed database and audit evidence; do not reset it.
2. Provision an isolated replacement database in the approved region. Use the provider restore/PITR workflow for a complete database recovery, or apply migrations to an empty database for portable research recovery.
3. For portable recovery only, point `DATABASE_URL` at the empty target and run `pnpm wallace:restore backup.json --empty-database-only`. The command validates the format/checksum and every edition checksum, refuses a non-empty target, and restores the original IDs, references and historical snapshots in a transaction. It appends a restore audit event. It cannot overwrite an existing publication.
4. Recheck user permissions, migration state, edition hashes, public profile/evidence links and JSON/CSV export. Compare record counts and the restored snapshots with the source backup. Restore contribution data separately through the provider workflow if needed.
5. Run the relevant application checks and an editorial smoke test. Reconnect the application only after reviewing the concrete restored result. Record the restore point, operator, duration and any data loss.

Local recovery was exercised during implementation against two separate disposable PostgreSQL databases. This does not establish a managed provider's backup readiness or recovery SLA.

## Migrations and deployment

Prisma models plus reviewed SQL migrations define the database. The SQL includes domain constraints, independent-review checks, approved-methodology checks, score/evidence guards and immutable-history triggers. These triggers are intentional database behaviour; do not use `prisma db push` to bypass the migration history. No DDI or survey storage migration is included.

Apply migrations to an isolated preview database first. Take a production backup before approved production migration. Use separate migration credentials where supported; normal application users must not own tables, alter triggers or bypass database permissions. Never expose the migration URL to client-side code. Roll back the application when safe; prefer a reviewed forward migration over deleting historical research.

Vercel build command remains `pnpm build`, now including Prisma generation. Migrations and bootstrap are separate operator actions, not build hooks. Public routes render an honest empty state with no database. The desk closes when database/OAuth configuration is missing. A preview should have an independent database and OAuth callback configuration, with no production credentials or production research fixtures.

pnpm 11 enforces dependency install-script approval. `pnpm-workspace.yaml` explicitly permits the reviewed, version-pinned Prisma, esbuild and Linux test-PostgreSQL scripts. A clean `pnpm install --frozen-lockfile` must pass before a deployment. Review the corresponding script and update its version-specific entry when upgrading one of these dependencies; do not disable this check globally. These scripts generate clients, prepare binaries or hydrate local test-library links; they do not migrate or seed any database.

Verify the existing Vercel project `andre-kievits-projects/rethinkk`, Git integration, production branch and `rethinkk.org` domain mapping before production. Branch previews are review artefacts; do not merge or promote without explicit production approval. Keep the older Sites build path intact; the Wallace module is implemented in the Next.js application, not duplicated into the old static artefact.

## Scheduled maintenance

Configure a provider scheduler or controlled worker to run `pnpm wallace:maintenance` daily using a restricted database identity and the approved network route. The script records source-link outcomes and overdue reassessments for the desk. It does not send messages, alter scores or publish research.

Source monitoring uses HTTPS only, resolves and rejects non-public IP destinations, pins the checked address and does not follow redirects. Timeouts and redirects create manual-review outcomes. A working link does not establish evidential reliability; a broken link does not erase the source record. Use archival references where possible. Review due reassessments in the desk and assign new research explicitly.

## Contributions and privacy

The public contribution endpoint is disabled by default. Set `WALLACE_CONTRIBUTIONS_ENABLED=true` only after approving `WALLACE_PRIVACY_NOTICE`, naming a review-queue owner and deciding retention/deletion policy. The notice is displayed with the form. The endpoint enforces same-origin JSON, size/field limits, a honeypot, duplicate checks and a database-backed global submission-rate limit. No contribution is published automatically. Reviewers record dispositions in the Operations desk. Add hosting-level abuse controls before opening a high-volume public endpoint.

Contribution contact details are deliberately outside the portable research backup. Retain them only under the approved privacy policy and recover them through the provider's controlled backup workflow. Visitor assessments are local to the visitor and cannot be recovered by RETHINKK.
