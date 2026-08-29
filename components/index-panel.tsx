import { Publication } from "@/lib/content";

export function IndexPanel({ index }: { index: Publication }) {
  const counts = (index.countries || []).reduce<Record<string, number>>((all, country) => {
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
      {(index.countries || []).slice(0, 4).map((country) => (
        <div key={country.isoCode}>
          <div className="metric-row">
            <span>{country.country}</span>
            <span className="muted">{country.institutionalScore} / {country.direction}</span>
          </div>
          <div className="bar"><span style={{ width: `${country.institutionalScore}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
