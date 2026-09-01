import type { ReactNode } from "react";

const compositionData = [
  { group: "Bottom 50%", deposits: 25, housing: 63, ownership: 12 },
  { group: "Middle 40%", deposits: 15, housing: 72, ownership: 13 },
  { group: "Top 10%", deposits: 10, housing: 50, ownership: 40 }
];

const liquidityRows = [
  { label: "Net wealth", a: "EUR 20m", b: "EUR 20m" },
  { label: "Cash", a: "EUR 20m", b: "EUR 0.5m" },
  { label: "Private company", a: "-", b: "EUR 19.5m" },
  { label: "1% wealth tax", a: "EUR 200k", b: "EUR 200k" }
];

const burdenData = [
  { returnRate: "10%", burden: "10%", width: 10 },
  { returnRate: "5%", burden: "20%", width: 20 },
  { returnRate: "2%", burden: "50%", width: 50 },
  { returnRate: "1%", burden: "100%", width: 100 },
  { returnRate: "0%", burden: "Tax remains payable", width: 100 }
];

const norwayMigration = [
  { year: "2021", emigrants: 16, immigrants: 14 },
  { year: "2022", emigrants: 46, immigrants: 10 },
  { year: "2023", emigrants: 46, immigrants: 8 },
  { year: "2024", emigrants: 16, immigrants: 5 },
  { year: "2025", emigrants: 17, immigrants: 9 }
];

const taxInstruments = [
  { instrument: "Capital income tax", event: "Income received", advantage: "Cash and taxation generally coincide", problem: "Retention / deferral" },
  { instrument: "Capital gains tax", event: "Asset sold", advantage: "Valuation and liquidity", problem: "Lock-in" },
  { instrument: "Accrual taxation", event: "Value increases", advantage: "Reduces deferral", problem: "Valuation / liquidity" },
  { instrument: "Net wealth tax", event: "Continued ownership", advantage: "Does not depend on realisation", problem: "Valuation / liquidity" },
  { instrument: "Inheritance tax", event: "Wealth transferred", advantage: "Targets intergenerational transfer", problem: "Late taxation / valuation / liquidity / avoidance" },
  { instrument: "Deemed return tax", event: "Assumed return", advantage: "Administrative simplicity", problem: "Assumption risk" }
];

const behaviourChain = [
  "Tax changes",
  "Portfolio structure changes",
  "Tax planning changes",
  "Reported taxable wealth changes",
  "Some taxpayers relocate",
  "Some capital / investment decisions change",
  "Government revenue changes"
];

const articleSources = [
  {
    organisation: "European Central Bank",
    title: "Distributional Wealth Accounts",
    url: "https://data.ecb.europa.eu/data/data-categories/macroeconomic-and-sectoral-statistics/sector-accounts/distributional-wealth-accounts"
  },
  {
    organisation: "European Central Bank",
    title: "Economic Bulletin research using Distributional Wealth Accounts",
    url: "https://www.ecb.europa.eu/press/economic-bulletin/articles/2024/html/ecb.ebart202405_02~50a620f16b.en.html"
  },
  {
    organisation: "International Monetary Fund",
    title: "How to Tax Wealth, 2024",
    url: "https://www.elibrary.imf.org/view/journals/061/2024/001/article-A001-en.xml"
  },
  {
    organisation: "OECD",
    title: "The Role and Design of Net Wealth Taxes in the OECD, 2018",
    url: "https://www.oecd.org/tax/the-role-and-design-of-net-wealth-taxes-in-the-oecd-9789264290303-en.htm"
  },
  {
    organisation: "OECD",
    title: "Taxation of Household Savings, 2018",
    url: "https://www.oecd.org/tax/taxation-of-household-savings-9789264289536-en.htm"
  },
  {
    organisation: "OECD",
    title: "Inheritance Taxation in OECD Countries, 2021",
    url: "https://www.oecd.org/tax/tax-policy/inheritance-taxation-in-oecd-countries-e2879a7d-en.htm"
  },
  {
    organisation: "European Commission",
    title: "Wealth taxation, including net wealth, capital and exit taxes, 2026",
    url: "https://taxation-customs.ec.europa.eu/news/publication-study-wealth-taxation-including-net-wealth-capital-and-exit-taxes-2026-04-15_en"
  },
  {
    organisation: "HM Revenue & Customs",
    title: "Evaluation of the change to UK deemed domicile policy, 2017",
    url: "https://www.gov.uk/government/publications/evaluation-of-the-2017-change-to-uk-deemed-domicile-policy/evaluation-of-the-change-to-uk-deemed-domicile-policy-2017"
  },
  {
    organisation: "Agenzia delle Entrate",
    title: "New-resident substitute tax information, 2026",
    url: "https://www1.agenziaentrate.gov.it/servizi/scadenzario/main.php?chi=1883&come=528&cosa=11526&entroil=30-06-2026&op=4"
  },
  {
    organisation: "Norwegian Government",
    title: "Official data on high-wealth migration",
    url: "https://www.regjeringen.no/no/dokumenter/nou-2026-9/id3167167/?ch=4"
  },
  {
    organisation: "American Economic Journal: Economic Policy",
    title: "Behavioral Responses to Wealth Taxes: Evidence from Switzerland",
    url: "https://doi.org/10.1257/pol.20200258"
  }
];

export function WealthTaxDataArticle() {
  return (
    <div className="data-article wealth-article">
      <section className="data-opening">
        <p>The political debate is usually about how much wealthy people should pay.</p>
        <p>Tax design begins one question earlier: what exactly are we taxing?</p>
        <p>Wealth, income, liquidity, capital gains and taxable events are not the same thing. Treat them as interchangeable and the debate becomes louder than the design problem.</p>
      </section>

      <DataSection label="Language" title="Wealth is not money">
        <div className="wealth-person-grid">
          <article>
            <span>Person A</span>
            <strong>EUR 20m</strong>
            <p>Net wealth, all held as cash.</p>
          </article>
          <article>
            <span>Person B</span>
            <strong>EUR 20m</strong>
            <p>EUR 500k cash and EUR 19.5m private-company ownership.</p>
          </article>
        </div>
        <p>Both people have the same net wealth. They do not have the same liquidity.</p>
        <p>Cash, income, realised capital gains, unrealised capital gains and net wealth describe different economic facts. A serious tax debate has to keep those categories separate.</p>
        <MajorCallout>Wealth is not money. But illiquid wealth is still wealth.</MajorCallout>
      </DataSection>

      <DataSection label="ECB" title="Wealth changes as wealth increases">
        <CompositionChart />
        <p>ECB Distributional Wealth Accounts show that the composition of household wealth changes substantially across the wealth distribution.</p>
        <p>For the bottom half of euro-area households, deposits and housing carry relatively greater importance. In the middle of the distribution, housing remains dominant. At the top, ownership claims become more important: equities, investment funds, bonds and business wealth occupy a larger part of the balance sheet.</p>
        <SourceNote>Source: European Central Bank, Distributional Wealth Accounts and ECB Economic Bulletin research. Unit: share of household wealth group balance sheet. RETHINKK grouping based on ECB-reported categories.</SourceNote>
      </DataSection>

      <DataSection label="Liquidity" title="Same wealth. Different liquidity.">
        <div className="wealth-table" role="table" aria-label="Comparison of two people with the same net wealth and different liquidity">
          <div className="wealth-table-head" role="row">
            <span />
            <strong>A</strong>
            <strong>B</strong>
          </div>
          {liquidityRows.map((row) => (
            <div className="wealth-table-row" role="row" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.a}</strong>
              <strong>{row.b}</strong>
            </div>
          ))}
        </div>
        <p>Person A can pay the tax from cash. Person B may need other income, a dividend, borrowing or a partial sale of an asset.</p>
        <p>That is not an argument that illiquid wealth cannot be taxed. It is the reason tax design cannot stop at the headline number.</p>
        <MajorCallout>Same wealth is not the same liquidity.</MajorCallout>
      </DataSection>

      <DataSection label="ECB" title="Who owns what?">
        <OwnershipChart />
        <p>Different asset classes are distributed differently. ECB research indicates that around 80% of euro-area equities, investment fund shares and bond holdings are held by the wealthiest 10% of households. Business wealth is also highly concentrated, while deposits are more broadly distributed.</p>
        <p>The composition of EUR 100 million matters as much as the number EUR 100 million when designing its taxation.</p>
        <SourceNote>Source: European Central Bank. Unit: share of instrument outstanding amounts held by net wealth group. Observed data / ECB calculations.</SourceNote>
      </DataSection>

      <DataSection label="Taxable event" title="When should value become taxable?">
        <div className="tax-event-grid">
          <EventCard title="When capital produces income" examples="Interest, dividends, rent, distributions" advantage="Observable; liquidity generally exists." problem="Profits can remain inside companies and distributions can be postponed." />
          <EventCard title="When value is realised" examples="Capital gains taxation" advantage="A sale establishes value and usually creates liquidity." problem="Waiting for liquidity can discourage the transaction that creates liquidity." />
          <EventCard title="When value increases" examples="Accrual taxation" advantage="Reduces deferral." problem="Realisation solves valuation and liquidity, but creates deferral. Accrual solves deferral, but brings valuation and liquidity back." />
          <EventCard title="While value is owned" examples="Recurrent net wealth taxation" advantage="Does not depend on realisation." problem="A EUR 100m net wealth base at 1% creates a EUR 1m liability independent of actual annual return." />
        </div>
      </DataSection>

      <DataSection label="IMF / analytical" title="The tax rate stays constant. The burden does not.">
        <BurdenChart />
        <p>A 1% annual wealth tax is a 1% tax on the stock of wealth. Its burden relative to actual return changes when returns change.</p>
        <p>This is an illustrative calculation based on the economic mechanism discussed in IMF work on taxing wealth. It is not an observed taxpayer-outcome dataset.</p>
        <SourceNote>Source/context: IMF, How to Tax Wealth, 2024. Unit: wealth tax as share of actual annual return. RETHINKK calculation.</SourceNote>
      </DataSection>

      <DataSection label="Netherlands" title="When the assumption becomes the problem">
        <p>The original conceptual logic of the Dutch Box 3 system was administrative simplicity. Instead of measuring every dividend, interest payment, investment result and capital transaction, the government assumed a return and taxed that assumed return.</p>
        <p>A deemed-return tax replaces measurement risk with assumption risk.</p>
        <p>That design can function cleanly while assumed returns remain close to observable economic reality. It becomes more fragile when savings rates approach zero or become negative while deemed returns stay positive.</p>
        <MajorCallout>A tax on assumed returns works beautifully until the assumption stops resembling reality.</MajorCallout>
      </DataSection>

      <DataSection label="Behaviour" title="Taxes change behaviour">
        <p>So far the question has been design. The next question is response.</p>
        <p>Tax policy can change portfolio structure, legal structure, timing, realisation, reported wealth, tax residence and investment decisions.</p>
      </DataSection>

      <DataSection label="Spain" title="Capital changes form">
        <p>Spain shows the tension inside wealth-tax design. Tax productive or business assets too aggressively and liquidity may need to be extracted from assets that are meant to remain productive. Exempt business assets and private wealth may be repackaged as business wealth.</p>
        <div className="paired-statements">
          <strong>Tax productive capital too aggressively and you may force capital out of productive assets.</strong>
          <strong>Exempt productive capital and private wealth may be repackaged as productive capital.</strong>
        </div>
        <p>Tax policy does not merely collect from capital. It changes the form capital takes.</p>
        <SourceNote>Source/context: European Commission 2026 study and Spanish wealth-tax design evidence. Classification: observed policy design and behavioural-response analysis.</SourceNote>
      </DataSection>

      <DataSection label="Norway / Switzerland" title="People move too">
        <NorwayChart />
        <p>Official Norwegian data show a real migration response among high-wealth taxpayers. But "some wealthy people left" does not equal "the tax lost money."</p>
        <p>Swiss cantonal evidence points in the same analytical direction: reported taxable wealth responds to wealth-tax differences. The response includes mobility, asset-price effects, reporting behaviour, avoidance or evasion responses and relatively limited real-savings response.</p>
        <MajorCallout>A fall in taxable wealth is not necessarily a fall in actual wealth.</MajorCallout>
        <SourceNote>Sources: Norwegian government data; Brulhart, Gruber, Krapf and Schmidheiny, Behavioral Responses to Wealth Taxes: Evidence from Switzerland. Unit: high-wealth taxpayer counts and reported taxable wealth response.</SourceNote>
      </DataSection>

      <DataSection label="UK / Italy" title="London to Milan?">
        <p>The UK/Italy debate is a useful contemporary example, but it should not be simplified. The United Kingdom does not have a general recurrent net wealth tax. The UK ended the old non-dom remittance-basis regime from 6 April 2025. Italy offers qualifying new residents a special foreign-income regime, with the current official amount at EUR 300,000 for people transferring tax residence after 11 August 2024.</p>
        <p>Person moving, tax residence moving and capital moving are related events. They are not automatically the same event.</p>
        <p>The better causal evidence comes from HMRC's evaluation of the 2017 deemed-domicile reform. Affected long-term non-doms became approximately 10-12% more likely to leave, but the majority remained. Stayers paid substantially more tax, and HMRC estimated additional revenue from stayers exceeded revenue lost from leavers.</p>
        <div className="false-claims">
          <span>Raise taxes and they all leave. <strong>False.</strong></span>
          <span>Tax has no effect on location. <strong>False.</strong></span>
          <span>If some wealthy taxpayers leave, the reform necessarily loses money. <strong>False.</strong></span>
        </div>
        <SourceNote>Sources: HMRC evaluation; Agenzia delle Entrate. Classification: observed reform evaluation and official regime information.</SourceNote>
      </DataSection>

      <DataSection label="Design" title="There is no single tax on wealth">
        <InstrumentTable />
      </DataSection>

      <DataSection label="IMF / OECD context" title="The net wealth tax has become the exception">
        <WealthTaxCountriesChart />
        <p>The decline does not prove that wealth taxation is ineffective. It shows how difficult recurrent taxation of the stock of wealth has been to maintain.</p>
        <SourceNote>Sources: IMF and OECD. Unit: OECD countries operating broad recurrent net wealth taxes. Context, not proof of the article's conclusion.</SourceNote>
      </DataSection>

      <DataSection label="Analytical model" title="The behaviour chain">
        <div className="behaviour-chain">
          {behaviourChain.map((step, index) => (
            <div className="behaviour-step" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
        <p>Each arrow is an empirical question.</p>
      </DataSection>

      <DataSection label="Evidence" title="What the evidence says">
        <div className="assessment-statements">
          <article>
            <h3>Extreme wealth is frequently not extreme liquidity.</h3>
            <p>Illiquid wealth nevertheless represents real economic value. Realisation taxation solves some liquidity and valuation problems, but creates deferral and lock-in.</p>
          </article>
          <article>
            <h3>Different designs create different incentives.</h3>
            <p>Accrual taxation reduces deferral but creates valuation and liquidity problems. Business exemptions can protect productive capital while also creating planning opportunities.</p>
          </article>
        </div>
        <p>Higher taxation can cause internationally mobile taxpayers to move. That does not automatically mean a reform loses government revenue. These findings are not contradictions. They are consequences of different tax designs.</p>
      </DataSection>

      <DataSection label="Before the rate" title="The question before the percentage">
        <p>Public debate commonly starts with 1%, 2%, a EUR 50 million threshold, a millionaire tax or a billionaire tax.</p>
        <p>RETHINKK reverses the sequence. First ask what economic event is being taxed. When value is earned? When it produces income? When it appreciates? When it is realised? While it is owned? When it is transferred?</p>
        <p>Only then ask the rate.</p>
      </DataSection>

      <section className="data-conclusion wealth-final">
        <h2>Wealth is value.<br />Taxation requires an event.</h2>
        <p>The debate is usually about how much.</p>
        <p>Tax design begins with what.</p>
      </section>

      <DataSection label="RETHINKK assessment" title="Design before rate" compact>
        <p>The evidence does not support the proposition that large fortunes cannot be taxed because much of their value is unrealised.</p>
        <p>Nor does it support the proposition that taxing the annual stock of wealth is simply equivalent to taxing cash held by the wealthy.</p>
        <p>Different methods of taxing capital produce different incentives, liquidity requirements, valuation problems and behavioural responses.</p>
        <p>The relevant policy question is therefore broader than whether the wealthy should pay more. It is which taxable event reaches economic wealth most effectively while creating the fewest unintended distortions elsewhere.</p>
        <p>That is a question of design before it is a question of rate.</p>
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

function DataSection({ label, title, compact, children }: { label: string; title: string; compact?: boolean; children: ReactNode }) {
  return (
    <section className={`data-section ${compact ? "compact" : ""}`}>
      <div className="kicker yellow">{label}</div>
      <h2>{title}</h2>
      <div className="data-section-content">{children}</div>
    </section>
  );
}

function MajorCallout({ children }: { children: ReactNode }) {
  return <p className="major-data-callout">{children}</p>;
}

function SourceNote({ children }: { children: ReactNode }) {
  return <p className="source-note">{children}</p>;
}

function CompositionChart() {
  return (
    <figure className="research-chart wealth-composition-chart">
      {compositionData.map((item) => (
        <div className="stacked-row" key={item.group}>
          <span>{item.group}</span>
          <div className="stacked-track" aria-label={`${item.group}: deposits ${item.deposits}%, housing ${item.housing}%, ownership and other assets ${item.ownership}%`}>
            <i className="stack-deposits" style={{ width: `${item.deposits}%` }} />
            <i className="stack-housing" style={{ width: `${item.housing}%` }} />
            <i className="stack-ownership" style={{ width: `${item.ownership}%` }} />
          </div>
        </div>
      ))}
      <div className="chart-legend">
        <span><i className="stack-deposits" />Deposits</span>
        <span><i className="stack-housing" />Housing</span>
        <span><i className="stack-ownership" />Ownership / other assets</span>
      </div>
      <figcaption>Euro area household wealth composition by net wealth group. Latest ECB-reported composition used in article draft.</figcaption>
    </figure>
  );
}

function OwnershipChart() {
  return (
    <figure className="research-chart ownership-chart">
      <div className="ownership-meter">
        <span>Top 10%</span>
        <div><i style={{ width: "80%" }} /></div>
        <strong>around 80%</strong>
      </div>
      <p>Equities, investment fund shares and bonds held by the wealthiest 10% of euro-area households.</p>
      <figcaption>European Central Bank research. Business wealth is also highly concentrated; deposits are more broadly distributed.</figcaption>
    </figure>
  );
}

function BurdenChart() {
  return (
    <figure className="research-chart burden-chart">
      {burdenData.map((item) => (
        <div className="burden-row" key={item.returnRate}>
          <span>{item.returnRate} annual return</span>
          <div><i style={{ width: `${item.width}%` }} /></div>
          <strong>{item.burden}</strong>
        </div>
      ))}
      <figcaption>Illustrative calculation: 1% annual wealth tax as a percentage of actual return.</figcaption>
    </figure>
  );
}

function NorwayChart() {
  const max = 46;
  return (
    <figure className="research-chart norway-chart">
      {norwayMigration.map((item) => (
        <div className="norway-row" key={item.year}>
          <span>{item.year}</span>
          <div className="norway-bars">
            <i className="emigrant-bar" style={{ width: `${(item.emigrants / max) * 100}%` }}><b>{item.emigrants}</b></i>
            <i className="immigrant-bar" style={{ width: `${(item.immigrants / max) * 100}%` }}><b>{item.immigrants}</b></i>
          </div>
        </div>
      ))}
      <div className="chart-legend">
        <span><i className="emigrant-bar" />High-wealth emigrants</span>
        <span><i className="immigrant-bar" />High-wealth immigrants</span>
      </div>
      <figcaption>Norway. High-wealth taxpayer movements, 2021-2025. Official counts.</figcaption>
    </figure>
  );
}

function InstrumentTable() {
  return (
    <div className="instrument-table" role="table" aria-label="Tax instruments by taxable event">
      <div className="instrument-head" role="row">
        <strong>Instrument</strong>
        <strong>Taxable event</strong>
        <strong>Main advantage</strong>
        <strong>Main problem</strong>
      </div>
      {taxInstruments.map((item) => (
        <div className="instrument-row" role="row" key={item.instrument}>
          <strong>{item.instrument}</strong>
          <span>{item.event}</span>
          <span>{item.advantage}</span>
          <span>{item.problem}</span>
        </div>
      ))}
    </div>
  );
}

function WealthTaxCountriesChart() {
  return (
    <figure className="research-chart wealth-tax-countries">
      <div className="country-count-row">
        <span>1990</span>
        <div><i style={{ width: "100%" }} /></div>
        <strong>12</strong>
      </div>
      <div className="country-count-row">
        <span>2024</span>
        <div><i style={{ width: "25%" }} /></div>
        <strong>3</strong>
      </div>
      <p>IMF identifies Switzerland, Spain and Norway as broad explicit recurrent wealth-tax countries in 2024.</p>
      <figcaption>OECD countries with broad recurrent net wealth taxes. Two verified anchor points only.</figcaption>
    </figure>
  );
}

function EventCard({ title, examples, advantage, problem }: { title: string; examples: string; advantage: string; problem: string }) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{examples}</p>
      <span>{advantage}</span>
      <em>{problem}</em>
    </article>
  );
}
