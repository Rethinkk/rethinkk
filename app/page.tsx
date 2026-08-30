import Link from "next/link";
import { DataChart } from "@/components/charts";
import { IndexPanel } from "@/components/index-panel";
import { ArticleCard, Section } from "@/components/site";
import { activeRanked, categoryPath, publicationPath, published } from "@/lib/queries";
import { categories, settings } from "@/lib/content";
import { getLatestPublishedEdition, isVisibleAssessment } from "@/lib/democracy-index";

export default function HomePage() {
  const ranked = activeRanked();
  const hero = ranked.find((item) => item.heroPriority === 1) || ranked[0];
  const secondary = ranked.filter((item) => item.id !== hero.id).slice(0, 3);
  const data = activeRanked("data")[0];
  const index = activeRanked("index")[0];
  const democracyIndex = getLatestPublishedEdition();
  const visibleIndexAssessments = democracyIndex?.assessments.filter(isVisibleAssessment) || [];

  return (
    <>
      <Section className="hero">
        <div className="section-inner">
          <div className="kicker muted">Featured thinking / {hero.category} / {settings.today}</div>
        </div>
        <div className="section-inner hero-grid">
          <div>
            <h1>Europe is <br />not small. <br /><span className="yellow">It just talks <br />as if it is.</span></h1>
          </div>
          <div className="hero-summary">
            <p>{hero.excerpt}</p>
            <Link className="text-link" href={publicationPath(hero)}>Read thinking -&gt;</Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="section-inner">
          <div className="section-head">
            <div>
              <div className="kicker yellow">Thinking</div>
              <h2>Question what we know.</h2>
            </div>
            <div className="kicker muted">Latest analysis and essays</div>
          </div>
          <div className="story-grid">{secondary.map((item) => <ArticleCard key={item.id} item={item} />)}</div>
        </div>
      </Section>

      <Section compact>
        <div className="section-inner">
          <div className="section-head">
            <div>
              <div className="kicker yellow">Fields</div>
              <h2>Six areas. One standard.</h2>
            </div>
            <div className="kicker muted">Categories feed the archive</div>
          </div>
          <div className="category-spine">
            {categories.map((category) => {
              const count = published().filter((item) => item.category === category).length;
              return (
                <Link className="category-tile" href={categoryPath(category)} key={category}>
                  <span>{category}</span>
                  <strong>{count}</strong>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      <Section>
        <div className="section-inner split-grid">
          <div>
            <div className="kicker yellow">Rethinkk Index</div>
            <h2 className="display-title">Democracy Direction Index<br /><span className="yellow">{democracyIndex?.year || 2026}</span></h2>
            <p className="lede">{democracyIndex?.subtitle || "Democracy is not a status. It is a direction."}</p>
            <Link className="text-link" href={democracyIndex ? `/index/democracy-direction/${democracyIndex.year}` : publicationPath(index)}>Explore the index -&gt;</Link>
          </div>
          <IndexPanel assessments={visibleIndexAssessments} />
        </div>
      </Section>

      <Section>
        <div className="section-inner split-grid">
          <div>
            <div className="kicker yellow">Data</div>
            <h2 className="display-title">Less noise.<br />More <span className="yellow">context.</span></h2>
            <p className="copy">{data.hypothesis}</p>
            <Link className="text-link" href={publicationPath(data)}>Explore data -&gt;</Link>
          </div>
          <div className="panel">
            <div className="status-row">
              <div>
                <div className="kicker muted">Example data note</div>
                <p className="lede">{data.title}</p>
              </div>
              <div className="kicker yellow">Structured data</div>
            </div>
            {data.dataset && <DataChart dataset={data.dataset} />}
          </div>
        </div>
      </Section>

      <Section compact>
        <div className="section-inner split-grid">
          <div>
            <div className="kicker yellow">Author network</div>
            <h2 className="display-title">Help RETHINKK what we think we know.</h2>
          </div>
          <div>
            <p className="copy">RETHINKK grows by adding people who can research carefully, write clearly and separate evidence from interpretation.</p>
            <Link className="text-link" href="/authors">Become a co-author -&gt;</Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="section-inner">
          <div className="kicker yellow">About RETHINKK</div>
          <p className="page-title">Not left. Not right. <span className="yellow">Evidence-led.</span></p>
          <Link className="text-link" href="/about">Why RETHINKK -&gt;</Link>
        </div>
      </Section>
    </>
  );
}
