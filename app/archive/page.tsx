import { ArchiveClient } from "@/components/archive-client";
import { PageActions, Section } from "@/components/site";
import { published } from "@/lib/queries";

export default function ArchivePage() {
  const items = published().filter((item) => !item.hideFromArchive);

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
