import { Prisma } from "@prisma/client";
import { createHash, randomUUID } from "node:crypto";
import { auth } from "@/auth";
import { db } from "./db";
import {
  Assessment,
  Edition,
  Leader,
  Methodology,
  Role,
  Source,
  may,
  publicAssessment,
  transition,
  validateAssessment,
} from "./model";
import { canonicalReference, Command, importSchema } from "./validation";

type Tx = Prisma.TransactionClient;
export type Actor = { id: string; roles: Role[]; name: string };
export class EditorialError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function actor(): Promise<Actor> {
  if (!process.env.AUTH_SECRET || !process.env.DATABASE_URL)
    throw new EditorialError(
      "The editorial desk is closed until secure access is configured.",
      401,
    );
  const session = await auth();
  if (!session?.user?.id)
    throw new EditorialError(
      "Sign in with an authorised editorial account.",
      401,
    );
  const user = await db.wallaceUser.findUnique({
    where: { id: session.user.id },
  });
  if (!user || user.disabled)
    throw new EditorialError("This editorial account is not enabled.", 403);
  return { id: user.id, name: user.name, roles: user.roles as Role[] };
}
function requireRole(a: Actor, permission: Parameters<typeof may>[1]) {
  if (!may(a.roles, permission))
    throw new EditorialError("Your role does not permit this operation.", 403);
}
const json = (value: unknown) =>
  JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
export function digest(value: unknown) {
  return createHash("sha256")
    .update(
      JSON.stringify(value, (_key, item) =>
        item && typeof item === "object" && !Array.isArray(item)
          ? Object.fromEntries(
              Object.entries(item).sort(([a], [b]) => a.localeCompare(b, "en")),
            )
          : item,
      ),
    )
    .digest("hex");
}
function audit(
  tx: Tx,
  a: Actor,
  action: string,
  reference: string,
  metadata: unknown,
) {
  return tx.wallaceAuditEvent.create({
    data: { actor: a.id, action, reference, metadata: json(metadata) },
  });
}
async function assessment(tx: Tx, id: string) {
  const a = await tx.wallaceAssessment.findUnique({
    where: { id },
    include: { scores: true, evidence: true },
  });
  if (!a) throw new EditorialError("Assessment not found.", 404);
  return a;
}
function asAssessment(a: Awaited<ReturnType<typeof assessment>>): Assessment {
  return a as unknown as Assessment;
}
async function gate(tx: Tx, a: Assessment) {
  const m = await tx.wallaceMethodology.findUnique({
    where: { id: a.methodologyId },
  });
  if (!m) throw new EditorialError("Methodology not found.");
  const sources = await tx.wallaceSource.findMany({
    where: { id: { in: a.evidence.map((e) => e.sourceId) } },
  });
  const errors = validateAssessment(
    a,
    { ...(m.data as unknown as Methodology), approved: m.approved },
    sources.map((s) => s.data as unknown as Source),
  );
  if (errors.length) throw new EditorialError(errors.join(" "));
}
async function saveAssessment(
  tx: Tx,
  a: Actor,
  input: Extract<Command, { action: "assessment.save" }>["data"],
) {
  const { id, scores, evidence, ...fields } = input;
  if (fields.reviewerId) {
    const reviewer = await tx.wallaceUser.findUnique({
      where: { id: fields.reviewerId },
    });
    if (
      !reviewer ||
      reviewer.disabled ||
      !reviewer.roles.includes("reviewer") ||
      reviewer.id === a.id
    )
      throw new EditorialError("Choose an enabled independent reviewer.");
  }
  const previous = id ? await assessment(tx, id) : null;
  if (previous && (previous.status !== "draft" || previous.authorId !== a.id))
    throw new EditorialError(
      "Only the author may edit a draft. Request changes or create a revision first.",
      403,
    );
  const row = previous
    ? await tx.wallaceAssessment.update({
        where: { id },
        data: { ...fields, reviewDecision: "pending" },
      })
    : await tx.wallaceAssessment.create({
        data: {
          ...fields,
          version:
            (
              await tx.wallaceAssessment.aggregate({
                where: { leaderId: fields.leaderId },
                _max: { version: true },
              })
            )._max.version! + 1 || 1,
          authorId: a.id,
        },
      });
  await tx.wallaceEvidence.deleteMany({ where: { assessmentId: row.id } });
  await tx.wallaceDimensionScore.deleteMany({
    where: { assessmentId: row.id },
  });
  await tx.wallaceDimensionScore.createMany({
    data: scores.map((s) => ({ ...s, assessmentId: row.id })),
  });
  if (evidence.length)
    await tx.wallaceEvidence.createMany({
      data: evidence.map((e) => ({ ...e, assessmentId: row.id })),
    });
  await audit(tx, a, "assessment.save", row.id, {
    before: previous,
    after: input,
  });
  return { id: row.id };
}
async function previewImport(
  tx: Tx,
  data: Extract<Command, { action: "import.preview" | "import.apply" }>["data"],
) {
  const parsed = importSchema.parse(data);
  const errors: string[] = [];
  const leaderKeys = new Set<string>();
  const sourceKeys = new Set<string>();
  for (const l of parsed.leaders) {
    if (!l.id) errors.push("Every imported leader requires a stable ID.");
    if (leaderKeys.has(l.slug)) errors.push(`Duplicate leader slug: ${l.slug}`);
    leaderKeys.add(l.slug);
    if (
      await tx.wallaceLeader.findFirst({
        where: {
          OR: [
            { id: l.id || "" },
            { slug: l.slug },
            {
              name: { equals: l.name, mode: "insensitive" },
              country: l.country,
              office: l.office,
            },
          ],
        },
      })
    )
      errors.push(`Leader already exists or needs identity review: ${l.name}`);
  }
  for (const s of parsed.sources) {
    const key = canonicalReference(s.reference);
    if (!s.id) errors.push("Every imported source requires a stable ID.");
    if (sourceKeys.has(key)) errors.push(`Duplicate source: ${s.title}`);
    sourceKeys.add(key);
    if (
      await tx.wallaceSource.findFirst({
        where: { OR: [{ id: s.id || "" }, { fingerprint: digest(key) }] },
      })
    )
      errors.push(`Source already exists: ${s.title}`);
  }
  for (const a of parsed.assessments) {
    if (
      a.id &&
      (await tx.wallaceAssessment.findUnique({ where: { id: a.id } }))
    )
      errors.push(`Existing assessment ID cannot be overwritten: ${a.id}`);
    if (
      !parsed.leaders.some((l) => l.id === a.leaderId) &&
      !(await tx.wallaceLeader.findUnique({ where: { id: a.leaderId } }))
    )
      errors.push(`Unknown leader: ${a.leaderId}`);
    if (
      !(await tx.wallaceMethodology.findUnique({
        where: { id: a.methodologyId },
      }))
    )
      errors.push(`Unknown methodology: ${a.methodologyId}`);
    for (const e of a.evidence)
      if (
        !parsed.sources.some((s) => s.id === e.sourceId) &&
        !(await tx.wallaceSource.findUnique({ where: { id: e.sourceId } }))
      )
        errors.push(`Unknown source: ${e.sourceId}`);
  }
  return {
    valid: errors.length === 0,
    errors: [...new Set(errors)],
    leaders: parsed.leaders.length,
    sources: parsed.sources.length,
    assessments: parsed.assessments.length,
  };
}
export async function execute(a: Actor, command: Command) {
  return db.$transaction(
    async (tx) => {
      // Serialise editorial writes, including role changes and edition publication.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(87014321)`;
      const current = await tx.wallaceUser.findUnique({ where: { id: a.id } });
      if (!current || current.disabled)
        throw new EditorialError("Account disabled.", 403);
      a = {
        id: current.id,
        name: current.name,
        roles: current.roles as Role[],
      };
      if (command.action === "leader.save") {
        requireRole(a, "write");
        const { id, ...data } = command.data;
        const before = id
          ? await tx.wallaceLeader.findUnique({ where: { id } })
          : null;
        const duplicate = await tx.wallaceLeader.findFirst({
          where: {
            name: { equals: data.name, mode: "insensitive" },
            country: data.country,
            office: data.office,
            ...(id ? { id: { not: id } } : {}),
          },
        });
        if (duplicate)
          throw new EditorialError(
            "A matching leader exists. Review that identity before creating another.",
          );
        const row = id
          ? await tx.wallaceLeader.update({ where: { id }, data })
          : await tx.wallaceLeader.create({ data });
        await audit(tx, a, command.action, row.id, { before, after: row });
        return row;
      }
      if (command.action === "source.create") {
        requireRole(a, "write");
        const { id, ...data } = command.data;
        if (
          command.predecessorId &&
          !(await tx.wallaceSource.findUnique({
            where: { id: command.predecessorId },
          }))
        )
          throw new EditorialError("Original source version not found.");
        const sourceId = id || randomUUID();
        const fingerprint = digest(
          canonicalReference(data.reference) +
            (command.predecessorId ? `|revision:${sourceId}` : ""),
        );
        const row = await tx.wallaceSource.create({
          data: {
            id: sourceId,
            fingerprint,
            predecessorId: command.predecessorId,
            data: json({ ...data, id: sourceId }),
          },
        });
        await audit(tx, a, command.action, row.id, { after: row });
        return row;
      }
      if (command.action === "assessment.save") {
        requireRole(a, "write");
        return saveAssessment(tx, a, command.data);
      }
      if (command.action === "assessment.revise") {
        requireRole(a, "write");
        const old = await assessment(tx, command.id);
        if (!["published", "superseded", "archived"].includes(old.status))
          throw new EditorialError("Only published history can be revised.");
        const row = await tx.wallaceAssessment.create({
          data: {
            leaderId: old.leaderId,
            methodologyId: old.methodologyId,
            version:
              (
                await tx.wallaceAssessment.aggregate({
                  where: { leaderId: old.leaderId },
                  _max: { version: true },
                })
              )._max.version! + 1,
            predecessorId: old.id,
            correctionReason: command.reason,
            periodStart: old.periodStart,
            periodEnd: old.periodEnd,
            context: old.context,
            authorId: a.id,
            reassessOn: old.reassessOn,
            scores: {
              create: old.scores.map(
                ({ dimension, score, rationale, sufficiency }) => ({
                  dimension,
                  score,
                  rationale,
                  sufficiency,
                }),
              ),
            },
            evidence: {
              create: old.evidence.map(
                ({ dimension, sourceId, claim, context, relation }) => ({
                  dimension,
                  sourceId,
                  claim,
                  context,
                  relation,
                }),
              ),
            },
          },
        });
        await audit(tx, a, command.action, row.id, {
          predecessorId: old.id,
          reason: command.reason,
        });
        return row;
      }
      if (
        [
          "assessment.submit",
          "assessment.accept",
          "assessment.reject",
          "assessment.approve",
        ].includes(command.action) &&
        "id" in command &&
        "notes" in command
      ) {
        const before = await assessment(tx, command.id);
        const action = command.action.split(".")[1] as
          "submit" | "accept" | "reject" | "approve";
        if (action !== "reject") await gate(tx, asAssessment(before));
        if (action === "submit" && before.authorId !== a.id)
          throw new EditorialError("Only the draft author may submit.", 403);
        const after = transition(asAssessment(before), action, a);
        const row = await tx.wallaceAssessment.update({
          where: { id: before.id },
          data: {
            status: after.status,
            reviewDecision: after.reviewDecision,
            reviewNotes: command.notes,
            ...(action === "approve" ? { approvedBy: a.id } : {}),
          },
        });
        await tx.wallaceReview.create({
          data: {
            assessmentId: row.id,
            actor: a.id,
            decision: action,
            notes: command.notes,
          },
        });
        await audit(tx, a, command.action, row.id, {
          before: before.status,
          after: row.status,
          notes: command.notes,
        });
        return row;
      }
      if (command.action === "methodology.save") {
        requireRole(a, "write");
        if (command.data.approved)
          throw new EditorialError(
            "Save proposed methodology first; approval is a separate operation.",
          );
        const before = await tx.wallaceMethodology.findUnique({
          where: { id: command.data.id },
        });
        if (before?.approved)
          throw new EditorialError(
            "Approved methodology is immutable. Create a new version.",
          );
        const row = await tx.wallaceMethodology.upsert({
          where: { id: command.data.id },
          create: {
            id: command.data.id,
            version: command.data.version,
            data: json(command.data),
          },
          update: { version: command.data.version, data: json(command.data) },
        });
        await audit(tx, a, command.action, row.id, { before, after: row });
        return row;
      }
      if (command.action === "methodology.approve") {
        requireRole(a, "publish");
        const m = await tx.wallaceMethodology.findUniqueOrThrow({
          where: { id: command.id },
        });
        if (m.approved)
          throw new EditorialError("Methodology already approved.");
        const row = await tx.wallaceMethodology.update({
          where: { id: m.id },
          data: {
            approved: true,
            approvedBy: a.id,
            approvedAt: new Date(),
            data: json({ ...(m.data as object), approved: true }),
          },
        });
        await audit(tx, a, command.action, row.id, { version: row.version });
        return row;
      }
      if (command.action === "edition.publish") {
        requireRole(a, "publish");
        const input = command.data;
        const m = await tx.wallaceMethodology.findUniqueOrThrow({
          where: { id: input.methodologyId },
        });
        if (!m.approved)
          throw new EditorialError("Methodology needs editorial approval.");
        const id = randomUUID();
        const publishedAt = new Date().toISOString();
        const profiles = [];
        for (const aid of input.assessmentIds) {
          const row = await assessment(tx, aid);
          const model = asAssessment(row);
          if (
            !["approved", "published"].includes(row.status) ||
            row.methodologyId !== m.id
          )
            throw new EditorialError(
              "Include approved assessments using the edition methodology.",
            );
          if (row.status === "approved" && row.approvedBy !== a.id)
            throw new EditorialError(
              "The approving publisher must publish this assessment.",
            );
          await gate(tx, model);
          const leader = await tx.wallaceLeader.findUniqueOrThrow({
            where: { id: row.leaderId },
          });
          if (leader.archived)
            throw new EditorialError(
              "An archived leader cannot enter a new edition.",
            );
          const sourceRows = await tx.wallaceSource.findMany({
            where: { id: { in: row.evidence.map((e) => e.sourceId) } },
          });
          const people = await tx.wallaceUser.findMany({
            where: {
              id: {
                in: [
                  row.authorId,
                  row.reviewerId || "",
                  row.approvedBy || a.id,
                ],
              },
            },
          });
          profiles.push(
            publicAssessment(
              model,
              leader as Leader,
              sourceRows.map((s) => s.data as unknown as Source),
              {
                assessor:
                  people.find((u) => u.id === row.authorId)?.name ||
                  "RETHINKK Research",
                reviewer:
                  people.find((u) => u.id === row.reviewerId)?.name ||
                  "RETHINKK Review",
                publisher:
                  people.find((u) => u.id === (row.approvedBy || a.id))?.name ||
                  a.name,
              },
              publishedAt,
            ),
          );
        }
        if (new Set(profiles.map((p) => p.leaderId)).size !== profiles.length)
          throw new EditorialError(
            "An edition may include only one assessment per leader.",
          );
        const snapshot: Edition = {
          id,
          slug: input.slug,
          title: input.title,
          publishedAt,
          releaseNotes: input.releaseNotes,
          methodology: m.data as unknown as Methodology,
          assessments: profiles,
          checksum: "",
        };
        const checksum = digest(snapshot);
        await tx.wallaceEdition.create({
          data: {
            id,
            slug: input.slug,
            title: input.title,
            methodologyId: m.id,
            publishedAt,
            releaseNotes: input.releaseNotes,
            snapshot: json(snapshot),
            checksum,
            assessments: {
              create: profiles.map((p) => ({
                assessmentId: p.id,
                leaderId: p.leaderId,
              })),
            },
          },
        });
        await tx.wallaceAssessment.updateMany({
          where: { id: { in: input.assessmentIds }, status: "approved" },
          data: { status: "published" },
        });
        await audit(tx, a, command.action, id, {
          checksum,
          assessmentIds: input.assessmentIds,
        });
        return { id, checksum };
      }
      if (command.action === "user.save") {
        requireRole(a, "admin");
        if (
          command.data.id === a.id &&
          (command.data.disabled ||
            !command.data.roles.includes("administrator"))
        )
          throw new EditorialError(
            "You cannot remove your own administrator access.",
          );
        const before = await tx.wallaceUser.findUnique({
          where: { id: command.data.id },
        });
        const row = await tx.wallaceUser.upsert({
          where: { id: command.data.id },
          create: command.data,
          update: command.data,
        });
        await audit(tx, a, command.action, row.id, { before, after: row });
        return row;
      }
      if (command.action === "content.save") {
        requireRole(
          a,
          command.data.status === "published" ? "publish" : "write",
        );
        const { id, ...data } = command.data;
        const before = id
          ? await tx.wallaceContent.findUnique({ where: { id } })
          : null;
        if (before?.status === "published")
          throw new EditorialError("Published content needs a new version.");
        const row = id
          ? await tx.wallaceContent.update({
              where: { id },
              data: {
                ...data,
                publishedAt: data.status === "published" ? new Date() : null,
              },
            })
          : await tx.wallaceContent.create({
              data: {
                ...data,
                publishedAt: data.status === "published" ? new Date() : null,
              },
            });
        await audit(tx, a, command.action, row.id, { before, after: row });
        return row;
      }
      if (command.action === "contribution.review") {
        requireRole(a, "review");
        const row = await tx.wallaceContribution.update({
          where: { id: command.id },
          data: { status: command.status },
        });
        await audit(tx, a, command.action, row.id, {
          status: row.status,
          notes: command.notes,
        });
        return { id: row.id };
      }
      if (
        command.action === "import.preview" ||
        command.action === "import.apply"
      ) {
        requireRole(a, "write");
        const result = await previewImport(tx, command.data);
        if (command.action === "import.preview") return result;
        if (!result.valid) throw new EditorialError(result.errors.join(" "));
        for (const l of command.data.leaders)
          await tx.wallaceLeader.create({ data: l });
        for (const s of command.data.sources)
          await tx.wallaceSource.create({
            data: {
              id: s.id,
              fingerprint: digest(canonicalReference(s.reference)),
              data: json(s),
            },
          });
        for (const input of command.data.assessments) {
          const { id: _id, ...newInput } = input;
          await saveAssessment(tx, a, newInput);
        }
        await audit(tx, a, "import.apply", randomUUID(), {
          schemaVersion: 1,
          checksum: digest(command.data),
          result,
        });
        return result;
      }
      throw new EditorialError("Unknown editorial operation.");
    },
    { timeout: 30000, maxWait: 10000 },
  );
}
export async function deskData(a: Actor) {
  const [
    leaders,
    sources,
    methods,
    assessments,
    users,
    editions,
    auditEvents,
    contributions,
    content,
    checks,
  ] = await Promise.all([
    db.wallaceLeader.findMany({ orderBy: { name: "asc" } }),
    db.wallaceSource.findMany({ orderBy: { createdAt: "desc" } }),
    db.wallaceMethodology.findMany(),
    db.wallaceAssessment.findMany({
      include: { scores: true, evidence: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.wallaceUser.findMany({
      select: { id: true, name: true, roles: true, disabled: true },
    }),
    db.wallaceEdition.findMany({
      select: { id: true, title: true, slug: true, publishedAt: true },
    }),
    db.wallaceAuditEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    may(a.roles, "review")
      ? db.wallaceContribution.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
        })
      : Promise.resolve([]),
    db.wallaceContent.findMany(),
    db.wallaceSourceCheck.findMany({
      orderBy: { checkedAt: "desc" },
      take: 100,
    }),
  ]);
  return {
    actor: a,
    leaders,
    sources: sources.map((s) => ({
      ...(s.data as unknown as Source),
      id: s.id,
    })),
    methods: methods.map((m) => ({
      ...(m.data as unknown as Methodology),
      id: m.id,
      approved: m.approved,
    })),
    assessments,
    users,
    editions,
    auditEvents,
    contributions,
    content,
    checks,
  };
}
