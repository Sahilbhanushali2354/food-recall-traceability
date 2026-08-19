import { getSupplierConcentration, getCriticalIngredients } from "@/lib/queries";
import { handle } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    const [suppliers, ingredients] = await Promise.all([
      getSupplierConcentration(),
      getCriticalIngredients(10),
    ]);
    return { suppliers, ingredients };
  });
}
