import { notFound } from "next/navigation";
import { PublicationPage } from "@/components/publication-page";
import { publications } from "@/lib/content";
import { findPublication } from "@/lib/queries";

export function generateStaticParams() {
  return publications.filter((item) => item.type === "thinking").map((item) => ({ slug: item.slug }));
}

export default async function ThinkingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findPublication("thinking", slug);
  if (!item) notFound();
  return <PublicationPage item={item} />;
}
