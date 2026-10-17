import { EditorialError } from "./editorial";
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    throw new EditorialError("A same-origin request is required.", 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new EditorialError("Use application/json.", 415);
}
export async function limitedJson(request: Request, max = 1000000) {
  if (Number(request.headers.get("content-length") || 0) > max)
    throw new EditorialError("Request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new EditorialError("Request body required.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const result = await reader.read();
    if (result.done) break;
    length += result.value.length;
    if (length > max) {
      await reader.cancel();
      throw new EditorialError("Request is too large.", 413);
    }
    chunks.push(result.value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new EditorialError("Invalid JSON.");
  }
}
export function errorResponse(error: unknown) {
  if (error instanceof EditorialError)
    return Response.json({ error: error.message }, { status: error.status });
  console.error(
    "Wallace editorial operation failed",
    error instanceof Error ? error.name : "Unknown error",
  );
  return Response.json(
    {
      error:
        "The operation could not be completed. Check references, duplicate records and database availability. No partial changes were saved.",
    },
    { status: 400 },
  );
}
