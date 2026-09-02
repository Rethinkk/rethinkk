"use client";

import { useState } from "react";
import { researchTables } from "@/lib/ai-work-study";

type Summary = {
  response_count: number;
  dependency_groups: Record<string, number>;
  latest_submission_at: string | null;
};

const exportSets = [
  { dataset: "full", format: "csv", label: "Anonymous responses CSV" },
  { dataset: "full", format: "json", label: "Anonymous responses JSON" },
  { dataset: "contacts", format: "csv", label: "Interview contacts CSV" },
  { dataset: "open_text", format: "csv", label: "Open-text responses CSV" }
];

export function AiWorkStudyDesk() {
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSummary() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/research/ai-work-study/export?dataset=summary", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      });
      const result = await response.json() as { data?: Summary; message?: string };
      if (!response.ok || !result.data) throw new Error(result.message || "Could not load research summary.");
      setSummary(result.data);
      setMessage("Research summary loaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load research summary.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadExport(dataset: string, format: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/research/ai-work-study/export?dataset=${dataset}&format=${format}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(result?.message || "Could not create export.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rthnk-ai-work-study-${dataset}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Export created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create export.");
    } finally {
      setLoading(false);
    }
  }

  const groups = summary?.dependency_groups || { "Group A": 0, "Group B": 0, "Group C": 0, Uncoded: 0 };

  return (
    <section className="research-desk panel">
      <div className="status-row">
        <div>
          <div className="kicker yellow">RTHNK Research</div>
          <h2>The AI Work Study</h2>
        </div>
        <span className="kicker muted">{summary ? `${summary.response_count} stored responses` : "Central storage"}</span>
      </div>
      <p className="copy">Research by RTHNK, in cooperation with Tysma | Lems International Tax Consultants. RTHNK remains the editorial owner of the study.</p>

      <div className="research-admin-row">
        <label>
          <span>Research desk token</span>
          <input type="password" value={token} onChange={(event) => setToken(event.currentTarget.value)} placeholder="RESEARCH_ADMIN_TOKEN" />
        </label>
        <button className="solid-btn" type="button" onClick={loadSummary} disabled={!token || loading}>{loading ? "Loading..." : "Load summary"}</button>
      </div>
      {message && <p className="source-note">{message}</p>}

      <div className="research-desk-grid">
        <article>
          <h3>Segmentation</h3>
          <p>Group A: dependency score 1</p>
          <p>Group B: dependency score 2-3</p>
          <p>Group C: dependency score 4-5</p>
          <div className="mini-bars">
            {["Group A", "Group B", "Group C", "Uncoded"].map((group) => (
              <span key={group}><i style={{ width: `${Math.max(8, (groups[group] || 0) * 18)}px` }} />{group}: {groups[group] || 0}</span>
            ))}
          </div>
        </article>
        <article>
          <h3>Export sets</h3>
          <div className="export-button-grid">
            {exportSets.map((set) => (
              <button className="ghost-btn" type="button" key={`${set.dataset}-${set.format}`} onClick={() => downloadExport(set.dataset, set.format)} disabled={!token || loading}>
                {set.label}
              </button>
            ))}
          </div>
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

      <p className="source-note">Anonymous survey responses are stored separately from interview contact details. Confirmation emails are sent from research@rethinkk.org when the email provider is configured.</p>
    </section>
  );
}
