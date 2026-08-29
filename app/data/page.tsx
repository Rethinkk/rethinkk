import { ArchiveItem, PageActions, Section } from "@/components/site";
import { published } from "@/lib/queries";

export default function DataPage() {
  const items = published().filter((item) => item.type === "data");
  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">Data</div>
        <h1 className="page-title">Put the claim next to the numbers.</h1>
        <p className="lede">Compact, sourced visual evidence designed to clarify public arguments.</p>
        <div className="archive-list">{items.map((item) => <ArchiveItem key={item.id} item={item} />)}</div>
      </div>
    </Section>
  );
}
