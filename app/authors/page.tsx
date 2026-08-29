import { AuthorsForm } from "@/components/authors-form";
import { PageActions, Section } from "@/components/site";

export default function AuthorsPage() {
  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">Authors</div>
        <h1 className="page-title">Become a RETHINKK co-author.</h1>
        <p className="lede">RETHINKK publishes people who can question accepted knowledge, work from evidence and still be prepared to reach a conclusion.</p>
        <div className="desk-grid desk-login-grid">
          <div>
            <p className="copy">The author network should grow slowly and deliberately. A co-author does not need to agree with every RETHINKK position, but must respect the distinction between evidence, interpretation and assessment.</p>
            <div className="author-standard">
              <div className="standard-item"><strong>Evidence</strong><p className="copy">Claims should be traceable to data, sources, method or direct observation.</p></div>
              <div className="standard-item"><strong>Clarity</strong><p className="copy">Writing should reduce noise rather than add performance to public arguments.</p></div>
              <div className="standard-item"><strong>Judgement</strong><p className="copy">Neutral tone does not mean avoiding a conclusion when the evidence supports one.</p></div>
            </div>
          </div>
          <AuthorsForm />
        </div>
      </div>
    </Section>
  );
}
