import { config } from "dotenv";
config({ path: ".env.development", quiet: true });

const { getDriver, runQuery, runWrite, closeDriver } = await import("../src/lib/db.ts");

type Probe = { label: string; cypher: string; write?: boolean };

const probes: Probe[] = [
  { label: "basic RETURN", cypher: "RETURN 1 AS ok" },
  { label: "variable-length path  -[*1..3]->", cypher: "MATCH p = ()-[*1..3]->() RETURN count(p) AS n" },
  { label: "shortestPath()", cypher: "MATCH (a),(b) WITH a,b LIMIT 1 MATCH p = shortestPath((a)-[*1..5]->(b)) RETURN count(p) AS n" },
  { label: "nodes()/length() on path", cypher: "MATCH p = ()-[*1..2]->() RETURN [n IN nodes(p) | n.name] AS c, length(p) AS l LIMIT 1" },
  { label: "coalesce()", cypher: "RETURN coalesce(null, 'fallback') AS v" },
  { label: "collect(DISTINCT …)", cypher: "MATCH (n) RETURN collect(DISTINCT labels(n)) AS v" },
  { label: "toLower() / CONTAINS", cypher: "RETURN toLower('AbC') CONTAINS 'b' AS v" },
  { label: "SHOW CONSTRAINTS", cypher: "SHOW CONSTRAINTS" },
  { label: "MERGE (write)", cypher: "MERGE (t:__ProbeTemp {id: $id}) RETURN t.id AS id", write: true },
  { label: "unique constraint syntax", cypher: "CREATE CONSTRAINT probe_unique IF NOT EXISTS FOR (t:__ProbeTemp) REQUIRE t.id IS UNIQUE", write: true },
  { label: "index syntax", cypher: "CREATE INDEX probe_index IF NOT EXISTS FOR (t:__ProbeTemp) ON (t.id)", write: true },
];

try {
  await getDriver().verifyConnectivity();
  console.log("✅ Connected to", process.env.NEO4J_URI, "\n");

  for (const probe of probes) {
    try {
      const rows = probe.write
        ? await runWrite(probe.cypher, { id: "probe" })
        : await runQuery(probe.cypher, { id: "probe" });
      const preview = JSON.stringify(rows.slice(0, 2));
      console.log(`  ✅ ${probe.label.padEnd(28)} ${preview.length > 90 ? preview.slice(0, 90) + "…" : preview}`);
    } catch (error) {
      console.log(`  ❌ ${probe.label.padEnd(28)} ${error instanceof Error ? error.message.split("\n")[0] : error}`);
    }
  }

  await runWrite("MATCH (t:__ProbeTemp) DETACH DELETE t");
  for (const name of ["probe_unique", "probe_index"]) {
    try {
      await runWrite(`DROP CONSTRAINT ${name} IF EXISTS`);
    } catch {
    }
    try {
      await runWrite(`DROP INDEX ${name} IF EXISTS`);
    } catch {
    }
  }

  const counts = await runQuery<{ labels: string[]; count: number }>(
    "MATCH (n) RETURN labels(n) AS labels, count(*) AS count ORDER BY count DESC",
  );
  console.log(
    "\n" +
      (counts.length === 0
        ? "Graph is empty — run `npm run seed` next."
        : `Existing data: ${counts.map((c) => `${c.labels.join(":")}=${c.count}`).join(", ")}`),
  );
} catch (error) {
  console.error("❌ Could not connect.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await closeDriver();
}
