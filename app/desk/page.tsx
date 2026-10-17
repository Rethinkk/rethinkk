import { DeskClient } from "@/components/desk-client";
import { PageActions, Section } from "@/components/site";

export default function DeskPage() {
  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">Editorial desk</div>
        <h1 className="page-title">Private publishing desk.</h1>
        <p className="lede desk-note">The public site is the publication. The desk is the internal layer for drafts, sources, homepage prominence and publishing control.</p>
        <p><a className="text-link" href="/desk/wallace-index">Open The Wallace Index research desk -&gt;</a></p>
        <DeskClient />
      </div>
    </Section>
  );
}
