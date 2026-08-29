import { ArchiveItem, PageActions, Section } from "@/components/site";
import { published } from "@/lib/queries";

export default function IndicesPage() {
  const items = published().filter((item) => item.type === "index");
  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">Indices</div>
        <h1 className="page-title">Democracy is not a status.</h1>
        <p className="lede">Indices are independent research products inside RETHINKK, designed to support future editions and country profiles.</p>
        <div className="archive-list">{items.map((item) => <ArchiveItem key={item.id} item={item} />)}</div>
      </div>
    </Section>
  );
}
