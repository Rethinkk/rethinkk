import { db } from "./db";
export async function researchBackup() {
  return db.$transaction(
    async (tx) => ({
      users: await tx.wallaceUser.findMany(),
      leaders: await tx.wallaceLeader.findMany(),
      methodologies: await tx.wallaceMethodology.findMany(),
      sources: await tx.wallaceSource.findMany({
        orderBy: { createdAt: "asc" },
      }),
      assessments: await tx.wallaceAssessment.findMany({
        include: { scores: true, evidence: true },
        orderBy: { version: "asc" },
      }),
      editions: await tx.wallaceEdition.findMany({
        include: { assessments: true },
        orderBy: { publishedAt: "asc" },
      }),
      reviews: await tx.wallaceReview.findMany(),
      content: await tx.wallaceContent.findMany(),
      auditEvents: await tx.wallaceAuditEvent.findMany(),
      sourceChecks: await tx.wallaceSourceCheck.findMany(),
    }),
    { isolationLevel: "RepeatableRead" },
  );
}
