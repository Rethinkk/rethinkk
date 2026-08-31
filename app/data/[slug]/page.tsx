import { notFound } from "next/navigation";
import { PublicationPage } from "@/components/publication-page";
import { publications } from "@/lib/content";
import { findPublication } from "@/lib/queries";

export function generateStaticParams() {
  return publications.filter((item) => item.type === "data").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findPublication("data", slug);
  if (!item) return {};
  return {
    title: item.seoTitle || item.title,
    description: item.seoDescription || item.excerpt
  };
}

export default async function DataDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findPublication("data", slug);
  if (!item) notFound();
  return <PublicationPage item={item} />;
}
