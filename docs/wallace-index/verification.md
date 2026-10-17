# Implementation verification

17 October 2026. Review branch, not a production release.

## Completed locally

- Next.js production build, TypeScript and the scoped ESLint checks pass.
- Existing Democracy Direction Index validator passes. DDI implementation/data and its rewrites are unchanged.
- Eight unit tests cover zero versus missing scores, totals, independent workflow roles, publication evidence gates, private-note exclusion, import validation, canonical hashes, CSV formula protection and request validation.
- A real temporary PostgreSQL instance accepted all three migrations. Integration checks exercise author/reviewer/publisher separation, rejected review and resubmission, edition publication, database-enforced immutability, new revisions, leader-metadata snapshot isolation and duplicate import rejection.
- A private research backup was exported from one disposable database and restored into a second empty migrated database, with successful edition checksum verification. No managed/production database was contacted.
- Dependency audit after patch updates and verified transitive overrides reports zero known vulnerabilities in production dependencies. Next.js remains on major version 15.

Browser verification covers the native chapter, fictional profile filtering/comparison/evidence, visitor zero/null totals, local persistence and export, unauthorised/cross-origin requests, and automated accessibility/overflow checks at 320px, 768px and 1280px. These checks do not certify complete assistive-technology accessibility or validate real editorial research.

## Environment decisions deliberately deferred

The owner explicitly deferred the PostgreSQL hosting choice. Database provision, provider backup automation and actual editorial OAuth accounts are therefore not configured. The server closes editorial access until these are supplied; the public official index remains empty. Fictional examples appear only when explicitly requesting the demonstration mode. No numerical factual leadership assessments have been imported or invented.

Methodology approval remains an editorial act in the CMS. Public correction collection is disabled until a reviewed privacy notice and queue owner are configured. Scheduled maintenance is implemented as an operator/scheduler command; the selected hosting scheduler must still be connected.

The real GitHub OAuth login redirect and real editorial identities require environment configuration before release. Workflow permissions and persistence were tested directly against PostgreSQL; the browser suite tests closed/unauthorised access, not a real third-party OAuth account.

## Legacy and deployment boundaries

The new chapter contains no runtime/build dependency on the legacy standalone application. Only provenance/design observations were transferred into documentation. The historical legacy Vercel status refers to `andre-kievits-projects/pam-desktop`; its present domains and Git association still need account-level verification. The legacy repository has not been deleted, archived or disconnected.

Production deployment/promotion, production database migration and repository removal remain unauthorised. A preview can be reviewed with an empty official catalogue and explicit fictional demonstration mode.
