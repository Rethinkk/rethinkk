import { DataChart } from "@/components/charts";
import { MigrationDataArticle } from "@/components/migration-data-article";
import { ArticleCard, PageActions, Section } from "@/components/site";
import { Publication, publications, sources } from "@/lib/content";

export function PublicationPage({ item }: { item: Publication }) {
  const itemSources = (item.sources || [])
    .map((id) => sources.find((source) => source.id === id))
    .filter(Boolean);
  const related = (item.relatedContent || [])
    .map((id) => publications.find((publication) => publication.id === id))
    .filter(Boolean) as Publication[];
  const isMigrationDataArticle = item.id === "data-migration-europe";

  return (
    <Section>
      <div className="section-inner">
        <PageActions archive />
        <div className="kicker yellow">{item.type} / {item.category}</div>
        <h1 className="article-title">{item.title}</h1>
        <p className="lede">{item.subtitle || item.excerpt}</p>
        <div className="meta muted">{item.author} / {item.publicationDate}</div>

        {isMigrationDataArticle ? (
          <MigrationDataArticle />
        ) : item.type === "data" && item.dataset && (
          <div className="panel article-panel">
            <DataChart dataset={item.dataset} />
            <p className="copy">{item.methodology}</p>
          </div>
        )}

        {item.type === "index" && item.countries && (
          <div className="panel article-panel">
            <div className="kicker muted">Country assessments / {item.currentEdition}</div>
            <ul className="country-list">
              {item.countries.map((country) => (
                <li className="country-item" key={country.isoCode}>
                  <div className="status-row">
                    <strong>{country.country}</strong>
                    <span className="yellow">{country.institutionalScore}</span>
                  </div>
                  <div className="metric-row meta muted">
                    <span>{country.status}</span>
                    <span>{country.direction} / {country.velocity} velocity / change {country.change}</span>
                  </div>
                  <div className="bar"><span style={{ width: `${country.institutionalScore}%` }} /></div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isMigrationDataArticle && (
          item.sections ? (
            <div className="article-body">
              <div className="evidence-grid">
                {Object.entries(item.sections).map(([key, value]) => (
                  <section className="evidence-block" key={key}>
                    <h3>{key}</h3>
                    <p>{value}</p>
                  </section>
                ))}
              </div>
            </div>
          ) : (
            <div className="article-body"><p>{item.excerpt}</p></div>
          )
        )}

        {!isMigrationDataArticle && itemSources.length > 0 && (
          <>
            <h2 className="display-title source-title">Sources</h2>
            <ul className="source-list">
              {itemSources.map((source) => source && (
                <li key={source.id}>{source.organisation} / {source.title} / {source.sourceType}</li>
              ))}
            </ul>
          </>
        )}

        {related.length > 0 && (
          <section className="related-block">
            <div className="kicker yellow">Related content</div>
            <div className="story-grid related-grid">{related.map((relatedItem) => <ArticleCard key={relatedItem.id} item={relatedItem} />)}</div>
          </section>
        )}
      </div>
    </Section>
  );
}
