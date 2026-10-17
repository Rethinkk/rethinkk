import { writeFile } from "node:fs/promises";
import { db } from "../lib/wallace-index/db";
import { researchBackup } from "../lib/wallace-index/backup";
import { digest } from "../lib/wallace-index/editorial";
const filename = process.argv[2];
if (!filename) throw Error("Supply a private output JSON filename.");
try {
  const data = await researchBackup();
  await writeFile(
    filename,
    JSON.stringify(
      {
        schemaVersion: 1,
        kind: "private-research-backup",
        checksum: digest(data),
        exportedAt: new Date().toISOString(),
        data,
      },
      null,
      2,
    ),
    { mode: 0o600, flag: "wx" },
  );
  console.log(
    "Private research backup written. Visitor data and contribution contact details are excluded; use provider backups for complete database recovery.",
  );
} finally {
  await db.$disconnect();
}
