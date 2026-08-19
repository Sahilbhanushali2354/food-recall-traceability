import { config } from "dotenv";
config({ path: ".env.development", quiet: true });

const { runQuery, closeDriver } = await import("../src/lib/db.ts");

const [cypher, rawParams] = process.argv.slice(2);

if (!cypher) {
  console.error('Usage: npm run cypher "<cypher>" [\'{"param":"value"}\']');
  process.exit(1);
}

try {
  const params = rawParams ? JSON.parse(rawParams) : {};
  const rows = await runQuery(cypher, params);
  console.log(`${rows.length} row(s)\n`);
  for (const row of rows) console.log(JSON.stringify(row));
} catch (error) {
  console.error("Query failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await closeDriver();
}
