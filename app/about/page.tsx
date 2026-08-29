import { PageActions, Section } from "@/components/site";

export default function AboutPage() {
  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">About</div>
        <h1 className="page-title">Rethink knowledge.</h1>
        <p className="lede">RETHINKK is an institutional identity for independent research, analysis and interpretation.</p>
        <div className="evidence-grid article-body">
          <section className="evidence-block"><h3>We are</h3><p>Clear, evidence-led, concise, curious, independent and prepared to conclude.</p></section>
          <section className="evidence-block"><h3>We are not</h3><p>Activist by default, partisan, sensationalist, performatively neutral, verbose or afraid of disagreement.</p></section>
        </div>
        <p className="page-title statement-title">We don't shout. <span className="yellow">We present.</span></p>
      </div>
    </Section>
  );
}
