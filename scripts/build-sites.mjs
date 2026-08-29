import { cpSync, existsSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "outputs", "rethinkk-site");
const dist = path.join(root, "dist");

if (!existsSync(path.join(source, "index.html"))) {
  throw new Error("Missing RETHINKK source site.");
}

rmSync(dist, { force: true, recursive: true });
mkdirSync(path.join(dist, "client"), { recursive: true });
mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });

cpSync(source, path.join(dist, "client"), { recursive: true });
copyFileSync(path.join(root, "worker", "index.js"), path.join(dist, "server", "index.js"));
copyFileSync(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));

console.log("Built RETHINKK for Sites.");
