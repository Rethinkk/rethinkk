import { Catalogue, Edition } from "./model";
import { demoEdition } from "./demo";
import { db } from "./db";
export async function catalogue(demonstration = false): Promise<Catalogue> {
  if (demonstration) return { editions: [demoEdition], unavailable: false };
  if (!process.env.DATABASE_URL) return { editions: [], unavailable: true };
  try {
    const rows = await db.wallaceEdition.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return {
      editions: rows.map((r) => ({
        ...(r.snapshot as unknown as Edition),
        checksum: r.checksum,
      })),
      unavailable: false,
    };
  } catch (e) {
    console.error(
      "Wallace catalogue unavailable",
      e instanceof Error ? e.name : "Database error",
    );
    return { editions: [], unavailable: true };
  }
}
