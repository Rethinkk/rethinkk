import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CountrySearch,
  DemocracyIndexHero,
  EditionSelector,
  MapLegend,
  MovementBoard,
  StatusDirectionVelocity,
  TrajectoryChart,
  WorldStatusMap
} from "@/components/democracy-index";
import { PageActions, Section } from "@/components/site";
import { democracyDirectionEditions, getEdition } from "@/lib/democracy-index";

export function generateStaticParams() {
  return democracyDirectionEditions
    .filter((edition) => edition.status === "published")
    .map((edition) => ({ year: String(edition.year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const edition = getEdition(Number(year));
  return {
    title: edition ? `${edition.title} | RETHINKK` : "Democracy Direction Index | RETHINKK",
    description: edition?.subtitle || "RETHINKK assessment of democratic institutions, direction and velocity."
  };
}

export default async function DemocracyDirectionEditionPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const edition = getEdition(Number(year));
  if (!edition) notFound();

  const countries = edition.assessments.filter((country) => country.assessmentStatus === "published");

  return (
    <>
      <Section>
        <div className="section-inner">
          <PageActions />
          <EditionSelector editions={democracyDirectionEditions.filter((item) => item.status === "published")} currentYear={edition.year} />
          <DemocracyIndexHero edition={edition} />
          <StatusDirectionVelocity />
        </div>
      </Section>

      <Section compact>
        <div className="section-inner">
          <div className="section-head">
            <div>
              <div className="kicker yellow">World view</div>
              <h2>Institutions in motion.</h2>
            </div>
            <Link className="text-link" href="/index/democracy-direction/methodology">Methodology -&gt;</Link>
          </div>
          <WorldStatusMap assessments={countries} />
          <MapLegend />
        </div>
      </Section>

      <Section>
        <div className="section-inner">
          <div className="section-head">
            <div>
              <div className="kicker yellow">Movement</div>
              <h2>Direction comes first.</h2>
            </div>
            <div className="kicker muted">Grouped dynamically by trajectory</div>
          </div>
          <MovementBoard assessments={countries} />
        </div>
      </Section>

      <Section compact>
        <div className="section-inner split-grid">
          <div>
            <div className="kicker yellow">Trajectory</div>
            <h2 className="display-title">Strong can fall.<br />Weak can improve.</h2>
            <p className="copy">The chart separates institutional strength from institutional movement. It is not a simple ranking table.</p>
          </div>
          <TrajectoryChart assessments={countries} />
        </div>
      </Section>

      <Section compact>
        <div className="section-inner">
          <CountrySearch assessments={countries} />
        </div>
      </Section>
    </>
  );
}
