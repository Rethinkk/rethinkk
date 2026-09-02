import { AiWorkStudyClient } from "@/components/ai-work-study-client";
import { PageActions, Section } from "@/components/site";
import { aiWorkStudy } from "@/lib/ai-work-study";

export const metadata = {
  title: "The AI Work Study | RTHNK",
  description: "RTHNK research intake flow on how paid AI training, annotation and evaluation work is changing professional work."
};

export default function AiWorkStudyPage() {
  return (
    <Section className="survey-page">
      <div className="section-inner">
        <PageActions />
        <div className="research-lockup">
          <span>RTHNK Research</span>
          <strong>in cooperation with Tysma | Lems International Tax Consultants</strong>
        </div>
        <AiWorkStudyClient />
        <aside className="privacy-note">
          <h2>Privacy principle</h2>
          <p>Designed with GDPR data-minimisation and privacy principles in mind. You can complete the study anonymously. Contact details are requested only if you choose to be approached for a follow-up interview.</p>
          <p>The AI Work Study is conducted by RTHNK, an initiative and trade name of Global Citizens B.V., in cooperation with Tysma | Lems International Tax Consultants.</p>
        </aside>
      </div>
    </Section>
  );
}
