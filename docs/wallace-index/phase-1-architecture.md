# The Wallace Index — Phase 1 architecture

17 October 2026 · Architecture proposal for approval · No implementation or deployment

## Recommendation

Develop The Wallace Index as a bounded research module within **Rethinkk/rethinkk**, served at `/wallace-index`. Retain the existing Next.js application, brand components, routes and DDI. Extend the existing editorial desk into a server-backed research CMS, adding PostgreSQL and Prisma because neither is implemented in the inspected repository. Do not continue or embed the standalone prototype.

This is an architecture proposal, not a claim that the acceptance criteria are already met. No GitHub files, branches, repositories, settings or deployments were changed during this audit.

## 1. Audit evidence and access

The workspace initially contained no application checkout. GitHub connector reads succeeded; shell cloning failed because the configured proxy could not be reached. Inspection therefore used GitHub file and tree reads pinned to these revisions:

| Repository | Inspected revision | Finding |
| --- | --- | --- |
| [Rethinkk/rethinkk](https://github.com/Rethinkk/rethinkk) | `d129102f75df7f9381c3410c3f577e1716eefe3c` | Main RETHINKK application source, brand, publication content and DDI |
| [Rethinkk/wallace-index](https://github.com/Rethinkk/wallace-index) | `575c05c2d3fe8ffb337685e2f368ee1a49359270` | Four-file static legacy demonstration |

Repository discovery returned seven Rethinkk repositories: rethinkk, wallace-index, tysmalems-website, fiscalflow, la-fioritura-montesano-cms, pam-desktop-clean and TL-Portal. The connector reported pull, push, maintain and admin permissions on these search results. Only the two relevant repositories were inspected in detail. A separate owner-filtered repository-list call returned an empty list; successful targeted reads establish access to the relevant repositories despite that inconsistent discovery result. This is not an exhaustive inventory of private projects.

### Existing infrastructure

| Area | Verified in source | Implication |
| --- | --- | --- |
| Application | Next.js `^15.5.0`, React `^19.1.0`, TypeScript `^5.9.0`, App Router, pnpm lockfile | Keep the existing application and routing |
| Content | Typed arrays in `lib/content.ts`; `lib/queries.ts` selects published content and homepage priority | Structured content exists, but no central database-backed publishing CMS |
| Editorial desk | `/desk`, `components/desk-client.tsx`: client-side prototype login and non-persistent generic article controls | Reuse layout and research-desk concept; do not reuse prototype authentication as security |
| Research persistence | AI Work Study uses Redis REST/KV; setup documentation names Upstash/KV and a server-side export token | Preserve this independent workflow; it is not a relational research CMS |
| DDI | Dedicated routes, API, data, validation script, import parser and import-preview desk | Preserve its model, data, URLs and release behaviour |
| Search | Client-side archive search across title, excerpt, category and tags | Extend existing archive discovery; a site-wide search service was not found |
| Styling | `app/globals.css` imports `outputs/rethinkk-site/styles.css` | Reuse tokens without moving this shared dependency during Wallace work |
| Hosting | Next build scripts; Sites static source/build/worker and hosting metadata also present | Two deployment artefact paths exist; do not assume both are active |
| Vercel | Main revision has successful Vercel status dated 3 September 2026, linking project `andre-kievits-projects/rethinkk` | Vercel integration is evidenced; current production domain and environment settings remain unverified |
| Checks | `test` runs the DDI validation script; no CI workflow, Prisma schema or migrations in the inspected tree | Add targeted checks after approval; establish baseline before shared changes |

The declared `lint` command is `next lint`, which needs review for the installed Next.js version. Builds and tests were not executed: no runnable checkout was available. No deployment, database, backup or accessibility success is asserted.

Primary evidence: [package.json](https://github.com/Rethinkk/rethinkk/blob/d129102f75df7f9381c3410c3f577e1716eefe3c/package.json), [desk prototype](https://github.com/Rethinkk/rethinkk/blob/d129102f75df7f9381c3410c3f577e1716eefe3c/components/desk-client.tsx), [research storage setup](https://github.com/Rethinkk/rethinkk/blob/d129102f75df7f9381c3410c3f577e1716eefe3c/docs/ai-work-study-production-setup.md), [routing](https://github.com/Rethinkk/rethinkk/blob/d129102f75df7f9381c3410c3f577e1716eefe3c/next.config.mjs), [Sites build](https://github.com/Rethinkk/rethinkk/blob/d129102f75df7f9381c3410c3f577e1716eefe3c/scripts/build-sites.mjs).

## 2. Reuse and integration boundaries

Reuse `SiteHeader`, `SiteFooter`, `Section`, `PageActions`, `ArticleCard`, archive controls, publication metadata and the skip-link layout. Reuse actual brand tokens: yellow `#eedc00`, black `#030303`, white `#f5f4f0`, rule `#353535`, page spacing and typography variables. Existing chart styles are useful references; the DDI chart and scoring functions are domain-specific and must not become Wallace scoring logic.

Add the nine requested chapter routes: overview, explore, compare, leader profiles, assess, methodology, sources, editions and about. Add stable edition detail and source detail routes, plus version-specific methodology and assessment permalinks. Keep the default leader route current, with explicit links to dated versions. Comparisons encode edition and assessment-version IDs in query parameters so shared comparisons do not change after publication.

Add chapter navigation within the existing shell, an Indices entry, an editorially configurable homepage feature and archive/search records. Extend `publicationPath` explicitly for Wallace entries; its generic index fallback currently points at `/indices/[slug]`. Keep all DDI rewrites and existing publication URLs unchanged. The homepage currently contains hard-coded DDI and article sections, so adding a Wallace publication record alone will not create a complete homepage integration.

Introduce a narrow publication catalogue adapter that merges existing static publications with published Wallace catalogue entries. Give entries unique namespaces and canonical paths. Keep existing article bodies and DDI storage untouched. Do not mirror Wallace research records into manually maintained TypeScript arrays. Archive filters and search should include Wallace publications and leader profiles with stable links; unpublished records must never enter the public catalogue. Defer a full migration of unrelated RETHINKK content.

Use scoped Wallace CSS and labelled horizontal bars on a fixed 0–3 scale, with visible numbers and equivalent tables. Each dimension links to rationale and evidence. Display an incomplete total as unavailable, not zero. Use British English and `en-GB` for chapter content. No league-table superlatives or implication of Ben Wallace endorsement.

## 3. Repository and CMS architecture

Proposed additions within the existing repository:

```text
app/wallace-index/          public chapter routes
app/desk/wallace-index/     research and publishing screens
app/api/wallace-index/      public read/export and moderated contribution endpoints
lib/wallace-index/          scoring, validation, queries and publication services
components/wallace-index/   chapter-specific components
lib/editorial/             shared sessions, permissions and audit services
prisma/                    schema and reviewed SQL migrations
tests/wallace-index/       domain, workflow and browser checks
docs/wallace-index/        methodology, operations, provenance and decisions
```

Maintain one deployable Next.js application. Do not introduce a submodule, iframe, runtime request to the legacy repository, second frontend or package publishing process. Extract shared packages only if multiple active applications later demonstrate a need. Keep module boundaries explicit rather than reorganising DDI.

Recommend a first-party, headless editorial service backed by PostgreSQL and Prisma, exposed through authenticated server operations and a practical `/desk/wallace-index` UI. The service owns transitions, evidence validation, permissions and snapshots; it is usable independently of the admin presentation. A generic article form cannot satisfy the workflow. Payload or another CMS would add a second data/access abstraction without an existing installation to extend; reconsider only if a separately maintained RETHINKK CMS is disclosed.

Use a supported session/authentication library with an approved identity provider. Roles are Administrator, Researcher, Reviewer and Publisher, with server-side permissions on every operation and module scope. Administrator manages accounts/configuration; role grants do not silently bypass editorial approval. Researchers edit drafts and submit; reviewers record decisions and request changes; publishers approve and release. Approval requires a recorded reviewer decision. Recommend separating author, reviewer and publisher for a given assessment, subject to approval of staffing rules.

Use secure cookies, CSRF/origin protection, rate limits and validated inputs. Keep editorial notes, identities and visitor contributions outside public response DTOs. No prototype password, client-side role flag or shared export token should secure the new CMS. Protect new routes without breaking existing research export contracts; any broader `/desk` security transition needs regression checks.

## 4. Proposed relational model

Use UUID primary keys, UTC timestamps, foreign keys and restrictive deletion of referenced research records. New tables should be Wallace-prefixed or isolated in a database schema; shared editorial tables are explicit. The following is a logical design, not an applied migration.

| Entity | Key fields and relationships |
| --- | --- |
| Leader | Unique slug, name, country code, biography, active/archived state; stable identity |
| LeaderOfficeTerm | Leader FK, office, country, start/end dates with date precision; supports multiple offices and historical periods |
| LeaderRevision | Versioned public name/biography/office metadata, so historical releases do not inherit later edits |
| Dimension | Six fixed unique codes: people, process, policy, crisis, humility, service |
| MethodologyVersion | Unique version, effective date, approval status, changelog, approver and approval time |
| DimensionRubric | Methodology FK + dimension FK unique; definition, 0–3 descriptors, indicators, examples, evidence and ambiguity guidance |
| Assessment | Leader FK, leader revision FK, methodology FK, period start/end, historical context, version, predecessor FK, correction reason, status, author and reassessment date |
| DimensionScore | Assessment FK + dimension FK unique; nullable integer score, evidence state, rationale, reviewer notes; exactly six required for publication |
| Source | Stable unique source ID, canonical URL/reference and duplicate fingerprint; source identity |
| SourceVersion | Source FK + version unique; title, author/issuing body, publisher, original date and date precision, source type, URL/stable reference, accessed date, language, factual summary, provenance, reliability/relevance notes and archival reference |
| EvidenceLink | Assessment and dimension-score relationship, immutable source-version FK, supported claim, context and supporting/contradicting/qualifying relation; leader inferred through assessment |
| ReviewAssignment / ReviewDecision | Assessment FK, assigned reviewer, timestamps, decision, reason and disagreements; decisions bind to the exact revision |
| Edition | Unique slug/version, methodology FK, publication date, status and release notes |
| EditionAssessment | Edition FK + assessment FK; one assessment per leader within an edition unless a future explicit period model allows more |
| EditionSnapshot | Edition FK, canonical versioned JSON, schema version, checksum, creator and timestamp; includes public leader, score, evidence, source and methodology data |
| EditorialContentRevision | Article/explanation type, slug, title, structured body, chapter/category/tags, revision, status, publication and homepage metadata |
| EditorialUser / RoleGrant | Identity-provider subject and module-scoped role memberships; no plaintext passwords |
| AuditEvent | Actor, action, time, entity/version reference, before/after metadata and request reference; append-only with private data controls |
| EditorialNote | Record reference, author, visibility and text; internal only |
| ReassessmentTask / SourceCheck | Due date, assignee, status; link-check outcome and history do not overwrite source evidence |
| ImportBatch / ImportRow | Schema version, file checksum, actor, validation outcome, duplicate decisions and created draft IDs |
| Contribution | Correction/criticism/research contribution, target reference, optional contact and consent, pending-review state; never automatically public |

### Integrity and reproducibility

Score constraint: `score IS NULL OR score BETWEEN 0 AND 3`, stored as an integer. A null score has an explicit not-assessed or insufficient-evidence state; zero is an assessed value. Enforce consistency between score and state. Totals are calculated only when all six distinct dimensions have non-null scores; otherwise total is null. No independently editable total column.

Use a composite relationship to ensure an evidence link's score belongs to its assessment. Rubrics and scores must refer to the same six dimension codes and methodology version. Validate period order, unique revision numbers, edition methodology agreement and source references. A stable reference may substitute for a URL; uncertain historical dates need precision metadata rather than invented exact dates.

Publishing validates cross-record conditions in a transaction: approved methodology, six accounted-for dimensions, rationale and linked evidence for every numeric score, resolved review requirements, recorded contradictory evidence/disagreement disposition, publisher permission and consistent edition membership. No source-count-to-score algorithm. Recommend permitting explicitly incomplete published profiles with no total; the editorial policy must approve this before implementation.

Freeze published assessment content, scores, evidence links, source versions, methodology and edition membership using database-level mutation guards as well as service checks. Publication/supersession events append lifecycle records; they do not rewrite the historical payload. Corrections fork a new draft revision with a reason and review trail. Freeze leader metadata and source summaries too, not just the six numbers. Use restrictive deletion and archived identities; published snapshots remain available after supersession. Snapshot hashes detect change but do not replace access controls or backups.

## 5. Research and visitor behaviour

Research → Evidence collection → Draft → In Review → Approved → Published → Superseded/Archived. A reviewer requesting changes returns work to Draft with reasons. Any content change after review invalidates the prior approval. Edition publication atomically selects approved assessment versions, freezes its full payload and writes audit events. Imports only create drafts; they cannot approve or publish.

Methodology content must include observable indicators, positive/negative examples, evidence standards, conflicting evidence, period/context, missing information, reassessment triggers and disagreement procedures for each dimension. The brief's intermediate score descriptions remain proposed and unapproved. Preserve the six-dimension model; any additional safeguards are separately labelled governance proposals.

Public profiles explain the qualitative and non-validated nature of the framework, what it does and does not measure, assessors/approvers as editorially agreed, dates and revision history. Source reputation alone does not prove a claim. Verified social posts can evidence the author's statement, not uncorroborated wider claims. Corrections enter a moderated editorial queue with input limits, spam controls and an approved retention notice.

Visitor assessments use local browser storage with a versioned JSON format, temporary custom leaders, nullable scores, notes and evidence references. No account or official-data write path. Display exactly: “Your assessment — not a RETHINKK editorial score.” Pin comparison to an official assessment version. Provide JSON download and print styling for browser PDF output; a dedicated PDF renderer is optional. Offer explicit export/import and an opt-in URL-fragment sharing format with size limits and an explanation that anyone receiving it can read its contents. Never put notes in server query logs or silently publish them. Render shared text safely. Local visitor data is outside institutional backup guarantees; provide clear/reset and download controls.

## 6. Operations and verification plan

Choose a managed PostgreSQL provider only after confirming RETHINKK's hosting, data region, budget and recovery needs. Use pooled application connections and a separate migration role. No production credentials were available or inspected. Use isolated preview databases, never production research data by default.

Version SQL migrations alongside Prisma; review constraints and immutability triggers explicitly. Use additive migrations, staging rehearsal, pre-migration backup and documented application rollback/forward repair. Never reset production or rewrite published data during import.

JSON exports include schema version, stable IDs, methodology, source versions, links, assessments, editions and checksums. CSV exports cover assessments/dimensions, sources and evidence links, with spreadsheet-formula protection. Imports use schema validation, dry-run previews and duplicate detection by stable ID, leader identity candidates and canonical source references. Do not merge same-name leaders or overwrite historical versions automatically. Stage approved corrections as new drafts.

Enable provider automated backups and point-in-time recovery where supported; propose daily backups, 30-day retention, RPO at most 24 hours and RTO at most one working day for approval. Keep encrypted recovery exports under restricted access separately from public snapshots. Rehearse restore to an isolated database, verify checksums and historical editions, then document recovery results. Source monitoring runs through an authenticated scheduled task with SSRF protection, timeouts and rate limits; failures create maintenance tasks, never replace original evidence.

Required checks after implementation: unit tests for zero/null and six-score totals; server permission and transition tests; evidence/review gates; published-row mutation rejection; concurrent publication; repeatable snapshots; import validation and historical preservation; JSON round-trip and restore rehearsal. Browser checks cover search/filter/sort, edition links, comparison sharing, visitor export and editor/reviewer/publisher journeys. Include keyboard/screen-reader review, automated accessibility checks, 320px mobile/tablet/desktop layouts, focus, contrast and non-colour chart interpretation. Run existing DDI validator plus DDI route/rewrite and public visibility regressions. Establish build, TypeScript, supported lint and dependency/security baselines before changes; do not claim WCAG conformance from automation alone.

## 7. Phases and dependencies

| Phase | Deliverable and release gate |
| --- | --- |
| 1 — current | Approve this architecture, schema direction, repository strategy and unresolved decisions |
| 2 — core chapter | Routes, public query boundary, profiles, evidence and comparisons; clearly fictional demonstration fixtures isolated from official publication; no inherited legacy scores |
| 3 — editorial CMS | Database/migrations, real sessions and roles, research desk, review gates, immutable records and edition publication; depends on provider/auth and governance decisions |
| 4 — visitor tool | Local independent scoring, versioned comparison, JSON/print export and opt-in sharing; depends on stable rubric and public version IDs |
| 5 — research operations | Staged import/export, scheduled maintenance, audit UI, snapshot/recovery runbooks and editor training; core audit/snapshot enforcement already belongs in Phase 3 |
| 6 — QA and preview | Full regression/accessibility/security checks and isolated Vercel preview using the verified existing project workflow; production requires separate explicit approval |

Phase 2 may build against a typed repository interface while Phase 3 supplies persistence. No official publication is allowed before the Phase 3 gates exist. A reviewer, publisher and editor must demonstrate adding a leader, evidence, assessment, rejecting/revising it and publishing a reproducible edition without source edits. Old editions must survive correction and import tests.

## 8. Decisions and access still needed

1. Approve the native main-repository module and first-party PostgreSQL/Prisma editorial service. No new repository or standalone site is proposed.
2. Confirm the current Vercel `andre-kievits-projects/rethinkk` project owns `rethinkk.org`, its production branch, build root, preview policy and environment separation. GitHub status proves a deployment occurred, not the current domain mapping. Read access to those Vercel settings and the authoritative DNS configuration is needed before preview/decommission work.
3. Select database provider, region, backup retention, RPO/RTO, authentication provider and named initial role holders. Determine whether any CMS/database exists outside the inspected source.
4. Approve the rubric and score descriptors; assessment period rules, selection scope, confidence vocabulary, incomplete-profile publication, reassessment cadence, disagreement resolution and role separation. No numerical assessments will be invented.
5. Agree public assessor attribution, corrections contact/queue owner, privacy/retention rules and contribution handling. Do not imply Wallace endorsement without documentary evidence.
6. Confirm the legacy Vercel project and domains described in the retirement report. Retirement is separately gated by migration verification and explicit removal approval.

## 9. GitHub integration strategy

Preserve both repositories and their history. After architecture approval, use a feature branch and reviewable PRs in `Rethinkk/rethinkk`; do not push to production branches or create/move repositories. Keep audit provenance linked to immutable legacy revisions. No wholesale history merge is justified for a four-file demo. If any code is later copied, record source path, commit and attribution in a provenance manifest.

Use module ownership/review rules and required checks after confirming existing repository policy. Do not alter branch protections automatically. Preview deployment must target the existing main-site project and an isolated environment; merging may trigger production and therefore remains subject to the user's deployment approval. Leave the legacy repository unchanged until the approved retirement sequence is complete.

The accompanying retirement report captures the useful conceptual material now. Production transfer is intentionally deferred until architecture approval, as required by the Phase 1 instruction. There is no implemented new chapter yet, so migration completion and independence verification cannot honestly be certified at this stage.
