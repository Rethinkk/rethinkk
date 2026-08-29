import { notFound } from "next/navigation";
import { ArchiveItem, PageActions, Section } from "@/components/site";
import { categories } from "@/lib/content";
import { categoryFromSlug, published, slugify } from "@/lib/queries";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: slugify(category) }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();
  const items = published().filter((item) => item.category === category);

  return (
    <Section>
      <div className="section-inner">
        <PageActions archive />
        <div className="kicker yellow">Category</div>
        <h1 className="page-title">{category}</h1>
        <p className="lede">This page is fed automatically by every published RETHINKK item assigned to this category.</p>
        <div className="archive-list">
          {items.length ? items.map((item) => <ArchiveItem key={item.id} item={item} />) : <p className="copy">No publications in this category yet.</p>}
        </div>
      </div>
    </Section>
  );
}
