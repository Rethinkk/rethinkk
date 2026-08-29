import { NextResponse } from "next/server";
import { getEdition, serializeEdition } from "@/lib/democracy-index";

export async function GET(_request: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const edition = getEdition(Number(year));
  if (!edition) return NextResponse.json({ error: "Edition not found" }, { status: 404 });
  return NextResponse.json(serializeEdition(edition), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
