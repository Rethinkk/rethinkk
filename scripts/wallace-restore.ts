import { readFile } from "node:fs/promises";
import { db } from "../lib/wallace-index/db";
import { researchBackup } from "../lib/wallace-index/backup";
import { digest } from "../lib/wallace-index/editorial";
type Backup = Awaited<ReturnType<typeof researchBackup>>;
const [filename, confirmation] = process.argv.slice(2);
if (!filename || confirmation !== "--empty-database-only")
  throw Error(
    "Usage: tsx scripts/wallace-restore.ts backup.json --empty-database-only",
  );
try {
  const input = JSON.parse(await readFile(filename, "utf8")) as {
    schemaVersion: number;
    kind: string;
    checksum: string;
    data: Backup;
  };
  if (
    input.schemaVersion !== 1 ||
    input.kind !== "private-research-backup" ||
    digest(input.data) !== input.checksum
  )
    throw Error("Unsupported or damaged backup.");
  const d = input.data;
  for (const e of d.editions)
    if (digest(e.snapshot) !== e.checksum)
      throw Error(`Edition checksum mismatch: ${e.slug}`);
  await db.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(87014321)`;
      if (
        (
          await Promise.all([
            tx.wallaceUser.count(),
            tx.wallaceLeader.count(),
            tx.wallaceSource.count(),
            tx.wallaceAssessment.count(),
            tx.wallaceEdition.count(),
            tx.wallaceAuditEvent.count(),
            tx.wallaceMethodology.count(),
            tx.wallaceContent.count(),
            tx.wallaceContribution.count(),
          ])
        ).some(Boolean)
      )
        throw Error(
          "Restore requires an empty, migrated database. Existing data will not be overwritten.",
        );
      for (const u of d.users) await tx.wallaceUser.create({ data: u });
      for (const l of d.leaders) await tx.wallaceLeader.create({ data: l });
      for (const m of d.methodologies)
        await tx.wallaceMethodology.create({
          data: { ...m, data: JSON.parse(JSON.stringify(m.data)) },
        });
      for (const s of d.sources)
        await tx.wallaceSource.create({
          data: { ...s, data: JSON.parse(JSON.stringify(s.data)) },
        });
      for (const a of d.assessments) {
        const { scores, evidence, status, ...record } = a;
        await tx.wallaceAssessment.create({
          data: { ...record, status: "draft" },
        });
        if (scores.length)
          await tx.wallaceDimensionScore.createMany({ data: scores });
        if (evidence.length)
          await tx.wallaceEvidence.createMany({ data: evidence });
        if (status !== "draft")
          await tx.wallaceAssessment.update({
            where: { id: a.id },
            data: { status },
          });
      }
      for (const e of d.editions) {
        const { assessments, ...record } = e;
        await tx.wallaceEdition.create({
          data: {
            ...record,
            snapshot: JSON.parse(JSON.stringify(record.snapshot)),
          },
        });
        await tx.wallaceEditionAssessment.createMany({ data: assessments });
      }
      for (const r of d.reviews) await tx.wallaceReview.create({ data: r });
      for (const c of d.content) await tx.wallaceContent.create({ data: c });
      for (const e of d.auditEvents)
        await tx.wallaceAuditEvent.create({
          data: { ...e, metadata: JSON.parse(JSON.stringify(e.metadata)) },
        });
      for (const c of d.sourceChecks)
        await tx.wallaceSourceCheck.create({ data: c });
      await tx.wallaceAuditEvent.create({
        data: {
          actor: "recovery-operator",
          action: "system.restore",
          reference: input.checksum,
          metadata: { schemaVersion: 1, editionCount: d.editions.length },
        },
      });
    },
    { timeout: 120000 },
  );
  console.log(
    "Research data restored; edition checksums verified. Recheck authorised users and environment isolation before serving traffic.",
  );
} finally {
  await db.$disconnect();
}
