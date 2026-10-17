import { actor, deskData, execute } from "@/lib/wallace-index/editorial";
import {
  checkOrigin,
  errorResponse,
  limitedJson,
} from "@/lib/wallace-index/http";
import { commandSchema } from "@/lib/wallace-index/validation";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json(await deskData(await actor()), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const user = await actor();
    const parsed = commandSchema.safeParse(await limitedJson(request));
    if (!parsed.success)
      return Response.json(
        {
          error: parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join(" "),
        },
        { status: 422 },
      );
    return Response.json(
      { result: await execute(user, parsed.data) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return errorResponse(e);
  }
}
