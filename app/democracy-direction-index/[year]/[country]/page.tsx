import { notFound } from "next/navigation";
import Link from "next/link";
import {
  AssessmentSection,
  ConfidenceIndicator,
  CountryAssessmentHeader,
  CountryHistory,
  EvidenceList,
  InstitutionDimensions,
  InstitutionScore
} from "@/components/democracy-index";
import { ArticleCard, PageActions, Section } from "@/components/site";
import { democracyDirectionEditions, getCountryAssessment } from "@/lib/democracy-index";
import { publications } from "@/lib/content";

export function generateStaticParams() {
  return democracyDirectionEditions.flatMap((edition) =>
    edition.assessments
      .filter((country) => country.assessmentStatus === "published")
      .map((country) => ({ year: String(edition.year), country: country.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ year: string; country: string }> }) {
  const { year, country } = await params;
  const assessment = getCountryAssessment(Number(year), country);
  return {
    title: assessment ? `${assessment.countryName} - Democracy Direction Index ${year} | RETHINKK` : "Country assessment | RETHINKK",
    description: assessment ? `RETHINKK assessment of democratic institutions, direction and institutional change in ${assessment.countryName}.` : undefined
  };
}

export default async function CountryAssessmentPage({ params }: { params: Promise<{ year: string; country: string }> }) {
  const { year, country } = await params;
  const assessment = getCountryAssessment(Number(year), country);
  if (!assessment) notFound();
  const related = (assessment.relatedContent || [])
    .map((id) => publications.find((publication) => publication.id === id))
    .filter(Boolean);

  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <Link className="back-link muted-link" href={`/index/democracy-direction/${assessment.year}`}>{"<- Democracy Direction Index"}</Link>
        <CountryAssessmentHeader country={assessment} />
        <p className="development-label">{assessment.year} development data - not published research</p>

        <div className="country-detail-grid">
          <InstitutionScore country={assessment} />
          <InstitutionDimensions country={assessment} />
        </div>

        <ConfidenceIndicator country={assessment} />

        <AssessmentSection title="What changed">
          <p>{assessment.whatChanged}</p>
        </AssessmentSection>
        <AssessmentSection title="RETHINKK assessment">
          <p>{assessment.assessment}</p>
        </AssessmentSection>
        <AssessmentSection title="Evidence">
          <EvidenceList country={assessment} />
        </AssessmentSection>
        <AssessmentSection title="History">
          <CountryHistory country={assessment} />
        </AssessmentSection>

        {related.length > 0 && (
          <section className="related-block">
            <div className="kicker yellow">Related thinking</div>
            <div className="story-grid related-grid">{related.map((item) => item && <ArticleCard key={item.id} item={item} />)}</div>
          </section>
        )}
      </div>
    </Section>
  );
}
