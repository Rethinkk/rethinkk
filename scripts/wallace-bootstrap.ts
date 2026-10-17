import { db } from "../lib/wallace-index/db";
import { proposedMethodology } from "../lib/wallace-index/methodology";
const [githubId, name] = process.argv.slice(2);
if (!githubId || !/^\d+$/.test(githubId) || !name)
  throw Error(
    'Usage: pnpm wallace:bootstrap NUMERIC_GITHUB_ACCOUNT_ID "Editorial name"',
  );
try {
  const id = `github:${githubId}`;
  if (await db.wallaceUser.count())
    throw Error(
      "Bootstrap is only for an empty user table. Use the authorised administrator desk afterwards.",
    );
  await db.$transaction(async (tx) => {
    await tx.wallaceUser.create({
      data: { id, name, roles: ["administrator"] },
    });
    await tx.wallaceMethodology.create({
      data: {
        id: proposedMethodology.id,
        version: proposedMethodology.version,
        data: JSON.parse(JSON.stringify(proposedMethodology)),
      },
    });
    await tx.wallaceAuditEvent.create({
      data: {
        actor: id,
        action: "system.bootstrap",
        reference: id,
        metadata: { methodologyApproved: false },
      },
    });
  });
  console.log(
    "Administrator provisioned. Assign research, reviewer and publisher roles through the desk; no methodology or scores were approved.",
  );
} finally {
  await db.$disconnect();
}
