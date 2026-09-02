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
        <div className="legal-note article-body">
          <h2>Legal structure</h2>
          <p>Rethinkk is a trade name and initiative of Global Citizens B.V., a private limited company incorporated and registered in the Netherlands.</p>
          <p>Global Citizens B.V. provides the legal and organisational structure behind Rethinkk. Editorial research, analysis and publication are conducted under the Rethinkk name.</p>
          <p>Global Citizens B.V.<br />Chamber of Commerce (KVK): 55290744<br />Registered office: Veerhaven 4, 4th floor, 3016 CJ Rotterdam<br />The Netherlands</p>
          <p>Rethinkk is a trade name of Global Citizens B.V.</p>
        </div>
        <p className="page-title statement-title">We don't shout. <span className="yellow">We present.</span></p>
      </div>
    </Section>
  );
}
