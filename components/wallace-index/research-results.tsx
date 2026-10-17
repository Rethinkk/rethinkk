import Link from "next/link";
import { dimensions, label } from "@/lib/wallace-index/model";
import type { ResearchProfile } from "@/lib/wallace-index/research";

export function ProposalMark({
  dimension: d,
}: {
  dimension: ResearchProfile["dimensions"][number];
}) {
  if (!d.proposal)
    return (
      <strong>
        {d.caveat ? "Insufficient evidence — not assessed" : "Not assessed"}
      </strong>
    );
  return (
    <div className="wi-proposal">
      <strong>{d.proposal.score} / 3 — conditional proposal</strong>
      <span className="wi-track" aria-hidden="true">
        <span style={{ width: `${(d.proposal.score / 3) * 100}%` }} />
      </span>
      <span className="wi-muted">
        Not approved; whole-period sufficiency unresolved.
      </span>
    </div>
  );
}
export function ResearchResults({ profiles }: { profiles: ResearchProfile[] }) {
  return (
    <section className="wi-section" aria-labelledby="wi-current-results">
      <h2 id="wi-current-results">Current research results</h2>
      <p>
        Numbers below are conditional score proposals under the proposed rubric.
        They are not official ratings. Missing evidence is not a zero. No total
        or ranking is calculated.
      </p>
      <div className="wi-table-scroll">
        <table className="wi-table">
          <caption>
            Six dimensions · conditional proposals out of 3 · remaining
            dimensions unassessed
          </caption>
          <thead>
            <tr>
              <th scope="col">Leader</th>
              {dimensions.map((d) => (
                <th key={d} scope="col">
                  {label(d)}
                </th>
              ))}
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id}>
                <th scope="row">
                  <Link href={`/wallace-index/leaders/${p.id}?research=1`}>
                    {p.name}
                  </Link>
                </th>
                {p.dimensions.map((d) => (
                  <td key={d.dimension}>
                    <Link
                      href={`/wallace-index/leaders/${p.id}?research=1#${d.dimension}`}
                    >
                      <ProposalMark dimension={d} />
                    </Link>
                  </td>
                ))}
                <td>Not calculated</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Each proposed score links to its reasoning, counterevidence and
        unresolved conditions. Scholz’s Service evidence gap is not a finding of
        misconduct. Different offices and periods limit direct comparison.
      </p>
    </section>
  );
}
