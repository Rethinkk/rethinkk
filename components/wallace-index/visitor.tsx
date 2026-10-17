"use client";
import { useEffect, useState } from "react";
import {
  blankScores,
  dimensions,
  DimensionScore,
  Edition,
  label,
  total,
} from "@/lib/wallace-index/model";
type Visitor = {
  schemaVersion: 1;
  name: string;
  officialId: string;
  editionId: string;
  scores: DimensionScore[];
  notes: Record<string, string>;
  evidence: Record<string, string>;
};
const initial: Visitor = {
  schemaVersion: 1,
  name: "",
  officialId: "",
  editionId: "",
  scores: blankScores(),
  notes: {},
  evidence: {},
};
function valid(v: unknown): v is Visitor {
  if (!v || typeof v !== "object") return false;
  const x = v as Visitor;
  return (
    x.schemaVersion === 1 &&
    typeof x.name === "string" &&
    x.name.length <= 300 &&
    typeof x.officialId === "string" &&
    typeof x.editionId === "string" &&
    Array.isArray(x.scores) &&
    x.scores.length === 6 &&
    new Set(x.scores.map((s) => s.dimension)).size === 6 &&
    x.scores.every(
      (s) =>
        dimensions.includes(s.dimension) &&
        (s.score === null ||
          (Number.isInteger(s.score) && s.score >= 0 && s.score <= 3)),
    ) &&
    !!x.notes &&
    !!x.evidence &&
    [x.notes, x.evidence].every(
      (r) =>
        typeof r === "object" &&
        Object.values(r).every(
          (t) => typeof t === "string" && t.length <= 10000,
        ),
    )
  );
}
export function VisitorTool({
  edition,
  researchLeaders = [],
}: {
  edition: Edition;
  researchLeaders?: { id: string; name: string }[];
}) {
  const [data, setData] = useState<Visitor>(initial);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const shared = window.location.hash.startsWith("#assessment=")
        ? decodeURIComponent(window.location.hash.slice(12))
        : null;
      const raw =
        shared || localStorage.getItem("rethinkk-wallace-assessment-v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (valid(parsed)) setData(parsed);
        else
          setMessage(
            "The saved assessment could not be read. You can start a new one.",
          );
      }
    } catch {
      setMessage("Saved or shared data could not be loaded.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(
          "rethinkk-wallace-assessment-v1",
          JSON.stringify(data),
        );
      } catch {
        setMessage(
          "Browser storage is unavailable. Download JSON to keep your work.",
        );
      }
  }, [data, ready]);
  const official =
    data.editionId === edition.id
      ? edition.assessments.find((a) => a.id === data.officialId)
      : undefined;
  const rubric = edition.methodology;
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-wallace-assessment.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  async function share() {
    const url = `${window.location.origin}/wallace-index/assess?edition=${encodeURIComponent(edition.slug)}${edition.demonstration ? "&demo=1" : ""}#assessment=${encodeURIComponent(JSON.stringify(data))}`;
    if (url.length > 16000) {
      setMessage(
        "This assessment is too long for a reliable share link. Download JSON instead.",
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setMessage(
        "Share link copied. Anyone receiving it can read all included notes and references.",
      );
    } catch {
      setMessage("Clipboard access is unavailable. Download JSON instead.");
    }
  }
  return (
    <>
      <div className="wi-notice">
        <strong>Your assessment — not a RETHINKK editorial score.</strong>
        <p>
          Saved in this browser only. Your work does not change the official
          index. Export a copy to keep it; clearing browser data removes local
          work.
        </p>
      </div>
      <div className="wi-filters">
        <label>
          Choose a leader profile
          <select
            value={data.officialId}
            onChange={(e) => {
              const a = edition.assessments.find(
                (a) => a.id === e.target.value,
              );
              setData({
                ...data,
                officialId: e.target.value,
                editionId: edition.id,
                name:
                  a?.leader.name ||
                  researchLeaders.find(
                    (p) => `research:${p.id}` === e.target.value,
                  )?.name ||
                  "",
              });
            }}
          >
            <option value="">Temporary custom profile</option>
            {researchLeaders
              .filter(
                (p) => !edition.assessments.some((a) => a.leader.slug === p.id),
              )
              .map((p) => (
                <option key={p.id} value={`research:${p.id}`}>
                  {p.name} — research draft; no official score
                </option>
              ))}
            {edition.assessments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.leader.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Leader or temporary profile name
          <input
            maxLength={300}
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </label>
      </div>
      <p className="wi-muted">
        Scoring guidance: {rubric.version}
        {!rubric.approved ? " · proposed; awaiting editorial approval" : ""}.
      </p>
      <div className="wi-score-form">
        {dimensions.map((d) => {
          const s = data.scores.find((s) => s.dimension === d)!;
          return (
            <fieldset key={d}>
              <legend>{label(d)}</legend>
              <p>{rubric.rubrics[d].definition}</p>
              <details>
                <summary>Scoring guidance and examples</summary>
                <p>{rubric.rubrics[d].guidance}</p>
                <ul>
                  {rubric.rubrics[d].indicators.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p>Positive example: {rubric.rubrics[d].positive}</p>
                <p>Negative example: {rubric.rubrics[d].negative}</p>
              </details>
              <label>
                Your score
                <select
                  aria-label="Your score"
                  value={s.score === null ? "" : s.score}
                  onChange={(e) => {
                    const score =
                      e.target.value === ""
                        ? null
                        : (Number(e.target.value) as 0 | 1 | 2 | 3);
                    setData({
                      ...data,
                      scores: data.scores.map((x) =>
                        x.dimension === d
                          ? {
                              ...x,
                              score,
                              sufficiency:
                                score === null ? "not_assessed" : "sufficient",
                            }
                          : x,
                      ),
                    });
                  }}
                >
                  <option value="">Not assessed / insufficient evidence</option>
                  {rubric.descriptors.map((x, i) => (
                    <option key={i} value={i}>
                      {i} — {x}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Your notes
                <textarea
                  maxLength={10000}
                  value={data.notes[d] || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      notes: { ...data.notes, [d]: e.target.value },
                    })
                  }
                />
              </label>
              <label>
                Your evidence references
                <textarea
                  maxLength={10000}
                  value={data.evidence[d] || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      evidence: { ...data.evidence, [d]: e.target.value },
                    })
                  }
                />
              </label>
            </fieldset>
          );
        })}
      </div>
      <section className="wi-card">
        <h2>Your six-dimension profile</h2>
        <p>{data.name || "Unnamed temporary profile"}</p>
        <p className="wi-total">
          {total(data.scores) === null
            ? "Incomplete assessment"
            : `${total(data.scores)} / 18`}
          <span>Descriptive aggregate; all six dimensions are required</span>
        </p>
        <table className="wi-table">
          <thead>
            <tr>
              <th scope="col">Dimension</th>
              <th scope="col">Your assessment</th>
              {official && (
                <th scope="col">
                  {edition.demonstration
                    ? "Fictional demonstration"
                    : "RETHINKK published assessment"}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((d) => (
              <tr key={d}>
                <th scope="row">{label(d)}</th>
                <td>
                  {data.scores.find((s) => s.dimension === d)?.score ??
                    "Not assessed"}
                  <span className="wi-track" aria-hidden="true">
                    <span
                      style={{
                        width: `${((data.scores.find((s) => s.dimension === d)?.score ?? 0) / 3) * 100}%`,
                      }}
                    />
                  </span>
                </td>
                {official && (
                  <td>
                    {official.scores.find((s) => s.dimension === d)?.score ??
                      "Not assessed"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {data.officialId && !official && (
          <p>
            {data.officialId.startsWith("research:")
              ? "This research profile has no official editorial score to compare. Your assessment remains independent."
              : "The original published comparison is not in this edition. Select its edition to compare; your work is preserved."}
          </p>
        )}
        <div className="wi-actions wi-no-print">
          <button onClick={download}>Download JSON</button>
          <button onClick={() => window.print()}>Print / save as PDF</button>
          <button onClick={share}>Copy share link (includes your notes)</button>
          <label className="wi-button">
            Import JSON
            <input
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 100000) {
                  setMessage("Choose a JSON file smaller than 100 KB.");
                  return;
                }
                try {
                  const parsed = JSON.parse(await f.text());
                  if (!valid(parsed)) throw Error();
                  setData(parsed);
                  setMessage("Assessment imported locally.");
                } catch {
                  setMessage(
                    "Invalid assessment file. Existing work was preserved.",
                  );
                }
                e.target.value = "";
              }}
            />
          </label>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Clear this browser’s visitor assessment? Download a copy first if you want to keep it.",
                )
              ) {
                setData(initial);
                window.history.replaceState(null, "", window.location.pathname);
                setMessage("Local assessment cleared.");
              }
            }}
          >
            Clear local assessment
          </button>
        </div>
      </section>
      <p role="status">{message}</p>
      <p>
        Sharing is optional. The link contains your notes and evidence
        references; anyone with the link can read them. No visitor scores are
        published or added to official rankings.
      </p>
    </>
  );
}
