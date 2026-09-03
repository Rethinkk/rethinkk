"use client";

import { useMemo, useState } from "react";

const monthlyRows = [
  { month: "2015-01", issue: "housing", count: 1, total: 2, share: 50, prominence: 5, urgency: 1, frames: "construction, housing_shortage, youth_access" },
  { month: "2015-01", issue: "migration", count: 1, total: 2, share: 50, prominence: 5, urgency: 1, frames: "asylum, humanitarian" },
  { month: "2015-01", issue: "climate", count: 0, total: 2, share: 0, prominence: null, urgency: null, frames: "none" },
  { month: "2015-02", issue: "housing", count: 1, total: 2, share: 50, prominence: 3, urgency: 0, frames: "construction, nitrogen_environmental_constraints" },
  { month: "2015-02", issue: "climate", count: 1, total: 2, share: 50, prominence: 5, urgency: 0, frames: "costs, emissions, energy_transition" },
  { month: "2015-03", issue: "migration", count: 1, total: 2, share: 50, prominence: 4, urgency: 0, frames: "integration, public_services" }
];

const auditRecords: Record<string, string[]> = {
  "2015-01:housing": ["nl-2015-01-001 / Sample Courant / Woningtekort loopt op in grote steden"],
  "2015-01:migration": ["nl-2015-01-002 / Sample Dagblad / Kabinet praat over opvang asielzoekers"],
  "2015-02:housing": ["nl-2015-02-002 / Sample Courant / Stikstof vertraagt nieuwbouwprojecten"],
  "2015-02:climate": ["nl-2015-02-001 / Sample Nieuws / Klimaatbeleid raakt energierekening huishoudens"],
  "2015-03:migration": ["nl-2015-03-001 / Sample Dagblad / Migratie zet volgens raad druk op voorzieningen"]
};

export function AgendaResearchDesk() {
  const [issue, setIssue] = useState("all");
  const [selectedKey, setSelectedKey] = useState("2015-01:housing");
  const filteredRows = useMemo(
    () => monthlyRows.filter((row) => issue === "all" || row.issue === issue),
    [issue]
  );
  const audit = auditRecords[selectedKey] || ["No coded source article behind this zero aggregate."];

  return (
    <section className="research-desk panel">
      <div className="kicker yellow">RETHINKK agenda research</div>
      <h2>Who Decides What Matters?</h2>
      <p className="copy">
        Internal research instrument for reconstructing monthly media attention before public interpretation. This module stays in the CMS desk and is not linked from the public site.
      </p>

      <div className="research-admin-row">
        <label htmlFor="agenda-issue">
          <span>Pilot issue filter</span>
          <select id="agenda-issue" value={issue} onChange={(event) => setIssue(event.target.value)}>
            <option value="all">All pilot issues</option>
            <option value="housing">Housing</option>
            <option value="migration">Migration</option>
            <option value="climate">Climate</option>
          </select>
        </label>
        <button className="ghost-btn" type="button">Import archive CSV</button>
      </div>

      <div className="research-desk-grid">
        <article>
          <h3>Monthly panel</h3>
          <p>country x year_month x issue</p>
          <div className="mini-bars">
            <span><i style={{ width: "130px" }} /> Media coded</span>
            <span><i style={{ width: "42px" }} /> Reality pending</span>
            <span><i style={{ width: "34px" }} /> Politics pending</span>
            <span><i style={{ width: "28px" }} /> Public pending</span>
          </div>
        </article>
        <article>
          <h3>Blind coding</h3>
          <p>Article text, publication metadata and fixed coding manual only.</p>
          <p>Stored: coding model, model version, prompt version and timestamp.</p>
        </article>
      </div>

      <div className="schema-grid">
        <article>
          <h3>Import contract</h3>
          <p>document_id / publication_date / outlet / country / title / body / section / author / source_type / archive reference</p>
        </article>
        <article>
          <h3>Validation</h3>
          <p>Gold-standard human coding target: 300-500 articles, compared with accuracy, precision, recall, F1, confusion matrix and agreement measures.</p>
        </article>
      </div>

      <div className="survey-matrix" style={{ marginTop: 22 }}>
        {filteredRows.map((row) => {
          const key = `${row.month}:${row.issue}`;
          return (
            <button className="matrix-row" key={key} type="button" onClick={() => setSelectedKey(key)}>
              <span>{row.month} / {row.issue}</span>
              <span>{row.count}/{row.total} articles / {row.share}% share / prominence {row.prominence ?? "-"} / urgency {row.urgency ?? "-"} / {row.frames}</span>
            </button>
          );
        })}
      </div>

      <div className="survey-review">
        <span>Audit trail for {selectedKey}</span>
        {audit.map((item) => <strong key={item}>{item}</strong>)}
      </div>
    </section>
  );
}
