import { ArchiveItem, PageActions, Section } from "@/components/site";
import { published } from "@/lib/queries";

export default function ThinkingPage() {
  const items = published().filter((item) => item.type === "thinking");
  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">Thinking</div>
        <h1 className="page-title">Question what we know.</h1>
        <p className="lede">Essays, analysis and observations across democracy, economics, migration, society, Europe, geopolitics and power.</p>
        <div className="archive-list">{items.map((item) => <ArchiveItem key={item.id} item={item} />)}</div>
      </div>
    </Section>
  );
}
