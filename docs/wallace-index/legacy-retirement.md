# Wallace Index legacy retirement report

17 October 2026 · Phase 1 inspection · Retirement not authorised or completed

## Repository inspected

`Rethinkk/wallace-index`, main revision `575c05c2d3fe8ffb337685e2f368ee1a49359270`. The complete default-branch tree contains README.md, index.html, charts.js and style.css. The branch listing returned main only, marked unprotected. No package manifest, imports, source bibliography, detailed rubric, database, CMS, deployment configuration or CNAME file appears in that tree.

## Material worth retaining

| Material | Disposition for the native chapter |
| --- | --- |
| Wallace Index name and six dimensions in HTML | Retain as conceptual provenance; authoritative definitions come from the approved versioned methodology |
| Paired horizontal comparison bars | Retain the design idea; implement accessible React bars with a common 0–3 scale and accompanying values/table |
| Yellow, black and restrained layout | Use the actual main-site tokens and typography, rather than importing the legacy stylesheet |
| Legacy numerical leader profiles | Do not import as research: no rationale, citations, approval or assessment period is supplied |
| charts.js | Do not reuse its dataset/scoring: category labels differ from the required model and values exceed 3 |
| style.css | No production transfer recommended: includes a stray closing brace and duplicated rules; main-site styling supersedes it |
| README | Title only; no substantive research or operational documentation to migrate |

This document transfers the useful observations into the Phase 1 handover. No production code or factual assessments were copied. After architecture approval, retain this provenance record in `docs/wallace-index/` in the main repository. There is no valuable research dataset to rescue from the inspected files.

## Hosting evidence and uncertainty

The inspected revision has a successful GitHub status named **Vercel – pam-desktop**, dated 21 September 2025, linking:

https://vercel.com/andre-kievits-projects/pam-desktop/GHoG8BhUb7PeZ35r5UtqUHF49dRT

This is evidence of a historical deployment association, not proof of a current Git integration, ownership or domain assignment. The unrelated-sounding project name makes inspection essential before changing anything. Do not delete or disconnect this project based on its name.

Current domains, aliases, production deployment and Git settings could not be verified: there is no callable Vercel account-management tool in this session; shell network access failed, and the GitHub connector rejected deployment-list and Pages endpoints as unsupported. No claim that deployments/domains are absent is made.

Required read access: Vercel team `andre-kievits-projects`, project `pam-desktop`, its Settings → Git, Domains and Deployments, plus authoritative DNS settings for any discovered domains. Also verify project `rethinkk` owns the main website. No additional GitHub read permission is currently needed for the two repositories.

## Safe retirement sequence, after architecture approval

1. Implement the chapter in `Rethinkk/rethinkk`, using local module code and the new editorial database. Keep all research records independently stored and exportable.
2. Record retained concepts and any actual copied material with source revision/path. Preserve the legacy Git history; arrange a full repository history backup before deletion is considered.
3. Search the main source, lockfile, build configuration and rendered network requests for legacy repository URLs, raw-file URLs, submodules and standalone asset links. Confirm builds and tests work with the legacy repository unavailable. There must be no runtime or build dependency.
4. Verify all existing deployment aliases, Git connections, domains, inbound links and traffic. Prepare specific redirects to the approved chapter where applicable, with separate production approval; do not redirect unrelated pam-desktop routes.
5. Verify approved research, methodology, visitor tool, editorial workflow and historical editions on the new site. Complete the migration checklist and restoration checks.
6. Present the completed migration/dependency/domain evidence and request explicit permission for the exact retirement action. Prefer preserving an archived repository if appropriate; neither archive nor delete has been performed or authorised here.

## Current verdict

Inspection complete; useful conceptual material documented. Production migration, deployment/domain verification and independence testing remain pending. The proposed architecture requires no legacy dependency. **The repository is not yet certified safe to remove.** No repository, deployment or domain was changed.
