import { researchSnapshot } from "@/lib/wallace-index/research";
export function GET() {
  return Response.json(researchSnapshot, {
    headers: {
      "Content-Disposition":
        'attachment; filename="wallace-qualitative-research-2026-10-17.json"',
    },
  });
}
