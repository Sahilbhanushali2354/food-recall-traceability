import { config } from "dotenv";
config({ path: ".env.development", quiet: true });

const q = await import("../src/lib/queries.ts");
const { runWrite, closeDriver } = await import("../src/lib/db.ts");

const TEST_NAME = "__test double chocolate bar";
let failures = 0;

const check = (label: string, ok: boolean, detail = "") => {
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${label}${detail ? `  ${detail}` : ""}`);
};

try {
  await runWrite(`MATCH (p:Product {name: $name}) DETACH DELETE p`, { name: TEST_NAME });

  console.log("\ncreateProduct — transaction support");
  const result = await q.createProduct({
    name: TEST_NAME,
    brand: "Test Brand",
    batchCode: "TB-001",
    category: "bar",
    ingredients: [{ name: "cane sugar", quantity: "200 g/kg" }],
    components: [
      { name: "chocolate coating", quantity: "500 g/kg" },
      { name: "oat cluster base", quantity: "300 g/kg" },
    ],
    stores: ["FreshMart Andheri", "MetroFoods T Nagar"],
  });
  check("created", result.created === true, JSON.stringify(result));

  console.log("\nthe new product is immediately traceable");
  const [row] = await q.getProduct(TEST_NAME);
  check("product node exists", !!row, row?.brand);
  check("2 components linked", row?.components.length === 2, row?.components.join(", "));
  check("2 stores linked", row?.stores.filter((s) => s?.name).length === 2);

  const origins = await q.getProductOrigins(TEST_NAME);
  check("traces back to raw ingredients", origins.length > 5, `${origins.length} ingredients`);
  check(
    "reaches peanut oil transitively (via chocolate coating)",
    origins.some((o) => o.ingredient === "peanut oil"),
  );

  const allergens = await q.getProductAllergens(TEST_NAME);
  const names = allergens.map((a) => a.allergen).sort();
  check("inherits allergens through the chain", names.length >= 3, names.join(", "));
  check(
    "peanut flagged as NOT directly declared",
    allergens.find((a) => a.allergen === "peanut")?.isDeclaredDirectly === false,
  );

  console.log("\nthe rest of the graph sees it too");
  const impact = await q.getRecallImpact("RC-2026-001");
  check(
    "appears in the peanut oil recall impact",
    impact.some((r) => r.product === TEST_NAME),
    `${impact.length} affected products`,
  );

  const hidden = await q.getHiddenAllergens("peanut");
  check("appears in hidden-allergen results", hidden.some((r) => r.product === TEST_NAME));

  console.log("\nproductExists guards the API against duplicates");
  check("existing product detected", (await q.productExists(TEST_NAME)) === true);
  check("unknown product not detected", (await q.productExists("__nope")) === false);

  console.log("\nMERGE itself is still idempotent at the query layer");
  const before = await q.listProducts();
  const second = await q.createProduct({
    name: TEST_NAME,
    brand: "Test Brand Renamed",
    batchCode: "TB-002",
    category: "bar",
    ingredients: [{ name: "cane sugar", quantity: "200 g/kg" }],
    components: [{ name: "chocolate coating", quantity: "500 g/kg" }],
    stores: [],
  });
  const after = await q.listProducts();
  check("second submit reports created=false", second.created === false);
  check("product count unchanged", before.length === after.length, `${before.length} → ${after.length}`);
  check(
    "properties updated in place",
    after.find((p) => p.name === TEST_NAME)?.brand === "Test Brand Renamed",
  );

  console.log("\nvalidation rejects unknown names");
  try {
    await q.createProduct({
      name: "__test bad",
      brand: "x",
      batchCode: "x",
      category: "bar",
      ingredients: [{ name: "unobtainium", quantity: "1" }],
      components: [],
      stores: [],
    });
    check("rejects a non-existent ingredient", false, "no error thrown");
  } catch (error) {
    check(
      "rejects a non-existent ingredient",
      error instanceof Error && error.message.includes("unobtainium"),
      error instanceof Error ? error.message : "",
    );
  }
} catch (error) {
  failures++;
  console.error("\nUNCAUGHT:", error instanceof Error ? error.stack : error);
} finally {
  await runWrite(`MATCH (p:Product) WHERE p.name STARTS WITH '__test' DETACH DELETE p`);
  console.log("\ncleaned up test nodes");
  await closeDriver();
}

console.log(failures === 0 ? "\n✅ Write path verified.\n" : `\n❌ ${failures} failed.\n`);
process.exitCode = failures === 0 ? 0 : 1;
