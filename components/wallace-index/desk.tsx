"use client";
import { useState } from "react";
import {
  Assessment,
  blankScores,
  dimensions,
  label,
  Leader,
  Methodology,
  Source,
} from "@/lib/wallace-index/model";
import { proposedMethodology } from "@/lib/wallace-index/methodology";
import type { deskData } from "@/lib/wallace-index/editorial";
type Data = Awaited<ReturnType<typeof deskData>>;
const emptyLeader: Leader = {
  id: "",
  slug: "",
  name: "",
  country: "",
  office: "",
  officeStart: "",
  officeEnd: "",
  biography: "",
  archived: false,
};
const emptySource: Source = {
  id: "",
  title: "",
  author: "",
  publisher: "",
  publishedDate: "",
  type: "government",
  reference: "",
  accessedDate: new Date().toISOString().slice(0, 10),
  language: "en-GB",
  summary: "",
  provenance: "",
  reliability: "",
  relevance: "",
  archive: "",
};
const newAssessment = (): Assessment => ({
  id: "",
  leaderId: "",
  methodologyId: "",
  version: 1,
  predecessorId: null,
  correctionReason: "",
  periodStart: "",
  periodEnd: "",
  context: "",
  status: "draft",
  authorId: "",
  reviewerId: null,
  reviewDecision: "pending",
  reviewNotes: "",
  reassessOn: "",
  scores: blankScores(),
  evidence: [],
});
function Field({
  title,
  value,
  onChange,
  large = false,
  type = "text",
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  large?: boolean;
  type?: string;
}) {
  return (
    <label>
      {title}
      {large ? (
        <textarea
          value={value}
          maxLength={20000}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value}
          maxLength={20000}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
function Select({
  title,
  value,
  onChange,
  items,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  items: { id: string; name: string }[];
}) {
  return (
    <label>
      {title}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose…</option>
        {items.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
    </label>
  );
}
export function EditorialDesk({ initial }: { initial: Data }) {
  const [data, setData] = useState(initial);
  const [tab, setTab] = useState("assessments");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [leader, setLeader] = useState(emptyLeader);
  const [source, setSource] = useState(emptySource);
  const [sourcePredecessor, setSourcePredecessor] = useState("");
  const [method, setMethod] = useState<Methodology>(proposedMethodology);
  const [assessment, setAssessment] = useState<Assessment>(newAssessment());
  const [notes, setNotes] = useState("");
  const [edition, setEdition] = useState({
    slug: "",
    title: "",
    methodologyId: "",
    releaseNotes: "",
    assessmentIds: [] as string[],
  });
  const [user, setUser] = useState({
    id: "github:",
    name: "",
    roles: [] as string[],
    disabled: false,
  });
  const [content, setContent] = useState({
    slug: "",
    version: 1,
    title: "",
    body: "",
    kind: "research-note",
    status: "draft",
  });
  const [importText, setImportText] = useState("");
  const [preview, setPreview] = useState<unknown>(null);
  async function run(command: unknown) {
    setBusy(true);
    setMessage("Saving…");
    try {
      const res = await fetch("/api/wallace-index/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      });
      const body = await res.json();
      if (!res.ok) throw Error(body.error);
      const reload = await fetch("/api/wallace-index/desk", {
        cache: "no-store",
      });
      if (reload.ok) setData(await reload.json());
      setMessage(
        "Saved. Publication requires its separate review and approval steps.",
      );
      return body.result;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "The operation failed.");
      return null;
    } finally {
      setBusy(false);
    }
  }
  function loadAssessment(id: string) {
    const row = data.assessments.find((a) => a.id === id);
    if (row) setAssessment(row as unknown as Assessment);
    else setAssessment(newAssessment());
    setNotes("");
  }
  const write = data.actor.roles.includes("researcher");
  const review = data.actor.roles.includes("reviewer");
  const publish = data.actor.roles.includes("publisher");
  const admin = data.actor.roles.includes("administrator");
  const editable =
    write &&
    assessment.status === "draft" &&
    (!assessment.id || assessment.authorId === data.actor.id);
  return (
    <div className="wi-editor">
      <p>
        {data.actor.name} · {data.actor.roles.join(", ")}
      </p>
      <nav className="wi-actions" aria-label="Research desk sections">
        {[
          "assessments",
          "leaders",
          "sources",
          "methodology",
          "editions",
          "articles",
          "operations",
          ...(admin ? ["users"] : []),
        ].map((t) => (
          <button aria-pressed={tab === t} key={t} onClick={() => setTab(t)}>
            {label(t)}
          </button>
        ))}
      </nav>
      <div role="status" className="wi-notice">
        {message ||
          "Research → Evidence → Draft → Review → Approval → Publication → Reassessment"}
      </div>
      {tab === "leaders" && (
        <section>
          <h2>Leader management</h2>
          <Select
            title="Existing leader"
            value={leader.id}
            items={data.leaders.map((l) => ({ id: l.id, name: l.name }))}
            onChange={(id) =>
              setLeader(data.leaders.find((l) => l.id === id) || emptyLeader)
            }
          />
          <button onClick={() => setLeader(emptyLeader)}>New leader</button>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const { id, ...fields } = leader;
              const result = await run({
                action: "leader.save",
                data: { ...fields, ...(id ? { id } : {}) },
              });
              if (result) setLeader(result);
            }}
          >
            <fieldset disabled={!write || busy}>
              {(
                [
                  ["slug", "URL slug"],
                  ["name", "Name"],
                  ["country", "Country"],
                  ["office", "Office"],
                  ["officeStart", "Office start"],
                  ["officeEnd", "Office end (leave blank if ongoing)"],
                  ["biography", "Biography"],
                ] as const
              ).map(([key, title]) => (
                <Field
                  key={key}
                  title={title}
                  value={leader[key]}
                  type={
                    key.startsWith("office") && key !== "office"
                      ? "date"
                      : "text"
                  }
                  large={key === "biography"}
                  onChange={(v) => setLeader({ ...leader, [key]: v })}
                />
              ))}
              <label className="wi-checkbox">
                <input
                  type="checkbox"
                  checked={leader.archived}
                  onChange={(e) =>
                    setLeader({ ...leader, archived: e.target.checked })
                  }
                />
                Archive leader
              </label>
              <p>Published editions retain their original leader metadata.</p>
              <button type="submit">Save leader</button>
            </fieldset>
          </form>
        </section>
      )}
      {tab === "sources" && (
        <section>
          <h2>Source management</h2>
          <p>
            Source versions are immutable. Corrections create a new source
            version; published editions retain the original.
          </p>
          <Select
            title="Inspect or revise a source"
            value={sourcePredecessor}
            items={data.sources.map((s) => ({
              id: String(s.id),
              name: String(s.title),
            }))}
            onChange={(id) => {
              const s = data.sources.find((s) => s.id === id);
              if (s) {
                setSource({ ...s, id: "" } as Source);
                setSourcePredecessor(id);
              }
            }}
          />
          <button
            onClick={() => {
              setSource(emptySource);
              setSourcePredecessor("");
            }}
          >
            New source
          </button>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const { id: _id, ...fields } = source;
              await run({
                action: "source.create",
                data: fields,
                ...(sourcePredecessor
                  ? { predecessorId: sourcePredecessor }
                  : {}),
              });
            }}
          >
            <fieldset disabled={!write || busy}>
              {(
                [
                  ["title", "Title"],
                  ["author", "Author / issuing institution"],
                  ["publisher", "Publisher"],
                  [
                    "publishedDate",
                    "Original publication date (with precision if uncertain)",
                  ],
                  ["reference", "URL or stable reference"],
                  ["accessedDate", "Date accessed"],
                  ["language", "Language"],
                  ["summary", "Short factual summary"],
                  ["provenance", "Provenance"],
                  ["reliability", "Reliability notes"],
                  ["relevance", "Relevance notes"],
                  ["archive", "Archival reference"],
                ] as const
              ).map(([key, title]) => (
                <Field
                  key={key}
                  title={title}
                  value={source[key]}
                  type={key === "accessedDate" ? "date" : "text"}
                  large={[
                    "summary",
                    "provenance",
                    "reliability",
                    "relevance",
                  ].includes(key)}
                  onChange={(v) => setSource({ ...source, [key]: v })}
                />
              ))}
              <Select
                title="Source type"
                value={source.type}
                onChange={(type) => setSource({ ...source, type })}
                items={[
                  "government",
                  "parliament",
                  "court",
                  "speech",
                  "policy",
                  "decision-record",
                  "news",
                  "academic",
                  "biography",
                  "institute",
                  "international-institution",
                  "verified-social-statement",
                ].map((id) => ({ id, name: label(id) }))}
              />
              <button type="submit">Save new source version</button>
            </fieldset>
          </form>
        </section>
      )}
      {tab === "assessments" && (
        <section>
          <h2>Assessment and review desk</h2>
          <Select
            title="Assessment version"
            value={assessment.id}
            onChange={loadAssessment}
            items={data.assessments.map((a) => ({
              id: a.id,
              name: `${data.leaders.find((l) => l.id === a.leaderId)?.name} · v${a.version} · ${a.status}`,
            }))}
          />
          <button onClick={() => setAssessment(newAssessment())}>
            New assessment
          </button>
          <p>
            Status: <strong>{assessment.status}</strong> · Review:{" "}
            {assessment.reviewDecision}
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const result = await run({
                action: "assessment.save",
                data: {
                  ...(assessment.id ? { id: assessment.id } : {}),
                  leaderId: assessment.leaderId,
                  methodologyId: assessment.methodologyId,
                  periodStart: assessment.periodStart,
                  periodEnd: assessment.periodEnd,
                  context: assessment.context,
                  reviewerId: assessment.reviewerId,
                  reviewNotes: assessment.reviewNotes,
                  reassessOn: assessment.reassessOn,
                  scores: assessment.scores.map(
                    ({
                      dimension,
                      score,
                      rationale,
                      sufficiency,
                      reviewerNotes,
                    }) => ({
                      dimension,
                      score,
                      rationale,
                      sufficiency,
                      reviewerNotes,
                    }),
                  ),
                  evidence: assessment.evidence.map(
                    ({ sourceId, dimension, claim, context, relation }) => ({
                      sourceId,
                      dimension,
                      claim,
                      context,
                      relation,
                    }),
                  ),
                },
              });
              if (result)
                setAssessment({
                  ...assessment,
                  id: result.id,
                  authorId: data.actor.id,
                });
            }}
          >
            <fieldset disabled={!editable || busy}>
              <Select
                title="Leader"
                value={assessment.leaderId}
                onChange={(leaderId) =>
                  setAssessment({ ...assessment, leaderId })
                }
                items={data.leaders.map((l) => ({ id: l.id, name: l.name }))}
              />
              <Select
                title="Methodology version"
                value={assessment.methodologyId}
                onChange={(methodologyId) =>
                  setAssessment({ ...assessment, methodologyId })
                }
                items={data.methods.map((m) => ({
                  id: String(m.id),
                  name: `${m.version}${m.approved ? " · approved" : " · proposed"}`,
                }))}
              />
              <div className="wi-filters">
                <Field
                  title="Period start"
                  value={assessment.periodStart}
                  type="date"
                  onChange={(periodStart) =>
                    setAssessment({ ...assessment, periodStart })
                  }
                />
                <Field
                  title="Period end"
                  value={assessment.periodEnd}
                  type="date"
                  onChange={(periodEnd) =>
                    setAssessment({ ...assessment, periodEnd })
                  }
                />
                <Field
                  title="Reassess on"
                  value={assessment.reassessOn}
                  type="date"
                  onChange={(reassessOn) =>
                    setAssessment({ ...assessment, reassessOn })
                  }
                />
              </div>
              <Field
                title="Historical context"
                value={assessment.context}
                large
                onChange={(context) =>
                  setAssessment({ ...assessment, context })
                }
              />
              <Select
                title="Independent assigned reviewer"
                value={assessment.reviewerId || ""}
                onChange={(reviewerId) =>
                  setAssessment({
                    ...assessment,
                    reviewerId: reviewerId || null,
                  })
                }
                items={data.users
                  .filter(
                    (u) =>
                      u.roles.includes("reviewer") &&
                      !u.disabled &&
                      u.id !== data.actor.id,
                  )
                  .map((u) => ({ id: u.id, name: u.name }))}
              />
              {dimensions.map((d) => {
                const s = assessment.scores.find((s) => s.dimension === d)!;
                const update = (patch: Partial<typeof s>) =>
                  setAssessment({
                    ...assessment,
                    scores: assessment.scores.map((x) =>
                      x.dimension === d ? { ...x, ...patch } : x,
                    ),
                  });
                return (
                  <details key={d} open>
                    <summary>
                      {label(d)} · {s.score ?? "Not assessed"}
                    </summary>
                    <label>
                      Score
                      <select
                        value={s.score === null ? "" : s.score}
                        onChange={(e) =>
                          update({
                            score:
                              e.target.value === ""
                                ? null
                                : (Number(e.target.value) as 0 | 1 | 2 | 3),
                            sufficiency:
                              e.target.value === ""
                                ? "not_assessed"
                                : "sufficient",
                          })
                        }
                      >
                        <option value="">Not assessed</option>
                        {[0, 1, 2, 3].map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                    <Select
                      title="Evidence sufficiency"
                      value={s.sufficiency}
                      onChange={(sufficiency) =>
                        update({
                          sufficiency: sufficiency as typeof s.sufficiency,
                          ...(sufficiency !== "sufficient"
                            ? { score: null }
                            : {}),
                        })
                      }
                      items={["sufficient", "insufficient", "not_assessed"].map(
                        (id) => ({ id, name: label(id) }),
                      )}
                    />
                    <Field
                      title="Written rationale"
                      value={s.rationale}
                      large
                      onChange={(rationale) => update({ rationale })}
                    />
                    <Field
                      title="Internal research notes / contradictory evidence"
                      value={s.reviewerNotes}
                      large
                      onChange={(reviewerNotes) => update({ reviewerNotes })}
                    />
                    {assessment.evidence.map((e, i) =>
                      e.dimension === d ? (
                        <div className="wi-card" key={i}>
                          <Select
                            title="Source version"
                            value={e.sourceId}
                            onChange={(sourceId) =>
                              setAssessment({
                                ...assessment,
                                evidence: assessment.evidence.map((x, n) =>
                                  n === i ? { ...x, sourceId } : x,
                                ),
                              })
                            }
                            items={data.sources.map((s) => ({
                              id: String(s.id),
                              name: String(s.title),
                            }))}
                          />
                          <Field
                            title="Claim supported or contextualised"
                            value={e.claim}
                            large
                            onChange={(claim) =>
                              setAssessment({
                                ...assessment,
                                evidence: assessment.evidence.map((x, n) =>
                                  n === i ? { ...x, claim } : x,
                                ),
                              })
                            }
                          />
                          <Field
                            title="Context and contradictory evidence"
                            value={e.context}
                            large
                            onChange={(context) =>
                              setAssessment({
                                ...assessment,
                                evidence: assessment.evidence.map((x, n) =>
                                  n === i ? { ...x, context } : x,
                                ),
                              })
                            }
                          />
                          <Select
                            title="Evidence relationship"
                            value={e.relation}
                            onChange={(relation) =>
                              setAssessment({
                                ...assessment,
                                evidence: assessment.evidence.map((x, n) =>
                                  n === i
                                    ? {
                                        ...x,
                                        relation: relation as typeof e.relation,
                                      }
                                    : x,
                                ),
                              })
                            }
                            items={[
                              "supporting",
                              "contradicting",
                              "qualifying",
                            ].map((id) => ({ id, name: label(id) }))}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setAssessment({
                                ...assessment,
                                evidence: assessment.evidence.filter(
                                  (_, n) => n !== i,
                                ),
                              })
                            }
                          >
                            Remove evidence link
                          </button>
                        </div>
                      ) : null,
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setAssessment({
                          ...assessment,
                          evidence: [
                            ...assessment.evidence,
                            {
                              dimension: d,
                              sourceId: "",
                              claim: "",
                              context: "",
                              relation: "supporting",
                            },
                          ],
                        })
                      }
                    >
                      Link evidence to {label(d)}
                    </button>
                  </details>
                );
              })}
              <button type="submit">Save research draft</button>
            </fieldset>
          </form>
          {assessment.id && (
            <section className="wi-card">
              <h3>Review and publication controls</h3>
              <p>
                Author:{" "}
                {data.users.find((u) => u.id === assessment.authorId)?.name ||
                  assessment.authorId}{" "}
                · Assigned reviewer:{" "}
                {data.users.find((u) => u.id === assessment.reviewerId)?.name ||
                  "Not assigned"}
              </p>
              <p>Previous review notes: {assessment.reviewNotes || "None"}</p>
              <Field
                title="Review decision, disagreement resolution or revision reason"
                value={notes}
                large
                onChange={setNotes}
              />
              <div className="wi-actions">
                {[
                  [
                    "submit",
                    "Submit for review",
                    write && assessment.status === "draft",
                  ],
                  [
                    "accept",
                    "Accept review",
                    review && assessment.status === "in_review",
                  ],
                  [
                    "reject",
                    "Request changes",
                    review && assessment.status === "in_review",
                  ],
                  [
                    "approve",
                    "Editorial approval",
                    publish && assessment.status === "in_review",
                  ],
                ].map(
                  ([action, title, show]) =>
                    show && (
                      <button
                        key={String(action)}
                        disabled={busy || !notes.trim()}
                        onClick={async () => {
                          const r = await run({
                            action: `assessment.${action}`,
                            id: assessment.id,
                            notes,
                          });
                          if (r) setAssessment({ ...assessment, ...r });
                        }}
                      >
                        {title}
                      </button>
                    ),
                )}
                {write && assessment.status === "published" && (
                  <button
                    disabled={busy || !notes.trim()}
                    onClick={async () => {
                      const r = await run({
                        action: "assessment.revise",
                        id: assessment.id,
                        reason: notes,
                      });
                      if (r) {
                        setAssessment({
                          ...newAssessment(),
                          ...r,
                          scores: assessment.scores,
                          evidence: assessment.evidence,
                        });
                      }
                    }}
                  >
                    Create documented revision
                  </button>
                )}
              </div>
            </section>
          )}
        </section>
      )}
      {tab === "methodology" && (
        <section>
          <h2>Versioned methodology</h2>
          <Select
            title="Inspect a version"
            value={method.id}
            onChange={(id) => {
              const m = data.methods.find((m) => m.id === id);
              if (m) setMethod(m as unknown as Methodology);
            }}
            items={data.methods.map((m) => ({
              id: String(m.id),
              name: String(m.version),
            }))}
          />
          <button
            onClick={() =>
              setMethod({
                ...method,
                id: `methodology-${Date.now()}`,
                version: "",
                approved: false,
              })
            }
          >
            Fork a new proposed version
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run({ action: "methodology.save", data: method });
            }}
          >
            <fieldset disabled={!write || method.approved || busy}>
              <Field
                title="Version"
                value={method.version}
                onChange={(version) => setMethod({ ...method, version })}
              />
              {method.descriptors.map((v, i) => (
                <Field
                  key={i}
                  title={`Score ${i} definition`}
                  value={v}
                  onChange={(v) =>
                    setMethod({
                      ...method,
                      descriptors: method.descriptors.map((x, n) =>
                        n === i ? v : x,
                      ),
                    })
                  }
                />
              ))}
              {dimensions.map((d) => (
                <details key={d}>
                  <summary>{label(d)} rubric</summary>
                  {(
                    ["definition", "positive", "negative", "guidance"] as const
                  ).map((k) => (
                    <Field
                      key={k}
                      title={label(k)}
                      value={method.rubrics[d][k]}
                      large
                      onChange={(v) =>
                        setMethod({
                          ...method,
                          rubrics: {
                            ...method.rubrics,
                            [d]: { ...method.rubrics[d], [k]: v },
                          },
                        })
                      }
                    />
                  ))}
                  <Field
                    title="Observable indicators (one per line)"
                    value={method.rubrics[d].indicators.join("\n")}
                    large
                    onChange={(v) =>
                      setMethod({
                        ...method,
                        rubrics: {
                          ...method.rubrics,
                          [d]: {
                            ...method.rubrics[d],
                            indicators: v.split("\n"),
                          },
                        },
                      })
                    }
                  />
                </details>
              ))}
              {(
                [
                  "evidence",
                  "ambiguity",
                  "periods",
                  "missing",
                  "reassessment",
                  "disagreements",
                  "changelog",
                ] as const
              ).map((k) => (
                <Field
                  key={k}
                  title={label(k)}
                  value={method[k]}
                  large
                  onChange={(v) => setMethod({ ...method, [k]: v })}
                />
              ))}
              <button>Save proposed version</button>
            </fieldset>
          </form>
          {publish && !method.approved && (
            <button
              disabled={busy || !data.methods.some((m) => m.id === method.id)}
              onClick={async () => {
                if (
                  window.confirm(
                    "Approve this methodology for editorial use? Approved versions cannot be edited.",
                  )
                ) {
                  const r = await run({
                    action: "methodology.approve",
                    id: method.id,
                  });
                  if (r) setMethod({ ...method, approved: true });
                }
              }}
            >
              Approve saved methodology
            </button>
          )}
        </section>
      )}
      {tab === "editions" && (
        <section>
          <h2>Freeze and publish an edition</h2>
          <p>
            Publishing freezes the selected assessments, source versions, public
            leader metadata and methodology. The operation is atomic and cannot
            silently overwrite an edition.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (
                window.confirm(
                  "Publish this dated research edition? The snapshot will be immutable.",
                )
              )
                await run({ action: "edition.publish", data: edition });
            }}
          >
            <fieldset disabled={!publish || busy}>
              <Field
                title="Edition slug"
                value={edition.slug}
                onChange={(slug) => setEdition({ ...edition, slug })}
              />
              <Field
                title="Edition title"
                value={edition.title}
                onChange={(title) => setEdition({ ...edition, title })}
              />
              <Select
                title="Approved methodology"
                value={edition.methodologyId}
                onChange={(methodologyId) =>
                  setEdition({ ...edition, methodologyId, assessmentIds: [] })
                }
                items={data.methods
                  .filter((m) => m.approved)
                  .map((m) => ({ id: String(m.id), name: String(m.version) }))}
              />
              <Field
                title="Release notes"
                value={edition.releaseNotes}
                large
                onChange={(releaseNotes) =>
                  setEdition({ ...edition, releaseNotes })
                }
              />
              {data.assessments
                .filter(
                  (a) =>
                    ["approved", "published"].includes(a.status) &&
                    a.methodologyId === edition.methodologyId,
                )
                .map((a) => (
                  <label className="wi-checkbox" key={a.id}>
                    <input
                      type="checkbox"
                      checked={edition.assessmentIds.includes(a.id)}
                      onChange={(e) =>
                        setEdition({
                          ...edition,
                          assessmentIds: e.target.checked
                            ? [...edition.assessmentIds, a.id]
                            : edition.assessmentIds.filter((id) => id !== a.id),
                        })
                      }
                    />
                    {data.leaders.find((l) => l.id === a.leaderId)?.name} · v
                    {a.version} · {a.status}
                  </label>
                ))}
              <button>Publish immutable edition</button>
            </fieldset>
          </form>
          <h3>Published editions</h3>
          <ul>
            {data.editions.map((e) => (
              <li key={e.id}>
                <a href={`/wallace-index/editions/${e.slug}`}>{e.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {tab === "articles" && (
        <section>
          <h2>Research notes and updates</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run({ action: "content.save", data: content });
            }}
          >
            <fieldset disabled={busy || (!write && !publish)}>
              <Field
                title="Slug"
                value={content.slug}
                onChange={(slug) => setContent({ ...content, slug })}
              />
              <Field
                title="Version (new version for corrections)"
                value={String(content.version)}
                type="number"
                onChange={(v) => setContent({ ...content, version: Number(v) })}
              />
              <Field
                title="Title"
                value={content.title}
                onChange={(title) => setContent({ ...content, title })}
              />
              <Field
                title="Body (plain text)"
                value={content.body}
                large
                onChange={(body) => setContent({ ...content, body })}
              />
              <Select
                title="Content kind"
                value={content.kind}
                onChange={(kind) => setContent({ ...content, kind })}
                items={["article", "research-note", "explanation"].map(
                  (id) => ({ id, name: label(id) }),
                )}
              />
              <Select
                title="Publication status"
                value={content.status}
                onChange={(status) => setContent({ ...content, status })}
                items={["draft", ...(publish ? ["published"] : [])].map(
                  (id) => ({ id, name: label(id) }),
                )}
              />
              <button>Save content version</button>
            </fieldset>
          </form>
          <ul>
            {data.content.map((c) => (
              <li key={c.id}>
                {c.title} · v{c.version} · {c.status}
              </li>
            ))}
          </ul>
        </section>
      )}
      {tab === "users" && admin && (
        <section>
          <h2>Editorial permissions</h2>
          <Select
            title="Existing account"
            value={user.id}
            onChange={(id) => {
              const u = data.users.find((u) => u.id === id);
              if (u) setUser(u);
            }}
            items={data.users.map((u) => ({ id: u.id, name: u.name }))}
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run({ action: "user.save", data: user });
            }}
          >
            <Field
              title="GitHub identity (github: followed by immutable numeric account ID)"
              value={user.id}
              onChange={(id) => setUser({ ...user, id })}
            />
            <Field
              title="Public editorial attribution"
              value={user.name}
              onChange={(name) => setUser({ ...user, name })}
            />
            {["administrator", "researcher", "reviewer", "publisher"].map(
              (role) => (
                <label className="wi-checkbox" key={role}>
                  <input
                    type="checkbox"
                    checked={user.roles.includes(role)}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        roles: e.target.checked
                          ? [...user.roles, role]
                          : user.roles.filter((r) => r !== role),
                      })
                    }
                  />
                  {label(role)}
                </label>
              ),
            )}
            <label className="wi-checkbox">
              <input
                type="checkbox"
                checked={user.disabled}
                onChange={(e) =>
                  setUser({ ...user, disabled: e.target.checked })
                }
              />
              Disable account
            </label>
            <button disabled={busy}>Save permissions</button>
          </form>
        </section>
      )}
      {tab === "operations" && (
        <section>
          <h2>Research operations</h2>
          <h3>Reassessment reminders</h3>
          <ul>
            {data.assessments
              .filter((a) => a.status === "published")
              .map((a) => (
                <li key={a.id}>
                  {data.leaders.find((l) => l.id === a.leaderId)?.name} ·
                  reassess {a.reassessOn}
                  {a.reassessOn < new Date().toISOString().slice(0, 10)
                    ? " · overdue"
                    : ""}
                </li>
              ))}
          </ul>
          <h3>Structured JSON import</h3>
          <p>
            Imports create drafts only. Duplicate identities and source
            references require review. Existing published data is never
            overwritten.
          </p>
          <Field
            title="Import document (schemaVersion, leaders, sources, assessments)"
            value={importText}
            large
            onChange={(v) => {
              setImportText(v);
              setPreview(null);
            }}
          />
          <div className="wi-actions">
            <button
              disabled={!write || busy}
              onClick={async () => {
                try {
                  setPreview(
                    await run({
                      action: "import.preview",
                      data: JSON.parse(importText),
                    }),
                  );
                } catch {
                  setMessage("Invalid JSON.");
                }
              }}
            >
              Validate and preview
            </button>
            <button
              disabled={
                !write || busy || !(preview as { valid?: boolean })?.valid
              }
              onClick={async () => {
                try {
                  await run({
                    action: "import.apply",
                    data: JSON.parse(importText),
                  });
                  setPreview(null);
                } catch {
                  setMessage("Invalid JSON.");
                }
              }}
            >
              Import as drafts
            </button>
            <a href="/api/wallace-index/backup">
              Download private research export
            </a>
          </div>
          {preview !== null && <pre>{JSON.stringify(preview, null, 2)}</pre>}
          <h3>Contribution review queue</h3>
          {data.contributions.map((c) => (
            <article className="wi-card" key={c.id}>
              <strong>{c.reference}</strong>
              <p>{c.text}</p>
              <p>
                {c.contact} · {c.status}
              </p>
              {review && (
                <button
                  disabled={busy}
                  onClick={() => {
                    const notes = window.prompt(
                      "Editorial disposition and required follow-up",
                    );
                    if (notes)
                      void run({
                        action: "contribution.review",
                        id: c.id,
                        status: "reviewed",
                        notes,
                      });
                  }}
                >
                  Record editorial review
                </button>
              )}
            </article>
          ))}
          <h3>Source maintenance</h3>
          <ul>
            {data.checks.map((c) => (
              <li key={c.id}>
                {c.sourceId} · {c.result} · {String(c.checkedAt).slice(0, 10)}
              </li>
            ))}
          </ul>
          <h3>Audit trail (latest 100 events)</h3>
          <ul>
            {data.auditEvents.map((e) => (
              <li key={e.id}>
                <details>
                  <summary>
                    {String(e.createdAt).slice(0, 19)} · {e.action} · {e.actor}
                  </summary>
                  <pre>{JSON.stringify(e.metadata, null, 2)}</pre>
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
