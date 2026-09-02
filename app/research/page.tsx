import Link from "next/link";
import { PageActions, Section } from "@/components/site";
import { aiWorkStudy } from "@/lib/ai-work-study";

export const metadata = {
  title: "Research | RTHNK",
  description: "Active RTHNK research projects and study intake flows."
};

export default function ResearchPage() {
  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">RTHNK Research</div>
        <h1 className="page-title">Active research.</h1>
        <p className="lede">Research projects are built as structured intake flows, not campaign pages.</p>
        <div className="research-list">
          <article className="research-project">
            <div className="kicker muted">In cooperation with Tysma | Lems International Tax Consultants</div>
            <h2>{aiWorkStudy.title}</h2>
            <p>{aiWorkStudy.subtitle}</p>
            <span>{aiWorkStudy.estimate}</span>
            <Link className="text-link" href={`/research/${aiWorkStudy.slug}`}>Start the study -&gt;</Link>
          </article>
        </div>
      </div>
    </Section>
  );
}
