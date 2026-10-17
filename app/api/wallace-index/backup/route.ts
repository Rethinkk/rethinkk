import { actor } from "@/lib/wallace-index/editorial";
import { errorResponse } from "@/lib/wallace-index/http";
import { researchBackup } from "@/lib/wallace-index/backup";
import { digest } from "@/lib/wallace-index/editorial";
export async function GET() {
  try {
    await actor();
    const data = await researchBackup();
    return Response.json(
      {
        schemaVersion: 1,
        kind: "private-research-backup",
        checksum: digest(data),
        exportedAt: new Date().toISOString(),
        data,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "Content-Disposition":
            "attachment; filename=wallace-private-research.json",
        },
      },
    );
  } catch (e) {
    return errorResponse(e);
  }
}
