import Link from "next/link";
import {
  CountryAssessment,
  DemocracyDirectionEdition,
  getDirectionSymbol,
  getMovementLabel,
  getStatusDesignToken,
  getStatusLabel,
  groupCountriesByDirection
} from "@/lib/democracy-index";

export function DemocracyIndexHero({ edition }: { edition: DemocracyDirectionEdition }) {
  return (
    <section className="ddi-hero">
      <div>
        <div className="kicker yellow">RETHINKK Index</div>
        <h1 className="ddi-title">Democracy<br />Direction<br /><span className="yellow">Index {edition.year}</span></h1>
      </div>
      <div className="ddi-hero-copy">
        <p className="lede">Democracy is not a status. <span className="yellow">It is a direction.</span></p>
        <p className="copy">{edition.introduction}</p>
        <p className="development-label">{edition.developmentLabel}</p>
      </div>
    </section>
  );
}

export function StatusDirectionVelocity() {
  return (
    <div className="ddi-concepts" aria-label="Status direction and velocity definitions">
      <Concept title="Status" text="Where democratic institutions are today." />
      <Concept title="Direction" text="Whether institutions are improving, stable or deteriorating." />
      <Concept title="Velocity" text="How quickly institutional movement is happening." />
    </div>
  );
}

function Concept({ title, text }: { title: string; text: string }) {
  return (
    <article className="concept-block">
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}

export function EditionSelector({ editions, currentYear }: { editions: DemocracyDirectionEdition[]; currentYear: number }) {
  return (
    <div className="edition-selector" aria-label="Edition selector">
      {editions.map((edition) => (
        <Link aria-current={edition.year === currentYear ? "page" : undefined} href={`/index/democracy-direction/${edition.year}`} key={edition.id}>
          {edition.year}
        </Link>
      ))}
    </div>
  );
}

export function MapLegend() {
  return (
    <div className="legend-grid">
      <div>
        <div className="kicker muted">Status</div>
        <LegendItem token="status-resilient" label="Resilient democracy" />
        <LegendItem token="status-erosion" label="Institutional erosion" />
        <LegendItem token="status-autocratic" label="Autocratic" />
        <LegendItem token="status-not-assessed" label="Not assessed - grey only means outside this edition" />
      </div>
      <div>
        <div className="kicker muted">Direction</div>
        <p className="legend-line">↑ Improving</p>
        <p className="legend-line">→ Stable</p>
        <p className="legend-line">↓ Deteriorating</p>
      </div>
    </div>
  );
}

function LegendItem({ token, label }: { token: string; label: string }) {
  return (
    <p className="legend-line"><span className={`legend-swatch ${token}`} aria-hidden="true" />{label}</p>
  );
}

export function WorldStatusMap({ assessments, selected }: { assessments: CountryAssessment[]; selected?: string }) {
  const current = assessments.find((country) => country.slug === selected) || assessments[0];
  return (
    <div className="map-layout">
      <div className="world-map" role="img" aria-label="Interactive world view of assessed Democracy Direction Index countries">
        <div className="map-frame" aria-hidden="true">
          <span className="continent americas" />
          <span className="continent europe" />
          <span className="continent africa" />
          <span className="continent asia" />
          <span className="continent oceania" />
        </div>
        {assessments.map((country) => (
          <Link
            className={`country-marker ${getStatusDesignToken(country.status)} ${country.slug === current.slug ? "selected" : ""}`}
            href={`/index/democracy-direction/${country.year}/${country.slug}`}
            key={country.id}
            style={{ left: `${((country.longitude + 180) / 360) * 100}%`, top: `${((90 - country.latitude) / 180) * 100}%` }}
            title={`${country.countryName}: ${getStatusLabel(country.status)}, ${getMovementLabel(country.direction, country.velocity)}`}
          >
            <span>{country.iso2}</span>
          </Link>
        ))}
      </div>
      <CountryMapPanel country={current} />
    </div>
  );
}

function CountryMapPanel({ country }: { country: CountryAssessment }) {
  return (
    <aside className="map-panel">
      <div className="kicker muted">{country.iso3} / {country.year}</div>
      <h2>{country.countryName}</h2>
      <p className="status-label">{getStatusLabel(country.status)}</p>
      <p className="movement-signal"><span>{getDirectionSymbol(country.direction, country.velocity)}</span> {getMovementLabel(country.direction, country.velocity)}</p>
      <div className="metric-row">
        <span>Institutional score</span>
        <strong>{country.overallInstitutionalScore} / 25</strong>
      </div>
      <p className="copy">{country.shortRationale}</p>
      <Link className="text-link" href={`/index/democracy-direction/${country.year}/${country.slug}`}>View country -&gt;</Link>
    </aside>
  );
}

export function CountrySearch({ assessments }: { assessments: CountryAssessment[] }) {
  return (
    <div className="country-search">
      <label className="kicker muted" htmlFor="country-search">Country search</label>
      <input id="country-search" list="country-options" placeholder="Search by country or ISO code" />
      <datalist id="country-options">
        {assessments.map((country) => <option key={country.id} value={`${country.countryName} / ${country.iso3}`} />)}
      </datalist>
      <div className="search-links">
        {assessments.map((country) => (
          <Link key={country.id} href={`/index/democracy-direction/${country.year}/${country.slug}`}>{country.countryName}</Link>
        ))}
      </div>
    </div>
  );
}

export function MovementBoard({ assessments }: { assessments: CountryAssessment[] }) {
  const grouped = groupCountriesByDirection(assessments);
  return (
    <div className="movement-board">
      <MovementColumn title="Improving" symbol="↑" countries={grouped.improving} />
      <MovementColumn title="Stable" symbol="→" countries={grouped.stable} />
      <MovementColumn title="Deteriorating" symbol="↓" countries={grouped.deteriorating} />
    </div>
  );
}

function MovementColumn({ title, symbol, countries }: { title: string; symbol: string; countries: CountryAssessment[] }) {
  return (
    <article className="movement-column">
      <h3>{title} <span>{symbol}</span></h3>
      {countries.map((country) => (
        <Link className="movement-row" href={`/index/democracy-direction/${country.year}/${country.slug}`} key={country.id}>
          <span>{country.countryName}</span>
          <strong>{getDirectionSymbol(country.direction, country.velocity)}</strong>
        </Link>
      ))}
    </article>
  );
}

export function TrajectoryChart({ assessments }: { assessments: CountryAssessment[] }) {
  return (
    <div className="trajectory-chart" aria-label="Institutional strength by movement">
      <div className="axis-label y-axis">Institutional strength</div>
      <div className="axis-label x-axis">Direction / institutional movement</div>
      <span className="quadrant q1">Strong + improving</span>
      <span className="quadrant q2">Strong + deteriorating</span>
      <span className="quadrant q3">Weak + improving</span>
      <span className="quadrant q4">Weak + deteriorating</span>
      {assessments.map((country) => {
        const score = country.overallInstitutionalScore || 0;
        const directionX = country.direction === "improving" ? 24 : country.direction === "stable" ? 50 : 76;
        const y = 86 - (score / 25) * 72;
        return (
          <Link
            className={`trajectory-point ${getStatusDesignToken(country.status)}`}
            href={`/index/democracy-direction/${country.year}/${country.slug}`}
            key={country.id}
            style={{ left: `${directionX}%`, top: `${y}%` }}
            title={`${country.countryName}: ${score}/25`}
          >
            {country.iso2}
          </Link>
        );
      })}
    </div>
  );
}

export function CountryAssessmentHeader({ country }: { country: CountryAssessment }) {
  return (
    <header className="country-assessment-header">
      <div>
        <div className="kicker yellow">{country.iso3} / {country.year}</div>
        <h1 className="article-title">{country.countryName}</h1>
      </div>
      <div className="country-signal">
        <p>{getStatusLabel(country.status)}</p>
        <strong>{getDirectionSymbol(country.direction, country.velocity)}</strong>
        <span>{getMovementLabel(country.direction, country.velocity)}</span>
      </div>
    </header>
  );
}

export function InstitutionScore({ country }: { country: CountryAssessment }) {
  return (
    <div className="score-panel">
      <div className="score-number">{country.overallInstitutionalScore}<span>/25</span></div>
      <div>
        <div className="kicker muted">Institutional score</div>
        <p className="copy">The score supports the assessment. It does not compute the status on its own.</p>
      </div>
    </div>
  );
}

export function InstitutionDimensions({ country }: { country: CountryAssessment }) {
  const dimensions = [
    ["Judicial independence", country.judicialIndependence],
    ["Media freedom", country.mediaFreedom],
    ["Electoral integrity", country.electoralIntegrity],
    ["Civic space & human rights", country.civicSpace],
    ["Checks & balances", country.checksAndBalances]
  ] as const;
  return (
    <div className="dimension-list">
      {dimensions.map(([label, value]) => <InstitutionDimension key={label} label={label} value={value} />)}
    </div>
  );
}

function InstitutionDimension({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="dimension-row">
      <span>{label}</span>
      <span className="blocks" aria-label={`${value || 0} out of 5`}>
        {[1, 2, 3, 4, 5].map((step) => <i className={value && step <= value ? "filled" : ""} key={step} />)}
      </span>
      <strong>{value ?? "not assessed"} / 5</strong>
    </div>
  );
}

export function AssessmentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="assessment-section">
      <h2>{title}</h2>
      <div className="copy">{children}</div>
    </section>
  );
}

export function EvidenceList({ country }: { country: CountryAssessment }) {
  return (
    <ul className="evidence-list">
      {country.sources.map((source) => (
        <li key={source.id}>
          <span>{source.organisation}</span>
          <strong>{source.title}</strong>
          <em>{source.publicationDate || "Accessed"} / {source.accessedAt}</em>
          <Link href={source.url}>Source -&gt;</Link>
        </li>
      ))}
    </ul>
  );
}

export function ConfidenceIndicator({ country }: { country: CountryAssessment }) {
  return (
    <p className="confidence-indicator">Confidence: <strong>{country.confidence}</strong>. Confidence reflects evidence quality and assessment certainty, not democratic quality.</p>
  );
}

export function CountryHistory({ country }: { country: CountryAssessment }) {
  return (
    <div className="history-strip">
      <span>{country.year}</span>
      <strong>{country.status}</strong>
      <em>{getDirectionSymbol(country.direction, country.velocity)}</em>
      <small>{getMovementLabel(country.direction, country.velocity)}</small>
    </div>
  );
}

export function EditionArchive({ editions }: { editions: DemocracyDirectionEdition[] }) {
  const sorted = [...editions].sort((a, b) => b.year - a.year);
  const [current, ...past] = sorted;
  return (
    <div className="edition-archive">
      {current && (
        <Link className="archive-feature" href={`/index/democracy-direction/${current.year}`}>
          <span className="kicker yellow">Current edition</span>
          <strong>{current.year}</strong>
          <span>{current.subtitle}</span>
        </Link>
      )}
      <div>
        <div className="kicker muted">Past editions</div>
        {past.length === 0 ? <p className="copy">Past editions will remain accessible here and never overwrite the published record.</p> : past.map((edition) => <Link key={edition.id} href={`/index/democracy-direction/${edition.year}`}>{edition.year}</Link>)}
      </div>
    </div>
  );
}
