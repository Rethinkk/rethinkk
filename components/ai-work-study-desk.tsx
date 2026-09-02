"use client";

import { useMemo, useState } from "react";
import { researchTables } from "@/lib/ai-work-study";

const submissionsKey = "rthnk-ai-work-study-submissions";

export function AiWorkStudyDesk() {
  const [refresh, setRefresh] = useState(0);
  const submissions = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(submissionsKey) || "[]") as Array<Record<string, unknown>>;
    } catch {
      return [];
    }
  }, [refresh]);

  const dependencyCounts = submissions.reduce<Record<string, number>>((acc, item) => {
    const response = item.survey_responses as Record<string, unknown> | undefined;
    const score = Number(response?.economic_dependency_score || 0);
    const group = score === 1 ? "Group A" : score >= 2 && score <= 3 ? "Group B" : score >= 4 ? "Group C" : "Uncoded";
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  function exportJson() {
    const blob = new Blob([JSON.stringify(submissions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rthnk-ai-work-study-local-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="research-desk panel">
      <div className="status-row">
        <div>
          <div className="kicker yellow">RTHNK Research</div>
          <h2>The AI Work Study</h2>
        </div>
        <span className="kicker muted">{submissions.length} local responses</span>
      </div>
      <p className="copy">Research by RTHNK, in cooperation with Tysma | Lems International Tax Consultants. RTHNK remains the editorial owner of the study.</p>
      <div className="research-desk-grid">
        <article>
          <h3>Segmentation</h3>
          <p>Group A: dependency score 1</p>
          <p>Group B: dependency score 2-3</p>
          <p>Group C: dependency score 4-5</p>
          <div className="mini-bars">
            {["Group A", "Group B", "Group C", "Uncoded"].map((group) => (
              <span key={group}><i style={{ width: `${Math.max(8, (dependencyCounts[group] || 0) * 18)}px` }} />{group}: {dependencyCounts[group] || 0}</span>
            ))}
          </div>
        </article>
        <article>
          <h3>Export sets</h3>
          <p>Anonymous full research dataset</p>
          <p>Interview contact list</p>
          <p>Open-text responses</p>
          <p>Coded response summary</p>
        </article>
      </div>
      <div className="schema-grid">
        {Object.entries(researchTables).map(([table, fields]) => (
          <article key={table}>
            <h3>{table}</h3>
            <p>{fields.join(", ")}</p>
          </article>
        ))}
      </div>
      <div className="button-row">
        <button className="ghost-btn" type="button" onClick={() => setRefresh((value) => value + 1)}>Refresh local responses</button>
        <button className="solid-btn" type="button" onClick={exportJson} disabled={!submissions.length}>Export local JSON</button>
      </div>
      <p className="source-note">Production storage still needs to be connected before public recruitment. Contact data must remain separate from the anonymous research table.</p>
    </section>
  );
}
