import { getSupplierReach } from "@/lib/queries";
import { handle, apiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!name) return apiError("bad_request", "A supplier name is required.");

  return handle(() => getSupplierReach(decodeURIComponent(name)));
}
