import { runQuery, runInTransaction } from "./db.ts";

import type {
  RecallSummary,
  RecallImpactRow,
  HiddenAllergenRow,
  ProductSummary,
  ProductOriginRow,
  ProductAllergenRow,
  SupplierOption,
  SupplierReachRow,
  SupplierRiskRow,
  StoreOption,
  CriticalIngredientRow,
  TraceRoute,
  SearchResult,
  AllergenListItem,
  ProductListRow,
  IngredientOption,
  CreateProductInput,
  CreateProductResult,
  CreateIngredientInput,
  CreateIngredientResult,
} from "@/types";

const SEVERITY_RANK = `CASE r.severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 ELSE 2 END`;

export function listRecalls(): Promise<RecallSummary[]> {
  return runQuery<RecallSummary>(
    `MATCH (r:Recall)-[a:AFFECTS]->(ing:Ingredient)
     OPTIONAL MATCH (ing)-[:USED_IN*1..6]->(p:Product)
     OPTIONAL MATCH (p)-[:SOLD_AT]->(s:Store)
     RETURN r.id                          AS id,
            r.reason                      AS reason,
            r.severity                    AS severity,
            r.issuedAt                    AS issuedAt,
            collect(DISTINCT ing.name)    AS ingredients,
            collect(DISTINCT a.affectedBatches) AS affectedBatches,
            count(DISTINCT p)             AS productCount,
            count(DISTINCT s)             AS storeCount
     ORDER BY ${SEVERITY_RANK}, r.issuedAt DESC`,
  );
}

export function getRecallImpact(recallId: string): Promise<RecallImpactRow[]> {
  return runQuery<RecallImpactRow>(

    `MATCH (r:Recall {id: $recallId})-[a:AFFECTS]->(ing:Ingredient)
     MATCH path = (ing)-[:USED_IN*1..6]->(p:Product)
     WITH r, a, ing, p, path, length(path) AS hops
     ORDER BY hops ASC
     WITH r, a, ing, p,
          min(hops)                                       AS hops,
          head(collect([n IN nodes(path) | n.name]))      AS chain
     OPTIONAL MATCH (p)-[:SOLD_AT]->(s:Store)
     RETURN r.severity              AS severity,
            r.reason                AS reason,
            r.issuedAt              AS issuedAt,
            ing.name                AS ingredient,
            a.affectedBatches       AS affectedBatches,
            p.name                  AS product,
            p.brand                 AS brand,
            p.category              AS category,
            p.batchCode             AS batchCode,
            hops,
            chain,
            collect(DISTINCT s.name)  AS stores,
            collect(DISTINCT s.chain) AS storeChains,
            count(DISTINCT s)         AS storeCount
     ORDER BY hops ASC, product ASC`,
    { recallId },
  );
}

export function listAllergens(): Promise<AllergenListItem[]> {
  return runQuery<AllergenListItem>(
    `MATCH (a:Allergen)
     OPTIONAL MATCH (a)<-[:CONTAINS_ALLERGEN]-(i:Ingredient)
     RETURN a.name AS name, count(DISTINCT i) AS ingredientCount
     ORDER BY name`,
  );
}

export function getHiddenAllergens(allergen: string): Promise<HiddenAllergenRow[]> {
  return runQuery<HiddenAllergenRow>(
    `MATCH (a:Allergen {name: $allergen})
     OPTIONAL MATCH (a)<-[:CONTAINS_ALLERGEN]-(:Ingredient)-[:USED_IN]->(direct:Product)
     WITH a, collect(DISTINCT direct.name) AS declaredIn

     MATCH (a)<-[:CONTAINS_ALLERGEN]-(ing:Ingredient)
     MATCH path = (ing)-[:USED_IN*2..6]->(p:Product)
     WHERE NOT p.name IN declaredIn
     WITH ing, p, path, length(path) AS depth
     ORDER BY depth ASC
     WITH ing, p,
          min(depth)                                 AS depth,
          head(collect([n IN nodes(path) | n.name])) AS chain
     OPTIONAL MATCH (p)-[:SOLD_AT]->(s:Store)
     RETURN p.name    AS product,
            p.brand   AS brand,
            p.category AS category,
            ing.name  AS sourceIngredient,
            depth,
            chain,
            collect(DISTINCT s.name) AS stores,
            count(DISTINCT s)        AS storeCount
     ORDER BY depth DESC, product ASC`,
    { allergen },
  );
}

export function getProduct(name: string): Promise<ProductSummary[]> {
  return runQuery<ProductSummary>(
    `MATCH (p:Product {name: $name})
     OPTIONAL MATCH (p)-[so:SOLD_AT]->(s:Store)
     WITH p, collect(DISTINCT {name: s.name, chain: s.chain, city: s.city, since: so.since}) AS storeRows
     OPTIONAL MATCH (c:Product)-[:USED_IN]->(p)
     RETURN p.name      AS name,
            p.brand     AS brand,
            p.batchCode AS batchCode,
            p.category  AS category,
            storeRows   AS stores,
            collect(DISTINCT c.name) AS components`,
    { name },
  );
}

export function getProductOrigins(name: string): Promise<ProductOriginRow[]> {
  return runQuery<ProductOriginRow>(
    `MATCH path = (ing:Ingredient)-[:USED_IN*1..6]->(p:Product {name: $name})
     WITH ing, path, length(path) AS depth
     ORDER BY depth ASC
     WITH ing,
          min(depth)                                 AS depth,
          head(collect([n IN nodes(path) | n.name])) AS chain
     OPTIONAL MATCH (sup:Supplier)-[sp:SUPPLIES]->(ing)
     RETURN ing.name     AS ingredient,
            ing.category AS category,
            depth,
            chain,
            collect(DISTINCT sup.name)   AS suppliers,
            collect(DISTINCT sp.batchCode) AS batches
     ORDER BY depth ASC, ingredient ASC`,
    { name },
  );
}

export function getProductAllergens(name: string): Promise<ProductAllergenRow[]> {
  return runQuery<ProductAllergenRow>(
    `MATCH path = (ing:Ingredient)-[:USED_IN*1..6]->(p:Product {name: $name})
     MATCH (ing)-[:CONTAINS_ALLERGEN]->(a:Allergen)
     WITH a, ing, length(path) AS depth
     RETURN a.name                    AS allergen,
            min(depth)                AS minDepth,
            collect(DISTINCT ing.name) AS viaIngredients,
            min(depth) = 1            AS isDeclaredDirectly
     ORDER BY minDepth ASC, allergen ASC`,
    { name },
  );
}

export function listProducts(): Promise<ProductListRow[]> {
  return runQuery<ProductListRow>(
    `MATCH (p:Product)
     OPTIONAL MATCH (i:Ingredient)-[:USED_IN]->(p)
     OPTIONAL MATCH (c:Product)-[:USED_IN]->(p)
     OPTIONAL MATCH (p)-[:SOLD_AT]->(s:Store)
     RETURN p.name      AS name,
            p.brand     AS brand,
            p.batchCode AS batchCode,
            p.category  AS category,
            count(DISTINCT i) AS ingredientCount,
            count(DISTINCT c) AS componentCount,
            count(DISTINCT s) AS storeCount
     ORDER BY p.category ASC, p.name ASC`,
  );
}

export function listIngredients(): Promise<IngredientOption[]> {
  return runQuery<IngredientOption>(
    `MATCH (i:Ingredient)
     OPTIONAL MATCH (i)-[:CONTAINS_ALLERGEN]->(a:Allergen)
     RETURN i.name     AS name,
            i.category AS category,
            collect(DISTINCT a.name) AS allergens
     ORDER BY name`,
  );
}

async function findMissing(
  label: "Ingredient" | "Product" | "Store" | "Allergen",
  wanted: string[],
) {
  if (wanted.length === 0) return [];
  const found = await runQuery<{ name: string }>(
    `UNWIND $names AS name
     MATCH (n:${label} {name: name})
     RETURN n.name AS name`,
    { names: wanted },
  );
  const present = new Set(found.map((r) => r.name));
  return wanted.filter((name) => !present.has(name));
}

export async function ingredientExists(name: string): Promise<boolean> {
  const rows = await runQuery<{ name: string }>(
    `MATCH (i:Ingredient {name: $name}) RETURN i.name AS name`,
    { name },
  );
  return rows.length > 0;
}

export async function createIngredient(
  input: CreateIngredientInput,
): Promise<CreateIngredientResult> {
  const missing = await findMissing("Allergen", input.allergens);
  if (missing.length > 0) {
    throw new Error(`Unknown allergen ${missing.map((n) => `"${n}"`).join(", ")}`);
  }

  await runInTransaction([
    {
      cypher: `MERGE (i:Ingredient {name: $name}) SET i.category = $category`,
      params: { name: input.name, category: input.category },
    },
    {
      cypher: `UNWIND $allergens AS allergenName
               MATCH (a:Allergen   {name: allergenName})
               MATCH (i:Ingredient {name: $name})
               MERGE (i)-[:CONTAINS_ALLERGEN]->(a)`,
      params: { allergens: input.allergens, name: input.name },
    },
  ]);

  return { name: input.name, category: input.category, allergens: input.allergens };
}

export function productDependents(name: string): Promise<string[]> {
  return runQuery<{ product: string }>(
    `MATCH (p:Product {name: $name})-[:USED_IN]->(dependent:Product)
     RETURN DISTINCT dependent.name AS product
     ORDER BY product`,
    { name },
  ).then((rows) => rows.map((r) => r.product));
}

export async function deleteProduct(name: string): Promise<void> {

  await runInTransaction([
    { cypher: `MATCH (p:Product {name: $name}) DETACH DELETE p`, params: { name } },
  ]);
}

export async function productExists(name: string): Promise<boolean> {
  const rows = await runQuery<{ name: string }>(
    `MATCH (p:Product {name: $name}) RETURN p.name AS name`,
    { name },
  );
  return rows.length > 0;
}

export async function createProduct(input: CreateProductInput): Promise<CreateProductResult> {
  const ingredientNames = input.ingredients.map((i) => i.name);
  const componentNames = input.components.map((c) => c.name);

  const missing = [
    ...(await findMissing("Ingredient", ingredientNames)).map((n) => `ingredient "${n}"`),
    ...(await findMissing("Product", componentNames)).map((n) => `product "${n}"`),
    ...(await findMissing("Store", input.stores)).map((n) => `store "${n}"`),
  ];

  if (missing.length > 0) {
    throw new Error(`Unknown ${missing.join(", ")}`);
  }

  const existing = await runQuery<{ name: string }>(
    `MATCH (p:Product {name: $name}) RETURN p.name AS name`,
    { name: input.name },
  );
  const created = existing.length === 0;

  await runInTransaction([
    {

      cypher: `MERGE (p:Product {name: $name})
               SET p.brand = $brand, p.batchCode = $batchCode, p.category = $category`,
      params: {
        name: input.name,
        brand: input.brand,
        batchCode: input.batchCode,
        category: input.category,
      },
    },
    {
      cypher: `UNWIND $rows AS row
               MATCH (i:Ingredient {name: row.name})
               MATCH (p:Product    {name: $product})
               MERGE (i)-[r:USED_IN]->(p)
               SET r.quantity = row.quantity`,
      params: { rows: input.ingredients, product: input.name },
    },
    {
      cypher: `UNWIND $rows AS row
               MATCH (c:Product {name: row.name})
               MATCH (p:Product {name: $product})
               MERGE (c)-[r:USED_IN]->(p)
               SET r.quantity = row.quantity`,
      params: { rows: input.components, product: input.name },
    },
    {
      cypher: `UNWIND $names AS storeName
               MATCH (s:Store   {name: storeName})
               MATCH (p:Product {name: $product})
               MERGE (p)-[r:SOLD_AT]->(s)
               SET r.since = $since`,
      params: {
        names: input.stores,
        product: input.name,
        since: new Date().toISOString().slice(0, 10),
      },
    },
  ]);

  return {
    name: input.name,
    created,
    ingredientCount: input.ingredients.length,
    componentCount: input.components.length,
    storeCount: input.stores.length,
  };
}

export function listSuppliers(): Promise<SupplierOption[]> {
  return runQuery<SupplierOption>(
    `MATCH (s:Supplier)
     RETURN s.name AS name, s.country AS country, s.certification AS certification
     ORDER BY name`,
  );
}

export function getSupplierReach(supplierName: string): Promise<SupplierReachRow[]> {
  return runQuery<SupplierReachRow>(
    `MATCH (sup:Supplier {name: $supplierName})-[:SUPPLIES]->(ing:Ingredient)
     MATCH path = (ing)-[:USED_IN*1..6]->(p:Product)
     WITH ing, p, path, length(path) AS hops
     ORDER BY hops ASC
     WITH ing, p,
          min(hops)                                  AS hops,
          head(collect([n IN nodes(path) | n.name])) AS chain
     OPTIONAL MATCH (p)-[:SOLD_AT]->(s:Store)
     RETURN ing.name AS ingredient,
            p.name   AS product,
            p.brand  AS brand,
            hops,
            chain,
            collect(DISTINCT s.name) AS stores,
            count(DISTINCT s)        AS storeCount
     ORDER BY storeCount DESC, hops ASC, product ASC`,
    { supplierName },
  );
}

export function getTraceToStore(
  supplierName: string,
  storeName: string,
): Promise<TraceRoute[]> {
  return runQuery<TraceRoute>(
    `MATCH (sup:Supplier {name: $supplierName})
     MATCH (st:Store {name: $storeName})
     MATCH path = shortestPath((sup)-[:SUPPLIES|USED_IN|SOLD_AT*1..10]->(st))
     RETURN DISTINCT length(path) AS hops, [n IN nodes(path) | n.name] AS chain
     ORDER BY hops ASC`,
    { supplierName, storeName },
  );
}

export function getSupplierConcentration(): Promise<SupplierRiskRow[]> {
  return runQuery<SupplierRiskRow>(
    `MATCH (sup:Supplier)-[:SUPPLIES]->(ing:Ingredient)
     OPTIONAL MATCH (ing)-[:USED_IN*1..6]->(p:Product)
     OPTIONAL MATCH (p)-[:SOLD_AT]->(st:Store)
     RETURN sup.name          AS supplier,
            sup.country       AS country,
            sup.certification AS certification,
            count(DISTINCT ing) AS ingredientCount,
            count(DISTINCT p)   AS productsAffected,
            count(DISTINCT st)  AS storesAffected
     ORDER BY storesAffected DESC, productsAffected DESC`,
  );
}

export function getCriticalIngredients(limit = 10): Promise<CriticalIngredientRow[]> {
  return runQuery<CriticalIngredientRow>(
    `MATCH (ing:Ingredient)-[:USED_IN*1..6]->(p:Product)
     OPTIONAL MATCH (p)-[:SOLD_AT]->(s:Store)
     RETURN ing.name     AS ingredient,
            ing.category AS category,
            count(DISTINCT p) AS productCount,
            count(DISTINCT s) AS storeCount
     ORDER BY productCount DESC, storeCount DESC
     LIMIT $limit`,

    { limit: Math.trunc(limit) },
  );
}

export function search(term: string): Promise<SearchResult[]> {
  return runQuery<SearchResult>(
    `MATCH (n)
     WHERE (n:Product OR n:Ingredient OR n:Supplier OR n:Store OR n:Recall OR n:Allergen)
       AND toLower(coalesce(n.name, n.id, '')) CONTAINS toLower($term)
     RETURN head(labels(n)) AS type,
            coalesce(n.name, n.id) AS name,
            coalesce(n.brand, n.category, n.country, n.chain, n.severity, '') AS detail
     ORDER BY type ASC, name ASC
     LIMIT 25`,
    { term },
  );
}

export function listStores(): Promise<StoreOption[]> {
  return runQuery<StoreOption>(
    `MATCH (s:Store)
     RETURN s.name AS name, s.chain AS chain, s.city AS city
     ORDER BY chain ASC, city ASC, name ASC`,
  );
}
