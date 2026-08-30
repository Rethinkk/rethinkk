import { CountryAssessment } from "@/lib/democracy-index";

export function IndexPanel({ assessments }: { assessments: CountryAssessment[] }) {
  const counts = assessments.reduce<Record<string, number>>((all, country) => {
    all[country.direction] = (all[country.direction] || 0) + 1;
    return all;
  }, {});

  return (
    <div className="panel index-panel">
      <div>
        <div className="kicker muted">Status / direction / velocity</div>
        <div className="status-grid">
          <div className="status-cell"><span className="status-symbol">↓</span><div className="kicker muted">Deteriorating {counts.deteriorating || 0}</div></div>
          <div className="status-cell"><span className="status-symbol yellow">↑</span><div className="kicker muted">Improving {counts.improving || 0}</div></div>
          <div className="status-cell"><span className="status-symbol">→</span><div className="kicker muted">Stable {counts.stable || 0}</div></div>
        </div>
      </div>
      {assessments.slice(0, 4).map((country) => (
        <div key={country.iso3}>
          <div className="metric-row">
            <span>{country.countryName}</span>
            <span className="muted">{country.overallInstitutionalScore}/25 / {country.direction}</span>
          </div>
          <div className="bar"><span style={{ width: `${((country.overallInstitutionalScore || 0) / 25) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
