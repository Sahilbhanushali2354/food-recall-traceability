import {
  getProduct,
  getProductOrigins,
  getProductAllergens,
  productExists,
  productDependents,
  deleteProduct,
} from "@/lib/queries";
import { handle, apiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name: raw } = await params;
  if (!raw) return apiError("bad_request", "A product name is required.");
  const name = decodeURIComponent(raw);

  try {
    if (!(await productExists(name))) return apiError("not_found");

    const dependents = await productDependents(name);
    if (dependents.length > 0) {
      const isOne = dependents.length === 1;
      return apiError(
        "conflict",
        `Can't delete this — ${dependents.join(", ")} ${isOne ? "is" : "are"} made from it. Delete ${isOne ? "that" : "those"} first.`,
      );
    }

    await deleteProduct(name);
    return Response.json({ name, deleted: true });
  } catch (error) {
    return handle(() => Promise.reject(error));
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name: raw } = await params;
  if (!raw) return apiError("bad_request", "A product name is required.");
  const name = decodeURIComponent(raw);

  return handle(
    async () => {

      const [productRows, origins, allergens] = await Promise.all([
        getProduct(name),
        getProductOrigins(name),
        getProductAllergens(name),
      ]);

      const product = productRows[0];
      if (!product) return null;

      return {
        product: {
          ...product,

          stores: product.stores.filter((s) => s && s.name),
        },
        origins,
        allergens,
      };
    },
  );
}
