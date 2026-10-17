import { catalogue } from "@/lib/wallace-index/catalogue";
import { editionCsv } from "@/lib/wallace-index/export";
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const cat = await catalogue(q.get("demo") === "1");
  const edition = cat.editions.find((e) => e.slug === q.get("edition"));
  if (!edition)
    return Response.json(
      { error: "Published edition not found." },
      { status: 404 },
    );
  const csv = q.get("format") === "csv";
  return new Response(
    csv
      ? editionCsv(edition)
      : JSON.stringify({ schemaVersion: 1, edition }, null, 2),
    {
      headers: {
        "Content-Type": csv ? "text/csv; charset=utf-8" : "application/json",
        "Content-Disposition": `attachment; filename="wallace-${edition.slug}.${csv ? "csv" : "json"}"`,
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
