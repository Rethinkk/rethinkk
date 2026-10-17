import EmbeddedPostgres from "embedded-postgres";
const postgres = new EmbeddedPostgres({
  databaseDir: "/tmp/rethinkk-wallace-pg",
  user: "wallace_test",
  password: "local-test-only",
  port: 55432,
  persistent: true,
});
await postgres.initialise();
await postgres.start();
const client = postgres.getPgClient();
await client.connect();
const rows = await client.query(
  "SELECT datname FROM pg_database WHERE datname='wallace_test'",
);
await client.end();
if (!rows.rowCount) await postgres.createDatabase("wallace_test");
console.log(
  "Temporary local PostgreSQL ready on port 55432. No managed or production database is connected.",
);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, async () => {
    await postgres.stop();
    process.exit(0);
  });
await new Promise(() => {});
