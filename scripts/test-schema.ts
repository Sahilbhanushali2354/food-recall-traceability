import { buildCreateProductSchema, createProductSchema } from "../src/schemas/product.ts";

let failures = 0;
const check = (label: string, ok: boolean, detail = "") => {
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${label}${detail ? `  — ${detail}` : ""}`);
};

const valid = {
  name: "  test bar  ",
  brand: "Acme",
  category: "bar",
  ingredients: [{ name: "cane sugar", quantity: "200 g/kg" }],
  components: [],
  stores: ["FreshMart Andheri"],
};

console.log("\nhappy path");
const ok = createProductSchema.safeParse(valid);
check("valid input parses", ok.success, ok.success ? "" : JSON.stringify(ok.error.issues));
check("name is trimmed", ok.success && ok.data.name === "test bar", ok.success ? `"${ok.data.name}"` : "");
check("batchCode defaults to empty string", ok.success && ok.data.batchCode === "");

console.log("\nrejections");
const noName = createProductSchema.safeParse({ ...valid, name: "x" });
check("short name rejected", !noName.success, noName.success ? "" : noName.error.issues[0].message);

const noBrand = createProductSchema.safeParse({ ...valid, brand: "  " });
check("blank brand rejected", !noBrand.success, noBrand.success ? "" : noBrand.error.issues[0].message);

const badCategory = createProductSchema.safeParse({ ...valid, category: "nonsense" });
check("unknown category rejected", !badCategory.success);

const emptyRecipe = createProductSchema.safeParse({ ...valid, ingredients: [], components: [] });
check(
  "empty recipe rejected on the ingredients field",
  !emptyRecipe.success && emptyRecipe.error.issues[0].path[0] === "ingredients",
  emptyRecipe.success ? "" : emptyRecipe.error.issues[0].message,
);

const selfRef = createProductSchema.safeParse({
  ...valid,
  name: "loop bar",
  components: [{ name: "loop bar", quantity: "1" }],
});
check(
  "self-reference rejected",
  !selfRef.success,
  selfRef.success ? "" : selfRef.error.issues[0].message,
);

console.log("\nduplicate-name factory");
const withExisting = buildCreateProductSchema(["Granola Bar"]);
const dup = withExisting.safeParse({ ...valid, name: "granola bar" });
check(
  "duplicate name rejected case-insensitively",
  !dup.success,
  dup.success ? "" : dup.error.issues[0].message,
);
const notDup = withExisting.safeParse({ ...valid, name: "brand new bar" });
check("non-duplicate accepted", notDup.success);

console.log(failures === 0 ? "\n✅ Schema verified.\n" : `\n❌ ${failures} failed.\n`);
process.exitCode = failures === 0 ? 0 : 1;
