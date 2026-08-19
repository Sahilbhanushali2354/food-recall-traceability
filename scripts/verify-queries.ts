import { config } from "dotenv";
config({ path: ".env.development", quiet: true });

const q = await import("../src/lib/queries.ts");
const { closeDriver } = await import("../src/lib/db.ts");

let failures = 0;

function check(label: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ✓ ${label}${detail ? `  ${detail}` : ""}`);
  } else {
    failures++;
    console.log(`  ✗ ${label}${detail ? `  ${detail}` : ""}`);
  }
}

function heading(text: string) {
  console.log(`\n${text}`);
}

try {

  heading("listRecalls()");
  const recalls = await q.listRecalls();
  check("returns all 6 recalls", recalls.length === 6, `got ${recalls.length}`);
  check("sorted critical first", recalls[0]?.severity === "critical", recalls[0]?.id);
  check("sorted moderate last", recalls.at(-1)?.severity === "moderate", recalls.at(-1)?.id);
  const lecithin = recalls.find((r) => r.id === "RC-2026-002");
  check(
    "soy lecithin recall has the widest reach",
    (lecithin?.productCount ?? 0) > 10,
    `${lecithin?.productCount} products / ${lecithin?.storeCount} stores`,
  );
  for (const r of recalls) {
    console.log(
      `      ${r.severity.padEnd(9)} ${r.id}  ${String(r.productCount).padStart(2)} products  ` +
        `${String(r.storeCount).padStart(2)} stores  via ${r.ingredients.join(", ")}`,
    );
  }

  heading("getRecallImpact('RC-2026-001')  — the aflatoxin / peanut oil recall");
  const impact = await q.getRecallImpact("RC-2026-001");
  check("returns affected products", impact.length > 0, `${impact.length} rows`);
  check(
    "includes the intermediate 'chocolate coating' (no store, still quarantined)",
    impact.some((r) => r.product === "chocolate coating" && r.storeCount === 0),
  );
  const hamper = impact.find((r) => r.product === "family hamper");
  check("reaches 'family hamper' at 4 hops", hamper?.hops === 4, `hops=${hamper?.hops}`);
  check(
    "chain starts at the recalled ingredient",
    hamper?.chain[0] === "peanut oil",
    hamper?.chain.join(" → "),
  );
  check(
    "every row's chain length matches its hop count",
    impact.every((r) => r.chain.length === r.hops + 1),
  );
  console.log(`      deepest chain: ${hamper?.chain.join(" → ")}`);
  console.log(`      products on shelves: ${impact.filter((r) => r.storeCount > 0).length}`);

  heading("getHiddenAllergens('peanut')  — the showcase");
  const hiddenPeanut = await q.getHiddenAllergens("peanut");
  check("finds hidden-peanut products", hiddenPeanut.length > 0, `${hiddenPeanut.length} rows`);
  check(
    "EXCLUDES products that declare peanut directly",
    !hiddenPeanut.some((r) =>
      ["chocolate coating", "peanut butter filling", "spiced snack mix"].includes(r.product),
    ),
    "(chocolate coating / peanut butter filling / spiced snack mix)",
  );
  check(
    "includes 'chocolate digestive biscuit' — the label-risk case",
    hiddenPeanut.some((r) => r.product === "chocolate digestive biscuit"),
  );
  check("every row is at least 2 hops deep", hiddenPeanut.every((r) => r.depth >= 2));
  for (const r of hiddenPeanut.slice(0, 6)) {
    console.log(`      ${r.depth} hops  ${r.product.padEnd(30)} ${r.chain.join(" → ")}`);
  }

  heading("getHiddenAllergens('sesame') and ('soy')");
  const hiddenSesame = await q.getHiddenAllergens("sesame");
  const hiddenSoy = await q.getHiddenAllergens("soy");
  check("sesame has hidden reach", hiddenSesame.length > 0, `${hiddenSesame.length} rows`);
  check("soy has hidden reach", hiddenSoy.length > 0, `${hiddenSoy.length} rows`);
  console.log(`      sesame deepest: ${hiddenSesame[0]?.chain.join(" → ")}`);
  console.log(`      soy deepest:    ${hiddenSoy[0]?.chain.join(" → ")}`);

  heading("getProduct / getProductOrigins / getProductAllergens");
  const [product] = await q.getProduct("chocolate digestive biscuit");
  check("product found", !!product, product?.brand);
  check("has stores", (product?.stores.length ?? 0) === 7, `${product?.stores.length} stores`);
  check(
    "components are its two intermediates",
    product?.components.sort().join(", ") === "biscuit base, chocolate coating",
    product?.components.join(", "),
  );

  const origins = await q.getProductOrigins("chocolate digestive biscuit");
  check("traces back to raw ingredients", origins.length === 12, `${origins.length} ingredients`);
  check(
    "peanut oil traced with its supplier",
    origins.find((o) => o.ingredient === "peanut oil")?.suppliers[0] === "Gujarat Peanut Co",
  );
  check(
    "supplier batch codes carried through",
    (origins.find((o) => o.ingredient === "peanut oil")?.batches.length ?? 0) === 2,
  );

  const prodAllergens = await q.getProductAllergens("chocolate digestive biscuit");
  check("allergens detected", prodAllergens.length > 0, prodAllergens.map((a) => a.allergen).join(", "));
  const peanutOnBiscuit = prodAllergens.find((a) => a.allergen === "peanut");
  check(
    "peanut flagged as NOT directly declared",
    peanutOnBiscuit?.isDeclaredDirectly === false,
    `minDepth=${peanutOnBiscuit?.minDepth}`,
  );
  const glutenOnBiscuit = prodAllergens.find((a) => a.allergen === "gluten");
  check(
    "gluten also indirect (via biscuit base)",
    glutenOnBiscuit?.minDepth === 2,
    `minDepth=${glutenOnBiscuit?.minDepth}`,
  );

  heading("getSupplierReach / getTraceToStore (spec 4.2, 4.4)");
  const reach = await q.getSupplierReach("Gujarat Peanut Co");
  check("supplier reaches products", reach.length > 0, `${reach.length} rows`);
  check("top row is the most widely stocked", (reach[0]?.storeCount ?? 0) > 0, reach[0]?.product);

  const trace = await q.getTraceToStore("Gujarat Peanut Co", "FreshMart Andheri");
  check("shortest path found", trace.length > 0, `${trace.length} distinct paths`);
  check(
    "path starts at the supplier and ends at the store",
    trace[0]?.chain[0] === "Gujarat Peanut Co" &&
      trace[0]?.chain.at(-1) === "FreshMart Andheri",
  );
  for (const t of trace) console.log(`      ${t.hops} hops: ${t.chain.join(" → ")}`);

  heading("getSupplierConcentration / getCriticalIngredients (spec 4.5, 4.6)");
  const concentration = await q.getSupplierConcentration();
  check("all 12 suppliers ranked", concentration.length === 12, `got ${concentration.length}`);
  check(
    "counts are plausible (top supplier does not exceed 28 products)",
    (concentration[0]?.productsAffected ?? 0) <= 28,
    `${concentration[0]?.supplier}: ${concentration[0]?.productsAffected} products`,
  );
  for (const c of concentration.slice(0, 5)) {
    console.log(
      `      ${c.supplier.padEnd(26)} ${String(c.productsAffected).padStart(2)} products  ` +
        `${String(c.storesAffected).padStart(2)} stores  (${c.country})`,
    );
  }

  const critical = await q.getCriticalIngredients();
  check("returns 10 ingredients", critical.length === 10, `got ${critical.length}`);
  check("sorted by reach descending", critical[0].productCount >= critical.at(-1)!.productCount);
  for (const c of critical.slice(0, 5)) {
    console.log(
      `      ${c.ingredient.padEnd(26)} ${String(c.productCount).padStart(2)} products  ` +
        `${String(c.storeCount).padStart(2)} stores`,
    );
  }

  heading("search()");
  const found = await q.search("peanut");
  check("finds peanut things", found.length > 0, `${found.length} results`);
  check("spans multiple node types", new Set(found.map((f) => f.type)).size > 1);

  const injection = await q.search(`") RETURN 1 //`);
  check(
    "injection attempt is treated as a harmless string",
    injection.length === 0,
    "returned 0 rows, no error",
  );

  const allergenList = await q.listAllergens();
  check("6 allergens listed", allergenList.length === 6, `got ${allergenList.length}`);
  const storeList = await q.listStores();
  check("20 stores listed", storeList.length === 20, `got ${storeList.length}`);
  const supplierList = await q.listSuppliers();
  check("12 suppliers listed", supplierList.length === 12, `got ${supplierList.length}`);
} catch (error) {
  failures++;
  console.error("\nUNCAUGHT:", error instanceof Error ? error.stack : error);
} finally {
  await closeDriver();
}

console.log(
  failures === 0
    ? "\n✅ All query checks passed.\n"
    : `\n❌ ${failures} check(s) failed.\n`,
);
process.exitCode = failures === 0 ? 0 : 1;
