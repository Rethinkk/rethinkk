import type { ReactNode } from "react";

const annualAsylum = [
  { year: 2019, value: 628900 },
  { year: 2020, value: 415200 },
  { year: 2021, value: 536000 },
  { year: 2022, value: 873700 },
  { year: 2023, value: 1049500, highlight: "Recent peak" },
  { year: 2024, value: 912000 },
  { year: 2025, value: 669400, highlight: "Latest complete year" }
];

const definitionCards = [
  { value: "669,400", label: "First-time asylum applications", context: "EU · 2025" },
  { value: "180,211", label: "Detected irregular external-border crossings", context: "EU · 2025" },
  { value: "≈4.5 million", label: "Beneficiaries of temporary protection from Ukraine", context: "EU+ · end 2025" }
];

const nationalityData = [
  { nationality: "Syria", value2024: 148000, value2025: 40000 },
  { nationality: "Venezuela", value2024: 72800, value2025: 89500 },
  { nationality: "Afghanistan", value2024: 72200, value2025: 63800 }
];

const distributionData = [
  { country: "Spain", value: 141000 },
  { country: "Italy", value: 126600 },
  { country: "France", value: 116400 },
  { country: "Germany", value: 113200 }
];

const articleSources = [
  {
    organisation: "Eurostat",
    title: "Annual asylum statistics / first-time asylum applicants - migr_asyappctza",
    url: "https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/5777.pdf"
  },
  {
    organisation: "Eurostat",
    title: "First-time asylum applications - May 2026",
    url: "https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20260814-2"
  },
  {
    organisation: "Eurostat",
    title: "Asylum applicant nationality data",
    url: "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20250320-1"
  },
  {
    organisation: "European Migration Network / European Commission",
    title: "Asylum and Migration Overview 2025",
    url: "https://home-affairs.ec.europa.eu/news/new-emn-asylum-and-migration-overview-explores-main-asylum-and-migration-developments-2025-2026-07-20_en"
  },
  {
    organisation: "European Union Agency for Asylum",
    title: "Latest Asylum Trends - Annual Analysis",
    url: "https://www.euaa.europa.eu/latest-asylum-trends-annual-analysis/introduction"
  }
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function MigrationDataArticle() {
  return (
    <div className="data-article">
      <section className="data-opening">
        <p>The word migration is routinely used for several different phenomena.</p>
        <p>Asylum applications, irregular border crossings, temporary protection and total migration are not the same measure.</p>
        <p>Separate them, and a more precise picture of migration pressure in Europe emerges.</p>
      </section>

      <DataSection label="The trend" title="First-time asylum applications to the EU" subheading="2019-2025">
        <AsylumLineChart />
        <StatCallout value="2023 → 2025" label="-36%" />
        <p>First-time asylum applications rose sharply after the pandemic and reached a recent peak of approximately 1.05 million in 2023.</p>
        <p>The direction subsequently changed.</p>
        <p>Applications fell by approximately 13% in 2024 and by a further 27% in 2025. By 2025, first-time applications were approximately 36% below their 2023 peak.</p>
        <SourceNote>Source: Eurostat, first-time asylum applicants, EU. RETHINKK calculation.</SourceNote>
      </DataSection>

      <DataSection label="The latest signal" title="First-time asylum applications" subheading="May 2026 vs May 2025">
        <div className="latest-signal">
          <strong>-22%</strong>
          <div>
            <div className="metric-row"><span>May 2025</span><span>54,765</span></div>
            <div className="metric-row"><span>May 2026</span><span>42,525</span></div>
          </div>
        </div>
        <p>The decline did not end with the 2025 annual figures.</p>
        <p>In May 2026, 42,525 first-time asylum applicants applied for international protection in the EU, compared with 54,765 in May 2025.</p>
        <p>That represents a year-on-year decline of 22%. The available monthly figures for early 2026 continue to show lower first-time asylum applications than the corresponding months of 2025.</p>
        <SourceNote>Source: Eurostat, May 2026 first-time asylum applications. RETHINKK calculation.</SourceNote>
      </DataSection>

      <DataSection label="Definition matters" title="Asylum is not migration">
        <p>An asylum application is not an irregular border crossing.</p>
        <p>An irregular border crossing is not net migration. Temporary protection is another category again.</p>
        <p>Using "migration" for all of them creates numbers that sound comparable but are not.</p>
        <div className="stat-card-grid">
          {definitionCards.map((card) => (
            <article className="stat-card" key={card.label}>
              <strong>{card.value}</strong>
              <span>{card.label}</span>
              <em>{card.context}</em>
            </article>
          ))}
        </div>
        <p>The first two indicators declined during 2025. Detected irregular crossings at the EU's external borders fell by approximately 25% compared with 2024.</p>
        <p>At the same time, approximately 4.5 million people displaced from Ukraine remained under temporary protection across the EU+ area at the end of 2025.</p>
        <MajorCallout>Asylum pressure can fall while the number of displaced people living in Europe remains historically high.</MajorCallout>
        <SourceNote>Sources: Eurostat; European Migration Network / European Commission.</SourceNote>
      </DataSection>

      <DataSection label="The composition" title="The people applying changed too">
        <NationalityComparison />
        <MajorCallout>Syria<br />148,000 → 40,000</MajorCallout>
        <p>The decline in asylum applications was not evenly distributed across nationalities.</p>
        <p>Syrian first-time asylum applications fell from approximately 148,000 in 2024 to approximately 40,000 in 2025.</p>
        <p>For the first time since 2014, Syrians were no longer the largest group of first-time asylum applicants in the EU.</p>
        <p>At the same time, Venezuelan applications increased and became the largest nationality group in 2025.</p>
        <p>This means the European asylum picture did not simply become smaller. Its composition changed.</p>
        <SourceNote>Source: Eurostat, asylum applicant nationality data.</SourceNote>
      </DataSection>

      <DataSection label="Geography" title="The pressure is not evenly distributed">
        <DistributionBars />
        <StatCallout value="≈74%" label="Spain, Italy, France and Germany" />
        <p>Spain, Italy, France and Germany together received approximately 74% of all first-time asylum applications registered in the EU in 2025.</p>
        <p>A European decline therefore does not mean that every member state experiences the same pressure.</p>
        <p>National political perceptions can differ substantially from the aggregate European trend because asylum applications remain geographically concentrated.</p>
        <SourceNote>Source: Eurostat, first-time asylum applications by receiving country. RETHINKK calculation.</SourceNote>
      </DataSection>

      <DataSection label="RETHINKK assessment" title="What the data says">
        <div className="assessment-statements">
          <article>
            <h3>The evidence does not support the idea of a continuously accelerating asylum influx into Europe.</h3>
            <p>First-time asylum applications reached a recent peak in 2023 and subsequently fell in both 2024 and 2025.</p>
            <p>Available monthly data for 2026 continue to point in the same direction. Detected irregular external-border crossings also declined substantially during 2025.</p>
          </article>
          <article>
            <h3>But that does not mean migration pressure has disappeared.</h3>
            <p>Millions of people displaced from Ukraine remain under temporary protection.</p>
            <p>Asylum pressure is concentrated in particular member states. Routes and nationalities change. And asylum statistics measure only one component of migration.</p>
          </article>
        </div>
      </DataSection>

      <section className="data-conclusion">
        <h2>The numbers are falling.<br />The subject is not disappearing.</h2>
        <p>Migration debates become less precise when different statistical categories are treated as if they describe the same phenomenon.</p>
        <p>The available evidence shows a clear recent decline in first-time asylum applications and detected irregular border crossings.</p>
        <p>It also shows why those figures cannot, by themselves, describe the full migration situation in Europe.</p>
        <p>That distinction is the finding.</p>
      </section>

      <DataSection label="Methodology" title="About the data" compact>
        <p>RETHINKK distinguishes between asylum applications, detected irregular border crossings, temporary protection and broader migration statistics.</p>
        <p>These indicators measure different populations and events and should not be added together or treated as interchangeable.</p>
        <p>"Asylum applications" in the principal time series refers to first-time asylum applicants in EU member states.</p>
        <p>"Detected irregular border crossings" refers to detections at the EU's external borders and should not be interpreted as a count of unique migrants.</p>
        <p>Temporary-protection figures principally reflect people displaced from Ukraine and represent a stock of beneficiaries rather than an annual migration flow.</p>
        <p>2026 annual asylum data are incomplete at the publication date. RETHINKK therefore uses completed 2019-2025 annual data and separately presents the available 2026 monthly signal.</p>
        <p>All calculations derived from source data are marked as RETHINKK calculations.</p>
      </DataSection>

      <section className="data-sources">
        <h2>Sources</h2>
        <ol>
          {articleSources.map((source) => (
            <li key={source.url}>
              <strong>{source.organisation}</strong>
              <span>{source.title}</span>
              <a href={source.url}>{source.url}</a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function DataSection({ label, title, subheading, compact, children }: { label: string; title: string; subheading?: string; compact?: boolean; children: ReactNode }) {
  return (
    <section className={`data-section ${compact ? "compact" : ""}`}>
      <div className="kicker yellow">{label}</div>
      <h2>{title}</h2>
      {subheading && <p className="data-subheading">{subheading}</p>}
      <div className="data-section-content">{children}</div>
    </section>
  );
}

function AsylumLineChart() {
  const width = 760;
  const height = 330;
  const pad = 54;
  const values = annualAsylum.map((point) => point.value);
  const max = Math.max(...values);
  const min = 350000;
  const x = (index: number) => pad + index * ((width - pad * 2) / (annualAsylum.length - 1));
  const y = (value: number) => height - pad - ((value - min) / (max - min)) * (height - pad * 2);
  const points = annualAsylum.map((point, index) => `${x(index)},${y(point.value)}`).join(" ");

  return (
    <figure className="research-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Line chart of first-time asylum applications to the EU from 2019 to 2025">
        <line className="chart-axis" x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} />
        <line className="chart-axis" x1={pad} y1={pad} x2={pad} y2={height - pad} />
        {[500000, 750000, 1000000].map((tick) => (
          <g key={tick}>
            <line className="chart-grid-line" x1={pad} x2={width - pad} y1={y(tick)} y2={y(tick)} />
            <text className="chart-tick" x="12" y={y(tick) + 4}>{formatNumber(tick)}</text>
          </g>
        ))}
        <polyline className="chart-line" points={points} />
        {annualAsylum.map((point, index) => (
          <g className={point.highlight ? "chart-point highlighted" : "chart-point"} key={point.year}>
            <circle cx={x(index)} cy={y(point.value)} r={point.highlight ? 6 : 4} />
            <text x={x(index)} y={height - 20}>{point.year}</text>
            {point.highlight && <text className="chart-annotation" x={x(index) - 44} y={y(point.value) - 14}>{point.highlight}</text>}
          </g>
        ))}
      </svg>
      <figcaption>First-time asylum applicants · EU · annual completed data.</figcaption>
    </figure>
  );
}

function NationalityComparison() {
  const width = 760;
  const rowHeight = 64;
  const padLeft = 116;
  const max = 148000;
  const scale = (value: number) => (value / max) * 500;

  return (
    <figure className="research-chart bar-comparison">
      <svg viewBox={`0 0 ${width} 240`} role="img" aria-label="Comparison of leading asylum applicant nationalities in 2024 and 2025">
        <text className="chart-tick" x={padLeft} y="26">2024</text>
        <text className="chart-tick yellow-text" x={padLeft + 250} y="26">2025</text>
        {nationalityData.map((item, index) => {
          const y = 54 + index * rowHeight;
          return (
            <g key={item.nationality}>
              <text className="bar-label" x="10" y={y + 17}>{item.nationality}</text>
              <rect className="bar-previous" x={padLeft} y={y} width={scale(item.value2024)} height="16" />
              <rect className="bar-current" x={padLeft} y={y + 24} width={scale(item.value2025)} height="16" />
              <text className="bar-value" x={padLeft + scale(item.value2024) + 8} y={y + 13}>{formatNumber(item.value2024)}</text>
              <text className="bar-value yellow-text" x={padLeft + scale(item.value2025) + 8} y={y + 37}>{formatNumber(item.value2025)}</text>
            </g>
          );
        })}
      </svg>
      <figcaption>Leading nationalities · first-time asylum applicants · EU.</figcaption>
    </figure>
  );
}

function DistributionBars() {
  const max = Math.max(...distributionData.map((item) => item.value));
  return (
    <figure className="distribution-bars" aria-label="First-time asylum applications by receiving country in 2025">
      {distributionData.map((item) => (
        <div className="distribution-row" key={item.country}>
          <span>{item.country}</span>
          <div><i style={{ width: `${(item.value / max) * 100}%` }} /></div>
          <strong>{formatNumber(item.value)}</strong>
        </div>
      ))}
      <figcaption>First-time asylum applications · EU member states · 2025.</figcaption>
    </figure>
  );
}

function StatCallout({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-callout">
      <span>{value}</span>
      <strong>{label}</strong>
    </div>
  );
}

function MajorCallout({ children }: { children: ReactNode }) {
  return <p className="major-data-callout">{children}</p>;
}

function SourceNote({ children }: { children: ReactNode }) {
  return <p className="source-note">{children}</p>;
}
