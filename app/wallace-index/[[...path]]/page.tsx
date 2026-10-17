import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogue } from "@/lib/wallace-index/catalogue";
import { dimensions, Edition, label, total } from "@/lib/wallace-index/model";
import { proposedMethodology } from "@/lib/wallace-index/methodology";
import { Explorer, Comparison } from "@/components/wallace-index/explorer";
import { VisitorTool } from "@/components/wallace-index/visitor";
import { ContributionForm } from "@/components/wallace-index/contribution";
import { ResearchResults } from "@/components/wallace-index/research-results";
import { researchProfiles } from "@/lib/wallace-index/research";
import { ResearchExplorer } from "@/components/wallace-index/research-explorer";
import {
  ResearchNotice,
  ResearchProfileView,
  ResearchComparison,
  ResearchSources,
} from "@/components/wallace-index/research-profile";
import { publicNotes } from "@/lib/wallace-index/publications";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "The Wallace Index | RETHINKK",
  description:
    "A comparative research framework examining political leadership through people, process, policy, crisis, humility and service.",
};
type Params = { path?: string[] };
type Search = {
  edition?: string;
  demo?: string;
  leaders?: string;
  assessment?: string;
  research?: string;
};
function Heading({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="wi-heading">
      <p className="wi-kicker">{kicker}</p>
      <h1>{title}</h1>
      {children && <div className="wi-intro">{children}</div>}
    </header>
  );
}
function EditionPicker({
  editions,
  current,
  route,
}: {
  editions: Edition[];
  current?: Edition;
  route: string;
}) {
  return (
    <nav className="wi-editions" aria-label="Assessment editions">
      <span>Edition:</span>
      {editions.map((e) => (
        <Link
          aria-current={current?.id === e.id ? "page" : undefined}
          key={e.id}
          href={`/wallace-index/${route}?edition=${encodeURIComponent(e.slug)}${e.demonstration ? "&demo=1" : ""}`}
        >
          {e.title}
        </Link>
      ))}
    </nav>
  );
}
export default async function WallacePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { path = [] } = await params;
  const q = await searchParams;
  const route = path[0] || "overview";
  if (
    path.length > 2 ||
    ![
      "overview",
      "explore",
      "compare",
      "leaders",
      "assess",
      "methodology",
      "sources",
      "editions",
      "about",
      "notes",
    ].includes(route)
  )
    notFound();
  const notes = await publicNotes();
  const cat = await catalogue(q.demo === "1");
  const edition = q.edition
    ? cat.editions.find((e) => e.slug === q.edition)
    : cat.editions[0];
  const method = edition?.methodology || proposedMethodology;
  const demo = edition?.demonstration;
  const useResearch = !demo && !q.edition && (q.research === "1" || !edition);
  const empty = (
    <div className="wi-empty">
      <h2>No editorial assessments published yet</h2>
      <p>
        {cat.unavailable
          ? "The editorial catalogue is not connected or is temporarily unavailable. No scores are inferred from missing data."
          : "Published profiles will appear after evidence collection, review and editorial approval."}
      </p>
      <Link
        className="text-link"
        href={`/wallace-index/${route === "leaders" ? "explore" : route}?demo=1`}
      >
        Explore clearly labelled fictional demonstration profiles →
      </Link>
    </div>
  );
  return (
    <>
      {demo && (
        <aside className="wi-notice">
          <strong>Demonstration only — entirely fictional profiles.</strong>
          <p>
            These profiles illustrate the interface. They are not factual
            assessments, approved research or editorial scores.
          </p>
          <Link
            href={`/wallace-index/${["leaders", "sources"].includes(route) ? "explore" : route}`}
          >
            Return to the editorial index →
          </Link>
        </aside>
      )}
      {q.edition && !edition && (
        <p className="wi-notice">
          That edition is not available. Choose a published edition below.
        </p>
      )}
      {route === "overview" && (
        <>
          <Heading
            kicker="RETHINKK Research / The Wallace Index"
            title="Leadership. Examined."
          >
            <p>People. Process. Policy. Crisis. Humility. Service.</p>
            <p>
              A comparative framework for examining political leadership on
              moral and institutional grounds. We don’t shout, we present.
            </p>
          </Heading>
          <div className="wi-actions">
            <Link
              className="wi-button wi-primary"
              href="/wallace-index/explore"
            >
              Explore the index →
            </Link>
            <Link className="wi-button" href="/wallace-index/assess">
              Conduct your own assessment →
            </Link>
          </div>
          <section className="wi-section">
            <p className="wi-kicker">
              Six dimensions · one transparent framework
            </p>
            <div className="wi-grid wi-dimensions">
              {dimensions.map((d, i) => (
                <article key={d}>
                  <span className="wi-number">0{i + 1}</span>
                  <h2>{label(d)}</h2>
                  <p>{method.rubrics[d].definition}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="wi-grid wi-section">
            <div>
              <h2>Evidence before judgement.</h2>
              <p>
                Each official score requires a written rationale and traceable
                evidence. Assessments are reviewed and approved before
                publication. Dated editions preserve the research as it stood.
              </p>
              <Link className="text-link" href="/wallace-index/methodology">
                Read the methodology →
              </Link>
            </div>
            <div>
              <h2>What the index does not measure.</h2>
              <p>
                Ideology, popularity, electoral success and political
                affiliation are outside its scope. The total out of 18 is a
                descriptive aggregate, not a scientifically validated
                measurement of leadership quality.
              </p>
              <Link className="text-link" href="/wallace-index/about">
                Background and limitations →
              </Link>
            </div>
          </section>
          {!demo && (
            <section className="wi-section">
              <h2>Five leadership research profiles</h2>
              <ResearchNotice />
              <ResearchResults profiles={researchProfiles} />
              <p>
                Boris Johnson, Keir Starmer, Andy Burnham, Barack Obama and Olaf
                Scholz: six-dimension concept assessments with supporting
                evidence, counterevidence and explicit uncertainties.
              </p>
              <Link
                className="text-link"
                href="/wallace-index/explore?research=1"
              >
                Read and compare the research profiles →
              </Link>
            </section>
          )}
          {edition ? (
            <section className="wi-section">
              <h2>Latest comparative assessment</h2>
              <Link href={`/wallace-index/explore?edition=${edition.slug}`}>
                {edition.title} →
              </Link>
            </section>
          ) : null}
          {!!notes.length && (
            <section className="wi-section">
              <h2>Research notes and updates</h2>
              <ul>
                {notes
                  .filter(
                    (n, i) => notes.findIndex((x) => x.slug === n.slug) === i,
                  )
                  .map((n) => (
                    <li key={n.id}>
                      <Link href={`/wallace-index/notes/${n.slug}`}>
                        {n.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </>
      )}
      {(route === "explore" || route === "compare") && (
        <>
          <Heading
            kicker="Comparative assessment"
            title={
              route === "compare"
                ? "Compare leadership profiles."
                : "Explore the evidence."
            }
          >
            <p>
              Read the six dimensions together. A high total must never obscure
              a weak dimension.
            </p>
          </Heading>
          <EditionPicker
            editions={cat.editions}
            current={edition}
            route={route}
          />
          {!demo && edition && (
            <p>
              <Link href={`/wallace-index/${route}?research=1`}>
                Browse qualitative research drafts →
              </Link>
            </p>
          )}
          {useResearch ? (
            <>
              <ResearchNotice />
              {route === "compare" && q.leaders ? (
                <ResearchComparison ids={q.leaders.split(",")} />
              ) : (
                <ResearchExplorer profiles={researchProfiles} />
              )}
            </>
          ) : edition ? (
            <>
              {route === "compare" && q.leaders ? (
                <Comparison edition={edition} ids={q.leaders.split(",")} />
              ) : (
                <Explorer edition={edition} compare />
              )}
              <details className="wi-method-panel">
                <summary>Methodology and scoring guidance</summary>
                <p>{method.evidence}</p>
                <ol start={0}>
                  {method.descriptors.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ol>
                <p>{method.missing}</p>
                <Link href="/wallace-index/methodology">
                  Full methodology →
                </Link>
              </details>
            </>
          ) : (
            empty
          )}
        </>
      )}
      {route === "leaders" &&
        (() => {
          const research =
            !demo &&
            !q.edition &&
            !q.assessment &&
            researchProfiles.find((p) => p.id === path[1]);
          if (
            research &&
            (useResearch ||
              q.research === "1" ||
              !edition?.assessments.some((a) => a.leader.slug === path[1]))
          )
            return <ResearchProfileView profile={research} />;
          const a = edition?.assessments.find(
            (a) =>
              a.leader.slug === path[1] &&
              (!q.assessment || q.assessment === a.id),
          );
          if (!a) {
            return (
              <>
                <Heading
                  kicker="Leadership profile"
                  title="Profile unavailable"
                />
                {empty}
              </>
            );
          }
          return (
            <>
              <Heading
                kicker={`${a.leader.country} / ${a.leader.office}`}
                title={a.leader.name}
              >
                <p>{a.leader.biography}</p>
              </Heading>
              <p>
                Office dates: {a.leader.officeStart || "Not recorded"} –{" "}
                {a.leader.officeEnd || "Present / not recorded"}
              </p>
              <p>
                Assessment period: {a.periodStart} – {a.periodEnd} · Version{" "}
                {a.version} · {edition!.title}
              </p>
              <p>
                Assessed by {a.assessor} · Reviewed by {a.reviewer} · Published
                by {a.publisher} on {a.publishedAt.slice(0, 10)}
              </p>
              <p>{a.context}</p>
              <p className="wi-total">
                {total(a.scores) === null
                  ? "Incomplete assessment"
                  : `${total(a.scores)} / 18`}
                <span>Descriptive aggregate · not a validated measurement</span>
              </p>
              <div className="wi-actions">
                <Link
                  className="wi-button"
                  href={`/wallace-index/compare?edition=${edition!.slug}${demo ? "&demo=1" : ""}`}
                >
                  Compare profiles
                </Link>
                <Link
                  className="wi-button"
                  href={`/wallace-index/assess?edition=${edition!.slug}${demo ? "&demo=1" : ""}`}
                >
                  Make your own assessment
                </Link>
              </div>
              {dimensions.map((d) => {
                const s = a.scores.find((s) => s.dimension === d);
                return (
                  <section id={d} key={d} className="wi-section">
                    <div className="wi-score-heading">
                      <h2>{label(d)}</h2>
                      <strong>
                        {s?.score ?? "Not assessed"}
                        {s?.score !== null && s?.score !== undefined
                          ? " / 3"
                          : ""}
                      </strong>
                    </div>
                    <span className="wi-track" aria-hidden="true">
                      <span
                        style={{ width: `${((s?.score ?? 0) / 3) * 100}%` }}
                      />
                    </span>
                    <p>{method.rubrics[d].definition}</p>
                    <h3>Assessment rationale</h3>
                    <p>{s?.rationale || "Insufficient evidence"}</p>
                    <h3>Evidence overview</h3>
                    <ul>
                      {a.evidence
                        .filter((e) => e.dimension === d)
                        .map((e, i) => (
                          <li key={i}>
                            <Link
                              href={`/wallace-index/sources/${e.sourceId}?edition=${edition!.slug}${demo ? "&demo=1" : ""}`}
                            >
                              {a.sources.find((s) => s.id === e.sourceId)
                                ?.title || e.sourceId}
                            </Link>
                            <p>
                              {label(e.relation)}: {e.claim}
                            </p>
                            <p className="wi-muted">{e.context}</p>
                          </li>
                        ))}
                    </ul>
                  </section>
                );
              })}
              <section className="wi-section">
                <h2>Assessment history</h2>
                <p>{a.correctionReason || "Initial assessment version."}</p>
                <ul>
                  {cat.editions.flatMap((e) =>
                    e.assessments
                      .filter((x) => x.leader.slug === a.leader.slug)
                      .map((x) => (
                        <li key={`${e.id}-${x.id}`}>
                          <Link
                            href={`/wallace-index/leaders/${x.leader.slug}?edition=${e.slug}&assessment=${x.id}${e.demonstration ? "&demo=1" : ""}`}
                          >
                            {e.title} · version {x.version}
                          </Link>
                        </li>
                      )),
                  )}
                </ul>
              </section>
            </>
          );
        })()}
      {route === "methodology" && (
        <>
          <Heading
            kicker="Methodology and limitations"
            title="How the assessment works."
          >
            <p>
              Six qualitative dimensions, scored from 0 to 3. The total ranges
              from 0 to 18 only when all six are assessed.
            </p>
          </Heading>
          <p className="wi-notice">
            {method.approved
              ? `Approved methodology ${method.version}`
              : `Proposed methodology ${method.version} — operational definitions and rubric await editorial approval.`}
          </p>
          <EditionPicker
            editions={cat.editions}
            current={edition}
            route="methodology"
          />
          <ol start={0}>
            {method.descriptors.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
          {dimensions.map((d) => (
            <section key={d} id={d} className="wi-section">
              <h2>{label(d)}</h2>
              <p>{method.rubrics[d].definition}</p>
              <h3>Observable indicators</h3>
              <ul>
                {method.rubrics[d].indicators.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p>
                <strong>Positive example:</strong> {method.rubrics[d].positive}
              </p>
              <p>
                <strong>Negative example:</strong> {method.rubrics[d].negative}
              </p>
              <p>{method.rubrics[d].guidance}</p>
            </section>
          ))}
          {[
            ["Evidence requirements", method.evidence],
            ["Ambiguous and contradictory evidence", method.ambiguity],
            ["Assessment period and historical context", method.periods],
            ["Missing information", method.missing],
            ["Reassessment and corrections", method.reassessment],
            ["Reviewer disagreement", method.disagreements],
            ["Version history and separate safeguards", method.changelog],
          ].map(([title, body]) => (
            <section className="wi-section" key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
          <p>
            Research → Evidence collection → Draft assessment → Review →
            Editorial approval → Publication → Periodic reassessment.
          </p>
        </>
      )}
      {route === "assess" && (
        <>
          <Heading
            kicker="Independent visitor tool"
            title="Make your own assessment."
          >
            <p>
              Use the six dimensions to examine an existing profile or a
              temporary custom profile. Nothing you enter changes RETHINKK’s
              official assessments.
            </p>
          </Heading>
          <EditionPicker
            editions={cat.editions}
            current={edition}
            route="assess"
          />
          <VisitorTool
            researchLeaders={
              !demo
                ? researchProfiles.map((p) => ({ id: p.id, name: p.name }))
                : []
            }
            edition={
              edition || {
                id: "unpublished",
                slug: "unpublished",
                title: "No published edition",
                publishedAt: "",
                methodology: proposedMethodology,
                assessments: [],
                releaseNotes: "",
                checksum: "",
              }
            }
          />
        </>
      )}
      {route === "sources" && (
        <>
          <Heading
            kicker="Research sources and evidence"
            title="Follow the evidence."
          >
            <p>
              Sources support specific claims and dimensions. Reputation alone
              does not establish the truth of a claim.
            </p>
          </Heading>
          <EditionPicker
            editions={cat.editions}
            current={edition}
            route="sources"
          />
          {useResearch ? (
            <ResearchSources id={path[1]} />
          ) : edition ? (
            (() => {
              const sources = [
                ...new Map(
                  edition.assessments
                    .flatMap((a) => a.sources)
                    .map((s) => [s.id, s]),
                ).values(),
              ].filter((s) => !path[1] || s.id === path[1]);
              return sources.length ? (
                sources.map((s) => (
                  <article className="wi-card wi-section" key={s.id}>
                    <p className="wi-kicker">Source {s.id}</p>
                    <h2>{s.title}</h2>
                    <dl className="wi-metadata">
                      {[
                        ["Author / issuing institution", s.author],
                        ["Publisher", s.publisher],
                        ["Original publication date", s.publishedDate],
                        ["Type", s.type],
                        ["Stable reference", s.reference],
                        ["Date accessed", s.accessedDate],
                        ["Language", s.language],
                        ["Factual summary", s.summary],
                        ["Provenance", s.provenance],
                        ["Reliability", s.reliability],
                        ["Relevance", s.relevance],
                        ["Archival reference", s.archive || "Not available"],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>
                            {k === "Stable reference" &&
                            /^https?:\/\//.test(v) ? (
                              <a href={v} rel="noreferrer">
                                {v}
                              </a>
                            ) : (
                              v
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <h3>Supported and contextualised claims</h3>
                    <ul>
                      {edition.assessments.flatMap((a) =>
                        a.evidence
                          .filter((e) => e.sourceId === s.id)
                          .map((e, i) => (
                            <li key={`${a.id}-${i}`}>
                              <Link
                                href={`/wallace-index/leaders/${a.leader.slug}?edition=${edition.slug}${demo ? "&demo=1" : ""}#${e.dimension}`}
                              >
                                {a.leader.name} · {label(e.dimension)}
                              </Link>
                              <p>
                                {label(e.relation)}: {e.claim}
                              </p>
                              <p>{e.context}</p>
                            </li>
                          )),
                      )}
                    </ul>
                  </article>
                ))
              ) : (
                <p>No source matches this reference.</p>
              );
            })()
          ) : (
            empty
          )}
        </>
      )}
      {route === "editions" && (
        <>
          <Heading
            kicker="Published research archive"
            title="A record that remains."
          >
            <p>
              Each published edition freezes its methodology, assessments,
              rationales and evidence references. Corrections create a new
              version.
            </p>
          </Heading>
          {cat.editions.length
            ? cat.editions
                .filter((e) => !path[1] || e.slug === path[1])
                .map((e) => (
                  <article key={e.id} className="wi-card">
                    <h2>{e.title}</h2>
                    <p>
                      {e.publishedAt.slice(0, 10)} · Methodology{" "}
                      {e.methodology.version}
                    </p>
                    <p>{e.releaseNotes}</p>
                    <p>{e.assessments.length} assessments</p>
                    <p className="wi-checksum">
                      Snapshot checksum: {e.checksum}
                    </p>
                    <div className="wi-actions">
                      <Link
                        href={`/wallace-index/explore?edition=${e.slug}${e.demonstration ? "&demo=1" : ""}`}
                      >
                        Explore this edition →
                      </Link>
                      <a
                        href={`/api/wallace-index/export?edition=${e.slug}${e.demonstration ? "&demo=1" : ""}`}
                      >
                        Download JSON
                      </a>
                      <a
                        href={`/api/wallace-index/export?edition=${e.slug}&format=csv${e.demonstration ? "&demo=1" : ""}`}
                      >
                        Download research CSV
                      </a>
                    </div>
                  </article>
                ))
            : empty}
        </>
      )}
      {route === "about" && (
        <>
          <Heading
            kicker="Background, limitations and development"
            title="A framework for scrutiny."
          >
            <p>
              The Wallace Index is inspired by the leadership philosophy
              associated with former UK Defence Secretary Ben Wallace.
            </p>
          </Heading>
          <section className="wi-section">
            <h2>Independent research</h2>
            <p>
              No endorsement, authorisation or participation by Ben Wallace is
              claimed. The framework examines observable conduct on moral and
              institutional grounds; it does not measure ideology, popularity,
              electoral success or political affiliation.
            </p>
            <h2>Limits of interpretation</h2>
            <p>
              This is a research-informed qualitative framework, not a
              peer-reviewed or academically validated instrument. Scores are
              contextual editorial judgements. They are neither objective facts,
              algorithmic predictions nor definitive judgements of character.
            </p>
            <p>
              Two assessments may differ because of their period, evidence,
              office, context or interpretation. Read the rationale,
              contradictory evidence and methodology before comparing totals.
            </p>
            <h2>Editorial governance</h2>
            <p>
              Researchers collect evidence and prepare drafts. Assigned
              independent reviewers evaluate the rationale and can request
              changes. A separate publisher approves publication. Published
              records are preserved; corrections require documented new
              versions.
            </p>
          </section>
          <section className="wi-section" id="corrections">
            <h2>Corrections, criticism and contributions</h2>
            <p>
              Contributions enter editorial review and never appear
              automatically. Please identify the relevant page, claim or source
              and explain the evidence for your correction.
            </p>
            {process.env.WALLACE_CONTRIBUTIONS_ENABLED === "true" &&
            process.env.WALLACE_PRIVACY_NOTICE ? (
              <ContributionForm notice={process.env.WALLACE_PRIVACY_NOTICE} />
            ) : (
              <p>
                The contribution form is not yet open. The editorial team must
                configure its reviewed privacy notice and review queue before
                submissions can be collected.
              </p>
            )}
          </section>
        </>
      )}
      {route === "notes" &&
        (() => {
          const note = notes.find((n) => n.slug === path[1]);
          if (!note) notFound();
          return (
            <article>
              <Heading
                kicker={`Research note / Version ${note.version}`}
                title={note.title}
              />
              <p>{note.publishedAt?.toISOString().slice(0, 10)}</p>
              {note.body.split(/\n\n+/).map((p, i) => (
                <p key={i} style={{ whiteSpace: "pre-wrap" }}>
                  {p}
                </p>
              ))}
            </article>
          );
        })()}
    </>
  );
}
