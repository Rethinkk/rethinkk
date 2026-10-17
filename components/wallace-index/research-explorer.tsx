"use client";
import Link from "next/link";
import { useState } from "react";
import type { ResearchProfile } from "@/lib/wallace-index/research";

export function ResearchExplorer({
  profiles,
}: {
  profiles: ResearchProfile[];
}) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [office, setOffice] = useState("");
  const [period, setPeriod] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const items = profiles
    .filter(
      (p) =>
        p.name
          .toLocaleLowerCase("en-GB")
          .includes(query.toLocaleLowerCase("en-GB")) &&
        (!country || p.country === country) &&
        (!office || p.office === office) &&
        (!period || `${p.start.slice(0, 4)}–${p.end.slice(0, 4)}` === period),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  return (
    <>
      <div className="wi-filters">
        <label>
          Leader name
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leaders"
          />
        </label>
        <label>
          Country
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {[...new Set(profiles.map((p) => p.country))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Office
          <select value={office} onChange={(e) => setOffice(e.target.value)}>
            <option value="">All offices</option>
            {[...new Set(profiles.map((p) => p.office))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Assessment period
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="">All periods</option>
            {[
              ...new Set(
                profiles.map(
                  (p) => `${p.start.slice(0, 4)}–${p.end.slice(0, 4)}`,
                ),
              ),
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <p role="status">
        {items.length} qualitative research profiles · alphabetical order
      </p>
      <p>Numeric sorting is unavailable: no scores have been assigned.</p>
      <div className="wi-selection">
        <p>Select two to four profiles to compare the written assessments.</p>
        {selected.length >= 2 ? (
          <Link
            className="wi-button"
            href={`/wallace-index/compare?research=1&leaders=${selected.join(",")}`}
          >
            Compare selected ({selected.length})
          </Link>
        ) : (
          <span>Select at least two profiles ({selected.length} selected)</span>
        )}
      </div>
      <div className="wi-grid" id="profiles">
        {items.map((p) => (
          <article key={p.id} className="wi-card">
            <label className="wi-checkbox">
              <input
                type="checkbox"
                checked={selected.includes(p.id)}
                disabled={!selected.includes(p.id) && selected.length >= 4}
                onChange={(e) =>
                  setSelected(
                    e.target.checked
                      ? [...selected, p.id]
                      : selected.filter((id) => id !== p.id),
                  )
                }
              />
              Compare {p.name}
            </label>
            <p className="wi-kicker">Qualitative research draft</p>
            <h2>
              <Link href={`/wallace-index/leaders/${p.id}?research=1`}>
                {p.name}
              </Link>
            </h2>
            <p>
              {p.country} · {p.office}
            </p>
            <p>
              Assessment period: {p.start} – {p.end}
            </p>
            <p>
              <strong>Not assessed numerically · no total</strong>
            </p>
            {p.dimensions.some((d) => d.caveat) && (
              <p className="wi-notice">
                {p.dimensions.find((d) => d.caveat)?.caveat}
              </p>
            )}
            <Link
              className="text-link"
              href={`/wallace-index/leaders/${p.id}?research=1`}
            >
              Six dimensions, rationale and evidence →
            </Link>
          </article>
        ))}
      </div>
      {!items.length && <p>No leadership profiles match these filters.</p>}
    </>
  );
}
