import { notFound } from "next/navigation";
import { PublicationPage } from "@/components/publication-page";
import { publications } from "@/lib/content";

function findDataPublication(slug: string) {
  return publications.find((item) => item.type === "data" && item.slug === slug && item.status !== "archived");
}

export function generateStaticParams() {
  return publications.filter((item) => item.type === "data").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findDataPublication(slug);
  if (!item) return {};
  return {
    title: item.seoTitle || item.title,
    description: item.seoDescription || item.excerpt,
    robots: item.status === "published" ? undefined : { index: false, follow: false }
  };
}

export default async function DataDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findDataPublication(slug);
  if (!item) notFound();
  return <PublicationPage item={item} />;
}
