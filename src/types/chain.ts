export type ChainKind = "supplier" | "ingredient" | "product" | "store" | "allergen";

export type ChainStep = {
  label: string;
  kind: ChainKind;

  href?: string;
};
