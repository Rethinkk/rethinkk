import { PageActions, Section } from "@/components/site";
import { getLatestPublishedEdition } from "@/lib/democracy-index";

export const metadata = {
  title: "Methodology - Democracy Direction Index | RETHINKK",
  description: "Methodology for the RETHINKK Democracy Direction Index."
};

export default function DemocracyDirectionMethodologyPage() {
  const edition = getLatestPublishedEdition();

  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">Methodology</div>
        <h1 className="page-title">Status tells us where a country is. Direction tells us where it is going.</h1>
        <p className="lede">Velocity tells us how quickly it is getting there.</p>
        <p className="development-label">Methodology version {edition?.methodologyVersion || "1.0-dev"} / {edition?.year || 2026} edition</p>

        <div className="methodology-grid">
          <MethodBlock title="Scope" text="The index assesses democratic institutions and institutional movement. It does not score ideology, party popularity or political taste." />
          <MethodBlock title="Five dimensions" text="Judicial independence, media freedom, electoral integrity, civic space and human rights, and checks and balances." />
          <MethodBlock title="Assessment process" text="External datasets and primary sources are evidence inputs. Final status, direction and velocity remain RETHINKK research assessments." />
          <MethodBlock title="Status" text="Resilient democracy, institutional erosion, autocratic and not assessed are presentation states. Grey means not assessed in the current edition." />
          <MethodBlock title="Direction" text="Direction is stored separately from status: improving, stable or deteriorating." />
          <MethodBlock title="Velocity" text="Velocity describes the speed of movement: rapid, normal or limited. It is combined with direction only for display." />
          <MethodBlock title="Confidence" text="Confidence reflects evidence quality and assessment certainty. It does not reflect democratic quality." />
          <MethodBlock title="Revision policy" text="Historic editions remain immutable. Material corrections require a visible revision date and revision note." />
          <MethodBlock title="Limitations" text="Scores support the assessment. They do not automatically calculate status unless a future methodology explicitly defines that rule." />
        </div>
      </div>
    </Section>
  );
}

function MethodBlock({ title, text }: { title: string; text: string }) {
  return (
    <article className="method-block">
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}
