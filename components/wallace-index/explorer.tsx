"use client";
import Link from "next/link";
import { useState } from "react";
import {
  dimensions,
  Edition,
  label,
  PublicAssessment,
  total,
} from "@/lib/wallace-index/model";

export function ProfileBars({
  assessment,
  edition,
}: {
  assessment: PublicAssessment;
  edition: Edition;
}) {
  return (
    <dl className="wi-bars">
      {dimensions.map((d) => {
        const s = assessment.scores.find((s) => s.dimension === d);
        return (
          <div key={d}>
            <dt>
              <Link
                href={`/wallace-index/leaders/${assessment.leader.slug}?edition=${encodeURIComponent(edition.slug)}${edition.demonstration ? "&demo=1" : ""}#${d}`}
              >
                {label(d)}
              </Link>
            </dt>
            <dd>
              <span className="wi-track" aria-hidden="true">
                <span style={{ width: `${((s?.score ?? 0) / 3) * 100}%` }} />
              </span>
              <strong>
                {s?.score ?? "Not assessed"}
                {s?.score !== null && s?.score !== undefined ? " / 3" : ""}
              </strong>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
export function Explorer({
  edition,
  compare = false,
}: {
  edition: Edition;
  compare?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [office, setOffice] = useState("");
  const [period, setPeriod] = useState("");
  const [sort, setSort] = useState("name");
  const [selected, setSelected] = useState<string[]>([]);
  const items = edition.assessments
    .filter(
      (a) =>
        a.leader.name
          .toLocaleLowerCase("en-GB")
          .includes(query.toLocaleLowerCase("en-GB")) &&
        (!country || a.leader.country === country) &&
        (!office || a.leader.office === office) &&
        (!period ||
          `${a.periodStart.slice(0, 4)}–${a.periodEnd.slice(0, 4)}` === period),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.leader.name.localeCompare(b.leader.name, "en-GB")
        : (sort === "total"
            ? (total(b.scores) ?? -1)
            : (b.scores.find((s) => s.dimension === sort)?.score ?? -1)) -
          (sort === "total"
            ? (total(a.scores) ?? -1)
            : (a.scores.find((s) => s.dimension === sort)?.score ?? -1)),
    );
  const suffix = `edition=${encodeURIComponent(edition.slug)}${edition.demonstration ? "&demo=1" : ""}`;
  return (
    <>
      <div className="wi-filters">
        <label>
          Leader name
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search leaders"
          />
        </label>
        <label>
          Country
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {[...new Set(edition.assessments.map((a) => a.leader.country))].map(
              (x) => (
                <option key={x}>{x}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Office
          <select value={office} onChange={(e) => setOffice(e.target.value)}>
            <option value="">All offices</option>
            {[...new Set(edition.assessments.map((a) => a.leader.office))].map(
              (x) => (
                <option key={x}>{x}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Assessment period
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="">All periods</option>
            {[
              ...new Set(
                edition.assessments.map(
                  (a) =>
                    `${a.periodStart.slice(0, 4)}–${a.periodEnd.slice(0, 4)}`,
                ),
              ),
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name">Name</option>
            <option value="total">Total score</option>
            {dimensions.map((d) => (
              <option key={d} value={d}>
                {label(d)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p role="status" className="wi-muted">
        {items.length} leadership profiles · {edition.title}
      </p>
      {compare && (
        <div className="wi-selection">
          <p>Select two to four profiles for a comparison.</p>
          <Link
            aria-disabled={selected.length < 2}
            className="wi-button"
            href={
              selected.length >= 2
                ? `/wallace-index/compare?${suffix}&leaders=${selected.join(",")}`
                : "#profiles"
            }
          >
            Compare selected ({selected.length})
          </Link>
        </div>
      )}
      <div className="wi-grid" id="profiles">
        {items.map((a) => (
          <article key={a.id} className="wi-card">
            {compare && (
              <label className="wi-checkbox">
                <input
                  type="checkbox"
                  checked={selected.includes(a.id)}
                  disabled={!selected.includes(a.id) && selected.length >= 4}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [...selected, a.id]
                        : selected.filter((id) => id !== a.id),
                    )
                  }
                />
                Compare {a.leader.name}
              </label>
            )}
            <p className="wi-kicker">Leadership profile</p>
            <h2>
              <Link href={`/wallace-index/leaders/${a.leader.slug}?${suffix}`}>
                {a.leader.name}
              </Link>
            </h2>
            <p className="wi-muted">
              {a.leader.country} · {a.leader.office}
            </p>
            <p className="wi-total">
              {total(a.scores) === null
                ? "Incomplete assessment"
                : `${total(a.scores)} / 18`}
              <span>Descriptive aggregate</span>
            </p>
            <ProfileBars assessment={a} edition={edition} />
            <Link
              className="text-link"
              href={`/wallace-index/leaders/${a.leader.slug}?${suffix}`}
            >
              Rationale and evidence →
            </Link>
          </article>
        ))}
      </div>
      {!items.length && <p>No leadership profiles match these filters.</p>}
    </>
  );
}

export function Comparison({
  edition,
  ids,
}: {
  edition: Edition;
  ids: string[];
}) {
  const items = ids
    .map((id) => edition.assessments.find((a) => a.id === id))
    .filter((a): a is PublicAssessment => !!a)
    .slice(0, 4);
  const [copied, setCopied] = useState(false);
  return (
    <>
      <div className="wi-actions">
        <button
          onClick={() =>
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => setCopied(true))
              .catch(() => setCopied(false))
          }
        >
          Copy comparison link
        </button>
        <span role="status">{copied ? "Link copied." : ""}</span>
      </div>
      <div className="wi-table-scroll">
        <table className="wi-table">
          <caption>
            Comparative assessment · every dimension uses the same 0–3 scale
          </caption>
          <thead>
            <tr>
              <th scope="col">Dimension</th>
              {items.map((a) => (
                <th scope="col" key={a.id}>
                  <Link
                    href={`/wallace-index/leaders/${a.leader.slug}?edition=${edition.slug}${edition.demonstration ? "&demo=1" : ""}`}
                  >
                    {a.leader.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((d) => (
              <tr key={d}>
                <th scope="row">{label(d)}</th>
                {items.map((a) => {
                  const s = a.scores.find((s) => s.dimension === d);
                  return (
                    <td key={a.id}>
                      <strong>
                        {s?.score ?? "Not assessed"}
                        {s?.score !== null && s?.score !== undefined
                          ? " / 3"
                          : ""}
                      </strong>
                      <span className="wi-track" aria-hidden="true">
                        <span
                          style={{ width: `${((s?.score ?? 0) / 3) * 100}%` }}
                        />
                      </span>
                      <p>{s?.rationale}</p>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <th scope="row">Descriptive aggregate</th>
              {items.map((a) => (
                <td key={a.id}>
                  {total(a.scores) === null
                    ? "Incomplete"
                    : `${total(a.scores)} / 18`}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Totals do not override weaknesses in individual dimensions. Different
        offices, periods and evidence bases limit direct comparison.
      </p>
    </>
  );
}
