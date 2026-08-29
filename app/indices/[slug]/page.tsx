import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { PublicationPage } from "@/components/publication-page";
import { publications } from "@/lib/content";
import { findPublication } from "@/lib/queries";

export function generateStaticParams() {
  return publications.filter((item) => item.type === "index").map((item) => ({ slug: item.slug }));
}

export default async function IndexDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "democracy-direction-2026") redirect("/index/democracy-direction/2026");
  const item = findPublication("index", slug);
  if (!item) notFound();
  return <PublicationPage item={item} />;
}
