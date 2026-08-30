"use client";

import { useMemo, useState } from "react";
import { CountryAssessment, getDirectionSymbol, getMovementLabel, getStatusLabel } from "@/lib/democracy-index";
import { parseDemocracyImport, sampleDemocracyCsv } from "@/lib/democracy-import";

export function DemocracyImportDesk({ year = 2026 }: { year?: number }) {
  const [input, setInput] = useState(sampleDemocracyCsv);
  const [format, setFormat] = useState<"auto" | "csv" | "json">("auto");
  const [message, setMessage] = useState("");
  const preview = useMemo(() => {
    try {
      return parseDemocracyImport(input, format === "auto" ? undefined : format, year);
    } catch (error) {
      return {
        format: format === "json" ? "json" as const : "csv" as const,
        accepted: [],
        rejected: [{ row: 1, errors: [error instanceof Error ? error.message : "Could not parse import"] }],
        normalizedJson: "[]",
        normalizedCsv: ""
      };
    }
  }, [format, input, year]);

  function download(filename: string, contents: string, type: string) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`${filename} prepared.`);
  }

  function copyJson() {
    navigator.clipboard.writeText(preview.normalizedJson).then(() => setMessage("Normalized JSON copied."));
  }

  return (
    <div className="ddi-import-workflow">
      <div className="import-control-panel">
        <div className="status-row">
          <div>
            <div className="kicker yellow">Index import</div>
            <h3>Feed Democracy Direction</h3>
          </div>
          <div className="kicker muted">{preview.format.toUpperCase()} / {year}</div>
        </div>

        <div className="segmented-control" aria-label="Import format">
          {(["auto", "csv", "json"] as const).map((item) => (
            <button aria-pressed={format === item} key={item} onClick={() => setFormat(item)} type="button">{item}</button>
          ))}
        </div>

        <div className="field">
          <label htmlFor="ddi-import">Assessment import</label>
          <textarea
            id="ddi-import"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="button-row">
          <button className="solid-btn" type="button" onClick={() => download(`democracy-direction-${year}.json`, preview.normalizedJson, "application/json")}>Download JSON</button>
          <button className="ghost-btn" type="button" onClick={() => download(`democracy-direction-${year}.csv`, preview.normalizedCsv, "text/csv")}>Download CSV</button>
          <button className="ghost-btn" type="button" onClick={copyJson}>Copy JSON</button>
        </div>
        {message && <p className="form-note">{message}</p>}
      </div>

      <div className="import-preview-panel">
        <ImportSummary accepted={preview.accepted.length} rejected={preview.rejected.length} />
        {preview.rejected.length > 0 && (
          <div className="import-errors">
            <div className="kicker yellow">Validation errors</div>
            {preview.rejected.map((item) => (
              <div className="import-error" key={`${item.row}-${item.country || "unknown"}`}>
                <strong>Row {item.row}{item.country ? ` / ${item.country}` : ""}</strong>
                <span>{item.errors.join(" / ")}</span>
              </div>
            ))}
          </div>
        )}
        <div className="import-table" role="table" aria-label="Accepted imported country assessments">
          <div className="import-row import-row-head" role="row">
            <span>Country</span>
            <span>Status</span>
            <span>Movement</span>
            <span>Score</span>
            <span>Review</span>
          </div>
          {preview.accepted.map((country) => <ImportCountryRow country={country} key={country.id} />)}
        </div>
      </div>
    </div>
  );
}

function ImportSummary({ accepted, rejected }: { accepted: number; rejected: number }) {
  return (
    <div className="import-summary">
      <div>
        <span>{accepted}</span>
        <strong>Accepted</strong>
      </div>
      <div>
        <span>{rejected}</span>
        <strong>Rejected</strong>
      </div>
    </div>
  );
}

function ImportCountryRow({ country }: { country: CountryAssessment }) {
  return (
    <div className="import-row" role="row">
      <span>{country.countryName}<small>{country.iso3}</small></span>
      <span>{getStatusLabel(country.status)}</span>
      <span><strong>{getDirectionSymbol(country.direction, country.velocity)}</strong> {getMovementLabel(country.direction, country.velocity)}</span>
      <span>{country.overallInstitutionalScore ?? "na"} / 25</span>
      <span>{country.assessmentStatus} / {country.confidence}</span>
    </div>
  );
}
