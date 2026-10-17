import { lookup } from "node:dns/promises";
import { request } from "node:https";
import ipaddr from "ipaddr.js";
import { db } from "../lib/wallace-index/db";
import { Source } from "../lib/wallace-index/model";
export async function checkSource(reference: string): Promise<string> {
  let url: URL;
  try {
    url = new URL(reference);
  } catch {
    return "Stable reference: manual verification required";
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (url.port && url.port !== "443")
  )
    return "Manual verification required: HTTPS on the standard port only";
  const addresses = await lookup(url.hostname, { all: true });
  if (
    !addresses.length ||
    addresses.some(
      (a) =>
        !ipaddr.isValid(a.address) ||
        ipaddr.parse(a.address).range() !== "unicast",
    )
  )
    return "Blocked: non-public network destination";
  const target = addresses[0];
  return new Promise((resolve) => {
    const req = request(
      url,
      {
        method: "HEAD",
        family: target.family,
        lookup: (_hostname, _options, callback) =>
          callback(null, target.address, target.family),
        headers: { "User-Agent": "RETHINKK source maintenance" },
      },
      (res) => {
        res.resume();
        resolve(
          res.statusCode && res.statusCode >= 300 && res.statusCode < 400
            ? `HTTP ${res.statusCode}: redirect requires manual review`
            : `HTTP ${res.statusCode}`,
        );
      },
    );
    req.setTimeout(5000, () => {
      req.destroy();
      resolve("Timed out: manual verification required");
    });
    req.on("error", () =>
      resolve("Connection failed: manual verification required"),
    );
    req.end();
  });
}
if (process.argv[1]?.endsWith("wallace-maintenance.ts")) {
  try {
    const sources = await db.wallaceSource.findMany();
    for (const row of sources) {
      const source = row.data as unknown as Source;
      let result: string;
      try {
        result = await checkSource(source.reference);
      } catch {
        result = "DNS lookup failed: manual verification required";
      }
      await db.wallaceSourceCheck.create({
        data: { sourceId: row.id, result },
      });
    }
    const due = await db.wallaceAssessment.findMany({
      where: {
        status: "published",
        reassessOn: { lte: new Date().toISOString().slice(0, 10) },
      },
      select: { id: true, leaderId: true, reassessOn: true },
    });
    await db.wallaceAuditEvent.create({
      data: {
        actor: "maintenance-scheduler",
        action: "maintenance.run",
        reference: new Date().toISOString().slice(0, 10),
        metadata: { sourcesChecked: sources.length, reassessmentsDue: due },
      },
    });
    console.log(
      `${sources.length} source checks completed; ${due.length} reassessments due. See the research desk.`,
    );
  } finally {
    await db.$disconnect();
  }
}
