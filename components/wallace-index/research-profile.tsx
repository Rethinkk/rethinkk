import Link from "next/link";
import { ProposalMark } from "./research-results";
import { label } from "@/lib/wallace-index/model";
import { proposedMethodology } from "@/lib/wallace-index/methodology";
import {
  researchNotice,
  researchProfiles,
  researchSources,
  type ResearchProfile,
  type ResearchEvidence,
} from "@/lib/wallace-index/research";

export function ResearchNotice() {
  return (
    <aside className="wi-notice">
      <strong>
        Research profiles — conditional proposals, not official scores
      </strong>
      <p>{researchNotice}</p>
      <Link href="/wallace-index/methodology">
        Methodology and limitations →
      </Link>
    </aside>
  );
}
function Evidence({
  title,
  entries,
}: {
  title: string;
  entries: ResearchEvidence[];
}) {
  return (
    <>
      <h3>{title}</h3>
      {entries.length ? (
        <ul>
          {entries.map((c) => (
            <li key={c.id}>
              <p>{c.text}</p>
              <Link href={`/wallace-index/sources/${c.sourceId}?research=1`}>
                {c.sourceTitle} · {c.id}
              </Link>
              <p className="wi-muted">
                Date / period: {c.date} · Passage: {c.locator}
              </p>
              {c.limitations && <p>Limitations: {c.limitations}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          No specific evidence recorded in this category. Absence of a recorded
          example does not establish absence of the behaviour.
        </p>
      )}
    </>
  );
}
export function ResearchProfileView({
  profile: p,
}: {
  profile: ResearchProfile;
}) {
  return (
    <>
      <header className="wi-heading">
        <p className="wi-kicker">
          {p.country} / {p.office}
        </p>
        <h1>{p.name}</h1>
        <p className="wi-intro">
          Leadership profile · qualitative research draft
        </p>
      </header>
      <ResearchNotice />
      <p>
        Assessment period: {p.start} – {p.end} · Research updated 17 October
        2026.
      </p>
      <p>
        Office chronology references:{" "}
        {p.chronologySourceIds.map((id, i) => (
          <span key={id}>
            {i > 0 ? "; " : ""}
            <Link href={`/wallace-index/sources/${id}?research=1`}>{id}</Link>
          </span>
        ))}
      </p>
      <p>
        <strong>Conditional proposals only. No total is calculated.</strong>{" "}
        Evidence supports bounded observations; it does not yet support a
        complete-period numerical judgement.
      </p>
      {p.dimensions.find((d) => d.caveat)?.caveat && (
        <aside className="wi-notice">
          <strong>Service — evidence limitation</strong>
          <p>{p.dimensions.find((d) => d.caveat)?.caveat}</p>
        </aside>
      )}
      <div className="wi-actions">
        <Link className="wi-button" href="/wallace-index/compare?research=1">
          Compare research profiles
        </Link>
        <Link className="wi-button" href="/wallace-index/assess">
          Make your own assessment
        </Link>
        <a className="wi-button" href="/api/wallace-index/research">
          Download research JSON
        </a>
      </div>
      <nav className="wi-editions" aria-label="Profile dimensions">
        {p.dimensions.map((d) => (
          <Link key={d.dimension} href={`#${d.dimension}`}>
            {label(d.dimension)}
          </Link>
        ))}
      </nav>
      {p.dimensions.map((d) => (
        <section className="wi-section" key={d.dimension} id={d.dimension}>
          <h2>{label(d.dimension)}</h2>
          <ProposalMark dimension={d} />
          {d.proposal && (
            <div className="wi-notice">
              <h3>Why this score is proposed</h3>
              <p>{d.proposal.rationale}</p>
              <h3>Why adjacent scores differ</h3>
              <p>{d.proposal.adjacentDescriptors}</p>
              <h3>Unresolved conditions before acceptance</h3>
              <p>{d.proposal.conditions}</p>
              <p>{d.proposal.changeFromPrior}</p>
            </div>
          )}
          <p>{proposedMethodology.rubrics[d.dimension].definition}</p>
          {d.caveat && <p className="wi-notice">{d.caveat}</p>}
          <h3>Concept assessment</h3>
          <p>{d.judgement}</p>
          <h3>Uncertainties and evidence sufficiency</h3>
          <p>{d.uncertainties}</p>
          <p>{d.withholdingReason}</p>
          <Evidence title="Supporting evidence" entries={d.supporting} />
          <Evidence
            title="Adverse or contradictory evidence"
            entries={d.adverse}
          />
          <Evidence
            title="Qualifying evidence and context"
            entries={d.qualifying}
          />
        </section>
      ))}
      <section className="wi-section">
        <h2>Research provenance and revisions</h2>
        <p>
          Based on evidence-gap follow-up 02 and conditional score proposal
          packet 01, following research, source verification and internal
          review. Earlier packets remain preserved in the research archive.
          Internal checking was conducted by the same research assistant; it is
          not independent review. The historical prototype scores have not been
          reused or converted.
        </p>
        <Link href="/wallace-index/about#corrections">
          Corrections and research contributions →
        </Link>
      </section>
    </>
  );
}
export function ResearchComparison({ ids }: { ids: string[] }) {
  const items = researchProfiles.filter((p) =>
    [...new Set(ids)].slice(0, 4).includes(p.id),
  );
  if (items.length < 2)
    return (
      <p>
        Select at least two valid profiles.{" "}
        <Link href="/wallace-index/compare?research=1">Choose profiles →</Link>
      </p>
    );
  return (
    <>
      <p>
        <Link
          href={`/wallace-index/compare?research=1&leaders=${items.map((p) => p.id).join(",")}`}
        >
          Permanent link to this comparison
        </Link>
      </p>
      <div className="wi-table-scroll">
        <table className="wi-table">
          <caption>
            Comparative research · conditional proposals only, no totals
          </caption>
          <thead>
            <tr>
              <th scope="col">Dimension</th>
              {items.map((p) => (
                <th scope="col" key={p.id}>
                  <Link href={`/wallace-index/leaders/${p.id}?research=1`}>
                    {p.name}
                  </Link>
                  <p>
                    {p.office} · {p.start} – {p.end}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items[0].dimensions.map((d, i) => (
              <tr key={d.dimension}>
                <th scope="row">{label(d.dimension)}</th>
                {items.map((p) => (
                  <td key={p.id}>
                    <ProposalMark dimension={p.dimensions[i]} />
                    {p.dimensions[i].proposal && (
                      <>
                        <p>{p.dimensions[i].proposal.rationale}</p>
                        <p>
                          <strong>Before acceptance:</strong>{" "}
                          {p.dimensions[i].proposal.conditions}
                        </p>
                      </>
                    )}
                    {p.dimensions[i].caveat && (
                      <p className="wi-notice">{p.dimensions[i].caveat}</p>
                    )}
                    <p>{p.dimensions[i].judgement}</p>
                    <p>Uncertainties: {p.dimensions[i].uncertainties}</p>
                    <Link
                      href={`/wallace-index/leaders/${p.id}?research=1#${d.dimension}`}
                    >
                      Supporting evidence and counterevidence →
                    </Link>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Different offices, periods and evidence bases limit direct comparison.
        No ranking or aggregate score is implied.
      </p>
    </>
  );
}
export function ResearchSources({ id }: { id?: string }) {
  const items = researchSources.filter((s) => !id || s.id === id);
  return (
    <>
      <ResearchNotice />
      {items.length ? (
        items.map((s) => (
          <article key={s.id} className="wi-card wi-section">
            <p className="wi-kicker">Research source {s.id}</p>
            <h2>{s.title}</h2>
            <dl className="wi-metadata">
              {[
                ["Author / issuing institution", s.author],
                ["Publisher", s.publisher],
                ["Original publication date", s.publishedDate],
                ["Type", s.type],
                ["Date accessed", s.accessed],
                ["Language", s.language],
                ["Factual summary", s.summary],
                ["Reliability, relevance and limitations", s.notes],
                ["Passage reference", s.locator],
                ["Archival reference", s.archive],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div>
                <dt>Original publication</dt>
                <dd>
                  <a href={s.url} rel="noreferrer">
                    {s.url}
                  </a>
                </dd>
              </div>
            </dl>
            <h3>Linked profiles and claims</h3>
            <ul>
              {researchProfiles
                .filter(
                  (p) =>
                    p.chronologySourceIds.includes(s.id) ||
                    p.dimensions.some((d) =>
                      [...d.supporting, ...d.adverse, ...d.qualifying].some(
                        (c) => c.sourceId === s.id,
                      ),
                    ),
                )
                .map((p) => (
                  <li key={p.id}>
                    <Link href={`/wallace-index/leaders/${p.id}?research=1`}>
                      {p.name}
                    </Link>
                    {p.dimensions.flatMap((d) =>
                      [...d.supporting, ...d.adverse, ...d.qualifying]
                        .filter((c) => c.sourceId === s.id)
                        .map((c) => (
                          <p key={`${d.dimension}-${c.id}`}>
                            {label(d.dimension)} · {c.id}: {c.text} — Passage:{" "}
                            {c.locator}
                          </p>
                        )),
                    )}
                  </li>
                ))}
            </ul>
          </article>
        ))
      ) : (
        <p>No research source matches this reference.</p>
      )}
    </>
  );
}
