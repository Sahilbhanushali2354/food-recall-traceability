import type { ChainKind, ChainStep } from "@/types";

export type { ChainKind, ChainStep };

export function toChainSteps(
  chain: string[],
  options: { start?: ChainKind; end?: ChainKind } = {},
): ChainStep[] {
  const { start = "ingredient", end = "product" } = options;

  return chain.map((label, index) => {
    const isFirst = index === 0;
    const isLast = index === chain.length - 1;

    const kind: ChainKind = isFirst ? start : isLast ? end : "product";

    return {
      label,
      kind,
      href: kind === "product" ? `/products/${encodeURIComponent(label)}` : undefined,
    };
  });
}

export function toTraceSteps(chain: string[]): ChainStep[] {
  return chain.map((label, index) => {
    const kind: ChainKind =
      index === 0
        ? "supplier"
        : index === 1
          ? "ingredient"
          : index === chain.length - 1
            ? "store"
            : "product";

    return {
      label,
      kind,
      href: kind === "product" ? `/products/${encodeURIComponent(label)}` : undefined,
    };
  });
}

export function stepLabel(steps: number): string {
  return `${steps} ${steps === 1 ? "step" : "steps"} away`;
}

export function depthLabel(depth: number): string {
  if (depth <= 1) return "In the recipe";
  return `${depth} layers deep`;
}

export function countLabel(n: number, singular: string, plural = `${singular}s`): string {
  return `${n} ${n === 1 ? singular : plural}`;
}
