"use client";

import { useMemo, useState } from "react";

const monthlyRows = [
  { month: "2015-01", issue: "housing", researchCountry: "NL", count: 1, total: 2, share: 50, prominence: 5, urgency: 1, position: "increase_supply", actor: "government", editorial: "no", event: "policy_announcement", frames: "construction, housing_shortage, youth_access" },
  { month: "2015-01", issue: "migration", researchCountry: "NL", count: 1, total: 2, share: 50, prominence: 5, urgency: 1, position: "less_restrictive", actor: "government", editorial: "no", event: "migration_event", frames: "asylum, humanitarian" },
  { month: "2015-01", issue: "climate", researchCountry: "NL", count: 0, total: 2, share: 0, prominence: null, urgency: null, position: "unclear", actor: "unclear", editorial: "no", event: "none", frames: "none" },
  { month: "2015-02", issue: "housing", researchCountry: "NL", count: 1, total: 2, share: 50, prominence: 3, urgency: 0, position: "unclear", actor: "government", editorial: "no", event: "policy_announcement", frames: "construction, nitrogen_environmental_constraints" },
  { month: "2015-02", issue: "climate", researchCountry: "NL", count: 1, total: 2, share: 50, prominence: 5, urgency: 0, position: "accelerate_action", actor: "expert", editorial: "no", event: "none", frames: "costs, emissions, energy_transition" },
  { month: "2015-03", issue: "migration", researchCountry: "NL", count: 1, total: 2, share: 50, prominence: 4, urgency: 0, position: "unclear", actor: "government", editorial: "no", event: "none", frames: "integration, public_services" }
];

const auditRecords: Record<string, string[]> = {
  "2015-01:housing": ["nl-2015-01-001 / source_country NL / geographic_focus NL / research_country NL / no editorial position"],
  "2015-01:migration": ["nl-2015-01-002 / source_country NL / geographic_focus NL / research_country NL / quoted actor position only"],
  "2015-02:housing": ["nl-2015-02-002 / source_country NL / geographic_focus NL / research_country NL / event-linked attention"],
  "2015-02:climate": ["nl-2015-02-001 / source_country NL / geographic_focus NL / research_country NL / expert-attributed position"],
  "2015-03:migration": ["nl-2015-03-001 / source_country NL / geographic_focus NL / research_country NL / public-services frame"]
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
        Internal research instrument for reconstructing monthly media attention before public interpretation. Topic, position, actor attribution and editorial voice are coded separately.
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
          <p>research_country x year_month x issue</p>
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
          <p>Stored: model, prompt, source reference, methodology version, quality flags and timestamp.</p>
        </article>
      </div>

      <div className="schema-grid">
        <article>
          <h3>Import contract</h3>
          <p>document_id / publication_date / outlet / source_country / geographic_focus / research_country / title / body / section / source reference</p>
        </article>
        <article>
          <h3>Denominator quality</h3>
          <p>Shares require denominator definition, coverage, source completeness and coverage notes before cross-time comparison.</p>
        </article>
      </div>

      <div className="survey-matrix" style={{ marginTop: 22 }}>
        {filteredRows.map((row) => {
          const key = `${row.month}:${row.issue}`;
          return (
            <button className="matrix-row" key={key} type="button" onClick={() => setSelectedKey(key)}>
              <span>{row.month} / {row.issue}</span>
              <span>{row.researchCountry} / {row.count}/{row.total} articles / {row.share}% share / position {row.position} / actor {row.actor} / editorial {row.editorial} / event {row.event}</span>
            </button>
          );
        })}
      </div>

      <div className="survey-review">
        <span>Audit trail for {selectedKey}</span>
        {audit.map((item) => <strong key={item}>{item}</strong>)}
        <span>POSITION != SALIENCE / source country is not geographic focus</span>
      </div>
    </section>
  );
}
