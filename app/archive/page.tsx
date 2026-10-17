import { ArchiveClient } from "@/components/archive-client";
import { PageActions, Section } from "@/components/site";
import { published } from "@/lib/queries";
import { wallacePublications } from "@/lib/wallace-index/publications";
export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const items = [...published(), ...await wallacePublications()].filter((item) => !item.hideFromArchive);

  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">Archive</div>
        <h1 className="page-title">What has RETHINKK published?</h1>
        <p className="lede">Everything remains available after it leaves the homepage. The archive answers a different question than the front page.</p>
        <ArchiveClient items={items} />
      </div>
    </Section>
  );
}
