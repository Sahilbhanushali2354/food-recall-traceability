import { listSuppliers, listStores } from "@/lib/queries";
import { handle } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    const [suppliers, stores] = await Promise.all([listSuppliers(), listStores()]);
    return { suppliers, stores };
  });
}
