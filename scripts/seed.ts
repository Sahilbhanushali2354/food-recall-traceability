import { config } from "dotenv";
config({ path: ".env.development", quiet: true });

const { runWrite, runQuery, closeDriver, getDriver } = await import("../src/lib/db.ts");
const { allergens, stores, ingredients, suppliers, products, recalls } = await import(
  "./seed-data.ts"
);

const wantsFresh = process.argv.includes("--fresh");

async function step(label: string, work: () => Promise<unknown>) {
  const started = process.hrtime.bigint();
  await work();
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  console.log(`  ✓ ${label.padEnd(46)} ${ms.toFixed(0)}ms`);
}

console.log("\nSeeding Food Recall Traceability graph\n");

await getDriver().verifyConnectivity();

if (wantsFresh) {
  console.log("--fresh: removing existing nodes for this app's labels\n");
  for (const label of ["Supplier", "Ingredient", "Product", "Store", "Recall", "Allergen"]) {
    await step(`delete :${label}`, () =>

      runWrite(`MATCH (n:${label}) DETACH DELETE n`),
    );
  }
  console.log("");
}

const uniqueKeys: Array<[label: string, property: string]> = [
  ["Supplier", "name"],
  ["Ingredient", "name"],
  ["Product", "name"],
  ["Store", "name"],
  ["Recall", "id"],
  ["Allergen", "name"],
];

for (const [label, property] of uniqueKeys) {
  await step(`constraint ${label}.${property} IS UNIQUE`, () =>
    runWrite(
      `CREATE CONSTRAINT ${label.toLowerCase()}_${property}_unique IF NOT EXISTS
       FOR (n:${label}) REQUIRE n.${property} IS UNIQUE`,
    ),
  );
}
console.log("");

await step(`${allergens.length} allergens`, () =>
  runWrite(
    `UNWIND $rows AS row
     MERGE (a:Allergen {name: row.name})`,
    { rows: allergens },
  ),
);

await step(`${stores.length} stores`, () =>
  runWrite(
    `UNWIND $rows AS row
     MERGE (s:Store {name: row.name})
     SET s.chain = row.chain, s.city = row.city`,
    { rows: stores },
  ),
);

await step(`${ingredients.length} ingredients`, () =>
  runWrite(
    `UNWIND $rows AS row
     MERGE (i:Ingredient {name: row.name})
     SET i.category = row.category`,
    { rows: ingredients },
  ),
);

await step(`${suppliers.length} suppliers`, () =>
  runWrite(
    `UNWIND $rows AS row
     MERGE (s:Supplier {name: row.name})
     SET s.country = row.country, s.certification = row.certification`,
    { rows: suppliers },
  ),
);

await step(`${products.length} products`, () =>
  runWrite(
    `UNWIND $rows AS row
     MERGE (p:Product {name: row.name})
     SET p.brand = row.brand, p.batchCode = row.batchCode, p.category = row.category`,
    { rows: products },
  ),
);

await step(`${recalls.length} recalls`, () =>
  runWrite(
    `UNWIND $rows AS row
     MERGE (r:Recall {id: row.id})
     SET r.reason = row.reason, r.severity = row.severity, r.issuedAt = row.issuedAt`,
    { rows: recalls },
  ),
);

console.log("");

const allergenLinks = ingredients.flatMap((i) =>
  i.allergens.map((allergen) => ({ ingredient: i.name, allergen })),
);
await step(`${allergenLinks.length} CONTAINS_ALLERGEN`, () =>
  runWrite(
    `UNWIND $rows AS row
     MATCH (i:Ingredient {name: row.ingredient})
     MATCH (a:Allergen   {name: row.allergen})
     MERGE (i)-[:CONTAINS_ALLERGEN]->(a)`,
    { rows: allergenLinks },
  ),
);

const supplyLinks = suppliers.flatMap((s) =>
  s.supplies.map((row) => ({ supplier: s.name, ...row })),
);
await step(`${supplyLinks.length} SUPPLIES`, () =>
  runWrite(
    `UNWIND $rows AS row
     MATCH (s:Supplier   {name: row.supplier})
     MATCH (i:Ingredient {name: row.ingredient})
     MERGE (s)-[r:SUPPLIES {batchCode: row.batchCode}]->(i)
     SET r.suppliedOn = row.suppliedOn`,
    { rows: supplyLinks },
  ),
);

const ingredientUsage = products.flatMap((p) =>
  Object.entries(p.fromIngredients ?? {}).map(([ingredient, quantity]) => ({
    ingredient,
    product: p.name,
    quantity,
  })),
);
await step(`${ingredientUsage.length} USED_IN (ingredient → product)`, () =>
  runWrite(
    `UNWIND $rows AS row
     MATCH (i:Ingredient {name: row.ingredient})
     MATCH (p:Product    {name: row.product})
     MERGE (i)-[r:USED_IN]->(p)
     SET r.quantity = row.quantity`,
    { rows: ingredientUsage },
  ),
);

const productUsage = products.flatMap((p) =>
  Object.entries(p.fromProducts ?? {}).map(([component, quantity]) => ({
    component,
    product: p.name,
    quantity,
  })),
);
await step(`${productUsage.length} USED_IN (product → product)`, () =>
  runWrite(
    `UNWIND $rows AS row
     MATCH (c:Product {name: row.component})
     MATCH (p:Product {name: row.product})
     MERGE (c)-[r:USED_IN]->(p)
     SET r.quantity = row.quantity`,
    { rows: productUsage },
  ),
);

const soldAtLinks = products.flatMap((p) =>
  (p.soldAt ?? []).map((row) => ({ product: p.name, ...row })),
);
await step(`${soldAtLinks.length} SOLD_AT`, () =>
  runWrite(
    `UNWIND $rows AS row
     MATCH (p:Product {name: row.product})
     MATCH (s:Store   {name: row.store})
     MERGE (p)-[r:SOLD_AT]->(s)
     SET r.since = row.since`,
    { rows: soldAtLinks },
  ),
);

const recallLinks = recalls.flatMap((r) =>
  r.affects.map((row) => ({ recall: r.id, ...row })),
);
await step(`${recallLinks.length} AFFECTS`, () =>
  runWrite(
    `UNWIND $rows AS row
     MATCH (rc:Recall     {id: row.recall})
     MATCH (i:Ingredient  {name: row.ingredient})
     MERGE (rc)-[r:AFFECTS]->(i)
     SET r.affectedBatches = row.affectedBatches`,
    { rows: recallLinks },
  ),
);

console.log("\nVerifying graph shape\n");

const nodeCounts = await runQuery<{ label: string; count: number }>(
  `MATCH (n) UNWIND labels(n) AS label
   RETURN label, count(*) AS count ORDER BY label`,
);
console.log("  Nodes:", nodeCounts.map((r) => `${r.label}=${r.count}`).join("  "));

const relCounts = await runQuery<{ type: string; count: number }>(
  `MATCH ()-[r]->() RETURN type(r) AS type, count(*) AS count ORDER BY type`,
);
console.log("  Edges:", relCounts.map((r) => `${r.type}=${r.count}`).join("  "));

const deepest = await runQuery<{ hops: number; chain: string[] }>(
  `MATCH path = (sup:Supplier {name: $supplier})-[:SUPPLIES]->(:Ingredient)
                -[:USED_IN*1..6]->(:Product)-[:SOLD_AT]->(:Store)
   RETURN length(path) AS hops, [n IN nodes(path) | n.name] AS chain
   ORDER BY hops DESC LIMIT 1`,
  { supplier: "Gujarat Peanut Co" },
);

if (deepest.length === 0) {
  console.error("\n  ✗ FAIL: no supplier → store chain found. The graph is broken.");
  process.exitCode = 1;
} else {
  const { hops, chain } = deepest[0];
  console.log(`\n  Longest chain from Gujarat Peanut Co (${hops} hops):`);
  console.log(`    ${chain.join("\n      → ")}`);
  if (hops < 4) {
    console.error("\n  ✗ FAIL: deepest chain is under 4 hops — the demo will look trivial.");
    process.exitCode = 1;
  }
}

const hidden = await runQuery<{ product: string; depth: number }>(
  `MATCH path = (a:Allergen {name: $allergen})<-[:CONTAINS_ALLERGEN]-(:Ingredient)
                -[:USED_IN*2..6]->(p:Product)
   RETURN p.name AS product, length(path) AS depth
   ORDER BY depth DESC LIMIT 5`,
  { allergen: "peanut" },
);
console.log(`\n  Hidden peanut (2+ hops deep) reaches ${hidden.length > 0 ? "" : "NOTHING — "}`);
for (const row of hidden) console.log(`    ${row.product} (${row.depth} hops)`);
if (hidden.length === 0) {
  console.error("  ✗ FAIL: the hidden-allergen showcase query returns nothing.");
  process.exitCode = 1;
}

console.log(process.exitCode ? "\nSeed completed WITH FAILURES.\n" : "\n✅ Seed complete.\n");

await closeDriver();
