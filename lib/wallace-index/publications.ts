import { Publication } from "@/lib/content";
import { db } from "./db";
import { catalogue } from "./catalogue";
export async function wallacePublications(): Promise<Publication[]> {
  const cat = await catalogue();
  const latest = cat.editions[0];
  const items: Publication[] = [];
  if (latest)
    for (const a of latest.assessments)
      items.push({
        id: `wallace-leader-${a.leader.id}`,
        slug: `wallace-profile-${a.leader.slug}`,
        type: "research",
        status: "published",
        title: `Leadership profile: ${a.leader.name}`,
        excerpt: `${a.leader.country} · ${a.leader.office}. Read the six-dimension assessment and supporting evidence.`,
        category: "Power & Politics",
        tags: [
          "The Wallace Index",
          a.leader.name,
          a.leader.country,
          a.leader.office,
        ],
        author: "RETHINKK Research",
        publicationDate: latest.publishedAt.slice(0, 10),
        editorialWeight: 60,
        relatedContent: [],
      });
  if (process.env.DATABASE_URL)
    try {
      const notes = await db.wallaceContent.findMany({
        where: { status: "published" },
        orderBy: { version: "desc" },
      });
      const seen = new Set<string>();
      for (const n of notes) {
        if (seen.has(n.slug)) continue;
        seen.add(n.slug);
        items.push({
          id: `wallace-note-${n.id}`,
          slug: `wallace-note-${n.slug}`,
          type: "research",
          status: "published",
          title: n.title,
          excerpt: n.body.slice(0, 220),
          category: "Power & Politics",
          tags: ["The Wallace Index", "Research note"],
          author: "RETHINKK Research",
          publicationDate: n.publishedAt?.toISOString().slice(0, 10) || "",
          editorialWeight: 60,
        });
      }
    } catch {
      /* Catalogue can remain readable during a storage outage. */
    }
  return items;
}
export async function publicNotes() {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await db.wallaceContent.findMany({
      where: { status: "published" },
      orderBy: { version: "desc" },
    });
  } catch {
    return [];
  }
}
