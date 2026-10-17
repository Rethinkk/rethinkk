import { createHash } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/wallace-index/db";
import {
  checkOrigin,
  errorResponse,
  limitedJson,
} from "@/lib/wallace-index/http";
const input = z
  .object({
    reference: z.string().trim().min(1).max(500),
    text: z.string().trim().min(20).max(10000),
    contact: z.string().email().max(250).or(z.literal("")).optional(),
    consent: z.literal("yes"),
    website: z.literal("").optional(),
  })
  .strict();
export async function POST(request: Request) {
  try {
    if (
      !process.env.DATABASE_URL ||
      process.env.WALLACE_CONTRIBUTIONS_ENABLED !== "true" ||
      !process.env.WALLACE_PRIVACY_NOTICE
    )
      return Response.json(
        { error: "The contribution queue is not open." },
        { status: 503 },
      );
    checkOrigin(request);
    const parsed = input.safeParse(await limitedJson(request, 20000));
    if (!parsed.success)
      return Response.json(
        {
          error:
            "Check the reference, contribution, email and privacy acknowledgement.",
        },
        { status: 422 },
      );
    const data = parsed.data;
    const hash = createHash("sha256")
      .update(`${data.reference}|${data.text}`)
      .digest("hex");
    await db.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(87014322)`;
      const recent = await tx.wallaceAuditEvent.count({
        where: {
          action: "contribution.received",
          createdAt: { gte: new Date(Date.now() - 60000) },
        },
      });
      if (recent >= 10) throw new Error("Queue rate limit");
      const duplicate = await tx.wallaceAuditEvent.findFirst({
        where: {
          action: "contribution.received",
          reference: hash,
          createdAt: { gte: new Date(Date.now() - 86400000) },
        },
      });
      if (duplicate) return;
      const row = await tx.wallaceContribution.create({
        data: {
          reference: data.reference,
          text: data.text,
          contact: data.contact || null,
        },
      });
      await tx.wallaceAuditEvent.create({
        data: {
          actor: "public",
          action: "contribution.received",
          reference: hash,
          metadata: { contributionId: row.id },
        },
      });
    });
    return Response.json({ received: true }, { status: 202 });
  } catch (e) {
    return errorResponse(e);
  }
}
